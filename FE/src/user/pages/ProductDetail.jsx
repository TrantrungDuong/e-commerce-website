import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../common/services/localStorageService";
import axios from "../../common/services/axiosInstance";
import { Box, Typography, CircularProgress, Paper, Button, Grid, TextField } from "@mui/material";
import Carousel from 'react-material-ui-carousel';
import { Paper as CarouselPaper } from "@mui/material";
import Rating from "@mui/material/Rating";
import { format } from "date-fns";


export default function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/mobile-shop/products/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setProduct(response.data.result);
            fetchReviews(response.data.result.id);
        } catch (error) {
            console.error("FETCH PRODUCT ERROR", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (productId) => {
        try {
            const response = await axios.get(`/mobile-shop/reviews/${productId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setReviews(response.data.result || []);
        } catch (error) {
            console.error("FETCH REVIEWS ERROR", error);
        }
    };

    const handleBack = () => {
        navigate("/");
    };


    useEffect(() => {
        fetchProduct();
    }, [id]);

    return (
        <Box sx={{ mt: 10, px: 4, flexGrow: 1 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : product ? (
                <Paper sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Carousel>
                                {product.imageUrl?.map((image, index) => (
                                    <CarouselPaper key={index}>
                                        <img
                                            src={image}
                                            alt={product.name}
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </CarouselPaper>
                                ))}
                            </Carousel>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                {product.name}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
                                {product.brandName}
                            </Typography>
                            <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                                {product.price.toLocaleString()} VND
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Storage: {product.storage}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                RAM: {product.ram}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Battery: {product.battery}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Color: {product.color}
                            </Typography>
                            <Button variant="outlined" sx={{ mt: 3, mr: 3 }} onClick={handleBack}>
                                Back to Products
                            </Button>
                            <Button variant="contained" sx={{ mt: 3 }}>
                                Buy
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Reviews Section */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">Reviews</Typography>
                        <Grid container spacing={2}>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <Grid item xs={12} key={review.id}>
                                        <Paper sx={{ p: 2 }}>
                                            <Box style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {review.username}
                                            </Typography>
                                            <Typography
                                                style={{ color: "#9e9e9e" }}
                                           >
                                                {format(new Date(review.createdAt), "dd-MM-yyyy")}
                                            </Typography>
                                            </Box>
                                            <Rating value={review.rating} readOnly />
                                            <Typography variant="body2">{review.comment}</Typography>
                                        </Paper>
                                    </Grid>
                                ))
                            ) : (
                                <Typography>No reviews available for this product.</Typography>
                            )}
                        </Grid>
                    </Box>
                </Paper>
            ) : (
                <Typography variant="h6" color="error">
                    Product not found.
                </Typography>
            )}
        </Box>
    );
}
