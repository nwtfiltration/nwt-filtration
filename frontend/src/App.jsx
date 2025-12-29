import { Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Cart from "./pages/CartPage";
import Checkout from "./pages/CheckoutPage";
import DealerLogin from "./pages/DealerLogin";
import OrderSuccess from "./pages/OrderSuccess";
import AllProducts from "./pages/AllProducts";
import CategoryProducts from "./pages/CategoryProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import DealerRegister from "./pages/DealerRegister";




export default function App() {
  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          <AppLayout>
            <Home />
          </AppLayout>
        }
      />

      {/* CART */}
      <Route
        path="/cart"
        element={
          <AppLayout>
            <Cart />
          </AppLayout>
        }
      />

      {/* CHECKOUT */}
      <Route
        path="/checkout"
        element={
          <AppLayout>
            <Checkout />
          </AppLayout>
        }
      />

      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
      <Route path="/dealer-register" element={<DealerRegister />} />

      {/* ALL PRODUCTS */}
      <Route
        path="/products"
        element={
          <AppLayout>
            <AllProducts />
          </AppLayout>
        }
      />

      {/* CATEGORY PRODUCTS */}
      <Route
        path="/products/:slug"
        element={
          <AppLayout>
            <CategoryProducts />
          </AppLayout>
        }
      />

      {/* DEALER LOGIN (NO LAYOUT) */}
      <Route path="/dealer-login" element={<DealerLogin />} />
    </Routes>
  );
}
