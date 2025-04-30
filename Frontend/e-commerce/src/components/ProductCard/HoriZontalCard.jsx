import { UseCart } from "../../context/cart-context";
import QuantityButton from "../QuantityButton";

export const HorizontalCard = ({ product }) => {
  // Accessing cart functions from context
  const { handleDecrement, handleIncrement, removeFromCart } = UseCart();

  return (
    <div className="card flex flex-col bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 w-f h-[450px]">
      <div className="card-image w-full h-50 bg-gray-200">
        <img
          className="object-cover w-full h-full"
          src={product.images[0]}
          alt="product"
        />
      </div>
      <div className="card-content p-4 flex flex-col justify-between flex-1">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h2>

        {/* Price */}
        <p className="text-gray-600 font-medium mb-4">Rs. {product.price}</p>
        <div className="quantity-container flex gap-3 mb-3">
          <p>Quantity</p>
          <QuantityButton
            product={product}
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
          />
        </div>
        <div className="cta-btn d-flex gap">
          <div className="cta-btn">
            <button
              className="flex-1 bg-red-600 text-white text-center w-full mb-4 py-4 px-6 rounded-md hover:bg-red-600 transition flex items-center justify-center"
              onClick={() => removeFromCart(product.id)} // Dispatching REMOVE_FROM_CART action
            >
              Remove From Cart
            </button>
          </div>
          <div className="cta-btn">
            <button className="flex-1 bg-green-700 text-white-500 py-4 px-5 w-full rounded-md hover:bg-green-700 transition flex items-center justify-center">
              Move to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
