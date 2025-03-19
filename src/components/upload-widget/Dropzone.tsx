import { useDropzone } from "react-dropzone"
import CircularProgressBar from "../ui/CircularProgressBar";
import { motion } from "motion/react"; 
import { usePendingUploads, useUploads } from "../../store/uploads";

export function UploadWidgetDropzone() {
    const { addUploads } = useUploads();
    const uploadsSize = useUploads( state => state.uploads.size );
    const { globalPercentage, isThereAnyPendingUpload } = usePendingUploads()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: true,
        accept: {
            "image/jpeg": [],
            "image/png": []
        },
        onDrop: (acceptedFiles) => {
            addUploads( acceptedFiles );
        }
    })

    return (
        <motion.div
            className="px-3 flex flex-col gap-3"
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            transition={{ duration: 0.3 }}
        >
            <div
                {...getRootProps()}
                data-active={isDragActive}
                className="cursor-pointer text-zinc-400 bg-black-400 p-5 rounded-lg border border-zinc-700 border-dashed h-32 flex flex-col items-center justify-center gap-1 hover:border-zinc-600 transition:colors data-[active=true]:bg-indigo-500/10 data-[active=true]:border-indigo-500"
            >
                <input type="file" {...getInputProps()} />

                {isThereAnyPendingUpload ? (
                    <div className="flex flex-col gap-2.5 items-center">
                        <CircularProgressBar strokeWidth={4} progress={globalPercentage} size={56} />
                        <span className="text-xs">Uploading {uploadsSize} files...</span>
                    </div>
                ) : (
                    <>
                        <span>Drop your files here or..</span>
                        <span>click to open picket</span>
                    </>
                )}
            </div>



            <span className="text-sm text-zinc-400 ">only PNG and JPG files are supported.</span>
        </motion.div>
    )
}