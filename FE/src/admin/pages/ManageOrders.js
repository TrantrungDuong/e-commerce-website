import React, { useEffect, useState } from "react";
import axios from "../../common/services/axiosInstance";
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert,
    Chip,
} from "@mui/material";
import { getToken } from "../../common/services/localStorageService";

export default function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("info");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/mobile-shop/orders/all-orders", {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setOrders(response.data); // Lưu dữ liệu vào state
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
                setSnackBarMessage("Failed to fetch orders.");
                setSnackType("error");
                setSnackBarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }
    const renderStatusChip = (status) => {
        switch (status) {
            case "PAID":
                return <Chip label={status} color="success" />;
            case "PENDING":
                return <Chip label={status} color="primary" />;
            case "CANCELLED":
                return <Chip label={status} color="error" />;
            default:
                return <Chip label={status} />;
        }
    };

    return (
        <>
            <Box sx={{ flexGrow: 1, mt: 10, px: 2 }}>
                <Box sx={{ maxWidth: 900, mx: "auto" }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Orders
                    </Typography>

                    {orders.length === 0 ? (
                        <Typography>No orders available.</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="orders table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Order ID</TableCell>
                                        <TableCell>User Information</TableCell>
                                        <TableCell>Total Amount</TableCell>
                                        <TableCell>Created At</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{order.username}</TableCell>
                                            <TableCell>{order.totalAmount.toLocaleString()} VND</TableCell>
                                            <TableCell>
                                                {new Date(order.createdAt).toLocaleDateString("en-GB")}
                                            </TableCell>
                                            <TableCell>{renderStatusChip(order.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Box>

            <Snackbar
                open={snackBarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackBarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={snackType} onClose={() => setSnackBarOpen(false)} variant="filled">
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
