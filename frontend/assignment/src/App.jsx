import React, { useState, useEffect } from 'react';
import ProductsGrid from './components/ProductsGrid';
import CartView from './components/CartView';
import CheckoutForm from './components/CheckoutForm';
import ReceiptModal from './components/ReceiptModal';
import api from './api/api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const prods = await api.getProducts();
        if (mounted) setProducts(Array.isArray(prods) ? prods : prods ?? []);
      } catch (err) {
        console.error('Failed to load products:', err);
      }

      try {
        const c = await api.getCart();
        if (mounted) setCart(c ?? { items: [], total: 0 });
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshCart = async () => {
    try {
      const c = await api.getCart();
      setCart(c ?? { items: [], total: 0 });
    } catch (err) {
      console.error('Failed to refresh cart:', err);
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.addToCart(productId, 1);
      await refreshCart();
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.removeFromCart(productId);
      await refreshCart();
    } catch (err) {
      console.error('Remove from cart failed:', err);
    }
  };

  const updateCart = async (productId, qty) => {
    try {
      if (qty <= 0) {
        await api.removeFromCart(productId);
      } else if (api.updateCart) {
        await api.updateCart(productId, qty);
      } else {
        await api.addToCart(productId, qty);
      }
      await refreshCart();
    } catch (err) {
      console.error('Update cart failed:', err);
    }
  };

  const handleCheckout = async (cartItems, user) => {
    try {
      // Normalize cart items to the shape expected by backend: { productId, qty }
      const normalized = Array.isArray(cartItems)
        ? cartItems.map((it) => ({
            productId:
              it.productId ?? (it.product && (it.product._id || it.product)) ?? null,
            qty: Number(it.qty ?? it.quantity ?? 1),
          }))
        : [];

      const data = await api.checkout(normalized, user);
      const r = data?.receipt ?? data ?? null;
      setReceipt(r);
      setShowReceipt(true);
      await refreshCart();
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-2">Mock E-Com Cart</h1>
        <div className="mb-8">
          <ProductsGrid products={products} onAddToCart={addToCart} />
        </div>
        <div className="mb-8">
          <CartView cart={cart} onRemove={removeFromCart} onUpdate={updateCart} />
        </div>
        <div className="mb-8">
          <CheckoutForm cartItems={cart.items} onCheckout={handleCheckout} />
        </div>
        {showReceipt && (
          <ReceiptModal
            receipt={receipt}
            onClose={() => {
              setShowReceipt(false);
              setReceipt(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
