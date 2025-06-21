import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../common/services/localStorageService";
import ProductList from "../components/ProductList";
import axios from "../../common/services/axiosInstance";
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import ProductFilter from "../components/ProductFilter";

const BRANDS = ["APPLE", "SAMSUNG", "XIAOMI", "OPPO"];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");

  const handleCloseSnackBar = () => setSnackBarOpen(false);

  const showError = (message) => {
    setSnackType("error");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/mobile-shop/products", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProducts(response.data.result || []);
    } catch (err) {
      console.error("PRODUCT FETCH ERROR", err);
      showError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (type, brand) => {
    setLoading(true);
    try {
      let url = "/mobile-shop/products";

      if (type === "priceAsc") url += "/filter/price/asc";
      else if (type === "priceDesc") url += "/filter/price/desc";
      else if (brand) url += `/filter/by-brand?brandName=${brand}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProducts(response.data.result || []);
    } catch (error) {
      console.error("FILTER ERROR", error);
      showError("Failed to filter products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken) {
      navigate("/login");
      return;
    }
    getProducts();
  }, [navigate]);

  return (
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
        <ProductFilter onFilter={handleFilter} brands={BRANDS} />

        <Snackbar
            open={snackBarOpen}
            onClose={handleCloseSnackBar}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackBar} severity={snackType} variant="filled">
            {snackBarMessage}
          </Alert>
        </Snackbar>

        <Box sx={{ p: 4 }}>
          {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
          ) : products.length > 0 ? (
              <ProductList products={products} />
          ) : (
              <Typography>No products available</Typography>
          )}
        </Box>
      </Box>
  );
}
