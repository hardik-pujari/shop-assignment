const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
	try {
		mongoose.set('strictQuery', true);
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`MongoDB Connected: ${MONGO_URI}`);
	} catch (error) {
		console.error(`MongoDB connection failed: ${error.message}`);
		process.exit(1);
	}
};

module.exports = { connectDB };
