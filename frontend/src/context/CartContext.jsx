import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("nwt_cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("nwt_cart", JSON.stringify(cart));
  }, [cart]);

  const isDealer = !!localStorage.getItem("dealer_token");

  const getFinalPrice = (item) => {
    const base = item.price?.discounted ?? item.price?.original ?? 0;
    return isDealer ? base * 0.9 : base;
  };

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

  const removeItem = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("nwt_cart");
  };

  // ⭐ TOTAL AMOUNT (dealer logic applied)
  const totalAmount = cart.reduce(
    (sum, item) => sum + getFinalPrice(item) * item.qty,
    0
  );

  // ⭐ TOTAL QTY (NEW)
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clearCart,
        totalAmount,
        totalQty,      // <-- added
        getFinalPrice,
        isDealer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
