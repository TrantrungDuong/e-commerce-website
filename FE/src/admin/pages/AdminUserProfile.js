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
    Switch,
    FormControlLabel,
    FormGroup,
} from "@mui/material";
import { format } from "date-fns";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getToken } from "../../common/services/localStorageService";
import axios from "../../common/services/axiosInstance";

export default function AdminUserProfile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const fetchUser = async () => {
        try {
            const response = await axios.get(`/mobile-shop/users/${userId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setUser(response.data.result);
            setFormData(response.data.result);
        } catch (error) {
            console.error("FETCH USER ERROR", error);
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
                `/mobile-shop/users/${userId}`,
                updatedData,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            setUser(response.data.result);
            setEditing(false);
        } catch (error) {
            console.error("UPDATE USER ERROR", error);
            alert("Failed to update user");
        }
    };

    const handleRoleToggle = async (roleName, checked) => {
        try {
            const updatedRoles = new Set(user.roles.map((r) => r.name));

            if (checked) {
                updatedRoles.add(roleName);
            } else {
                updatedRoles.delete(roleName);
            }

            const rolesArray = Array.from(updatedRoles);

            await axios.put(`/mobile-shop/users/${userId}/roles`, rolesArray, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            fetchUser();
        } catch (error) {
            console.error("UPDATE ROLE ERROR", error);
            alert("Failed to update roles");
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    return (
        <Box sx={{ flexGrow: 1, mt: 10, px: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                User Profile - Admin View
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
                        backgroundColor: "#f0f4ff",
                        position: "relative",
                    }}
                >
                    <IconButton
                        size="small"
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        onClick={() => setEditing((prev) => !prev)}
                    >
                        {editing ? <CloseIcon /> : <EditIcon />}
                    </IconButton>

                    <Box display="flex" alignItems="center" flexDirection="column" gap={2} mb={3}>
                        <Avatar sx={{ width: 80, height: 80 }}>
                            <AccountCircleIcon sx={{ fontSize: 60 }} />
                        </Avatar>
                        <Typography variant="h6">{user.username}</Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

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
                                <strong>Date of Birth</strong>
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

                    {/* Toggle Role Controls */}
                    <FormGroup sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Roles
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={user.roles.some((r) => r.name === "USER")}
                                    onChange={(e) => handleRoleToggle("USER", e.target.checked)}
                                />
                            }
                            label="USER"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={user.roles.some((r) => r.name === "ADMIN")}
                                    onChange={(e) => handleRoleToggle("ADMIN", e.target.checked)}
                                />
                            }
                            label="ADMIN"
                        />
                    </FormGroup>

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
                <Typography color="error">Failed to load user data.</Typography>
            )}
        </Box>
    );
}
