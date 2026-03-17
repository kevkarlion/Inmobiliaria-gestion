import { UserRole } from "./create-user.dto";

export interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function userResponseDTO(user: any): UserResponse {
  return {
    id: user._id?.toString() || user.id,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
