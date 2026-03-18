# Tasks: Admin Panel Frontend Improvements

## Phase 1: Create Reusable Modal Components

- [x] 1.1 Create `src/components/ui/alert-modal.tsx` — Reusable modal component with single "Cerrar" button
  - Props: `isOpen`, `title`, `message`, `onClose`
  - Style: Fixed overlay with backdrop blur, centered white card with shadow
  - Use existing `Button` component from `./button`
  - Return `null` when `isOpen` is false

- [x] 1.2 Create `src/components/ui/confirm-modal.tsx` — Reusable modal with confirm/cancel buttons
  - Props: `isOpen`, `title`, `message`, `onConfirm`, `onCancel`, `confirmLabel?`, `cancelLabel?`
  - Default labels: "Confirmar" / "Cancelar"
  - Style: Fixed overlay with backdrop blur, centered white card with shadow
  - Use existing `Button` component with `variant="outline"` for cancel and `variant="destructive"` for confirm

## Phase 2: Modify AdminLayoutClient.tsx

- [x] 2.1 Add viewport detection hook (`useViewport`)
  - Create `useState<boolean>(false)` for `isDesktop`
  - Add `useEffect` to listen to `window.resize` and set `isDesktop = window.innerWidth >= 1024`
  - Cleanup listener on unmount

- [x] 2.2 Update sidebar visibility logic
  - Always show sidebar on desktop (≥1024px): set `sidebarOpen(true)` when `isDesktop` is true
  - On mobile/tablet: use localStorage persistence (existing behavior)
  - Hide toggle button on desktop (conditionally render only when `!isDesktop`)

- [x] 2.3 Add active navigation highlighting using `usePathname()`
  - Import `usePathname` from `next/navigation`
  - Create helper: `isActiveNavItem(href: string) => pathname.startsWith(href)`
  - Apply conditional styling: `bg-slate-800 text-white` for active, `text-slate-400 hover:bg-slate-800 hover:text-white` for inactive

- [x] 2.4 Add auto-close sidebar on mobile nav click
  - Wrap Link with click handler: `onClick={(e) => handleNavClick(e, item.href)}`
  - Implement `handleNavClick`: if not desktop, use `setTimeout` with 120ms delay before closing sidebar
  - Update localStorage to persist closed state

- [x] 2.5 Increase font size on mobile (<768px)
  - Add conditional class: base font `text-sm`, override to `text-base` when `!isDesktop`
  - Apply to nav items and main content wrapper

## Phase 3: Replace Browser Alerts in Login Page

- [x] 3.1 Read `src/app/(auth)/login/page.tsx` to identify all `alert()` calls
- [x] 3.2 Replace each `alert(message)` with AlertModal component
  - Add `useState` for modal visibility: `[alertModalOpen, setAlertModalOpen]`
  - Add state for alert content: `[alertTitle, setAlertTitle]` and `[alertMessage, setAlertMessage]`
  - Create handler to open modal: `showAlert(title, message)`
  - Replace `alert()` calls with `showAlert(title, message)`
  - Render `<AlertModal isOpen={alertModalOpen} title={alertTitle} message={alertMessage} onClose={() => setAlertModalOpen(false)} />`

## Phase 4: Replace Browser Alerts in Property Forms

- [x] 4.1 Read `src/app/(admin)/properties/new/page.tsx` (PropertyForm) to identify `alert()` calls
- [x] 4.2 Replace alerts with AlertModal in PropertyForm.tsx
  - Add state: `alertModalOpen`, `alertTitle`, `alertMessage`
  - Create `showAlert()` helper function
  - Replace all `alert()` calls with `showAlert()`
  - Render AlertModal component at end of form

- [x] 4.3 Read `src/app/(admin)/properties/[id]/edit/page.tsx` (EditPropertyForm) to identify `alert()` calls
- [x] 4.4 Replace alerts with AlertModal in EditPropertyForm.tsx
  - Same pattern as 4.2

## Phase 5: Replace Browser Alerts in CloudinaryUploader

- [x] 5.1 Read `src/components/cloudinary-uploader.tsx` to identify `alert()` calls
- [x] 5.2 Replace alerts with AlertModal in CloudinaryUploader.tsx
  - Add state: `alertModalOpen`, `alertTitle`, `alertMessage`
  - Create `showAlert()` helper function
  - Replace all `alert()` calls with `showAlert()`
  - Render AlertModal component at end of uploader

## Phase 6: Replace Confirm in Logout Button

- [x] 6.1 Read `src/components/admin/logout-btn.tsx` to identify `confirm()` call
- [x] 6.2 Replace `confirm(message)` with ConfirmModal
  - Add state: `confirmModalOpen`, `confirmTitle`, `confirmMessage`
  - Create handler to open confirm modal
  - Replace `if (confirm(message))` logic with modal callback `onConfirm`
  - Render `<ConfirmModal isOpen={confirmModalOpen} title={confirmTitle} message={confirmMessage} onConfirm={handleLogout} onCancel={() => setConfirmModalOpen(false)} />`
  - Labels: "Cerrar sesión" for confirm, "Cancelar" for cancel

## Phase 7: Verification

- [x] 7.1 Run `npm run build` to verify no type errors
- [x] 7.2 Run `npm run lint` to verify code quality
- [ ] 7.3 Test responsive behavior: resize browser to verify sidebar behavior at 1024px breakpoint
- [ ] 7.4 Test modal functionality: verify all AlertModals and ConfirmModal render and function correctly

(End of file - total 90 lines)
