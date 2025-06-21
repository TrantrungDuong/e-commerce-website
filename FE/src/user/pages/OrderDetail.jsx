import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../common/services/localStorageService";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "../../common/services/axiosInstance";

import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    Snackbar, Chip
} from "@mui/material";
export default function OrderDetail() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("error");
    const { orderId } = useParams();
    const navigate = useNavigate();

    const handleCloseSnackBar = () => setSnackBarOpen(false);

    const showMessage = (message, type = "error") => {
        setSnackType(type);
        setSnackBarMessage(message);
        setSnackBarOpen(true);
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/mobile-shop/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setOrder(response.data.result);
            } catch (error) {
                console.error("FETCH ORDER ERROR", error);
                showMessage("Can not display order", "error");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        } else {
            setLoading(false);
            showMessage("Id product not found", "warning");
        }
    }, [orderId]);

    const handleBackToOrders = () => {
        navigate("/orders");
    };

    const handleVNPayPayment = async () => {
        const token = getToken();
        if (!token) {
            showMessage("Token invalid. please login to the system", "error");
            return;
        }

        try {
            const response = await axios.get(
                `/mobile-shop/payment/vn-pay/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.result && response.data.result.payment_url) {
                const paymentUrl = response.data.result.payment_url;
                window.location.href = paymentUrl;
            } else {
                showMessage("Can not handle payment with VNPay", "error");
            }
        } catch (error) {
            console.error("Error during VNPay payment:", error);
            if (error.response && error.response.status === 401) {
                showMessage("please! login to the system", "error");
            } else {
                showMessage("Errors occur in payment process", "error");
            }
        }
    };

    const handleCancelPayment = async () => {
        try {
            await axios.put(`/mobile-shop/orders/${orderId}/cancel`, null, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            showMessage("Cancel order successfully", "success");
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            console.error("CANCEL ORDER ERROR", error);
            showMessage("Can not cancel order!", "error");
        }
    };




    return (
        <>
                <Box sx={{ mt: 10, px: 4, flexGrow: 1 }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <CircularProgress />
                        </Box>
                    ) : order ? (
                        <Paper sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Order #{order.id}
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        <strong>Order date:</strong>  {new Date(order.createdAt).toLocaleString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                        <Typography>
                                            <Chip label={order.status} color="info"/>
                                        </Typography>
                                </Grid>

                            </Grid>

                            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                                Products
                            </Typography>
                            <List>
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <Box key={item.productId}>
                                            <ListItem disablePadding>
                                                <img
                                                    src={item.imageUrl?.[0]}
                                                    alt={item.productName}
                                                    style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        marginRight: '16px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <ListItemText
                                                    primary={`${item.productName} (x${item.quantity})`}
                                                    secondary={`${item.priceAtPurchase.toLocaleString()} VND`}
                                                />
                                                <Typography variant="body1" fontWeight="bold">
                                                    {(item.priceAtPurchase.toLocaleString())}VND
                                                </Typography>
                                            </ListItem>
                                            {index !== order.items.length - 1 && <Divider sx={{ my: 1 }} />}
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2">No product is available</Typography>
                                )}
                            </List>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" color="primary" align="right" sx={{ mt: 2 }}>
                                Total: {order.totalAmount ? `${order.totalAmount.toLocaleString()}VND` : '0.00'}
                            </Typography>

                            <Box mt={3} display="flex" justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleBackToOrders}
                                >
                                    <ArrowBackIcon />
                                </Button>

                                {order.status === "PENDING" && (
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleCancelPayment}
                                        >
                                            Cancel payment
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={handleVNPayPayment}
                                            startIcon={
                                                <img
                                                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                                                    alt="VNPay"
                                                    style={{ width: 24, height: 24 }}
                                                />
                                            }
                                            sx={{ ml: 2 }}
                                        >
                                            Payment
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                        </Paper>
                    ) : (
                        <Typography variant="h6" color="error">
                            Order not found
                        </Typography>
                    )}
                </Box>
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackBar}
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
        </>
    );
}
