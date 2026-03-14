// scripts/fix-property-active.ts
// Script para activar la propiedad
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function fix() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    const PropertySchema = new mongoose.Schema({
      title: String,
      slug: String,
      active: Boolean,
      address: {
        city: mongoose.Schema.Types.ObjectId,
      },
    }, { collection: 'properties' });

    const Property = mongoose.model("Property", PropertySchema);

    // Buscar propiedad por título
    const prop = await Property.findOne({ 
      title: { $regex: /punta\s*colorada/i },
    });

    if (!prop) {
      console.log("❌ Propiedad no encontrada");
      process.exit(1);
    }

    console.log(`\n📦 Propiedad: ${prop.title}`);
    console.log(`   Slug: ${prop.slug}`);
    console.log(`   Active: ${prop.active}`);
    console.log(`   Active (typeof): ${typeof prop.active}`);

    // Activar la propiedad
    await Property.updateOne(
      { _id: prop._id },
      { $set: { active: true } }
    );

    console.log("\n✅ Propiedad activada");

    // Verificar
    const updated = await Property.findById(prop._id);
    console.log(`   Active ahora: ${updated?.active}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fix();
