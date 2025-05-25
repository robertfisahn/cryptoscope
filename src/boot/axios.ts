import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { logger } from 'src/utils/logger';
import { handleApiError } from 'src/handlers/errors/handleApiError';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000
});

api.interceptors.request.use(config => {
  logger.debug('[API] Request:', config.method?.toUpperCase(), config.url, config.params || config.data);
  return config;
}, error => {
  logger.error('[API] Request error:', error);
  return Promise.reject(error instanceof Error ? error : new Error(String(error)));
});

api.interceptors.response.use(response => {
  logger.debug('[API] Response:', response.config.url, response.status);
  return response;
}, error => {
  const apiError = handleApiError(error);
  return Promise.reject(apiError);
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
