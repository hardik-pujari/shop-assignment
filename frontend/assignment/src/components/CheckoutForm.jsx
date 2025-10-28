import React, { useState } from 'react';

export default function CheckoutForm({ cartItems, onCheckout }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = e => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    onCheckout(cartItems, { name, email });
  };

  return (
    <form className="checkout-form" onSubmit={submit}>
      <h2>Checkout</h2>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <button type="submit">Checkout</button>
    </form>
  );
}
