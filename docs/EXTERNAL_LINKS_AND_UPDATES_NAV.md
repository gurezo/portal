# External Links and Updates Nav Enablement Design

## Document Purpose

This document defines the design rules for external links and the enablement conditions for the Updates navigation item, addressing issue [#83](https://github.com/gurezo/portal/issues/83).

## Production Status Check (Recorded 2026-10-31)

**Current state of https://gurezo.net:**

- `/updates` route: **404 (Not Found)** - Route does not exist
- `/feed.xml`: **404 (Not Found)** - RSS feed not available
- `/rss.xml`: **404 (Not Found)** - RSS feed not available

**Conclusion:** Stage ⑤ (Updates page + RSS implementation) is **NOT complete**. Updates nav must remain hidden.

---

## External Link Rules

All external links across the site (navigation, footer, cards, buttons) must follow these unified rules:

### 1. Target and Security Attributes

All external links MUST include:

```html
target="_blank"
rel="noopener noreferrer"
```

**Rationale:**
- `target="_blank"`: Opens link in new tab (expected behavior for external resources)
- `rel="noopener"`: Security - prevents `window.opener` access from target page
- `rel="noreferrer"`: Privacy - prevents referrer information leakage

### 2. Visual Affordance (External Link Indicator)

**Navigation links** (header nav) to external sites MUST include the ↗ character with text presentation variant selector:

```html
GitHub<span aria-hidden="true" class="ml-0.5">↗&#xFE0E;</span>
```

**Implementation notes:**
- Use Unicode `U+2197` (↗) NORTH EAST ARROW
- Append `U+FE0E` text presentation variant selector to prevent emoji rendering
- Wrap in `<span aria-hidden="true">` since screen readers announce "opens in new tab" via aria-label
- Apply `ml-0.5` spacing between text and arrow

**Footer and card links** MAY omit the visual arrow indicator but MUST still include `target` and `rel` attributes.

### 3. Accessibility (Screen Reader Labels)

All external links MUST provide clear context to screen reader users. Choose ONE approach:

**Option A - Explicit aria-label (Recommended for nav):**
```html
<a href="https://github.com/gurezo"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="GitHub (opens in a new tab)">
  GitHub<span aria-hidden="true">↗&#xFE0E;</span>
</a>
```

**Option B - Visible text suffix (Acceptable for cards/buttons):**
```html
<a href="..." target="_blank" rel="noopener noreferrer">
  Documentation (opens in new tab)
</a>
```

**Never** rely solely on visual indicators without screen-reader-accessible text.

### 4. Keyboard Accessibility

All links MUST be keyboard-accessible with visible focus indicators:

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-[var(--color-focus-ring)]
focus-visible:ring-offset-2
```

**Testing:** Verify that Tab, Shift+Tab, and Enter work for all external links.

### 5. Minimum Touch Target Size

All interactive elements (including external links) MUST meet minimum touch target requirements:

```css
min-h-[var(--tap-target-min)]
```

Currently defined as 44px (per WCAG 2.5.5 Target Size Level AAA).

---

## Updates Navigation Enablement State Design

### Stage ⑤ Completion Definition

The Updates navigation item may only be shown when **ALL** of the following conditions are met:

1. **Route exists:** `/updates` route implemented in `app.routes.ts`
2. **Content available:** Updates page component renders real content (not 404)
3. **RSS feed available:** At least one RSS endpoint (`/feed.xml` or `/rss.xml`) returns HTTP 200 with valid XML
4. **Feature flag enabled:** `ENABLE_UPDATES_NAV` configuration flag set to `true`

### Current Implementation Status

| Requirement | Status | Notes |
|------------|--------|-------|
| `/updates` route | ❌ Not implemented | Returns 404 on production |
| Updates page component | ❌ Not implemented | No route handler exists |
| RSS feed endpoint | ❌ Not implemented | Both `/feed.xml` and `/rss.xml` return 404 |
| Feature flag | ✅ Implemented | Defaults to `false` (see `apps/site/src/app/app.config.ts`) |

**Decision:** Updates nav MUST remain hidden until stage ⑤ is complete.

### Feature Flag Configuration

Location: `apps/site/src/app/app.config.ts`

```typescript
export const FEATURE_FLAGS = {
  /**
   * Show Updates navigation item.
   * Only enable when stage ⑤ is complete:
   * - /updates route exists
   * - RSS feed is available
   * - Content is ready for public access
   */
  ENABLE_UPDATES_NAV: false,
} as const;
```

### Navigation Structure

**Current (stage < ⑤):**
```
Logo | Projects | GitHub↗
```

**After stage ⑤ complete:**
```
Logo | Projects | Updates | GitHub↗
```

**Implementation:** The header navigation in `apps/site/src/app/app.html` uses Angular `@if` directive to conditionally render the Updates link based on `FEATURE_FLAGS.ENABLE_UPDATES_NAV`.

### Early Enablement Warning

**DO NOT** enable the Updates nav before stage ⑤ is complete:
- Creates broken user experience (404 errors)
- Violates staged disclosure UX principle
- Damages user trust and site quality perception

When ready to enable:
1. Verify `/updates` returns 200 with content
2. Verify RSS feed is accessible
3. Test keyboard and screen reader navigation
4. Set `ENABLE_UPDATES_NAV: true`
5. Deploy and verify on production

---

## What's New Band (News Strip) - Do Not Break

The What's New Band (rendered by `<app-whats-new-band />`) has **independent** behavior from Updates nav:

### Source and Behavior (Must Be Preserved)

- **Source:** GitHub Releases of repositories registered in PROJECTS (latest release across all registered repos; hide when older than 60 days from today)
- **Display rule:** Show latest release
- **Hide rule:** Hide band when release is older than 60 days from today
- **Location:** Below hero, above Projects section

### Implementation

Component: `apps/site/src/app/updates/whats-new-band/whats-new-band.component.ts`

Logic: Uses `github-releases.ts` service to fetch latest release, computes age, conditionally renders.

### Testing Requirement

Any changes related to this design document MUST verify that What's New Band:
- Still fetches from GitHub Releases
- Still calculates 60-day threshold correctly
- Still hides when appropriate
- Renders unchanged in appearance

**Why this matters:** The band is valuable social proof and keeps users informed. Breaking it would remove the only "updates" feature currently working on production.

---

## Acceptance Checklist

- [x] External link rules documented (target, rel, arrow, aria, keyboard, touch target)
- [x] Updates nav stage ⑤ definition documented (4 requirements)
- [x] Production `/updates` and RSS status checked and recorded (all 404)
- [x] Clear decision: Updates nav OFF until stage ⑤ complete
- [x] Feature flag implemented and defaulting to OFF
- [x] What's New Band preservation requirement documented

---

## References

- **Issue:** [#83 - External link rules and Updates nav enablement state design](https://github.com/gurezo/portal/issues/83)
- **Related PR:** [#86 - Plan A header implementation](https://github.com/gurezo/portal/pull/86) (merged to main)
- **WCAG Guidelines:**
  - [2.5.5 Target Size (AAA)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
  - [2.4.4 Link Purpose (In Context) (AA)](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html)
- **Security:** [About rel=noopener](https://mathiasbynens.github.io/rel-noopener/)

---

**Document Status:** Initial design (2026-10-31)  
**Next Review:** When stage ⑤ implementation begins
