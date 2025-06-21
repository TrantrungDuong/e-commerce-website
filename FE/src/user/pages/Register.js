import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google"; // Import GoogleIcon
import { OAuthConfig } from "../../common/configurations/configuration"; // Import OAuthConfig
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../common/services/axiosInstance";

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState(""); // Định dạng YYYY-MM-DD
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("error");

    // Logic cho Google OAuth - Lấy từ Login.jsx
    const handleContinueWithGoogle = () => {
        const callbackUrl = OAuthConfig.redirectUri;
        const authUrl = OAuthConfig.authUri;
        const googleClientId = OAuthConfig.clientId;

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
            callbackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

        console.log(targetUrl);

        window.location.href = targetUrl;
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setSnackBarOpen(false);
    };

    const showError = (message) => {
        setSnackType("error");
        setSnackBarMessage(message);
        setSnackBarOpen(true);
    };

    const showSuccess = (message) => {
        setSnackType("success");
        setSnackBarMessage(message);
        setSnackBarOpen(true);
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        const data = {
            username,
            password,
            firstName,
            lastName,
            dob,
        };

        try {
            const response = await axios.post("/mobile-shop/users", data);

            if (response.status === 200) {
                showSuccess("Registration successful! Please login.");
                navigate("/login");
            } else {
                showError(response.data?.message || "Registration failed.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
            showError(errorMessage);
        }
    };

    return (
        <>
            <Snackbar
                open={snackBarOpen}
                onClose={handleCloseSnackBar}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackBar}
                    severity={snackType}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackBarMessage}
                </Alert>
            </Snackbar>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                bgcolor={"#f0f2f5"}
            >
                <Card
                    sx={{
                        minWidth: 250,
                        maxWidth: 450,
                        boxShadow: 4,
                        borderRadius: 4,
                        padding: 4,
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Create Your Account
                        </Typography>
                        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <TextField
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                            <TextField
                                label="Date of Birth"
                                type="date"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Box display="flex" flexDirection="column" width="100%" gap="25px">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleRegister}
                                fullWidth
                            >
                                Register
                            </Button>
                            {/* Nút Continue with Google được thêm vào đây */}
                            <Button
                                type="button"
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleContinueWithGoogle}
                                fullWidth
                                sx={{ gap: "10px" }}
                            >
                                <GoogleIcon />
                                Continue with Google
                            </Button>
                            <Divider></Divider>
                            <Button
                                type="button"
                                variant="text"
                                color="info"
                                onClick={() => navigate("/login")}
                                fullWidth
                            >
                                Already have an account? Login
                            </Button>
                        </Box>
                    </CardActions>
                </Card>
            </Box>
        </>
    );
}