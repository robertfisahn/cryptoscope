import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { Notify } from 'quasar';
import { logger } from 'src/utils/logger';

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
  const url = error.config?.url;
  const status = error.response?.status;

  if (!navigator.onLine) {
    logger.network('[API] Offline – user has no internet connection');
    Notify.create({ type: 'warning', message: 'You are offline – working in offline mode' });
  } else if (!error.response) {
    logger.error('[API] No response from server (timeout?) for', url);
    Notify.create({ type: 'negative', message: 'No response from server. Please try again.' });
  } else {
    logger.error(`[API] Error ${status} on ${url}:`, error.message);
    Notify.create({ type: 'negative', message: `Error ${status}: ${error.message}` });
  }

  return Promise.reject(error instanceof Error ? error : new Error(String(error)));
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
