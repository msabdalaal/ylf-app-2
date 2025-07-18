import axios, {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  ResponseType,
} from "axios";
import { getValueFor } from "./storage";

export const get = async (
  url: string,
  config?: AxiosRequestConfig,
  customToken: string | null = null
): Promise<AxiosResponse> => {
  const apiUrl = `https://mobile.ylf-eg.org/api/`;
  const token = customToken ? customToken : await getValueFor("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return axios.get(apiUrl + url, { headers, ...config });
};

export const post = async (
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const apiUrl = `https://mobile.ylf-eg.org/api/`;
  const token = await getValueFor("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return axios.post(apiUrl + url, data, {
    headers,
    ...config,
  });
};

export const patch = async (
  url: string,
  data: any,
  config?: AxiosRequestConfig,
  customToken: string | null = null
): Promise<AxiosResponse> => {
  const apiUrl = `https://mobile.ylf-eg.org/api/`;
  const token = customToken ? customToken : await getValueFor("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return axios.patch(apiUrl + url, data, {
    headers,
    ...config,
  });
};

export const del = async (
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const apiUrl = `https://mobile.ylf-eg.org/api/`;
  const token = await getValueFor("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return axios.delete(apiUrl + url, {
    headers,
    data,
    ...config,
  });
};
