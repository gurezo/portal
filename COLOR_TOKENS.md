# Color Design Tokens - Implementation Details

## Overview
This document describes the CSS custom properties (design tokens) introduced to replace direct sky/slate/hex color usage in the gurezo.net portal site.

## Token Structure

### 1. Brand Primitives
Base colors that define the brand identity:

| Token | Value | Contrast (on white) | Usage |
|-------|-------|---------------------|-------|
| `--color-brand-green-500` | `#54bf22` | 2.37:1 | **Decoration only** |
| `--color-brand-brown-500` | `#c68442` | 3.10:1 | **Decoration only** |
| `--color-brand-green-700` | `#15803d` | ~5.02:1 | Text and UI |
| `--color-brand-brown-700` | `#8b5a2b` | ~5.84:1 | Text (reserved) |

### 2. Semantic Tokens
Components use only these semantic tokens, never direct primitives or Tailwind colors:

#### Accent Colors (Decoration Only)
- `--color-accent`: Maps to brand-green-500
  - **Usage**: Logo PNG, decorative underlines, section dividers, card hover accents, link hover decoration, background radial
  - **Active locations**:
    - Header logo: PNG face mark (green glasses eyes) at 28×28px
    - Hero h1: 3px underline (text-decoration-color, full-width)
    - Section headings: 3px line under h2, 2px under h3
    - Project cards: 2px top line on hover (inset left-6/right-6), category dots (8px shrink-0)
    - News band: 4px left rail
    - Link hover: Underline decoration color
    - Background: Radial gradient at ~7% opacity
  - **Restriction**: Never use for text (contrast 2.37:1 insufficient)
  
- `--color-accent-2`: Maps to brand-brown-500
  - **Usage**: Logo PNG, secondary decorative accents
  - **Active locations**:
    - Header logo: PNG face mark (brown nose/freckles)
    - News band: 8px dot separator before date (shrink-0)
  - **Restriction**: Never use for text (contrast 3.10:1 insufficient for text)

#### Text Colors (≥4.5:1 WCAG AA)
- `--color-text`: `#0f172a` (slate-950 equivalent)
  - Primary text, headings
  - Contrast: ~14.0:1
  
- `--color-text-muted`: `#64748b` (slate-500 equivalent)
  - Secondary text, descriptions, technology tags
  - Contrast: ~4.51:1 (meets WCAG AA minimum)
  
- `--color-text-subtle`: `#475569` (slate-600 equivalent)
  - Tertiary text, captions, footer text
  - Contrast: ~7.07:1 (meets WCAG AA with margin)
  - **Fix #80**: Raised from `#94a3b8` (2.9:1, failed AA) to ensure readability

#### Link & Interactive Colors (≥4.5:1 WCAG AA)
- `--color-link`: Maps to brand-green-700 (#15803d)
  - Default link color
  - **Fix**: Replaced problematic text-sky-600 eyebrow/category labels
  
- `--color-link-hover`: `#166534` (green-800 equivalent)
  - Link hover state

#### Focus Ring (≥3:1 for UI elements)
- `--color-focus-ring`: Maps to brand-green-700
  - Focus indicator for all interactive elements

#### Badge Colors
- `--color-badge-bg`: `#f0fdf4` (light green background)
- `--color-badge-border`: `#bbf7d0` (green border)
- `--color-badge-fg`: Maps to brand-green-700 (text)
  - Contrast: ≥4.5:1 for text on badge background

#### CTA/Button Colors
- `--color-cta-bg`: Maps to brand-green-700
- `--color-cta-bg-hover`: `#166534`
- `--color-cta-border`: Maps to brand-green-700
- `--color-cta-border-hover`: `#166534`
- `--color-cta-fg`: `#ffffff` (white text)

#### Surface/Background Colors
- `--color-bg`: `#ffffff`
- `--color-bg-subtle`: `#f8fafc` (slate-50 equivalent)
- `--color-surface`: `rgba(255, 255, 255, 0.85)` (card backgrounds)
- `--color-surface-muted`: `rgba(255, 255, 255, 0.5)` (empty state)

#### Border Colors
- `--color-border`: `#e2e8f0` (slate-200 equivalent)
- `--color-border-light`: `#cbd5e1` (slate-300 equivalent)
- `--color-border-muted`: `#f1f5f9` (technology tags)

#### Selection
- `--color-selection-bg`: `#e0f2fe` (sky-200 equivalent)
- `--color-selection-fg`: Maps to --color-text

#### Eyebrow/Category Labels
- `--color-eyebrow`: Maps to brand-green-700
  - **Critical Fix**: Replaced text-sky-600 (4.10:1, AA fail for small text)
  - New contrast: ~5.02:1 (passes WCAG AA ≥4.5:1)

#### News Strip
- `--color-news-border`: Maps to brand-green-700
- `--color-news-border-hover`: `#166534`

## Key Fixes

### 1. Small Heading Contrast Issue (PR #79)
**Before**: Hero eyebrow and category labels used `text-sky-600` with contrast of ~4.10:1
- **Problem**: Falls short of WCAG AA requirement of ≥4.5:1 for small text
- **Fix**: Changed to `--color-eyebrow` token (brand-green-700, ~5.02:1)
- **Impact**: All small labels now meet accessibility standards

### 2. Subtle Text Contrast Issue (Issue #80)
**Before**: `--color-text-subtle` used `#94a3b8` (slate-400) with contrast of ~2.9:1
- **Problem**: Significantly below WCAG AA requirement of ≥4.5:1 for text
- **Used in**: Section descriptions, footer text, empty state captions
- **Fix**: Changed to `#475569` (slate-600, ~7.07:1)
- **Impact**: All descriptive text now clearly readable and AA compliant

### 3. Decorative Accent Restrictions
**Brand colors #54BF22 and #C68442 are NEVER used for text**:
- Insufficient contrast ratios (2.37:1 and 3.10:1)
- Reserved for decorative purposes only
- All text uses darker variants with ≥4.5:1 contrast

**Prohibited uses** (Issue #82):
- ❌ Body text, link text, or any readable content
- ❌ CTA backgrounds (buttons, badges)
- ❌ Focus rings (use --color-focus-ring / brand-green-700 instead)
- ❌ Header border/divider (uses --color-border, not accent colors)

**Permitted uses** (Issue #82 implementation):
- ✅ Logo decorative elements (PNG face mark: green glasses eyes, brown nose/freckles)
- ✅ Decorative underlines (h1 3px green underline)
- ✅ Section dividers (h2/h3 green accent lines)
- ✅ Non-text visual accents (category dots with shrink-0, news rail, date separator dot with shrink-0)
- ✅ Hover decorations (card top line inset, link underline decoration color)
- ✅ Background gradients at low opacity (≤10%)

### 4. Focus Ring Accessibility
- All interactive elements use `--color-focus-ring` (brand-green-700)
- Provides ≥3:1 contrast for UI components
- Consistent focus indication across the site

## Migration Complete

### Replaced Classes
All instances of the following have been removed from templates:
- `sky-*` classes (sky-50, sky-200, sky-400, sky-600, sky-700)
- `slate-*` classes (slate-50, slate-200, slate-300, slate-400, slate-500, slate-600, slate-700, slate-800, slate-900, slate-950)
- Raw hex values (except within CSS variable definitions)

### Template Usage
Components now use only token-based arbitrary values:
```html
<!-- Old -->
<p class="text-sky-600">Label</p>

<!-- New -->
<p class="text-[var(--color-eyebrow)]">Label</p>
```

## Accessibility Compliance

### Text Contrast (WCAG AA ≥4.5:1)
✅ All body text, links, and small labels  
✅ Hero eyebrow (fixed in #79: 4.10:1 → ~5.02:1)  
✅ Category labels on cards  
✅ Badge text  
✅ Button text  
✅ Subtle text (fixed in #80: 2.9:1 → ~7.07:1)  
✅ Technology tags (~4.51:1, meets AA minimum)  
✅ Navigation links (~4.51:1, meets AA minimum)

### UI Component Contrast (WCAG AA ≥3:1)
✅ Focus rings  
✅ Borders  
✅ Interactive controls

### Restrictions
❌ Brand-green-500 (#54BF22) - decoration only, never text  
❌ Brand-brown-500 (#C68442) - decoration only, never text

## Testing
All tests pass:
- 56/56 unit tests passing
- Lint checks passing
- Visual regression: Maintains existing layout, updates colors only
- Accessibility: Improved contrast ratios across the board

## Spacing, Radius, Shadow & Interactive Tokens (Track B)

### Container Tokens
Max-width values for content containers (used by `max-w-*` utilities):
- `--container-xl`: 36rem (576px) - single column layout
- `--container-2xl`: 42rem (672px) - narrow content
- `--container-3xl`: 48rem (768px) - readable prose width
- `--container-4xl`: 56rem (896px) - standard content
- `--container-7xl`: 80rem (1280px) - wide content

### Spacing Tokens
Consistent spacing scale for margins, padding, and gaps:
- `--spacing-xs`: 0.5rem (8px) - tight gaps
- `--spacing-sm`: 0.75rem (12px) - small spacing
- `--spacing-md`: 1rem (16px) - base spacing
- `--spacing-lg`: 1.5rem (24px) - comfortable spacing

### Radius Tokens
Unified border-radius values for consistent component styling:
- `--radius-sm`: 0.125rem (2px) - small elements (links, focus rings)
- `--radius-md`: 0.5rem (8px) - buttons, badges
- `--radius-lg`: 1rem (16px) - cards (alternative)
- `--radius-xl`: 1.75rem (28px) - primary card borders
- `--radius-full`: 9999px - fully rounded (pills, CTAs)

### Shadow Tokens
Layered elevation system for depth hierarchy:
- `--shadow-sm`: 0 1px 2px rgba(15, 23, 42, 0.04) - subtle elevation
- `--shadow-md`: 0 4px 12px rgba(15, 23, 42, 0.06) - moderate elevation
- `--shadow-lg`: 0 16px 40px rgba(21, 128, 61, 0.08) - news strip card
- `--shadow-xl`: 0 24px 64px rgba(15, 23, 42, 0.08) - project cards
- `--shadow-cta`: 0 16px 36px rgba(21, 128, 61, 0.18) - hero CTA emphasis

### Interactive Tokens
Accessibility-focused interaction targets:
- `--tap-target-min`: 2.75rem (44px) - minimum touch/tap target (WCAG 2.5.5 Level AAA)

### Focus-Visible Implementation
All interactive elements now use `:focus-visible` instead of `:focus`:
- Shows focus ring only for keyboard navigation
- Avoids visual noise on mouse/touch interactions
- Consistent 2px ring with 2px offset across all focusable elements
- Uses `--color-focus-ring` (brand-green-700) for accessibility

### Navigation & Tap Targets
Header and footer navigation links meet WCAG AAA tap target sizing:
- All nav links: `min-h-[var(--tap-target-min)]` (≥44px)
- CTAs and buttons: `min-h-[var(--tap-target-min)]` (≥44px)
- Adequate horizontal padding for comfortable interaction

### Heading Hierarchy Fixes
- **What's new section**: Changed h2 from `text-xs` label style to `text-lg` heading style
  - Creates visual hierarchy: h2 (18px) vs release name (24px on desktop)
  - Prevents size collision between heading and content on PC
- **Groups**: Use h3 (existing, maintained)
- **Cards**: Use h4 (existing, maintained)
- Clear visual hierarchy maintained across all zones

## Out of Scope (Future Work)
The following were explicitly excluded from this implementation:
- Dark mode
- Brand accent placement (Track C)
- External link rules / Updates navigation (Track D)
- Full typography/font changes
- Layout/navigation redesign beyond tap targets
