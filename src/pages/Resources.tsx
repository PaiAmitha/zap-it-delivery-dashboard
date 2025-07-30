import { useEffect, useState } from "react";
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
import { getResources, createResource } from "@/lib/api";
// import { AddResourceModal } from "@/components/resources/AddResourceModal";

interface Resource {
  resourceId: string;
  employeeId?: string;
  fullName: string;
  designation: string;
  department: string;
  seniorityLevel: string;
  experience: number;
  location: string;
  joiningDate: string;
  employmentType: string;
  reportingManager: string;
  skillCategory?: string;
  skills?: string[];
  billableStatus: boolean;
  currentEngagement?: string;
  agingInNonBillable?: number;
  monthlySalaryCost?: number;
  billingRate?: number;
  monthlyRevenueGenerated?: number;
  isIntern?: boolean;
}

const Resources = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || '';
      const data = await getResources(token) as { resources?: Resource[] } | Resource[];
      const resourcesList = Array.isArray(data) ? data : (data.resources || []);
      setResources(resourcesList);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchResources();
  }, []);

  const handleAddResource = async (newResource: any) => {
    try {
      const token = localStorage.getItem('token') || '';
      // Map ResourceData to Resource, add skillCategory if missing
      const resourceToCreate = {
        ...newResource,
        skillCategory: newResource.skillCategory || "General"
      };
      await createResource(token, resourceToCreate);
      setShowAddModal(false);
      fetchResources();
    } catch (err: any) {
      setError(err?.message || 'Failed to add resource');
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    setDeletingId(resourceId);
    try {
      const token = localStorage.getItem('token') || '';
      await import("@/lib/api").then(api => api.deleteResource(token, resourceId));
      fetchResources();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete resource');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.resourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || resource.department === departmentFilter;
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "billable" && resource.billableStatus) ||
                         (statusFilter === "non-billable" && !resource.billableStatus && !resource.isIntern) ||
                         (statusFilter === "intern" && resource.isIntern);
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleEdit = (resourceId: string) => {
    navigate(`/resource-details/edit/${resourceId}`);
  };

  const handleView = (resourceId: string) => {
    navigate(`/resource-details/${resourceId}`);
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <BreadcrumbNavigation />
        {loading && (
          <Card className="mx-1 sm:mx-0">
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Loading resources...</p>
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
        {/* Main content only if not loading/error */}
        {!loading && !error && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resource Records ({filteredResources.length})</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and view all employee resources</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Link to="/add-resource">
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </Link>
              </div>
      {/* AddResourceModal removed. Use AddResource page for resource creation. */}
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
                            <TableHead className="min-w-[150px]">Name</TableHead>
                            <TableHead className="min-w-[180px]">Designation</TableHead>
                            <TableHead className="min-w-[130px]">Department</TableHead>
                            <TableHead className="min-w-[150px]">Skills</TableHead>
                            <TableHead className="min-w-[120px]">Status</TableHead>
                            <TableHead className="min-w-[100px]">Monthly Cost</TableHead>
                            <TableHead className="min-w-[100px]">Age</TableHead>
                            <TableHead className="min-w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredResources.map((resource) => (
                            <TableRow key={resource.resourceId}>
                              <TableCell className="font-medium">{resource.employeeId || resource.resourceId}</TableCell>
                              <TableCell>{resource.fullName}</TableCell>
                              <TableCell>{resource.designation}</TableCell>
                              <TableCell>{resource.department}</TableCell>
                              <TableCell>{Array.isArray(resource.skills) ? resource.skills.join(", ") : resource.skills}</TableCell>
                              <TableCell>
                                <Badge variant={resource.billableStatus ? "default" : "secondary"}>
                                  {resource.billableStatus ? "Billable" : "Non-Billable"}
                                </Badge>
                              </TableCell>
                              <TableCell>{resource.monthlySalaryCost ? `$${resource.monthlySalaryCost}` : "$0"}</TableCell>
                              <TableCell>{Number((resource as any).yearsAtCompany ?? resource.experience)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleView(resource.resourceId)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(resource.resourceId)}>
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" disabled={deletingId === resource.resourceId} onClick={() => handleDelete(resource.resourceId)}>
                                    {deletingId === resource.resourceId ? "Deleting..." : "Delete"}
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
                            <TableHead className="min-w-[100px]">Resource ID</TableHead>
                            <TableHead className="min-w-[150px]">Name</TableHead>
                            <TableHead className="min-w-[130px]">Skill Category</TableHead>
                            <TableHead className="min-w-[120px]">Billable Status</TableHead>
                            <TableHead className="min-w-[150px]">Current Engagement</TableHead>
                            {/* Project Name and Engagement Description columns removed */}
                            <TableHead className="min-w-[100px]">Aging (Days)</TableHead>
                            <TableHead className="min-w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredResources.map((resource) => (
                            <TableRow key={resource.resourceId}>
                              <TableCell className="font-medium">{resource.resourceId}</TableCell>
                              <TableCell>{resource.fullName}</TableCell>
                              <TableCell>{resource.skillCategory}</TableCell>
                              <TableCell>
                                <Badge variant={resource.billableStatus ? "default" : "secondary"}>
                                  {resource.billableStatus ? "Billable" : "Non-Billable"}
                                </Badge>
                              </TableCell>
                              <TableCell>{resource.currentEngagement}</TableCell>
                              {/* Project Name and Engagement Description cells removed */}
                              <TableCell>
                                <Badge 
                                  variant={resource.agingInNonBillable > 60 ? "destructive" : 
                                         resource.agingInNonBillable > 30 ? "outline" : "secondary"}>
                                  {resource.agingInNonBillable}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleView(resource.resourceId)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(resource.resourceId)}>
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
                            <TableHead className="min-w-[100px]">Resource ID</TableHead>
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
                            <TableRow key={resource.resourceId}>
                              <TableCell className="font-medium">{resource.resourceId}</TableCell>
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
                                  <Button size="sm" variant="outline" onClick={() => handleView(resource.resourceId)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(resource.resourceId)}>
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
                            <TableHead className="min-w-[100px]">Resource ID</TableHead>
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
                            <TableRow key={resource.resourceId}>
                              <TableCell className="font-medium">{resource.resourceId}</TableCell>
                              <TableCell>{resource.fullName}</TableCell>
                              <TableCell>{formatCurrency(resource.monthlySalaryCost)}</TableCell>
                              <TableCell>{resource.billingRate ? `$${resource.billingRate}/hr` : "-"}</TableCell>
                              <TableCell>{formatCurrency(resource.monthlyRevenueGenerated)}</TableCell>
                              <TableCell>{resource.department}</TableCell>
                              <TableCell>{formatCurrency(resource.monthlySalaryCost * 6)}</TableCell>
                              <TableCell>{formatCurrency(resource.monthlyRevenueGenerated * 6)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleView(resource.resourceId)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(resource.resourceId)}>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Resources;
