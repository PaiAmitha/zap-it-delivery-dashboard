import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, UserX, GraduationCap, Settings, Calendar } from "lucide-react";
import { ResourceKPISection } from "@/components/resource-management/ResourceKPISection";
import { RMQuickActionsCard } from "@/components/resource-management/RMQuickActionsCard";
import { UpcomingReleasesTab } from "@/components/resource-management/UpcomingReleasesTab";
import { ResourcesTab } from "@/components/resource-management/ResourcesTab";
import { ResignationsTab } from "@/components/resource-management/ResignationsTab";
import { InternManagementTab } from "@/components/resource-management/InternManagementTab";
import { FinancialsTab } from "@/components/resource-management/FinancialsTab";
import { useIsMobile } from "@/hooks/use-mobile";

import { useEffect, useState } from "react";
import { getLocations } from "@/lib/api";

const ResourceManagement = () => {
  const isMobile = useIsMobile();
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const result = await getLocations(token);
        setLocations(result.locations || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch locations');
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 animate-fade-in-up">
      <div className="w-full space-y-4 sm:space-y-6">
        <div className="px-1 sm:px-0">
          <BreadcrumbNavigation />
        </div>
        
        {/* Enhanced Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 px-1 sm:px-0">
          <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl border-0">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-white/10 rounded-full -translate-y-12 sm:-translate-y-16 lg:-translate-y-20 translate-x-12 sm:translate-x-16 lg:translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/5 rounded-full translate-y-8 sm:translate-y-10 lg:translate-y-12 -translate-x-8 sm:-translate-x-10 lg:-translate-x-12"></div>
              
              <div className="relative z-10">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4">
                  Resource Management Dashboard
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-blue-100 max-w-full sm:max-w-2xl lg:max-w-3xl">
                  {isMobile 
                    ? "Strategic resource planning and workforce management"
                    : "Strategic resource planning and comprehensive workforce management for optimal project delivery"
                  }
                </p>
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-100/80">
                  <span className="font-medium">Available Locations:</span>
                  <span className="ml-2">
                    {loading && 'Loading...'}
                    {error && <span className="text-red-200">{error}</span>}
                    {!loading && !error && (
                      isMobile
                        ? `${locations.slice(0, 3).join(' • ')}${locations.length > 3 ? '...' : ''}`
                        : locations.join(' • ')
                    )}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="animate-slide-in-right px-1 sm:px-0" style={{ animationDelay: '0.2s' }}>
          <ResourceKPISection />
        </div>

        {/* RM Quick Actions Card */}
        <div className="animate-slide-in-right px-1 sm:px-0" style={{ animationDelay: '0.4s' }}>
          <RMQuickActionsCard />
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="animate-slide-in-right px-1 sm:px-0" style={{ animationDelay: '0.6s' }}>
          <Tabs defaultValue="upcoming-releases" className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-5 min-w-fit bg-white shadow-sm border rounded-xl p-1 sm:p-2">
                <TabsTrigger 
                  value="upcoming-releases" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-2 lg:px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden lg:inline">Upcoming Releases</span>
                  <span className="lg:hidden">Releases</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="resources" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-2 lg:px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Resources</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="resignations" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-2 lg:px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <UserX className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden md:inline">Resignations</span>
                  <span className="md:hidden">Exits</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="intern-management" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-2 lg:px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Interns</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="financial" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-2 lg:px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden md:inline">Financials</span>
                  <span className="md:hidden">Finance</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming-releases" className="space-y-3 sm:space-y-4 lg:space-y-6 mt-4 sm:mt-6 animate-fade-in-up">
              <UpcomingReleasesTab />
            </TabsContent>

            <TabsContent value="resources" className="space-y-3 sm:space-y-4 lg:space-y-6 mt-4 sm:mt-6 animate-fade-in-up">
              <ResourcesTab />
            </TabsContent>

            <TabsContent value="resignations" className="space-y-3 sm:space-y-4 lg:space-y-6 mt-4 sm:mt-6 animate-fade-in-up">
              <ResignationsTab />
            </TabsContent>

            <TabsContent value="intern-management" className="space-y-3 sm:space-y-4 lg:space-y-6 mt-4 sm:mt-6 animate-fade-in-up">
              <InternManagementTab />
            </TabsContent>

            <TabsContent value="financial" className="space-y-3 sm:space-y-4 lg:space-y-6 mt-4 sm:mt-6 animate-fade-in-up">
              <FinancialsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;
