import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search, Filter, Mail, Phone, MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Employee, ResourceFilter } from "@/types/employee";

import { getEmployees } from "@/lib/api";

const ResourceList = () => {
  const { filterType, filterValue } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showMobileView, setShowMobileView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        // Type the response as { employees: Employee[] } | Employee[]
        const data = await getEmployees(token) as { employees?: Employee[] } | Employee[];
        const employeesList = Array.isArray(data) ? data : (data.employees || []);
        setEmployees(employeesList as Employee[]);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
      setShowMobileView(isMobile);
    };
    fetchEmployees();
  }, [isMobile]);

  useEffect(() => {
    if (!filterType || !filterValue) {
      return;
    }

    let filtered = employees.filter(emp => {
      switch (filterType) {
        case 'location':
          return emp.location.toLowerCase() === filterValue.toLowerCase();
        case 'seniority':
          return emp.experience_level.toLowerCase().includes(filterValue.toLowerCase());
        case 'skill':
          const skillMatch = emp.primary_skills.some(skill => 
            skill.toLowerCase().includes(filterValue.toLowerCase())
          ) || emp.secondary_skills.some(skill => 
            skill.toLowerCase().includes(filterValue.toLowerCase())
          );
          return skillMatch;
        case 'engagement':
          return emp.status === 'Non-Billable';
        default:
          return true;
      }
    });

    // Apply additional filters
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(emp => emp.status.toLowerCase().replace('-', '') === statusFilter.toLowerCase());
    }

    setFilteredEmployees(filtered);
  }, [employees, filterType, filterValue, searchTerm, departmentFilter, statusFilter]);

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getStatusColor = (status: string) => {
    return status === 'Billable' ? 'default' : 'secondary';
  };

  const getBenchDaysColor = (days: number) => {
    if (days === 0) {
      return 'default';
    }
    if (days <= 30) {
      return 'secondary';
    }
    if (days <= 60) {
      return 'destructive';
    }
    return 'destructive';
  };

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

  const handleViewDetails = (employee: Employee) => {
    if (location.pathname.includes('/resource-management/resource-list/')) {
      navigate(`/resource-management/resource-list/${filterType}/${filterValue}/${employee.employee_id}`);
    } else {
      navigate(`/resource-list/${filterType}/${filterValue}/${employee.employee_id}`);
    }
  };

  const departments = [...new Set(employees.map(emp => emp.department))];

  // Mobile card view component
  const MobileEmployeeCard = ({ employee }: { employee: Employee }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{employee.full_name}</h3>
            <p className="text-sm text-gray-500 truncate">{employee.employee_id}</p>
            <p className="text-sm text-gray-600 truncate">{employee.designation}</p>
          </div>
          <Badge variant={getStatusColor(employee.status)} className="ml-2">
            {employee.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{employee.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="truncate">{employee.email}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="font-medium">{employee.experience_level}</p>
            <p className="text-xs text-gray-500">{employee.years_of_experience} years</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Cost Rate</p>
            <p className="font-medium">{formatCurrency(employee.cost_rate)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">Utilization</span>
              <span className="text-sm font-medium">{employee.utilization_percentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${employee.utilization_percentage}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Bench Days</p>
            <Badge variant={getBenchDaysColor(employee.bench_days)} className="text-xs">
              {employee.bench_days}
            </Badge>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-500 mb-2">Primary Skills</p>
          <div className="flex flex-wrap gap-1">
            {employee.primary_skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {employee.primary_skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{employee.primary_skills.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleViewDetails(employee)}
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
            <p className="text-gray-500">Loading employees...</p>
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
          <p className="text-sm sm:text-base text-gray-600">Showing {filteredEmployees.length} resources</p>
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
                placeholder="Search by name, ID, or email..."
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
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="billable">Billable</SelectItem>
                <SelectItem value="nonbillable">Non-Billable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <div className="px-1 sm:px-0">
        {showMobileView ? (
          /* Mobile Card View */
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <MobileEmployeeCard key={employee.employee_id} employee={employee} />
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
                      <TableHead className="min-w-[200px]">Employee</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost Rate</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Bench Days</TableHead>
                      <TableHead>Primary Skills</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.employee_id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.full_name}</p>
                            <p className="text-sm text-gray-500">{employee.employee_id}</p>
                            <p className="text-sm text-gray-500">{employee.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{employee.designation}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.location}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.experience_level}</p>
                            <p className="text-sm text-gray-500">{employee.years_of_experience} years</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(employee.status)}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(employee.cost_rate)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{employee.utilization_percentage}%</span>
                            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 transition-all"
                                style={{ width: `${employee.utilization_percentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getBenchDaysColor(employee.bench_days)}>
                            {employee.bench_days} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {employee.primary_skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {employee.primary_skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{employee.primary_skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(employee)}
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

      {filteredEmployees.length === 0 && (
        <Card className="mx-1 sm:mx-0">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No employees found matching the current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourceList;
