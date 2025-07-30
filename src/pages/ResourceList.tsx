import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search, MapPin, Mail } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResourceData } from "@/types/resource";
import { getResources } from "@/lib/api";

const ResourceList = () => {
  const { filterType, filterValue } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [filteredResources, setFilteredResources] = useState<ResourceData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showMobileView, setShowMobileView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const data = await getResources(token) as { resources?: ResourceData[] } | ResourceData[];
        const resourcesList = Array.isArray(data) ? data : (data.resources || []);
        setResources(resourcesList);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch resources');
      } finally {
        setLoading(false);
      }
      setShowMobileView(isMobile);
    };
    fetchResources();
  }, [isMobile]);

  useEffect(() => {
    let filtered = resources;
    if (filterType && filterValue) {
      if (filterType === 'location') {
        filtered = filtered.filter(res => (res.location || '').toLowerCase() === filterValue.toLowerCase());
      } else if (filterType === 'seniority') {
        filtered = filtered.filter(res => (res.seniorityLevel || '').toLowerCase().includes(filterValue.toLowerCase()));
      } else if (filterType === 'skill') {
        filtered = filtered.filter(res => (res.skills || []).join(',').toLowerCase().includes(filterValue.toLowerCase()));
      } else if (filterType === 'engagement') {
        filtered = filtered.filter(res => !res.billableStatus);
      }
    }
    if (searchTerm) {
      filtered = filtered.filter(res =>
        (res.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (res.resourceId ? String(res.resourceId).toLowerCase().includes(searchTerm.toLowerCase()) : false)
      );
    }
    if (departmentFilter !== "all") {
      filtered = filtered.filter(res => res.department === departmentFilter);
    }
    // If you have a status field, update this logic accordingly
    // if (statusFilter !== "all") {
    //   filtered = filtered.filter(res => res.status?.toLowerCase().replace('-', '') === statusFilter.toLowerCase());
    // }
    setFilteredResources(filtered);
  }, [resources, filterType, filterValue, searchTerm, departmentFilter, statusFilter]);

  const formatCurrency = (amount: number) => `$${amount?.toLocaleString()}`;

  const getFilterDisplayName = () => {
    if (!filterType || !filterValue) {
      return "All Resources";
    }
    switch (filterType) {
      case 'location':
        return `Resources in ${filterValue}`;
      case 'seniority':
        return `${filterValue} Resources`;
      case 'skill':
        return `${filterValue} Skill Category`;
      case 'engagement':
        return `${filterValue} Engagement Type`;
      default:
        return "Filtered Resources";
    }
  };

  const handleViewDetails = (resource: ResourceData) => {
    navigate(`/resource-list/${filterType || ''}/${filterValue || ''}/${resource.resourceId}`);
  };

  const departments = [...new Set(resources.map(res => res.department))];

  // Mobile card view component
  const MobileResourceCard = ({ resource }: { resource: ResourceData }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{resource.fullName}</h3>
            <p className="text-sm text-gray-500 truncate">{resource.resourceId}</p>
            <p className="text-sm text-gray-600 truncate">{resource.designation}</p>
          </div>
          {/* Add status/billable badge if needed */}
        </div>
        {/* Add more fields as needed */}
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleViewDetails(resource)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
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
      <div className="px-1 sm:px-0">
        <BreadcrumbNavigation />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{getFilterDisplayName()}</h1>
          <p className="text-sm sm:text-base text-gray-600">Showing {filteredResources.length} resources</p>
        </div>
      </div>
      {/* Filters */}
      <Card className="mx-1 sm:mx-0">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={String(dept)} value={String(dept)}>{String(dept)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Status filter can be added if you have a status field */}
          </div>
        </CardContent>
      </Card>
      {/* Resource List */}
      <div className="px-1 sm:px-0">
        {showMobileView ? (
          /* Mobile Card View */
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <MobileResourceCard key={resource.resourceId} resource={resource} />
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Resource</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Seniority</TableHead>
                      <TableHead>Billable</TableHead>
                      <TableHead>Monthly Cost</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.resourceId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{resource.fullName}</p>
                            <p className="text-sm text-gray-500">{resource.resourceId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{resource.designation}</TableCell>
                        <TableCell>{resource.department}</TableCell>
                        <TableCell>{resource.location}</TableCell>
                        <TableCell>{resource.seniorityLevel}</TableCell>
                        <TableCell>
                          <Badge variant={resource.billableStatus ? 'default' : 'secondary'}>
                            {resource.billableStatus ? 'Billable' : 'Non-Billable'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(resource.monthlySalaryCost)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(resource.skills || []).slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {(resource.skills?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(resource.skills?.length || 0) - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(resource)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {filteredResources.length === 0 && (
        <Card className="mx-1 sm:mx-0">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No resources found matching the current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourceList;
