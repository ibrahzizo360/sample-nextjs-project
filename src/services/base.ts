import { joinUrls } from "@/common";
import { DynamicObject } from "@/common/interfaces";
import { ErrorResponse } from "@/common/interfaces/error";
import { SuccessResponse } from "@/common/interfaces/response";
import { BaseHttpHandler, HttpHandlerError, _Response } from "./http_handlers/httpHandler";
import { AxiosHandler } from "./http_handlers/axiosHandler";


export type RequestOption = {
  path?: string,
  headers?: DynamicObject,
  body?: DynamicObject,
  query?: DynamicObject,
  params?: DynamicObject,
}

/**
 * BaseApiClient
 * 
 * @description Base class for all api clients, provides basic methods for api calls
 * 
 * @example
 * 
 * class UserApiClient extends BaseApiClient {
 *  constructor(baseUrl: string, baseHeaders: DynamicObject) {
 *   super(baseUrl, baseHeaders);
 *  }
 * 
 *  public async getUser(id: string) {
 *   return this.get<User>(`/users/${id}`, {
 *    params: {
 *     id: 12,
 *    },
 *    query: {
 *     name: 'John'
 *    }
 *   });
 *  }
 * }
 * 
 * const userApiClient = new UserApiClient('http://localhost:3000', {
 *    x: 'y'
 * });
 * 
 * const user = await userApiClient.getUser('12');
 * 
 */
export class BaseApiClient {
  private _baseUrl = "null";
  private _baseHeaders: DynamicObject = {};
  private _http: BaseHttpHandler;

  constructor(baseUrl: string, baseHeaders: DynamicObject) {
    this.setBaseUrl(baseUrl);
    this.setBaseHeaders(baseHeaders);
    this._http = new AxiosHandler();
  }

  /**
   * 
   * @returns Base url of the api client
   */
  public getBaseUrl() {
    return this._baseUrl;
  }

  setHttpHandler(handler: BaseHttpHandler) {
    this._http = handler;
  }

  /**
   * 
   * @param baseUrl Base url of the api client
   * 
   * @description Set base url of the api client
   * 
   * @example
   * 
   * const userApiClient = new UserApiClient('http://localhost:3000', {
   *   x: 'y'
   * });
   * 
   * userApiClient.setBaseUrl('http://localhost:3001');
   * 
   * const user = await userApiClient.getUser('12');
  */
  public setBaseUrl(baseUrl: string) {
    // Make sure the base url ends with a slash
    if (!baseUrl.endsWith('/')) {
      baseUrl = `${baseUrl}/`;
    }
    this._baseUrl = baseUrl;
  }

  /**
   * 
   * @returns Base headers of the api client
   */
  public getBaseHeaders() {
    return this._baseHeaders;
  }


  /**
   * 
   * @param baseHeaders Base headers of the api client
   * 
   * @description Set base headers of the api client
   */
  public setBaseHeaders(baseHeaders: DynamicObject) {
    this._baseHeaders = baseHeaders;
  }


  /**
   * 
   * @param path the endpoint of the api
   * @param context an object containing params or query
   * @returns the url of the api call
   */
  public buildUrl(path: string, context: Pick<RequestOption, 'params' | 'query'>) {
    let url = joinUrls(this.getBaseUrl(), path)

    if (context.params) {
      Object.keys(context.params).forEach(key => {
        if (context.params)
          url = url.replace(`{${key}}`, context.params[key]);
      });
    }

    // If does not end with a slash, add a slash
    if (!url.endsWith('/')) {
      url = `${url}/`;
    }

    if (context.query) {
      const qUrl = new URL(url);
      Object.keys(context.query).forEach(key => {
        if (context.query)
          qUrl.searchParams.append(key, context.query[key]);
      });
      url = qUrl.toString();
    }

    return url;
  }

  /**
   * 
   * @param context an object containing headers
   * @returns the headers of the api call
   */
  public async buildHeaders(context: Pick<RequestOption, 'headers' | 'path'>) {
    return {
      'Content-Type': 'application/json',
      ...this.getBaseHeaders(),
      ...context.headers
    }
  }

  public async resolveResult<T>(
    response: _Response<T | unknown | any > | undefined,
  ): Promise<{
    result: SuccessResponse<T>;
    status: number;
    success: true;
  } | {
    result: ErrorResponse;
    status: number;
    success: false;
  }> {
    
    if (!response) {
      throw new Error("No response from server")
    }

    if (response.status >= 200 && response.status < 300) {
      return {
        result: response.data as SuccessResponse<T>,
        status: response.status,
        success: true,
      }
    }
    return {
      result: response.data as ErrorResponse,
      status: response.status,
      success: false,
    }
  }

  public errorCallback<T = unknown>(context: RequestOption, url: string) {
    // Redirect to login if 401
    return (error: HttpHandlerError<T>) => {
      if (typeof window !== 'undefined' && error.response?.status === 401) {
        window.location.href = '/login';
      }
      console.log("Error on request", error)
      this.logInput(context, url);
      return error.response
    }
  }

  public logInput(context: RequestOption, url: string, extra?: any) {
    console.log("Request context", context)
    console.log("Request url", url)
    console.log("Request extra", extra)
  }

  public addPath(path: string, context: RequestOption) {
    context.path = path
  }

  public async get<T>(path: string, context: RequestOption = {}) {
    this.addPath(path, context)

    const url = this.buildUrl(path, context);
    const headers = await this.buildHeaders(context)

    const response = await this._http.get<T>(url, {
      headers,
    }).then((data) => {
      return data
    }).catch(this.errorCallback<T>(context, url));

    return this.resolveResult<T>(response);
  }

  public async post<T>(path: string, context: RequestOption) {
    this.addPath(path, context)
    const url = this.buildUrl(path, context);
    const headers = await this.buildHeaders(context)
    const response = await this._http.post(url, {
      headers,
      body: context.body
    }).then((data) => {
      return data
    }).catch(this.errorCallback(context, url));
    return this.resolveResult<T>(response);
  }


  public async put<T>(path: string, context: RequestOption) {
    this.addPath(path, context)
    const url = this.buildUrl(path, context);
    const headers = await this.buildHeaders(context)
    const response = await this._http.put(url, {
      headers,
      body: context.body,
    }).then((data) => {
      return data
    }).catch(this.errorCallback(context, url));
    return this.resolveResult<T>(response);
  }

  public async delete<T>(path: string, context: Omit<RequestOption, 'query' | 'body'>) {
    this.addPath(path, context)
    const url = this.buildUrl(path, context);
    const headers = await this.buildHeaders(context)
    const response = await this._http.delete(url, {
      headers,
    }).then((data) => {
      return data
    }).catch(this.errorCallback(context, url));
    if (!response) {
      throw new Error("API not responding correctly")
    }
    return this.resolveResult<T>(response);
  }

  public async patch<T>(path: string, context: RequestOption) {
    this.addPath(path, context)
    const url = this.buildUrl(path, context);
    const headers = await this.buildHeaders(context)
    const response = await this._http.patch(url, {
      headers,
      body: context.body,
    }).then((data) => {
      return data
    }).catch(this.errorCallback(context, url));
    return this.resolveResult<T>(response);
  }
}