import { useCopyToClipboard } from "#/lib/hooks/useCopyToClipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function CopyAction({ text }: { text: string }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) {
      return;
    }
    copyToClipboard(text);
  };

  return (
    <div className="flex items-center transition-opacity group-hover:opacity-100 ml-2">
      <Button
        variant="ghost"
        size="icon"
        className="w-h-6 h-6"
        onClick={onCopy}
      >
        {isCopied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  );
}
