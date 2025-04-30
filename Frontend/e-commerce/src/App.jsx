import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Cart } from "./Pages/Cart.jsx";
import { Home } from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import OrderSuccess from "./Pages/Ordersuccess.jsx";
import { SearchResultsPage } from "./Pages/SearchResult.jsx";
import { Wishlist } from "./Pages/Wishlist.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/wishlist" element={<Wishlist />} />{" "}
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/search" element={<SearchResultsPage />} />
    </Routes>
  );
}

export default App;
