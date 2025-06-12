import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import axios from "../services/axiosInstance";
import { Box, Typography, CircularProgress, Paper, Button, Grid } from "@mui/material";
import Header from "../components/header/Header";
import Sidebar from "../components/Sidebar";
import Carousel from 'react-material-ui-carousel';
import { Paper as CarouselPaper } from "@mui/material";

export default function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/identity/products/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setProduct(response.data.result);
        } catch (error) {
            console.error("FETCH PRODUCT ERROR", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleBack = () => {
        navigate("/");
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
                                        Price: ${product.price}
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
                        </Paper>
                    ) : (
                        <Typography variant="h6" color="error">
                            Product not found.
                        </Typography>
                    )}
                </Box>
            </Box>
        </>
    );
}
