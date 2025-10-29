# Mock E-Com Cart

This repository is a small full-stack demo app that implements a simple shopping cart flow:

- A backend (Express + MongoDB) that serves products and maintains a cart.
- A frontend (React + Vite) that lists products, manages a cart, and performs checkout.

This README documents features, project structure, environment variables, and how to run the app locally for development.

## Features

- Product listing (seeded if database is empty)
- Add to cart, remove from cart, update quantities
- Checkout endpoint that creates a receipt and clears the cart
- Frontend mock fallbacks (if backend is not running) so the UI still works offline
- Backend fallback to an in-memory MongoDB when MONGO_URI is not provided (dev-friendly)
- Receipt modal shows purchase time and customer details

## Project structure (important files)

- `backend/`
	- `server.js` — Express server and graceful shutdown handling
	- `controllers/` — route handlers (products, cart, checkout)
	- `models/` — Mongoose models (`Product`, `Cart`)
	- `config/db.js` — MongoDB connection (supports real MongoDB or in-memory fallback)

- `frontend/assignment/`
	- `src/api/api.js` — small API wrapper; includes mock fallbacks for offline dev
	- `src/components/` — React components (ProductsGrid, CartView, CheckoutForm, ReceiptModal)
	- `src/index.css` / `src/App.css` — styles (Tailwind may be used if configured)
	- `vite.config.js`, `package.json` — frontend tooling and scripts

## Environment variables

- `backend/.env` (optional)
	- `MONGO_URI` — MongoDB connection string (if omitted, the backend will use an in-memory MongoDB for development)
	- `PORT` — port for the backend (defaults to `5000`)

- `frontend/.env` (optional)
	- `VITE_API_BASE` — override the API base URL (default: `http://localhost:5000/api`)

Example `.env` for backend (create `backend/.env`):

```
MONGO_URI=mongodb://localhost:27017/mock-ecom
PORT=5000
```

## How it works (end-to-end)

1. Frontend requests products from `GET /api/products` (backend seeds a small dataset if empty).
2. Frontend shows a product grid; user can add items to the cart.
3. Cart operations call the backend cart endpoints (`/api/cart`, `/api/cart/add`, `/api/cart/remove`, `/api/cart/update`) when available; otherwise the frontend uses an in-memory fallback so UI still works.
4. On checkout, the frontend POSTs `{ cartItems, user }` to `POST /api/checkout`.
	 - If `cartItems` is empty, the backend will pick (or seed) mock products so you can test checkout easily.
	 - The backend validates stock, updates product stock, clears the cart, and returns a receipt with `createdAt` and `user`.
5. The frontend shows the receipt modal with purchase time and customer details.

## API endpoints

- `GET /api/products` — list products
- `GET /api/cart` — get current cart
- `POST /api/cart/add` — body: `{ productId, qty }` — add product to cart
- `POST /api/cart/remove` — body: `{ productId }` — remove product from cart
- `PUT /api/cart/update` — body: `{ productId, qty }` — update quantity
- `POST /api/checkout` — body: `{ cartItems, user }` — perform checkout; returns `{ receipt }`

## Run locally (PowerShell examples)

1) Start backend

```powershell
cd backend
npm install
npm run dev
```

The backend will attempt to connect to `MONGO_URI` if set. If not set or connection fails, it will start an in-memory MongoDB (mongodb-memory-server) so the backend still works for local development.

2) Start frontend

```powershell
cd frontend/assignment
npm install
npm run dev
```

Open the Vite dev URL (usually `http://localhost:5173`) and use the app.

## Development notes & troubleshooting

- If the frontend can't reach the backend, it will use an in-memory mocked API with default products and an in-memory cart. This makes local testing easy without a running backend.
- To use a real MongoDB, set `MONGO_URI` in `backend/.env` and ensure MongoDB is running.
- If you see CSS linter warnings about `@tailwind` or `@apply`, they are safe — Tailwind directives are processed during the build step. Install Tailwind and configure Vite/PostCSS if you want to use Tailwind utilities.

## Tests and CI

This project doesn't include automated tests by default. For CI, run the backend start script and the frontend build, and add unit/integration tests as needed.



