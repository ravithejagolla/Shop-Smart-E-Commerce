import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const onNavigateClick = () => {
    navigate("/");
  };

  const onSearchSubmit = (e) => {
    e.preventDefault(); // prevent page reload on form submit
    if (searchText.trim() !== "") {
      // Navigate to the SearchResultsPage with the search query
      navigate(`/search?keyword=${searchText}`);
      setSearchText(""); // Clear search input after navigating
    }
  };

  return (
    <header className="flex bg-green-600 py-4 px-6 text-white items-center">
      <div>
        <h1
          className="ml-2 text-4xl font-bold cursor-pointer"
          onClick={onNavigateClick}
        >
          Shop It
        </h1>
      </div>

      {/* Search Input */}
      <form onSubmit={onSearchSubmit} className="ml-10 flex items-center gap-2">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search products..."
          className="px-4 py-2 rounded-md text-black focus:outline-none"
        />
        <button
          type="submit"
          className="bg-white text-green-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition"
        >
          Search
        </button>
      </form>

      {/* Navigation Icons */}
      <nav className="ml-auto flex items-center gap-6">
        <span onClick={() => navigate("/wishlist")} className="material-symbols-outlined text-4xl cursor-pointer">
          favorite
        </span>
        <span onClick={() => navigate("/cart")} className="material-symbols-outlined text-4xl cursor-pointer">
          shopping_cart
        </span>
        <span onClick={() => navigate("/login")} className="text-lg cursor-pointer hover:underline">
          Login
        </span>
        <span onClick={() => navigate("/register")} className="text-lg cursor-pointer hover:underline">
          Register
        </span>
      </nav>
    </header>
  );
};

export { Navbar };
