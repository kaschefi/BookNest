type Role = "guest" | "user" | "admin";

type Action =
    | "read"
    | "download"
    | "upload"
    | "create_field"
    | "create_lesson"
    | "manage_users";

export function hasPermission(role: Role, action: Action): boolean {
    const permissions = {
        guest: ["read", "download"],

        user: ["read", "download", "upload"],

        admin: [
            "read",
            "download",
            "upload",
            "create_field",
            "create_lesson",
            "manage_users"
        ]
    };

    return permissions[role]?.includes(action) || false;
}