import * as bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { AuditService } from "./audit.service";
import { CreateUserDTO, UserRole } from "@/dtos/user/create-user.dto";
import { UpdateUserDTO } from "@/dtos/user/update-user.dto";
import { UserResponse, userResponseDTO } from "@/dtos/user/user-response.dto";
import { BadRequestError, NotFoundError } from "@/server/errors/http-error";
import { connectDB } from "@/db/connection";

export class UserService {
  /**
   * Crea un nuevo usuario (solo admins pueden crear)
   */
  static async create(
    dto: CreateUserDTO,
    performedBy: { userId: string; email: string }
  ): Promise<UserResponse> {
    await connectDB();

    // Verificar que el email no exista
    const existingUser = await UserRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestError(`Ya existe un usuario con el email "${dto.email}"`);
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Crear usuario
    const user = await UserRepository.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    });

    // Registrar en audit log
    await AuditService.log({
      action: "create",
      entity: "user",
      entityId: user._id.toString(),
      userId: performedBy.userId,
      userEmail: performedBy.email,
      description: `Usuario creado: ${dto.email} con rol ${dto.role}`,
      changes: { email: dto.email, role: dto.role },
    });

    return userResponseDTO(user);
  }

  /**
   * Obtiene todos los usuarios con paginación
   */
  static async findAll(
    query: {
      page: number;
      limit: number;
      role?: UserRole;
      active?: boolean;
      search?: string;
      sortBy: string;
      sortOrder: "asc" | "desc";
    },
    performedBy: { userId: string; email: string }
  ): Promise<{ items: UserResponse[]; meta: any }> {
    await connectDB();

    const skip = (query.page - 1) * query.limit;

    const { items, total } = await UserRepository.findAll({
      ...query,
      skip,
      limit: query.limit,
    });

    return {
      items: items.map(userResponseDTO),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  /**
   * Obtiene un usuario por ID
   */
  static async findById(
    id: string,
    performedBy: { userId: string; email: string }
  ): Promise<UserResponse> {
    await connectDB();

    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    return userResponseDTO(user);
  }

  /**
   * Restablece la contraseña de un usuario por ID (admin only)
   */
  static async resetPasswordById(
    id: string,
    newPassword: string
  ): Promise<void> {
    await connectDB();

    // Verificar que el usuario exista
    const existingUser = await UserRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError("Usuario no encontrado");
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar contraseña
    await UserRepository.updatePassword(id, hashedPassword);
  }

  /**
   * Actualiza un usuario
   */
  static async update(
    id: string,
    dto: UpdateUserDTO,
    performedBy: { userId: string; email: string }
  ): Promise<UserResponse> {
    await connectDB();

    // Verificar que el usuario exista
    const existingUser = await UserRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError("Usuario no encontrado");
    }

    // Si se cambia el email, verificar que no exista otro usuario con ese email
    if (dto.email && dto.email !== existingUser.email) {
      const emailExists = await UserRepository.findByEmail(dto.email);
      if (emailExists) {
        throw new BadRequestError(`Ya existe un usuario con el email "${dto.email}"`);
      }
    }

    // Prevenir que un admin se deactive a sí mismo
    if (id === performedBy.userId && dto.active === false) {
      throw new BadRequestError("No puedes desactivarte a ti mismo");
    }

    // Prevenir que el último admin sea desactivado
    if (dto.active === false && existingUser.role === "admin") {
      const adminCount = await UserRepository.countByRole("admin");
      if (adminCount <= 1) {
        throw new BadRequestError("No puedes desactivar al último administrador");
      }
    }

    // Registrar cambios para audit
    const changes: any = {};
    if (dto.email && dto.email !== existingUser.email) {
      changes.email = { from: existingUser.email, to: dto.email };
    }
    if (dto.role && dto.role !== existingUser.role) {
      changes.role = { from: existingUser.role, to: dto.role };
    }
    if (dto.active !== undefined && dto.active !== existingUser.active) {
      changes.active = { from: existingUser.active, to: dto.active };
    }

    // Actualizar usuario
    const updatedUser = await UserRepository.update(id, {
      email: dto.email,
      role: dto.role,
      active: dto.active,
    });

    // Registrar en audit log si hubo cambios
    if (Object.keys(changes).length > 0) {
      await AuditService.log({
        action: dto.active === false ? "deactivate" : "update",
        entity: "user",
        entityId: id,
        userId: performedBy.userId,
        userEmail: performedBy.email,
        description: `Usuario actualizado: ${existingUser.email}`,
        changes,
      });
    }

    return userResponseDTO(updatedUser!);
  }

  /**
   * Desactiva (soft delete) un usuario
   */
  static async deactivate(
    id: string,
    performedBy: { userId: string; email: string }
  ): Promise<UserResponse> {
    await connectDB();

    // Verificar que el usuario exista
    const existingUser = await UserRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError("Usuario no encontrado");
    }

    // Prevenir que un admin se desactive a sí mismo
    if (id === performedBy.userId) {
      throw new BadRequestError("No puedes desactivarte a ti mismo");
    }

    // Prevenir que el último admin sea desactivado
    if (existingUser.role === "admin") {
      const adminCount = await UserRepository.countByRole("admin");
      if (adminCount <= 1) {
        throw new BadRequestError("No puedes desactivar al último administrador");
      }
    }

    // Desactivar usuario
    const updatedUser = await UserRepository.update(id, { active: false });

    // Registrar en audit log
    await AuditService.log({
      action: "deactivate",
      entity: "user",
      entityId: id,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      description: `Usuario desactivado: ${existingUser.email}`,
      changes: { email: existingUser.email, role: existingUser.role },
    });

    return userResponseDTO(updatedUser!);
  }

  /**
   * Activa un usuario
   */
  static async activate(
    id: string,
    performedBy: { userId: string; email: string }
  ): Promise<UserResponse> {
    await connectDB();

    // Verificar que el usuario exista
    const existingUser = await UserRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError("Usuario no encontrado");
    }

    if (existingUser.active) {
      throw new BadRequestError("El usuario ya está activo");
    }

    // Activar usuario
    const updatedUser = await UserRepository.update(id, { active: true });

    // Registrar en audit log
    await AuditService.log({
      action: "activate",
      entity: "user",
      entityId: id,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      description: `Usuario activado: ${existingUser.email}`,
      changes: { email: existingUser.email, role: existingUser.role },
    });

    return userResponseDTO(updatedUser!);
  }
}
