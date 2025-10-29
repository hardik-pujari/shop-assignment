import React from "react";

export default function CartView({ cart, onRemove, onUpdate }) {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Cart</h2>
      {cart.items.length === 0 && (
        <div className="text-gray-500">Your cart is empty.</div>
      )}
      {cart.items.map((item, idx) => {
        // Items can come from server (item.product is populated) or from in-memory mock (item.productId)
        const productId =
          item.productId ??
          (item.product && (item.product._id || item.product)) ??
          null;
        const key = productId ?? item._id ?? idx;
        return (
          <div
            key={key}
            className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded"
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {item.name ?? (item.product && item.product.name)}
              </span>
              <span className="text-gray-600">Qty: {item.qty}</span>
              <span className="text-gray-800 font-semibold">
                ₹{item.price ?? (item.product && item.product.price)}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onRemove(productId)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
              <button
                onClick={() => onUpdate(productId, Number(item.qty || 0) + 1)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                +1
              </button>
            </div>
          </div>
        );
      })}
      <div className="text-right text-xl font-bold text-gray-900 border-t pt-4 mt-4">
        Total: ₹{cart.total}
      </div>
    </div>
  );
}
