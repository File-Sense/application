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

export interface SearchByTextAndImageResponse extends GeneralApiResponse {
  data?: string[];
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
