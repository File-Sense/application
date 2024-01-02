"use client";

import ImageComponent from "./image-component";
import { ScrollArea } from "./ui/scroll-area";

export default function ImagesPanel() {
  return (
    <ScrollArea className="max-h-64 lg:max-h-[500px] rounded-md border">
      <div className="flex flex-col w-full items-center p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Search Results
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          <ImageComponent imageObjUrl="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" />
        </div>
      </div>
    </ScrollArea>
  );
}
