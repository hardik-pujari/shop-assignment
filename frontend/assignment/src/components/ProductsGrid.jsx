import React from 'react';

export default function ProductsGrid({ products, onAddToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <div
          key={p._id}
          className="bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="text-lg font-semibold mb-2 text-gray-800">{p.name}</div>
          <div className="text-gray-600 mb-4">₹{p.price}</div>
          <button
            onClick={() => onAddToCart(p._id)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
