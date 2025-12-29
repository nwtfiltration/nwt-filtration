import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import logo from "../assets/logo.jpg";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("dealer_token");


  // ✅ Correct values from CartContext
  const { cart = [], totalQty = 0, totalAmount = 0 } = useCart();

  return (
    <nav className="w-full bg-white shadow-md px-16 py-4 sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center justify-between">

        {/* LEFT: LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-aqua">
            NWT Filtration
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-8">

          {/* HELP */}
          <a href="tel:+919483861000" className="text-right">
            <p className="text-red-600 text-xs font-semibold">
              NEED HELP?
            </p>
            <p className="text-deepBlue font-bold">
              +91 94838 61000
            </p>
          </a>

          {/* NAV LINKS */}
          <div className="flex gap-6 font-medium text-deepBlue">
            <button
              onClick={() => navigate("/products")}
              className="hover:text-aqua"
            >
              Products
            </button>
            <button
              onClick={() => navigate("/#about")}
              className="hover:text-aqua"
            >
              About Us
            </button>
            <button
              onClick={() => navigate("/#contact")}
              className="hover:text-aqua"
            >
              Contact Us
            </button>
          </div>

          <span className="text-gray-300">|</span>

          {/* LOGIN */}
         {/* LOGIN (only show if NOT logged in) */}
{!token && (
  <button
    onClick={() => navigate("/dealer-login")}
    className="font-medium text-deepBlue hover:text-aqua"
  >
    Login
  </button>
)}
{/* LOGOUT (only show if logged in) */}
{token && (
  <button
    onClick={() => {
      localStorage.removeItem("dealer_token");
      localStorage.removeItem("dealer_name");
      window.location.reload();
    }}
    className="font-medium text-red-600"
  >
    Logout
  </button>
)}


          {/* CART */}
          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition"
          >
            CART / ₹{totalAmount.toLocaleString("en-IN")}
            <ShoppingCart size={20} />

            {/* ✅ Quantity Badge */}
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {totalQty}
              </span>
            )}
          </button>

        </div>
      </div>
    </nav>
  );
}
