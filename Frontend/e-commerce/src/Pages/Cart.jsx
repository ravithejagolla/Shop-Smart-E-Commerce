
import { Navbar} from "../components/Navbar";
import { PriceDetails } from "../components/PriceDetails/Price";
import { HorizontalCard } from "../components/ProductCard/HoriZontalCard";
import { UseCart } from "../context/cart-context";

export const Cart = () => {

    const { cart } = UseCart();
    console.log({cart})

    return (
        <>
            <Navbar />
            <main className="flex flex-col items-center pt-6 gap-6">
            {
                cart && cart.length > 0 ? <h2>Your Cart: ({cart.length}) items</h2> : <h2>Your Cart is Empty</h2>
            }
            <div>
            <div className="ml-3 flex flex-row flex-wrap gap-4 alignitems-center">
                {
                    cart && cart.length > 0 ? cart.map(product => <HorizontalCard key={product.id} product={product} />) : ""
                }
            </div>
            <PriceDetails/>
            
            </div>
            </main>
            
        </>
        
    )
}