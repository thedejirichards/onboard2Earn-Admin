import { useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  Bell, ChevronDown, ChevronLeft, LogOut, Menu,
} from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import { usePageHeaderValue } from "@/app/lib/PageHeaderContext";
import { roles, visibleNavGroups } from "@/app/lib/nav";
import { exceptions, artefacts } from "@/app/lib/mockData";
import type { RoleName } from "@/app/lib/types";

const entityOptions = [
  { code: "NG", name: "Access Bank Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Access Bank Ghana", flag: "🇬🇭" },
  { code: "KE", name: "Access Bank Kenya", flag: "🇰🇪" },
];

export default function AdminLayout() {
  const { role, setRole, entity, setEntity } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [entityMenuOpen, setEntityMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const groups = useMemo(() => visibleNavGroups(role), [role]);
  const openExceptionCount = exceptions.filter((e) => e.status === "Open" || e.status === "Escalated").length;
  const artefactFailureCount = artefacts.filter((a) => a.status === "Failed").length;
  const currentEntity = entityOptions.find((o) => o.code === entity) ?? entityOptions[0];
  const pageHeader = usePageHeaderValue();

  return (
    <div className="h-screen w-full flex bg-[#F7F8FA] overflow-hidden">
      {/* Left navigation */}
      <aside
        className={`shrink-0 bg-white text-[#101828] border-r border-gray-100 flex flex-col transition-[width] duration-200 ${
          collapsed ? "w-[76px]" : "w-[260px]"
        }`}
      >
        <div
          className={`h-16 flex items-center border-b border-gray-100 ${
            collapsed ? "justify-center" : "gap-2.5 px-4"
          }`}
        >
          {!collapsed && (
            <img src="/DashBoardLogo.svg" alt="Access Bank" className="h-7 w-auto max-w-[140px]" />
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="ml-auto h-7 w-7 flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors"
              aria-label="Toggle navigation"
            >
              <ChevronLeft size={16} className="text-gray-500" />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu size={20} className="text-gray-500" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-hidden py-3 px-2.5 space-y-5">
          {groups.map((g) => (
            <div key={g.group}>
              {!collapsed && (
                <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#98A2B3] mb-1.5">
                  {g.group}
                </p>
              )}
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                  const badge = item.key === "exceptions" ? openExceptionCount : item.key === "artefacts" ? artefactFailureCount : 0;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        active ? "bg-[#5584CE]/10 text-[#5584CE] font-semibold" : "text-[#475467] hover:bg-gray-50 hover:text-[#101828]"
                      }`}
                    >
                      <Icon size={17} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && badge > 0 && (
                        <span className="ml-auto text-[10px] font-semibold bg-[#EE7E01] text-white rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <Link
            to="/login"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#475467] hover:bg-gray-50 hover:text-[#101828] transition-colors"
          >
            <LogOut size={17} />
            {!collapsed && <span>Sign out</span>}
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <header className="min-h-[64px] shrink-0 bg-[#F7F8FA] border-b border-gray-100 flex items-start gap-4 px-6 pt-6 pb-3">
          {pageHeader && (
            <div className="min-w-0 pr-4">
              <h1 className="text-[28px] font-semibold text-[#101828] leading-tight">{pageHeader.title}</h1>
              {pageHeader.description && (
                <p className="text-sm text-[#667085] mt-0.5 max-w-2xl">{pageHeader.description}</p>
              )}
            </div>
          )}

          <div className="hidden lg:flex items-center ml-auto relative shrink-0">
            <button
              onClick={() => setEntityMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[#344054] hover:bg-gray-50 transition-colors"
            >
              <span className="text-base leading-none">{currentEntity.flag}</span>
              {currentEntity.code}
              <ChevronDown size={12} className="text-gray-400" />
            </button>
            {entityMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg py-2 z-20">
                <p className="px-3.5 py-1.5 text-xs font-semibold text-[#667085] uppercase tracking-wide">
                  Entity / Country
                </p>
                {entityOptions.map((o) => (
                  <button
                    key={o.code}
                    onClick={() => {
                      setEntity(o.code);
                      setEntityMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 text-left px-3.5 py-2 text-sm hover:bg-gray-50 ${
                      o.code === entity ? "text-[#5584CE] font-medium bg-[#5584CE]/5" : "text-[#344054]"
                    }`}
                  >
                    <span className="text-base leading-none">{o.flag}</span>
                    {o.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 ml-2 shrink-0">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative h-9 w-9 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={17} className="text-gray-500" />
                {openExceptionCount + artefactFailureCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EE7E01]" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-100 bg-white shadow-lg py-2 z-20">
                  <p className="px-3.5 py-1.5 text-xs font-semibold text-[#667085] uppercase tracking-wide">
                    Attention required
                  </p>
                  <Link
                    to="/exceptions"
                    onClick={() => setNotifOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 text-sm hover:bg-gray-50"
                  >
                    <span className="text-[#344054]">Open exception cases</span>
                    <span className="text-xs font-semibold text-[#EE7E01]">{openExceptionCount}</span>
                  </Link>
                  <Link
                    to="/artefacts"
                    onClick={() => setNotifOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 text-sm hover:bg-gray-50"
                  >
                    <span className="text-[#344054]">Artefact-synchronisation failures</span>
                    <span className="text-xs font-semibold text-[#EE7E01]">{artefactFailureCount}</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="relative ml-1">
              <button
                onClick={() => setRoleMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg pl-1.5 pr-2 py-1.5 hover:bg-gray-50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-[#5584CE] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  DR
                </div>
                <div className="hidden md:block text-left leading-tight">
                  <p className="text-xs font-medium text-[#101828]">Deji Richards</p>
                  <p className="text-[11px] text-[#98A2B3]">{role}</p>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-100 bg-white shadow-lg py-2 z-20">
                  <p className="px-3.5 py-1.5 text-xs font-semibold text-[#667085] uppercase tracking-wide">
                    Switch access scope (demo)
                  </p>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r as RoleName);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm hover:bg-gray-50 ${
                        r === role ? "text-[#5584CE] font-medium bg-[#5584CE]/5" : "text-[#344054]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
