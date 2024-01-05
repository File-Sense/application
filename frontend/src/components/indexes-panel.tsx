import { useQuery } from "@tanstack/react-query";
import IndexComponent from "./index-component";
import { ScrollArea } from "./ui/scroll-area";
import { getIndexes } from "#/functions/apiFunctions";
import { toast } from "sonner";

export default function IndexesPanel() {
  const { data: indexData, isError } = useQuery({
    queryKey: ["getAllIndexes"],
    queryFn: getIndexes,
    refetchInterval: (query) =>
      query.state.data?.data.every((index) => index.index_status === 0)
        ? false
        : 2000,
  });

  if (isError) {
    toast.error("Failed to fetch indexes");
  }

  return (
    <ScrollArea className="h-[300px] lg:h-[600px] w-[100%] rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Index List</h4>
        {indexData &&
          indexData.data.map((index) => {
            return <IndexComponent key={index.id} data={index} />;
          })}
      </div>
    </ScrollArea>
  );
}
