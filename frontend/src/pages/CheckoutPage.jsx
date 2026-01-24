import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function CheckoutPage() {
  const { cart, totalAmount } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstin: "",
  });

  // 🔹 shipping dynamic (starts 0)
  const [shipping, setShipping] = useState(0);

  // 🔹 transport search / input
  const [transport, setTransport] = useState("");

  const GST = totalAmount * 0.18;
  const GRAND_TOTAL = totalAmount + shipping + GST;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer({ ...customer, [name]: value });

    // 🔹 when state or city changes → update tariff
    if (name === "state" || name === "city") {
      calculateTariff(
        name === "state" ? value : customer.state,
        name === "city" ? value : customer.city
      );
    }
  };

  // ------------------------------
  // SHIPPING TARIFF LOGIC
  // ------------------------------
  function calculateTariff(state, city) {
    if (!state) return;

    let price = 0;

    const s = state.toLowerCase();

    // simple example tariff — SAFE
    if (
      s.includes("karnataka") ||
      s.includes("andhra") ||
      s.includes("tamil") ||
      s.includes("telangana")
    ) {
      price = 400;
    } else if (
      s.includes("maharashtra") ||
      s.includes("kerala") ||
      s.includes("goa")
    ) {
      price = 600;
    } else if (
      s.includes("gujarat") ||
      s.includes("rajasthan") ||
      s.includes("mp")
    ) {
      price = 800;
    } else {
      price = 1000; // default all-india
    }

    setShipping(price);
  }

  const placeOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address) {
      alert("Please fill required fields (Name, Phone, Address)");
      return;
    }

    if (!transport) {
      alert("Please select / enter a transport service");
      return;
    }

    const summary = {
      subtotal: totalAmount,
      gst: GST,
      shipping,
      total: GRAND_TOTAL,
      transport,
    };

    try {
      const res = await fetch("https://miraculous-bravery-production.up.railway.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: customer.name,
            company: customer.company,
            phone: customer.phone,
            address: `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
            city: customer.city,
            state: customer.state,
            gstin: customer.gstin,
          },
          cart: cart.map((item) => ({
            id: item.id,
            name: item.name,
            qty: item.qty,
            price: item.price.discounted,
          })),
          transport,
          summary,
        }),
      });

      const data = await res.json();
      navigate(`/order-success/${data.orderId}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong placing order");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
      <Helmet>
        <title>Checkout — NWT Filtration</title>

        <meta
          name="description"
          content="Complete your quotation request and order details for RO, UF, UV and industrial filtration systems."
        />
      </Helmet>

      {/* LEFT – BILLING DETAILS */}
      <div className="lg:col-span-2 bg-white border rounded-xl p-5 sm:p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Checkout</h2>
        <p className="text-sm text-gray-500">
          Enter billing and delivery details
        </p>

        {/* BILLING FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <input
            className="border rounded p-3"
            placeholder="Full Name *"
            name="name"
            onChange={handleChange}
          />

          <input
            className="border rounded p-3"
            placeholder="Phone Number *"
            name="phone"
            onChange={handleChange}
          />

          <input
            className="border rounded p-3 md:col-span-2"
            placeholder="Company Name"
            name="company"
            onChange={handleChange}
          />

          <input
            className="border rounded p-3 md:col-span-2"
            placeholder="Street Address *"
            name="address"
            onChange={handleChange}
          />

          <input
            className="border rounded p-3"
            placeholder="City"
            name="city"
            onChange={handleChange}
          />

          <input
            className="border rounded p-3"
            placeholder="State"
            name="state"
            onChange={handleChange}
          />

          <input
            className="border rounded p-3"
            placeholder="PIN Code"
            name="pincode"
            onChange={handleChange}
          />

          <input
            className="border rounded p-3"
            placeholder="GSTIN (Optional)"
            name="gstin"
            onChange={handleChange}
          />
        </div>

        {/* TRANSPORT */}
        <div>
          <h3 className="font-semibold mt-4 mb-1">Transport / Courier</h3>

          <input
            className="border rounded p-3 w-full"
            placeholder="Search / type transport service (ex: VRL, SRMT, DTDC)"
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
          />

          <p className="text-xs text-gray-500 mt-1">
            All-India services supported — choose the one you prefer.
          </p>
        </div>

        {/* PAYMENT */}
        <div className="pt-2 sm:pt-4">
          <h3 className="font-semibold mb-2">Payment Method</h3>

          <div className="border rounded-lg p-4 bg-gray-50">
            <label className="flex items-center gap-3">
              <input type="radio" checked readOnly />
              <span className="text-sm font-medium">
                Cash on Delivery (COD)
              </span>
            </label>

            <p className="text-xs text-gray-500 mt-2">
              Pay when the product is delivered.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT – ORDER SUMMARY */}
      <div className="bg-gray-50 border rounded-xl p-5 sm:p-6 h-fit lg:sticky lg:top-24 space-y-5">
        <h3 className="text-lg font-semibold">Order Summary</h3>

        <div className="space-y-4 text-sm max-h-64 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium line-clamp-2">{item.name}</p>
                <p className="text-gray-500">Qty: {item.qty}</p>
              </div>
              <span className="font-medium">
                ₹{item.qty * item.price.discounted}
              </span>
            </div>
          ))}
        </div>

        <hr />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping (auto-calculated)</span>
            <span>₹{shipping}</span>
          </div>

          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>₹{GST.toFixed(2)}</span>
          </div>
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>₹{GRAND_TOTAL.toFixed(2)}</span>
        </div>

        <button
          onClick={placeOrder}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
        >
          Place Order (Cash on Delivery)
        </button>

        <p className="text-xs text-gray-500 text-center">
          GST invoice will be provided
        </p>
      </div>
    </section>
  );
}
