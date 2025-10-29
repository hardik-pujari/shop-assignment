import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

console.log("API base:", BASE);
const mockProducts = [
  { _id: "m1", name: "Mock Apple", price: 10 },
  { _id: "m2", name: "Mock Banana", price: 5 },
  { _id: "m3", name: "Mock Orange", price: 8 },
  { _id: "m4", name: "Mock Grapes", price: 15 },
  { _id: "m5", name: "Mock Pear", price: 12 },
];

let inMemoryCart = { items: [], total: 0 };

function recalcCart() {
  const total = inMemoryCart.items.reduce((s, it) => s + it.price * it.qty, 0);
  inMemoryCart.total = total;
}

async function tryRequest(fn, fallback) {
  try {
    return await fn();
  } catch (err) {
    console.warn('API request failed, falling back to mock', err.message);
    return fallback();
  }
}

const getProducts = async () =>
  tryRequest(
    async () => (await axios.get(`${BASE}/products`)).data,
    () => mockProducts.slice()
  );

const getCart = async () =>
  tryRequest(
    async () => (await axios.get(`${BASE}/cart`)).data,
    () => JSON.parse(JSON.stringify(inMemoryCart))
  );

const addToCart = async (productId, qty = 1) =>
  tryRequest(
    async () => (await axios.post(`${BASE}/cart/add`, { productId, qty })).data,
    () => {
      const prod =
        mockProducts.find((p) => p._id === productId) || mockProducts[0];
      const idx = inMemoryCart.items.findIndex(
        (i) => i.productId === productId
      );
      if (idx !== -1) {
        inMemoryCart.items[idx].qty += Number(qty);
      } else {
        inMemoryCart.items.push({
          productId: prod._id,
          name: prod.name,
          price: prod.price,
          qty: Number(qty),
        });
      }
      recalcCart();
      return JSON.parse(JSON.stringify(inMemoryCart));
    }
  );

const removeFromCart = async (productId) =>
  tryRequest(
    async () => (await axios.post(`${BASE}/cart/remove`, { productId })).data,
    () => {
      inMemoryCart.items = inMemoryCart.items.filter(
        (i) => i.productId !== productId
      );
      recalcCart();
      return JSON.parse(JSON.stringify(inMemoryCart));
    }
  );

const updateCart = async (productId, qty) =>
  tryRequest(
    async () =>
      (await axios.put(`${BASE}/cart/update`, { productId, qty })).data,
    () => {
      const idx = inMemoryCart.items.findIndex(
        (i) => i.productId === productId
      );
      if (idx === -1) {
        if (qty > 0) {
          const prod =
            mockProducts.find((p) => p._id === productId) || mockProducts[0];
          inMemoryCart.items.push({
            productId: prod._id,
            name: prod.name,
            price: prod.price,
            qty: Number(qty),
          });
        }
      } else {
        if (qty <= 0) inMemoryCart.items.splice(idx, 1);
        else inMemoryCart.items[idx].qty = Number(qty);
      }
      recalcCart();
      return JSON.parse(JSON.stringify(inMemoryCart));
    }
  );

const checkout = async (cartItems = [], user = {}) =>
  tryRequest(
    async () =>
      (await axios.post(`${BASE}/checkout`, { cartItems, user })).data,
    () => {
      const items =
        cartItems.length > 0
          ? cartItems
          : inMemoryCart.items.map((i) => ({
              productId: i.productId,
              qty: i.qty,
              price: i.price,
              name: i.name,
            }));
      const receiptItems = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price,
        lineTotal: i.qty * i.price,
      }));
      const total = receiptItems.reduce((s, it) => s + it.lineTotal, 0);
      const receipt = {
        id: `rcpt_mock_${Date.now()}`,
        items: receiptItems,
        total,
        timestamp: new Date().toISOString(),
      };
      inMemoryCart = { items: [], total: 0 };
      return { receipt };
    }
  );

export default {
  getProducts,
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
  checkout,
};