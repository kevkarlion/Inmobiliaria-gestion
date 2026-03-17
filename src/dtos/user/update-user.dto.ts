/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";
import { UserRole } from "./create-user.dto";

export class UpdateUserDTO {
  email?: string;
  role?: UserRole;
  active?: boolean;

  constructor(data: any) {
    if (data.email !== undefined) {
      if (!data.email || typeof data.email !== "string") {
        throw new BadRequestError("El email debe ser una cadena no vacía");
      }
      this.email = data.email.toLowerCase().trim();
    }

    if (data.role !== undefined) {
      const validRoles: UserRole[] = ["admin", "user"];
      if (!validRoles.includes(data.role)) {
        throw new BadRequestError("El rol debe ser 'admin' o 'user'");
      }
      this.role = data.role;
    }

    if (data.active !== undefined) {
      if (typeof data.active !== "boolean") {
        throw new BadRequestError("El campo active debe ser un booleano");
      }
      this.active = data.active;
    }
  }
}
