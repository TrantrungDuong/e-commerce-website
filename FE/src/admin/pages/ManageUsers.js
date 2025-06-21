import { useEffect, useState } from "react";
import axios from "../../common/services/axiosInstance";
import { getToken } from "../../common/services/localStorageService";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    IconButton,
    Snackbar,
    Alert,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackType, setSnackType] = useState("info");
    const navigate = useNavigate();


    const fetchUsers = async () => {
        try {
            const response = await axios.get("/mobile-shop/users", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setUsers(response.data.result || []);
        } catch (error) {
            console.error("FETCH USERS ERROR", error);
            setSnackBarMessage("Failed to fetch users.");
            setSnackType("error");
            setSnackBarOpen(true);
        } finally {
            setLoading(false);
        }
    };
    const handleUpdate = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleRemove = async (userId) => {
        try {
            await axios.delete(`/mobile-shop/users/${userId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setSnackBarMessage("User removed.");
            setSnackType("success");
            setSnackBarOpen(true);
            fetchUsers();
        } catch (error) {
            console.error("REMOVE USER ERROR", error);
            setSnackBarMessage("Failed to remove user.");
            setSnackType("error");
            setSnackBarOpen(true);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm để render Chip dựa trên role
    const renderRoleChips = (roles) => {
        return roles.map((role) => {
            switch (role.name) {
                case "ADMIN":
                    return <Chip label={role.name} color="error" sx={{ margin: 0.5 }} />;
                case "USER":
                    return <Chip label={role.name} color="primary" sx={{ margin: 0.5 }} />;
                default:
                    return <Chip label={role.name} sx={{ margin: 0.5 }} />;
            }
        });
    };

    return (
        <>
            <Box sx={{ flexGrow: 1, mt: 10, px: 2 }}>
                <Box sx={{ maxWidth: 900, mx: "auto" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" fontWeight="bold">
                            Users
                        </Typography>
                        <IconButton
                            onClick={() => navigate("/admin/users/create")}
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


                    {loading ? (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <CircularProgress />
                        </Box>
                    ) : users.length === 0 ? (
                        <Typography>No users available.</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>First Name</TableCell>
                                        <TableCell>Last Name</TableCell>
                                        <TableCell>Roles</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            hover
                                            sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                                            onClick={() => navigate(`/admin/users/${user.id}`)}
                                        >
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.firstName}</TableCell>
                                            <TableCell>{user.lastName}</TableCell>
                                            <TableCell>
                                                {renderRoleChips(user.roles)} {/* Hiển thị role dưới dạng Chip */}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleUpdate(user.id)}>
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton onClick={() => handleRemove(user.id)}>
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
                open={snackBarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackBarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={snackType} onClose={() => setSnackBarOpen(false)} variant="filled">
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
