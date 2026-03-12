# AGENTS.md - Agentic Coding Guidelines

This file provides guidelines for agentic coding assistants operating in this repository.

## Project Overview
- **Framework**: Next.js 16 with React 19 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with HTTP-only cookies
- **Package Manager**: npm

---

## Commands
```bash
# Development
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint on entire codebase
npx eslint src/path/to/file.ts  # Lint specific file

# Database
npm run seed         # Run database seed script

# TypeScript scripts
npx tsx <script>     # Run TypeScript scripts directly
```

**Note**: No test framework is currently configured.

---

## Code Style Guidelines

### General Principles
- Follow existing code patterns in the codebase
- Keep functions small and focused (single responsibility)
- Use meaningful variable/function names
- Handle errors gracefully with proper error types

### Imports & Path Aliases
Use `@/` alias (configured in `tsconfig.json`):
```typescript
// ✅ Good
import { connectDB } from "@/db/connection";
import { PropertyService } from "@/server/services/property.service";

// ❌ Bad - avoid relative paths
import { connectDB } from "../../db/connection";
```

Import order: Next.js/React → External → @/ imports → Relative

### TypeScript (Strict Mode)
- Always define explicit types for parameters and return types
- Use `interfaces` for object shapes, `types` for unions/primitives
- Avoid `any` - if needed, use `eslint-disable` comment with explanation
- Use `unknown` when type is unknown, then narrow with type guards

```typescript
// ✅ Good
function getProperty(slug: string): Promise<Property | null> { ... }

// ❌ Bad
function getProperty(slug) { ... }
```

### Naming Conventions
- **Files**: kebab-case (`property-card.tsx`), PascalCase for components (`PropertyCard.tsx`)
- **Variables/Functions**: camelCase (`const propertyList`, `function getBySlug`)
- **Classes**: PascalCase (`class PropertyController`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Types/Interfaces**: PascalCase with suffixes (`interface Property`, `type OperationType = "venta" | "alquiler"`)

### Components
```typescript
interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return ( ... );
}
```
Use Next.js `<Link>` for internal navigation.

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
Follow pattern in `src/dtos/`:
```typescript
export class CreatePropertyDTO {
  title: string;
  price: { amount: number; currency: "USD" | "ARS" };

  constructor(data: any) {
    if (!data.title) throw new BadRequestError("El título es requerido");
    this.title = data.title;
  }
}
```

### API Routes
```typescript
import { PropertyController } from "@/server/controllers/property.controller";

export async function GET(req: Request) {
  return PropertyController.getAll(req);
}

export async function POST(req: Request) {
  return PropertyController.create(req);
}
```

### Database Operations
- Always call `connectDB()` at start of controller methods
- Use services for business logic (`src/server/services/`)
- Use Mongoose schemas in `src/domain/`

### Tailwind CSS
Use `cn()` utility for conditional classes:
```typescript
<div className={cn("base-classes", isActive && "active-classes", className)}>
```

---

## Common Patterns

### Connecting to DB
```typescript
import { connectDB } from "@/db/connection";

async function handler() {
  await connectDB();
  // ... database operations
}
```

### Protected Routes (Admin)
```typescript
import { requireAdmin } from "@/lib/auth";

async function protectedHandler() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  // ... admin-only operations
}
```

---

## Environment Variables
Required in `.env.local`:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_*` - Cloudinary API credentials (if using image uploads)

---

## Useful Notes
- Spanish for user-facing content (labels, messages, property types)
- English for code (variables, functions, types)
- Property slugs auto-generated from titles - avoid repeating property type in title
- The project uses redirects for SEO (see `next.config.ts`)
