# AGENTS.md - Agentic Coding Guidelines

This file provides guidelines for agentic coding assistants operating in this repository.

## Project Overview
- **Framework**: Next.js 16 with React 19 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **Testing**: Vitest

## Commands
```bash
# Development
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint on entire codebase
npx eslint . --ext .ts,.tsx  # Lint specific files

# Testing
npm test             # Run all tests (vitest run)
npx vitest           # Run tests in watch mode
npx vitest run file.test.ts  # Run a single test file

# Database
npm run seed         # Run database seed script

# TypeScript scripts
npx tsx <script>     # Run TypeScript scripts directly
```

## Project Structure
```
src/
├── app/                    # Next.js App Router pages & API routes
├── components/             # React components (UI)
├── db/                     # Database connection & schemas
├── domain/                 # Domain logic (dtos, enums, interfaces, mappers, models)
├── lib/                    # Utility functions & config
└── server/                 # Server-side logic
    ├── controllers/        # Route controllers
    ├── errors/             # Custom error classes
    ├── repositories/      # Data access layer
    └── services/          # Business logic layer
```

## Code Style Guidelines

### Imports & Path Aliases
Use `@/` alias (configured in `tsconfig.json`):
```typescript
// ✅ Good
import { connectDB } from "@/db/connection";

// ❌ Bad - avoid relative paths
import { connectDB } from "../../db/connection";
```
Import order: Next.js/React → External → @/ imports

### TypeScript
- Always define explicit types for parameters and return types
- Use `interfaces` for object shapes, `types` for unions/primitives
- **Acceptable `any`**: Files receiving raw request data (DTOs, controllers, mappers) use:
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
export class CreatePropertyDTO {
  constructor(data: any) { ... }
}
```

### Naming Conventions
- **Files**: kebab-case (`property-card.tsx`), PascalCase for components (`PropertyCard.tsx`)
- **Variables/Functions**: camelCase
- **Classes**: PascalCase (`PropertyController`)
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with suffixes (`Property`, `OperationType`)

### Components
```typescript
interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return ( ... );
}
```
Use Next.js `<Link>` for internal navigation. Use `cn()` from `@/lib/utils` for conditional Tailwind classes.

### Error Handling
Use custom error classes from `src/server/errors/http-error.ts`:
```typescript
import { HttpError, NotFoundError, BadRequestError } from "@/server/errors/http-error";

throw new NotFoundError("Property not found");
throw new BadRequestError("Invalid input data");
```

Controllers should have a centralized error handler:
```typescript
private static handleError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ message: "Internal server error" }, { status: 500 });
}
```

### DTOs (Data Transfer Objects)
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";

export class CreatePropertyDTO {
  title: string;
  price: { amount: number; currency: "USD" | "ARS" };

  constructor(data: any) {
    if (!data.title) throw new BadRequestError("El título es requerido");
    this.title = data.title;
    // ... map and validate fields
  }
}
```

### API Routes
```typescript
import { PropertyController } from "@/server/controllers/property.controller";
import { connectDB } from "@/db/connection";

export async function GET(req: Request) {
  try {
    await connectDB();
    return PropertyController.getAll(req);
  } catch (error) {
    return PropertyController.handleError(error);
  }
}
```

### Database Operations
- Always call `connectDB()` at start of controller methods
- Use services for business logic (`src/server/services/`)
- Use Mongoose schemas in `src/domain/` or `src/db/schemas/`

## Environment Variables
Required in `.env.local`:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_*` - Cloudinary API credentials (for image uploads)

## Useful Notes
- Spanish for user-facing content (labels, messages, property types)
- English for code (variables, functions, types)
- Property slugs auto-generated from titles - avoid repeating property type in title
- Tests use Vitest with Node environment, place test files with `.test.ts` or `.spec.ts` suffix
