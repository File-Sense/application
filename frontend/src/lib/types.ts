export interface PingResponse {
  ping: string;
}
interface GeneralApiResponse {
  error?: string;
}

interface IndexData {
  index_id: string;
  index_path: string;
  index_status: number;
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

export interface IndexDirectoryResponse extends GeneralApiResponse {
  index_id?: string;
}

export interface SearchByTextResponse extends GeneralApiResponse {
  data?: string[];
}

export interface IHttpFunction {
  request: string;
  params?: string[];
  query?: { [key: string]: string | number | undefined };
  body?: any;
  method?: string;
}
