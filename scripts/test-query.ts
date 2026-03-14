// scripts/test-query.ts
// Script para probar la query
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    const CitySchema = new mongoose.Schema({
      name: String,
      slug: String,
    });
    const PropertyTypeSchema = new mongoose.Schema({
      name: String,
      slug: String,
    }, { collection: 'propertytypes' });
    const PropertySchema = new mongoose.Schema({
      title: String,
      slug: String,
      operationType: String,
      propertyType: mongoose.Schema.Types.ObjectId,
      status: String,
      address: {
        city: mongoose.Schema.Types.ObjectId,
      },
    }, { collection: 'properties' });

    const City = mongoose.model("City", CitySchema);
    const PropertyType = mongoose.model("PropertyType", PropertyTypeSchema);
    const Property = mongoose.model("Property", PropertySchema);

    // Simular la query del PropertyService
    const citySlug = "punta-colorada";
    const propertyTypeSlug = "loteo";
    const operationType = "venta";

    console.log("\n🔍 Buscando con filtros:");
    console.log(`   city: ${citySlug}`);
    console.log(`   propertyType: ${propertyTypeSlug}`);
    console.log(`   operationType: ${operationType}`);

    // 1. Buscar la ciudad
    const cityDoc = await City.findOne({ slug: citySlug });
    console.log(`\n📍 Ciudad: ${cityDoc ? `${cityDoc.name} (${cityDoc._id})` : "NO ENCONTRADA"}`);

    // 2. Buscar el tipo de propiedad
    const typeDoc = await PropertyType.findOne({ slug: propertyTypeSlug });
    console.log(`🏠 Tipo: ${typeDoc ? `${typeDoc.name} (${typeDoc._id})` : "NO ENCONTRADO"}`);

    if (!cityDoc || !typeDoc) {
      console.log("\n❌ Faltan ciudad o tipo de propiedad");
      process.exit(1);
    }

    // 3. Query completa como la hace PropertyService
    const filter = {
      status: "active",
      operationType: operationType,
      "address.city": cityDoc._id,
      propertyType: typeDoc._id,
    };

    console.log("\n🔎 Filter:", JSON.stringify(filter, null, 2));

    const properties = await Property.find(filter);
    console.log(`\n📦 Propiedades encontradas: ${properties.length}`);

    for (const prop of properties) {
      console.log(`\n  - ${prop.title}`);
      console.log(`    Slug: ${prop.slug}`);
      console.log(`    Status: ${prop.status}`);
    }

    // 4. Buscar SIN filtros de tipo de propiedad
    const filterNoType = {
      status: "active",
      operationType: operationType,
      "address.city": cityDoc._id,
    };

    const propertiesNoType = await Property.find(filterNoType);
    console.log(`\n📦 Propiedades (sin filtro tipo): ${propertiesNoType.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

test();
