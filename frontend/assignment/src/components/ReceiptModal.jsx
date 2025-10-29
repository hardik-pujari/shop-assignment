import React from 'react';

function formatTime(value) {
  if (!value) return 'Unknown';
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

export default function ReceiptModal({ receipt = {}, onClose }) {
  const time = formatTime(receipt.createdAt ?? receipt.timestamp ?? receipt.date ?? receipt.time);
  const user = receipt.user ?? receipt.customer ?? null;
  const name = user?.name ?? user?.fullName ?? user?.username ?? 'Guest';
  const email = user?.email ?? null;

  return (
    <div className="receipt-modal">
      <h2>Order Receipt</h2>
      <div>Total: ₹{receipt.total}</div>
      <div>Purchased at: {time}</div>
      <div>Customer: {name}{email ? ` — ${email}` : ''}</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
