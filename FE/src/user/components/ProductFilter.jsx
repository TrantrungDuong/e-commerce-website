import { Box, Button, Stack, Typography, Select, MenuItem } from "@mui/material";
import { useState } from "react";

const BRANDS = ["APPLE", "SAMSUNG", "XIAOMI", "OPPO"];

export default function ProductFilter({ onFilter }) {
    const [selectedBrand, setSelectedBrand] = useState("");

    const handlePriceFilter = (type) => {
        setSelectedBrand("");
        if (onFilter) onFilter(type, null);
    };

    const handleBrandChange = (event) => {
        const brand = event.target.value;
        setSelectedBrand(brand);
        if (onFilter) onFilter(null, brand);
    };

    return (
        <Box
            sx={{
                width: "100%",
                px: 4,
                py: 2,
                mt: 8,
                bgcolor: "#f1f1f1",
                borderBottom: "1px solid #ddd",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                zIndex: 0,
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Typography variant="subtitle1" fontWeight="bold">
                    Filter:
                </Typography>

                <Button variant="outlined" onClick={() => handlePriceFilter("priceAsc")}>
                    Price Asc
                </Button>
                <Button variant="outlined" onClick={() => handlePriceFilter("priceDesc")}>
                    Price Desc
                </Button>

                <Select
                    size="small"
                    value={selectedBrand}
                    displayEmpty
                    onChange={handleBrandChange}
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="">All</MenuItem>
                    {BRANDS.map((brand) => (
                        <MenuItem key={brand} value={brand}>
                            {brand}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
        </Box>
    );
}
