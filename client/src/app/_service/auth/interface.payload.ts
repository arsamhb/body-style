export interface AuthLoginCreatePayload {
  email: string;
  password: string;
}

export interface AuthRefreshCreatePayload {
  refreshToken: string;
}

export interface AuthLogoutCreatePayload {
  refreshToken: string;
}

export interface AuthPasswordCreatePayload {
  currentPassword: string;
  newPassword: string;
}
