import { useState, useMemo } from "react";
import { useAdmin } from "@/app/admin/AdminContext";

export function useAdminUsers() {
  const { users, banUser, unblockUser } = useAdmin();
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const term = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  return {
    users: filteredUsers,
    search,
    setSearch,
    banUser,
    unblockUser
  };
}
