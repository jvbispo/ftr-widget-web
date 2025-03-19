import { UploadCloud } from "lucide-react";
import { usePendingUploads } from "../../store/uploads";

export function UploadWidgetTittle() {
    const { globalPercentage, isThereAnyPendingUpload } = usePendingUploads()


    return (
        <div className="flex items-center gap-1.5 text-sm font-medium">
            <UploadCloud className="size-4 text-zinc-400" strokeWidth={1.5}/>

            { isThereAnyPendingUpload ? (
                <span className="flex items-baseline gap-1">
                    Uploading
                    <span className="tex-xs text-zinc-400 tabular-nums">{globalPercentage}%</span>
                </span>
            ) : (
                <span className="text-sm font-medium">Upload files</span>
            ) }
        </div>
    )
}