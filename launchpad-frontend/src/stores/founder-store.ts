import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import {
  StartUpProfile,
  StartUpProfilePayload,
} from "../types/start-up-profile";
import { notifications } from "@mantine/notifications";

export class FounderStore {
  startupProfile: StartUpProfile | null = null;
  queryClient: QueryClient;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    makeAutoObservable(this);
  }

  get startupProfileData() {
    return this.startupProfile;
  }

  private loadTokenFromLocalStorage(): string | null {
    return localStorage.getItem("auth_token") ?? null;
  }

  private get authHeaders() {
    const token = this.loadTokenFromLocalStorage();
    if (!token) {
      return null;
    }
    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};
  }

  async createProfile(payload: StartUpProfilePayload) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<StartUpProfile>(
        `${this.baseUrl}founder/profile`,
        payload,
        this.authHeaders
      );
      runInAction(() => {
        this.startupProfile = data;
      });
      this.queryClient.invalidateQueries({ queryKey: ["startup-profile"] });
      notifications.show({
        title: "Success",
        message: "Startup profile created!",
        color: "green",
      });
      return data;
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create startup profile",
        color: "red",
      });
      throw error;
    }
  }

  async getProfile() {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<StartUpProfile>(
        `${this.baseUrl}founder/profile`,
        this.authHeaders
      );
      runInAction(() => {
        this.startupProfile = data;
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  }

  async updateProfile(payload: StartUpProfile) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.put<StartUpProfile>(
        `${this.baseUrl}founder/profile`,
        payload,
        this.authHeaders
      );
      runInAction(() => {
        this.startupProfile = data;
        this.queryClient.invalidateQueries({ queryKey: ["startup-profile"] });
      });
      notifications.show({
        title: "Updated",
        message: "Profile updated successfully!",
        color: "blue",
      });
      return data;
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Update failed",
        color: "red",
      });
      throw error;
    }
  }
}
