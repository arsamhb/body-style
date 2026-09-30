export interface AuthLoginFormSchema {
  email: string;
  password: string;
}

export interface AuthPasswordFormSchema {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
