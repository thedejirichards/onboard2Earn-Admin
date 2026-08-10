import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import LoginStartPage from "./pages/LoginStartPage";
import LoginAccountPickerPage from "./pages/LoginAccountPickerPage";
import LoginPasswordPage from "./pages/LoginPasswordPage";
import AdminLayout from "./components/admin/AdminLayout";
import { AdminProvider } from "./lib/AdminContext";
import { PageHeaderProvider } from "./lib/PageHeaderContext";
import DashboardPage from "./pages/admin/DashboardPage";
import OnboardingJourneysPage from "./pages/admin/OnboardingJourneysPage";
import JourneyDetailPage from "./pages/admin/JourneyDetailPage";
import ExceptionsPage from "./pages/admin/ExceptionsPage";
import ArtefactReconciliationPage from "./pages/admin/ArtefactReconciliationPage";
import StaffDirectoryPage from "./pages/admin/StaffDirectoryPage";
import StaffDetailPage from "./pages/admin/StaffDetailPage";
import StaffRewardsPage from "./pages/admin/StaffRewardsPage";
import CustomerRewardsPage from "./pages/admin/CustomerRewardsPage";
import CampaignsPage from "./pages/admin/CampaignsPage";
import LeaderboardPage from "./pages/admin/LeaderboardPage";
import ReportsPage from "./pages/admin/ReportsPage";
import ConsentContentPage from "./pages/admin/ConsentContentPage";
import CommunicationsPage from "./pages/admin/CommunicationsPage";
import MetricDefinitionsPage from "./pages/admin/MetricDefinitionsPage";
import AccessManagementPage from "./pages/admin/AccessManagementPage";
import AuditLogsPage from "./pages/admin/AuditLogsPage";
import SystemHealthPage from "./pages/admin/SystemHealthPage";
import SupportContentPage from "./pages/admin/SupportContentPage";

function AdminApp() {
  return (
    <AdminProvider>
      <PageHeaderProvider>
        <AdminLayout />
      </PageHeaderProvider>
    </AdminProvider>
  );
}

const routes = [
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginStartPage /> },
  { path: "/login/entra", element: <LoginAccountPickerPage /> },
  { path: "/login/entra/password", element: <LoginPasswordPage /> },
  {
    element: <AdminApp />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/journeys", element: <OnboardingJourneysPage /> },
      { path: "/journeys/:reference", element: <JourneyDetailPage /> },
      { path: "/exceptions", element: <ExceptionsPage /> },
      { path: "/artefacts", element: <ArtefactReconciliationPage /> },
      { path: "/staff", element: <StaffDirectoryPage /> },
      { path: "/staff/:staffId", element: <StaffDetailPage /> },
      { path: "/rewards/staff", element: <StaffRewardsPage /> },
      { path: "/rewards/customer", element: <CustomerRewardsPage /> },
      { path: "/campaigns", element: <CampaignsPage /> },
      { path: "/leaderboard", element: <LeaderboardPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/content/consent", element: <ConsentContentPage /> },
      { path: "/content/communications", element: <CommunicationsPage /> },
      { path: "/content/support", element: <SupportContentPage /> },
      { path: "/data/metrics", element: <MetricDefinitionsPage /> },
      { path: "/access", element: <AccessManagementPage /> },
      { path: "/audit", element: <AuditLogsPage /> },
      { path: "/system-health", element: <SystemHealthPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/login" replace /> },
];

export const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
