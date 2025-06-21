import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Avatar,
    Grid,
    Divider,
    IconButton,
    TextField,
    Button,
} from "@mui/material";
import { format } from "date-fns";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { getToken } from "../../common/services/localStorageService";
import axios from "../../common/services/axiosInstance";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get("/mobile-shop/users/my-info", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setUser(response.data.result);
            setFormData(response.data.result);
        } catch (error) {
            console.error("FETCH USER INFO ERROR", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updatedData = { ...formData };
            if (updatedData.dob) {
                updatedData.dob = format(new Date(updatedData.dob), "yyyy-MM-dd");
            }
            if (!updatedData.password || updatedData.password.trim() === "") {
                delete updatedData.password;
            }
            delete updatedData.roles;

            const response = await axios.put(
                `/mobile-shop/users/${user.id}`,
                updatedData,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            setUser(response.data.result);
            setEditing(false);
        } catch (error) {
            console.error("UPDATE USER ERROR", error);
            if (error.response?.data?.message) {
                alert("Update failed: " + error.response.data.message);
            } else {
                alert("Update failed. Please try again.");
            }
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <>
                <Box sx={{ flexGrow: 1, mt: 10, px: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        User Information
                    </Typography>

                    {loading ? (
                        <CircularProgress />
                    ) : user ? (
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                maxWidth: 600,
                                mx: "auto",
                                borderRadius: 3,
                                backgroundColor: "#a6bddd",
                                position: "relative",
                            }}
                        >
                            {/* Edit Icon */}
                            <IconButton
                                size="small"
                                sx={{ position: "absolute", top: 8, right: 8 }}
                                onClick={() => setEditing((prev) => !prev)}
                            >
                                {editing ? <CloseIcon /> : <EditIcon />}
                            </IconButton>

                            {/* Avatar */}
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                                mb={3}
                                flexDirection="column"
                            >
                                <Avatar sx={{ width: 80, height: 80 }}>
                                    <AccountCircleIcon sx={{ fontSize: 60 }} />
                                </Avatar>
                                <Typography variant="h6">{user.username}</Typography>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {/* Form Grid */}
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        <strong>First Name</strong>
                                    </Typography>
                                    {editing ? (
                                        <TextField
                                            fullWidth
                                            name="firstName"
                                            value={formData.firstName || ""}
                                            onChange={handleChange}
                                            size="small"
                                        />
                                    ) : (
                                        <Typography>{user.firstName}</Typography>
                                    )}
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        <strong>Last Name</strong>
                                    </Typography>
                                    {editing ? (
                                        <TextField
                                            fullWidth
                                            name="lastName"
                                            value={formData.lastName || ""}
                                            onChange={handleChange}
                                            size="small"
                                        />
                                    ) : (
                                        <Typography>{user.lastName || "-"}</Typography>
                                    )}
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        <strong>Date of birth</strong>
                                    </Typography>
                                    {editing ? (
                                        <TextField
                                            fullWidth
                                            type="date"
                                            name="dob"
                                            value={formData.dob || ""}
                                            onChange={handleChange}
                                            size="small"
                                        />
                                    ) : (
                                        <Typography>
                                            {user.dob
                                                ? format(new Date(user.dob), "dd/MM/yyyy")
                                                : "-"}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>

                            {editing && (
                                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSave}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setFormData(user);
                                            setEditing(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    ) : (
                        <Typography color="error">Failed to load user info.</Typography>
                    )}
                </Box>
        </>
    );
}
