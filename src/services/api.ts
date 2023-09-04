
import { BaseApiClient, RequestOption } from "./base";
import { LoginResponse } from "@/common/interfaces/login";
import { RefreshPayloadResponse } from "@/common/interfaces/token";
import { User } from "@/common/interfaces/user";
import { getAccessToken } from "./authenticate";

export class ApiService extends BaseApiClient {
  getAccessToken: typeof getAccessToken = getAccessToken;

  constructor() {
    const BASE_URL = 'https://roadflow.tripvalue.com.ng/api/v1';
    super(BASE_URL, {})
  }

  async login(email: string, password: string) {
    return this.post<LoginResponse>("/account/login", {
      body: {
        email,
        password
      }
    });
  }

  authorize(data: RequestOption) {
    const tokens = this.getAccessToken();
    if (tokens == undefined) {
      throw new Error("Unauthorized");
    }
    return {
      ...data,
      headers: {
        "Authorization": `Bearer ${tokens.access}`
      }
    }
  }

  async refreshJwt(refresh: string) {
    return this.post<RefreshPayloadResponse>("/account/token/user/refresh", {
      body: { refresh }
    });
  }
}

export const api = new ApiService();