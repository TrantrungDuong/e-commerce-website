import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Home from "../components/Home";
import Authenticate from "../components/Authenticate";
import Profile from "../pages/Profile";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Detail from "../pages/Detail";
import Order from "../pages/Order";
import OrderList from "../pages/OrderList";
import SuccessfulPayment from "../pages/SuccessfulPayment";

const AppRoutes = () => {
  return (
      <Router>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/authenticate" element={<Authenticate />} />
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="/orders/:orderId" element={<Order/>} />
              <Route path={"/orders"} element={<OrderList/>}/>
              <Route path={"/order-success"} element={<SuccessfulPayment/>}/>
          </Routes>
      </Router>
  );
};

export default AppRoutes;
