
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceAnalyticsDashboard } from "@/components/resource-management/ResourceAnalyticsDashboard";
import { InternsSection } from "@/components/dashboard/InternsSection";
import { FinancialSummaryCard } from "@/components/dashboard/FinancialSummaryCard";
import { AddEditEmployeeModal } from "@/components/resources/AddEditEmployeeModal";
import { EmployeeRecordsTable } from "@/components/resources/EmployeeRecordsTable";
import { UpcomingReleases } from "@/components/resources/UpcomingReleases";
import { TrendingUp, DollarSign, GraduationCap, Database, Search, Download, Plus, Users, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import employeeRecordsData from "@/data/employeeRecordsData.json";

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

// KPI Cards data matching the image
const resourceKPIs = [
  {
    title: "Total Resources",
    value: "142",
    subtitle: "Active across all projects",
    change: "+2.5% from last month",
    changeType: "positive",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Billable Resources",
    value: "89",
    subtitle: "62.7% billability rate",
    change: "+5.2% efficiency",
    changeType: "positive",
    icon: TrendingUp,
    gradient: "from-green-500 to-green-600",
  },
  {
    title: "Non-Billable Resources",
    value: "45",
    subtitle: "31.7% bench strength",
    change: "15 in training",
    changeType: "neutral",
    icon: Users,
    gradient: "from-orange-500 to-orange-600",
  },
  {
    title: "Interns",
    value: "8",
    subtitle: "70% conversion rate",
    change: "3 converting soon",
    changeType: "positive",
    icon: GraduationCap,
    gradient: "from-purple-500 to-purple-600",
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
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [employees, setEmployees] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load employee data from JSON file
    setEmployees(employeeRecordsData.employees);
  }, []);

  // Filter employees based on search, department, and status
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment;
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "billable" && employee.billableStatus) ||
                         (filterStatus === "non-billable" && !employee.billableStatus);
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsAddModalOpen(true);
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleViewEmployee = (employee: any) => {
    navigate(`/employee-details/${employee.employeeId}`);
  };

  const handleDeleteEmployee = (employee: any) => {
    setEmployees(prev => prev.filter(emp => emp.employeeId !== employee.employeeId));
    toast({
      title: "Employee Deleted",
      description: `${employee.fullName} has been removed from the system.`,
      variant: "destructive",
    });
  };

  const handleSaveEmployee = (data: any) => {
    if (selectedEmployee) {
      // Edit existing employee
      setEmployees(prev => prev.map(emp => 
        emp.employeeId === selectedEmployee.employeeId ? { ...emp, ...data } : emp
      ));
      toast({
        title: "Success",
        description: "Employee updated successfully.",
      });
    } else {
      // Add new employee
      const newEmployee = {
        ...data,
        employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
        billableStatus: data.billableStatus === "Yes",
      };
      setEmployees(prev => [...prev, newEmployee]);
      toast({
        title: "Success",
        description: "Employee added successfully.",
      });
    }
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleProjectAllocation = () => {
    toast({
      title: "Project Allocation",
      description: "Project allocation feature will be implemented.",
    });
  };

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
          <InternsSection 
            interns={internsData} 
            totalStipendCost={internsData.reduce((sum, intern) => sum + intern.stipend, 0)}
            onViewDetails={() => {}}
          />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <FinancialSummaryCard
            monthlyData={monthlyFinancialData}
            ytdTotals={ytdTotals}
          />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="space-y-6">
            {/* Employee Management Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
              <Button onClick={handleAddEmployee} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
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

            {/* Employee Records Table */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Employee Records ({filteredEmployees.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <EmployeeRecordsTable 
                  employees={filteredEmployees}
                  onView={handleViewEmployee}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddEditEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveEmployee}
        mode="add"
      />

      <AddEditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
        mode="edit"
      />
    </>
  );
};
