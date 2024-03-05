import { Button } from "#/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function GlobalError() {
  return (
    <div className="w-screen h-screen justify-center flex items-center">
      <div className="flex gap-10 ">
        <div className="text-center text-4xl font-bold text-white pt-20">
          <div>Oops Something went Wrong!</div>
          <Link to="/" replace>
            <Button color="primary" className="mt-7">
              <ArrowBigLeft />
              Reset
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
