import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId?: string;
  productName?: string;
  title?: string;
  slug?: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Partial<CartItem> & { price: number; image: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ank_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ank_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Partial<CartItem> & { price: number; image: string }) => {
    const rawId = item.id || item.productId || item.slug || 'item';
    const size = item.size || 'L';
    const uniqueId = `${rawId}-${size}-${item.color || 'default'}`;

    const normalizedItem: CartItem = {
      id: uniqueId,
      productId: item.productId || rawId,
      productName: item.productName || item.title || 'Atelier Product',
      title: item.title || item.productName || 'Atelier Product',
      slug: item.slug || rawId,
      size: size,
      color: item.color || 'Obsidian Matte Black',
      price: Number(item.price),
      quantity: Number(item.quantity || 1),
      image: item.image,
      category: item.category || 'Mulank T-Shirts',
    };

    setItems((prev) => {
      const existing = prev.find((i) => i.id === uniqueId);
      if (existing) {
        return prev.map((i) =>
          i.id === uniqueId ? { ...i, quantity: i.quantity + normalizedItem.quantity } : i
        );
      }
      return [...prev, normalizedItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, i) => acc + (i.quantity || 1), 0);
  const subtotal = items.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
