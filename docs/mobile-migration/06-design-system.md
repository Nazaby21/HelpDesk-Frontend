# 06. UI & Design System Specification

## 1. Design Tokens & Theme Foundations

Tokens are derived directly from [tailwind.config.ts](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/tailwind.config.ts) and [src/css/style.css](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/css/style.css).

### 1.1 Color Palette

#### Primary & Brand Colors
| Token Name | Hex Code | Flutter `Color` Definition | Role in UI |
| :--- | :--- | :--- | :--- |
| `primary` | `#5750F1` | `const Color(0xFF5750F1)` | Brand indigo; primary buttons, active links, chart series 1. |
| `primary-hover`| `#4338CA` | `const Color(0xFF4338CA)` | Interactive pressed states. |
| `chart-cyan` | `#0ABEF9` | `const Color(0xFF0ABEF9)` | Secondary line in ticket analytics area chart. |

#### Neutral & Background Palette (Light & Dark Mode)
| Token Name | Light Hex | Dark Hex | Role / Application |
| :--- | :--- | :--- | :--- |
| **Scaffold Background** | `#F3F4F6` (`gray-2`) | `#020D1A` | Main page body background. |
| **Card / Surface** | `#FFFFFF` (`white`) | `#122031` (`gray-dark`) | Card containers, modal sheets, table cards. |
| **Input / Secondary** | `#FFFFFF` | `#1F2A37` (`dark-2`) | Text input fills, inner nested containers. |
| **Borders & Dividers** | `#E6EBF1` (`stroke`) | `#27303E` (`stroke-dark`)| Hairline dividers, card outlines, table rows. |
| **Text Primary** | `#111928` (`dark`) | `#FFFFFF` | Headings, primary labels, table titles. |
| **Text Secondary** | `#4B5563` (`dark-4`) | `#9CA3AF` (`dark-6`) | Subtitles, input placeholders, metadata timestamps. |
| **Text Muted** | `#9CA3AF` (`dark-6`) | `#6B7280` (`dark-5`) | Inactive labels, disabled hints. |

#### Semantic & Feedback Colors
| Semantic Role | Main Hex | Light Background Hex | Used In |
| :--- | :--- | :--- | :--- |
| **Success** | `#22AD5C` | `#E9FBF0` (`green-light-7`) | "Completed" status badge, check icons, success toasts. |
| **Warning / Pending** | `#F59E0B` | `#FFFBEB` (`yellow-light-4`)| "Pending" / "Low" priority badge, warning alerts. |
| **Error / Urgent** | `#F23030` | `#FEF3F3` (`red-light-6`) | "High" priority badge, delete user action, error toast. |
| **Info / In Progress** | `#3C50E0` | `#E1E8FF` (`blue-light-5`) | "In Progress" badge, department hints, info icons. |
| **Orange Accent** | `#F59460` | `#FFF7ED` | "Medium" priority badge. |

---

### 1.2 Typography & Font Family

- **Font Family**: **Satoshi** (Geometric Grotesk by Indian Type Foundry).
  Font files located in [src/fonts/](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/fonts/).
- **Font Weights Used**:
  - `Light` (300)
  - `Regular` (400)
  - `Medium` (500)
  - `Bold` (700)
  - `Black` (900)

#### Web Type Scale to Flutter `TextTheme` Mapping

| Tailwind Class | Font Size / Line Height | Flutter `TextStyle` Equivalent | Used For |
| :--- | :--- | :--- | :--- |
| `text-heading-5` | 28px / 40px | `headlineMedium`: 28sp, w700 | Screen titles, Welcome heading. |
| `text-heading-6` | 24px / 30px | `headlineSmall`: 24sp, w700 | Card titles, Page headers. |
| `text-body-2xlg` | 22px / 28px | `titleLarge`: 22sp, w600 | Overview section headers. |
| `text-base` | 16px / 24px | `bodyLarge`: 16sp, w500 | Form labels, card item titles. |
| `text-sm` / `body-sm` | 14px / 22px | `bodyMedium`: 14sp, w400 | Table cells, descriptions, chat text. |
| `text-xs` / `body-xs` | 12px / 20px | `labelSmall`: 12sp, w500 | Badges, metadata timestamps, hints. |

---

### 1.3 Elevation, Shadows & Corner Radiuses

- **Border Radiuses**:
  - `rounded-lg`: 8.0 dp (Buttons, Text Inputs, Badges).
  - `rounded-xl`: 12.0 dp (Cards, Toast Popups, Dialogs).
  - `rounded-2xl`: 16.0 dp (Incident Catalog Cards, Sign-in Card).
  - `rounded-full`: 9999.0 dp (Pill badges, Avatar circles).
- **Elevation / Shadows**:
  - `shadow-1`: `BoxShadow(color: Color(0x1F545776), blurRadius: 2, offset: Offset(0, 1))` (Standard Cards).
  - `shadow-md`: `BoxShadow(color: Color(0x14000000), blurRadius: 6, offset: Offset(0, 4))` (Floating Menus / Toasts).

---

## 2. Reusable Component Inventory

### 2.1 Button (`src/components/ui/Button.tsx`)
- **Props**: `variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`, `disabled`, `children`.
- **Variants**:
  - `primary`: Black background (`#000000`), white text. (Or Primary Indigo `#5750F1` in header/accent).
  - `secondary`: Light gray (`#F3F4F6`), dark text.
  - `outline`: Border `#D1D5DB`, white background, text `#374151`.
  - `danger`: Red `#DC2626`, white text.
  - `ghost`: Transparent background, hover tint.
- **Sizes**:
  - `sm`: Height 32px, text 12px, px 12px.
  - `md`: Height 40px, text 14px, px 16px.
  - `lg`: Height 48px, text 16px, px 24px.
  - `icon`: 36x36px square.

### 2.2 Badge (`src/components/ui/Badge.tsx`)
- **Props**: `variant`, `children`.
- **Variants**:
  - `success`: Light green background `#E9FBF0`, dark green text `#22AD5C`.
  - `warning`: Light yellow background `#FFFBEB`, amber text `#F59E0B`.
  - `error`: Light red background `#FEF3F3`, red text `#F23030`.
  - `info`: Light blue background `#E1E8FF`, blue text `#3C50E0`.
  - `orange`: Light orange background `#FFF7ED`, orange text `#F59460`.
  - `default`: Light gray background `#F3F4F6`, gray text `#374151`.

### 2.3 Input (`src/components/ui/Input.tsx`)
- **Props**: `label`, `error`, `leftIcon`, `rightIcon`, `hint`, `required`.
- **Visuals**: 10px rounded corners, 1px border `#D1D5DB`, focus ring with brand color, error state turns border `#EF4444` with red helper text.

### 2.4 Select (`src/components/ui/Select.tsx`)
- **Props**: `label`, `options: { label, value }[]`, `error`, `hint`.
- **Visuals**: Matches Input styling with dropdown arrow indicator.

### 2.5 Modal (`src/components/ui/Modal.tsx`)
- **Props**: `isOpen`, `onClose`, `title`, `description`, `maxWidth`, `children`.
- **Visuals**: Dark 50% opacity backdrop, centered animated dialog box with rounded-xl corners, header with title and close X button.

### 2.6 Toast (`src/components/ui/Toast.tsx`)
- **Props**: `message`, `type: 'success' | 'error' | 'info'`, `isOpen`, `onClose`, `duration: 4000`.
- **Visuals**: Floating pill at bottom-right, dark `#111827` background, white text, colored status icon (`CheckCircle2`, `AlertCircle`, `Info`), optional action button, close X.

### 2.7 ActionMenu (`src/components/ui/ActionMenu.tsx`)
- **Props**: `button: ReactNode`, `children: (close) => ReactNode`.
- **Visuals**: Triggered by three-dots `MoreHorizontal` button. Opens floating popover menu with smooth fade/zoom animation.

---

## 3. Web vs Mobile Pattern Migration Matrix

| Component | Web Implementation Pattern | Flutter Mobile Replacement Pattern |
| :--- | :--- | :--- |
| **All Tickets / Users Table** | Multi-column HTML `<table>` with horizontal overflow scroll and pagination buttons. | **Card List (`ListView.builder`)** with `Dismissible` / `flutter_slidable` quick actions, pull-to-refresh, and infinite scroll pagination. |
| **Action Dropdown Menu** | Popover floating menu attached to row coordinates (`Radix Dropdown`). | **Modal Action Sheet (`CupertinoActionSheet`)** or **Modal Bottom Sheet**. |
| **Create Modals** | Desktop centered popups (`Radix Dialog`). | **Scrollable Draggable Bottom Sheet (`showModalBottomSheet` with `isScrollControlled: true`)**. |
| **Hover Tooltips** | Mouse hover popup revealing absolute dates. | **Explicit Secondary Subtitle Text** (e.g. "3h ago • Oct 22, 2026"). |
| **File / Screenshot Box** | Desktop drag-and-drop HTML file input. | **Bottom Sheet Picker** offering "Take Photo" (Camera) and "Choose from Gallery" using `image_picker`. |
| **Tabs / Category Filter** | Horizontal category grid or side category menu. | **Horizontal Scrollable Chip List / FilterChips** at the top of the ticket list. |
| **Chat Input** | Fixed card footer with standard input and absolute button. | **Sticky Bottom Bar** with `SafeArea`, auto-adjusting padding for on-screen keyboard (`MediaQuery.viewInsetsOf(context).bottom`). |
