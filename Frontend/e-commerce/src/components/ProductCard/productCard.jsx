import React, { useState, useEffect } from "react";
import { UseCart } from "../../context/cart-context";
import { findProduct } from "../../utilites/findProduct";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ProductCard = ({ product }) => {
  const { cart, cartdispatch } = UseCart();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const isProductInCart = findProduct(cart, product.id);

  const Navigate = useNavigate();

  // Check if the product is in wishlist on component mount
  useEffect(() => {
    checkWishlistStatus();
  }, [product.id]);

  // Function to check if product is already in wishlist
  const checkWishlistStatus = () => {
    try {
      // Check local storage for wishlist data
      const wishlistData = localStorage.getItem("wishlist");
      if (wishlistData) {
        const wishlist = JSON.parse(wishlistData);
        const exists = wishlist.some((item) => item.id === product.id);
        setIsInWishlist(exists);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const onAddToCart = () => {
    !isProductInCart
      ? cartdispatch({
          type: "ADD_TO_CART",
          payload: product,
        })
      : Navigate("/cart");
  };

  const onMoveToWishlist = async () => {
    if (isAddingToWishlist) return; // Prevent multiple clicks

    try {
      setIsAddingToWishlist(true);

      // If already in wishlist, navigate to wishlist
      if (isInWishlist) {
        Navigate("/wishlist");
        return;
      }

      // Get token
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        // If not logged in, store in localStorage only and prompt to login
        alert("Please login to save items to your wishlist.");
        handleLocalWishlist();
        Navigate("/login");
        return;
      }

      // Add to backend wishlist
      const response = await axios.post(
        "https://shop-smart-e-commerce.onrender.com/product/addToWishlist",
        { productId: product.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Also update local wishlist for UI updates
        handleLocalWishlist();
        // Show success message
        alert("Product added to wishlist!");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "User Already exist in Wishlist"
      ) {
        // Item is already in the server wishlist
        setIsInWishlist(true);
        alert("This item is already in your wishlist");
      } else {
        // Handle other errors but still update local wishlist
        handleLocalWishlist();
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Handle local wishlist in localStorage
  const handleLocalWishlist = () => {
    try {
      // Get current wishlist
      const wishlistData = localStorage.getItem("wishlist");
      let wishlist = wishlistData ? JSON.parse(wishlistData) : [];

      // Add product to wishlist if not already there
      if (!wishlist.some((item) => item.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error updating local wishlist:", error);
    }
  };

  return (
    <div className="card flex flex-col bg-white shadow-sm rounded-lg overflow-hidden w-[300px] h-[400px] hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {/* Product Image */}
      <div className="card-image w-full h-48 bg-gray-50 overflow-hidden relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="object-contain absolute inset-0 w-full h-full hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist indicator (heart icon) */}
        {isInWishlist && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
            <span className="material-symbols-outlined text-rose-500">
              favorite
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="card-content p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Title */}
          <h2 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
            {product.title}
          </h2>

          {/* Price */}
          <p className="text-indigo-600 font-bold mb-1">₹{product.price}</p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex text-amber-400">
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span className="material-symbols-outlined text-xs">
                star_half
              </span>
            </div>
            <span className="text-xs text-gray-500 ml-1">(4.5)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions flex flex-col gap-2">
          <button
            className="w-full bg-indigo-600 text-white py-2 px-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 text-sm"
            onClick={onAddToCart}
          >
            <span className="material-symbols-outlined text-sm">
              {isProductInCart ? "shopping_cart_checkout" : "shopping_cart"}
            </span>
            {isProductInCart ? "Go to Cart" : "Add to Cart"}
          </button>

          <button
            className={`w-full py-2 px-3 rounded-md flex items-center justify-center gap-1 text-sm transition-colors ${
              isInWishlist
                ? "bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            } ${isAddingToWishlist ? "opacity-75 cursor-wait" : ""}`}
            onClick={onMoveToWishlist}
            disabled={isAddingToWishlist}
          >
            <span
              className={`material-symbols-outlined text-sm ${
                isInWishlist ? "text-rose-500" : "text-rose-400"
              }`}
            >
              {isInWishlist ? "favorite" : "favorite_border"}
            </span>
            {isAddingToWishlist
              ? "Adding..."
              : isInWishlist
              ? "View Wishlist"
              : "Add to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};
