"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed top-1/2 right-1/2 -translate-x-1/2 translate-y-1/2">
      <Loader2 className="animate-spin" size={20} />
    </div>
  );
}
