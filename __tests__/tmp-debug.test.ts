import { describe, it, expect } from "vitest";
import fs from "fs";

describe("debug barrio", () => {
  it("filters", async () => {
    process.env.MONGODB_URI = fs.readFileSync(".env.local", "utf8").match(/MONGODB_URI=(.*)/)![1].trim();
    const { connectDB } = await import("@/db/connection");
    const { PropertyModel } = await import("@/db/schemas/property.schema");
    const { buildBarrioMatchRegex } = await import("@/lib/propertyFilters");
    await connectDB();
    const re = buildBarrioMatchRegex("210-viviendas")!;
    const doc = await PropertyModel.findOne({ "address.barrio": re }).lean();
    console.log("DOC", JSON.stringify({ status: doc?.status, isActive: doc?.isActive, op: doc?.operationType, barrio: doc?.address?.barrio }));
    const withActive = await PropertyModel.find({ status: "active", isActive: { $ne: false }, operationType: "venta", "address.barrio": re }).lean();
    console.log("WITH_ACTIVE", withActive.length);
    const withRepo = await PropertyModel.find({ status: "active", isActive: { $ne: false }, operationType: "venta", "address.barrio": re })
      .select("title slug price propertyType address location features flags images imagesDesktop imagesMobile contactPhone description createdBy isActive")
      .populate("propertyType", "name slug").populate("address.province", "name slug").populate("address.city", "name slug").populate("address.barrio", "name slug")
      .lean();
    console.log("WITH_REPO", withRepo.length);
    expect(true).toBe(true);
  }, 60000);
});
