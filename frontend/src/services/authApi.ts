import axios from "axios";
import { LoginPayload, RegisterPayload, AuthResponse, User } from "../types/authTypes";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthApiService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  async getProfile(): Promise<{ success: boolean; data: User }> {
    const { data } = await api.get("/auth/profile");
    return data;
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};