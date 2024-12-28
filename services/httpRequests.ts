import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { router } from 'expo-router';

import i18next from '~/i18n';

import { AuthInfo } from './axios/auth';
import { FIRST_LAUNCH, getTokenAsync, setTokenAsync } from './utils';

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
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const auth = await getTokenAsync();
      if (auth && auth.refreshToken) {
        return api
          .post<AuthInfo>('/auth/refresh', {
            body: {
              refreshToken: auth.refreshToken,
            },
          })
          .then(async (data) => {
            await setTokenAsync(data);
            axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(formatError(error));
          });
      } else {
        const firstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH);
        if (firstLaunch !== null) router.replace('/auth/sign-in');
        return Promise.reject(formatError(error));
      }
    }
    return Promise.reject(formatError(error));
  }
);

const formatError = (error: any | AxiosError): APIError => {
  const { t } = i18next;
  let message = error.message;
  const status = error.response?.status || 500;

  if (error.response?.data?.message) {
    message = error.response.data.message;
  }

  if (message === 'undefined') {
    message = t('error.undefined', { ns: 'auth' });
  }

  console.log('API Error:', error);

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

const axiosFormInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

axiosFormInstance.interceptors.response.use(
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

  private async formRequest<T>(endpoint: string, options: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosFormInstance.request<T>({
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

  async postForm<T>(endpoint: string, { body, ...restOptions }: EndpointOptions = {}) {
    return this.formRequest<T>(endpoint, {
      method: 'POST',
      data: body,
      ...restOptions,
    });
  }
}
const api = new API();
export default api;
