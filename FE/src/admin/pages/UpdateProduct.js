import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Grid,
    Snackbar,
    Alert,
    ImageList,
    ImageListItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../common/services/axiosInstance";
import { getToken } from "../../common/services/localStorageService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BRANDS = ["APPLE", "SAMSUNG", "XIAOMI", "OPPO"];

export default function UpdateProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: "",
        price: "",
        storage: "",
        ram: "",
        battery: "",
        color: "",
        brandName: "",
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "info" });
    const navigate = useNavigate();

    // Fetch old data
    useEffect(() => {
        axios.get(`/mobile-shop/products/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        }).then((res) => {
            setProduct(res.data.result);
            setPreviewImages(res.data.result.imageUrl || []);
        }).catch((err) => {
            console.error("LOAD FAILED", err);
            setSnackbar({ open: true, message: "Failed to load product.", type: "error" });
        });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);

        // Preview
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value);
        });

        newImages.forEach((file) => {
            formData.append("images", file);
        });

        try {
            await axios.put(`/mobile-shop/products/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setSnackbar({ open: true, message: "Product updated successfully!", type: "success" });
            setTimeout(() => navigate("/admin/products"), 1500);
        } catch (error) {
            console.error("UPDATE ERROR", error);
            setSnackbar({ open: true, message: "Failed to update product.", type: "error" });
        }
    };

    return (
        <Box sx={{ mt: 10, px: 2 }}>
            <Paper sx={{ p: 4, maxWidth: 900, mx: "auto", borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Update Product
                </Typography>

                <Grid container spacing={3}>
                    {/* Image Section */}
                    <Grid item xs={12} sm={5}>
                        <Button variant="outlined" component="label" fullWidth>
                            Upload Images
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>

                        <ImageList cols={2} gap={8} sx={{ mt: 2 }}>
                            {previewImages.map((img, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        src={img}
                                        alt={`preview-${index}`}
                                        loading="lazy"
                                        style={{ borderRadius: 8 }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Grid>

                    {/* Input Fields */}
                    <Grid item xs={12} sm={7}>
                        <Grid container spacing={2}>
                            {[["Name", "name"], ["Price", "price"], ["Storage", "storage"], ["RAM", "ram"],
                                ["Battery", "battery"], ["Color", "color"]]
                                .map(([label, name]) => (
                                    <Grid item xs={12} key={name}>
                                        <TextField
                                            fullWidth
                                            label={label}
                                            name={name}
                                            value={product[name] || ""}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                ))}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Brand"
                                    name="brandName"
                                    value={product.brandName || ""}
                                    onChange={handleChange}
                                >
                                    {BRANDS.map((brand) => (
                                        <MenuItem key={brand} value={brand}>
                                            {brand}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Box mt={4} display="flex" justifyContent="space-between">
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/admin/products")}
                    >
                        Back
                    </Button>

                    <Button variant="contained" onClick={handleSubmit}>
                        Update
                    </Button>
                </Box>

            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.type}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
