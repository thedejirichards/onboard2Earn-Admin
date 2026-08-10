import { createContext, ReactNode, useContext, useState } from "react";
import type { RoleName } from "./types";

interface AdminContextValue {
  role: RoleName;
  setRole: (role: RoleName) => void;
  entity: string;
  setEntity: (entity: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleName>("Staff Assist Administrator");
  const [entity, setEntity] = useState("NG");
  const [dateRange, setDateRange] = useState("Last 30 days");

  return (
    <AdminContext.Provider value={{ role, setRole, entity, setEntity, dateRange, setDateRange }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
