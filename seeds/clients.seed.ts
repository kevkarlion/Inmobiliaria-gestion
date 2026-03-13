/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientModel } from "@/db/schemas/client.schema";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";

export async function seedClients() {
  const clients = [
    {
      name: "Inversion Terrenos",
      email: "terrenos@example.com",
      phone: "555-0000",
      status: ClientStatus.ACTIVE,
      source: ClientSource.WEB,
      preferences: {
        operationType: "venta",
        subType: "terreno",
        propertyTypes: ["terreno"],
        zones: [],
        priceRange: { min: 100000, max: 200000 },
        features: { bedrooms: 0, bathrooms: 0, minM2: 0, garage: false },
      },
      lastActivityAt: new Date(),
    },
    {
      name: "Vivienda Compra",
      email: "vivenda@example.com",
      phone: "555-0001",
      status: ClientStatus.ACTIVE,
      source: ClientSource.WEB,
      preferences: {
        operationType: "compra",
        subType: "vivienda",
        propertyTypes: ["casa"],
        zones: [],
        priceRange: { min: 150000, max: 350000 },
        features: { bedrooms: 3, bathrooms: 2, minM2: 70, garage: true },
      },
      lastActivityAt: new Date(),
    },
  ];

  for (const c of clients) {
    const existing = await ClientModel.findOne({ email: c.email }).exec();
    if (existing) {
      await ClientModel.updateOne({ _id: existing._id }, c);
    } else {
      await ClientModel.create(c);
    }
  }
}
