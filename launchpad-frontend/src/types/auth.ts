import { UserRole } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface InvestorSignupPayload {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
}
