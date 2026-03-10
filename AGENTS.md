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

### Development
```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
```

### Linting & Type Checking
```bash
npm run lint         # Run ESLint on entire codebase
npx eslint src/path/to/file.ts  # Lint specific file
```

### Database Seeding
```bash
npm run seed         # Run database seed script (seeds/adress.ts)
```

### Running Tests (Vitest/Jest)
Currently, **no test framework is configured**. When adding tests:
```bash
npm test             # Run all tests
npm test -- --run src/specific/file.test.ts  # Run single test file
npm test -- --watch  # Watch mode
```

### Next.js Specific
```bash
npx tsx <script>     # Run TypeScript scripts directly
```

---

## Code Style Guidelines

### General Principles
- Follow the existing code patterns in the codebase
- Keep functions small and focused (single responsibility)
- Use meaningful variable and function names
- Add comments for non-obvious logic
- Handle errors gracefully with proper error types

### Imports & Path Aliases
Use the `@/` alias for imports (configured in `tsconfig.json`):
```typescript
// ✅ Good
import { connectDB } from "@/db/connection";
import { PropertyService } from "@/server/services/property.service";
import { cn } from "@/lib/utils";

// ❌ Bad - avoid relative paths
import { connectDB } from "../../db/connection";
```

Import order (recommended):
1. Next.js/React imports
2. External libraries
3. Internal @/ imports (alphabetically)
4. Relative imports

### TypeScript

**Strict Mode**: This project has `strict: true` in tsconfig.json.

- Always define explicit types for function parameters and return types
- Use interfaces for object shapes, types for unions/primitives
- Avoid `any` - if absolutely necessary, use `eslint-disable` comment with explanation
- Use `unknown` when type is truly unknown, then narrow with type guards
```typescript
// ✅ Good
function getProperty(slug: string): Promise<Property | null> { ... }

// ❌ Bad - avoid implicit any
function getProperty(slug) { ... }

// If any is required:
function handleData(data: any): void { /* eslint-disable @typescript-eslint/no-explicit-any */ }
```

### Naming Conventions

- **Files**: Use kebab-case for utilities, PascalCase for components/classes
  - `property-card.tsx` (component)
  - `property.service.ts` (service)
  - `http-error.ts` (class/util)
  
- **Variables/Functions**: Use camelCase
  - `const propertyList = []`
  - `async function getPropertyBySlug(slug: string)`

- **Classes**: Use PascalCase
  - `class PropertyController`
  - `class HttpError`

- **Constants**: Use UPPER_SNAKE_CASE for true constants
  - `const MAX_RETRY_COUNT = 3`

- **Types/Interfaces**: Use PascalCase with meaningful suffixes
  - `interface Property`
  - `type PropertyResponse`
  - `type OperationType = "venta" | "alquiler"`

### Components

- Use functional components with TypeScript
- Define prop types using interfaces
- Use Next.js `<Link>` for internal navigation
```typescript
interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return ( ... );
}
```

### Error Handling

Use the custom error classes defined in `src/server/errors/http-error.ts`:
```typescript
import { HttpError, NotFoundError, BadRequestError } from "@/server/errors/http-error";

// In controllers/services:
throw new NotFoundError("Property not found");
throw new BadRequestError("Invalid input data");
throw new HttpError("Custom error", 418);
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

Follow the existing DTO pattern in `src/dtos/`:
- Create a class with validation in constructor
- Throw `BadRequestError` for invalid data
- Transform raw input to typed objects
```typescript
export class CreatePropertyDTO {
  title: string;
  price: { amount: number; currency: "USD" | "ARS" };
  
  constructor(data: any) {
    if (!data.title) throw new BadRequestError("El título es requerido");
    this.title = data.title;
    // ...
  }
}
```

### API Routes

Follow the pattern in `src/app/api/`:
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

- Always call `connectDB()` at the start of controller methods
- Use services for business logic (in `src/server/services/`)
- Use Mongoose schemas defined in `src/domain/`
- Keep database connections in `src/db/`

### Tailwind CSS

- Use utility classes for styling
- Follow the shadcn/ui component patterns
- Use `cn()` utility for conditional classes:
```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className // allow overrides
)}>
```

---

## Architecture

```
src/
├── app/              # Next.js App Router pages & API routes
│   ├── api/         # API endpoints
│   └── (routes)     # Page routes
├── components/      # React components
│   ├── shared/      # Shared UI components
│   ├── ui/          # shadcn/ui base components
│   └── home/        # Home page components
├── db/              # Database connection
├── domain/          # Domain models, schemas, types
│   ├── property/    # Property-related schemas
│   └── types/       # TypeScript types
├── dtos/            # Data Transfer Objects
├── lib/             # Utility functions (utils, auth, config)
├── server/          # Server-side logic
│   ├── controllers/ # Request handlers
│   ├── services/    # Business logic
│   └── errors/      # Custom error classes
└── context/         # React context providers
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

- Spanish is used for user-facing content (labels, messages, property types)
- English is used for code (variables, functions, types)
- Property slugs are auto-generated from titles - avoid repeating property type in title
- The project uses redirects for SEO (see `next.config.ts`)
