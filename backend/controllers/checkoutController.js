const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function checkout(req, res, next) {
	try {
		const { cartItems = [], user = {} } = req.body;
		let items = Array.isArray(cartItems) ? cartItems.slice() : [];

		// If no cart items provided, build a mock list for easier testing/dev.
		if (items.length === 0) {
			// Try to use up to two real products from DB
			let products = await Product.find().limit(2);
			if (!products || products.length === 0) {
				// seed minimal products if DB is empty
				const seed = [
					{ name: 'Mock Apple', price: 10, stock: 20 },
					{ name: 'Mock Banana', price: 5, stock: 30 },
				];
				products = await Product.insertMany(seed);
			}
			items = products.map((p) => ({ productId: p._id.toString(), qty: 1 }));
		}

		const productIds = items.map((it) => it.productId);
		const products = await Product.find({ _id: { $in: productIds } });
		const productMap = {};
		products.forEach((p) => (productMap[p._id.toString()] = p));

			for (const it of items) {
				const p = productMap[it.productId];
			if (!p) return res.status(400).json({ error: `Product ${it.productId} not found` });
				if (p.stock < it.qty) return res.status(400).json({ error: `Insufficient stock for ${p.name}` });
		}

			let total = 0;
			const receiptItems = [];
			for (const it of items) {
				const p = productMap[it.productId];
				p.stock -= it.qty;
				await p.save();
				receiptItems.push({ productId: p._id, name: p.name, qty: it.qty, price: p.price, lineTotal: p.price * it.qty });
				total += p.price * it.qty;
			}

		const cart = await Cart.findOne();
		if (cart) {
			cart.items = [];
			cart.total = 0;
			await cart.save();
		}

		const receipt = { id: `rcpt_${Date.now()}`, user, items: receiptItems, total, createdAt: new Date() };
		res.json({ receipt });
	} catch (err) {
		next(err);
	}
}

module.exports = { checkout };
