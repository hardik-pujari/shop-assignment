const Product = require('../models/Product');

async function getProducts(req, res, next) {
	try {
		let products = await Product.find().lean();
		if (!products || products.length === 0) {
			const seed = [
				{ name: 'Apple', price: 10, stock: 20 },
				{ name: 'Banana', price: 5, stock: 30 },
				{ name: 'Orange', price: 8, stock: 15 },
				{ name: 'Grapes', price: 15, stock: 10 },
				{ name: 'Pear', price: 12, stock: 12 },
			];
			products = await Product.insertMany(seed);
		}
		res.json(products);
	} catch (err) {
		next(err);
	}
}

module.exports = { getProducts };
