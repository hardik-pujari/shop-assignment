import React from 'react';

export default function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="receipt-modal">
      <h2>Order Receipt</h2>
      <div>Total: ₹{receipt.total}</div>
      <div>Timestamp: {receipt.timestamp}</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
