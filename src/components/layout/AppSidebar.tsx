
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const mainNavItems = [
  { title: "IT delivery dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderOpen },
  { title: "Resource Management", url: "/resource-management", icon: Users },
  { title: "Escalations", url: "/escalations", icon: AlertTriangle },
];

export function AppSidebar() {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const isActuallyMobile = useIsMobile();
  const collapsed = state === "collapsed";

  const renderNavItem = (item: typeof mainNavItems[0]) => {
    const navButton = (
      <SidebarMenuButton asChild className="w-full group transition-all duration-200 h-12">
        <NavLink 
          to={item.url} 
          end 
          className={({ isActive }) => {
            const baseClasses = "flex items-center w-full transition-all duration-200 rounded-lg relative overflow-hidden h-12 min-h-[3rem]";
            
            const spacingClasses = collapsed && !isMobile 
              ? "justify-center p-3 w-12 h-12 mx-auto" 
              : "justify-start px-4 py-3 gap-3 mx-2";
            
            const activeClasses = isActive 
              ? "bg-blue-50 text-blue-600 font-medium" 
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900";
            
            return `${baseClasses} ${spacingClasses} ${activeClasses}`;
          }}
        >
          {({ isActive }) => (
            <>
              <item.icon className={`h-5 w-5 transition-all duration-200 flex-shrink-0 ${
                isActive ? "text-blue-600" : "text-gray-600 group-hover:text-gray-900"
              }`} />
              
              {(!collapsed || isMobile) && (
                <span className={`text-sm font-medium transition-all duration-200 truncate ${
                  isActive ? "text-blue-600" : "text-gray-700 group-hover:text-gray-900"
                } ${collapsed && !isMobile ? "opacity-0 w-0 ml-0" : "opacity-100 ml-3"}`}>
                  {item.title}
                </span>
              )}
            </>
          )}
        </NavLink>
      </SidebarMenuButton>
    );

    if (collapsed && !isMobile) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {navButton}
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            align="center" 
            className="ml-2 bg-gray-900 text-white border-0 shadow-lg z-50"
            sideOffset={8}
          >
            <p className="font-medium text-sm">{item.title}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return navButton;
  };

  return (
    <TooltipProvider>
      <Sidebar 
        collapsible="icon"
        className={`bg-white border-r border-gray-200 transition-all duration-200 ease-in-out fixed left-0 top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] z-40 ${
          isActuallyMobile ? "shadow-xl" : "shadow-sm"
        }`}
        style={{
          width: collapsed && !isMobile ? '3.5rem' : '16rem',
          minWidth: collapsed && !isMobile ? '3.5rem' : '16rem',
          maxWidth: collapsed && !isMobile ? '3.5rem' : '16rem'
        }}
      >
        <SidebarHeader className="border-b border-gray-200 px-4 py-4 transition-all duration-200">
          <div className={`flex items-center transition-all duration-200 ${
            collapsed && !isMobile ? "justify-center" : "justify-between"
          }`}>
            {(!collapsed || isMobile) && (
              <div className={`flex items-center gap-3 min-w-0 transition-all duration-200 ${
                collapsed && !isMobile ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1"
              }`}>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LayoutDashboard className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-gray-900 text-sm truncate">Navigation</span>
                  <span className="text-xs text-gray-500 truncate">Main Menu</span>
                </div>
              </div>
            )}
            
            {(collapsed && !isMobile) && (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className={`hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0 border border-gray-200 p-2 ${
                collapsed && !isMobile 
                  ? "w-8 h-8 mx-auto mt-2" 
                  : "w-8 h-8"
              }`}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-700" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              )}
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className={`transition-all duration-200 ${
          collapsed && !isMobile ? "px-2 py-4" : "p-4"
        }`}>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="group">
                    {renderNavItem(item)}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}
