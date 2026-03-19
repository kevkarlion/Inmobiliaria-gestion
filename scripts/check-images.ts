import "@/db/connection";
import mongoose from "mongoose";

async function main() {
  const PropertySchema = new mongoose.Schema({}, { strict: false });
  const Property = mongoose.model("Property", PropertySchema);

  const prop = await Property.findOne({ slug: "terreno-don-mariano-general-roca" }).lean() as { title?: string; images?: string[]; status?: string } | null;

  if (!prop) {
    console.log("Property not found");
  } else {
    console.log("Title:", prop.title);
    console.log("Images count:", prop.images && prop.images.length);
    if (prop.images && prop.images.length > 0) {
      console.log("First image:", prop.images[0]);
      if (prop.images.length > 1) console.log("Second image:", prop.images[1]);
    }
    console.log("Status:", prop.status);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
