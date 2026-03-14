// scripts/fix-loteo-slug.ts
// Script para corregir el slug del tipo de propiedad
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function fix() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    const PropertyTypeSchema = new mongoose.Schema({
      name: String,
      slug: String,
    }, { collection: 'propertytypes' });

    const PropertyType = mongoose.model("PropertyType", PropertyTypeSchema);

    // Buscar el tipo "Loteos"
    const type = await PropertyType.findOne({ slug: "loteos" });
    
    if (!type) {
      console.log("❌ Tipo 'loteos' no encontrado");
      process.exit(1);
    }

    console.log(`\n📋 Tipo actual: ${type.name} (slug: ${type.slug})`);

    // Cambiar el slug a "loteo"
    await PropertyType.updateOne(
      { _id: type._id },
      { $set: { slug: "loteo" } }
    );

    console.log("✅ Slug cambiado a 'loteo'");

    // Verificar
    const updated = await PropertyType.findById(type._id);
    console.log(`   Slug ahora: ${updated?.slug}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fix();
