import Loading from "#/components/loading";
import SearchControlMenuMetadataSearch from "#/components/search-control-menu-metadata-search";
import { volumeDataAtom } from "#/lib/atoms";
import { MetadataSearchSchema } from "#/lib/types";
import { useAtom } from "jotai";

export default function SearchByMetadata() {
  const [{ data, isLoading }] = useAtom(volumeDataAtom);
  // const [] = useQuery({
  //   queryKey: ["searchFilesAndDirectories"],
  // });

  if (isLoading) {
    return <Loading />;
  }

  const onSubmit = async (data: MetadataSearchSchema) => {
    console.log("🤬 ~ const ~ data:", data);
  };

  return (
    <div>
      <SearchControlMenuMetadataSearch drives={data!} onSubmit={onSubmit} />
    </div>
  );
}
