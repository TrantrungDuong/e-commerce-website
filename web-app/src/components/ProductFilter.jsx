import { Box, Button, Stack, Typography } from "@mui/material";

export default function ProductFilter({ onFilter }) {
    const handleFilterClick = (type) => {
        if (onFilter) onFilter(type);
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
            <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold">
                    Filter:
                </Typography>
                <Button variant="outlined" onClick={() => handleFilterClick("priceAsc")}>
                    Price Asc
                </Button>
                <Button variant="outlined" onClick={() => handleFilterClick("priceDesc")}>
                    Price Desc
                </Button>
            </Stack>
        </Box>
    );
}
