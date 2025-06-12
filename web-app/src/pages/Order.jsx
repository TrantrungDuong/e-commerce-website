import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import axios from "../services/axiosInstance";
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
    Snackbar
} from "@mui/material";
import Header from "../components/header/Header";
import Sidebar from "../components/Sidebar";

export default function Order() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("error");
    const { orderId } = useParams(); // Lấy orderId từ URL
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
                const response = await axios.get(`/identity/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setOrder(response.data.result);
            } catch (error) {
                console.error("FETCH ORDER ERROR", error);
                showMessage("Không thể tải chi tiết đơn hàng.", "error");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        } else {
            setLoading(false);
            showMessage("Không có ID đơn hàng được cung cấp.", "warning");
        }
    }, [orderId]);

    const handleBackToOrders = () => {
        navigate("/");
    };

    const handleVNPayPayment = async () => {
        const token = getToken();  // Lấy token từ localStorage

        // Kiểm tra nếu không có token hoặc token không hợp lệ
        if (!token) {
            showMessage("Token không hợp lệ. Vui lòng đăng nhập lại.", "error");
            return;
        }

        try {
            const response = await axios.get(
                `/identity/payment/vn-pay/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Truyền token vào header
                    },
                }
            );

            if (response.data && response.data.result && response.data.result.payment_url) {
                const paymentUrl = response.data.result.payment_url;
                window.location.href = paymentUrl; // Chuyển hướng người dùng đến trang thanh toán VNPay
            } else {
                showMessage("Không thể lấy URL thanh toán từ VNPay.", "error");
            }
        } catch (error) {
            console.error("Error during VNPay payment:", error);

            // Kiểm tra lỗi phản hồi từ server
            if (error.response && error.response.status === 401) {
                showMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error");
            } else {
                showMessage("Có lỗi xảy ra khi xử lý thanh toán.", "error");
            }
        }
    };



    return (
        <>
            <Header />
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box sx={{ mt: 10, px: 4, flexGrow: 1 }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <CircularProgress />
                        </Box>
                    ) : order ? (
                        <Paper sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Order detail #{order.id}
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        <strong>Order date:</strong>  {new Date(order.createdAt).toLocaleString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        <strong>Status:</strong> {order.status}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                                Products
                            </Typography>
                            <List>
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item) => (
                                        <ListItem key={item.productId} disablePadding>
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
                                                secondary={`Giá: $${item.priceAtPurchase} mỗi sản phẩm`}
                                            />
                                            <Typography variant="body1" fontWeight="bold">
                                                Tổng: ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                                            </Typography>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2">No product is available</Typography>
                                )}
                            </List>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" color="primary" align="right" sx={{ mt: 2 }}>
                                Total: ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                            </Typography>

                            <Box mt={3} display="flex" justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleBackToOrders}
                                >
                                    Back to product list
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleVNPayPayment} // Gọi hàm thanh toán khi nhấn nút
                                >
                                    VNPay payment
                                </Button>
                            </Box>
                        </Paper>
                    ) : (
                        <Typography variant="h6" color="error">
                            Order not found
                        </Typography>
                    )}
                </Box>
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
