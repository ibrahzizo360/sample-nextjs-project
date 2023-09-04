
import { BaseApiClient, RequestOption } from "./base";
import { LoginResponse } from "@/common/interfaces/login";
import { RefreshPayloadResponse } from "@/common/interfaces/token";
import { RegisterDto } from "@/common/dtos/register";
import { User } from "@/common/interfaces/user";
import { getAccessToken } from "./authenticate";
i

export class ApiService extends BaseApiClient {
  getAccessToken: typeof getAccessToken = getAccessToken;

  constructor() {
    const BASE_URL = '';
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

  async register(data: RegisterDto) {
    return this.post<User>("/account/register", {
      body: data
    });
  }

  async verify_account(email: string, otp: string) {
    return this.post<User>("/account/validate-otp", {
      body: {
        email,
        otp
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