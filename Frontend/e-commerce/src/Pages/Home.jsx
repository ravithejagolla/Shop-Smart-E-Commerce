import { Navbar } from "../components/Navbar"
import { useEffect,useState} from "react";
import { getAllitems } from "../api/getAllitems";
import { ProductCard } from "../components/ProductCard/Card";
import { UseCart } from "../context/cart-context";
import { Footer } from "../components/Footer/footer";

export const Home = () => {
  const [items, setItems] = useState([]);
  const {cart}=UseCart()
  console.log({cart})

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllitems();
        console.log(data); 
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex flex-wrap gap-8 justify-center py-8">
        {items?.length > 0 ? (
          items.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p>No items available</p>
        )}
      </main>
      <Footer />
    </>
  );
};


