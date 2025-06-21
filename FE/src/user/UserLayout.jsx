import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Box } from "@mui/material";

export default function UserLayout() {
    return (
        <>
            <Header />

            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box sx={{ flexGrow: 1}}>
                    <Outlet />
                </Box>
            </Box>
        </>
    );
}
