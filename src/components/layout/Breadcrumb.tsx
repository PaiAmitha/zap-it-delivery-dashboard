
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/resource-management": "Resource Management",
  "/resource-management/total-resources": "Total Resources",
  "/resource-management/billable-resources": "Billable Resources", 
  "/resource-management/non-billable-resources": "Non-Billable Resources",
  "/resource-management/interns": "Interns",
  "/resource-details": "Resource Details",
  "/add-resource": "Add Resource",
  "/add-project": "Add Project",
  "/project-allocation": "Project Allocation",
  "/financial-department": "Financial Department",
  "/settings": "Settings",
  "/resources": "All Resources",
  "/project-management": "Project Management",
  "/resource-overview": "Resource Overview",
  "/escalations": "Escalations",
  "/login": "Login"
};

// Define hierarchical routes that should show parent breadcrumbs
const hierarchicalRoutes: Record<string, string[]> = {
  "/add-project": ["/", "/resource-management"],
  "/project-allocation": ["/", "/resource-management"],
  "/resource-management/total-resources": ["/", "/resource-management"],
  "/resource-management/billable-resources": ["/", "/resource-management"],
  "/resource-management/non-billable-resources": ["/", "/resource-management"],
  "/resource-management/interns": ["/", "/resource-management"],
  "/add-resource": ["/", "/resource-management"],
  "/resources": ["/", "/resource-management"],
  "/resource-details/billable": ["/", "/resource-management"],
  "/resource-details/non-billable": ["/", "/resource-management"],
  "/resource-details/interns": ["/", "/resource-management"],
  "/resource-details/total": ["/", "/resource-management"],
  "/resource-overview": ["/", "/project-management"],
  "/financial-department": ["/"],
  "/escalations": ["/"],
  "/settings": ["/"]
};

export const Breadcrumb = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Handle project details pages specifically
  if (currentPath.startsWith('/project-details')) {
    return (
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
        <Link 
          to="/" 
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link 
          to="/project-management" 
          className="hover:text-foreground transition-colors"
        >
          Project Management
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="font-medium text-foreground">Project Details</span>
      </nav>
    );
  }

  // Handle escalation details pages
  if (currentPath.startsWith('/escalations/') && currentPath !== '/escalations') {
    return (
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
        <Link 
          to="/" 
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link 
          to="/escalations" 
          className="hover:text-foreground transition-colors"
        >
          Escalations
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="font-medium text-foreground">Escalation Details</span>
      </nav>
    );
  }

  // Check if current path has defined hierarchical structure
  const parentPaths = hierarchicalRoutes[currentPath];
  
  if (parentPaths) {
    const breadcrumbs = [
      ...parentPaths.map(path => ({
        label: routeLabels[path] || "Unknown",
        path
      })),
      {
        label: routeLabels[currentPath] || currentPath.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        path: currentPath
      }
    ];

    return (
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.path} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
            {index === 0 ? (
              <Link 
                to={breadcrumb.path} 
                className="flex items-center hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4 mr-1" />
                {breadcrumb.label}
              </Link>
            ) : index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{breadcrumb.label}</span>
            ) : (
              <Link 
                to={breadcrumb.path} 
                className="hover:text-foreground transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    );
  }

  // Default breadcrumb generation for other routes
  const pathSegments = currentPath.split("/").filter(Boolean);

  // If we're on the dashboard, don't show breadcrumbs
  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbs = [
    { label: "Dashboard", path: "/" },
    ...pathSegments.map((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/");
      let label = routeLabels[path];
      
      if (!label) {
        label = segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      }
      
      return { label, path };
    })
  ];

  // Remove duplicate dashboard entries
  const uniqueBreadcrumbs = breadcrumbs.filter((breadcrumb, index, array) => 
    index === 0 || breadcrumb.path !== array[0].path
  );

  if (uniqueBreadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {uniqueBreadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {index === 0 ? (
            <Link 
              to={breadcrumb.path} 
              className="flex items-center hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              {breadcrumb.label}
            </Link>
          ) : index === uniqueBreadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{breadcrumb.label}</span>
          ) : (
            <Link 
              to={breadcrumb.path} 
              className="hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </Link>
            )}
        </div>
      ))}
    </nav>
  );
};
