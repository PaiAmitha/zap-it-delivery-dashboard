
import { AppSidebar } from "./AppSidebar";
import { EnhancedNavigation } from "./EnhancedNavigation";
import { Outlet } from "react-router-dom";
import { GlobalDateProvider } from "@/contexts/GlobalDateContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardLayout() {
  const isMobile = useIsMobile();

  return (
    <GlobalDateProvider>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex flex-col bg-gray-50 w-full">
          {/* Fixed top navigation spanning full width - responsive height */}
          <div className="w-full flex-shrink-0 z-50 bg-white border-b border-gray-200 fixed top-0 left-0 right-0">
            <EnhancedNavigation />
          </div>
          
          {/* Main layout container with responsive top padding */}
          <div className="flex flex-1 w-full pt-16 sm:pt-20 lg:pt-20">
            {/* Sidebar - hidden on mobile, managed by SidebarProvider */}
            <div className="flex-shrink-0 z-40 hidden md:block">
              <AppSidebar />
            </div>
            
            {/* Main content area with responsive padding and margins */}
            <main className="flex-1 transition-all duration-300 ease-in-out bg-gray-50 min-w-0 overflow-auto">
              <div className="w-full h-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </GlobalDateProvider>
  );
}
