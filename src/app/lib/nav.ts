import {
  LayoutDashboard, Route, AlertTriangle, FileCheck2, Users, Award, Gift,
  Megaphone, Trophy, BarChart3, FileText, MessageSquare, BookText, ShieldCheck,
  ScrollText, Activity, LifeBuoy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RoleName } from "./types";

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
  roles: RoleName[];
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

const allRoles: RoleName[] = [
  "Executive / Management Viewer", "Supervisor / Business Manager", "Operations Support",
  "Campaign Administrator", "Compliance / Financial Crime", "Internal Audit",
  "Information Security / Technical Support", "Staff Assist Administrator",
];

export const roles = allRoles;

export const navGroups: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: allRoles },
    ],
  },
  {
    group: "Operations",
    items: [
      {
        key: "journeys", label: "Onboarding Journeys", path: "/journeys", icon: Route,
        roles: ["Supervisor / Business Manager", "Operations Support", "Compliance / Financial Crime", "Staff Assist Administrator"],
      },
      {
        key: "exceptions", label: "Exceptions", path: "/exceptions", icon: AlertTriangle,
        roles: ["Supervisor / Business Manager", "Operations Support", "Compliance / Financial Crime", "Staff Assist Administrator"],
      },
      {
        key: "artefacts", label: "Artefact Reconciliation", path: "/artefacts", icon: FileCheck2,
        roles: ["Operations Support", "Staff Assist Administrator"],
      },
    ],
  },
  {
    group: "Performance",
    items: [
      {
        key: "staff", label: "Staff & Organisation", path: "/staff", icon: Users,
        roles: ["Executive / Management Viewer", "Supervisor / Business Manager", "Campaign Administrator", "Staff Assist Administrator"],
      },
      {
        key: "staff-rewards", label: "Staff Rewards", path: "/rewards/staff", icon: Award,
        roles: ["Campaign Administrator", "Staff Assist Administrator"],
      },
      {
        key: "customer-rewards", label: "Customer Rewards", path: "/rewards/customer", icon: Gift,
        roles: ["Campaign Administrator", "Staff Assist Administrator"],
      },
      {
        key: "campaigns", label: "Campaigns", path: "/campaigns", icon: Megaphone,
        roles: ["Campaign Administrator", "Staff Assist Administrator"],
      },
      {
        key: "leaderboard", label: "Leaderboard", path: "/leaderboard", icon: Trophy,
        roles: ["Executive / Management Viewer", "Supervisor / Business Manager", "Campaign Administrator", "Staff Assist Administrator"],
      },
      {
        key: "reports", label: "Reports & Analytics", path: "/reports", icon: BarChart3,
        roles: allRoles,
      },
    ],
  },
  {
    group: "Administration",
    items: [
      {
        key: "consent-content", label: "Consent & Attestation Content", path: "/content/consent", icon: FileText,
        roles: ["Compliance / Financial Crime", "Staff Assist Administrator"],
      },
      {
        key: "communications", label: "Communications", path: "/content/communications", icon: MessageSquare,
        roles: ["Compliance / Financial Crime", "Campaign Administrator", "Staff Assist Administrator"],
      },
      {
        key: "metric-definitions", label: "Metric Definitions & Data Lineage", path: "/data/metrics", icon: BookText,
        roles: ["Executive / Management Viewer", "Campaign Administrator", "Information Security / Technical Support", "Staff Assist Administrator"],
      },
      {
        key: "access", label: "Access Management", path: "/access", icon: ShieldCheck,
        roles: ["Staff Assist Administrator", "Information Security / Technical Support"],
      },
      {
        key: "audit", label: "Audit Logs", path: "/audit", icon: ScrollText,
        roles: ["Internal Audit", "Information Security / Technical Support", "Staff Assist Administrator"],
      },
      {
        key: "system-health", label: "System Health", path: "/system-health", icon: Activity,
        roles: ["Information Security / Technical Support", "Staff Assist Administrator"],
      },
      {
        key: "support", label: "Support Content", path: "/content/support", icon: LifeBuoy,
        roles: ["Operations Support", "Staff Assist Administrator"],
      },
    ],
  },
];

export const roleDescriptions: Record<RoleName, { can: string; cannot: string }> = {
  "Executive / Management Viewer": {
    can: "View high-level performance; compare entities, divisions, regions, departments and branches; view aggregate campaign and conversion information.",
    cannot: "View unnecessary customer-level information; edit journeys, configurations or campaign rules.",
  },
  "Supervisor / Business Manager": {
    can: "View staff and onboarding performance within scope; view customers requiring follow-up; monitor team points, leagues and conversion.",
    cannot: "Edit verified customer information; override screening or account-opening outcomes; change campaign rules unless separately authorised.",
  },
  "Operations Support": {
    can: "View journeys and operational statuses; investigate failed or pending journeys; retry approved technical activities; reconcile artefact-synchronisation failures.",
    cannot: "Change declarations; edit verified identity information; override AML or compliance outcomes.",
  },
  "Campaign Administrator": {
    can: "Create and manage campaigns; configure milestones, points, tiers, league cycles and comparison groups; review score and reward exceptions.",
    cannot: "Alter identity-verification or account-opening records; fabricate customer milestones.",
  },
  "Compliance / Financial Crime": {
    can: "View authorised AML and screening outcomes; review referred cases; view declarations where permitted; record approved review decisions.",
    cannot: "Alter original declarations; change staff attribution or campaign scores outside an approved compliance action.",
  },
  "Internal Audit": {
    can: "View journey records, consent records, administrator actions, access logs and campaign changes; search and export authorised audit information.",
    cannot: "Initiate or modify customer onboarding; change configuration or operational outcomes.",
  },
  "Information Security / Technical Support": {
    can: "View system health, integration failures, access events and security alerts; investigate technical failures.",
    cannot: "View unnecessary customer data; modify business, compliance or campaign outcomes.",
  },
  "Staff Assist Administrator": {
    can: "Manage platform configuration, elevated roles, approved content and operational settings; view system-wide status.",
    cannot: "Edit verified customer identity; override AML, duplicate-account or facial-verification outcomes.",
  },
};

export function visibleNavGroups(role: RoleName): NavGroup[] {
  return navGroups
    .map((g) => ({ group: g.group, items: g.items.filter((i) => i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0);
}
