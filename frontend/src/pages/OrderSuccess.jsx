import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => alert("Failed to fetch order"));
  }, [orderId]);

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto">
      <Helmet>
  <title>Order Placed — NWT Filtration</title>

  <meta
    name="description"
    content="Your order has been placed successfully. Our team will contact you for confirmation and delivery."
  />
</Helmet>

      <h1 className="text-2xl font-bold mb-4">
        Order Placed Successfully 🎉
      </h1>

      {/* ORDER DETAILS CARD */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <p><b>Order ID:</b> {orderId}</p>
        <p><b>Payment Method:</b> Cash on Delivery</p>
        <p><b>Payment Status:</b> Pending</p>
      </div>

      {/* ITEMS */}
      <h2 className="font-semibold mt-5 mb-2">Items</h2>

      <div className="border rounded-lg">
        {data.items.map(item => (
          <div
            key={item.id}
            className="flex justify-between gap-4 border-b py-2 px-3 text-sm"
          >
            <span className="truncate">
              {item.product_name} × {item.quantity}
            </span>
            <span>₹{item.total_price}</span>
          </div>
        ))}
      </div>

      <h2 className="font-semibold mt-4 text-lg">
        Total: ₹{data.order.total}
      </h2>

      <p className="mt-3 text-gray-600 text-sm">
        Our team will contact you soon and collect payment on delivery.
      </p>

      <Link
        to="/"
        className="inline-block mt-5 text-blue-600 underline"
      >
        Go back to home
      </Link>
    </div>
  );
}
