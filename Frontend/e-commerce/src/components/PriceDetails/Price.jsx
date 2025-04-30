import { useState, useEffect } from "react";
import { UseCart } from "../../context/cart-context";
import { TotalAmmount } from "../../utilites/totalProductPrice";
import { useNavigate, useLocation } from "react-router-dom";

export const PriceDetails = () => {
  const { cart } = UseCart();
  const navigate = useNavigate();
  const location = useLocation();
  const totalProductPrice = TotalAmmount(cart);
  const deliveryCharge = 49;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Check login status on component mount and when location changes
  useEffect(() => {
    checkLoginStatus();
    // Clear any previous messages when location changes
    setMessage("");
  }, [location.pathname]);

  // Function to check if user is logged in
  const checkLoginStatus = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      // Store current path to redirect back after login
      const currentPath = location.pathname;
      localStorage.setItem("redirectAfterLogin", currentPath);

      // Show message and delay navigation slightly for better UX
      setMessage("Please login to continue with checkout");
      setTimeout(() => {
        navigate("/login?redirect=cart");
      }, 1500);
      return;
    }

    setIsProcessing(true);

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      setMessage(
        "Razorpay SDK failed to load. Please check your internet connection."
      );
      setIsProcessing(false);
      return;
    }

    const options = {
      key: "rzp_test_ksA7ruCXgK9Zua",
      amount: (totalProductPrice + deliveryCharge) * 100,
      currency: "INR",
      name: "RetailCanvas",
      description: "Thank you for shopping with us",
      image:
        "https://thewrightfit.netlify.app/assets/The%20Wright%20Fit-logos.jpeg",
      handler: function (response) {
        console.log(response);
        navigate("/order-success");
      },
      prefill: {
        name: localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).username
          : "",
        email: localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).email
          : "",
        contact: "",
      },
      notes: {
        address: "Delivery address will be confirmed at checkout",
      },
      theme: {
        color: "#4F46E5", // Indigo color to match RetailCanvas theme
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <div className="w-[300px] flex flex-col gap-5 mt-4 sm:mt-0 shadow-md p-6 bg-white rounded-lg">
        <h3 className="text-xl font-bold mb-4">Price Details</h3>

        {/* Message display */}
        {message && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 mb-4">
            <p>{message}</p>
          </div>
        )}

        <div className="flex justify-between">
          <p>Price ({cart.length} items)</p>
          <p>₹{totalProductPrice}</p>
        </div>

        <div className="flex justify-between">
          <p>Delivery Charges</p>
          <p>₹{deliveryCharge}</p>
        </div>

        <div className="flex justify-between font-semibold text-lg mt-2 py-2 border-t border-gray-200">
          <p>Total Amount</p>
          <p>₹{totalProductPrice + deliveryCharge}</p>
        </div>

        <button
          onClick={displayRazorpay}
          disabled={isProcessing}
          className={`${
            isProcessing
              ? "bg-green-500 cursor-not-allowed"
              : isLoggedIn
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white py-3 px-4 rounded-md mt-4 font-medium flex items-center justify-center`}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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
              {!isLoggedIn ? (
                <>
                  <span className="material-symbols-outlined mr-2">login</span>
                  Login to Checkout
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined mr-2">
                    shopping_cart_checkout
                  </span>
                  Place Order
                </>
              )}
            </>
          )}
        </button>

        {!isLoggedIn && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            You need to login before completing your purchase
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center mb-2 text-green-600">
            <span className="material-symbols-outlined text-sm mr-1">lock</span>
            <span className="text-sm font-medium">Secure Checkout</span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-2">
            <img
              src="https://cdn-icons-png.flaticon.com/128/196/196578.png"
              alt="Visa"
              className="h-6 w-auto opacity-70"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/196/196561.png"
              alt="MasterCard"
              className="h-6 w-auto opacity-70"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/5968/5968416.png"
              alt="GPay"
              className="h-6 w-auto opacity-70"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
