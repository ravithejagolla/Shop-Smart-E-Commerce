import React from "react";
import { UseCart } from "../../context/cart-context";
import { findProduct } from "../../utilites/findProduct";
import { useNavigate } from "react-router-dom";
export const ProductCard = ({ product}) => {

    const {cart,cartdispatch}=UseCart()
    const isProductIncart=findProduct(cart,product.id)

    const Navigate = useNavigate();

    const onAddToCart=()=>{
        !isProductIncart?
        cartdispatch({
            type: "ADD_TO_CART",
            payload: product
        }):Navigate('/cart')
    }

    return (
        <div className="card flex flex-col bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 w-64 h-[450px]">
            {/* Product Image */}
            <div className="card-image w-full h-50 bg-gray-200">
                <img
                    src={product.images[0]}
                    alt={product.title}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Card Content */}
            <div className="card-content p-4 flex flex-col justify-between flex-1">
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.title}</h2>

                {/* Price */}
                <p className="text-gray-600 font-medium mb-4">Rs. {product.price}</p>

                {/* Action Buttons */}
                <div className="card-actions flex flex-col gap-4 text-items-center ">
                    <button
                        className="flex-1 bg-green-700 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transitionflex items-center justify-center"
                        onClick={() => onAddToCart(product)}
                    >
                        <span  className="material-symbols-outlined text-align-center text-2xl !text-2xl hover:cursor-pointer">
                            {
                                isProductIncart? 'shopping_cart_checkout': 'shopping_cart'
                                    
                            }
                        </span>
                        {
                            isProductIncart? 'Go to Cart' : 'Add to Cart'
                        }
                    </button>
                    <button
                        className="flex-1 bg-red-600 text-white py-4 px-4  mb-3 rounded-md hover:bg-red-600 transition flex items-center justify-center"
                        onClick={() => onMoveToWishlist(product)}
                    >
                        Wishlist
                    </button>
                </div>
            </div>
        </div>
    );
};
