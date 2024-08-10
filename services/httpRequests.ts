import { getAuthValueFromStorage } from './storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_ENDPOINT || 'http://localhost:3000';
interface EndpointOptions extends Omit<RequestInit, 'body'> {
  searchParams?: string;
  body?: unknown;
}

type APIResponse<T> = {
  status: number;
  message: string;
  data: T;
};

class API {
  private headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  private generateRequest: (defaultRequest: RequestInit) => RequestInit;
  constructor(generateRequest: (defaultRequest: RequestInit) => RequestInit = (req) => req) {
    this.generateRequest = generateRequest;
  }

  private buildURL(endpoint: string, searchParams?: URLSearchParams | string | Record<string, string>): string {
    const url = new URL(endpoint, BASE_URL);
    if (searchParams) {
      if (typeof searchParams === 'string') {
        url.search = searchParams;
      } else if (searchParams instanceof URLSearchParams) {
        url.search = searchParams.toString();
      } else {
        Object.entries(searchParams).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }
    }
    return url.toString();
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${error}`);
    }
    const json = (await response.json()) as APIResponse<T>;
    return json.data;
  }

  async get<T>(endpoint: string, { searchParams, ...nextOptions }: EndpointOptions = {}) {
    const url = this.buildURL(endpoint, searchParams);

    const initRequest = {
      method: 'GET',
      headers: this.headers,
      ...nextOptions,
      body: JSON.stringify(nextOptions.body),
    };
    const finalRequest = this.generateRequest(initRequest);
    return this.request<T>(url, finalRequest);
  }

  async post<T>(endpoint: string, { body, ...nextOptions }: EndpointOptions = {}) {
    const url = this.buildURL(endpoint);
    const initRequest: RequestInit = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
      ...nextOptions,
    };
    const finalRequest = this.generateRequest(initRequest);
    return this.request<T>(url, finalRequest);
  }

  async put<T>(endpoint: string, { body, ...nextOptions }: EndpointOptions = {}) {
    const url = this.buildURL(endpoint);
    const initRequest: RequestInit = {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body),
      ...nextOptions,
    };
    const finalRequest = this.generateRequest(initRequest);
    return this.request<T>(url, finalRequest);
  }
  async delete<T>(endpoint: string, { searchParams, ...nextOptions }: EndpointOptions = {}) {
    const url = this.buildURL(endpoint, searchParams);
    const initRequest: RequestInit = {
      method: 'DELETE',
      headers: this.headers,
      ...nextOptions,
      body: JSON.stringify(nextOptions.body),
    };
    const finalRequest = this.generateRequest(initRequest);
    return this.request<T>(url, finalRequest);
  }
}

const api = new API((defaultRequest) => {
  const auth = getAuthValueFromStorage();
  return {
    ...defaultRequest,
    headers: {
      ...defaultRequest.headers,
      Authorization: `Bearer ${auth?.access_token}`,
    },
  };
});
export const apiAuth = new API();
export default api;
