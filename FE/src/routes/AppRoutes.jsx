import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../user/pages/Login";
import Authenticate from "../user/components/Authenticate";
import UserLayout from "../user/UserLayout";
import Home from "../user/pages/Home";
import Profile from "../user/pages/Profile";
import Cart from "../user/pages/Cart";
import Wishlist from "../user/pages/Wishlist";
import Detail from "../user/pages/ProductDetail";
import OrderList from "../user/pages/OrderList";
import OrderDetail from "../user/pages/OrderDetail";
import PaymentStatus from "../user/pages/PaymentStatus"
import AdminRoute from "../routes/AdminRoute";
import UserRoute from "./UserRouter";
import AdminLayout from "../admin/AdminLayout";
import ManageOrders from "../admin/pages/ManageOrders";
import ManageUsers from "../admin/pages/ManageUsers";
import ManageProducts from "../admin/pages/ManageProducts";
import Dashboard from "../admin/pages/Dashboard";
import AdminProductDetail from "../admin/pages/AdminProductDetail";
import CreateProduct from "../admin/pages/CreateProduct";
import UpdateProduct from "../admin/pages/UpdateProduct";
import AdminUserProfile from "../admin/pages/AdminUserProfile";
import CreateUser from "../admin/pages/CreateUser";
import Register from "../user/pages/Register";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/authenticate" element={<Authenticate />} />
                <Route path="/register" element={<Register/>} />


                <Route element={<UserRoute />}>
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="wishlist" element={<Wishlist />} />
                        <Route path="detail/:id" element={<Detail />} />
                        <Route path="orders" element={<OrderList />} />
                        <Route path="orders/:orderId" element={<OrderDetail />} />
                        <Route path="order-success" element={<PaymentStatus />} />
                    </Route>
                </Route>

                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard/>} />
                        <Route path="products" element={<ManageProducts/>} />
                        <Route path="orders" element={<ManageOrders />} />
                        <Route path="users" element={<ManageUsers />} />
                        <Route path="products/:id" element={<AdminProductDetail />} />
                        <Route path="products/create" element={<CreateProduct/>} />
                        <Route path="products/edit/:id" element={<UpdateProduct/>} />
                        <Route path="/admin/users/:userId" element={<AdminUserProfile/>} />
                        <Route path="users/create" element={<CreateUser/>} />


                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;