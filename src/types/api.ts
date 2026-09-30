export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  details?: string;
}

export type FetchStatus = "idle" | "loading" | "success" | "error";

export interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}
