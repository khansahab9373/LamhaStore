// import { StrictMode } from 'react'
import "./App.css";

import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./context/AuthContext.jsx";
import CartProvider from "./context/CartContext.jsx";
import { AlertProvider } from "./context/AlertContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx"; // ✅ ADD
import WishlistProvider from "./context/WishlistContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      {" "}
      {/* ✅ THEME GLOBAL */}
      <AuthProvider>
        <WishlistProvider>
          <AlertProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AlertProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
