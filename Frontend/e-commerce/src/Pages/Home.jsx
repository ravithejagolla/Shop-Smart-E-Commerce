// Enhanced Home.jsx with better UI and features
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer/footer";
import { ProductCard } from "../components/ProductCard/Card";
import { getAllitems } from "../api/getAllitems";
import Pagination from "../components/Pagination";
import HeroCarousel from "../components/HeroCarousel";

// Hero banner images
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  "https://images.unsplash.com/photo-1555529771-122e5d9f2341",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
];

// Featured categories
const CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    icon: "devices",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03",
  },
  {
    id: 2,
    name: "Fashion",
    icon: "shopping_bag",
    image: "https://images.unsplash.com/photo-1542060748-10c28b62716f",
  },
  {
    id: 3,
    name: "Home & Kitchen",
    icon: "chair",
    image: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8",
  },
  {
    id: 4,
    name: "Furniture",
    icon: "bed",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
  },
  {
    id: 5,
    name: "Mobile Phones",
    icon: "smartphone",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    id: 6,
    name: "Accessories",
    icon: "watch",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
  },
];

export const Home = () => {
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllitems();

        if (data && Array.isArray(data)) {
          setItems(data);

          // Create featured items (with discounts)
          const discounted = data
            .filter(
              (item) => item.originalPrice && item.originalPrice > item.price
            )
            .sort((a, b) => {
              const discountA = 1 - a.price / a.originalPrice;
              const discountB = 1 - b.price / b.originalPrice;
              return discountB - discountA;
            })
            .slice(0, 4);
          setFeaturedItems(discounted);

          // Create new arrivals (random selection)
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setNewArrivals(shuffled.slice(0, 4));

          // Create best sellers (another random selection)
          const moreShuffle = [...data].sort(() => 0.5 - Math.random());
          setBestSellers(moreShuffle.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get current items for display
  const getCurrentItems = useCallback(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to products section
    document.getElementById("all-products").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="pt-16 flex-grow">
        {/* Hero Banner Section */}
        <HeroCarousel images={HERO_IMAGES}>
          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32 md:py-40">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Discover Amazing Products at Great Prices
              </h1>
              <p className="text-xl text-indigo-100 mb-10">
                Shop with confidence on our secure platform and enjoy fast
                delivery
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/shop"
                  className="px-8 py-3 rounded-md bg-white text-indigo-700 font-medium hover:bg-gray-100 transition-colors block text-center"
                >
                  Shop Now
                </Link>
                <a
                  href="#categories"
                  className="px-8 py-3 rounded-md bg-transparent border-2 border-white text-white font-medium hover:bg-white/10 transition-colors block text-center"
                >
                  Explore Categories
                </a>
              </div>
            </div>
          </div>
        </HeroCarousel>

        {/* Categories Section */}
        <div id="categories" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse our wide range of products across different categories
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="h-32 bg-gray-100 relative overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium">View All</span>
                      </div>
                    </div>
                    <div className="p-4 text-center flex-grow flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-indigo-600 mb-2">
                        {category.icon}
                      </span>
                      <h3 className="text-gray-900 font-medium">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        {featuredItems.length > 0 && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Products
                </h2>
                <Link
                  to="/shop"
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  View All
                  <span className="material-symbols-outlined ml-1">
                    arrow_forward
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="bg-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Stay Updated with New Arrivals & Offers
              </h2>
              <p className="text-indigo-100 mb-8">
                Subscribe to our newsletter and be the first to know about our
                new products, exclusive deals, and special offers.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow rounded-md border-0 bg-indigo-500 bg-opacity-50 text-white placeholder-indigo-200 px-4 py-3 focus:ring-2 focus:ring-white focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-indigo-200 mt-3 text-sm">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* New Arrivals Section */}
        {newArrivals.length > 0 && (
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  New Arrivals
                </h2>
                <Link
                  to="/shop"
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  View All
                  <span className="material-symbols-outlined ml-1">
                    arrow_forward
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <span className="material-symbols-outlined text-3xl">
                    local_shipping
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Free & Fast Delivery
                </h3>
                <p className="text-gray-600">
                  Free delivery for all orders over ₹499. We deliver within 1-3
                  business days.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <span className="material-symbols-outlined text-3xl">
                    check_circle
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quality Guarantee
                </h3>
                <p className="text-gray-600">
                  We guarantee the quality of all our products with a 100%
                  satisfaction guarantee.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <span className="material-symbols-outlined text-3xl">
                    support_agent
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  24/7 Customer Support
                </h3>
                <p className="text-gray-600">
                  Our friendly team is here to help you with any questions or
                  concerns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && (
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Best Sellers
                </h2>
                <Link
                  to="/shop"
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  View All
                  <span className="material-symbols-outlined ml-1">
                    arrow_forward
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Home;
