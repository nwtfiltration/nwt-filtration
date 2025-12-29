import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";


export default function AdminOrderDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const updateStatus = async (status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("Update failed:", err);
        alert("Failed to update status");
        return;
      }

      setData((prev) => ({
        ...prev,
        order: {
          ...prev.order,
          order_status: status,
          payment_status:
            status === "DELIVERED"
              ? "PAID"
              : prev.order.payment_status,
        },
      }));
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => alert("Failed to fetch order"));
  }, [id]);

  if (!data) return <p className="p-6">Loading...</p>;

  const { order, items } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Helmet>
  <title>Order Details — NWT Filtration Admin</title>

  <meta
    name="description"
    content="View customer order details, update status and manage delivery workflow."
  />
</Helmet>

      <Link to="/admin/orders" className="text-blue-600 underline">
        ← Back to Orders
      </Link>

      <h1 className="text-2xl font-bold mt-3">Order #{order.id}</h1>

      {/* CUSTOMER + STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {/* CUSTOMER */}
        <div className="border rounded-lg p-4 bg-white">
          <h2 className="font-semibold mb-2">Customer</h2>
          <p>{order.name}</p>
          <p>{order.phone}</p>
          <p className="text-sm text-gray-600 mt-1">{order.address}</p>
        </div>

        {/* STATUS */}
        <div className="border rounded-lg p-4 bg-white">
          <h2 className="font-semibold mb-2">Order Status</h2>

          <p>Payment: {order.payment_status}</p>
          <p>Status: {order.order_status}</p>

          <p className="text-sm mt-1 text-gray-600">
            {new Date(order.created_at).toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => updateStatus("CONFIRMED")}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Confirm
            </button>

            <button
              onClick={() => updateStatus("DISPATCHED")}
              className="px-3 py-2 bg-orange-500 text-white rounded text-sm"
            >
              Dispatch
            </button>

            <button
              onClick={() => updateStatus("DELIVERED")}
              className="px-3 py-2 bg-green-600 text-white rounded text-sm"
            >
              Delivered
            </button>
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <h2 className="mt-6 font-semibold">Items</h2>

      <div className="mt-2 border rounded-lg overflow-hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-4 p-3 border-b text-sm"
          >
            <span className="min-w-0 truncate">
              {item.product_name} × {item.quantity}
            </span>
            <span className="font-medium">₹{item.total_price}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-4 font-bold text-lg">
        Total: ₹{order.total}
      </h2>
    </div>
  );
}
