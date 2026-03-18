import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { UserService } from "@/server/services/user.service";
import { AuditService } from "@/server/services/audit.service";
import { BadRequestError } from "@/server/errors/http-error";
import { getCurrentUser } from "@/lib/auth";

// PATCH /api/admin/users/[id]/password - Reset user password (admin only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const currentUser = await getCurrentUser();
    const body = await req.json();

    // Verificar que es admin
    if (!currentUser || currentUser.role !== "admin") {
      throw new BadRequestError("Solo administradores pueden restablecer contraseñas");
    }

    const { newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestError("La contraseña debe tener al menos 6 caracteres");
    }

    // Reset password
    await UserService.resetPasswordById(id, newPassword);

    // Audit log
    await AuditService.log({
      action: "update",
      entity: "user",
      entityId: id,
      userId: currentUser.id,
      userEmail: currentUser.email,
      description: `Contraseña restablecida para usuario ID: ${id}`,
      changes: { action: "password_reset", targetUserId: id },
    });

    return NextResponse.json({ message: "Contraseña restablecida exitosamente" });
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { message: "Error al restablecer contraseña" },
      { status: 500 }
    );
  }
}
