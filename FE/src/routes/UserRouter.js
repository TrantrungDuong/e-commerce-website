import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../common/services/localStorageService";

const UserRoute = () => {

    const token = getToken();

    if (!token) {
        return <Navigate to="/login" />;
    }
    const decoded = jwtDecode(token);
    if (decoded.scope === "ROLE_USER") {
        return <Outlet />;
    }
    return <Navigate to="/" />;
};

export default UserRoute;