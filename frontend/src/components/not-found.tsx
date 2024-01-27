import { Button } from "#/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="w-screen h-screen justify-center flex items-center">
      <div className="flex gap-10 ">
        <div className="text-center text-4xl font-bold text-white pt-20">
          <div className="text-primary-500 text-8xl">404</div>
          <div>Not Found!</div>
          <Link to="/" replace>
            <Button color="primary" className="mt-7">
              <ArrowBigLeft />
              back to Home
            </Button>
          </Link>
        </div>
        {/* <div className="bg-[url('/notfound.png')] bg-cover bg-center w-[30vw] h-[50vh] opacity-50"></div> */}
      </div>
    </div>
  );
}
