import * as Collapsible from "@radix-ui/react-collapsible";
import { UploadWidgetDropzone } from "./Dropzone";
import { UploadWidgetHeader } from "./Header";
import { UploadWidgetList } from "./UploadList";
import { UploadWidgetMinimizedButton } from "./MinimizedButton";
import { motion, useCycle } from "motion/react";
import { usePendingUploads } from "../../store/uploads";


export function UploadWidget() {
  const { isThereAnyPendingUpload } = usePendingUploads();
  const [ isWidgetOpen, toggleWidgetOpen ] = useCycle(false, true);
  

  return (
    <Collapsible.Root onOpenChange={() => toggleWidgetOpen( )} asChild>
      <motion.div
        className="bg-zinc-900 max-w-[360px] rounded-xl data-[state=open]:shadow-shape overflow-hidden boder border-transparent"
        data-progress={isThereAnyPendingUpload}
        animate={ isWidgetOpen ? "open" : "closed" }
        variants={{
          closed: {
            width: "max-content",
            height: 44,
            transition: {
              type: "inertia"
            }
          },
          open: {
            width: 360,
            height: "auto",
            transition: {
              durantion: 0.2
            }
          }
        }}
      >
        { !isWidgetOpen && <UploadWidgetMinimizedButton /> }
        <Collapsible.Content>
          <UploadWidgetHeader />

          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />

            <div className="h-px  bg-zinc-800 border-t border-black/50 box-content" />

            <UploadWidgetList />
          </div>

        </Collapsible.Content>
      </motion.div>
    </Collapsible.Root>

  )
}
