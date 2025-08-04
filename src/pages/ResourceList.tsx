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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
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
  }, [isMobile, refreshFlag]);

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
        (res.employeeId ? String(res.employeeId).toLowerCase().includes(searchTerm.toLowerCase()) : false)
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
    navigate(`/resource-list/${filterType || ''}/${filterValue || ''}/${resource.employeeId ?? resource.resourceId}`);
  };

  const handleEditResource = (resource: ResourceData) => {
    navigate("/add-resource", { state: { resource, mode: "edit" } });
  };

  const departments = [...new Set(resources.map(res => res.department))];

  // Mobile card view component
  const MobileResourceCard = ({ resource }: { resource: ResourceData }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{resource.fullName}</h3>
            <p className="text-sm text-gray-500 truncate">{resource.employeeId ?? resource.resourceId}</p>
            <p className="text-sm text-gray-600 truncate">{resource.designation}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleViewDetails(resource)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          <Button
            size="sm"
            variant="default"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleEditResource(resource)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            disabled={deletingId === (resource.employeeId ?? resource.resourceId)}
            onClick={async () => {
              if (!window.confirm(`Delete resource ${resource.fullName}? This cannot be undone.`)) return;
              setDeletingId(resource.employeeId ?? resource.resourceId);
              try {
                const token = localStorage.getItem('token') || '';
                await import('@/lib/api').then(api => api.deleteResource(token, resource.employeeId ?? resource.resourceId));
                setRefreshFlag(f => f + 1);
              } catch (err: any) {
                setError(err?.message || 'Failed to delete resource');
              } finally {
                setDeletingId(null);
              }
            }}
          >
            {deletingId === (resource.employeeId ?? resource.resourceId) ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Main render block
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
      {!showMobileView ? (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Resource List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
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
                  <TableRow key={resource.employeeId ?? resource.resourceId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{resource.fullName}</p>
                        <p className="text-sm text-gray-500">{resource.employeeId ?? resource.resourceId}</p>
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
                      <div className="flex flex-row gap-2 justify-center">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(resource)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleEditResource(resource)}
                          className="flex items-center gap-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deletingId === (resource.employeeId ?? resource.resourceId)}
                          onClick={async () => {
                            if (!window.confirm(`Delete resource ${resource.fullName}? This cannot be undone.`)) return;
                            setDeletingId(resource.employeeId ?? resource.resourceId);
                            try {
                              const token = localStorage.getItem('token') || '';
                              await import('@/lib/api').then(api => api.deleteResource(token, resource.employeeId ?? resource.resourceId));
                              setRefreshFlag(f => f + 1);
                            } catch (err: any) {
                              setError(err?.message || 'Failed to delete resource');
                            } finally {
                              setDeletingId(null);
                            }
                          }}
                        >
                          {deletingId === (resource.employeeId ?? resource.resourceId) ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredResources.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No resources found matching the current filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div>
          {filteredResources.map(resource => (
            <MobileResourceCard key={resource.employeeId ?? resource.resourceId} resource={resource} />
          ))}
          {filteredResources.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No resources found matching the current filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default ResourceList;
