// AuthContext.jsx - Comprehensive Auth Provider Implementation
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the Auth Context
const AuthContext = createContext();

// Base URL for API requests
const API_BASE_URL = "https://shop-smart-e-commerce.onrender.com";

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
  // State for authentication status and loading
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // State for user data
  const [user, setUser] = useState(null);

  // For navigation
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Comprehensive authentication check function
  const checkAuthStatus = useCallback(() => {
    setIsAuthLoading(true);
    try {
      // Check multiple sources to determine auth status
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const isLoggedInFlag = localStorage.getItem("isAuthenticated") === "true";
      const userData = localStorage.getItem("user");

      // Consider user authenticated if any of these are true
      const authenticated = !!(token || isLoggedInFlag || userData);

      setIsAuthenticated(authenticated);

      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);

          // Set authorization header for future requests
          if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          // Clear invalid data
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }

    return isAuthenticated;
  }, [isAuthenticated]);

  // Handle login
  const login = useCallback(
    async (email, password, rememberMe = false) => {
      setIsAuthLoading(true);

      try {
        // Make API request to login
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        });

        // Extract token and user data from response
        const { accessToken, user } = response.data;

        // Store token based on remember me preference
        if (rememberMe) {
          localStorage.setItem("token", accessToken);
        } else {
          sessionStorage.setItem("token", accessToken);
        }

        // Store user data in localStorage for use across the app
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");

        // Set token for future axios requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        // Update state
        setIsAuthenticated(true);
        setUser(user);

        // Get redirect information
        const redirectPath = localStorage.getItem("redirectAfterLogin");
        const shouldCheckout =
          localStorage.getItem("checkoutAfterLogin") === "true";

        // Clear redirect data first to prevent loops
        localStorage.removeItem("redirectAfterLogin");
        localStorage.removeItem("checkoutAfterLogin");

        // Set checkout flag if needed
        if (shouldCheckout) {
          localStorage.setItem("proceedToPayment", "true");
        }

        // Navigate to the redirect path or home
        // Small delay to ensure all state changes complete before navigation
        setTimeout(() => {
          navigate(redirectPath || "/");
        }, 100);

        setIsAuthLoading(false);
        return { success: true };
      } catch (error) {
        console.error("Login error:", error);
        setIsAuthLoading(false);

        return {
          success: false,
          message:
            error.response?.data?.message ||
            "Login failed. Please check your credentials.",
        };
      }
    },
    [navigate]
  );

  // Handle register
  const register = useCallback(async (userData) => {
    setIsAuthLoading(true);

    try {
      // Make API request to register
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );

      setIsAuthLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Registration error:", error);
      setIsAuthLoading(false);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  }, []);

  // Handle logout
  const logout = useCallback(() => {
    try {
      // Clean up all auth-related localStorage items
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("proceedToPayment");

      // Clear axios default authorization header
      delete axios.defaults.headers.common["Authorization"];

      // Update state
      setIsAuthenticated(false);
      setUser(null);

      // Navigate to login page
      navigate("/login");

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }, [navigate]);

  // Get user profile
  const getUserProfile = useCallback(async () => {
    if (!isAuthenticated) {
      return { success: false, message: "Not authenticated" };
    }

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        return { success: false, message: "No token found" };
      }

      const response = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data.message;

      // Update local storage and state
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true, data: userData };
    } catch (error) {
      console.error("Error fetching user profile:", error);

      // If unauthorized, log out
      if (error.response && error.response.status === 401) {
        logout();
      }

      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch user profile",
      };
    }
  }, [isAuthenticated, logout]);

  // Function to prepare for checkout
  const prepareCheckout = useCallback(
    (currentPath) => {
      if (isAuthenticated) {
        return true; // Already logged in, can proceed directly
      } else {
        // Store redirect information
        localStorage.setItem("redirectAfterLogin", currentPath);
        localStorage.setItem("checkoutAfterLogin", "true");

        // Redirect to login
        navigate("/login");
        return false;
      }
    },
    [isAuthenticated, navigate]
  );

  // Create context value
  const contextValue = {
    isAuthenticated,
    isAuthLoading,
    user,
    login,
    register,
    logout,
    checkAuthStatus,
    getUserProfile,
    prepareCheckout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Alias for backward compatibility
export const UseAuth = useAuth;

export default AuthContext;
