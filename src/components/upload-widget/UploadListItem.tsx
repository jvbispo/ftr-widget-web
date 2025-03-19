import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import { Button } from "../ui/Button";
import * as Progress from "@radix-ui/react-progress";
import { motion } from "motion/react";
import { useUploads, type Upload } from "../../store/uploads";
import { formatFileSize } from "../../utils/formatBytes";
import { downloadUrl } from "../../utils/download-image";

interface UploadWidgetListeItemProps {
    upload: Upload;
    uploadId: string;
}

export function UploadWidgetListItem({ upload, uploadId }: UploadWidgetListeItemProps) {
    const { cancelUpload, retryUpload } = useUploads( state => state );

    const progress = Math.min( upload.compressedSizeInBytes ? Math.round( (upload.uploadSizeInBytes * 100 ) / upload.compressedSizeInBytes ) : 0, 100 );

    return (
        <motion.div
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            transition={{ duration: 0.3 }}
            className="p-3 rounded-lg flex flex-col gap-3 shadow-shape-content bg-white/2 relative overflow-hidden"
        >
            <div className="flex flex-col gap-1" >
                <span className="text-xs font-medium flex items-center gap-1">
                    <ImageUp className="size-3 text-zinc-300" strokeWidth={1.5}/>
                    <span className="max-width-[175px] truncate">{upload.name}</span>
                </span>
                
                <span className="text-xxs text-zinc-400 gap-1.5 flex items-center">
                    <span className="line-through">{formatFileSize(upload.file.size)}</span>
                    <div className="size-1 rounded-full bg-zinc-700"/>
                    <span>
                        {upload.compressedSizeInBytes ? formatFileSize(upload.compressedSizeInBytes) : "..."}
                        { upload.compressedSizeInBytes && (
                            <span className="text-green-400 ml-1">
                                -{Math.round( ( upload.originalSizeInBytes - upload.compressedSizeInBytes ) / upload.originalSizeInBytes )}%
                            </span>
                        ) }
                    </span>
                    <div className="size-1 roudned-full bg-zinc-700"/>
                    { upload.status === "success" && <span>100%</span> }
                   { upload.status === "progress" &&  <span>{progress}%</span> }
                   { upload.status === "error" &&  <span className="text-red-400">Error</span> }
                   { upload.status === "cancelled" &&  <span className="text-yelllow-400">Error</span> }
                </span>
            </div>
            <Progress.Root 
                data-status={upload.status}
                className="group bg-zinc-800 rounded-full h-1 overflow-hidden group"
            >
                <Progress.Indicator
                    className="
                        bg-indigo-500 h-1 group-data-[status=success]:bg-green-400
                        group-data-[status=error]:bg-red-400
                        group-data-[status=cancelled]:bg-yellow-400
                        transition-all
                    "
                    style={{ width: upload.status === "progress" ? "43%" : "100%" }}
                />
            </Progress.Root>
            <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                <Button
                    size="icon-sm"
                    asChild
                    aria-disabled={upload.status !== "success"}
                    onClick={() => upload.remoteUrl && downloadUrl(upload.remoteUrl)}>
                    <a>
                        <Download className="size-4" strokeWidth={1.5}/>
                        <span className="sr-only">Downdload compresssed image</span>
                    </a>
                </Button>

                <Button size="icon-sm" disabled={ !upload.remoteUrl } onClick={() => upload.remoteUrl && navigator.clipboard.writeText( upload.remoteUrl )} >
                    <Link2 className="size-4" strokeWidth={1.5}/>
                    <span className="sr-only">Copy Remote Url</span>
                </Button>

                <Button size="icon-sm" disabled={[ "cancelled", "error" ].includes( upload.status )} onClick={() => retryUpload(uploadId)}>
                    <RefreshCcw className="size-4" strokeWidth={1.5}/>
                    <span className="sr-only">Retry Upload</span>
                </Button>

                <Button disabled={upload.status !== "progress" } size="icon-sm" onClick={() => cancelUpload(uploadId)}>
                    <X className="size-4" strokeWidth={1.5}/>
                    <span className="sr-only">Cancel Upload</span>
                </Button>
            </div>
        </motion.div>
    )
}