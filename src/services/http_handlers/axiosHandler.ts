import { BaseHttpHandler, HttpHandlerError } from "./httpHandler";
import axios, { AxiosError } from "axios";
import { RequestOption } from "../base";


export class AxiosHandler extends BaseHttpHandler {
  errorCallback(error: AxiosError) {
    throw new HttpHandlerError(
      error.message,
      error.status,
      error.response
    )
  }

  async get(url: string, options: RequestOption) {
    const response = await axios.get(url, {
      headers: options.headers,
    })
      .then((response) => {
        return response;
      })
      .catch(this.errorCallback);
    
    if (!response) {
      throw new HttpHandlerError("No response from server");
    }
    return response;
  }

  async post(url: string, options: RequestOption) {
    const response = await axios.post(url, options.body, {
      headers: options.headers,
    })
      .then((response) => {
        return response;
      })
      .catch(this.errorCallback);
    
    if (!response) {
      throw new HttpHandlerError("No response from server");
    }
    return response;
  }

  async put(url: string, options: RequestOption) {
    const response = await axios.put(url, options.body, {
      headers: options.headers,
    })
      .then((response) => {
        return response;
      })
      .catch(this.errorCallback);
    
    if (!response) {
      throw new HttpHandlerError("No response from server");
    }
    return response;
  }

  async delete(url: string, options: RequestOption) {
    const response = await axios.delete(url, {
      headers: options.headers,
    })
      .then((response) => {
        return response;
      })
      .catch(this.errorCallback);
    
    if (!response) {
      throw new HttpHandlerError("No response from server");
    }
    return response;
  }

  async patch(url: string, options: RequestOption) {
    const response = await axios.patch(url, options.body, {
      headers: options.headers,
    })
      .then((response) => {
        return response;
      })
      .catch(this.errorCallback);
    
    if (!response) {
      throw new HttpHandlerError("No response from server");
    }
    return response;
  }
}