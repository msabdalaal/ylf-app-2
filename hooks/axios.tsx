import axios, {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  ResponseType,
} from "axios";
import { getValueFor } from "./storage";

export const get = async (
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const token = await getValueFor("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return axios.get(apiUrl + url, { ...config, headers });
};

export const post = async (
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const token = await getValueFor("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return axios.post(apiUrl + url, data, {
    ...config,
    headers,
  });
};

