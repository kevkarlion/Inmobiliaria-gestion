/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";
import { UserRole } from "./create-user.dto";

export class QueryUserDTO {
  page: number;
  limit: number;
  role?: UserRole;
  active?: boolean;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";

  constructor(query: any) {
    this.page = Math.max(1, parseInt(query.page) || 1);
    this.limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    
    if (query.role) {
      const validRoles: UserRole[] = ["admin", "user"];
      if (!validRoles.includes(query.role)) {
        throw new BadRequestError("El rol debe ser 'admin' o 'user'");
      }
      this.role = query.role;
    }

    if (query.active !== undefined) {
      this.active = query.active === "true";
    }

    if (query.search) {
      this.search = query.search.trim();
    }

    const validSortFields = ["email", "role", "active", "createdAt", "updatedAt"];
    this.sortBy = validSortFields.includes(query.sortBy) ? query.sortBy : "createdAt";
    this.sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
  }
}
