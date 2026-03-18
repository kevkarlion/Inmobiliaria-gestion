import { UserModel } from "@/domain/models/User";
import { Types } from "mongoose";
import { UserRole } from "@/dtos/user/create-user.dto";

export class UserRepository {
  static async findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).lean();
  }

  static async findById(id: string) {
    return UserModel.findById(id).lean();
  }

  static async findAll(query: {
    role?: UserRole;
    active?: boolean;
    search?: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    skip: number;
    limit: number;
  }) {
    const filter: any = {};

    if (query.role) {
      filter.role = query.role;
    }

    if (query.active !== undefined) {
      filter.active = query.active;
    }

    if (query.search) {
      filter.email = { $regex: query.search, $options: "i" };
    }

    const sort: any = {};
    sort[query.sortBy] = query.sortOrder === "asc" ? 1 : -1;

    const [items, total] = await Promise.all([
      UserModel.find(filter)
        .sort(sort)
        .skip(query.skip)
        .limit(query.limit)
        .lean(),
      UserModel.countDocuments(filter),
    ]);

    return { items, total };
  }

  static async create(data: { email: string; password: string; role: UserRole }) {
    const user = new UserModel({
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role,
      active: true,
    });
    return user.save();
  }

  static async update(id: string, data: { email?: string; role?: UserRole; active?: boolean }) {
    const updateData: any = {};
    if (data.email) updateData.email = data.email.toLowerCase();
    if (data.role) updateData.role = data.role;
    if (data.active !== undefined) updateData.active = data.active;

    return UserModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  static async delete(id: string) {
    // Soft delete - deactivate instead of delete
    return UserModel.findByIdAndUpdate(id, { active: false }, { new: true }).lean();
  }

  static async updatePassword(id: string, hashedPassword: string) {
    return UserModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).lean();
  }

  static async countByRole(role: UserRole) {
    return UserModel.countDocuments({ role, active: true });
  }
}
