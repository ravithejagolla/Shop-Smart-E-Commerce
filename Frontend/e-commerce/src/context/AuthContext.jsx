/* eslint-disable react-refresh/only-export-components */
// auth-context.js
import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );
  const navigate = useNavigate();

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    navigate("/"); // Redirect to home or dashboard
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const UseAuth = () => useContext(AuthContext);
