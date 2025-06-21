import { useEffect, useState } from "react";
import axios from "../../common/services/axiosInstance";
import { getToken } from "../../common/services/localStorageService";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import {
    Box,
    Typography,
    CircularProgress,
    IconButton,
    Paper,
    Grid,
    Snackbar,
    Alert,
    Button,
} from "@mui/material";
import { useCart } from "../../common/context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const [cartData, setCartData] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(true);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("info");
    const { fetchCartCount } = useCart();
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        try {
            const response = await axios.get("/mobile-shop/cart", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setCartData(response.data.result || { items: [], totalAmount: 0 });
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
                "/mobile-shop/cart/update",
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
            await axios.delete(`/mobile-shop/cart/remove/${productId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            await fetchCartItems();
            await fetchCartCount();
        } catch (error) {
            console.error("REMOVE CART ITEM ERROR", error);
        }
    };

    const handleCheckout = async () => {
        try {
            const res = await axios.post("/mobile-shop/orders/checkout", {}, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });

            const orderId = res.data.result?.id;
            if (orderId) {
                navigate(`/orders/${orderId}`);
            } else {
                showMessage("Không thể tạo đơn hàng", "error");
            }
        } catch (error) {
            console.error("CHECKOUT ERROR", error);
            showMessage("Lỗi khi thanh toán giỏ hàng", "error");
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <>
                <Box sx={{ flexGrow: 1, mt: 10, px: 2 }}>
                    <Box sx={{ maxWidth: 700, mx: "auto" }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            My Cart
                        </Typography>

                        {loading ? (
                            <Box display="flex" justifyContent="center" mt={4}>
                                <CircularProgress />
                            </Box>
                        ) : cartData.items.length === 0 ? (
                            <Typography>No items in cart.</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {cartData.items.map((item) => (
                                    <Grid item xs={12} key={item.productId}>
                                        <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
                                            <Box
                                                component="img"
                                                src={item.imageUrl?.[0]}
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
                                                    Price: {item.price.toLocaleString()}
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

            {cartData.items.length > 0 && (
                <Box
                    position="fixed"
                    bottom={20}
                    right={200}
                    zIndex={999}
                >
                    <Button
                        sx={{ mr: 1 }}
                        variant="contained"
                        color="secondary"
                        size="large"
                    >
                        {cartData.totalAmount.toLocaleString()} VND
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<ShoppingCartCheckoutIcon />}
                        onClick={handleCheckout}
                    >
                        Buy Now
                    </Button>
                </Box>
            )}
        </>
    );
}
