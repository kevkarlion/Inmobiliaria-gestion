// scripts/add-sierra-grande.ts
// Script para agregar la ciudad Sierra Grande a la base de datos
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function addSierraGrande() {
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

    // Verificar si ya existe Sierra Grande
    const existingCity = await City.findOne({ slug: "sierra-grande" });
    if (existingCity) {
      console.log("⚠️  Sierra Grande ya existe en la base de datos");
      process.exit(0);
    }

    // Crear Sierra Grande
    const sierraGrande = await City.create({
      name: "Sierra Grande",
      slug: "sierra-grande",
      province: rioNegro._id,
    });

    console.log("✅ Sierra Grande creada exitosamente!");
    console.log("   - ID:", sierraGrande._id);
    console.log("   - Nombre:", sierraGrande.name);
    console.log("   - Slug:", sierraGrande.slug);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addSierraGrande();
