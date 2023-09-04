import Cookies from "js-cookie";
import { PAYLOAD_KEY, USER_KEY } from "../common/constants";
import { LoginResponse } from "../common/interfaces/login";
import { JwtPayload } from "@/common/interfaces/token";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export const authenticate = (data: LoginResponse) => {
  Cookies.set(PAYLOAD_KEY, JSON.stringify(
    processJWTPayload(data.tokens)
  ));
  Cookies.set(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

export const processJWTPayload = (payload: JwtPayload) => {
  return {
    ...payload,
    access_expires_at: Date.now() + payload.access_expires_at * 1000,
    refresh_expires_at: Date.now() + payload.refresh_expires_at * 1000
  }
}

export const getAccessToken = () => {
  const jwt_payload = Cookies.get(PAYLOAD_KEY);
  let jwt_payload_decoded: JwtPayload;

  function clear() {
    Cookies.remove(PAYLOAD_KEY);
    Cookies.remove(USER_KEY);
  }

  if (!jwt_payload || jwt_payload == undefined) {
    return
  }

  try {
    jwt_payload_decoded = JSON.parse(jwt_payload);
  } catch (e) {
    return clear()
  }

  // TODO: Add this process for updating coeekie in the getServerSide Props too
  return {
    ...jwt_payload_decoded,
    updatePayload: (payload: JwtPayload) => {
      Cookies.set(PAYLOAD_KEY, JSON.stringify(
        processJWTPayload(payload)
      ));
    }
  };
}

export const getAccessTokenServerSide = (req: IncomingMessage & {
  cookies: NextApiRequestCookies
}) => {
  const jwt_payload = req.cookies[PAYLOAD_KEY];
  let jwt_payload_decoded: JwtPayload;

  if (!jwt_payload || jwt_payload == undefined) {
    return
  }

  try {
    jwt_payload_decoded = JSON.parse(jwt_payload);
  } catch (e) {
    return
  }
  return {
    ...jwt_payload_decoded,
    updatePayload: (payload: JwtPayload) => {
      req.cookies[PAYLOAD_KEY] = JSON.stringify(
        processJWTPayload(payload)
      );
    }
  }
}

export const checkServerSideResponse: any = (
  response: { success: boolean, status: number },
  req: IncomingMessage
 ) => {
  if (!response.success) {
    if (response.status === 401) {
      return {
        redirect: {
          destination: req.url
        },
      }
    }
    return {
      notFound: true,
    }
  }
}
