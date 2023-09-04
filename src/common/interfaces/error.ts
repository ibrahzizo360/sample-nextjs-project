import { SuccessResponse } from "./response";

export interface FieldError {
  [key: string]: string[];
}

export interface ErrorResponse extends Omit<SuccessResponse<FieldError>, "message"> {
  error: {
    code: number;
    message: string;
  };
}
