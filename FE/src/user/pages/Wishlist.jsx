import { useEffect, useState } from "react";
import axios from "../../common/services/axiosInstance";
import { getToken } from "../../common/services/localStorageService";
import {
    Box,
    Typography,
    CircularProgress,
    IconButton,
    Paper,
    Grid,
    Snackbar,
    Alert
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("info");


    const fetchWishlist = async () => {
        try {
            const response = await axios.get("/mobile-shop/wishlist", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setWishlistItems(response.data.result || []);
        } catch (error) {
            console.error("FETCH WISHLIST ERROR", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await axios.delete(`/mobile-shop/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setSnackBarMessage("Removed from wishlist.");
            setSnackType("success");
            setSnackBarOpen(true);
            fetchWishlist();
        } catch (error) {
            console.error("REMOVE WISHLIST ERROR", error);
            setSnackBarMessage("Failed to remove item.");
            setSnackType("error");
            setSnackBarOpen(true);
        }
    };


    useEffect(() => {
        fetchWishlist();
    }, []);

    return (
        <>
                <Box sx={{ flexGrow: 1, mt: 10, px: 2 }}>
                    <Box sx={{ maxWidth: 700, mx: "auto" }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            My Wishlist
                        </Typography>

                        {loading ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress />
                            </Box>
                        ) : wishlistItems.length === 0 ? (
                            <Typography>No items in wishlist.</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {wishlistItems.map((item) => (
                                    <Grid item xs={12} key={item.productId}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                display: "flex",
                                                justifyContent: "space-around"
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={
                                                    item.imageUrl?.[0]
                                                }
                                                alt={item.productName}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: "cover",
                                                    flexShrink: 0,
                                                    mr: 2,
                                                }}
                                            />


                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flex: 1,
                                                    alignItems: "center",
                                                    justifyContent: "space-around",
                                                    gap: 2,
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {item.productName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.price.toLocaleString()} VND
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.brandName}
                                                </Typography>
                                            </Box>

                                            <IconButton onClick={() => handleRemove(item.productId)}>
                                                <FavoriteIcon color="error" />
                                            </IconButton>
                                        </Paper>
                                    </Grid>

                                ))}
                            </Grid>
                        )}
                    </Box>
            </Box>

            <Snackbar
                open={snackBarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackBarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity={snackType}
                    onClose={() => setSnackBarOpen(false)}
                    variant="filled"
                >
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </>
    );

}
