# Missing Backend Work

This checklist tracks backend decisions that remain after the admin API cleanup.

## Routing

- `pages/api/admin/recources.ts` remains as a backward-compatible alias for the old misspelled route. New admin code should use `/api/admin/resources`.
- Resource views are already counted by `GET /api/files/[id]`. Add a separate `POST /api/files/[id]/view` only if the frontend needs a non-fetch tracking endpoint.

## Auth

- Admin routes now accept both local JWT admins and NextAuth session admins through `lib/apiAuth.ts`.

## Data

- Decide whether uploaded resources should default to `pending` or become visible immediately. `Resource` defaults uploads to `pending`, while `/api/files` GET only returns `approved`.
- Decide whether rejected resources should stay in MongoDB as `status: "rejected"` or be deleted from Cloudinary/MongoDB. Current admin review routes keep rejected resources for audit; admin delete removes the file and document.
