---
name: Academic Administrative Modern
colors:
  surface: '#f6f9ff'
  surface-dim: '#d3dbe4'
  surface-bright: '#f6f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4fe'
  surface-container: '#e7eff8'
  surface-container-high: '#e1e9f2'
  surface-container-highest: '#dbe3ec'
  on-surface: '#151c23'
  on-surface-variant: '#43474c'
  inverse-surface: '#293138'
  inverse-on-surface: '#eaf2fb'
  outline: '#74777d'
  outline-variant: '#c3c7cd'
  surface-tint: '#4b6077'
  primary: '#082135'
  on-primary: '#ffffff'
  primary-container: '#20364b'
  on-primary-container: '#899fb8'
  inverse-primary: '#b2c9e3'
  secondary: '#3b6751'
  on-secondary: '#ffffff'
  secondary-container: '#baebcf'
  on-secondary-container: '#3f6b55'
  tertiary: '#19211d'
  on-tertiary: '#ffffff'
  tertiary-container: '#2e3631'
  on-tertiary-container: '#979f99'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#b2c9e3'
  on-primary-fixed: '#041d31'
  on-primary-fixed-variant: '#33495e'
  secondary-fixed: '#bdedd2'
  secondary-fixed-dim: '#a2d1b6'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#234f3b'
  tertiary-fixed: '#dce4de'
  tertiary-fixed-dim: '#c0c8c2'
  on-tertiary-fixed: '#161d19'
  on-tertiary-fixed-variant: '#414944'
  background: '#f6f9ff'
  on-background: '#151c23'
  surface-variant: '#dbe3ec'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Public Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Public Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Public Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system defines a centralized entry examination and university admissions platform. The brand identity balances institutional authority with modern software craftsmanship—drawing direct cues from Linear's density, Notion's structural clarity, and Stripe's precise typographic hierarchy. It serves a multi-stakeholder ecosystem: secondary school applicants seeking transparent outcomes, proctors executing high-stakes testing, university admissions deans evaluating merit lists, and central ministry overseers auditing seat allocations.

The aesthetic direction is **Corporate / Modern** anchored in academic permanence. Visual noise is aggressively eliminated in favor of information density, predictable visual scaffolding, and meticulous data clarity. Trust is cultivated through structural precision: razor-thin dividers, disciplined spatial grids, quiet tonal backgrounds, and explicit audit-trail identifiers. The system deliberately rejects frivolous animation, high-saturation gradients, and trendy glassmorphism, instilling immediate calm and institutional confidence across high-stress admission cycles.

## Colors

The palette is tuned for long sessions of administrative scrutiny, data verification, and student application flows. 

- **Primary Canvas & Surfaces:** The default app background uses Warm Off-White (`#F7F7F3`), reducing the eye fatigue of stark white while delineating workspace boundaries. Content containers, data sheets, and application modals rest on Pure White (`#FFFFFF`).
- **Primary Navy (`#20364B`) & Dark Navy (`#263746`):** Establish institutional presence across primary navigation rails, top headers, and high-level typographic anchors.
- **Muted Forest Green (`#3F6B55`):** The primary operational color, reserved for definitive forward progress (submit admission form, confirm seat allotment, download admit card) and active route indications.
- **Soft Sage (`#E7EFE8`):** Serves as the base for interactive selection states, badge fills, and contextual success wrappers.
- **Divider & Border Linearity (`#E5E7E4`):** A hairline boundary rule that provides crisp separation without boxing users into oppressive frames.
- **System Feedback & Verification:** Functional states must remain unmistakable: Success (`#367451`), Warning (`#A87327`), Error (`#B54D47`), Info (`#476C91`), and Neutral (`#737B83`). Always pair status colors with an accompanying background tint (12% opacity) and an explicit textual status label.

## Typography

Typography relies on `Public Sans` for standard interfaces and `JetBrains Mono` for structured identifiers (candidate roll numbers, seat matrix codes, challan payment references, and test session IDs).

- **Headings:** Titles scale down deliberately to preserve administrative dashboard space. Page titles never exceed 28px on desktop and 24px on mobile viewports.
- **Body & Data:** Default reading size is calibrated at 14px (`#374151`) with secondary data labels at 13px (`#737B83`). High tabular readability takes precedence over dramatic contrast.
- **Identifier Handling:** All system codes (e.g., `CA-2027-00124`, `TEST-CTR-KHI-04`) must render in `JetBrains Mono` (`code-sm`) to enable instantaneous visual recognition and prevent character ambiguity during verification procedures.

## Layout & Spacing

The structural layout uses an **8-point spatial model** mapped to an institutional application framework:

- **Desktop Frame (≥1200px):** Fixed 248px left sidebar housing the administrative or applicant navigation hierarchy, anchored to a 64px persistent top utilities bar. The inner work canvas adheres to a 12-column fluid grid system bounded by `margin-desktop` (2rem / 32px) and `gutter-desktop` (1.5rem / 24px).
- **Tablet Frame (768px - 1199px):** Sidebar collapses to an icon rail (64px) or slides out via drawer. The grid drops to 8 columns with 1.5rem margins and 1rem gutters.
- **Mobile Frame (<768px):** Navigation moves inside an off-canvas slideover or bottom sheet. Work view switches to a single-column stack with 1rem margin and 1rem gutter.
- **Table Density Standards:** Academic score rosters, candidate verifications, and institution quota sheets require tight, scannable table layouts. Standard row height is fixed strictly between 48px and 56px to ensure high vertical information yield without compromising touch target reliability.

## Elevation & Depth

Visual hierarchy is maintained through **tonal layering and low-contrast hairline outlines** (`#E5E7E4`) rather than multi-layered drop shadows.

- **Level 0 (App Shell Canvas):** Warm Off-White (`#F7F7F3`). Flat, non-interactive foundation.
- **Level 1 (Card & Content Panels):** Pure White (`#FFFFFF`) framed by a 1px solid `#E5E7E4` border. No drop shadow is applied in default states.
- **Level 2 (Hover & Active Surfaces):** White surfaces receive a delicate, ambient tint shadow: `0 1px 3px 0 rgba(32, 54, 75, 0.05), 0 1px 2px -1px rgba(32, 54, 75, 0.03)`.
- **Level 3 (Dropdown Menus & Popovers):** Pure White with hairline border `#E5E7E4` and a directional shadow: `0 4px 12px -2px rgba(32, 54, 75, 0.08), 0 2px 6px -2px rgba(32, 54, 75, 0.04)`.
- **Level 4 (Verification & Confirmation Modals):** Pure White with a 1px border and deep scrim: backdrop `#20364B` at 40% opacity with an ambient modal drop: `0 20px 25px -5px rgba(32, 54, 75, 0.12), 0 8px 10px -6px rgba(32, 54, 75, 0.08)`.

## Shapes

The design uses balanced, modern administrative corners:
- Standard containers, form fields, filter bars, and cards leverage **8px (`rounded-md` equivalent)** geometry.
- Nested secondary items (inner table pills, inline search inputs) scale smoothly to **6px**.
- Modals, large panels, and grouped metric cards utilize **10px to 12px** (`rounded-lg` to `rounded-xl`).
- Status pills, notification counters, and identity tags employ full pill styling (`9999px`) to create an immediate visual distinction between actionable structural cards and passive metadata.

## Components

### Buttons
- **Primary:** Background `#3F6B55`, text `#FFFFFF`, border none, 8px radius, 36px height (desktop), font weight 500. On hover: darken to `#345946`. Active: `#2B4A3A`. Focus: 2px offset ring `#3F6B55`.
- **Secondary / Institutional:** Background `#FFFFFF`, text `#20364B`, border 1px solid `#E5E7E4`, 8px radius. On hover: background `#F7F7F3`, border `#D6D9D4`.
- **Destructive:** Background `#FFFFFF`, text `#B54D47`, border 1px solid `#F3D5D3`. On hover: background `#FDF4F4`.

### Form Fields & Inputs
- Standard height: 38px. Background `#FFFFFF`, border 1px solid `#E5E7E4`, text `#374151`, placeholder `#737B83`.
- Active/Focus: Border `#3F6B55`, 1px outline ring `#E7EFE8`.
- In error state: Border `#B54D47` with helper text rendered in 12px `#B54D47`.

### Status Badges & Pills
- Pill-shaped (`roundedness: 9999px`), 22px height, 8px horizontal padding, 11px font size with uppercase letter-spacing (0.04em).
- **Enrolled / Verified / Eligible:** Background `#E7EFE8`, text `#367451`.
- **Pending Review / Awaiting Payment:** Background `#FBF3E8`, text `#A87327`.
- **Rejected / Quota Exceeded:** Background `#FDF1F0`, text `#B54D47`.
- **Draft / Inactive:** Background `#EEF0EE`, text `#737B83`.

### Data Tables
- Header row: Height 40px, background `#F7F7F3`, bottom border 1px solid `#E5E7E4`. Header text: 12px, font-weight 600, uppercase, color `#737B83`.
- Body rows: Height 52px, background `#FFFFFF`, bottom border 1px solid `#F0F2EE`. Hover state: background `#FAFBF9`.
- Alphanumeric Roll Number columns: Displayed using `JetBrains Mono` (`code-sm`).

### Checkboxes & Radio Elements
- Size: 16x16px. Border: 1.5px solid `#D1D5DB`. Background: `#FFFFFF`.
- Selected: Background `#3F6B55`, border `#3F6B55`, white checkmark or center pip. Focus ring: `#E7EFE8`.

### Candidate ID Cards & Quota Tiles
- Background `#FFFFFF`, border 1px solid `#E5E7E4`, border-radius 8px, padding 16px.
- Metric values display prominently in 20px `#20364B` with 12px `#737B83` uppercase context labels underneath.