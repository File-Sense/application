"use client";

import { IHttpFunction } from "#/lib/types";
const BASE_URL = "http://127.0.0.1:5000/api";
const paramsToUrl = (params: string[]): string => {
  if (params.length === 1) {
    return `/${params[0]}`;
  } else {
    let url = "";
    for (let i = 0; i < params.length; i++) {
      url += `/${params[i]}`;
    }
    return url;
  }
};

const queryToUrl = (query: {
  [key: string]: string | number | undefined;
}): string => {
  let url = "?";
  for (const key in query) {
    if (!query[key]) {
      url += `${key}=${query[key]}&`;
    }
  }
  return url.slice(0, -1);
};

export const httpFunction = async (
  requestConfig: IHttpFunction
): Promise<any> => {
  const { request, params, query, body, method } = requestConfig;
  const url =
    BASE_URL +
    request +
    (params ? paramsToUrl(params) : "") +
    (query ? queryToUrl(query) : "");
  const response = await fetch(url, {
    method: method || "GET",
    body: body || null,
    next: {
      revalidate: 0,
    },
  });
  if (!response.ok) {
    throw new Error("HTTP Error: " + response.status);
  }
  const data = await response.json();
  return data;
};
