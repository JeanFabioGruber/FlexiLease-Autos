import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://jeanFabio:0f36A6wDSWaDufNE@autos.1wx8epn.mongodb.net/?retryWrites=true&w=majority&appName=autos"
  );

  mongoose.Promise = global.Promise;
};

export default connectDB;
