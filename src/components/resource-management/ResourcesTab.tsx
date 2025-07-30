import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Eye, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AddEditResourceModal } from "../resources/AddEditResourceModal";
import { createResource } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { getResources, updateResource } from "@/lib/api";

export const ResourcesTab = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const params: any = {
          search: searchTerm,
          department: filterDepartment !== 'all' ? filterDepartment : undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          page: currentPage,
          pageSize: itemsPerPage
        };
        const result = await getResources(token, params);
        setResources((result as any).resources || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [searchTerm, filterDepartment, filterStatus, currentPage]);



  // Remove duplicate resource fetch effect

  // Pagination logic (from backend)
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = resources;

  const handleAddResource = () => {
    setSelectedResource(null);
    setIsAddModalOpen(true);
  };

  const handleEditResource = (resource: any) => {
    setSelectedResource(resource);
    setIsEditModalOpen(true);
  };

  const handleViewResource = (resource: any) => {
    navigate(`/resource-details/${resource.resourceId}`);
  };

  const handleSaveResource = async (data: any) => {
    const token = localStorage.getItem("token") || "";
    try {
      if (selectedResource) {
        await updateResource(token, selectedResource.resourceId, data);
      } else {
        await createResource(token, data);
      }
      // Refetch resources after add/edit
      const params: any = {
        search: searchTerm,
        department: filterDepartment !== 'all' ? filterDepartment : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        page: currentPage,
        pageSize: itemsPerPage
      };
      const result = await getResources(token, params);
      setResources((result as any).resources || []);
    } catch (err) {
      setError(err?.message || 'Failed to save resource');
    }
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedResource(null);
  };

  const formatCurrency = (amount: number) => `$${amount?.toLocaleString() || '0'}`;

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Master Resource Directory</CardTitle>
            <p className="text-gray-600 text-sm mt-1">Comprehensive resource records and management</p>
          </div>
          <Button onClick={handleAddResource} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </CardHeader>
        <CardContent>
          {/* Enhanced Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="bg-white shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
              <SelectTrigger className="bg-white shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="billable">Billable</SelectItem>
                <SelectItem value="non-billable">Non-Billable</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Enhanced Resource Records Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">Employee ID</TableHead>
                    <TableHead className="font-semibold text-gray-900">Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Designation</TableHead>
                    <TableHead className="font-semibold text-gray-900">Department</TableHead>
                    <TableHead className="font-semibold text-gray-900">Skills</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Monthly Cost</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-gray-500">Loading resources...</TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-red-500">{error}</TableCell>
                    </TableRow>
                  ) : paginatedResources.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-gray-500">No resources found.</TableCell>
                    </TableRow>
                  ) : (
                    paginatedResources.map((resource, index) => (
                      <TableRow key={resource.resourceId} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <TableCell className="font-medium text-blue-600">{resource.employeeId}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{resource.fullName}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">{resource.designation}</TableCell>
                        <TableCell className="text-gray-700">{resource.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {Array.isArray(resource.skills) ? resource.skills.join(', ') : resource.skills}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{resource.status}</div>
                            <div className="text-gray-500">{resource.skillCategory}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={resource.billableStatus ? "default" : "secondary"}
                            className={resource.billableStatus ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
                          >
                            {resource.billableStatus ? "Billable" : "Non-Billable"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {formatCurrency(resource.monthlySalaryCost ?? resource.monthly_cost ?? resource.monthlyCost)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleViewResource(resource)}
                              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEditResource(resource)}
                              className="hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all duration-200"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async () => {
                                if (!window.confirm('Are you sure you want to delete this resource?')) return;
                                setLoading(true);
                                setError(null);
                                try {
                                  const token = localStorage.getItem('token') || '';
                                  await import("@/lib/api").then(api => api.deleteResource(token, resource.resourceId));
                                  // Refetch resources after delete
                                  const params: any = {
                                    search: searchTerm,
                                    department: filterDepartment !== 'all' ? filterDepartment : undefined,
                                    status: filterStatus !== 'all' ? filterStatus : undefined,
                                    page: currentPage,
                                    pageSize: itemsPerPage
                                  };
                                  const result = await getResources(token, params);
                                  setResources((result as any).resources || []);
                                } catch (err: any) {
                                  setError(err?.message || 'Failed to delete resource');
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Enhanced Pagination */}
          <div className="flex items-center justify-between mt-6 p-4 bg-gray-50/50 rounded-xl">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, paginatedResources.length)} of {paginatedResources.length} resources
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-blue-500 hover:bg-blue-600" : ""}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddEditResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveResource}
        mode="add"
      />

      <AddEditResourceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveResource}
        resource={selectedResource}
        mode="edit"
      />
    </div>
  );
};
