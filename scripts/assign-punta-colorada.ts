// scripts/assign-punta-colorada.ts
// Script para reasignar propiedades a Punta Colorada
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function assignPuntaColorada() {
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
    console.log("📍 Punta Colorada:", puntaColorada._id);

    // Buscar propiedades en "otras-rio-negro" de tipo loteo
    const otrasRioNegro = await City.findOne({ slug: "otras-rio-negro" });
    if (!otrasRioNegro) {
      console.error("❌ No se encontró Otras Rio Negro");
      process.exit(1);
    }

    // Buscar propiedades que tengan esa ciudad
    const properties = await Property.find({
      "address.city": otrasRioNegro._id,
    }).limit(10);

    console.log(`\n📊 Propiedades encontradas en "Otras localidades (Río Negro)": ${properties.length}`);

    if (properties.length === 0) {
      console.log("❌ No hay propiedades para reasignar");
      process.exit(0);
    }

    // Mostrar las propiedades
    for (const prop of properties) {
      console.log(`\n- ${prop.title}`);
      console.log(`  Slug: ${prop.slug}`);
      console.log(`  Ciudad actual: ${otrasRioNegro._id}`);
    }

    // Reasignar todas a Punta Colorada
    const result = await Property.updateMany(
      { "address.city": otrasRioNegro._id },
      { $set: { "address.city": puntaColorada._id } }
    );

    console.log(`\n✅ ${result.modifiedCount} propiedades reasignadas a Punta Colorada`);

    // Ahora buscar propiedades que ya tenían Punta Colorada (por nombre en el título)
    const byTitle = await Property.find({
      title: { $regex: /punta\s*colorada/i },
    });

    console.log(`\n📊 Propiedades con "Punta Colorada" en el título: ${byTitle.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

assignPuntaColorada();
