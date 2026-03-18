# Design: Admin Panel Frontend Improvements

## Technical Approach

This design addresses the admin panel frontend improvements by modifying the existing `AdminLayoutClient.tsx` to handle viewport-based responsive behavior and creating reusable `AlertModal` and `ConfirmModal` components to replace browser native dialogs. The implementation uses React's `useState` with window resize detection for viewport changes, and a custom hook pattern for the modal components.

## Architecture Decisions

### Decision: Viewport Detection Method

**Choice**: Use `useState` with `useEffect` listening to `window.innerWidth`
**Alternatives considered**: 
- CSS media queries only (can't trigger state changes)
- `useMediaQuery` hook from external library
- Tailwind's `lg:` responsive classes only (insufficient for logic control)

**Rationale**: The spec requires hiding the toggle button and enforcing sidebar visibility on desktop (≥1024px). This requires JavaScript state to control both rendering and CSS classes. Using `useState` with `useEffect` provides:
- SSR-safe initialization (starts with `false`/mobile)
- Reactive updates on resize
- Simple implementation without external dependencies

### Decision: Route Matching for Active Navigation

**Choice**: `pathname.startsWith(href)` for sub-route highlighting
**Alternatives considered**:
- Exact match (`pathname === href`) — too strict, breaks sub-navigation
- Regex matching — overkill for simple admin routes
- `usePathname()` only — doesn't handle nested routes

**Rationale**: The admin panel has routes like `/admin/properties` with potential sub-routes like `/admin/properties/[id]/edit`. Using `startsWith` allows the "Properties" nav item to stay highlighted when users navigate to child pages.

### Decision: Modal Component Pattern

**Choice**: Props-based controlled components with render props for actions
**Alternatives considered**:
- Context-based modal system — overkill for simple alerts/confirms
- Hook-based (`useAlert()`, `useConfirm()`) — more complex, requires context provider

**Rationale**: The spec requires replacing `alert()` and `confirm()` calls. Controlled components with `isOpen`, `onClose`/`onConfirm`/`onCancel` callbacks align with the existing modal pattern seen in `ClientNewModal.tsx`.

### Decision: Mobile Sidebar Auto-Close Trigger

**Choice**: `setTimeout` with 100-150ms delay on Link click handler
**Alternatives considered**:
- `onMouseDown` — fires too early, can interfere with link activation
- `useTransition` — adds complexity without benefit
- Immediate close — causes visual flash before navigation

**Rationale**: The delay allows the navigation to initiate while the user is still engaged, then closes the sidebar for a smooth transition. The 100-150ms range provides enough time for Next.js router to start navigation.

## Data Flow

### Viewport Detection Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     AdminLayoutClient                        │
├─────────────────────────────────────────────────────────────┤
│  useState<boolean>(isDesktop)                              │
│       │                                                      │
│       ▼                                                      │
│  useEffect on window.resize                                 │
│       │                                                      │
│       ▼                                                      │
│  isDesktop = window.innerWidth >= 1024                      │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────┐   │
│  │ Sidebar     │    │ Toggle Btn  │    │ Nav Links    │   │
│  │ Always     │    │ Hidden on   │    │ Auto-close   │   │
│  │ visible    │    │ desktop     │    │ on mobile    │   │
│  └─────────────┘    └─────────────┘    └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Modal Integration Flow

```
┌──────────────────┐     ┌──────────────────┐
│  Page/Component │     │  Modal Component │
├──────────────────┤     ├──────────────────┤
│  useState        │────▶│  isOpen: boolean  │
│  (modal state)   │     │  title: string   │
│       │          │     │  message: string │
│       ▼          │     │  onClose /        │
│  handleAction()  │     │  onConfirm/      │
│       │          │     │  onCancel        │
│       ▼          │     │         │        │
│  setModalOpen    │────▶│         ▼        │
│  (true)          │     │  User clicks     │
│                  │     │         │        │
│       ▼          │     │         ▼        │
│  Render Modal   │     │  Callback fires  │
│  Component      │     │  (state update)  │
└──────────────────┘     └──────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/ui/alert-modal.tsx` | Create | Reusable AlertModal component |
| `src/components/ui/confirm-modal.tsx` | Create | Reusable ConfirmModal component |
| `src/app/admin/AdminLayoutClient.tsx` | Modify | Add viewport detection, sidebar behavior, active nav highlighting |
| `src/app/admin/(protected)/users/UsersAdminClient.tsx` | Modify | Replace `alert()` with AlertModal |
| `src/app/(admin)/AdminLayoutClient.tsx` | Check | Verify if any other admin layouts need updates |

## Interfaces / Contracts

### AlertModal Component

```typescript
// src/components/ui/alert-modal.tsx
"use client";

import { Button } from "./button";

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function AlertModal({ isOpen, title, message, onClose }: AlertModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}
```

### ConfirmModal Component

```typescript
// src/components/ui/confirm-modal.tsx
"use client";

import { Button } from "./button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar"
}: ConfirmModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Modified AdminLayoutClient (Key Sections)

```typescript
// src/app/admin/AdminLayoutClient.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Add viewport detection
function useViewport() {
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);
  
  return isDesktop;
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDesktop = useViewport();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // On desktop, sidebar is always open (ignore localStorage persistence)
  // On mobile, use localStorage state (existing behavior)
  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(true);
    } else {
      const saved = localStorage.getItem("admin_sidebar_open");
      if (saved !== null) {
        setSidebarOpen(saved === "true");
      }
    }
  }, [isDesktop]);
  
  // Active nav item logic
  function isActiveNavItem(href: string): boolean {
    return pathname.startsWith(href);
  }
  
  // Handle nav link click with auto-close on mobile
  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!isDesktop) {
      // Allow navigation to start, then close sidebar after delay
      setTimeout(() => {
        setSidebarOpen(false);
        localStorage.setItem("admin_sidebar_open", "false");
      }, 120);
    }
  }
  
  return (
    <div className={`flex min-h-screen ${inter.variable} font-sans`}>
      {/* Sidebar - always visible on desktop */}
      <aside className={`
        bg-slate-900 text-white flex flex-col fixed h-full z-50 
        transition-all duration-300 
        ${isDesktop 
          ? 'w-64 translate-x-0' 
          : sidebarOpen 
            ? 'w-64 translate-x-0' 
            : 'w-64 -translate-x-full'
        }
      `}>
        {/* Logo & Toggle - hide toggle on desktop */}
        <div className="p-3 lg:p-4 border-b border-slate-800 flex items-start justify-between">
          {/* ... logo content ... */}
          
          {/* Hide toggle button on desktop */}
          {!isDesktop && (
            <button 
              className="p-2 hover:bg-slate-800 rounded-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronLeft /> : <Menu />}
            </button>
          )}
        </div>
        
        {/* Navigation with active highlighting */}
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg 
                    transition-colors text-sm
                    ${isActiveNavItem(item.href) 
                      ? 'bg-slate-800 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium text-xs">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main content - always have margin on desktop */}
      <main className={`
        flex-1 w-full pt-14 
        ${isDesktop ? 'lg:ml-64' : sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
      `}>
        {children}
      </main>
    </div>
  );
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `isActiveNavItem()` logic | Test with different pathname/href combinations |
| Unit | `useViewport()` hook | Mock `window.innerWidth` in tests |
| Integration | Sidebar visibility on resize | Browser test or Playwright |
| Integration | Modal callbacks fire correctly | Unit test with mocked handlers |
| E2E | Full admin navigation flow | Playwright test |

## Migration / Rollback

No migration required. This change:
- Is purely frontend (no database changes)
- Adds new components without removing existing functionality
- Maintains backward compatibility for existing modals
- Sidebar behavior change is additive (desktop always visible)

Rollback: Revert changes to `AdminLayoutClient.tsx` and remove new modal files.

## Open Questions

- [ ] Should the floating toggle button be removed entirely on desktop, or just hidden? (Currently: hidden via conditional render)
- [ ] Should typography changes (`text-sm` on mobile) apply globally or only to specific components? (Spec says "all body text and UI elements")
- [ ] Are there any existing `alert()` or `confirm()` calls in other admin files that need migration? (Currently identified: `UsersAdminClient.tsx`)
