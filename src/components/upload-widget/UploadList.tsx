import { useUploads } from "../../store/uploads";
import { UploadWidgetListItem } from "./UploadListItem";
import * as ScrollArea from "@radix-ui/react-scroll-area";

export function UploadWidgetList() {
  const uploads = useUploads( store => store.uploads );
  const isUploadListEmpty = uploads.size === 0;


  return (
    <div className="px-3 flex flex-col gap-3">
      <span className="text-xs font-medium">
        uploaded files { " " }
        <span className="text-zinc-400">({uploads.size})</span>
      </span>

      <ScrollArea.Root className="overflow-hidden" type="scroll">
        <ScrollArea.Viewport className="h-[200px]">
          {isUploadListEmpty ? ( 
            <span className="text-xs text-zinc-400">No Uploads added</span>
          ) : (
            <div className="flex flex-col gap-2">
              { Array.from( uploads.entries() ).map( ( [ uploadId, upload ] ) => {
                return <UploadWidgetListItem key={uploadId} upload={upload} uploadId={uploadId} />
              } ) }
              
            </div>
          )}
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          className="ScrollAreaScrollbar"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      
    </div>
  )
}