import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then(res => res.json())
      .then(setOrders)
      .catch(() => alert("Failed to fetch orders"));
  }, []);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b">
<td className="p-3 font-semibold">
  <a
    href={`/admin/orders/${order.id}`}
    className="text-blue-600 underline"
  >
    #{order.id}
  </a>
</td>
                  <td className="p-3">{order.customer_name}</td>
                  <td className="p-3">{order.phone}</td>
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
