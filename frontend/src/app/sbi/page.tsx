"use client";

import ImagesPanel from "#/components/images-panel";
import SearchControlMenu from "#/components/search-control-menu";
import { Separator } from "#/components/ui/separator";
import { Suspense } from "react";
import Loading from "../loading";
import { useAtom } from "jotai";
import { refImageAtom } from "#/lib/atoms";
import Image from "next/image";

export default function SearchByImage() {
  const [refImage] = useAtom(refImageAtom);
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-start w-full">
        <h3 className="text-2xl font-semibold">Search By Image</h3>
        <p className="text-xl">
          Revolutionize your image search experience by using our advanced
          system that allows you to find images based on a reference image.
          Simply upload a picture, and our technology intelligently identifies
          visual similarities, presenting you with a curated selection of
          related images. Effortlessly discover long lost content, all through
          the convenience of a single reference point. Unlock a new dimension of
          visual exploration with our intuitive image search by reference image.
        </p>
      </div>
      <div className="flex flex-col w-full items-center">
        <Separator className="my-4" />
        <SearchControlMenu mode="IMAGE" />
        <Separator className="my-4" />
      </div>
      <div className="flex justify-start items-center mt-5">
        {refImage && (
          <div className="h-96 w-72 mr-5 mb-5">
            <Image
              className="h-full w-full object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-125 hazard-border"
              src={refImage}
              alt={"Reference Image"}
              width={100}
              height={100}
            />
          </div>
        )}
        <Suspense fallback={<Loading />}>
          <ImagesPanel />
        </Suspense>
      </div>
    </div>
  );
}
