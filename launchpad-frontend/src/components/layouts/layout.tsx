import { Outlet } from "react-router-dom";
import { NavBar } from "../shared/navbar";

export const Layout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);
