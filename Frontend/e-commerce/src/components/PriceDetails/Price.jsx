// import { useState, useEffect } from "react";
// import { UseCart } from "../../context/cart-context";
// import { TotalAmmount } from "../../utilites/totalProductPrice";
// import { useNavigate, useLocation } from "react-router-dom";

// export const PriceDetails = () => {
//   const { cart } = UseCart();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const totalProductPrice = TotalAmmount(cart);
//   const deliveryCharge = 49;
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [message, setMessage] = useState("");

//   // Check login status on component mount and when location changes
//   useEffect(() => {
//     checkLoginStatus();
//     // Clear any previous messages when location changes
//     setMessage("");

//     // Check if we should trigger payment immediately (returning from login)
//     const shouldProceedToPayment =
//       localStorage.getItem("proceedToPayment") === "true";
//     if (shouldProceedToPayment) {
//       localStorage.removeItem("proceedToPayment");
//       // Small delay to ensure login state is checked
//       setTimeout(() => {
//         if (isLoggedIn) {
//           initiatePayment();
//         }
//       }, 300);
//     }
//   }, [location.pathname]);

//   // Function to check if user is logged in
//   const checkLoginStatus = () => {
//     const token =
//       localStorage.getItem("token") || sessionStorage.getItem("token");
//     const isLoggedInFlag = localStorage.getItem("isAuthenticated") === "true";
//     const userData = localStorage.getItem("user");

//     // Consider user authenticated if any of these are true
//     const authenticated = !!(token || isLoggedInFlag || userData);

//     setIsLoggedIn(authenticated);
//   };

//   const loadScript = (src) => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = src;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   // Handle redirect to login page
//   const handleLoginRedirect = () => {
//     // Store current path to redirect back after login
//     const currentPath = location.pathname;
//     localStorage.setItem("redirectAfterLogin", currentPath);
//     localStorage.setItem("checkoutAfterLogin", "true");

//     navigate("/login");
//   };

//   // Handle checkout process - this is only for logged-in users
//   const initiatePayment = async () => {
//     setIsProcessing(true);

//     try {
//       // Load Razorpay SDK
//       const res = await loadScript(
//         "https://checkout.razorpay.com/v1/checkout.js"
//       );

//       if (!res) {
//         setMessage(
//           "Payment gateway failed to load. Please check your connection."
//         );
//         setIsProcessing(false);
//         return;
//       }

//       // Get user data (if available)
//       const userData = localStorage.getItem("user")
//         ? JSON.parse(localStorage.getItem("user"))
//         : {};

//       // Configure Razorpay
//       const options = {
//         key: "rzp_test_ksA7ruCXgK9Zua",
//         amount: (totalProductPrice + deliveryCharge) * 100, // in paisa
//         currency: "INR",
//         name: "RetailCanvas",
//         description: "Thank you for shopping with us",
//         image:
//           "https://thewrightfit.netlify.app/assets/The%20Wright%20Fit-logos.jpeg",
//         handler: function (response) {
//           console.log(response);
//           navigate("/order-success");
//         },
//         prefill: {
//           name: userData.username || "",
//           email: userData.email || "",
//           contact: "",
//         },
//         notes: {
//           address: "Delivery address will be confirmed at checkout",
//         },
//         theme: {
//           color: "#4F46E5", // Indigo color to match RetailCanvas theme
//         },
//         modal: {
//           ondismiss: function () {
//             setIsProcessing(false);
//           },
//         },
//       };

//       // Create Razorpay instance and open payment modal
//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//     } catch (error) {
//       console.error("Payment error:", error);
//       setMessage("Something went wrong. Please try again.");
//       setIsProcessing(false);
//     }
//   };

//   // The main checkout handler - checks login status first
//   const handleCheckout = () => {
//     // Check if cart is empty
//     if (cart.length === 0) {
//       setMessage("Your cart is empty");
//       return;
//     }

//     // Re-check login status to be safe
//     checkLoginStatus();

//     if (isLoggedIn) {
//       initiatePayment();
//     } else {
//       handleLoginRedirect();
//     }
//   };

//   return (
//     <div>
//       <div className="w-[300px] flex flex-col gap-5 mt-4 sm:mt-0 shadow-md p-6 bg-white rounded-lg">
//         <h3 className="text-xl font-bold mb-4">Price Details</h3>

//         {/* Message display */}
//         {message && (
//           <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 mb-4">
//             <p>{message}</p>
//           </div>
//         )}

//         <div className="flex justify-between">
//           <p>Price ({cart.length} items)</p>
//           <p>₹{totalProductPrice}</p>
//         </div>

//         <div className="flex justify-between">
//           <p>Delivery Charges</p>
//           <p>₹{deliveryCharge}</p>
//         </div>

//         <div className="flex justify-between font-semibold text-lg mt-2 py-2 border-t border-gray-200">
//           <p>Total Amount</p>
//           <p>₹{totalProductPrice + deliveryCharge}</p>
//         </div>

//         {isLoggedIn ? (
//           // Show checkout button for logged in users
//           <button
//             onClick={handleCheckout}
//             disabled={isProcessing}
//             className={`${
//               isProcessing
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-indigo-600 hover:bg-indigo-700"
//             } text-white py-3 px-4 rounded-md mt-4 font-medium flex items-center justify-center`}
//           >
//             {isProcessing ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <span className="material-symbols-outlined mr-2">
//                   shopping_cart_checkout
//                 </span>
//                 Place Order
//               </>
//             )}
//           </button>
//         ) : (
//           // Show login button for non-logged in users
//           <button
//             onClick={handleLoginRedirect}
//             className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md mt-4 font-medium flex items-center justify-center"
//           >
//             <span className="material-symbols-outlined mr-2">login</span>
//             Login to Checkout
//           </button>
//         )}

//         {!isLoggedIn && (
//           <p className="text-sm text-gray-600 mt-2 text-center">
//             You need to login before completing your purchase
//           </p>
//         )}

//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <div className="flex items-center justify-center mb-2 text-green-600">
//             <span className="material-symbols-outlined text-sm mr-1">lock</span>
//             <span className="text-sm font-medium">Secure Checkout</span>
//           </div>
//           <div className="flex items-center justify-center gap-3 mt-2">
//             <img
//               src="https://cdn-icons-png.flaticon.com/128/196/196578.png"
//               alt="Visa"
//               className="h-6 w-auto opacity-70"
//             />
//             <img
//               src="https://cdn-icons-png.flaticon.com/128/196/196561.png"
//               alt="MasterCard"
//               className="h-6 w-auto opacity-70"
//             />
//             <img
//               src="https://cdn-icons-png.flaticon.com/128/5968/5968416.png"
//               alt="GPay"
//               className="h-6 w-auto opacity-70"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PriceDetails;

import { useState, useEffect } from "react";
import { UseCart } from "../../context/cart-context";
import { UseAuth } from "../../context/AuthContext";
import { TotalAmmount } from "../../utilites/totalProductPrice";
import { useNavigate, useLocation } from "react-router-dom";

export const PriceDetails = () => {
  const { cart, cartdispatch } = UseCart();
  const { isAuthenticated, isAuthLoading, prepareCheckout } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Calculate totals
  const totalProductPrice = TotalAmmount(cart);
  const deliveryCharge = 49;

  useEffect(() => {
    // Clear any previous messages when location changes
    setMessage("");

    // Check if we should trigger payment immediately (returning from login)
    const checkPaymentFlag = async () => {
      const shouldProceedToPayment =
        localStorage.getItem("proceedToPayment") === "true";
      if (shouldProceedToPayment && isAuthenticated) {
        // Remove flag before proceeding to prevent loops
        localStorage.removeItem("proceedToPayment");
        // Small delay to ensure component is fully mounted
        setTimeout(() => {
          initiatePayment();
        }, 300);
      }
    };

    // Only check after auth loading is complete
    if (!isAuthLoading) {
      checkPaymentFlag();
    }
  }, [location.pathname, isAuthenticated, isAuthLoading]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle checkout process - this is only for logged-in users
  const initiatePayment = async () => {
    // Validate cart
    if (cart.length === 0) {
      setMessage("Your cart is empty");
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
        setMessage(
          "Payment gateway failed to load. Please check your connection."
        );
        setIsProcessing(false);
        return;
      }

      // Get user data (if available)
      const userData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {};

      // Configure Razorpay
      const options = {
        key: "rzp_test_ksA7ruCXgK9Zua",
        amount: (totalProductPrice + deliveryCharge) * 100, // in paisa
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
      setMessage("Something went wrong with the payment. Please try again.");
      setIsProcessing(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = (response) => {
    try {
      console.log("Payment successful:", response);

      // Clear cart
      if (cartdispatch) {
        cartdispatch({ type: "CLEAR_CART" });
      }

      // Navigate to success page
      navigate("/order-success");
    } catch (error) {
      console.error("Error processing successful payment:", error);
      setMessage(
        "Payment was successful, but we couldn't process your order. Please contact support."
      );
      setIsProcessing(false);
    }
  };

  // The main checkout handler - checks login status first
  const handleCheckout = () => {
    // Check if cart is empty
    if (cart.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    // Use the auth context's prepareCheckout function
    // If it returns true, user is authenticated and we can proceed
    if (prepareCheckout(location.pathname)) {
      initiatePayment();
    }
    // If false, the function already handled the redirect to login
  };

  // Show loading indicator while auth is being checked
  if (isAuthLoading) {
    return (
      <div className="w-[300px] flex flex-col gap-5 mt-4 sm:mt-0 shadow-md p-6 bg-white rounded-lg">
        <h3 className="text-xl font-bold mb-4">Price Details</h3>
        <div className="flex justify-center py-4">
          <div className="animate-spin h-5 w-5 border-2 border-indigo-600 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

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

        {isAuthenticated ? (
          // Show checkout button for logged in users
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className={`${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
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
                <span className="material-symbols-outlined mr-2">
                  shopping_cart_checkout
                </span>
                Place Order
              </>
            )}
          </button>
        ) : (
          // Show login button for non-logged in users
          <button
            onClick={handleCheckout}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md mt-4 font-medium flex items-center justify-center"
          >
            <span className="material-symbols-outlined mr-2">login</span>
            Login to Checkout
          </button>
        )}

        {!isAuthenticated && (
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

export default PriceDetails;
