const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

/**
 * Try to connect to a MongoDB instance. If no MONGO_URI is provided or the
 * connection fails, fall back to an in-memory MongoDB server (mongodb-memory-server)
 * so the backend can start for local development/testing.
 */
const connectDB = async () => {
	mongoose.set('strictQuery', true);

	async function connect(uri) {
		await mongoose.connect(uri);
		console.log(`MongoDB Connected: ${uri}`);
	}

	if (MONGO_URI) {
		try {
			await connect(MONGO_URI);
			return;
		} catch (error) {
			console.warn(`Failed to connect to MONGO_URI (${MONGO_URI}): ${error.message}`);
			console.warn('Falling back to in-memory MongoDB for local development.');
		}
	} else {
		console.warn('MONGO_URI not set — starting in-memory MongoDB for development.');
	}

	// Start an in-memory MongoDB server as fallback
	try {
		const { MongoMemoryServer } = require('mongodb-memory-server');
		const mongod = await MongoMemoryServer.create();
		const uri = mongod.getUri();
		await connect(uri);
		// keep a reference so it isn't GC'd while app runs
		connectDB._mongod = mongod;
	} catch (err) {
		console.error(`Failed to start in-memory MongoDB: ${err.message}`);
		// Last resort: rethrow so caller can handle
		throw err;
	}
};

module.exports = { connectDB };
