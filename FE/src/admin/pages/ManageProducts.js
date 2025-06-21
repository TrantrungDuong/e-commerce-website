import { useEffect, useState, useMemo } from "react";
import axios from "../../common/services/axiosInstance";
import { useNavigate } from "react-router-dom";
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
    IconButton,
    TextField,
    Button,
} from "@mui/material";
import { getToken } from "../../common/services/localStorageService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { debounce } from "lodash";

export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("info");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "info" });
    const [searchKeyword, setSearchKeyword] = useState("");
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/mobile-shop/products", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setProducts(response.data.result || []);
        } catch (error) {
            console.error("FETCH PRODUCTS ERROR", error);
            setSnackBarMessage("Failed to fetch products.");
            setSnackType("error");
            setSnackBarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (keyword) => {
        if (!keyword.trim()) {
            fetchProducts();
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`/mobile-shop/products/search-products`, {
                params: { name: keyword },
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setProducts(response.data.result || []);
        } catch (error) {
            console.error("SEARCH PRODUCTS ERROR", error);
            setSnackbar({
                open: true,
                message: "Failed to search products.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // debounce chỉ khởi tạo một lần
    const debouncedSearch = useMemo(
        () => debounce((keyword) => handleSearch(keyword), 300),
        []
    );

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`/mobile-shop/products/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            setProducts((prev) => prev.filter((product) => product.id !== id));

            setSnackbar({
                open: true,
                message: "Product deleted successfully!",
                type: "success",
            });
        } catch (error) {
            console.error("DELETE PRODUCT ERROR", error);
            setSnackbar({
                open: true,
                message: "Failed to delete product.",
                type: "error",
            });
        }
    };

    useEffect(() => {
        fetchProducts();
        return () => {
            debouncedSearch.cancel(); // cleanup debounce khi unmount
        };
    }, []);

    return (
        <>
            <Box sx={{ flexGrow: 1, mt: 10, px: 2 }}>
                <Box sx={{ maxWidth: 900, mx: "auto", position: "relative" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" fontWeight="bold">
                            Products
                        </Typography>

                        <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                                size="small"
                                placeholder="Search by product name"
                                value={searchKeyword}
                                onChange={(e) => {
                                    const keyword = e.target.value;
                                    setSearchKeyword(keyword);
                                    debouncedSearch(keyword);
                                }}
                            />
                            <IconButton
                                onClick={() => navigate("/admin/products/create")}
                                sx={{
                                    backgroundColor: "white",
                                    padding: 1.2,
                                    borderRadius: "12px",
                                    boxShadow: 2,
                                    "&:hover": {
                                        backgroundColor: "#f0f0f0",
                                        boxShadow: 4,
                                    },
                                }}
                                title="Create Product"
                            >
                                <AddIcon color="success" sx={{ fontSize: 28 }} />
                            </IconButton>
                        </Box>
                    </Box>

                    {loading ? (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <CircularProgress />
                        </Box>
                    ) : products.length === 0 ? (
                        <Typography>No products available.</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="product table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Brand</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow
                                            key={product.id}
                                            hover
                                            sx={{
                                                cursor: "pointer",
                                                "&:hover": {
                                                    backgroundColor: "#f5f5f5",
                                                },
                                            }}
                                            onClick={() => navigate(`/admin/products/${product.id}`)}
                                        >
                                            <TableCell>
                                                <img
                                                    src={product.imageUrl[0]}
                                                    alt={product.name}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.price.toLocaleString()} VND</TableCell>
                                            <TableCell>{product.brandName}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/products/edit/${product.id}`);
                                                    }}
                                                >
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteProduct(product.id);
                                                    }}
                                                >
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open || snackBarOpen}
                autoHideDuration={4000}
                onClose={() => {
                    setSnackBarOpen(false);
                    setSnackbar((prev) => ({ ...prev, open: false }));
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity={snackbar.type || snackType}
                    onClose={() => {
                        setSnackBarOpen(false);
                        setSnackbar((prev) => ({ ...prev, open: false }));
                    }}
                    variant="filled"
                >
                    {snackbar.message || snackBarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
