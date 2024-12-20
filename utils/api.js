import useUserStore from '~/stores/user';
import axios from 'axios';

export const useApi = async (url, params) => {
  try {
    if (process.server && useRequestHeaders().cookie) {
      useUserStore().cookie = useRequestHeaders().cookie;
    }
  } catch (e) {}

  if (params && 'formData' in params && params.formData instanceof FormData) {
    return axios.post(url, params.formData, {
      baseURL: process.client ? useRuntimeConfig().public.SITE_URL : process.env.SITE_URL,
      onUploadProgress(event) {
        params?.onUploadProgress?.call(null, event);
      },
      onDownloadProgress(event) {
        params?.onDownloadProgress?.call(null, event);
      },
      signal: params?.signal
    });
  }

  return axios.request({
    url,
    baseURL: process.client ? useRuntimeConfig().public.SITE_URL : process.env.SITE_URL,
    method: params?.method,
    withCredentials: params?.withCredentials || true,
    headers: {
      ...useUserStore().token ? {'X-CSRF-Token': useUserStore().token} : null,
      ...useUserStore().cookie && process.server ? {'cookie': useUserStore().cookie} : null,
      'X-Requested-With': 'XMLHttpRequest',
      ...params?.headers
    },
    signal: params?.signal,
    maxRedirects: 0,
    ...params?.method === 'GET' ? {
      params: params?.query
    } : null,
    ...params?.method !== 'GET' ? {
      data: params?.body
    } : null,
    responseType: params?.responseType,
    onUploadProgress(event) {
      params?.onUploadProgress?.call(null, event);
    },
    onDownloadProgress(event) {
      params?.onDownloadProgress?.call(null, event);
    }
  });
};
