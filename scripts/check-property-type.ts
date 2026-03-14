// scripts/check-property-type.ts
// Script para verificar el tipo de propiedad
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function checkPropertyType() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Schemas
    const PropertyTypeSchema = new mongoose.Schema({
      name: String,
      slug: String,
    });
    const PropertySchema = new mongoose.Schema({
      title: String,
      slug: String,
      operationType: String,
      propertyType: mongoose.Schema.Types.ObjectId,
      address: {
        city: mongoose.Schema.Types.ObjectId,
      },
    }, { collection: 'properties' });

    const PropertyType = mongoose.model("PropertyType", PropertyTypeSchema);
    const Property = mongoose.model("Property", PropertySchema);

    // Buscar todos los tipos de propiedad
    const types = await PropertyType.find({});
    console.log("\n📊 Tipos de propiedad:");
    for (const t of types) {
      console.log(`  - ${t.name}: ${t.slug}`);
    }

    // Buscar propiedades en Punta Colorada
    const properties = await Property.find({ "address.city": (await import('mongoose')).default.Types.ObjectId.createFromHexString("69b5d6defc01b85696be292c") });

    console.log(`\n📊 Propiedades en Punta Colorada:`);
    for (const prop of properties) {
      const type = await PropertyType.findById(prop.propertyType);
      console.log(`\n- ${prop.title}`);
      console.log(`  Tipo: ${type?.name} (${type?.slug})`);
      console.log(`  Operación: ${prop.operationType}`);
      console.log(`  Slug: ${prop.slug}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkPropertyType();
