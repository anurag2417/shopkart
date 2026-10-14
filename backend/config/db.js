import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) throw new Error('MONGO_URI is missing');

        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

export default connectDB;
