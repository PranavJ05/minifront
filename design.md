# Design Guidelines

**Style:** Modern shadcn/ui (`base-vega`), Vercel-inspired monochrome.
**Stack:** Tailwind v4 + CSS variable tokens (OKLCH) + Figtree font.

> This document is for both agents and humans. It defines the "feel" — the specific Tailwind patterns to use and the rules to follow. The shadcn components in `components/ui/` are self-documenting; link to [shadcn docs](https://ui.shadcn.com/docs/components) for API details.

---

## 1. Golden Rules

| Rule | ✅ Do | ❌ Don't |
|------|-------|----------|
| **Use semantic tokens** | `bg-background`, `text-foreground`, `bg-card`, `border-border` | `bg-white`, `text-black`, `bg-gray-100`, `bg-blue-600` |
| **Use `cn()`** | `className={cn("base", className)}` | Manual class strings without merge |
| **Use `data-slot`** | `data-slot="card"`, `data-slot="button"` | Missing data attributes |
| **Use shadcn primitives** | `<Button>`, `<Card>`, `<Input>`, `<Dialog>` | Hand-rolling buttons, cards, modals |
| **Dark mode safety** | Let CSS variables handle it | Hardcoded light-only colors |
| **Cursor on interactive** | `cursor-pointer` on clickable elements | Default cursor on buttons/triggers |

---

## 2. The "Feel" — Key Class Patterns

These are the exact Tailwind combos found in the modern pages (`events/*`, `opportunities/`, `alumni/`). Use them to maintain visual consistency.

### Page Level

```
w-full px-4 sm:px-6 pb-6 space-y-6   // Standard page content wrapper
max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6   // Constrained page
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8                    // Wider constrained
```

### Sticky Section Header (used on events, opportunities pages)

```
sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4
border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6
```

Contains:
- `h1`: `text-xl font-semibold tracking-tight text-foreground`
- `p` subtitle: `text-xs text-muted-foreground`
- Action button: `<Button><Plus className="h-4 w-4" /> Create Event</Button>`

### Navbar

```
sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md text-foreground
```
Inner: `px-4 sm:px-6`, `flex items-center justify-between h-14`

### Cards (primary surface)

```
bg-card text-card-foreground rounded-2xl border border-border shadow-sm
hover:shadow-md transition-shadow duration-200   // optional hover lift
```

The actual shadcn `<Card>` gives: `rounded-xl bg-card shadow-xs ring-1 ring-foreground/10`. Both are valid; use `<Card>` for standard cards, the manual div for custom layouts.

**Card variants from codebase:**
- Event card: `bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-3 gap-3`
- Opportunity card: same but `p-4 gap-3`
- Event detail split card: `bg-card text-card-foreground rounded-2xl border border-border shadow-sm flex flex-col md:flex-row p-3 gap-4`
- Detail section card: `bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-5 space-y-6`
- Table wrapper: `rounded-lg border border-border bg-card overflow-hidden`
- Filters panel: `<Card className="p-(--card-spacing)">`

### Card Content Sections

- `flex flex-col gap-1.5` — Tight meta rows
- `flex items-center gap-2 text-xs text-muted-foreground` — Meta item row
- `font-semibold text-sm leading-snug text-foreground line-clamp-1` — Card title
- `text-xs text-muted-foreground` — Card description text
- `flex items-center gap-2 pt-3 border-t border-border mt-auto` — Card footer actions
- `px-(--card-spacing)` — Card sub-component horizontal padding (aligns with `<Card>`)

### Buttons

- **Default:** `<Button>Label</Button>` (mapped to `bg-primary text-primary-foreground`)
- **Outline:** `<Button variant="outline">Label</Button>` (for secondary actions, card footers)
- **Ghost:** `<Button variant="ghost" size="icon">` (toolbar icons)
- **Secondary:** `<Button variant="secondary">` (active toggle state)
- **With icon:** `<Button><Plus className="h-4 w-4" /> Label</Button>`
- **Loading:** `<Button disabled><Loader2 className="h-4 w-4 animate-spin" /> Processing</Button>`
- **Cursor:** Always add `cursor-pointer` to interactive button variants

### Tabs (filter toolbars)

```
<TabsList className="h-8 p-0.5 bg-muted">
  <TabsTrigger className="h-7 text-xs px-3">Label</TabsTrigger>
</TabsList>
```

Pill view switcher: `flex items-center border border-border rounded p-0.5 h-8 bg-muted/40`

### Search Input

```
<div className="relative">
  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
  <Input
    placeholder="Search..."
    className="h-8 pl-8 text-xs bg-muted/30 border-border w-[200px] md:w-[240px] focus-visible:ring-1"
  />
</div>
```

### Form Fields

```
<div className="space-y-2">
  <Label htmlFor="id">Field <span className="text-destructive">*</span></Label>
  <Input id="id" ... />
</div>
```

Grid layout for multiple fields: `grid grid-cols-1 md:grid-cols-3 gap-4`

### Badges / Tags

- `<Badge variant="secondary">` — tag labels
- `<Badge variant="outline" className="text-[10px] font-semibold">` — batch restriction
- `<Badge variant="default|destructive">` — status (upcoming/past)
- Manual: `text-[10px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5` — inline chip

### Meta Item (icon + label pair)

```
<div className="flex items-center gap-2 text-xs text-muted-foreground">
  <MapPin className="h-3.5 w-3.5 shrink-0" />
  <span>Location</span>
</div>
```

Compact detail row (event detail page):
```
<div className="flex items-center gap-3">
  <div className="p-2 bg-muted rounded-xl text-foreground shrink-0">
    <Calendar className="h-4 w-4" />
  </div>
  <div className="flex flex-col min-w-0">
    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Label</span>
    <span className="text-sm font-medium text-foreground">Value</span>
  </div>
</div>
```

### Tables

```
<div className="rounded-lg border border-border bg-card overflow-hidden">
  <table className="w-full border-collapse text-left text-xs text-foreground min-w-[600px]">
    <thead>
      <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
        <th className="p-3 pl-4">Column</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
        <td className="p-3 pl-4 font-semibold text-foreground">Value</td>
        <td className="p-3 text-muted-foreground">Value</td>
        <td className="p-3 text-right pr-4"><Button variant="outline">Action</Button></td>
      </tr>
    </tbody>
  </table>
</div>
```

### Loading Skeleton

```
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {Array.from({ length: 6 }).map((_, i) => (
    <Skeleton key={i} className="h-[280px] rounded-xl" />
  ))}
</div>
```

### Empty State

```
<Card className="rounded-xl border border-border bg-card">
  <CardContent className="flex flex-col items-center py-16 text-center">
    <Briefcase className="h-8 w-8 text-muted-foreground/60 mb-3" />
    <p className="font-semibold text-foreground text-sm">No items found</p>
    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search.</p>
  </CardContent>
</Card>
```

### Error State

```
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>{errorMessage}</AlertDescription>
</Alert>
```

### Separator

```
<Separator />              // horizontal rule (bg-border)
<hr className="border-border" />   // alternative if inside a card
```

### Event Detail — Split Card Layout

```
<div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm flex flex-col md:flex-row p-3 gap-4">
  <!-- Left: poster (aspect-[4/5], w-[35%]) -->
  <div className="aspect-square md:aspect-[4/5] w-full md:w-[35%] rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
    <!-- cover image or placeholder -->
  </div>
  <!-- Right: info -->
  <div className="flex-1 flex flex-col justify-between gap-5 min-w-0 py-1.5 px-1">
```

### Event Detail — Poster Placeholder

```
<div class="bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col justify-between p-5">
  <!-- top: label -->
  <div class="flex items-center justify-between border-b border-border/40 pb-3">
    <span class="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Label</span>
    <Calendar class="h-4 w-4 text-muted-foreground/50" />
  </div>
  <!-- middle: date -->
  <div class="my-auto space-y-1">
    <div class="text-5xl font-extrabold text-foreground leading-none">{date}</div>
    <div class="text-lg font-bold tracking-widest text-muted-foreground uppercase">{month}</div>
  </div>
  <!-- bottom: location -->
  <div class="border-t border-border/40 pt-3">
    <p class="text-[10px] text-muted-foreground/60 truncate font-semibold uppercase tracking-wider">{location}</p>
  </div>
</div>
```

### Sidebar Menu Item (active state)

```
<SidebarMenuButton
  isActive={isActive}
  tooltip={label}
  className={cn(
    "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
    isActive
      ? "!bg-primary !text-primary-foreground shadow-sm"
      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
  )}
>
```

---

## 3. Quick Color Token Reference

These CSS variables are always available; never use raw Tailwind color names.

| Token | Purpose |
|-------|---------|
| `bg-background` | Page background |
| `text-foreground` | Primary text |
| `bg-card` | Card/surface background |
| `text-card-foreground` | Text on cards |
| `bg-muted` | Muted/gray surface (tabs, skeletons) |
| `text-muted-foreground` | Secondary text, descriptions |
| `bg-primary` | Primary button background |
| `text-primary` | Primary accent text |
| `text-primary-foreground` | Text on primary background |
| `bg-secondary` | Active toggle background |
| `bg-accent` | Hover/accent background |
| `text-destructive` | Error/danger text |
| `bg-destructive/10` | Destructive badge bg |
| `border-border` | All borders |
| `ring-1 ring-foreground/10` | Subtle card outline |
| `text-muted-foreground/60` | De-emphasized icons |
| `bg-background/80` | Frosted navbar bg |
| `bg-muted/30` | Input/search bg |

---

## 4. Typography

| Element | Classes |
|---------|---------|
| Page title (h1) | `text-xl font-semibold tracking-tight text-foreground` |
| Section header (h2) | `text-2xl font-semibold text-foreground` |
| Card title (h3) | `font-semibold text-sm leading-snug text-foreground line-clamp-1` |
| Card description | `text-xs text-muted-foreground` |
| Subtitle | `text-xs text-muted-foreground` |
| Body | `text-sm text-muted-foreground` (default shadcn text) |
| Badge/label | `text-[10px] font-semibold` or `text-xs font-medium` |
| Table header | `text-[10px] uppercase font-semibold text-muted-foreground tracking-wider` |
| Table cell | `text-xs text-foreground` or `text-xs text-muted-foreground` |
| Detail label | `text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75` |
| Detail value | `text-sm font-medium text-foreground` |
| Breadcrumbs | `text-xs text-muted-foreground font-medium` |
| Count/badge text | `text-xs font-medium text-muted-foreground` |

---

## 5. Icons (Lucide)

| Context | Size | Example |
|---------|------|---------|
| Button left icon | `h-4 w-4` | `<Plus className="h-4 w-4" />` |
| Inline with text | `h-3.5 w-3.5` | `<MapPin className="h-3.5 w-3.5 shrink-0" />` |
| Large status | `h-10 w-10` | `<CheckCircle2 className="h-10 w-10" />` |
| Icon button | Button `size="icon"`, icon `h-4 w-4` | `<Button size="icon"><Bell className="h-4 w-4" /></Button>` |
| Empty state | `h-8 w-8 text-muted-foreground/60` | `<Calendar className="h-8 w-8 text-muted-foreground/60 mb-3" />` |
| Detail icon bg | `p-2 bg-muted rounded-xl h-4 w-4` | Icon in rounded container |

Common icon colors:
- Default: `text-muted-foreground` (inline text)
- De-emphasized: `text-muted-foreground/60` (search icon, empty state)
- Inherit: no color class (button icon inherits button text color)

---

## 6. Layout Patterns

### Page with Sidebar
```
<Sidebar collapsible="icon">...</Sidebar>
<SidebarInset>
  <div className="w-full px-6 pb-6 space-y-6">
    <!-- page content -->
  </div>
</SidebarInset>
```

### Page without Sidebar (public)
```
<div className="min-h-screen bg-background">
  <Navbar />
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
    <!-- content -->
  </div>
</div>
```

### Responsive Grid
```
<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

---

## 7. State Machine Pattern

All data-fetching pages follow the same tri-state pattern:

```
1. Loading  → Skeleton grid
2. Error    → <Alert variant="destructive">
3. Success  → 
   a. Empty → <Card> with icon + message
   b. Data  → grid/list of items
```

Loading skeleton uses `<Skeleton className="h-[280px] rounded-xl" />` matching the exact card dimensions.

---

## 8. What NOT to Use (Legacy Navy/Gold)

These are from the deprecated design system. **Never use in new pages.**

```
Classes:    btn-primary, btn-gold, btn-outline, input-field, section-title, .badge
Colors:     text-navy-*, bg-navy-*, border-navy-*, text-gold-*, bg-gold-*, border-gold-*
Tokens:     --color-navy-*, --color-gold-*, ring-navy-*
```

Always use shadcn equivalents: `<Button>`, `<Card>`, `<Input>`, `<Badge>`, `<CardTitle>`, and CSS variable tokens (`bg-background`, `text-foreground`, `border-border`, etc.).

---

## 9. Reference Files

For real working examples of these patterns, see:

| File | Patterns Demonstrated |
|------|----------------------|
| `app/events/page.tsx` | Sticky header, tabs, search input, skeleton loading, empty state, error alert, table view, card grid |
| `app/events/[id]/page.tsx` | Split detail card, poster placeholder, detail meta rows, back link, dialog trigger, skeleton layout |
| `app/opportunities/page.tsx` | Sticky header, tabs filter, search, card grid with actions, empty state |
| `app/alumni/page.tsx` | Page header with separator, filter card, skeleton list, empty state, tabs view switcher |
| `components/events/EventCard.tsx` | Card component with image-aspect, meta rows, border-t footer |
| `components/events/CreateEventModal.tsx` | Dialog + form, date picker (popover + calendar), switch, separator, state machine |
| `components/layout/Navbar.tsx` | Sticky nav, backdrop blur, breadcrumbs, theme toggle, dropdown user menu |
| `components/layout/DashboardSidebar.tsx` | Sidebar with menu items, active state styles, user info block |
| `components/alumni/AlumniCard.tsx` | Card with avatar, badge tags, footer button |
| `app/globals.css` | All CSS variable token definitions, light/dark mode |

---

## 10. Quick Start — Building a New Page

```tsx
// 1. Page wrapper
<div className="w-full px-6 pb-6 space-y-6">

  // 2. Sticky header
  <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-6 px-6">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Title</h1>
        <p className="text-xs text-muted-foreground">Description</p>
      </div>
      <Button className="cursor-pointer"><Plus className="h-4 w-4" /> Action</Button>
    </div>
  </div>

  // 3. Filters toolbar
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <Tabs>
      <TabsList className="h-8 p-0.5 bg-muted">
        <TabsTrigger className="h-7 text-xs px-3">Tab</TabsTrigger>
      </TabsList>
    </Tabs>
    {/* search input */}
  </div>

  // 4. Loading / Error / Empty / Data
  {loading ? <Skeleton className="h-[280px] rounded-xl" /> :
   error   ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> :
   items.length === 0 ? <Card><CardContent className="flex flex-col items-center py-16">...</CardContent></Card> :
   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">items</div>}

</div>
```

---

**Canonical references:** [shadcn docs](https://ui.shadcn.com/docs/components) | `app/globals.css` | `components/ui/`
