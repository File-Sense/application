"use client";

import {
  GetAllIndexesResponse,
  GetIndexStatusResponse,
  IHttpFunction,
  IndexDirectoryResponse,
  PingResponse,
  ISearchByText,
  SearchByTextAndImageResponse,
  ISearchByImage,
} from "#/lib/types";
import { httpFunction } from "./httpFunctions";

export const ping = async (): Promise<PingResponse> => {
  const config: IHttpFunction = {
    request: "/ping",
  };
  const data = await httpFunction(config);
  return data;
};

export const indexDirectory = async (
  directoryPath: string
): Promise<IndexDirectoryResponse> => {
  const config: IHttpFunction = {
    request: "/common/index_directory",
    method: "POST",
    body: JSON.stringify({
      dir_path: directoryPath,
    }),
  };
  const data = await httpFunction(config);
  return data;
};

export const getIndexes = async (): Promise<GetAllIndexesResponse> => {
  const config: IHttpFunction = {
    request: "/database/get_all_index",
  };
  const data = await httpFunction(config);
  return data;
};

export const getIndexStatus = async (
  indexId: string
): Promise<GetIndexStatusResponse> => {
  const config: IHttpFunction = {
    request: "/database/get_index_status",
    params: [indexId],
  };
  const data = await httpFunction(config);
  return data;
};

export const searchByText = async (
  searchData: ISearchByText
): Promise<SearchByTextAndImageResponse> => {
  const config: IHttpFunction = {
    request: "/common/search_by_text",
    query: { ...searchData },
  };
  const data = await httpFunction(config);
  return data;
};

export const searchByImage = async ({
  ref_image,
  ...searchData
}: ISearchByImage): Promise<SearchByTextAndImageResponse> => {
  const config: IHttpFunction = {
    request: "/common/search_by_image",
    method: "POST",
    body: ref_image,
    query: { ...searchData },
    headers: {},
  };
  const data = await httpFunction(config);
  return data;
};

export const deleteIndex = async (indexId: string): Promise<void> => {
  const config: IHttpFunction = {
    request: "/common/delete_index",
    method: "DELETE",
    query: { index_id: indexId },
  };
  await httpFunction(config);
};
