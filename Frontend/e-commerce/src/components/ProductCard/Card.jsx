import React, { useState, useEffect } from "react";
import { UseCart } from "../../context/cart-context";
import { findProduct } from "../../utilites/findProduct";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QuantityButton from "../QuantityButton";

export const ProductCard = ({ product }) => {
  const { cart, cartdispatch } = UseCart();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  // const [selectedQuantity, setSelectedQuantity] = useState(1);

  const isProductInCart = findProduct(cart, product.id);

  const Navigate = useNavigate();

  // Check if the product is in wishlist on component mount
  useEffect(() => {
    checkWishlistStatus();
  }, [product.id]);

  // Function to check if product is already in wishlist
  const checkWishlistStatus = () => {
    try {
      // First check local storage for wishlist data
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

      // Get token
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        // If not logged in, store in localStorage temporarily
        handleLocalWishlist();
        return;
      }

      // If already in wishlist, navigate to wishlist
      if (isInWishlist) {
        Navigate("/wishlist");
        return;
      }

      // Add to wishlist on server
      const response = await axios.post(
        "https://shop-smart-e-commerce.onrender.com/product/wishlist",
        { productId: product.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Also update local wishlist
        handleLocalWishlist();
        // Show success message
        alert("Product added to wishlist!");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      // If API fails, still update local wishlist
      handleLocalWishlist();
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

      // If already in wishlist, navigate to wishlist page
      if (isInWishlist) {
        Navigate("/wishlist");
        return;
      }

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
            {isProductInCart ? "Go To Cart" : "Add to Cart"}
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

// Pagination component matching RetailCanvas theme
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate start and end of page range to show
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("...");
    }

    // Add page numbers in the middle
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center my-8">
      <div className="flex items-center">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-l-md border ${
            currentPage === 1
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 border-t border-b bg-white text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => typeof page === "number" && onPageChange(page)}
              className={`px-4 py-2 border-t border-b ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-r-md border ${
            currentPage === totalPages
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
