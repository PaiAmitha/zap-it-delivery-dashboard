
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ResourceManagement from "./pages/ResourceManagement";
import FinancialDepartment from "./pages/FinancialDepartment";
import Escalations from "./pages/Escalations";
import EscalationDetails from "./pages/EscalationDetails";
import Settings from "./pages/Settings";
import AddResource from "./pages/AddResource";
import AddProject from "./pages/AddProject";
import ProjectAllocation from "./pages/ProjectAllocation";
import ResourceOverview from "./pages/ResourceOverview";
import ProjectDetails from "./pages/ProjectDetails";
import ResourceDetails from "./pages/ResourceDetails";
import ResourceView from "./pages/ResourceView";
import Resources from "./pages/Resources";
import ResourceList from "./pages/ResourceList";
import EmployeeProfile from "./pages/EmployeeProfile";
import TotalResourcesKPI from "./pages/TotalResourcesKPI";
import BillableResourcesKPI from "./pages/BillableResourcesKPI";
import NonBillableResourcesKPI from "./pages/NonBillableResourcesKPI";
import InternsKPI from "./pages/InternsKPI";
import EngagementPlan from "./pages/EngagementPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <DashboardLayout />
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="resource-management" element={<ResourceManagement />} />
            <Route path="resource-management/total-resources" element={<TotalResourcesKPI />} />
            <Route path="resource-management/billable-resources" element={<BillableResourcesKPI />} />
            <Route path="resource-management/non-billable-resources" element={<NonBillableResourcesKPI />} />
            <Route path="resource-management/interns" element={<InternsKPI />} />
            <Route path="resource-management/bench-cost" element={<ResourceOverview />} />
            <Route path="resource-management/resource-list/:filterType/:filterValue" element={<ResourceList />} />
            <Route path="resource-management/resource-list/:filterType/:filterValue/:employeeId" element={<EmployeeProfile />} />
            <Route path="resource-list/:filterType/:filterValue" element={<ResourceList />} />
            <Route path="resource-list/:filterType/:filterValue/:employeeId" element={<EmployeeProfile />} />
            <Route path="employee-profile/:employeeId" element={<EmployeeProfile />} />
            <Route path="financial-department" element={<FinancialDepartment />} />
            <Route path="settings" element={<Settings />} />
            <Route path="add-resource" element={<AddResource />} />
            <Route path="add-project" element={<AddProject />} />
            <Route path="project-allocation" element={<ProjectAllocation />} />
            <Route path="engagement-plan" element={<EngagementPlan />} />
            <Route path="resource-overview" element={<ResourceOverview />} />
            <Route path="escalations" element={<Escalations />} />
            <Route path="escalations/:id" element={<EscalationDetails />} />
            <Route path="resources" element={<Resources />} />
            <Route path="project-details/:projectId" element={<ProjectDetails />} />
            <Route path="resource-details/:employeeId" element={<ResourceDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
