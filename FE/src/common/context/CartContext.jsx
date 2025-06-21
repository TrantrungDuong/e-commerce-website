import { createContext, useContext, useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { getToken } from "../services/localStorageService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const loadCartCount = async () => {
        try {
            const response = await axios.get("/mobile-shop/cart", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            const cart = response.data.result || { items: [] };
            const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalQuantity);
        } catch (error) {
            console.error("LOAD CART COUNT ERROR", error);
            setCartCount(0);
        }
    };

    useEffect(() => {
        if (getToken()) {
            loadCartCount();
        }
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount: loadCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
