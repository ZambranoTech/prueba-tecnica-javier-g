import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState === 1) {
    console.log("Ya conectado a la base de datos");
    return true;
  }

  if (!process.env.MONGODB_URI) {
    console.error("La variable de entorno MONGODB_URI no está definida");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a la base de datos");
    return true;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    return false;
  }
};

export default connectDB;