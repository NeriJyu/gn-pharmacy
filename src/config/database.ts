import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI as string;

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log('📦 MongoDB connected!');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
