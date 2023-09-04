import { JwtPayload } from "./token";
import { User } from "./user";

export interface LoginResponse {
  user: User;
  tokens: JwtPayload;
}