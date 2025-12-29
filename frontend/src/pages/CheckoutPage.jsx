import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

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
    gstin: ""
  });

  const SHIPPING = 1050;
  const GST = totalAmount * 0.18;
  const GRAND_TOTAL = totalAmount + SHIPPING + GST;

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address) {
      alert("Please fill required fields (Name, Phone, Address)");
      return;
    }

    const summary = {
      subtotal: totalAmount,
      gst: GST,
      shipping: SHIPPING,
      total: GRAND_TOTAL
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: customer.name,
            company: customer.company,
            phone: customer.phone,
            address: `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
          },
          cart: cart.map(item => ({
            id: item.id,
            name: item.name,
            qty: item.qty,
            price: item.price.discounted
          })),
          summary
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
            <span>Shipping</span>
            <span>₹{SHIPPING}</span>
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
