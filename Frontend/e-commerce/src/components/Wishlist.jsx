import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer/footer";
import { UseCart } from "../context/cart-context";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, cartdispatch } = UseCart();
  const navigate = useNavigate();

  // Fetch wishlist data when component mounts
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Function to fetch wishlist data
  const fetchWishlist = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if user is logged in
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // First try to get server wishlist if logged in
      if (token) {
        try {
          // This endpoint might be different depending on your API structure
          const response = await axios.get(
            "https://shop-smart-e-commerce.onrender.com/user/wishlist",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data && response.data.length > 0) {
            setWishlistItems(response.data);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.log(
            "Server wishlist not available, falling back to local storage",
            error
          );
          // Continue to use localStorage if API fails
        }
      }

      // Fall back to localStorage wishlist
      const localWishlist = localStorage.getItem("wishlist");
      if (localWishlist) {
        setWishlistItems(JSON.parse(localWishlist));
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Failed to load your wishlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // Remove from server wishlist if logged in
      if (token) {
        try {
          await axios.post(
            "https://shop-smart-e-commerce.onrender.com/product/removewishlist",
            { productId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error("Error removing from server wishlist:", error);
        }
      }

      // Always update local wishlist
      const localWishlist = localStorage.getItem("wishlist");
      if (localWishlist) {
        const wishlist = JSON.parse(localWishlist);
        const updatedWishlist = wishlist.filter(
          (item) => item.id !== productId
        );
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setWishlistItems(updatedWishlist);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  // Function to add item to cart
  const addToCart = (product) => {
    cartdispatch({
      type: "ADD_TO_CART",
      payload: product,
    });

    // Optionally, navigate to cart or show confirmation
    // navigate('/cart');
  };

  // Check if a product is already in the cart
  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <Link
              to="/products"
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <span className="material-symbols-outlined mr-1">arrow_back</span>
              Continue Shopping
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {wishlistItems.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          {/* Product Image */}
                          <div className="h-48 bg-gray-50 overflow-hidden">
                            <img
                              src={
                                product.images && product.images[0]
                                  ? product.images[0]
                                  : "https://via.placeholder.com/300"
                              }
                              alt={product.title}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Remove button (X) */}
                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
                            aria-label="Remove from wishlist"
                          >
                            <span className="material-symbols-outlined text-gray-600">
                              close
                            </span>
                          </button>
                        </div>

                        <div className="p-4">
                          {/* Product Details */}
                          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                            {product.title}
                          </h2>

                          <p className="text-indigo-600 font-bold mb-4">
                            ₹{product.price}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                isInCart(product.id)
                                  ? navigate("/cart")
                                  : addToCart(product)
                              }
                              className={`flex-1 py-2 px-3 rounded-md text-white font-medium text-sm flex items-center justify-center gap-1
                                ${
                                  isInCart(product.id)
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {isInCart(product.id)
                                  ? "shopping_cart_checkout"
                                  : "shopping_cart"}
                              </span>
                              {isInCart(product.id)
                                ? "Go to Cart"
                                : "Add to Cart"}
                            </button>

                            <Link
                              to={`/product/${product.id}`}
                              className="w-10 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center hover:bg-gray-200"
                            >
                              <span className="material-symbols-outlined">
                                visibility
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                  <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
                    <span className="material-symbols-outlined text-6xl text-gray-400">
                      favorite
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    Your wishlist is empty
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    You don't have any items in your wishlist yet. Browse our
                    products and add your favorites!
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
                  >
                    Explore Products
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
