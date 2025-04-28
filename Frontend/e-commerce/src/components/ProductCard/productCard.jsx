export const ProductCard = ({ product }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 w-72">
        <div className="h-60 bg-gray-100 flex items-center justify-center">
          <img
            src={product.images[0]}
            alt={product.title}
            className="object-contain h-full p-4"
          />
        </div>
        <div className="p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.title}
          </h2>
          <p className="text-green-700 font-bold text-xl mb-4">₹ {product.price}</p>
  
          <button className="mt-auto bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
            View Details
          </button>
        </div>
      </div>
    );
  };
  