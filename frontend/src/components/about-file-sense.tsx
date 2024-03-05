import { useAtom } from "jotai";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { aboutFileSenseDialogStateAtom, versionAtom } from "#/lib/atoms";
import { open as tauriOpen } from "@tauri-apps/api/shell";
import { toast } from "sonner";

export default function AboutFileSense() {
  const [open, setOpen] = useAtom(aboutFileSenseDialogStateAtom);
  const [{ data }] = useAtom(versionAtom);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">About File Sense</DialogTitle>
          <DialogDescription>
            <div className="my-3 text-base font-medium">
              {/* This Application is the result of a final year project by Pasindu
              Akalpa, a student of Informatics Institute of Sri Lanka, during
              the academic year 2023 - 2024. The aim of this Application is to
              showcase the application of Vector Database in desktop search
              engines and Deep learning.
              <br /> The Application is designed for educational and evaluation
              purposes only. */}
              This Application is the brainchild of Pasindu Akalpa, a brilliant
              student of Informatics Institute of Sri Lanka, who created it as
              his final year project in 2023 - 2024. The goal of this
              Application is to show off the power of Vector Database and Deep
              learning in making desktop search engines super awesome.
              <br /> The Application is meant for learning and testing only, so
              don't blame us if it breaks your computer or deletes your files.
              Just kidding, it won't do that. Probably 🤞.
            </div>
            <div className="text-lg font-medium mt-2">
              Version: {data || "Loading..."}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              toast.promise(tauriOpen("https://github.com/File-Sense"), {
                loading: "Opening Org on GitHub",
                success: "Opened Org on GitHub",
                error: "Failed to open Repo on GitHub",
              });
            }}
          >
            Open Org on GitHub
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              toast.promise(tauriOpen("https://github.com/pAkalpa"), {
                loading: "Opening Developer Github Profile",
                success: "Opened Developer Profile on Github",
              });
            }}
          >
            Developer Profile on Github
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
