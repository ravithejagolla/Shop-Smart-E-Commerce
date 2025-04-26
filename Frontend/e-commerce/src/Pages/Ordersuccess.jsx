import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
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
        <h1 className="text-3xl font-bold text-green-700 mb-4">Order Placed Successfully!</h1>
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
