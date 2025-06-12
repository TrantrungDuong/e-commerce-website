import { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { getToken } from "../services/localStorageService";
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    Snackbar,
    Alert,
    Chip,
    Divider,
} from "@mui/material";
import Header from "../components/header/Header";
import Sidebar from "../components/Sidebar";

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("info");

    const fetchOrders = async () => {
        try {
            const response = await axios.get("/identity/orders", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setOrders(response.data.result || []);
        } catch (error) {
            console.error("FETCH ORDER ERROR", error);
            setSnackType("error");
            setSnackBarMessage("Failed to load orders.");
            setSnackBarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatDate = (iso) => new Date(iso).toLocaleString("en-GB");

    return (
        <>
            <Header />
            <Box display="flex">
                <Sidebar />
                <Box sx={{ flexGrow: 1, mt: 10, px: 2 }}>
                    <Box sx={{ maxWidth: 700, mx: "auto" }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            My Orders
                        </Typography>

                        {loading ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress />
                            </Box>
                        ) : orders.length === 0 ? (
                            <Typography>No orders found.</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {orders.map((order) => (
                                    <Grid item xs={12} key={order.id}>
                                        <Paper
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                                border: "1px solid #ccc",
                                                borderRadius: 2,
                                                p: 2,
                                                gap: 2,
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    Order #{order.id}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Created at: {formatDate(order.createdAt)}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography>
                                                    Total:{" "}
                                                    <strong>
                                                        ${order.totalAmount?.toLocaleString()}
                                                    </strong>
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Chip
                                                    label={order.status}
                                                    color={
                                                        order.status === "PENDING"
                                                            ? "info"
                                                            : order.status === "CANCELLED"
                                                                ? "error"
                                                                : "success"
                                                    }
                                                    size="small"
                                                />
                                            </Box>
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
        </>
    );
}
