// Updated App.jsx with proper imports and routes
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";

// Import pages
import { Home } from "./Pages/Home";
import { Cart } from "./Pages/Cart";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Wishlist } from "./Pages/Wishlist";
import OrderSuccess from "./Pages/Ordersuccess";
import { SearchResultsPage } from "./Pages/SearchResult";
import ProductDetails from "./Pages/ProductDetails";
import Checkout from "./Pages/Checkout";
import PageNotFound from "./Pages/PageNotFound";
import Category from "./Pages/Category"; // Import the new Category page
import Profile from "./Pages/Profile";
import Orders from "./Pages/Orders";
import Shop from "./Pages/Shop"; // Import Shop page

// Use the useAuth hook for authentication
import { useAuth } from "./context/AuthContext";

import AIAssistant from "./components/AIAssistant";

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="page-loading flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// PrivateRoute component using useAuth for authentication check
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:category" element={<Category />} />{" "}
          {/* New route for Category page */}
          {/* Protected routes */}
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <PrivateRoute>
                <OrderSuccess />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          {/* 404 route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>

      {/* Global AI Assistant Floating Chatbot */}
      <AIAssistant />
    </>
  );
}

export default App;
