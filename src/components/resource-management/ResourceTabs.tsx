import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceAnalyticsDashboard } from "@/components/resource-management/ResourceAnalyticsDashboard";
import { InternsSection } from "@/components/dashboard/InternsSection";
import { FinancialSummaryCard } from "@/components/dashboard/FinancialSummaryCard";
import { AddEditResourceModal } from "@/components/resources/AddEditResourceModal";
import { ResourceTable } from "@/components/resources/ResourceTable";
import { UpcomingReleases } from "@/components/resources/UpcomingReleases";
import { TrendingUp, DollarSign, GraduationCap, Database, Search, Download, Plus, Users, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ResourceTabsProps {
  seniorityData: any[];
  skillData: any[];
  agingData: any[];
  engagementData: any[];
  internsData: any[];
  monthlyFinancialData: any[];
  ytdTotals: any;
}

// Sample upcoming releases data
const sampleReleases = [
  {
    id: "1",
    name: "Alex Rodriguez",
    releaseDate: "Aug 15, 2025",
    currentProject: "Project Alpha",
    utilization: 85,
    status: "confirmed" as const,
    skills: ["React", "Node.js", "TypeScript", "AWS"],
  },
  {
    id: "2",
    name: "Emma Thompson",
    releaseDate: "Sep 1, 2025",
    currentProject: "Project Beta",
    utilization: 90,
    status: "tentative" as const,
    skills: ["Selenium", "Jest", "API Testing", "Automation"],
  },
];

export const ResourceTabs = ({
  seniorityData,
  skillData,
  agingData,
  engagementData,
  internsData,
  monthlyFinancialData,
  ytdTotals
}: ResourceTabsProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [resources, setResources] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch resource data from backend
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const result = await import('@/lib/api').then(api => api.getResources(token));
        setResources(Array.isArray(result) ? result : []);
      } catch (err) {
        setResources([]);
      }
    };
    fetchResources();
    // Fetch dashboard data
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const data = await fetchDashboard();
        setDashboard(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchDashboard();
  }, []);

  // Filter resources based on search, department, and status
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.designation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === "all" || resource.department === filterDepartment;
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "billable" && resource.billableStatus) ||
                         (filterStatus === "non-billable" && !resource.billableStatus);
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddResource = () => {
    setSelectedResource(null);
    setIsAddModalOpen(true);
  };

  const handleEditResource = (resource: any) => {
    navigate("/add-resource", { state: { resource, mode: "edit" } });
  };

  const handleViewResource = (resource: any) => {
    navigate(`/resource-details/${resource.employeeId}`);
  };

  const handleDeleteResource = (resource: any) => {
    setResources(prev => prev.filter(res => res.employeeId !== resource.employeeId));
    toast({
      title: "Resource Deleted",
      description: `${resource.fullName} has been removed from the system.`,
      variant: "destructive",
    });
  };

  const handleSaveResource = (data: any) => {
    if (selectedResource) {
      // Edit existing resource (local only)
      setResources(prev => prev.map(res => 
        res.employeeId === selectedResource.employeeId ? { ...res, ...data, billableStatus: normalizeBillableStatus(data.billableStatus) } : res
      ));
      toast({
        title: "Success",
        description: "Resource updated successfully.",
      });
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedResource(null);
      return;
    }

    // Add new resource via backend
    const token = localStorage.getItem('token') || '';
    const newResource = {
      ...data,
      billableStatus: normalizeBillableStatus(data.billableStatus),
      fullName: data.fullName || '',
      designation: data.designation || '',
      department: data.department || '',
      seniorityLevel: data.seniorityLevel || '',
      experience: data.experience || '',
      location: data.location || '',
      joiningDate: data.joiningDate || '',
      employmentType: data.employmentType || 'FTE',
      reportingManager: data.reportingManager || '',
      primarySkills: data.primarySkills || [],
      skillCategory: data.skillCategory || '',
      currentEngagement: data.currentEngagement || '',
      projectName: data.projectName || '',
      projectDescription: data.projectDescription || '',
      engagementStartDate: data.engagementStartDate || '',
      engagementEndDate: data.engagementEndDate || '',
      monthlySalary: data.monthlySalary || '',
    };
    import('@/lib/api').then(api => {
      api.createResource(token, newResource)
        .then((created: any) => {
          setResources(prev => [...prev, created]);
          toast({
            title: "Success",
            description: "Resource added successfully.",
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to add resource. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedResource(null);
        });
    });
  };

  // Helper to normalize billableStatus to boolean
  function normalizeBillableStatus(val: any) {
    if (typeof val === 'boolean') {
      return val;
    }
    if (typeof val === 'string') {
      return val.toLowerCase() === 'billable' || val.toLowerCase() === 'yes' || val === 'true';
    }
    return false;
  }

  // Handlers for releases
  const handleViewReleaseDetails = (release: any) => {
    toast({
      title: "View Details",
      description: `Viewing details for ${release.name}`,
    });
  };

  const handleAllocateToProject = (release: any) => {
    toast({
      title: "Allocate to Project",
      description: `Allocating ${release.name} to a new project`,
    });
  };

  // Dynamic KPI data from backend
  const resourceKPIs = dashboard ? [
    {
      title: "Total Resources",
      value: dashboard.total_resources,
      subtitle: "Active across all projects",
      change: dashboard.monthly_growth ? `+${dashboard.monthly_growth}% from last month` : undefined,
      changeType: dashboard.monthly_growth && dashboard.monthly_growth > 0 ? "positive" : "neutral",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Billable Resources",
      value: dashboard.billable_resources_count,
      subtitle: dashboard.total_resources ? `${((dashboard.billable_resources_count / dashboard.total_resources) * 100).toFixed(1)}% billability rate` : undefined,
      change: dashboard.billable_resources_count && dashboard.total_resources ? `+${((dashboard.billable_resources_count / dashboard.total_resources) * 100).toFixed(1)}% efficiency` : undefined,
      changeType: "positive",
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Non-Billable Resources",
      value: dashboard.non_billable_resources_count,
      subtitle: dashboard.total_resources ? `${((dashboard.non_billable_resources_count / dashboard.total_resources) * 100).toFixed(1)}% bench strength` : undefined,
      change: dashboard.non_billable_resources_count ? `${dashboard.non_billable_resources_count} in training` : undefined,
      changeType: "neutral",
      icon: Users,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Interns",
      value: dashboard.total_interns,
      subtitle: dashboard.intern_conversion_rate ? `${dashboard.intern_conversion_rate}% conversion rate` : undefined,
      change: dashboard.interns_converting_soon ? `${dashboard.interns_converting_soon} converting soon` : undefined,
      changeType: "positive",
      icon: GraduationCap,
      gradient: "from-purple-500 to-purple-600",
    },
  ] : [];
  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {resourceKPIs.map((kpi, index) => (
          <Card key={index} className={`cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-r ${kpi.gradient} text-white`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm opacity-90 mb-1">{kpi.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{kpi.value}</p>
                  </div>
                  <p className="text-xs opacity-75 mt-1">{kpi.subtitle}</p>
                  {kpi.change && (
                    <p className="text-xs opacity-75 mt-1">{kpi.change}</p>
                  )}
                </div>
                <kpi.icon className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Releases - Outside of tabs */}
      <UpcomingReleases 
        releases={sampleReleases}
        onViewDetails={handleViewReleaseDetails}
        onAllocateToProject={handleAllocateToProject}
      />

      {/* Tabs */}
      <Tabs defaultValue="resources" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-5 min-w-fit">
            <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming-releases" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Upcoming Releases</span>
              <span className="sm:hidden">Releases</span>
            </TabsTrigger>
            <TabsTrigger value="interns" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Interns</span>
              <span className="sm:hidden">Interns</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Financial</span>
              <span className="sm:hidden">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Resources</span>
              <span className="sm:hidden">Resources</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <ResourceAnalyticsDashboard
            seniorityData={seniorityData}
            skillData={skillData}
            agingData={agingData}
            engagementData={engagementData}
            onViewDetails={() => {}}
          />
        </TabsContent>

        <TabsContent value="upcoming-releases" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Upcoming Releases</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingReleases 
                releases={sampleReleases}
                onViewDetails={handleViewReleaseDetails}
                onAllocateToProject={handleAllocateToProject}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interns" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <InternsSection />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <FinancialSummaryCard
            monthlyData={monthlyFinancialData}
            ytdTotals={ytdTotals}
          />
        </TabsContent>


        <TabsContent value="resources" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="space-y-6">
            {/* Resource Management Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
              <Button onClick={handleAddResource} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Resource
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="billable">Billable</SelectItem>
                  <SelectItem value="non-billable">Non-Billable</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>

            {/* Resource Records Table */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Resource Records ({filteredResources.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ResourceTable 
                  resources={filteredResources}
                  onView={handleViewResource}
                  onEdit={handleEditResource}
                  onDelete={handleDeleteResource}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}


    </>
  );
};
