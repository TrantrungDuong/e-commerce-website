import { Box, List, ListItem, ListItemText, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: 240,
                bgcolor: "#f4f4f4",
                height: "100vh",
                p: 2,
                boxShadow: 2,
                position: "sticky",
                top: 0,
                overflowY: "auto",
            }}
        >
            <Typography sx={{ mt: 10 }} variant="h6" gutterBottom>
                Menu
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
                <ListItem button onClick={() => navigate("/admin")}>
                    <ListItemText primary="Dashboard"/>
                </ListItem>
                <ListItem button onClick={() => navigate("/admin/products")}>
                    <ListItemText primary="Products" />
                </ListItem>
                <ListItem button onClick={() => navigate("/admin/orders")}>
                    <ListItemText primary="Orders" />
                </ListItem>
                <ListItem button onClick={() => navigate("/admin/users")}>
                    <ListItemText primary="Users" />
                </ListItem>
            </List>
        </Box>
    );
}
