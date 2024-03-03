import { LucideIcon } from "lucide-react";
import * as z from "zod";

export interface PingResponse {
  ping: string;
}
interface GeneralApiResponse {
  error?: string;
}

type RangeType = -1 | 0 | 1;

export interface IndexData {
  index_id: string;
  index_path: string;
  index_status: RangeType;
  id: number;
}

export interface GetAllIndexesResponse extends GeneralApiResponse {
  data: IndexData[];
}

export interface GetIndexStatusResponse extends GeneralApiResponse {
  data?: number;
  status_name?: string;
}

export interface ISearchByText {
  index_name: string;
  limit?: number;
  search_string: string;
}

export interface ISearchByImage {
  index_name: string;
  limit?: number;
  ref_image: FormData;
}

export interface IndexDirectoryResponse extends GeneralApiResponse {
  index_id?: string;
}

export interface Data {
  img_paths: string[];
  img_distances: number[];
}

export interface SearchByTextAndImageResponse extends GeneralApiResponse {
  data?: Data;
}

export interface IHttpFunction {
  request: string;
  params?: string[];
  query?: { [key: string]: string | number | undefined };
  body?: BodyInit | null | undefined;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: { [key: string]: string };
}

export const textSearchSchema = z.object({
  index: z.string({
    required_error: "Please select an index.",
  }),
  searchPhrase: z
    .string()
    .min(10, {
      message: "Search Phrase must be at least 10 characters.",
    })
    .default(""),
  nor: z.number().min(1).max(25).default(3),
});

export const imageSearchSchema = z.object({
  index: z.string({
    required_error: "Please select an index.",
  }),
  refImage: z.string({
    required_error: "Image is required",
  }),
  nor: z.number().min(1).max(25).default(3),
});

export const metadataSearchSchema = z
  .object({
    mountPoint: z
      .string({
        required_error: "Please select a drive.",
      })
      .min(1),
    keyword: z
      .string({
        required_error: "Please enter a keyword.",
      })
      .min(1),
    extension: z.string().optional().default(""),
    acceptFiles: z.boolean().default(false),
    acceptDirs: z.boolean().default(false),
  })
  .refine(
    (data) =>
      data.acceptFiles ? data.extension && data.extension.length > 0 : true,
    {
      message: "Please enter a file extension.",
      path: ["extension"],
    }
  )
  .refine((data) => data.acceptFiles || data.acceptDirs, {
    message: "Either accept files or directories must be selected.",
    path: ["acceptFiles", "acceptDirs"],
  });

export type MetadataSearchSchema = z.infer<typeof metadataSearchSchema>;
type TextSearchSchema = z.infer<typeof textSearchSchema>;
type ImageSearchSchema = z.infer<typeof imageSearchSchema>;

export type searchControlSchemas = TextSearchSchema | ImageSearchSchema;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export interface OpenImageReturnObject {
  imageName: string;
  imageExtension: string;
  imageObjectUrl: string;
  imageBlob: Blob;
}

export interface OpenDirectoryReturnObject {
  directoryPath: string;
  directoryDisplayString: string;
  escapedDirectoryPath: string;
}

export interface VolumeData {
  name: string;
  mount_point: string;
}

export interface FileEntry {
  File: [string, string];
}

export interface DirectoryEntry {
  Directory: [string, string];
}

export type SearchEntry = FileEntry | DirectoryEntry;

export interface DirectoryContent {
  files_directories: SearchEntry[];
  search_time: string;
}

export interface ISearchByMetadata extends MetadataSearchSchema {
  searchDirectory: string;
}

export interface TreeData {
  id: string;
  name: string;
  icon?: LucideIcon;
  children?: TreeData[];
}
