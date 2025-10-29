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
    <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg" onSubmit={submit}>
      <h2 className="text-2xl font-semibold mb-6 text-center">Checkout</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
      >
        Checkout
      </button>
    </form>
  );
}
