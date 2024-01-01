"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDownIcon, CheckIcon, FolderSearch } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";
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
import { Textarea } from "#/components/ui/textarea";
import { Slider } from "#/components/ui/slider";

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

const FormSchema = z.object({
  index: z.string({
    required_error: "Please select an index.",
  }),
  searchPhrase: z.string().min(10, {
    message: "Search Phrase must be at least 10 characters.",
  }),
  nor: z.number().min(1).max(25).default(3),
});

export default function TestPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nor: 3,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("🚀 ~ file: page.tsx:56 ~ onSubmit ~ data:", data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-4 w-full justify-center"
      >
        <div className="flex flex-col gap-4 lg:w-[60%]">
          <div className="flex flex-row gap-4 w-full items-start">
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
            <FormField
              control={form.control}
              name="searchPhrase"
              render={({ field }) => (
                <FormItem className="max-h-10 w-full">
                  <FormLabel>Search Phrase</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain Image (Image Content or Any Specific Scenario) Here..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
