import React from 'react';

export default function ProductsGrid({ products, onAddToCart }) {
  return (
    <div className="products-grid">
      {products.map(p => (
        <div key={p._id} className="product-card">
          <div>{p.name}</div>
          <div>₹{p.price}</div>
          <button onClick={() => onAddToCart(p._id)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
