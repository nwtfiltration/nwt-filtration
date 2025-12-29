import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">
        Order Placed Successfully 🎉
      </h1>

      <div className="border rounded p-4">
        <p><b>Order ID:</b> {orderId}</p>
        <p><b>Payment Method:</b> Cash on Delivery</p>
        <p><b>Payment Status:</b> Pending</p>
      </div>

      <h2 className="font-semibold mt-4 mb-2">Items</h2>

      {data.items.map(item => (
        <div key={item.id} className="flex justify-between border-b py-2">
          <span>{item.product_name} × {item.quantity}</span>
          <span>₹{item.total_price}</span>
        </div>
      ))}

      <h2 className="font-semibold mt-4">
        Total: ₹{data.order.total}
      </h2>

      <p className="mt-3 text-gray-600 text-sm">
        Our team will contact you soon and collect payment on delivery.
      </p>

      <Link to="/" className="inline-block mt-4 text-blue-600 underline">
        Go back to home
      </Link>
    </div>
  );
}
