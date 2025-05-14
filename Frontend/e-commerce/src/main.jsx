// Updated main.jsx with proper provider structure
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/cart-context.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WishlistProvider } from "./context/wishlist-context.jsx";

// Create a root wrapper to properly nest all providers
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* Auth provider should be the outermost custom context */}
      <AuthProvider>
        {/* Cart provider depends on auth information */}
        <CartProvider>
          {/* Wishlist provider uses both auth and potentially cart information */}
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
