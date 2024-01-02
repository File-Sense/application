"use client";

import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import {
  FolderSearch,
  ChevronsUpDownIcon,
  CheckIcon,
  RotateCwIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "#/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";
import {
  OpenImageReturnObject,
  imageSearchSchema,
  searchControlSchemas,
  textSearchSchema,
} from "#/lib/types";
import { Input } from "./ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { openImageFile } from "#/functions/tauriFunctions";
import { useState } from "react";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

export default function SearchControlMenu({
  mode,
}: {
  mode: "TEXT" | "IMAGE";
}) {
  const queryClient = useQueryClient();
  const { isFetching } = useQuery({
    queryKey: ["openImageFile"],
    queryFn: openImageFile,
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const [imageObj, setImageObj] = useState<OpenImageReturnObject | undefined>();
  const form = useForm<searchControlSchemas>({
    resolver: zodResolver(
      mode === "TEXT" ? textSearchSchema : imageSearchSchema
    ),
    defaultValues: {
      nor: 3,
    },
    mode: "all",
  });
  function onSubmit(data: searchControlSchemas) {
    console.log("🚀 ~ file: page.tsx:56 ~ onSubmit ~ data:", data);
  }

  const openImage = async () => {
    const imageObj = await queryClient.fetchQuery({
      queryKey: ["openImageFile"],
      queryFn: openImageFile,
    });
    if (!imageObj) {
      return;
    }
    form.setValue("refImage", imageObj.imageName);
    setImageObj((prevImgObj) => {
      if (prevImgObj) {
        URL.revokeObjectURL(prevImgObj.imageObjectUrl);
      }
      return imageObj;
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-4 w-full justify-center my-5"
      >
        <div className="flex flex-col gap-4 lg:w-[60%]">
          <div className="flex flex-row gap-4 w-full items-start ">
            <FormField
              control={form.control}
              name="index"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Index to Search within</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : "Select Index"}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue("index", language.value);
                              }}
                            >
                              {language.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  language.value === field.value
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
                  <FormDescription>
                    This is the index that use for search images.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === "TEXT" ? (
              <FormField
                control={form.control}
                name="searchPhrase"
                render={({ field }) => (
                  <FormItem className="max-h-10 w-full">
                    <FormLabel>Search Phrase</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain Image Here... (Image Content or Any Specific Scenario)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="refImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Image</FormLabel>
                    <FormControl>
                      <div
                        onClick={openImage}
                        className="cursor-pointer text-muted-foreground dark:hover:bg-slate-800 dark:hover:text-slate-50 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                      >
                        <div className="flex flex-row">
                          <span className="flex items-center font-semibold">
                            Choose Image: &nbsp;
                            {isFetching && (
                              <RotateCwIcon className="h-4 w-4 animate-spin" />
                            )}
                          </span>
                          {imageObj &&
                            !isFetching &&
                            `${imageObj?.imageName}.${imageObj?.imageExtension}`}
                        </div>
                        <Input className="hidden" type="text" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col w-full">
              <FormField
                control={form.control}
                name="nor"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Number of Results: {value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={25}
                        step={1}
                        defaultValue={[value]}
                        value={[form.getValues("nor")]}
                        onValueChange={(vals) => {
                          onChange(vals[0]);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
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
