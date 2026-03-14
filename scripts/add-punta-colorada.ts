// scripts/add-punta-colorada.ts
// Script para agregar la ciudad Punta Colorada a la base de datos
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function addPuntaColorada() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Schema de Province y City
    const ProvinceSchema = new mongoose.Schema({
      name: String,
      slug: String,
    });
    const CitySchema = new mongoose.Schema({
      name: String,
      slug: String,
      province: mongoose.Schema.Types.ObjectId,
    });

    const Province = mongoose.model("Province", ProvinceSchema);
    const City = mongoose.model("City", CitySchema);

    // Buscar provincia Río Negro
    const rioNegro = await Province.findOne({ slug: "rio-negro" });
    if (!rioNegro) {
      console.error("❌ No se encontró la provincia Río Negro");
      process.exit(1);
    }
    console.log("📍 Provincia Río Negro encontrada:", rioNegro.name);

    // Verificar si ya existe Punta Colorada
    const existingCity = await City.findOne({ slug: "punta-colorada" });
    if (existingCity) {
      console.log("⚠️  Punta Colorada ya existe en la base de datos");
      process.exit(0);
    }

    // Crear Punta Colorada
    const puntaColorada = await City.create({
      name: "Punta Colorada",
      slug: "punta-colorada",
      province: rioNegro._id,
    });

    console.log("✅ Punta Colorada creada exitosamente!");
    console.log("   - ID:", puntaColorada._id);
    console.log("   - Nombre:", puntaColorada.name);
    console.log("   - Slug:", puntaColorada.slug);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addPuntaColorada();
