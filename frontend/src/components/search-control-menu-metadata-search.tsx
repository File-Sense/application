import { useForm } from "react-hook-form";
import {
  MetadataSearchSchema,
  SearchEntry,
  VolumeData,
  metadataSearchSchema,
} from "#/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CheckIcon, ChevronsUpDownIcon, FolderSearch } from "lucide-react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { cn } from "#/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch } from "react";
import { openDirectoryContent } from "#/functions/tauriFunctions";

export default function SearchControlMenuMetadataSearch({
  drives,
  onSubmit,
  setDirectoryContent,
}: {
  drives: VolumeData[];
  onSubmit: (data: MetadataSearchSchema) => void;
  setDirectoryContent: Dispatch<SearchEntry[] | undefined>;
}) {
  const form = useForm<MetadataSearchSchema>({
    mode: "all",
    resolver: zodResolver(metadataSearchSchema),
  });

  const driveList = drives.map((d) => ({
    value: d.mount_point,
    label: `${d.name}: ${d.mount_point}`,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="mountPoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Drive to Search within</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className="">
                      {field.value
                        ? driveList.find((f) => f.value === field.value)?.label
                        : "Select Drive"}
                      <ChevronsUpDownIcon className="opacity-50 shrink-0" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Index..."
                      className="h-9"
                    />
                    <CommandEmpty>No Index found.</CommandEmpty>
                    <CommandGroup>
                      {driveList.map((d) => (
                        <CommandItem
                          value={d.value}
                          key={d.value}
                          onSelect={async () => {
                            form.setValue("mountPoint", d.value);
                            const data = await openDirectoryContent(d.value);
                            setDirectoryContent(data);
                          }}
                        >
                          {d.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              d.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search Keyword</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="extension"
          render={({ field }) => (
            <FormItem>
              <FormLabel>extension</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptFiles"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              {/* <FormMessage /> */}
              <FormLabel>Search Files</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptDirs"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              {/* <FormMessage /> */}
              <FormLabel>Search Folders</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex flex-col justify-center">
          <Button type="submit" className="gap-2">
            Search
            <FolderSearch className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
