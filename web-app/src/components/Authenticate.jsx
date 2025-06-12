// src/components/Authenticate.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setToken } from "../services/localStorageService";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "../services/axiosInstance";

export default function Authenticate() {
    const navigate = useNavigate();
    const [isLoggedin, setIsLoggedin] = useState(false);

    useEffect(() => {
        console.log(window.location.href);

        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
            const authCode = isMatch[1];

            axios
                .post(`/identity/auth/outbound/authentication?code=${authCode}`)
                .then((response) => {
                    const data = response.data;
                    console.log(data);

                    setToken(data.result?.token);
                    setIsLoggedin(true);
                })
                .catch((error) => {
                    console.error("Authentication failed", error);
                    navigate("/login");
                });
        }
    }, [navigate]);

    useEffect(() => {
        if (isLoggedin) {
            navigate("/");
        }
    }, [isLoggedin, navigate]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
                <Typography>Authenticating...</Typography>
            </Box>
        </>
    );
}
