
import { useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemData {
  label: string;
  path: string;
  isActive?: boolean;
}

export const BreadcrumbNavigation = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment !== '');

  const getBreadcrumbItems = (): BreadcrumbItemData[] => {
    const items: BreadcrumbItemData[] = [
      { label: "Dashboard", path: "/" }
    ];

    if (pathSegments.length === 0) {
      return items;
    }

    // Handle resource-view pages (Resource Details)
    if (pathSegments[0] === "resource-view") {
      items.push(
        { label: "Resource Management", path: "/resource-management" },
        { label: "Resource Details", path: location.pathname, isActive: true }
      );
    } else if (pathSegments[0] === "project-details") {
      items.push(
        { label: "Projects", path: "/projects" },
        { label: "Project Details", path: location.pathname, isActive: true }
      );
    } else if (pathSegments[0] === "resource-management") {
      items.push({ label: "Resource Management", path: "/resource-management" });
      
      if (pathSegments[1] === "resource-list") {
        items.push({ label: "Resource List", path: `/resource-management/resource-list/${pathSegments[2]}/${pathSegments[3]}` });
        
        if (pathSegments[4]) {
          items.push({ label: pathSegments[4], path: location.pathname, isActive: true });
        }
      }
    } else if (pathSegments[0] === "resource-list") {
      items.push({ label: "Resource Management", path: "/resource-management" });
      items.push({ label: "Resource List", path: `/resource-list/${pathSegments[1]}/${pathSegments[2]}` });
      
      if (pathSegments[3]) {
        items.push({ label: pathSegments[3], path: location.pathname, isActive: true });
      }
    } else if (pathSegments[0] === "employee-profile") {
      items.push(
        { label: "Resource Management", path: "/resource-management" },
        { label: "Resource List", path: "/resource-management" },
        { label: pathSegments[1], path: location.pathname, isActive: true }
      );
    } else {
      // Default handling for other routes
      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === pathSegments.length - 1;
        const label = segment.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        items.push({
          label,
          path: currentPath,
          isActive: isLast
        });
      });
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={item.path}>
              {item.isActive ? (
                <BreadcrumbPage className="text-blue-600 font-medium">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path} className="text-gray-600 hover:text-blue-600 transition-colors">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
