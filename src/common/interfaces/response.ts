export interface SuccessResponse<T> {
    success: boolean;
    message: string;
    data: T | undefined;
    path: string;
  }