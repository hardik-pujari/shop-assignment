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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl p-8 min-w-[320px] max-w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Order Receipt</h2>
        <div className="mb-2 text-lg text-gray-700">
          <span className="font-semibold">Total:</span> ₹{receipt.total}
        </div>
        <div className="mb-2 text-gray-600">
          <span className="font-semibold">Purchased at:</span> {time}
        </div>
        <div className="mb-6 text-gray-600">
          <span className="font-semibold">Customer:</span> {name}{email ? <span className="text-gray-500"> — {email}</span> : ''}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
