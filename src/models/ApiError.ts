export class ApiError extends Error {
  statusCode?: number | undefined;
  isRateLimited?: boolean | undefined;
  url?: string | undefined;

  constructor(params: { message: string; statusCode?: number; isRateLimited?: boolean; url?: string }) {
    super(params.message);
    this.name = 'ApiError';
    this.statusCode = params.statusCode;
    this.isRateLimited = params.isRateLimited;
    this.url = params.url;
  }
}
