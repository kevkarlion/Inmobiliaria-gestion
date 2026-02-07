/* eslint-disable @typescript-eslint/no-explicit-any */
// @/db/connection.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Por favor define la variable MONGODB_URI en .env.local");
}

/**
 * En Next.js, el servidor se recarga constantemente. Usamos el objeto global
 * para mantener la conexión activa entre recargas y evitar el "Buffering Timeout".
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // 1. Si ya existe una conexión activa, la devolvemos de inmediato
  if (cached.conn) {
    return cached.conn;
  }

  // 2. Si no hay una promesa de conexión en curso, la creamos
  if (!cached.promise) {
    const opts = {
      dbName: "inmobiliaria",
      bufferCommands: false, 
      serverSelectionTimeoutMS: 5000, // No esperar más de 5s
    };

    console.log("📡 Iniciando nueva conexión a MongoDB...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ Conexión exitosa a MongoDB");
      return mongoose;
    });
  }

  // 3. Esperamos a que la promesa se resuelva (todas las llamadas esperan aquí)
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Si falla, permitimos reintentar en la próxima carga
    console.error("❌ Error en la promesa de conexión:", e);
    throw e;
  }

  return cached.conn;
};