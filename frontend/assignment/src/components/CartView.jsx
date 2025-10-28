import React from 'react';

export default function CartView({ cart, onRemove, onUpdate }) {
  return (
    <div className="cart-view">
      <h2>Cart</h2>
      {cart.items.length === 0 && <div>Your cart is empty.</div>}
      {cart.items.map(item => (
        <div key={item.productId} className="cart-item">
          <span>{item.name}</span>
          <span>Qty: {item.qty}</span>
          <span>₹{item.price}</span>
          <button onClick={() => onRemove(item.productId)}>Remove</button>
          <button onClick={() => onUpdate(item.productId, 1)}>+1</button>
        </div>
      ))}
      <div>Total: ₹{cart.total}</div>
    </div>
  );
}
