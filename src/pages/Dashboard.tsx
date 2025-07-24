import { useState, useEffect } from "react";
import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { useGlobalDate } from "@/contexts/GlobalDateContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { getDashboard, DashboardData } from "@/lib/api";

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { selectedDateRange } = useGlobalDate();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const sidebarCollapsed = state === "collapsed";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with real auth token logic
        const token = localStorage.getItem('token') || '';
        const dashboard = await getDashboard(token);
        setData(dashboard);
        setActiveProjects(dashboard.active_projects || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDateRange]);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "Green": return "bg-emerald-100 text-emerald-800";
      case "Amber": return "bg-amber-100 text-amber-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const handleViewProjectDetails = (projectId: number) => {
    navigate(`/project-details/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 sm:h-64 w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-32 sm:h-64 w-full">
        <div className="text-center">
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 w-full max-w-none">
      <div className="w-full max-w-none space-y-4 sm:space-y-6">
        <div className="w-full max-w-none px-1 sm:px-0">
          <BreadcrumbNavigation />
        </div>

        {/* Enhanced KPIs Section */}
        <div className="w-full max-w-none px-1 sm:px-0">
          <DashboardKPIs />
        </div>

        {/* Active Projects Overview Section */}
        <div className="w-full max-w-none px-1 sm:px-0">
          <Card className="border-0 shadow-sm bg-white w-full max-w-none">
            <CardContent className="px-3 sm:px-6 w-full max-w-none">
              {activeProjects.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500 text-base">
                  No active projects found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
                  {activeProjects.map((project) => (
                    <div key={project.id}>
                      <Card className="border border-gray-200 hover:shadow-md transition-shadow w-full">
                        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                                {project.name}
                              </CardTitle>
                              <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                              <p className="text-xs sm:text-sm font-medium text-blue-600 truncate">{project.customer}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 px-3 sm:px-4">
                          <div className="space-y-3 sm:space-y-4">
                            {/* Health Status and On-Time Percentage */}
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Health Status</p>
                                <Badge className={`${getHealthStatusColor(project.healthStatus)} text-xs`}>
                                  {project.healthStatus}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">On-Time</p>
                                <p className="text-base sm:text-lg font-bold text-gray-900">
                                  {project.onTimePercentage}%
                                </p>
                              </div>
                            </div>
                            {/* Progress Bar */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-500">Progress</p>
                                <p className="text-xs font-medium text-gray-700">{project.progress}%</p>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                            {/* Team Size and Actions */}
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="text-xs sm:text-sm">{project.teamSize} members</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                                onClick={() => handleViewProjectDetails(project.id)}
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span className="hidden sm:inline">View Details</span>
                                <span className="sm:hidden">View</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
