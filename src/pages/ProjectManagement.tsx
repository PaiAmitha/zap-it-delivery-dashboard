import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectHealthTable } from "@/components/dashboard/ProjectHealthTable";
import { ResourceOverviewCard } from "@/components/dashboard/ResourceOverviewCard";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { Link } from "react-router-dom";
import { Plus, FolderPlus } from "lucide-react";
import { getProjects } from "@/lib/api";

const ProjectManagement = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resourceOverviewData = {
    totalEngineers: 85,
    benchPercentage: 15,
    allocationPercentage: 87,
    roleDistribution: [
      { role: "Frontend", count: 25, percentage: 29 },
      { role: "Backend", count: 30, percentage: 35 },
      { role: "DevOps", count: 12, percentage: 14 },
      { role: "QA", count: 18, percentage: 22 }
    ],
    experienceDistribution: [
      { level: "Junior", count: 20, percentage: 24 },
      { level: "Mid", count: 40, percentage: 47 },
      { level: "Senior", count: 25, percentage: 29 }
    ],
    billableRatio: {
      billable: 72,
      nonBillable: 13,
      billablePercentage: 85
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const data = await getProjects(token) as { projects?: any[] } | any[];
        setProjects(Array.isArray(data) ? data : (data.projects || []));
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <div className="w-full">
        <BreadcrumbNavigation />
      </div>
      {loading && (
        <Card className="mx-1 sm:mx-0">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Loading projects...</p>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="mx-1 sm:mx-0">
          <CardContent className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}
      {!loading && !error && (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">Project Management</h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Monitor project health, resources, and delivery metrics</p>
            </div>
            <Link to="/add-project" className="flex-shrink-0 w-full sm:w-auto">
              <Button className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Project</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <Link to="/add-project" className="w-full">
                  <Button className="w-full h-16 sm:h-20 flex flex-col gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 transition-all duration-200" variant="outline">
                    <FolderPlus className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-xs sm:text-sm font-medium">Create New Project</span>
                  </Button>
                </Link>
                <Link to="/project-allocation" className="w-full">
                  <Button className="w-full h-16 sm:h-20 flex flex-col gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 transition-all duration-200" variant="outline">
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-xs sm:text-sm font-medium">Allocate Resources</span>
                  </Button>
                </Link>
                <Link to="/resource-management" className="w-full">
                  <Button className="w-full h-16 sm:h-20 flex flex-col gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 transition-all duration-200" variant="outline">
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-xs sm:text-sm font-medium">Manage Resources</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="w-full">
            <ResourceOverviewCard {...resourceOverviewData} />
          </div>

          <div className="w-full">
            <ProjectHealthTable projects={projects} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectManagement;
