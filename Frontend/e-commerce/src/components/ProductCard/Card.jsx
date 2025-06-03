// src/components/ProductCard/Card.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/cart-context";
import { findProduct } from "../../utilites/findProduct";
import { addToWishlistApi, removeFromWishlistApi } from "../../api/wishlistApi";

export const ProductCard = ({ product }) => {
  const { cart, addToCart } = useCart();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const isProductInCart = findProduct(cart, product.id);

  const navigate = useNavigate();

  // Function to check if product is already in wishlist
  const checkWishlistStatus = useCallback(() => {
    try {
      if (typeof window === "undefined" || typeof localStorage === "undefined")
        return;
      const wishlistData = localStorage.getItem("wishlist");
      if (wishlistData) {
        const wishlist = JSON.parse(wishlistData);
        const exists = wishlist.some((item) => item.id === product.id);
        setIsInWishlist(exists);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  }, [product.id]);

  useEffect(() => {
    checkWishlistStatus();
  }, [product.id, checkWishlistStatus]);

  const onAddToCart = () => {
    !isProductInCart ? addToCart(product) : navigate("/cart");
  };

  // Helper to get the correct product id (MongoDB _id or fallback)
  const getProductId = () => product._id || product.id;
  // Helper to normalize product object for localStorage
  const getNormalizedProduct = () => ({
    ...product,
    id: product._id || product.id,
  });

  const onMoveToWishlist = async () => {
    if (isAddingToWishlist) return; // Prevent multiple clicks
    setIsAddingToWishlist(true);
    try {
      const token =
        (typeof window !== "undefined" &&
          typeof localStorage !== "undefined" &&
          localStorage.getItem("token")) ||
        (typeof window !== "undefined" &&
          typeof sessionStorage !== "undefined" &&
          sessionStorage.getItem("token"));
      if (isInWishlist) {
        // Remove from backend if logged in
        if (token) {
          try {
            await removeFromWishlistApi(getProductId(), token);
          } catch (err) {
            // Log but proceed to update UI/localStorage
            console.error("Error removing from backend wishlist:", err);
          }
        }
        // Remove from localStorage and update UI
        handleRemoveFromLocalWishlist();
        setIsInWishlist(false);
        // Fire event for UI update
        if (typeof window !== "undefined") {
          const wishlistData = localStorage.getItem("wishlist");
          const wishlist = wishlistData ? JSON.parse(wishlistData) : [];
          window.dispatchEvent(
            new CustomEvent("wishlistUpdated", {
              detail: { count: wishlist.length },
            })
          );
        }
        return;
      }
      // Add to backend wishlist if logged in
      if (token) {
        try {
          const result = await addToWishlistApi(getProductId(), token);
          if (result && result.alreadyExists) {
            // Already in wishlist: update UI and localStorage as if add succeeded
            handleLocalWishlist();
            setIsInWishlist(true);
            if (typeof window !== "undefined") {
              const wishlistData = localStorage.getItem("wishlist");
              const wishlist = wishlistData ? JSON.parse(wishlistData) : [];
              window.dispatchEvent(
                new CustomEvent("wishlistUpdated", {
                  detail: { count: wishlist.length },
                })
              );
            }
            // Optionally show a friendly message
            alert("This product is already in your wishlist.");
            return;
          }
        } catch (err) {
          // Log but proceed to update UI/localStorage
          console.error("Error adding to backend wishlist:", err);
        }
        handleLocalWishlist();
        setIsInWishlist(true);
        // Fire event for UI update
        if (typeof window !== "undefined") {
          const wishlistData = localStorage.getItem("wishlist");
          const wishlist = wishlistData ? JSON.parse(wishlistData) : [];
          window.dispatchEvent(
            new CustomEvent("wishlistUpdated", {
              detail: { count: wishlist.length },
            })
          );
        }
      } else {
        // Not logged in: update localStorage, prompt login
        handleLocalWishlist();
        setIsInWishlist(true);
        if (typeof window !== "undefined") {
          const wishlistData = localStorage.getItem("wishlist");
          const wishlist = wishlistData ? JSON.parse(wishlistData) : [];
          window.dispatchEvent(
            new CustomEvent("wishlistUpdated", {
              detail: { count: wishlist.length },
            })
          );
        }
        navigate("/login");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Handle local wishlist in localStorage
  const handleLocalWishlist = () => {
    try {
      if (typeof window === "undefined" || typeof localStorage === "undefined")
        return;
      const wishlistData = localStorage.getItem("wishlist");
      let wishlist = wishlistData ? JSON.parse(wishlistData) : [];
      const normalizedProduct = getNormalizedProduct();
      // Add product to wishlist if not already there
      if (!wishlist.some((item) => (item._id || item.id) === getProductId())) {
        wishlist.push(normalizedProduct);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setIsInWishlist(true);
        // Dispatch custom event for instant UI update
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("wishlistUpdated", {
              detail: { count: wishlist.length },
            })
          );
        }
      }
    } catch (error) {
      console.error("Error updating local wishlist:", error);
    }
  };

  // Remove product from local wishlist
  const handleRemoveFromLocalWishlist = () => {
    try {
      if (typeof window === "undefined" || typeof localStorage === "undefined")
        return;
      const wishlistData = localStorage.getItem("wishlist");
      let wishlist = wishlistData ? JSON.parse(wishlistData) : [];
      wishlist = wishlist.filter(
        (item) => (item._id || item.id) !== getProductId()
      );
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      // Dispatch custom event for instant UI update
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("wishlistUpdated", {
            detail: { count: wishlist.length },
          })
        );
      }
    } catch (error) {
      console.error("Error removing from local wishlist:", error);
    }
  };

  return (
    <div className="card flex flex-col bg-white shadow-sm rounded-lg overflow-hidden w-[300px] h-[400px] hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {/* Product Image */}
      <div className="card-image w-full h-48 bg-gray-50 overflow-hidden relative">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
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
        {/* Title */}
        <h2 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
          {product.title}
        </h2>
        {/* Price */}
        <div className="flex items-center mb-3">
          <div className="flex text-amber-400">
            <span className="material-symbols-outlined text-xs">star</span>
            <span className="material-symbols-outlined text-xs">star</span>
            <span className="material-symbols-outlined text-xs">star</span>
            <span className="material-symbols-outlined text-xs">star</span>
            <span className="material-symbols-outlined text-xs">star_half</span>
          </div>
          <p className="text-indigo-600 font-bold mb-1">₹{product.price}</p>
        </div>
        {/* Action Buttons */}
        <div className="card-actions flex flex-col gap-2">
          <button
            onClick={onAddToCart}
            className="w-full bg-indigo-600 text-white py-2 px-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <span className="material-symbols-outlined text-sm">
              {isProductInCart ? "shopping_cart_checkout" : "shopping_cart"}
            </span>
            {isProductInCart ? "Go to Cart" : "Add to Cart"}
          </button>
          <button
            onClick={onMoveToWishlist}
            className={`w-full py-2 px-3 rounded-md flex items-center justify-center gap-1 text-sm transition-colors ${
              isInWishlist
                ? "bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            } ${isAddingToWishlist ? "opacity-75 cursor-wait" : ""}`}
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

// Add Pagination component in the same file for reusability
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
