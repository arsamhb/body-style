export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/** Request context stored with refresh tokens for the session list / audit. */
export interface SessionMeta {
  ip: string;
  userAgent: string;
}
