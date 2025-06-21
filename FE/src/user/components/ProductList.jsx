import {
    Card,
    CardMedia,
    Typography,
    Grid,
    Button,
    Box,
    IconButton,
    Snackbar,
    Alert,
    Tooltip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getToken } from "../../common/services/localStorageService";
import axios from "../../common/services/axiosInstance";
import { useEffect, useState } from "react";
import { useCart } from "../../common/context/CartContext";
import {useNavigate} from "react-router-dom";

export default function ProductList({ products }) {
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("success");
    const { setCartCount } = useCart();
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();


    const handleCloseSnackBar = () => setSnackBarOpen(false);


    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await axios.get("/mobile-shop/wishlist", {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setWishlist(res.data.result.map((item) => item.productId));
            } catch (err) {
                console.error("FETCH WISHLIST ERROR", err);
            }
        };

        fetchWishlist();
    }, []);

    const handleAddToCart = async (productId, quantity = 1) => {
        try {
            await axios.post(
                "/mobile-shop/cart/add",
                { productId, quantity },
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            setSnackType("success");
            setSnackBarMessage("Product added to cart!");
            setCartCount((prev) => prev + quantity);
        } catch (error) {
            console.error("ADD TO CART ERROR", error);
            setSnackType("error");
            setSnackBarMessage("Failed to add product to cart.");
        } finally {
            setSnackBarOpen(true);
        }
    };

    const toggleWishlist = async (productId) => {
        try {
            if (wishlist.includes(productId)) {
                await axios.delete(`/mobile-shop/wishlist/${productId}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setWishlist((prev) => prev.filter((id) => id !== productId));
                setSnackType("success");
                setSnackBarMessage("Removed product from wishlist successfully");
                setSnackBarOpen(true);
            } else {
                await axios.post(`/mobile-shop/wishlist/${productId}`, null, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setWishlist((prev) => [...prev, productId]);
                setSnackType("success");
                setSnackBarMessage("Added product to wishlist successfully");
                setSnackBarOpen(true);
            }
        } catch (error) {
            console.error("WISHLIST TOGGLE ERROR", error);
            setSnackType("error");
            setSnackBarMessage("Failed to update wishlist");
            setSnackBarOpen(true);
        }
    };

    const handleBuyNow = async (productId, quantity = 1) => {
        try {
            const response = await axios.post(
                "/mobile-shop/orders/buy-now",
                { productId, quantity },
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );
            setSnackType("success");
            setSnackBarMessage("Order placed successfully!");
            setSnackBarOpen(true);

            if (response.data && response.data.result && response.data.result.id) {
                navigate(`/orders/${response.data.result.id}`);
            }
        } catch (error) {
            console.error("BUY NOW ERROR", error);
            setSnackType("error");
            const errorMessage = error.response?.data?.message || "Failed to place order.";
            setSnackBarMessage(errorMessage);
        } finally {
            setSnackBarOpen(true);
        }
    };


    return (
        <>
            <Snackbar
                open={snackBarOpen}
                onClose={handleCloseSnackBar}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackBar}
                    severity={snackType}
                    variant="filled"
                >
                    {snackBarMessage}
                </Alert>
            </Snackbar>

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <Card sx={{ p: 2, textAlign: "center", position: "relative" }}>
                            <IconButton
                                onClick={() => handleAddToCart(product.id)}
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    zIndex: 1,
                                    backgroundColor: "white",
                                    border: "1px solid #ccc",
                                    "&:hover": {
                                        backgroundColor: "#f0f0f0",
                                    },
                                }}
                                size="small"
                            >
                                <ShoppingCartIcon fontSize="small" color="primary" />
                            </IconButton>
                            <Box onClick={() => navigate(`/detail/${product.id}`)} sx={{
                                ":hover": {
                                    backgroundColor: "#f0f0f0",
                                    cursor: "pointer",
                                },
                            }}>
                                {product.imageUrl?.[0] && (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        sx={{
                                            width: "auto",
                                            maxWidth: "80%",
                                            objectFit: "contain",
                                            margin: "0 auto",
                                        }}
                                        image={product.imageUrl[0] || "https://similarpng.com/_next/image?url=https%3A%2F%2Fimage.similarpng.com%2Ffile%2Fsimilarpng%2Fvery-thumbnail%2F2020%2F09%2FApple-IPhone-8-Plus-on-transparent-background-PNG.png&w=3840&q=75"}
                                        alt={product.name}
                                    />
                                )}

                                <Typography variant="subtitle1" fontWeight="bold">
                                    {product.name}
                                </Typography>
                                <Typography>{product.price.toLocaleString()} VND</Typography>
                                <Typography>Brand: {product.brandName}</Typography>
                            </Box>

                            <Box mt={2} display="flex" justifyContent="center" gap={1}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleBuyNow(product.id)}
                                >
                                    Buy
                                </Button>
                                <Tooltip title="Add to wishlist">
                                    <IconButton onClick={() => toggleWishlist(product.id)}>
                                        {wishlist.includes(product.id) ? (
                                            <FavoriteIcon color="error" />
                                        ) : (
                                            <FavoriteBorderIcon color="error" />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}