import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const onNavigateClick = () => {
    navigate("/");
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

      <nav className="ml-auto flex items-center gap-6">
        <span className="material-symbols-outlined text-4xl cursor-pointer">
          favorite
        </span>

        <span
          onClick={() => navigate("/cart")}
          className="material-symbols-outlined text-4xl cursor-pointer"
        >
          shopping_cart
        </span>

        <span
          onClick={() => navigate("/login")}
          className="text-lg cursor-pointer hover:underline"
        >
          Login
        </span>

        <span
          onClick={() => navigate("/register")}
          className="text-lg cursor-pointer hover:underline"
        >
          Register
        </span>
      </nav>
    </header>
  );
};

export { Navbar };
