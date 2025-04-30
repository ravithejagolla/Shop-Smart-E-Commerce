// import { Navbar } from "../components/Navbar"
// import { useEffect,useState} from "react";
// import { getAllitems } from "../api/getAllitems";
// import { ProductCard } from "../components/ProductCard/Card";
// import { UseCart } from "../context/cart-context";
// import { Footer } from "../components/Footer/footer";

// export const Home = () => {
//   const [items, setItems] = useState([]);
//   const {cart}=UseCart()
//   console.log({cart})

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getAllitems();
//         console.log(data);
//         setItems(data);
//       } catch (error) {
//         console.error("Failed to fetch items:", error);
//       }
//     })();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <main className="flex flex-wrap gap-8 justify-center py-8">
//         {items?.length > 0 ? (
//           items.map((product) => <ProductCard key={product.id} product={product} />)
//         ) : (
//           <p>No items available</p>
//         )}
//       </main>
//       <Footer />
//     </>
//   );
// };

import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { getAllitems } from "../api/getAllitems";
import { ProductCard } from "../components/ProductCard/Card";
import { UseCart } from "../context/cart-context";
import { Footer } from "../components/Footer/footer";
import { Pagination } from "../components/ProductCard/Card"; // Import Pagination component

export const Home = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust based on your preference
  // const { cart } = UseCart();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await getAllitems();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get current items for display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({
      top: 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-16 flex-grow">
        {/* Banner Section */}
        <div className="bg-indigo-600 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to RetailCanvas</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Discover amazing products at great prices. Shop with confidence
              with our secure platform.
            </p>
            <button className="bg-white text-indigo-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Explore Now
            </button>
          </div>
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Our Products
            </h2>
            <p className="text-gray-600">
              Browse our collection of high-quality products
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {currentItems?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                  {currentItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No items available</p>
                </div>
              )}

              {/* Only show pagination if we have items */}
              {items.length > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
