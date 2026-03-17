/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";

export type UserRole = "admin" | "user";

export class CreateUserDTO {
  email: string;
  password: string;
  role: UserRole;

  constructor(data: any) {
    if (!data.email) {
      throw new BadRequestError("El email es requerido");
    }
    if (!data.password) {
      throw new BadRequestError("La contraseña es requerida");
    }
    if (data.password.length < 6) {
      throw new BadRequestError("La contraseña debe tener al menos 6 caracteres");
    }
    if (data.password.length > 72) {
      throw new BadRequestError("La contraseña no puede exceder 72 caracteres");
    }

    const validRoles: UserRole[] = ["admin", "user"];
    if (data.role && !validRoles.includes(data.role)) {
      throw new BadRequestError("El rol debe ser 'admin' o 'user'");
    }

    this.email = data.email.toLowerCase().trim();
    this.password = data.password;
    this.role = data.role || "user";
  }
}
