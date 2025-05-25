import { isAxiosError } from 'axios';
import { logger } from 'src/utils/logger';
import { ApiError } from 'src/models/ApiError';

export function handleApiError(error: unknown): ApiError {
  const defaultMessage = 'Unexpected error occurred.';

  if (!isAxiosError(error)) {
    logger.error('[API] Unknown error format:', error);
    return new ApiError({ message: defaultMessage });
  }

  const url = error.config?.url || '';
  const status = error.response?.status ?? 0;
  const message = error.response?.data?.message || error.message || defaultMessage;

  if (!error.response) {
    const apiError = new ApiError({
      message: 'No response from server',
      statusCode: 0,
      url
    });
    logger.error('[API] No response from server (timeout?) for', url);
    return apiError;
  }

  const apiError = new ApiError({
    message,
    statusCode: status,
    url
  });

//   if (!status) {
//     logger.error(`[API] ? Error on ${url}:`, message);
//   } else if (status === 429) {
//     apiError.isRateLimited = true;
//     logger.warn(`[API] 429 Rate Limit on ${url}`);
//   } else if (status >= 500) {
//     logger.error(`[API] ${status} Server error on ${url}`);
//   } else {
//     logger.error(`[API] ${status} Error on ${url}:`, message);
//   }

  return apiError;
}
