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
    IconButton,
} from "@mui/material";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../common/services/axiosInstance";
import { getToken } from "../../common/services/localStorageService";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BRANDS = ["APPLE", "SAMSUNG", "XIAOMI", "OPPO"];

export default function CreateProduct() {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        storage: "",
        ram: "",
        battery: "",
        color: "",
        brandName: "",
    });

    const [files, setFiles] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "info" });
    const navigate = useNavigate();
    const fileInputRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const removeImage = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value);
        });
        files.forEach((file) => {
            formData.append("images", file);
        });

        try {
            await axios.post("/mobile-shop/products", formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setSnackbar({ open: true, message: "Product created successfully!", type: "success" });
            setTimeout(() => navigate("/admin/products"), 1500);
        } catch (error) {
            console.error("CREATE ERROR", error);
            setSnackbar({ open: true, message: "Failed to create product.", type: "error" });
        }
    };

    return (
        <Box sx={{ mt: 10, px: 2 }}>
            <Paper sx={{ p: 4, maxWidth: 1000, mx: "auto", borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Create New Product
                </Typography>

                <Grid container spacing={4}>
                    {/* Left: Upload Image */}
                    <Grid item xs={12} md={5}>
                        <Button variant="outlined" component="label" fullWidth>
                            Upload Images
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                        </Button>

                        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {files.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: "relative",
                                        width: 100,
                                        height: 100,
                                        border: "1px solid #ccc",
                                        borderRadius: 1,
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            backgroundColor: "rgba(255,255,255,0.8)",
                                        }}
                                        onClick={() => removeImage(index)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Right: Product Info */}
                    <Grid item xs={12} md={7}>
                        <Grid container spacing={2}>
                            {[
                                { label: "Name", name: "name" },
                                { label: "Price (VND)", name: "price", type: "number" },
                                { label: "Storage", name: "storage" },
                                { label: "RAM", name: "ram" },
                                { label: "Battery", name: "battery" },
                                { label: "Color", name: "color" },
                            ].map(({ label, name, type = "text" }) => (
                                <Grid item xs={12} sm={6} key={name}>
                                    <TextField
                                        fullWidth
                                        label={label}
                                        name={name}
                                        value={product[name]}
                                        onChange={handleChange}
                                        type={type}
                                    />
                                </Grid>
                            ))}

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Brand"
                                    name="brandName"
                                    value={product.brandName}
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
                        Create
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
