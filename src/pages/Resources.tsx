import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, Eye, Search, Filter, Plus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";

interface Resource {
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  seniorityLevel: string;
  experience: number;
  location: string;
  joiningDate: string;
  employmentType: string;
  reportingManager: string;
  primarySkill: string;
  skillCategory: string;
  billableStatus: boolean;
  currentEngagement: string;
  projectName?: string;
  engagementDescription: string;
  agingInNonBillable: number;
  monthlySalaryCost: number;
  billingRate?: number;
  monthlyRevenueGenerated: number;
  isIntern: boolean;
}

const Resources = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample data - replace with actual API calls
  const resources: Resource[] = [
    {
      employeeId: "EMP001",
      fullName: "John Doe",
      designation: "Senior React Developer",
      department: "Engineering",
      seniorityLevel: "Senior (6+ yrs)",
      experience: 8,
      location: "Bangalore",
      joiningDate: "2023-01-15",
      employmentType: "FTE",
      reportingManager: "Jane Smith",
      primarySkill: "React.js",
      skillCategory: "Application Development",
      billableStatus: true,
      currentEngagement: "Client Project",
      projectName: "E-commerce Platform",
      engagementDescription: "Frontend development for client",
      agingInNonBillable: 0,
      monthlySalaryCost: 12000,
      billingRate: 150,
      monthlyRevenueGenerated: 18000,
      isIntern: false,
    },
    {
      employeeId: "EMP002",
      fullName: "Sarah Wilson",
      designation: "QA Engineer",
      department: "Quality Assurance",
      seniorityLevel: "Mid-Senior (3-6 yrs)",
      experience: 5,
      location: "Hyderabad",
      joiningDate: "2022-08-20",
      employmentType: "FTE",
      reportingManager: "Mike Johnson",
      primarySkill: "Test Automation",
      skillCategory: "QA",
      billableStatus: false,
      currentEngagement: "In Training",
      engagementDescription: "Advanced QA Training Module",
      agingInNonBillable: 30,
      monthlySalaryCost: 8000,
      monthlyRevenueGenerated: 0,
      isIntern: false,
    },
    {
      employeeId: "EMP003",
      fullName: "David Brown",
      designation: "DevOps Engineer",
      department: "DevOps",
      seniorityLevel: "Mid-Senior (3-6 yrs)",
      experience: 4,
      location: "Pune",
      joiningDate: "2023-03-10",
      employmentType: "FTE",
      reportingManager: "Lisa Davis",
      primarySkill: "Kubernetes",
      skillCategory: "DevOps",
      billableStatus: true,
      currentEngagement: "Client Project",
      projectName: "Infrastructure Setup",
      engagementDescription: "Cloud infrastructure management",
      agingInNonBillable: 0,
      monthlySalaryCost: 10000,
      billingRate: 120,
      monthlyRevenueGenerated: 14400,
      isIntern: false,
    },
    {
      employeeId: "EMP004",
      fullName: "Priya Sharma",
      designation: "Junior Developer",
      department: "Engineering",
      seniorityLevel: "Junior (1-3 yrs)",
      experience: 2,
      location: "Bangalore",
      joiningDate: "2024-02-15",
      employmentType: "FTE",
      reportingManager: "John Doe",
      primarySkill: "JavaScript",
      skillCategory: "Application Development",
      billableStatus: false,
      currentEngagement: "Shadow",
      engagementDescription: "Shadowing senior developer",
      agingInNonBillable: 45,
      monthlySalaryCost: 6000,
      monthlyRevenueGenerated: 0,
      isIntern: false,
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || resource.department === departmentFilter;
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "billable" && resource.billableStatus) ||
                         (statusFilter === "non-billable" && !resource.billableStatus && !resource.isIntern) ||
                         (statusFilter === "intern" && resource.isIntern);
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleEdit = (employeeId: string) => {
    navigate(`/resource-details/edit/${employeeId}`);
  };

  const handleView = (employeeId: string) => {
    navigate(`/resource-view/${employeeId}`);
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <BreadcrumbNavigation />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employee Records ({filteredResources.length})</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and view all employee resources</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link to="/add-resource" className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, ID, or designation"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Project Management">Project Management</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="billable">Billable</SelectItem>
                  <SelectItem value="non-billable">Non-Billable</SelectItem>
                  <SelectItem value="intern">Interns</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setDepartmentFilter("all");
                setStatusFilter("all");
              }} className="w-full">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resource Table */}
        <Tabs defaultValue="hr" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 min-w-fit bg-white shadow-sm border rounded-xl p-2">
              <TabsTrigger value="hr" className="text-xs sm:text-sm px-2 sm:px-4">HR Data Section</TabsTrigger>
              <TabsTrigger value="resource" className="text-xs sm:text-sm px-2 sm:px-4">Resource Management</TabsTrigger>
              <TabsTrigger value="intern" className="text-xs sm:text-sm px-2 sm:px-4">Intern Section</TabsTrigger>
              <TabsTrigger value="finance" className="text-xs sm:text-sm px-2 sm:px-4">Finance Section</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="hr" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>HR Data Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Employee ID</TableHead>
                        <TableHead className="min-w-[150px]">Full Name</TableHead>
                        <TableHead className="min-w-[180px]">Designation</TableHead>
                        <TableHead className="min-w-[130px]">Department</TableHead>
                        <TableHead className="min-w-[150px]">Seniority Level</TableHead>
                        <TableHead className="min-w-[100px]">Experience (Years)</TableHead>
                        <TableHead className="min-w-[100px]">Location</TableHead>
                        <TableHead className="min-w-[120px]">Joining Date</TableHead>
                        <TableHead className="min-w-[130px]">Employment Type</TableHead>
                        <TableHead className="min-w-[150px]">Reporting Manager</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResources.map((resource) => (
                        <TableRow key={resource.employeeId}>
                          <TableCell className="font-medium">{resource.employeeId}</TableCell>
                          <TableCell>{resource.fullName}</TableCell>
                          <TableCell>{resource.designation}</TableCell>
                          <TableCell>{resource.department}</TableCell>
                          <TableCell>{resource.seniorityLevel}</TableCell>
                          <TableCell>{resource.experience}</TableCell>
                          <TableCell>{resource.location}</TableCell>
                          <TableCell>{resource.joiningDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{resource.employmentType}</Badge>
                          </TableCell>
                          <TableCell>{resource.reportingManager}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleView(resource.employeeId)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(resource.employeeId)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resource" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Management Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Employee ID</TableHead>
                        <TableHead className="min-w-[150px]">Name</TableHead>
                        <TableHead className="min-w-[120px]">Primary Skill</TableHead>
                        <TableHead className="min-w-[130px]">Skill Category</TableHead>
                        <TableHead className="min-w-[120px]">Billable Status</TableHead>
                        <TableHead className="min-w-[150px]">Current Engagement</TableHead>
                        <TableHead className="min-w-[150px]">Project Name</TableHead>
                        <TableHead className="min-w-[200px]">Engagement Description</TableHead>
                        <TableHead className="min-w-[100px]">Aging (Days)</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResources.map((resource) => (
                        <TableRow key={resource.employeeId}>
                          <TableCell className="font-medium">{resource.employeeId}</TableCell>
                          <TableCell>{resource.fullName}</TableCell>
                          <TableCell>{resource.primarySkill}</TableCell>
                          <TableCell>{resource.skillCategory}</TableCell>
                          <TableCell>
                            <Badge variant={resource.billableStatus ? "default" : "secondary"}>
                              {resource.billableStatus ? "Billable" : "Non-Billable"}
                            </Badge>
                          </TableCell>
                          <TableCell>{resource.currentEngagement}</TableCell>
                          <TableCell>{resource.projectName || "-"}</TableCell>
                          <TableCell>{resource.engagementDescription}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={resource.agingInNonBillable > 60 ? "destructive" : 
                                     resource.agingInNonBillable > 30 ? "outline" : "secondary"}
                            >
                              {resource.agingInNonBillable}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleView(resource.employeeId)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(resource.employeeId)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intern" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Intern Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Employee ID</TableHead>
                        <TableHead className="min-w-[150px]">Name</TableHead>
                        <TableHead className="min-w-[100px]">Is Intern</TableHead>
                        <TableHead className="min-w-[150px]">Internship Start Date</TableHead>
                        <TableHead className="min-w-[150px]">Internship End Date</TableHead>
                        <TableHead className="min-w-[150px]">Assigned Project</TableHead>
                        <TableHead className="min-w-[120px]">Mentor Name</TableHead>
                        <TableHead className="min-w-[100px]">Stipend</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResources.map((resource) => (
                        <TableRow key={resource.employeeId}>
                          <TableCell className="font-medium">{resource.employeeId}</TableCell>
                          <TableCell>{resource.fullName}</TableCell>
                          <TableCell>
                            <Badge variant={resource.isIntern ? "default" : "secondary"}>
                              {resource.isIntern ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell>{resource.isIntern ? "2025-06-01" : "-"}</TableCell>
                          <TableCell>{resource.isIntern ? "2025-08-31" : "-"}</TableCell>
                          <TableCell>{resource.isIntern ? "Dashboard Redesign" : "-"}</TableCell>
                          <TableCell>{resource.isIntern ? "Sarah Wilson" : "-"}</TableCell>
                          <TableCell>{resource.isIntern ? "$2,500" : "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleView(resource.employeeId)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(resource.employeeId)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Finance Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Employee ID</TableHead>
                        <TableHead className="min-w-[150px]">Name</TableHead>
                        <TableHead className="min-w-[150px]">Monthly Salary Cost</TableHead>
                        <TableHead className="min-w-[120px]">Billing Rate</TableHead>
                        <TableHead className="min-w-[180px]">Monthly Revenue Generated</TableHead>
                        <TableHead className="min-w-[120px]">Cost Center</TableHead>
                        <TableHead className="min-w-[130px]">Total YTD Cost</TableHead>
                        <TableHead className="min-w-[150px]">Total YTD Revenue</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResources.map((resource) => (
                        <TableRow key={resource.employeeId}>
                          <TableCell className="font-medium">{resource.employeeId}</TableCell>
                          <TableCell>{resource.fullName}</TableCell>
                          <TableCell>{formatCurrency(resource.monthlySalaryCost)}</TableCell>
                          <TableCell>{resource.billingRate ? `$${resource.billingRate}/hr` : "-"}</TableCell>
                          <TableCell>{formatCurrency(resource.monthlyRevenueGenerated)}</TableCell>
                          <TableCell>{resource.department}</TableCell>
                          <TableCell>{formatCurrency(resource.monthlySalaryCost * 6)}</TableCell>
                          <TableCell>{formatCurrency(resource.monthlyRevenueGenerated * 6)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleView(resource.employeeId)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(resource.employeeId)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Resources;
