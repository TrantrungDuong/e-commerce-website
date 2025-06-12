import { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { getToken } from "../services/localStorageService";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../components/header/Header";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";


import {
    Box,
    Typography,
    CircularProgress,
    IconButton,
    Paper,
    Grid,
    Snackbar,
    Alert, Button,
} from "@mui/material";
import {useCart} from "../context/CartContext";
import Sidebar from "../components/Sidebar";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("info");
    const { fetchCartCount } = useCart();

    const fetchCartItems = async () => {
        try {
            const response = await axios.get("/identity/cart", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setCartItems(response.data.result || []);
        } catch (error) {
            console.error("FETCH CART ERROR", error);
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (message, type = "info") => {
        setSnackType(type);
        setSnackBarMessage(message);
        setSnackBarOpen(true);
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            showMessage("Quantity must be at least 1.", "warning");
            return;
        }

        try {
            await axios.put(
                "/identity/cart/update",
                { productId, quantity: newQuantity },
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );
            await fetchCartItems();
            await fetchCartCount();
        } catch (error) {
            console.error("UPDATE QUANTITY ERROR", error);
            showMessage("Failed to update quantity.", "error");
        }
    };

    const handleRemove = async (productId) => {
        try {
            await axios.delete(`/identity/cart/remove/${productId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            await fetchCartItems();
            await fetchCartCount();
        } catch (error) {
            console.error("REMOVE CART ITEM ERROR", error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <>
            <Header />
            <Box display="flex">
                <Sidebar/>
                <Box sx={{ flexGrow: 1, mt: 10, px: 2 }}>
                    <Box sx={{ maxWidth: 700, mx: "auto" }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        My Cart
                    </Typography>

                    {loading ? (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <CircularProgress />
                        </Box>
                    ) : cartItems.length === 0 ? (
                        <Typography>No items in cart.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {cartItems.map((item) => (
                                <Grid item xs={12} key={item.productId}>
                                    <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
                                        <Box
                                            component="img"
                                            src="https://similarpng.com/_next/image?url=https%3A%2F%2Fimage.similarpng.com%2Ffile%2Fsimilarpng%2Fvery-thumbnail%2F2020%2F09%2FApple-IPhone-8-Plus-on-transparent-background-PNG.png&w=3840&q=75"
                                            alt={item.productName}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                mr: 2,
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1">
                                                {item.productName || "No name"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mb={1}>
                                                Price: ${item.price}
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleUpdateQuantity(item.productId, item.quantity - 1)
                                                    }
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography>{item.quantity}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleUpdateQuantity(item.productId, item.quantity + 1)
                                                    }
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <IconButton onClick={() => handleRemove(item.productId)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    </Box>
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

            <Box
                position="fixed"
                bottom={20}
                right={200}
                zIndex={999}
            >
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<ShoppingCartCheckoutIcon />}
                    onClick={() => {
                        console.log("Proceed to checkout");
                    }}
                >
                    Buy Now
                </Button>
            </Box>
        </>
    );
}
