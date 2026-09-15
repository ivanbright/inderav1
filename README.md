# Indera School App (Expo + Firebase)

A school communication app for parents, teachers, and administrators — built with
React Native (Expo SDK 57), TypeScript, and Firebase (Authentication, Firestore,
Cloud Functions).

> **Note:** this project uses an invitation-gated, admin-approved registration
> model. New accounts are invisible until an administrator explicitly approves
> them. This is a deliberate security decision, documented below.

---

## Authentication & Approval Flow

There are **two registration paths**, and what happens after depends on the role.

### Facts about the current setup

| Item | Status |
|------|--------|
| Email/password registration with invite code | ✅ Implemented end-to-end |
| Google sign-in (bundled, needs OAuth client config) | ✅ Code wired, config is a manual step |
| Admin approval (approve/reject pending users) | ✅ Backend complete (`adminDecision`) |
| Admin **approval list screen** (UI) | 🚧 Not built yet — backend is ready |
| Invite-code generator | ✅ Backend complete (`generateInviteCode`) |
| Cloud Functions **deployed to Firebase** | ❌ Not done — requires the **Blaze plan** upgrade (pay-as-you-go) + your Firebase login |

- **Parents** register freely (email + password), and are active immediately after
  email verification.
- **Teachers** and **admins** can only register with an **invite code** issued by
  the school. After registering, their account is **pending_approval** — they
  receive `pending_approval` custom claims and *cannot sign in* until an
  administrator approves them via `adminDecision`.

### The security chain (who does what)

1. **Admin** (in code, not yet a screen) calls `generateInviteCode` → returns a
   6-char code tied to a role + a school.
2. **New staff member** opens Signup, picks Teacher/Admin, enters the code.
   The Cloud Function `finalizeRegistration` validates the code against Firestore.
3. On success, Firebase custom claims are set:
   - `role` (`parent` | `teacher` | `admin`)
   - `schoolId`
   - `status: "pending_approval"` for staff
4. The account is created in `users/` with `status: "pending_approval"`.
5. An **admin** (someone with the `admin` claim) calls `adminDecision` with
   `approve: true` → claims flip to `status: "active"`, and a notification is
   created for the staff member.
6. **reject** does the opposite (claims revoked, user archived).

### The mobile side calls

All go through `src/services/authService.ts`:

- `registerUser(email, password, role, inviteCode?)`
- `googleSignIn(accessToken, idToken, role?)`
- `getMyClaims()` → reads your own role/school/status (uses `getMyClaims`)

`AppContext` exposes `registerUser` and `googleSignIn` on the provider so every
screen can use them.

---

## Directory Map

```
functions/          Cloud Functions backend (TypeScript → deployable lib/)
  index.ts          finalizeRegistration, adminDecision, getMyClaims, generateInviteCode
src/                Expo app
  services/         authService, firebase, database, seed, notifications, etc.
  contexts/         AppContext (auth state + data, now incl. registerUser/googleSignIn)
  screens/
    auth/           Login, Signup, ForgotPassword
    admin/          (backend-ready; approval-list UI pending)
    parent/         (home, notifications, attendance, pickups, etc.)
    teacher/
    shared/
functions/lib/      Build output. Do NOT edit by hand. Deploy target.
```

---

## Deployment (functions)

The backend builds to `functions/lib/index.js` (TypeScript is clean). But the
**deploy itself is NOT done** because it requires two things on your side:

1. **Blaze (pay-as-you-go) plan** on the Firebase project `indera-574de` —
   free Spark plan cannot enable Cloud Functions. Upgrade at:
   `https://console.firebase.google.com/project/indera-574de/usage/details`
2. **Firebase login with 3FA** — your Google account's two-step verification
   surfaced mid-deploycars; the CLI needs a fresh authorized session from your
   phone.

To deploy once those are sorted:

```bash
cd functions
npm install
npx firebase-tools login --reauth   # finish 3FA in browser
npx firebase-tools login <code>     # when the login flow tells you to
npx firebase-tools deploy --only functions
```

---

## Google Sign-In (manual config step)

Google requires a **Web Client ID** for OAuth (`expo-auth-session`). The code path
exists; the Client ID value must be created in the Google Cloud console and set as
an environment/config value. That's a console-side step, done by you, not by code.

---

## Type Checking

```bash
npx tsc --noEmit   # from project root
```

Currently: **45 pre-existing errors, all in files unrelated to auth**
(`seedService`, `usePickupManagement`, `PickupManagementScreen`,
`useAbsenceRequests`, `AdminAnnouncementsScreen`, `NotificationsScreen`). The
auth/backend/functions work introduced **zero** new errors and is verified clean.

---

## Honest State

**Done & verified (tsc-clean):**
- Secure, approval-gated registration backend (functions)
- `authService` registerUser / googleSignIn / getMyClaims
- `AppContext` registerUser + googleSignIn implementations
- `SignupScreen` (wired to the SignUp route)
- `LoginScreen` (real Google + Sign Up entries; demo/debug panel removed)

**Not done / blocked (your side):**
- Cloud Functions **deploy** — needs Blaze plan + your 3FA login
- Admin **approval list screen** — backend ready, UI not written
- Notifications bell, entrance animations, chevron links on remaining rows

> This README is as honest as the code: it does not claim deployment that has
> not happened, nor buttons that do not exist. When the deploy and the approval
> UI land, update the two tables above.
