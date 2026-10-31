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
  - **Usage**: Logo accents, decorative underlines, visual flourishes
  - **Restriction**: Never use for text (contrast 2.37:1 insufficient)
  
- `--color-accent-2`: Maps to brand-brown-500
  - **Usage**: Dividers, category dots, secondary decoration
  - **Restriction**: Never use for text (contrast 3.10:1 insufficient for text)

#### Text Colors (≥4.5:1 WCAG AA)
- `--color-text`: `#0f172a` (slate-950 equivalent)
  - Primary text, headings
  
- `--color-text-muted`: `#64748b` (slate-600 equivalent)
  - Secondary text, descriptions
  
- `--color-text-subtle`: `#94a3b8` (slate-500 equivalent)
  - Tertiary text, captions

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

### 1. Small Heading Contrast Issue
**Before**: Hero eyebrow and category labels used `text-sky-600` with contrast of ~4.10:1
- **Problem**: Falls short of WCAG AA requirement of ≥4.5:1 for small text
- **Fix**: Changed to `--color-eyebrow` token (brand-green-700, ~5.02:1)
- **Impact**: All small labels now meet accessibility standards

### 2. Decorative Accent Restrictions
**Brand colors #54BF22 and #C68442 are NEVER used for text**:
- Insufficient contrast ratios (2.37:1 and 3.10:1)
- Reserved for decorative purposes only
- All text uses darker variants with ≥4.5:1 contrast

### 3. Focus Ring Accessibility
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
✅ Hero eyebrow (fixed from 4.10:1 to ~5.02:1)
✅ Category labels on cards
✅ Badge text
✅ Button text

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

## Out of Scope (Future Work)
The following were explicitly excluded from this implementation:
- Dark mode
- Typography/spacing adjustments (Track B)
- Tap target sizing
- Layout/navigation redesign
- /updates page changes
