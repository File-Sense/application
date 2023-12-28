"use client";
import { PingResponse } from "#/lib/types";

const BASE_URL = "http://127.0.0.1:5000";

export const ping = async (): Promise<PingResponse> => {
  const response = await fetch(`${BASE_URL}/api/ping`, {
    next: {
      revalidate: 0,
    },
  });
  const data = await response.json();
  return data;
};
