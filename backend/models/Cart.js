const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
  total: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

// recalculate total and populate
cartSchema.methods.recalculate = async function () {
  await this.populate('items.product');
  let total = 0;
  this.items.forEach((it) => {
    if (it.product && typeof it.product.price === 'number') {
      total += it.qty * it.product.price;
    }
  });
  this.total = total;
  return this.total;
};

module.exports = mongoose.model('Cart', cartSchema);
