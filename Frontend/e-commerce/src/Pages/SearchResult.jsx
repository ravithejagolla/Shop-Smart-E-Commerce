import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ProductCard } from "../components/ProductCard/productCard";// ✅ Import New Card

const SearchResultsPage = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `https://shop-smart-e-commerce.onrender.com/product/search?keyword=${keyword}`
        );
        const data = await response.json();
        console.log("Fetched search products:", data.products);
        setSearchResults(data.products || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchSearchResults();
    }
  }, [keyword]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (searchResults.length === 0) {
    return <div className="p-6 text-center text-xl">No products found for "{keyword}".</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Search Results for "{keyword}"</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export { SearchResultsPage };
