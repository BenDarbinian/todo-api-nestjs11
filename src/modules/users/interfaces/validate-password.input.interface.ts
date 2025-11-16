export interface ValidatePasswordInput {
  readonly oldPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}
