import { Outlet } from "react-router-dom";
import { NavBar } from "../shared/navbar";
import EditStartUpProfileModal from "../founder/edit-startup-profile-modal";

export const Layout = () => (
  <>
    <NavBar />
    <EditStartUpProfileModal />
    <Outlet />
  </>
);
