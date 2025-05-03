import { makeAutoObservable, runInAction } from "mobx";
import { UserRole } from "../types/user";

export class UiViewStore {
  _toggleUserRoleForLogin: UserRole = "investor";
  _createRoomModalOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  get UserRoleForLogin() {
    return this._toggleUserRoleForLogin;
  }

  toggleUserRoleForLogin(value: UserRole) {
    runInAction(() => {
      this._toggleUserRoleForLogin = value;
    });
  }

  get CreateRoomModalOpen() {
    return this._createRoomModalOpen;
  }

  set CreateRoomModalOpen(value: boolean) {
    runInAction(() => {
      this._createRoomModalOpen = value;
    });
  }
}
