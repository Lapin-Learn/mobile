import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { AuthInfo } from './axios/auth';
import { getTokenAsync, setTokenAsync } from './utils';

const BASE_URL = process.env.EXPO_PUBLIC_API_ENDPOINT || 'http://localhost:3000/api';
type EndpointOptions = Omit<AxiosRequestConfig, 'url' | 'method'> & {
  searchParams?: string | Record<string, string>;
  body?: unknown;
};

type APIResponse<T> = {
  status: number;
  message: string;
  data: T;
};

type APIError = {
  status: number;
  message: string;
  code?: string;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = await getTokenAsync();
    if (auth) {
      console.log('auth.accessToken', auth.accessToken);
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(formatError(error));
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log('unauthorized');
      const auth = await getTokenAsync();
      if (auth && auth.refreshToken) {
        console.log('Refreshing token:', auth.refreshToken);

        const data = await api.post<AuthInfo>('auth/refresh', {
          body: {
            refreshToken: auth.refreshToken,
          },
        });
        await setTokenAsync(data);
        console.log('Refreshed token:', data);

        const newAuth = await getTokenAsync();
        if (newAuth) {
          error.config.headers.Authorization = `Bearer ${newAuth.accessToken}`;
          return axiosInstance.request(error.config);
        }
      }
    }
    return Promise.reject(formatError(error));
  }
);

const formatError = (error: any | AxiosError): APIError => {
  let message = error.message;
  const status = error.response?.status || 500;

  if (error.response?.data?.message) {
    message = error.response.data.message;
  }

  return { status, message };
};

const axiosImageInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'image/jpeg',
  },
});

axiosImageInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    return Promise.reject(formatError(error));
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
      throw formatError(error);
    }
  }

  private async fileRequest<T>(endpoint: string, options: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosImageInstance.request<T>({
        url: endpoint,
        ...options,
      });

      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  }

  async get<T>(endpoint: string, { searchParams, ...restOptions }: EndpointOptions = {}) {
    return this.request<T>(endpoint, {
      method: 'GET',
      params: searchParams,
      ...restOptions,
    });
  }

  async post<T>(endpoint: string, { body, ...restOptions }: EndpointOptions = {}) {
    return this.request<T>(endpoint, {
      method: 'POST',
      data: body,
      ...restOptions,
    });
  }

  async put<T>(endpoint: string, { body, ...restOptions }: EndpointOptions = {}) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      data: body,
      ...restOptions,
    });
  }

  async delete<T>(endpoint: string, { searchParams, ...restOptions }: EndpointOptions = {}) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      params: searchParams,
      ...restOptions,
    });
  }

  async putImage<T>(endpoint: string, { body, ...restOptions }: EndpointOptions = {}) {
    return this.fileRequest<T>(endpoint, {
      method: 'PUT',
      data: body,
      ...restOptions,
    });
  }
}
const api = new API();
export default api;
