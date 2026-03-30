# Multiple Roles Support - Implementation Guide

## Problem Solved

Backend supports **multiple roles per user** (e.g., user can be both ALUMNI and BATCH_ADMIN), but frontend was only checking `roles[0]`, causing admin pages to fail for users with multiple roles.

### Example Database Setup:
```sql
-- Admin who is also alumni
INSERT INTO user_roles (user_id, role_id) VALUES (22, 2);  -- ALUMNI
INSERT INTO user_roles (user_id, role_id) VALUES (22, 4);  -- ADMIN

-- Batch admin (alumni + batch admin)
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2);   -- ALUMNI  
INSERT INTO user_roles (user_id, role_id) VALUES (2, 5);   -- BATCH_ADMIN
```

**Backend returns:** `roles: ["ALUMNI", "ADMIN"]` or `roles: ["ALUMNI", "BATCH_ADMIN"]`

**Old frontend behavior:** Only checked `roles[0]` → "ALUMNI" → No admin access ❌

**New frontend behavior:** Checks ALL roles → Has "ADMIN" → Admin access granted ✅

---

## Solution

### 1. Created Role Utility Functions (`lib/roleUtils.ts`)

```typescript
// Check if user has ANY of the required roles
hasRole(userRoles, requiredRoles)

// Specific role checkers
isAdmin(userRoles)      // admin OR batch_admin
isAlumni(userRoles)     // alumni OR batch_admin  
isStudent(userRoles)    // student
isFaculty(userRoles)    // faculty
```

### 2. Updated Login to Store ALL Roles

**Before:**
```typescript
const apiRole = data.roles?.[0];  // ❌ Only first role
const normalizedRole = normalizeRole(apiRole);
localStorage.setItem("role", normalizedRole);
```

**After:**
```typescript
const allRoles = data.roles || [];  // ✅ ALL roles
const storedUser = {
  roles: allRoles,  // Store as array
  // ... other fields
};
localStorage.setItem("alumni_user", JSON.stringify(storedUser));
```

### 3. Updated All Role Checks

**Before:**
```typescript
const isAdmin = role === "admin" || role === "batch_admin";
```

**After:**
```typescript
import { isAdmin } from "@/lib/roleUtils";
const isAdmin = isAdmin(user.roles);  // Checks ALL roles
```

---

## Files Modified

### Core Files
- ✅ `lib/roleUtils.ts` - NEW utility functions
- ✅ `app/auth/login/page.tsx` - Store all roles, redirect based on any role
- ✅ `app/admin/skills/page.tsx` - Use `isAdmin()` check
- ✅ `app/dashboard/alumni/page.tsx` - Use `hasRole()` for access control
- ✅ `app/profile/page.tsx` - Use `hasRole()` for role display
- ✅ `app/events/page.tsx` - Use `isAdmin()` for create button

### Key Changes

#### Login Page (`app/auth/login/page.tsx`)
```typescript
// Store ALL roles
const allRoles = data.roles || [];
const storedUser = { roles: allRoles, ... };

// Check roles for dashboard redirect
const hasAdmin = allRoles.some(r => r === "ADMIN" || r === "BATCH_ADMIN");
const hasAlumni = allRoles.some(r => r === "ALUMNI" || r === "BATCH_ADMIN");

if (hasAdmin || hasAlumni) router.push("/dashboard/alumni");
```

#### Admin Skills Page (`app/admin/skills/page.tsx`)
```typescript
import { isAdmin } from "@/lib/roleUtils";

// Check if user has ANY admin role
const adminCheck = isAdmin(user.roles);  // ✅ Works with multiple roles
```

#### Alumni Dashboard (`app/dashboard/alumni/page.tsx`)
```typescript
import { hasRole } from "@/lib/roleUtils";

// Check blocked roles
const isBlocked = hasRole(userRoles, ["student", "faculty"]);

// Check allowed roles
const isAllowed = hasRole(userRoles, ["alumni", "batch_admin", "admin"]);
```

---

## Usage Examples

### Check Single Role
```typescript
import { hasRole } from "@/lib/roleUtils";

const userRoles = ["ALUMNI", "BATCH_ADMIN"];
hasRole(userRoles, "admin");        // true (BATCH_ADMIN counts)
hasRole(userRoles, "student");      // false
```

### Check Multiple Roles
```typescript
hasRole(userRoles, ["admin", "batch_admin"]);  // true if has ANY
```

### Specific Checkers
```typescript
import { isAdmin, isAlumni, isStudent } from "@/lib/roleUtils";

isAdmin(userRoles);      // true for ADMIN or BATCH_ADMIN
isAlumni(userRoles);     // true for ALUMNI or BATCH_ADMIN
isStudent(userRoles);    // true for STUDENT only
```

---

## Testing

### Test Case 1: Admin + Alumni
```sql
-- User with both ALUMNI and ADMIN roles
roles: ["ALUMNI", "ADMIN"]
```
**Expected:**
- ✅ Can access `/admin/skills`
- ✅ Can access `/dashboard/alumni`
- ✅ Can see "Create Event" button
- ✅ `isAdmin(roles)` → true
- ✅ `isAlumni(roles)` → true

### Test Case 2: Batch Admin + Alumni
```sql
-- User with ALUMNI and BATCH_ADMIN roles
roles: ["ALUMNI", "BATCH_ADMIN"]
```
**Expected:**
- ✅ Can access `/admin/skills`
- ✅ Can access `/dashboard/alumni`
- ✅ Can see "Create Event" button
- ✅ `isAdmin(roles)` → true
- ✅ `isAlumni(roles)` → true

### Test Case 3: Alumni Only
```sql
-- User with only ALUMNI role
roles: ["ALUMNI"]
```
**Expected:**
- ❌ Cannot access `/admin/skills` (403 error)
- ✅ Can access `/dashboard/alumni`
- ❌ Cannot see "Create Event" button
- ✅ `isAdmin(roles)` → false
- ✅ `isAlumni(roles)` → true

---

## Backwards Compatibility

The changes are **backwards compatible**:

1. **Single role users** still work (array with one element)
2. **Old localStorage** format still supported (checks both `roles` and `role`)
3. **Dashboard redirect** logic handles all role combinations

---

## Migration Notes

### For Existing Users
No migration needed! The login automatically handles both formats:
```typescript
const userRoles = parsedUser?.roles || parsedUser?.role || "";
```

### For New Code
Always use the utility functions:
```typescript
// ✅ GOOD
import { isAdmin } from "@/lib/roleUtils";
if (isAdmin(user.roles)) { ... }

// ❌ BAD
if (user.role === "admin") { ... }
```

---

## Summary

✅ **Multiple roles now fully supported**
✅ **Admin pages work for users with ALUMNI + ADMIN/BATCH_ADMIN**
✅ **No breaking changes to existing functionality**
✅ **Clean, reusable role checking utilities**
✅ **Type-safe with TypeScript**

**Key Principle:** Check for **presence** of required roles, not **position** in array.
