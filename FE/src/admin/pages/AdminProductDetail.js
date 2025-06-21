import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../common/services/localStorageService";
import axios from "../../common/services/axiosInstance";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    IconButton,
    Rating,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { Paper as CarouselPaper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";

export default function AdminProductDetail() {
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async (productId) => {
            try {
                const response = await axios.get(
                    `/mobile-shop/reviews/${productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }
                );
                setReviews(response.data.result || []);
            } catch (error) {
                console.error("FETCH REVIEWS ERROR", error);
            }
        };

        const fetchProduct = async () => {
            try {
                const response = await axios.get(
                    `/mobile-shop/products/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }
                );
                const fetchedProduct = response.data.result;
                setProduct(fetchedProduct);
                fetchReviews(fetchedProduct.id);
            } catch (error) {
                console.error("FETCH PRODUCT ERROR", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return (
        <Box sx={{ mt: 10, px: 4 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : product ? (
                <Paper
                    sx={{
                        p: 4,
                        maxWidth: 900,
                        mx: "auto",
                        position: "relative",
                    }}
                >
                    <IconButton
                        onClick={() => navigate("/admin")}
                        sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            zIndex: 10,
                            "&:hover": {
                                backgroundColor: "#f0f0f0",
                            },
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <IconButton
                        onClick={() =>
                            navigate(`/admin/products/edit/${product.id}`)
                        }
                        sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                        }}
                    >
                        <EditIcon color="primary" />
                    </IconButton>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Carousel>
                                {(product.imageUrl || []).map((img, index) => (
                                    <CarouselPaper key={index}>
                                        <img
                                            src={img}
                                            alt={`${product.name} - ${index}`}
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
                            <Typography variant="h5" fontWeight="bold">
                                {product.name}
                            </Typography>
                            <Typography color="text.secondary" sx={{ mt: 1 }}>
                                {product.brandName}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                {product.price.toLocaleString()} VND
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                Storage: {product.storage}
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                RAM: {product.ram}
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                Battery: {product.battery}
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                Color: {product.color}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 5 }}>
                        <Typography variant="h6">Reviews</Typography>
                        <Grid container spacing={2}>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <Grid item xs={12} key={review.id}>
                                        <Paper sx={{ p: 2 }}>
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                            >
                                                <Typography fontWeight="bold">
                                                    {review.username}
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    {format(
                                                        new Date(
                                                            review.createdAt
                                                        ),
                                                        "dd-MM-yyyy"
                                                    )}
                                                </Typography>
                                            </Box>
                                            <Rating
                                                value={review.rating}
                                                readOnly
                                            />
                                            <Typography>
                                                {review.comment}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))
                            ) : (
                                <Typography>
                                    No reviews available for this product.
                                </Typography>
                            )}
                        </Grid>
                    </Box>
                </Paper>
            ) : (
                <Typography color="error" align="center" mt={4}>
                    Product not found.
                </Typography>
            )}
        </Box>
    );
}
