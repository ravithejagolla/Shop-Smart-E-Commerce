import { UseWishlist } from "../../context/wishlist-context";

const Wishlist = () => {
  const { wishlist, wishlistdispatch } = UseWishlist();

  const handleRemoveFromWishlist = (id) => {
    wishlistdispatch({ type: "REMOVE_FROM_WISHLIST", payload: { id } });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {wishlist.map((item) => (
            <li key={item.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-500">{item.description}</p>
              </div>
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
