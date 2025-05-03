import { UserRole } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface SignupPayload {
  full_name: string;
  email: string;
  password: string;
}
