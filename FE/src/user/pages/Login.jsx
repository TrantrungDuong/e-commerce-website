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

import GoogleIcon from "@mui/icons-material/Google";
import { OAuthConfig } from "../../common/configurations/configuration";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "../../common/services/localStorageService";
import axios from "../../common/services/axiosInstance";
import {useCart} from "../../common/context/CartContext";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();

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

  useEffect(() => {
    const accessToken = getToken();

    if (accessToken) {
      const loadCartAndRedirect = async () => {
        await fetchCartCount();
        navigate("/");
      };

      loadCartAndRedirect();
    }
  }, [navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");
  const { fetchCartCount } = useCart();


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


  const handleLogin = async (event) => {
    event.preventDefault();
    const data = { username, password };

    try {
      const response = await axios.post("/mobile-shop/auth/token", data);

      const accessToken = response.data.result?.token;

      if (!accessToken) {
        throw new Error("Login failed: No access token received.");
      }

      setToken(accessToken);

      const decoded = jwtDecode(accessToken);
      const role = decoded.scope;
      localStorage.setItem("role", role);

      await fetchCartCount();

      if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message || "Login failed.");
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
                maxWidth: 400,
                boxShadow: 4,
                borderRadius: 4,
                padding: 4,
              }}
          >
            <CardContent>
              <Typography variant="h5" component="h1" gutterBottom>
                Welcome to Ecommerce-Website
              </Typography>
              <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    onClick={handleLogin}
                    fullWidth
                >
                  Login
                </Button>
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
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => navigate("/register")}
                >
                  Create an account
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Box>
      </>
  );
}