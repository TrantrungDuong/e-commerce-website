import Header from "../components/header/Header";
import { Box, Typography, Paper } from "@mui/material";
import Sidebar from "../components/Sidebar";
import FavoriteIcon from "@mui/icons-material/Favorite";

function SuccessfulPayment() {
    return (
        <>
            <Header />
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box sx={{ flexGrow: 1, padding: 4, mt: 10 }}>
                    <Paper sx={{ p: 4, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                            Successful Payment!
                        </Typography>

                        <img
                            src="https://myim3banner.kloc.co/assets/uploads/payment_success_bg_1696413362.png"
                            alt="Thanh toán thành công"
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                height: 'auto',
                                objectFit: 'contain',
                                marginBottom: '20px',
                            }}
                        />
                        <Typography variant="body1" sx={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            Thank you for your order. We will deliver your order as soon as possible!
                            <FavoriteIcon color="error" sx={{ marginLeft: 1 }} />
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </>
    );
}

export default SuccessfulPayment;
