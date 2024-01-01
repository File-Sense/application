import SearchControlMenu from "#/components/search-control-menu";
import { Separator } from "#/components/ui/separator";

export default function SearchByText() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-start w-full">
        <h3 className="text-2xl font-semibold">Search By Text</h3>
        <p className="text-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa numquam
          minus tempora doloribus omnis ipsam provident voluptatem quis sint
          dicta, porro, error eos aut eius iste enim commodi praesentium illo!
        </p>
      </div>
      <div className="flex flex-col w-full items-center">
        <Separator className="my-4" />
        <SearchControlMenu mode="IMAGE" />
      </div>
    </div>
  );
}
