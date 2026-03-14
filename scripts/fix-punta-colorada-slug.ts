// scripts/fix-punta-colorada-slug.ts
// Script para corregir el slug de propiedades en Punta Colorada
import mongoose from 'mongoose';
import slugify from "slugify";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function fixSlugs() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Schemas
    const CitySchema = new mongoose.Schema({
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

    const City = mongoose.model("City", CitySchema);
    const Property = mongoose.model("Property", PropertySchema);

    // Buscar Punta Colorada
    const puntaColorada = await City.findOne({ slug: "punta-colorada" });
    if (!puntaColorada) {
      console.error("❌ No se encontró Punta Colorada");
      process.exit(1);
    }

    // Buscar propiedades en Punta Colorada
    const properties = await Property.find({
      "address.city": puntaColorada._id,
    });

    console.log(`\n📊 Propiedades en Punta Colorada: ${properties.length}`);

    for (const prop of properties) {
      // Generar nuevo slug
      const titleSlug = slugify(prop.title || "", { lower: true, strict: true });
      const newSlug = `${titleSlug}-punta-colorada`;
      
      console.log(`\n- ${prop.title}`);
      console.log(`  Old slug: ${prop.slug}`);
      console.log(`  New slug: ${newSlug}`);

      // Actualizar slug
      await Property.updateOne(
        { _id: prop._id },
        { $set: { slug: newSlug } }
      );
    }

    console.log(`\n✅ Slugs actualizados`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixSlugs();
