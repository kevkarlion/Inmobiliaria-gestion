import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "@/domain/models/User";

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI!, {
    dbName: "inmobiliaria", 
  });

  const email = "admin@admin.com";
  const password = "admin123";

  const exists = await UserModel.findOne({ email });
  if (exists) {
 
    process.exit();
  }

  const hash = await bcrypt.hash(password, 10);

  await UserModel.create({
    email,
    password: hash,
    role: "admin",
  });

  process.exit();
}

createAdmin();
