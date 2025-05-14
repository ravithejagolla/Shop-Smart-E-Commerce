// ProductDetails.jsx - Enhanced version
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer/footer";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);

  const { addToCart, isInCart, getItemQuantity } = useCart();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `https://shop-smart-e-commerce.onrender.com/product/${id}`
        );
        if (response.data) {
          setProduct(response.data);

          // If product exists, fetch related products
          fetchRelatedProducts(response.data.category);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    checkWishlistStatus();
  }, [id]);

  // Fetch related products based on category
  const fetchRelatedProducts = async (category) => {
    if (!category) return;

    try {
      const response = await axios.get(
        `https://shop-smart-e-commerce.onrender.com/product/category/${category}`
      );

      if (response.data) {
        // Filter out current product and limit to 4 items
        const filtered = response.data
          .filter((item) => item.id !== id)
          .slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  // Check if product is in wishlist
  const checkWishlistStatus = useCallback(() => {
    try {
      const wishlistData = localStorage.getItem("wishlist");
      if (wishlistData) {
        const wishlist = JSON.parse(wishlistData);
        const exists = wishlist.some((item) => item.id === id);
        setIsInWishlist(exists);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  }, [id]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (addingToCart || !product) return;

    setAddingToCart(true);

    try {
      addToCart(product, quantity);

      // Show success message or notification
      setTimeout(() => {
        setAddingToCart(false);
      }, 500);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAddingToCart(false);
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!product) return;

    // Add to cart first
    addToCart(product, quantity);

    // Navigate to checkout
    navigate("/checkout");
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    try {
      const wishlistData = localStorage.getItem("wishlist");
      let wishlist = wishlistData ? JSON.parse(wishlistData) : [];

      if (isInWishlist) {
        // Remove from wishlist
        wishlist = wishlist.filter((item) => item.id !== id);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        if (!wishlist.some((item) => item.id === id) && product) {
          wishlist.push(product);
          localStorage.setItem("wishlist", JSON.stringify(wishlist));
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  // Handle quantity changes
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!product?.originalPrice || !product?.price) return null;

    const discount = Math.round(
      (1 - product.price / product.originalPrice) * 100
    );
    return discount > 0 ? discount : null;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow pt-20 px-4">
          <div className="max-w-6xl mx-auto py-12 text-center">
            <div className="bg-red-50 p-6 rounded-lg inline-block">
              <span className="material-symbols-outlined text-6xl text-red-500 mb-4">
                error
              </span>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Product Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "This product doesn't exist or has been removed."}
              </p>
              <Link
                to="/"
                className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
              >
                <span className="material-symbols-outlined mr-2">
                  arrow_back
                </span>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = calculateDiscount();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20 flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumbs */}
          <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-600 inline-flex items-center"
                >
                  <span className="material-symbols-outlined text-sm mr-1">
                    home
                  </span>
                  Home
                </Link>
              </li>
              {product.category && (
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <Link
                      to={`/category/${product.category}`}
                      className="text-gray-600 hover:text-indigo-600"
                    >
                      {product.category}
                    </Link>
                  </div>
                </li>
              )}
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-indigo-600">{product.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Product Details Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={
                      product.images?.[selectedImage] ||
                      "https://via.placeholder.com/600"
                    }
                    alt={product.title}
                    className="w-full h-full object-contain p-4"
                  />
                </div>

                {/* Image Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                          selectedImage === idx
                            ? "border-indigo-500"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.title} - view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Title and Badges */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {product.inStock ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Out of Stock
                      </span>
                    )}

                    {discount && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>

                  {/* Brand or Category */}
                  {product.brand && (
                    <p className="text-sm text-gray-600 mb-2">
                      Brand:{" "}
                      <span className="font-medium">{product.brand}</span>
                    </p>
                  )}

                  {/* Ratings */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      <span className="material-symbols-outlined text-sm">
                        star
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        star
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        star
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        star
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        star_half
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      4.5 (120 reviews)
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{product.price}
                    </span>

                    {product.originalPrice && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                        {discount && (
                          <span className="text-green-600 font-medium">
                            Save {discount}%
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Inclusive of all taxes
                  </p>
                </div>

                {/* Product Attributes */}
                {(product.color || product.size) && (
                  <div className="space-y-4 pb-6 border-b border-gray-200">
                    {/* Color */}
                    {product.color && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Color: {product.color}
                        </h3>
                        <div className="flex gap-2">
                          {/* Example color options - replace with actual colors */}
                          <button className="w-8 h-8 rounded-full bg-red-500 ring-2 ring-offset-2 ring-red-500"></button>
                          <button className="w-8 h-8 rounded-full bg-blue-500"></button>
                          <button className="w-8 h-8 rounded-full bg-green-500"></button>
                          <button className="w-8 h-8 rounded-full bg-yellow-500"></button>
                        </div>
                      </div>
                    )}

                    {/* Size */}
                    {product.size && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            Size: {product.size}
                          </h3>
                          <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                            Size Chart
                          </button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {/* Example size options - replace with actual sizes */}
                          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                            S
                          </button>
                          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-indigo-600 text-white">
                            M
                          </button>
                          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                            L
                          </button>
                          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                            XL
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <label
                      htmlFor="quantity"
                      className="text-sm font-medium text-gray-700 mr-4"
                    >
                      Quantity:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() =>
                          quantity > 1 && setQuantity(quantity - 1)
                        }
                        className="w-8 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>

                      <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-12 h-10 text-center border-x border-gray-300 focus:outline-none"
                        min="1"
                      />

                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={
                        addingToCart || isInCart(product.id) || !product.inStock
                      }
                      className={`flex-1 py-3 px-4 rounded-md font-medium flex items-center justify-center ${
                        !product.inStock
                          ? "bg-gray-400 cursor-not-allowed"
                          : isInCart(product.id)
                          ? "bg-green-600 text-white"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      } transition-colors`}
                    >
                      {addingToCart ? (
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
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
                      ) : (
                        <span className="material-symbols-outlined mr-2">
                          {isInCart(product.id) ? "check" : "shopping_cart"}
                        </span>
                      )}

                      {!product.inStock
                        ? "Out of Stock"
                        : isInCart(product.id)
                        ? "Added to Cart"
                        : "Add to Cart"}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={!product.inStock}
                      className={`flex-1 py-3 px-4 rounded-md font-medium ${
                        !product.inStock
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-orange-500 text-white hover:bg-orange-600"
                      } transition-colors`}
                    >
                      Buy Now
                    </button>

                    <button
                      onClick={handleWishlistToggle}
                      className={`w-12 h-12 flex items-center justify-center rounded-md border ${
                        isInWishlist
                          ? "border-red-200 bg-red-50 text-red-500"
                          : "border-gray-300 hover:bg-gray-50 text-gray-600"
                      }`}
                      aria-label={
                        isInWishlist
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <span className="material-symbols-outlined">
                        {isInWishlist ? "favorite" : "favorite_border"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-gray-600">
                      local_shipping
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Free Delivery
                      </h4>
                      <p className="text-sm text-gray-600">
                        Free delivery on orders above ₹499
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-gray-600">
                      assignment_return
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Easy Returns
                      </h4>
                      <p className="text-sm text-gray-600">
                        7 days return policy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-gray-600">
                      verified
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Authentic Products
                      </h4>
                      <p className="text-sm text-gray-600">
                        100% genuine products
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Product Description
              </h2>
              <div className="prose max-w-none text-gray-600">
                {/* Split description into paragraphs */}
                {product.description?.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                )) || <p>No description available.</p>}
              </div>
            </div>
          </div>

          {/* Product Specifications/Features */}
          {product.features && (
            <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Features & Specifications
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-indigo-600 mt-0.5">
                        check_circle
                      </span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                You may also like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <div
                    key={relProduct.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <Link to={`/product/${relProduct.id}`} className="block">
                      <div className="aspect-square bg-gray-50 overflow-hidden">
                        <img
                          src={
                            relProduct.images?.[0] ||
                            "https://via.placeholder.com/300"
                          }
                          alt={relProduct.title}
                          className="w-full h-full object-contain p-4"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="text-gray-900 font-medium mb-1 line-clamp-2">
                          {relProduct.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-indigo-600">
                            ₹{relProduct.price}
                          </span>
                          {relProduct.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{relProduct.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;
