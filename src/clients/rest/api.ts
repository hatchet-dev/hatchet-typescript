import qs from 'qs';
import { AxiosRequestConfig } from 'axios';
import { Api } from './generated/Api';
import { Api as CloudApi } from './generated/cloud/Api';

const api = (serverUrl: string, token: string, axiosOpts?: AxiosRequestConfig) => {
  return new Api({
    baseURL: serverUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    ...axiosOpts,
  });
};

export const cloudApi = (serverUrl: string, token: string, axiosOpts?: AxiosRequestConfig) => {
  return new CloudApi({
    baseURL: serverUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    ...axiosOpts,
  });
};

export { api, CloudApi };

export default api;
