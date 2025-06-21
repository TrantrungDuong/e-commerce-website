import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, Grid, TextField, Rating } from "@mui/material";
import axios from "../../common/services/axiosInstance";
import { getToken } from "../../common/services/localStorageService";

function PaymentStatus() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const responseCode = queryParams.get("vnp_ResponseCode");

    const isSuccess = responseCode === "00";
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [reviews, setReviews] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const orderId = queryParams.get("vnp_TxnRef");
            try {
                const response = await axios.get(`/mobile-shop/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setOrder(response.data.result);
            } catch (error) {
                console.error("Error fetching order details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isSuccess) {
            fetchOrder();
        }
    }, [isSuccess]);

    const handleReviewChange = (productId, field, value) => {
        setReviews((prevReviews) => ({
            ...prevReviews,
            [productId]: {
                ...prevReviews[productId],
                [field]: value,
            },
        }));
    };

    const handleSubmitReview = async (productId) => {
        const data = {
            productId: productId,
            rating: reviews[productId]?.rating || 0,
            comment: reviews[productId]?.comment || "",
        };

        try {
            await axios.post("/mobile-shop/reviews", data, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setReviews((prevReviews) => ({
                ...prevReviews,
                [productId]: { rating: 0, comment: "" },
            }));
            alert("Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 4, mt: 10 }}>
            <Paper sx={{ p: 4, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                {isSuccess ? (
                    <>
                        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                            Successful Payment!
                        </Typography>
                        <Typography variant="body1" sx={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            Thank you for your order. We will deliver your order as soon as possible!
                        </Typography>

                        {order && (
                            <>
                                <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
                                    Products You Purchased
                                </Typography>
                                <Grid container spacing={2}>
                                    {order.items.map((item) => (
                                        <Grid item xs={12} md={6} key={item.productId}>
                                            <Paper sx={{ p: 2 }}>
                                                <Typography variant="h6">{item.productName}</Typography>
                                                <Rating
                                                    name={`rating-${item.productId}`}
                                                    value={reviews[item.productId]?.rating || 0}
                                                    onChange={(e, newValue) => handleReviewChange(item.productId, "rating", newValue)}
                                                    sx={{ mb: 2 }}
                                                />
                                                <TextField
                                                    label="Leave a Comment"
                                                    multiline
                                                    rows={4}
                                                    fullWidth
                                                    value={reviews[item.productId]?.comment || ""}
                                                    onChange={(e) => handleReviewChange(item.productId, "comment", e.target.value)}
                                                    sx={{ mb: 2 }}
                                                />
                                                <Button variant="contained" onClick={() => handleSubmitReview(item.productId)}>
                                                    Submit Review
                                                </Button>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold", color: "error.main" }}>
                            Payment Failed
                        </Typography>
                        <Typography variant="body1" sx={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            Your payment could not be completed. Please try again.
                        </Typography>
                    </>
                )}
            </Paper>
        </Box>
    );
}

export default PaymentStatus;
