import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer"
import { uploadFileToStorage } from "../components/http/upload-file-to-storage";
import { CanceledError } from "axios";
import { useShallow } from "zustand/react/shallow";
import { compressImage } from "../utils/compress-image";

export type Upload = {
    name: string;
    file: File;
    abortController?: AbortController;
    status: "progress" | "success" | "error" | "cancelled";
    uploadSizeInBytes: number;
    compressedSizeInBytes?: number;
    originalSizeInBytes: number;
    remoteUrl?: string;
}

export type UploadState = {
    uploads: Map<string, Upload>;
    addUploads: ( files: File[] ) => void;
    cancelUpload: ( uploadId: string ) => void;
    retryUpload: ( uploadId: string ) => void;
}

enableMapSet();

export const useUploads = create<UploadState, [ [ "zustand/immer", never ] ]>(immer( ( set, get ) => {
    async function updateUpload( uploadId: string, data: Partial<Upload> ) {
        const upload = get().uploads.get( uploadId );

        if( !upload ) {
            return;
        }

        set( state => {
            state.uploads.set( uploadId, {
                ...upload,
                ...data
            } )
        } )
    }
    
    async function processUpload( uploadId: string ) {
       
        const upload = get().uploads.get( uploadId );

        if( !upload) {
            return;
        }

        const abortController = new AbortController();

        updateUpload( uploadId, {
            uploadSizeInBytes: 0,
            status: "progress",
            compressedSizeInBytes: undefined,
            remoteUrl: undefined,
            abortController
        } );
        
        try {
            const compressedFile =  await compressImage( {
                file: upload.file,
                maxHeight: 1000,
                maxWidth: 1000,
                quality: 0.8
            } );

            updateUpload( uploadId, {
                compressedSizeInBytes: compressedFile.size
            } );

           const { url } =  await uploadFileToStorage( { 
                file: compressedFile,
                onProgress( sizeInBytes ) {
                    set( state => {
                        state.uploads.set( uploadId, {
                            ...upload,
                            uploadSizeInBytes: sizeInBytes
                        } )
                    } )
                }
            }, { signal: abortController?.signal } );

            updateUpload( uploadId, {
                status: "success",
                remoteUrl: url
            } );

        } catch ( err ) {
            let status: "error" | "cancelled";
            if( err instanceof CanceledError ) {
                status = "cancelled";
            } else {
                status = "error";
            }
            updateUpload( uploadId, {
                status
            } );
        } 
    }

    function addUploads( files: File[] ){
        for( const file of files ){
            const uploadId = crypto.randomUUID();

            const upload: Upload = {
                name: file.name,
                file,
                status: "progress",
                originalSizeInBytes: file.size,
                uploadSizeInBytes: 0
            }

            set( state => {
                state.uploads.set( uploadId, upload )
            } )

           

            processUpload( uploadId );
        }
    }

    function cancelUpload( uploadId: string ){
        const upload = get().uploads.get( uploadId );

        if( !upload) {
            return;
        }

        upload.abortController?.abort();

        updateUpload( uploadId, { status: "cancelled" } );
    }

    function retryUpload( uploadId: string ){
        processUpload( uploadId );
    }

    return {
        uploads: new Map(),
        addUploads,
        cancelUpload,
        retryUpload
    }
} ));

export const usePendingUploads = () => {
    return useUploads( useShallow( store => {
        const isThereAnyPendingUpload = Array.from( store.uploads.values() ).some( upload => upload.status === "progress" );

        if( !isThereAnyPendingUpload ) {
            return { isThereAnyPendingUpload, globalPercentage: 100 }
        }

        const { total, uploaded } = Array.from( store.uploads.values() ).reduce( ( acc, upload ) => {
            if( upload.compressedSizeInBytes ) {
                acc.uploaded += upload.uploadSizeInBytes;
               
            }

            acc.total += upload.compressedSizeInBytes || upload.originalSizeInBytes;
            return acc;
        }, { total: 0, uploaded: 0 } );

        const globalPercentage = Math.min( Math.round( ( uploaded * 100 ) / total ), 100 );

        return {
            isThereAnyPendingUpload,
            globalPercentage
        }
    } ) )
}