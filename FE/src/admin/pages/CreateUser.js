import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../common/services/axiosInstance";
import { getToken } from "../../common/services/localStorageService";

export default function CreateUser() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        dob: "",
    });
    const [loading, setLoading] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/mobile-shop/users", formData, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setSnack({ open: true, message: "User created successfully!", severity: "success" });
            setTimeout(() => navigate("/admin/users"), 1500);
        } catch (error) {
            console.error("CREATE USER ERROR", error);
            const msg = error.response?.data?.message || "Failed to create user.";
            setSnack({ open: true, message: msg, severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, mt: 10, px: 4 }}>
            <Paper sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Create New User
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />

                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Create User"}
                        </Button>
                    </Box>
                </form>
            </Paper>

            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity={snack.severity}
                    onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
                    variant="filled"
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
