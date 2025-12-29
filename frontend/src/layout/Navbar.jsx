import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("dealer_token");
  const { totalQty = 0, totalAmount = 0 } = useCart();

  const [open, setOpen] = useState(false);

  // ⭐ Scroll helper — works from any page
  const scrollToSection = async (id) => {
    // If not on home, go home first
    if (location.pathname !== "/") {
      navigate("/");
      // wait a moment for home to render
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
      return;
    }

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl sm:text-2xl font-bold">
            NWT Filtration
          </h1>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">

          <a href="tel:+919483861000" className="text-right">
            <p className="text-red-600 text-xs font-semibold">
              NEED HELP?
            </p>
            <p className="font-bold">+91 94838 61000</p>
          </a>

          <div className="flex gap-6 font-medium">
            <button onClick={() => navigate("/products")} className="hover:text-green-600">
              Products
            </button>

            <button onClick={() => scrollToSection("about")} className="hover:text-green-600">
              About Us
            </button>

            <button onClick={() => scrollToSection("contact")} className="hover:text-green-600">
              Contact Us
            </button>
          </div>

          <span className="text-gray-300">|</span>

          {!token ? (
            <button
              onClick={() => navigate("/dealer-login")}
              className="font-medium hover:text-green-600"
            >
              Login
            </button>
          ) : (
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

          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition"
          >
            CART / ₹{totalAmount.toLocaleString("en-IN")}
            <ShoppingCart size={20} />

            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {totalQty}
              </span>
            )}
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-4">

          <button
            onClick={() => { navigate("/products"); setOpen(false); }}
            className="block w-full text-left py-2 font-medium"
          >
            Products
          </button>

          <button
            onClick={() => { scrollToSection("about"); setOpen(false); }}
            className="block w-full text-left py-2 font-medium"
          >
            About Us
          </button>

          <button
            onClick={() => { scrollToSection("contact"); setOpen(false); }}
            className="block w-full text-left py-2 font-medium"
          >
            Contact Us
          </button>

          {!token ? (
            <button
              onClick={() => { navigate("/dealer-login"); setOpen(false); }}
              className="block w-full text-left py-2 font-medium"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("dealer_token");
                localStorage.removeItem("dealer_name");
                window.location.reload();
              }}
              className="block w-full text-left py-2 font-medium text-red-600"
            >
              Logout
            </button>
          )}

          <button
            onClick={() => { navigate("/cart"); setOpen(false); }}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
          >
            Go to Cart ({totalQty})
          </button>
        </div>
      )}
    </nav>
  );
}
