// Updated Cart.jsx with proper imports and implementations
import React, { useEffect, useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer/footer";
import { calculateTotalAmount } from "../utilites/totalProductPrice";

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const navigate = useNavigate();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Calculate costs - use useCallback for derived values
  const calculateCosts = useCallback(() => {
    const subtotal = calculateTotalAmount(cart);
    const shippingFee = cart.length > 0 ? 49 : 0;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + tax + shippingFee;

    return { subtotal, shippingFee, tax, total };
  }, [cart]);

  const { subtotal, shippingFee, tax, total } = calculateCosts();

  // Check authentication status - memoized for better performance
  const checkAuthStatus = useCallback(() => {
    // Check multiple sources to determine auth status
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const isLoggedInFlag = localStorage.getItem("isAuthenticated") === "true";
    const userData = localStorage.getItem("user");

    // Consider user authenticated if any of these are true
    const authenticated = !!(token || isLoggedInFlag || userData);

    setIsAuthenticated(authenticated);
    setAuthChecked(true);

    return authenticated;
  }, []);

  // Handle initial component load and authentication checks
  useEffect(() => {
    const authenticated = checkAuthStatus();

    // Check if we should trigger payment immediately (after login redirect)
    const shouldProceedToPayment =
      localStorage.getItem("proceedToPayment") === "true";
    if (shouldProceedToPayment) {
      localStorage.removeItem("proceedToPayment");

      // Wait for authentication state to be confirmed
      if (authenticated) {
        setTimeout(() => handleCheckout(), 300);
      }
    }
  }, [checkAuthStatus]);

  // Handler for cart item quantity updates
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // Confirm before removing
      if (window.confirm("Remove this item from your cart?")) {
        removeFromCart(productId);
      }
      return;
    }

    updateQuantity(productId, newQuantity);
  };

  // Handle login redirect with proper state management
  const handleLoginRedirect = useCallback(() => {
    // Save current path for redirect after login
    localStorage.setItem("redirectAfterLogin", "/cart");
    localStorage.setItem("proceedToPayment", "true");
    navigate("/login");
  }, [navigate]);

  // Load payment script - memoized with useCallback
  const loadScript = useCallback((src) => {
    return new Promise((resolve) => {
      // Check if script already exists to prevent duplicates
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  // Handle checkout process with improved error handling
  const handleCheckout = useCallback(async () => {
    // Check if cart is empty
    if (cart.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    // Always verify authentication before proceeding
    const authenticated = checkAuthStatus();

    // Redirect to login if not authenticated
    if (!authenticated) {
      setMessage("You need to login to proceed with checkout");
      handleLoginRedirect();
      return;
    }

    setIsProcessing(true);
    setMessage("");

    try {
      // Load Razorpay SDK
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        throw new Error(
          "Payment gateway failed to load. Please check your connection."
        );
      }

      // Get user data (if available)
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      // Configure Razorpay
      const options = {
        key: "rzp_test_ksA7ruCXgK9Zua", // Consider moving API keys to environment variables
        amount: total * 100, // in paisa
        currency: "INR",
        name: "RetailCanvas",
        description: `Payment for ${cart.length} item${
          cart.length > 1 ? "s" : ""
        }`,
        image:
          "https://thewrightfit.netlify.app/assets/The%20Wright%20Fit-logos.jpeg",
        handler: function (response) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: userData.username || "",
          email: userData.email || "",
          contact: userData.phone || "",
        },
        notes: {
          address: "RetailCanvas Headquarters",
        },
        theme: {
          color: "#4F46E5", // Indigo color
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      // Create Razorpay instance and open payment modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      setMessage(error.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  }, [cart, total, checkAuthStatus, handleLoginRedirect, loadScript]);

  // Handle successful payment with improved error handling
  const handlePaymentSuccess = useCallback(
    (response) => {
      try {
        console.log("Payment successful:", response);

        // Clear cart
        clearCart();

        // Save order details for confirmation page
        localStorage.setItem(
          "lastOrderDetails",
          JSON.stringify({
            orderId: response.razorpay_payment_id,
            amount: total,
            items: cart.length,
            date: new Date().toISOString(),
          })
        );

        // Navigate to success page
        navigate("/order-success");
      } catch (error) {
        console.error("Error processing successful payment:", error);
        setMessage(
          "Payment was successful, but we couldn't process your order. Please contact support."
        );
        setIsProcessing(false);
      }
    },
    [clearCart, navigate, cart, total]
  );

  // Render cart items - extracted for readability
  const renderCartItems = () => {
    return cart.map((product, index) => (
      <div key={product.id}>
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-md overflow-hidden">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/150"}
              alt={product.title}
              className="w-full h-full object-contain"
              loading="lazy" // Lazy loading for better performance
            />
          </div>

          <div className="flex-grow flex flex-col sm:flex-row">
            <div className="flex-grow pr-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                  {product.title}
                </h3>
                <p className="font-bold text-indigo-600 ml-2 sm:hidden">
                  ₹{product.price}
                </p>
              </div>

              {product.category && (
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                {product.color && (
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    Color: {product.color}
                  </span>
                )}
                {product.size && (
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    Size: {product.size}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.id,
                        (product.quantity || 1) - 1
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-l border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    <span className="material-symbols-outlined text-sm">
                      remove
                    </span>
                  </button>

                  <input
                    type="text"
                    value={product.quantity || 1}
                    readOnly
                    className="w-10 h-8 border-t border-b border-gray-300 text-center text-sm"
                    aria-label="Quantity"
                  />

                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.id,
                        (product.quantity || 1) + 1
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-r border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => handleQuantityChange(product.id, 0)}
                  className="text-sm text-rose-600 hover:text-rose-700 hover:underline flex items-center"
                  aria-label="Remove item"
                >
                  <span className="material-symbols-outlined text-sm mr-1">
                    delete
                  </span>
                  Remove
                </button>
              </div>
            </div>

            <div className="hidden sm:block text-right min-w-[100px]">
              <p className="font-bold text-indigo-600">₹{product.price}</p>
              {product.originalPrice && (
                <>
                  <p className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100
                    )}
                    % off
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        {index < cart.length - 1 && (
          <div className="border-b border-gray-100"></div>
        )}
      </div>
    ));
  };

  // Render different buttons based on authentication status
  const renderCheckoutButton = () => {
    if (isAuthenticated) {
      // Render checkout button for logged in users
      return (
        <button
          onClick={handleCheckout}
          disabled={isProcessing || cart.length === 0}
          className={`w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center ${
            isProcessing || cart.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          aria-label="Proceed to checkout"
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm mr-2">
                shopping_cart_checkout
              </span>
              Proceed to Checkout
            </>
          )}
        </button>
      );
    } else {
      // Render login button for non-authenticated users
      return (
        <button
          onClick={handleLoginRedirect}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          aria-label="Login to checkout"
        >
          <span className="material-symbols-outlined text-sm mr-2">login</span>
          Login to Checkout
        </button>
      );
    }
  };

  // Loading state
  if (!authChecked) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex-grow flex items-center justify-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20 flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-600 transition-colors inline-flex items-center"
                >
                  <span
                    className="material-symbols-outlined text-sm mr-1"
                    aria-hidden="true"
                  >
                    home
                  </span>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2" aria-hidden="true">
                    /
                  </span>
                  <span className="text-indigo-600">Cart</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Cart Title */}
          <div className="pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {cart && cart.length > 0
                ? `Your Shopping Cart (${cart.length} item${
                    cart.length > 1 ? "s" : ""
                  })`
                : "Your Shopping Cart"}
            </h1>
          </div>

          {/* Notification Message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.includes("failed") || message.includes("empty")
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}

          {/* Main Content */}
          {cart && cart.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {renderCartItems()}
                </div>

                {/* Continue Shopping Button */}
                <div className="mt-6 flex">
                  <Link
                    to="/"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    <span
                      className="material-symbols-outlined text-sm mr-2"
                      aria-hidden="true"
                    >
                      arrow_back
                    </span>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="lg:w-96">
                <div className="sticky top-24">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Order Summary
                    </h2>

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Subtotal ({cart.length} item
                          {cart.length > 1 ? "s" : ""})
                        </span>
                        <span className="font-medium">₹{subtotal}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">₹{shippingFee}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (5%)</span>
                        <span className="font-medium">₹{tax}</span>
                      </div>

                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-indigo-600">
                            ₹{total}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Authentication Notice */}
                    {!isAuthenticated && (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-md text-center">
                        <p className="text-yellow-800 font-medium mb-1">
                          You need to login to proceed with checkout
                        </p>
                        <p className="text-sm text-yellow-700">
                          Login to access your account, save your shipping
                          details, and track your orders
                        </p>
                      </div>
                    )}

                    {/* Checkout/Login Button */}
                    {renderCheckoutButton()}

                    {/* Login link */}
                    {!isAuthenticated && (
                      <div className="mt-3 text-center">
                        <Link
                          to="/login"
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Already have an account? Sign in here
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Payment Methods */}
                  {isAuthenticated && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
                      <p className="text-sm text-gray-600 mb-3">We Accept:</p>
                      <div className="flex items-center gap-3">
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/196/196578.png"
                          alt="Visa"
                          className="h-8 w-auto opacity-70"
                          loading="lazy"
                        />
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/196/196561.png"
                          alt="MasterCard"
                          className="h-8 w-auto opacity-70"
                          loading="lazy"
                        />
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/196/196539.png"
                          alt="PayPal"
                          className="h-8 w-auto opacity-70"
                          loading="lazy"
                        />
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/5968/5968416.png"
                          alt="GPay"
                          className="h-8 w-auto opacity-70"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Empty Cart State */
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
                <span
                  className="material-symbols-outlined text-6xl text-gray-400"
                  aria-hidden="true"
                >
                  shopping_cart
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Browse
                our products and find something you'll love!
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
