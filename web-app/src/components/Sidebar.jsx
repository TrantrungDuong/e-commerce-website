import { Box, List, ListItem, ListItemText, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: 240,
                bgcolor: "#f4f4f4",
                height: "100vh", // Ensure it takes the full height of the viewport
                p: 2,
                boxShadow: 2,
                position: "sticky", // Keep the sidebar sticky
                top: 0, // Stick to the top of the page
                overflowY: "auto", // Allow vertical scrolling if needed
            }}
        >
            <Typography sx={{ mt: 10 }} variant="h6" gutterBottom>
                Menu
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
                <ListItem button onClick={() => navigate("/")}>
                    <ListItemText primary="All Products" />
                </ListItem>
                <ListItem button onClick={() => navigate("/orders")}>
                    <ListItemText primary="Orders" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Categories" />
                </ListItem>
                <ListItem button onClick={() => navigate("/wishlist")}>
                    <ListItemText primary="Favorites" />
                </ListItem>
            </List>
        </Box>
    );
}
