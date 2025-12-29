import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1️⃣ Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("nwt_cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // 2️⃣ Save cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("nwt_cart", JSON.stringify(cart));
  }, [cart]);

  // 👉 Detect dealer (token stored after login)
  const isDealer = !!localStorage.getItem("dealer_token");

  // ⭐ Central discount logic (used everywhere)
  const getFinalPrice = (item) => {
    const base = item.price?.discounted ?? item.price?.original ?? 0;

    if (isDealer) {
      return base * 0.9; // 10% OFF for dealer
    }

    return base;
  };

  // 3️⃣ Add item (normalized)
  const addItem = (product) => {
    const normalizedProduct = {
      ...product,
      name: product.name || product.title,
    };

    setCart((prev) => {
      const existing = prev.find((i) => i.id === normalizedProduct.id);

      if (existing) {
        return prev.map((i) =>
          i.id === normalizedProduct.id
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }

      return [...prev, { ...normalizedProduct, qty: 1 }];
    });
  };

  // 4️⃣ Remove item
  const removeItem = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // 5️⃣ Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("nwt_cart");
  };

  // 6️⃣ Total uses dealer price logic
  const totalAmount = cart.reduce(
    (sum, item) => sum + getFinalPrice(item) * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clearCart,
        totalAmount,
        getFinalPrice,
        isDealer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
