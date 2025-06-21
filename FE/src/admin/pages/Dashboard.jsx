import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography} from "@mui/material";
import { Line } from "react-chartjs-2";
import axiosInstance from "../../common/services/axiosInstance";
import { getToken } from "../../common/services/localStorageService";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {AttachMoney, People, ShoppingCart} from "@mui/icons-material";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [topSelling, setTopSelling] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalOrders, setTotalOrders] = useState("");
    const [totalUsers, setTotalUsers] = useState("");
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState("")



    const fetchTopSelling = async () => {
        const token = getToken();
        if (!token) {
            return;
        }

        try {
            const topSellingResponse = await axiosInstance.get("/mobile-shop/products/top-selling", {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Thêm token vào header
                }
            });
            setTopSelling(topSellingResponse.data.result || []);

            const getTotalOrders = await axiosInstance.get("/mobile-shop/orders/total-order", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
            setTotalOrders(getTotalOrders.data.result);

            const getTotalUsers = await axiosInstance.get("/mobile-shop/users/total-user", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
            setTotalUsers(getTotalUsers.data.result);

            const getTotalRevenue = await axiosInstance.get("/mobile-shop/orders/total-paid-revenue", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
            setTotalRevenue(getTotalRevenue.data.result);

            const getMonthlyRevenue = await axiosInstance.get("/mobile-shop/products/monthly", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });

            const revenueData = getMonthlyRevenue.data.result;
            const labels = revenueData.map(item => `${item.month}-${item.year}`);
            const data = revenueData.map(item => item.totalRevenue);

            setMonthlyRevenue({
                labels,
                datasets: [
                    {
                        label: "Monthly Revenue",
                        data,
                        borderColor: 'rgb(18,188,9)',
                        backgroundColor: 'rgba(214,209,209,0.2)',
                    }
                ]
            });

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopSelling();
    }, []);

    return (
        <Box sx={{ mt: 10, px: 4, flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ height: '150px', backgroundColor: '#e1f5fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <AttachMoney sx={{ fontSize: 40, color: '#0288d1' }} /> {/* Icon for Revenue */}
                                    <div>
                                        <Typography variant="h5" component="div">Revenue</Typography>
                                        <Typography variant="h6">
                                            {totalRevenue != null ? Number(totalRevenue).toLocaleString() : "N/A"}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Card sx={{ height: '150px', backgroundColor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <ShoppingCart sx={{ fontSize: 40, color: '#ff9800' }} /> {/* Icon for Total Orders */}
                                    <div>
                                        <Typography variant="h5" component="div">Total Orders</Typography>
                                        <Typography variant="h6">{totalOrders}</Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Card sx={{ height: '150px', backgroundColor: '#c8e6c9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <People sx={{ fontSize: 40, color: '#388e3c' }} /> {/* Icon for Total Users */}
                                    <div>
                                        <Typography variant="h5" component="div">Total Users</Typography>
                                        <Typography variant="h6">{totalUsers}</Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">Monthly Revenue</Typography>
                                    {monthlyRevenue.labels && (
                                        <Line data={monthlyRevenue} />
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div" sx={{ mb: 2 }}>Top-Selling</Typography>
                            <Box sx={{ maxHeight: 'calc(100vh - 308px)', overflowY: 'auto' }}>
                                {loading ? (
                                    <Typography>Loading...</Typography>
                                ) : (
                                    topSelling.length > 0 ? (
                                        topSelling.map((product, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                    pb: 2,
                                                    borderBottom: '1px solid #eee'
                                                }}
                                            >
                                                {product.imageUrl && (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.productName}
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            marginRight: "16px"
                                                        }}
                                                    />
                                                )}
                                                <Box>
                                                    <Typography variant="h6">{product.productName}</Typography>
                                                    <Typography variant="body2">Sold: {product.totalSold}</Typography>
                                                </Box>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography>No product on top-selling</Typography>
                                    )
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
