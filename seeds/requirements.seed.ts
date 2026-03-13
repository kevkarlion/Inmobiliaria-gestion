/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientModel } from "@/db/schemas/client.schema";
import { RequirementModel } from "@/domain/models/requirement.model";

export async function seedRequirements() {
  const terrClient = await ClientModel.findOne({ email: "terrenos@example.com" });
  if (terrClient) {
    const exists = await RequirementModel.findOne({ clientId: terrClient._id, zone: "Centro", type: "terreno" });
    if (!exists) {
      await RequirementModel.create({ clientId: terrClient._id, zone: "Centro", type: "terreno", priceMin: 90000, priceMax: 150000, status: "open" });
    }
  }

  const viviClient = await ClientModel.findOne({ email: "vivenda@example.com" });
  if (viviClient) {
    const exists2 = await RequirementModel.findOne({ clientId: viviClient._id, zone: "CABA", type: "vivienda" });
    if (!exists2) {
      await RequirementModel.create({ clientId: viviClient._id, zone: "CABA", type: "vivienda", priceMin: 150000, priceMax: 350000, status: "open" });
    }
  }
}
