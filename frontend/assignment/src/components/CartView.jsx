import React from 'react';

export default function CartView({ cart, onRemove, onUpdate }) {
  return (
    <div className="cart-view">
      <h2>Cart</h2>
      {cart.items.length === 0 && <div>Your cart is empty.</div>}
      {cart.items.map((item, idx) => {
        // Items can come from server (item.product is populated) or from in-memory mock (item.productId)
        const productId =
          item.productId ?? (item.product && (item.product._id || item.product)) ?? null;
        const key = productId ?? item._id ?? idx;
        return (
          <div key={key} className="cart-item">
            <span>{item.name ?? (item.product && item.product.name)}</span>
            <span>Qty: {item.qty}</span>
            <span>₹{item.price ?? (item.product && item.product.price)}</span>
            <button onClick={() => onRemove(productId)}>Remove</button>
            <button onClick={() => onUpdate(productId, 1)}>+1</button>
          </div>
        );
      })}
      <div>Total: ₹{cart.total}</div>
    </div>
  );
}
