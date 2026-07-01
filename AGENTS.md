# AGENTS.md — Alumni Network Frontend

## Tech Stack
- **Next.js 16** (App Router), React 19, TypeScript 6
- **TanStack React Query 5** — all server state
- **ofetch** — typed HTTP client with auto Bearer token injection
- **Tailwind CSS 4**, shadcn/ui, lucide-react icons

## Route Groups
```
app/
  layout.tsx              # Root: providers (Theme, Sidebar, QueryClient, Auth)
  page.tsx                # Public landing page (redirects authenticated users to dashboard)
  (auth)/layout.tsx       # Thin layout, no sidebar (login, signup, forgot-password)
  (app)/layout.tsx        # Protected layout with DashboardSidebar + Navbar
    dashboard/{alumni,faculty,student,mainadmin}/
    alumni/, events/, opportunities/, profile/, ...
```

Pages under `(app)` auto-protected: the `(app)/layout.tsx` reads `useAuth()` — if unauthenticated, renders Navbar-only view (no sidebar). If authenticated, includes `DashboardSidebar`.

## Data Fetching — No In-Page Fetching

All API calls go through `lib/fetcher.ts` (ofetch instance) — never write `fetch()` or `localStorage.getItem("token")` in pages/components.

### Files
| File | Purpose |
|---|---|
| `lib/fetcher.ts` | `api = ofetch.create(...)` with baseURL + auto Bearer token |
| `lib/api-error.ts` | `ApiError` class (message, status, data) |
| `lib/query-client.ts` | QueryClient: staleTime=5min, retry=1, refetchOnWindowFocus=false |
| `lib/auth.ts` | `getToken()` reads from localStorage |

### Error handling pattern
```ts
try { ... } catch (err: unknown) {
  const message = err instanceof Error ? err.message : "Something went wrong";
}
```

## Query/Mutation Naming Convention

All hooks in `hooks/queries/` follow strict naming:
- **Queries**: `use<Resource><Query>` — e.g. `useEventsQuery`, `useAlumniProfileQuery`, `useOpportunitiesQuery`
- **Mutations**: `use<Action><Mutation>` — e.g. `useCreateEventMutation`, `useApproveUserMutation`

Every hook file lives in `hooks/queries/` and imports `api` from `@/lib/fetcher` and `queryKeys` from `./keys`.

## Query Key Factory (`hooks/queries/keys.ts`)

Hierarchical, typed key factory. Always use `queryKeys.<domain>.<action>()` instead of inline arrays.
```ts
queryKeys.events.all           // ["events"]
queryKeys.events.detail(id)    // ["events", id]
queryKeys.events.mine()        // ["events", "mine"]
```

Invalidate at the right granularity:
```ts
onSuccess: () => {
  qc.invalidateQueries({ queryKey: queryKeys.events.all });
}
```

## Auth (`contexts/auth-context.tsx`)

- `AuthProvider` wraps the root layout
- `useAuth()` returns `{ user, token, isAuthenticated, isLoading, login, logout, updateUser }`
- Auth state read from `localStorage("alumni_user")` + `localStorage("token")` on mount
- Login writes to localStorage and dispatches `window.Event("storage")` for cross-tab sync
- Do NOT read `localStorage` directly in components — use `useAuth()`

## Types

| Location | Purpose |
|---|---|
| `types/index.ts` | Legacy/general types (User, Alumni, Job, Skill, etc.) |
| `lib/types/events.ts` | API response types for events (single source of truth for Event, EventPhoto, EventVideo, CreateEventPayload, EventActionResponse) |
| `lib/types/mentorship.ts` | Mentorship API types |
| `lib/clubEvent.ts` | Club event API types |

API types for queries are defined in `lib/types/` and re-exported via type import in the hooks files. When adding a new domain, create a file in `lib/types/` and import `type { Foo }` in the query hook.

## Role Utilities (`lib/roleUtils.ts`)

| Function | Purpose |
|---|---|
| `hasRole(userRoles, required)` | Check if user has any of required roles |
| `isMainAdmin/ isBatchAdmin / isAnyAdmin` | Admin-specific checks |
| `isAlumni / isStudent / isFaculty` | Role-specific checks |
| `normalizeRoleForDisplay(role)` | Maps `"batch_admin"` → `"admin"`, returns union type |

## Commands

```sh
npm run dev         # Next.js dev server
npm run build       # Production build
npm run lint        # ESLint
npx tsc --noEmit    # TypeScript type check (no output = clean)
```

## Key Constraints

- **No `as any`, `as unknown as`, or `catch (err: any)`** allowed anywhere
- **No inline fetch()** in pages/components — use query hooks + `api` fetcher
- **No direct `localStorage` reads** in components — use `useAuth()`
- All `catch` blocks must use `catch (err: unknown)` + `instanceof Error` check
- Query hooks files export functions only (no interfaces visible outside — types go in `lib/types/`)
