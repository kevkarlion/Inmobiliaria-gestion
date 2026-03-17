import { connectDB } from "@/db/connection";
import { UserService } from "@/server/services/user.service";
import { NextResponse } from "next/server";
import { HttpError } from "@/server/errors/http-error";
import { CreateUserDTO } from "@/dtos/user/create-user.dto";
import { UpdateUserDTO } from "@/dtos/user/update-user.dto";
import { QueryUserDTO } from "@/dtos/user/query-user.dto";
import { requireAdmin } from "@/lib/auth";

export class AdminUserController {
  private static handleError(error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }

  // POST /api/admin/users
  static async create(req: Request) {
    try {
      await connectDB();
      
      const currentUser = await requireAdmin();
      console.log("requireAdmin result:", currentUser);
      if (!currentUser) {
        return NextResponse.json(
          { message: "Acceso denegado" },
          { status: 403 },
        );
      }

      const body = await req.json();
      const dto = new CreateUserDTO(body);

      const user = await UserService.create(dto, {
        userId: currentUser.id,
        email: currentUser.email,
      });

      return NextResponse.json(user, { status: 201 });
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // GET /api/admin/users
  static async getAll(req: Request) {
    try {
      await connectDB();
      
      const currentUser = await requireAdmin();
      if (!currentUser) {
        return NextResponse.json(
          { message: "Acceso denegado" },
          { status: 403 },
        );
      }

      const { searchParams } = new URL(req.url);
      const query = new QueryUserDTO(Object.fromEntries(searchParams));

      const result = await UserService.findAll(query, {
        userId: currentUser.id,
        email: currentUser.email,
      });

      return NextResponse.json(result);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // GET /api/admin/users/:id
  static async getById(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      
      const currentUser = await requireAdmin();
      if (!currentUser) {
        return NextResponse.json(
          { message: "Acceso denegado" },
          { status: 403 },
        );
      }

      const user = await UserService.findById(params.id, {
        userId: currentUser.id,
        email: currentUser.email,
      });

      return NextResponse.json(user);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // PATCH /api/admin/users/:id
  static async update(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      
      const currentUser = await requireAdmin();
      if (!currentUser) {
        return NextResponse.json(
          { message: "Acceso denegado" },
          { status: 403 },
        );
      }

      const body = await req.json();
      const dto = new UpdateUserDTO(body);

      const user = await UserService.update(params.id, dto, {
        userId: currentUser.id,
        email: currentUser.email,
      });

      return NextResponse.json(user);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // DELETE /api/admin/users/:id
  static async delete(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      
      const currentUser = await requireAdmin();
      if (!currentUser) {
        return NextResponse.json(
          { message: "Acceso denegado" },
          { status: 403 },
        );
      }

      const user = await UserService.deactivate(params.id, {
        userId: currentUser.id,
        email: currentUser.email,
      });

      return NextResponse.json(user);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }
}

// Rutas adicionales para activar usuario
function handleError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status },
    );
  }

  console.error(error);
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 },
  );
}

export async function activateUser(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const currentUser = await requireAdmin();
    if (!currentUser) {
      return NextResponse.json(
        { message: "Acceso denegado" },
        { status: 403 },
      );
    }

    const user = await UserService.activate(params.id, {
      userId: currentUser.id,
      email: currentUser.email,
    });

    return NextResponse.json(user);
  } catch (error: unknown) {
    return handleError(error);
  }
}
