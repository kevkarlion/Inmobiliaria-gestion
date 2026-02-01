// scripts/seed.ts
import mongoose from 'mongoose';
import { Province } from '../src/db/schemas/province.schema';
import { City } from '../src/db/schemas/city.schema';
import * as dotenv from 'dotenv';

// Cargar variables de entorno (MONGO_URI)
dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function runSeed() {
  try {
    console.log("⏳ Conectando a MongoDB...");
    await mongoose.connect(MONGO_URI);

    // 1. Limpiar datos viejos (Opcional, cuidado en producción)
    await Province.deleteMany({});
    await City.deleteMany({});

    console.log("🌱 Sembrando provincias...");
    const rioNegro = await Province.create({ name: "Río Negro", slug: "rio-negro" });
    const neuquen = await Province.create({ name: "Neuquén", slug: "neuquen" });

    console.log("🌱 Sembrando localidades...");
    await City.create([
      { name: "General Roca", slug: "general-roca", province: rioNegro._id },
      { name: "Cipolletti", slug: "cipolletti", province: rioNegro._id },
      { name: "Villa Regina", slug: "villa-regina", province: rioNegro._id },
      { name: "Neuquén Capital", slug: "neuquen-capital", province: neuquen._id },
      { name: "Plottier", slug: "plottier", province: neuquen._id },
    ]);

    console.log("✅ Seed finalizado con éxito");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el seed:", error);
    process.exit(1);
  }
}

runSeed();