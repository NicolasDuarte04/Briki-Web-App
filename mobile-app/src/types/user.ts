export interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}