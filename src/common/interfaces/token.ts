export interface JwtPayload {
    refresh: string;
    access: string;
    refresh_expires_at: number;
    access_expires_at: number;
  }
  
  export interface RefreshPayloadResponse {
    access: string;
    access_expires_at: number;
  }
  