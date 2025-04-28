import { Navbar } from "../components/Navbar";
import { PriceDetails } from "../components/PriceDetails/Price";
import { HorizontalCard } from "../components/ProductCard/HoriZontalCard";
import { UseCart } from "../context/cart-context";

export const Cart = () => {
    const { cart } = UseCart();
    console.log({ cart });

    return (
        <>
            <Navbar />
            <main className="flex justify-between gap-6 pt-6">
                {/* Cart Items Section */}
                <div className="flex-1">
                    {
                        cart && cart.length > 0 ? 
                            <h2>Your Cart: ({cart.length}) items</h2> : 
                            <h2>Your Cart is Empty</h2>
                    }
                    <div className="ml-3 flex flex-wrap gap-4">
                        {
                            cart && cart.length > 0 ? 
                            cart.map(product => <HorizontalCard key={product.id} product={product} />) : 
                            ""
                        }
                    </div>
                </div>

                {/* Price Details Section (Order Summary) */}
                <div className="w-[310px]">
                    <PriceDetails />
                </div>
            </main>
        </>
    );
};
