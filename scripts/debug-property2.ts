// scripts/debug-property2.ts
// Script para debug completo de propiedades
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function debug() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Schemas
    const PropertyTypeSchema = new mongoose.Schema({
      name: String,
      slug: String,
    }, { collection: 'propertytypes' });
    const PropertySchema = new mongoose.Schema({
      title: String,
      slug: String,
      operationType: String,
      propertyType: mongoose.Schema.Types.ObjectId,
      active: Boolean,
      address: {
        city: mongoose.Schema.Types.ObjectId,
      },
    }, { collection: 'properties' });

    const PropertyType = mongoose.model("PropertyType", PropertyTypeSchema);
    const Property = mongoose.model("Property", PropertySchema);

    // 1. Ver todos los tipos de propiedad
    const types = await PropertyType.find({});
    console.log("\n📋 Todos los tipos de propiedad:");
    for (const t of types) {
      console.log(`  - ${t.name}: ${t.slug} (${t._id})`);
    }

    // 2. Buscar propiedades que mentions Punta Colorada
    const props = await Property.find({ 
      title: { $regex: /punta\s*colorada/i },
    });
    
    console.log(`\n📦 Propiedades con "Punta Colorada" en título: ${props.length}`);
    
    for (const prop of props) {
      const type = await PropertyType.findById(prop.propertyType);
      console.log(`\n  - ${prop.title}`);
      console.log(`    Slug: ${prop.slug}`);
      console.log(`    operationType: ${prop.operationType}`);
      console.log(`    propertyType: ${type?.name} (${type?.slug})`);
      console.log(`    active: ${prop.active}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

debug();
