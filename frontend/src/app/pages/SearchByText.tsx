import SearchControlMenu from "#/components/search-control-menu";
import { Separator } from "#/components/ui/separator";
import ImagesPanel from "#/components/images-panel";
import { useAtom } from "jotai";
import { fetchedPathsAtom } from "#/lib/atoms";
import { useEffect } from "react";

export default function SearchByText() {
  const [, setFetchedPaths] = useAtom(fetchedPathsAtom);
  useEffect(() => {
    setFetchedPaths(null);
  }, [setFetchedPaths]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-start w-full">
        <h3 className="text-2xl font-semibold">Search By Text</h3>
        <p className="text-xl">
          Explore the power of visual search with our innovative image retrieval
          system based on textual meaning. Effortlessly find the perfect images
          by describing what you're looking for in words. Our cutting-edge
          technology interprets and matches your textual queries to deliver
          precise and relevant visual results. Simplify your search experience
          and discover the images that speak to your desired concepts, all with
          the ease of descriptive language.
        </p>
      </div>
      <div className="flex flex-col w-full items-center">
        <Separator className="my-4" />
        <SearchControlMenu mode="TEXT" />
      </div>
      <div className="flex justify-center mt-5">
        <ImagesPanel />
      </div>
    </div>
  );
}
