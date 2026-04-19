import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/cart-context";

const OrderSuccess = () => {
  const { cart, clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [orderStatus, setOrderStatus] = useState("Processing...");
  const processedRef = useRef(false);

  useEffect(() => {
    // Only process once
    if (processedRef.current) return;
    
    // Check if coming from Stripe successful redirect
    const sessionId = searchParams.get("session_id");
    
    if (sessionId && cart.length > 0) {
      processedRef.current = true;
      const products = cart.map((item) => ({
        productId: item.productId || item.id || item._id,
        quantity: item.quantity || 1
      }));

      const createOrder = async () => {
        try {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ products })
          });

          if (response.ok) {
            setOrderStatus("Order Placed Successfully!");
            if (clearCart) clearCart();
          } else {
            console.error("Failed to map order on backend");
            setOrderStatus("Payment successful, but order mapping failed.");
          }
        } catch (error) {
          console.error("Error creating order:", error);
          setOrderStatus("Payment successful, but order creation failed.");
        }
      };

      createOrder();
    } else if (!sessionId) {
      // Direct visit without session ID (e.g. refresh)
      setOrderStatus("Order Placed Successfully!");
    } else {
      // Cart already empty, likely already processed
      setOrderStatus("Order Placed Successfully!");
    }
  }, [cart, clearCart, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg flex flex-col items-center">
        <svg
          className="w-24 h-24 text-green-600 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-3xl font-bold text-green-700 mb-4">{orderStatus}</h1>
        <p className="text-gray-600 mb-6 text-center">
          Thank you for your purchase. Your order is being processed and will be delivered soon.
        </p>
        <Link
          to="/"
          className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-md transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
