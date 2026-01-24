import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("https://miraculous-bravery-production.up.railway.app/api/orders")
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => alert("Failed to fetch orders"));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Helmet>
        <title>Admin — Orders Dashboard | NWT Filtration</title>

        <meta
          name="description"
          content="Admin panel to manage customer orders, payment status and delivery progress."
        />
      </Helmet>

      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Courier</th>
                <th className="p-3 text-left">Shipping</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3 font-semibold">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-blue-600 underline"
                    >
                      #{order.id}
                    </Link>
                  </td>

                  <td className="p-3 truncate max-w-[160px]">
                    {order.customer_name}
                  </td>

                  <td className="p-3">{order.phone}</td>

                  {/* NEW — Courier */}
                  <td className="p-3">
                    {order.courier || "—"}
                  </td>

                  {/* NEW — Shipping */}
                  <td className="p-3">
                    ₹{order.shipping ?? 0}
                  </td>

                  <td className="p-3 font-medium">₹{order.total}</td>

                  <td className="p-3">{order.payment_status}</td>

                  <td className="p-3">{order.order_status}</td>

                  <td className="p-3">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
