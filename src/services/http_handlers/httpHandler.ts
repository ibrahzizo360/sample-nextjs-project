import { DynamicObject } from "@/common/interfaces";
import { RequestOption } from "../base";


/**
 * BaseHttpHandler - this provides the base http handler methods
 * to be extended by other http handlers.
 */
export interface _Response<T = unknown> {
  status: number,
  data?: T,
  headers?: DynamicObject,
  statusText?: string,
}

export class BaseHttpHandler {

  async get<T = unknown>(url: string, options: RequestOption): Promise<_Response<T>> {
    throw new Error("Not implemented");
  }

  async post<T = unknown>(url: string, options: RequestOption): Promise<_Response<T>> {
    throw new Error("Not implemented");
  }

  async put<T = unknown>(url: string, options: RequestOption): Promise<_Response<T>> {
    throw new Error("Not implemented");
  }

  async delete(url: string, options: RequestOption): Promise<_Response> {
    throw new Error("Not implemented");
  }

  async patch<T = unknown>(url: string, options: RequestOption): Promise<_Response<T>> {
    throw new Error("Not implemented");
  }
}


export class HttpHandlerError<T = unknown> extends Error {
  constructor(
      message?: string,
      status?: number,
      response?: _Response<T>
  ) {
    super(message);
    this.response = response;
    this.status = status;
  }

  response?: _Response<T>;
  status?: number;
  cause?: Error;
}
