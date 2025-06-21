import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout() {
    return (
        <>
            <AdminHeader />
            <Box sx={{ display: "flex" }}>
                <AdminSidebar />
                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </>
    );
}
