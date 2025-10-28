const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCart } = require('../controllers/cartController');

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/remove/:productId', removeFromCart);
router.put('/update', updateCart);

module.exports = router;
