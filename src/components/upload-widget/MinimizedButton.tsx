import * as Collapsible from '@radix-ui/react-collapsible';
import { Maximize2 } from 'lucide-react';
import { UploadWidgetTittle } from './Title';

export function UploadWidgetMinimizedButton() {
    return (
        <Collapsible.Trigger className='group w-full bg-white/2 py-3 px-5 flex items-center justify-between gap-5'>
             <UploadWidgetTittle />
             <Maximize2 strokeWidth={1.5} className="size-4 group-hover:text-zinc-100"/>
        </Collapsible.Trigger>
    )
}