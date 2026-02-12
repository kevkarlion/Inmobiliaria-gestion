import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/db/connection";
import { UserModel } from "@/domain/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // 1. Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "El usuario ya existe" }, { status: 400 });
    }

    // 2. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Crear el nuevo admin
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      role: "admin", // Lo marcamos como admin por defecto
      active: true
    });

    await newUser.save();

    return NextResponse.json({ message: "Admin creado con éxito" }, { status: 201 });

  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json({ message: "Error al crear usuario" }, { status: 500 });
  }
}