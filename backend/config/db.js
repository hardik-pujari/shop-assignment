const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hardik-assignment';

/**
 * Connect to MongoDB with retries and backoff.
 * Throws if all attempts fail.
 */
async function connectDB({ retries = 5, delay = 2000 } = {}) {
	mongoose.set('strictQuery', true);

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			await mongoose.connect(MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			console.log(`Connected to MongoDB: ${MONGO_URI}`);
			return;
		} catch (err) {
			const isLast = attempt === retries;
			console.error(`MongoDB connection attempt ${attempt + 1} failed: ${err.message}`);
			if (isLast) {
				console.error('All MongoDB connection attempts failed.');
				throw err;
			}
			const wait = delay * Math.pow(1.5, attempt); // progressive backoff
			console.log(`Retrying in ${Math.round(wait)}ms...`);
			await new Promise((r) => setTimeout(r, wait));
		}
	}
}

module.exports = { connectDB };
