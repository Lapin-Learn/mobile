import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { getTokenAsync } from './utils';

const BASE_URL = process.env.EXPO_PUBLIC_API_ENDPOINT || 'http://localhost:3000';
interface EndpointOptions extends Omit<AxiosRequestConfig, 'url' | 'method'> {
  searchParams?: string | Record<string, string>;
  body?: unknown;
}

type APIResponse<T> = {
  status: number;
  message: string;
  data: T;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = await getTokenAsync();
    if (auth) {
      config.headers.Authorization = `Bearer ${auth}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const errorMessage = (error.response?.data as { message?: string })?.message || error.message;
    return Promise.reject(new Error(`HTTP error! status: ${error.response?.status}, message: ${errorMessage}`));
  }
);

class API {
  private async request<T>(endpoint: string, options: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.request<APIResponse<T>>({
        url: endpoint,
        ...options,
      });

      const json = response.data as APIResponse<T>;
      return json.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`HTTP error! status: ${error.response?.status}, message: ${errorMessage}`);
      } else {
        throw new Error(`Unexpected error: ${error}`);
      }
    }
  }

  async get<T>(endpoint: string, { searchParams, ...nextOptions }: EndpointOptions = {}) {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...nextOptions,
    });
  }

  async post<T>(endpoint: string, { body, ...nextOptions }: EndpointOptions = {}) {
    return this.request<T>(endpoint, {
      method: 'POST',
      data: body,
      ...nextOptions,
    });
  }

  async put<T>(endpoint: string, { body, ...nextOptions }: EndpointOptions = {}) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      data: body,
      ...nextOptions,
    });
  }
  async delete<T>(endpoint: string, { searchParams, ...nextOptions }: EndpointOptions = {}) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...nextOptions,
    });
  }
}
const api = new API();
export default api;
