// Updated Navbar.jsx to match screenshot design
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useCart from "../../context/cart-context";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Get cart state from context
  const { cart } = useCart();

  // Calculate cart item count correctly, handling undefined cart
  const cartItemCount = cart && Array.isArray(cart) ? cart.length : 0;

  // For wishlist
  const [wishlistItems, setWishlistItems] = useState([]);
  const wishlistCount = wishlistItems?.length || 0;

  // Load wishlist and check login status when component mounts or route changes
  useEffect(() => {
    loadWishlist();
    checkLoginStatus();
  }, [location.pathname]); // Refresh when navigation occurs

  // Load wishlist items from localStorage
  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlistItems(parsedWishlist);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  // Check login status
  const checkLoginStatus = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Get user data from localStorage or API
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // Fetch user profile from API if not in localStorage
          fetchUserProfile(token);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user || !user.username) return "U";

    // Split the username by spaces to get names
    const nameParts = user.username.split(" ");

    if (nameParts.length === 1) {
      // If only one name, return first letter
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      // Return first letter of first name and first letter of last name
      const firstInitial = nameParts[0].charAt(0);
      const lastInitial = nameParts[nameParts.length - 1].charAt(0);
      return (firstInitial + lastInitial).toUpperCase();
    }
  };

  // Fetch user profile
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(
        "https://shop-smart-e-commerce.onrender.com/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.message);
        // Store in localStorage for future use
        localStorage.setItem("user", JSON.stringify(userData.message));
      } else {
        // If token is invalid, log user out
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear wishlist
    localStorage.removeItem("wishlist");
    setWishlistItems([]);

    // Update state
    setIsLoggedIn(false);
    setUser(null);
    setIsProfileDropdownOpen(false);

    // Show confirmation
    alert("You have been logged out successfully.");

    // Navigate to home
    navigate("/");
  };

  // Check if user is on the specified path
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const onNavigateClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(searchText.trim())}`);
      setSearchText("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 text-white py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={onNavigateClick}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <h1 className="ml-2 text-2xl font-bold tracking-tight">
              RetailCanvas
            </h1>
          </div>
        </div>

        {/* Search Bar (centered on desktop) */}
        <div className="flex-grow max-w-md mx-4 hidden md:block">
          <form onSubmit={onSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 pr-10 rounded-full bg-indigo-500/75 text-white placeholder-indigo-200 border border-indigo-400 focus:bg-indigo-500 focus:border-white focus:ring-2 focus:ring-indigo-300 transition-all focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-indigo-400 text-white"
              aria-label="Search"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
          </form>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-indigo-500 transition-colors"
            aria-label="Wishlist"
          >
            <span className="material-symbols-outlined">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-indigo-500 transition-colors"
            aria-label="Cart"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            <div className="relative profile-dropdown ml-1">
              <button
                className="flex items-center gap-1"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                aria-label="User profile"
                aria-expanded={isProfileDropdownOpen}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-indigo-600">
                  {getUserInitials()}
                </div>
                <span className="material-symbols-outlined text-sm hidden md:block">
                  {isProfileDropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2 bg-white text-gray-900 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="px-4 py-3 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.username || "User"}</p>
                    <p className="text-gray-500 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <span className="material-symbols-outlined text-sm mr-2 align-middle">
                      person
                    </span>
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <span className="material-symbols-outlined text-sm mr-2 align-middle">
                      shopping_bag
                    </span>
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <span className="material-symbols-outlined text-sm mr-2 align-middle">
                      favorite
                    </span>
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <div className="h-px bg-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <span className="material-symbols-outlined text-sm mr-2 align-middle">
                      logout
                    </span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md font-medium text-sm hover:bg-indigo-500 transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-3 py-1.5 rounded-md font-medium text-sm ml-1 bg-white text-indigo-600 hover:bg-gray-100 transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-indigo-600 text-white shadow-lg py-4 px-4 transition-all">
          {/* Mobile Search */}
          <form onSubmit={onSearchSubmit} className="mb-5 relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 pr-10 rounded-md bg-indigo-500 text-white placeholder-indigo-200 border border-indigo-400 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
          </form>

          {/* User profile section (mobile) */}
          {isLoggedIn && (
            <div className="mb-5 p-4 rounded-lg bg-indigo-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-indigo-600">
                  {getUserInitials()}
                </div>
                <div>
                  <p className="font-medium text-lg">
                    {user?.username || "User"}
                  </p>
                  <p className="text-sm text-indigo-100">{user?.email || ""}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col mb-4">
            <Link
              to="/"
              className={`py-3 px-3 font-medium rounded-md ${
                isActive("/") ? "bg-indigo-500" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined mr-2 align-middle">
                home
              </span>
              Home
            </Link>
          </nav>

          {/* Mobile Action Links */}
          <div className="flex flex-col">
            <Link
              to="/wishlist"
              className={`py-3 px-3 flex items-center rounded-md ${
                isActive("/wishlist") ? "bg-indigo-500" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined mr-2">favorite</span>
              Wishlist
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className={`py-3 px-3 flex items-center rounded-md ${
                isActive("/cart") ? "bg-indigo-500" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined mr-2">
                shopping_cart
              </span>
              Cart
              {cartItemCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <>
                <div className="h-px w-full bg-indigo-500/50 my-3"></div>
                <Link
                  to="/profile"
                  className={`py-3 px-3 flex items-center rounded-md ${
                    isActive("/profile") ? "bg-indigo-500" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="material-symbols-outlined mr-2">person</span>
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className={`py-3 px-3 flex items-center rounded-md ${
                    isActive("/orders") ? "bg-indigo-500" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="material-symbols-outlined mr-2">
                    shopping_bag
                  </span>
                  My Orders
                </Link>
                <button
                  className="py-3 px-3 flex items-center text-red-100 rounded-md mt-4 font-medium"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="material-symbols-outlined mr-2">logout</span>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="h-px w-full bg-indigo-500/50 my-3"></div>
                <div className="flex flex-col gap-3 mt-2">
                  <Link
                    to="/login"
                    className="py-3 px-3 flex items-center font-medium rounded-md bg-indigo-500 text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined mr-2">
                      login
                    </span>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="py-3 px-3 flex items-center justify-center font-medium rounded-md bg-white text-indigo-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined mr-2">
                      person_add
                    </span>
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
