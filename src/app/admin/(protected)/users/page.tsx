// app/admin/users/page.tsx (SERVER)
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { redirect } from "next/navigation";
import UsersAdminClient from "./UsersAdminClient";
import { UserService } from "@/server/services/user.service";
import { userResponseDTO, UserResponse } from "@/dtos/user/user-response.dto";
import { QueryUserDTO } from "@/dtos/user/query-user.dto";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  
  if (!token) {
    redirect("/admin/login");
  }
  
  try {
    const decoded = verifyToken(token);
    if ((decoded as any).role !== "admin") {
      redirect("/admin/properties");
    }
    return decoded;
  } catch {
    redirect("/admin/login");
  }
}

export default async function UsersAdminPage() {
  await checkAdmin();
  
  const queryDto = new QueryUserDTO({ page: 1, limit: 50, sortBy: "createdAt", sortOrder: "desc" });
  const { items } = await UserService.findAll(queryDto, { userId: "system", email: "system" });
  const users: UserResponse[] = items.map(userResponseDTO);

  return <UsersAdminClient initialUsers={users} />;
}
