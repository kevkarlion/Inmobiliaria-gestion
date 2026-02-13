// scripts/seed.ts
import mongoose from 'mongoose';
import { Province } from '../src/db/schemas/province.schema';
import { City } from '../src/db/schemas/city.schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "tu_mongodb_uri_aqui";

async function runSeed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    await Province.deleteMany({});
    await City.deleteMany({});

    // 1. Crear Provincias
    const rioNegro = await Province.create({ name: "Río Negro", slug: "rio-negro" });
    const neuquen = await Province.create({ name: "Neuquén", slug: "neuquen" });
    const buenosAires = await Province.create({ name: "Buenos Aires", slug: "buenos-aires" });
    // El "Comodín" para otras provincias
    const otraProvincia = await Province.create({ name: "Otra Provincia", slug: "otra-provincia" });

    // 2. Localidades Río Negro
    const citiesRioNegro = [
      { name: "General Roca", slug: "general-roca" },
      { name: "Cipolletti", slug: "cipolletti" },
      { name: "Allen", slug: "allen" },
      { name: "Villa Regina", slug: "villa-regina" },
      { name: "Cinco Saltos", slug: "cinco-saltos" },
      { name: "Catriel", slug: "catriel" },
      { name: "Fernández Oro", slug: "fernandez-oro" },
      { name: "Ingeniero Huergo", slug: "ingeniero-huergo" },
      { name: "Mainqué", slug: "mainque" },
      { name: "Cervantes", slug: "cervantes" },
      { name: "General Godoy", slug: "general-godoy" },
      { name: "Choele Choel", slug: "choele-choel" },
      { name: "Lamarque", slug: "lamarque" },
      { name: "Luis Beltrán", slug: "luis-beltran" },
      { name: "Las Grutas", slug: "las-grutas" },
      { name: "San Antonio Oeste", slug: "san-antonio-oeste" },
      { name: "Viedma", slug: "viedma" },
      { name: "San Carlos de Bariloche", slug: "bariloche" },
      { name: "El Bolsón", slug: "el-bolson" },
      { name: "Dina Huapi", slug: "dina-huapi" },
      // Ciudad genérica para Río Negro
      { name: "Otras localidades (Río Negro)", slug: "otras-rio-negro" }
    ];

    // 3. Localidades Neuquén
    const citiesNeuquen = [
      { name: "Neuquén Capital", slug: "neuquen-capital" },
      { name: "Plottier", slug: "plottier" },
      { name: "Centenario", slug: "centenario" },
      { name: "Senillosa", slug: "senillosa" },
      { name: "Añelo", slug: "anelo" },
      { name: "San Patricio del Chañar", slug: "san-patricio-del-chanar" },
      { name: "Cutral Có", slug: "cutral-co" },
      { name: "Plaza Huincul", slug: "plaza-huincul" },
      { name: "Zapala", slug: "zapala" },
      { name: "San Martín de los Andes", slug: "san-martin-de-los-andes" },
      { name: "Villa La Angostura", slug: "villa-la-angostura" },
      { name: "Junín de los Andes", slug: "junin-de-los-andes" },
      { name: "Chos Malal", slug: "chos-malal" },
      { name: "Villa El Chocón", slug: "villa-el-chocon" },
      // Ciudad genérica para Neuquén
      { name: "Otras localidades (Neuquén)", slug: "otras-neuquen" }
    ];

    // 4. Localidades Buenos Aires (Principales / CABA / Costa)
    const citiesBA = [
      { name: "CABA", slug: "caba" },
      { name: "La Plata", slug: "la-plata" },
      { name: "Mar del Plata", slug: "mar-del-plat" },
      { name: "Bahía Blanca", slug: "bahia-blanca" },
      { name: "Tandil", slug: "tandil" },
      { name: "Pilar", slug: "pilar" },
      { name: "Tigre", slug: "tigre" },
      { name: "San Isidro", slug: "san-isidro" },
      { name: "Vicente López", slug: "vicente-lopez" },
      { name: "Quilmes", slug: "quilmes" },
      { name: "Lanús", slug: "lanus" },
      { name: "Luján", slug: "lujan" },
      { name: "Otras localidades (Buenos Aires)", slug: "otras-buenos-aires" }
    ];

    // 5. Localidad Genérica Absoluta (Para cuando no es ninguna de las anteriores)
    const citiesGenericas = [
      { name: "Otra localidad / Consultar", slug: "generica-consultar" }
    ];

    // Mapeo e Inserción
    const data = [
      ...citiesRioNegro.map(c => ({ ...c, province: rioNegro._id })),
      ...citiesNeuquen.map(c => ({ ...c, province: neuquen._id })),
      ...citiesBA.map(c => ({ ...c, province: buenosAires._id })),
      ...citiesGenericas.map(c => ({ ...c, province: otraProvincia._id }))
    ];

    await City.insertMany(data);

    console.log(`🚀 Seed finalizado con éxito.`);
    console.log(`✅ Río Negro, Neuquén, Buenos Aires y opción "Genérica" listas.`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el seed:", error);
    process.exit(1);
  }
}

runSeed();