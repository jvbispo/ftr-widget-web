import { Minimize2 } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Button } from "../ui/Button";
import { UploadWidgetTittle } from "./Title";

export function UploadWidgetHeader() {
  return (
    <div className="w-full p-4 py-2 bg-white/2 border-zinc-800 border-b flex item-center justify-between">
     <UploadWidgetTittle />

      <Collapsible.Trigger asChild>
        <Button size="icon" className="mr-1">
          <Minimize2 strokeWidth={1.5} className="size-4"/>
        </Button>
      </Collapsible.Trigger>
      
    </div>
  )
}