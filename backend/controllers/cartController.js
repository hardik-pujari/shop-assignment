const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function findOrCreateCart() {
	let cart = await Cart.findOne();
	if (!cart) {
		cart = new Cart({ items: [], total: 0 });
		await cart.save();
	}
	return cart;
}

async function getCart(req, res, next) {
	try {
		const cart = await findOrCreateCart();
		await cart.recalculate();
		await cart.save();
		await cart.populate('items.product');
		res.json(cart);
	} catch (err) {
		next(err);
	}
}

async function addToCart(req, res, next) {
	try {
		const { productId, qty = 1 } = req.body;
		if (!productId) return res.status(400).json({ error: 'productId required' });
		const product = await Product.findById(productId);
		if (!product) return res.status(404).json({ error: 'product not found' });

		const cart = await findOrCreateCart();
		const existing = cart.items.find((it) => it.product.toString() === productId);
		if (existing) {
			existing.qty += Number(qty);
		} else {
			cart.items.push({ product: product._id, qty: Number(qty) });
		}
		await cart.recalculate();
		await cart.save();
		await cart.populate('items.product');
		res.json(cart);
	} catch (err) {
		next(err);
	}
}

async function removeFromCart(req, res, next) {
	try {
		const productId = req.body.productId || req.params.productId;
		if (!productId) return res.status(400).json({ error: 'productId required' });
		const cart = await findOrCreateCart();
		cart.items = cart.items.filter((it) => it.product.toString() !== productId);
		await cart.recalculate();
		await cart.save();
		await cart.populate('items.product');
		res.json(cart);
	} catch (err) {
		next(err);
	}
}

async function updateCart(req, res, next) {
	try {
		const { productId, qty } = req.body;
		if (!productId || typeof qty === 'undefined') return res.status(400).json({ error: 'productId and qty required' });
		const cart = await findOrCreateCart();
		const idx = cart.items.findIndex((it) => it.product.toString() === productId);
		if (idx === -1) {
			if (qty > 0) cart.items.push({ product: productId, qty: Number(qty) });
		} else {
			if (qty <= 0) {
				cart.items.splice(idx, 1);
			} else {
				cart.items[idx].qty = Number(qty);
			}
		}
		await cart.recalculate();
		await cart.save();
		await cart.populate('items.product');
		res.json(cart);
	} catch (err) {
		next(err);
	}
}

module.exports = { getCart, addToCart, removeFromCart, updateCart };
