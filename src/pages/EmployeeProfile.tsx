
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  Users, 
  DollarSign,
  Star,
  Target
} from "lucide-react";
import { Employee } from "@/types/employee";
import employeeData from "@/data/employeeResourceData.json";

const EmployeeProfile = () => {
  const { employeeId, filterType, filterValue } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // Type assertion to ensure the data matches our Employee interface
    const foundEmployee = (employeeData.employees as Employee[]).find(emp => emp.employee_id === employeeId);
    setEmployee(foundEmployee || null);
  }, [employeeId]);

  if (!employee) {
    return (
      <div className="space-y-6">
        <BreadcrumbNavigation />
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Employee not found</p>
            <Button 
              onClick={() => navigate('/resource-management')} 
              className="mt-4"
            >
              Back to Resource Management
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const getStatusColor = (status: string) => {
    return status === 'Billable' ? 'default' : 'secondary';
  };

  const getBenchDaysColor = (days: number) => {
    if (days === 0) return 'default';
    if (days <= 30) return 'secondary';
    if (days <= 60) return 'destructive';
    return 'destructive';
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProductivityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{employee.full_name}</h1>
          <p className="text-gray-600">{employee.designation} • {employee.employee_id}</p>
        </div>
        <Badge variant={getStatusColor(employee.status)} className="text-lg px-4 py-2">
          {employee.status}
        </Badge>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{employee.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{employee.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Joined {formatDate(employee.joining_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{employee.years_of_experience} years experience</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Cost Rate</p>
              <p className="text-lg font-semibold">{formatCurrency(employee.cost_rate)}/month</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Billing Rate</p>
              <p className="text-lg font-semibold">
                {employee.billing_rate > 0 ? `${formatCurrency(employee.billing_rate)}/month` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Resource Type</p>
              <p className="text-lg font-semibold">{employee.resource_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Experience Level</p>
              <p className="text-lg font-semibold">{employee.experience_level}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Utilization</span>
                <span className={`text-sm font-semibold ${getUtilizationColor(employee.utilization_percentage)}`}>
                  {employee.utilization_percentage}%
                </span>
              </div>
              <Progress value={employee.utilization_percentage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Productivity Score</span>
                <span className={`text-sm font-semibold ${getProductivityColor(employee.productivity_score)}`}>
                  {employee.productivity_score}/100
                </span>
              </div>
              <Progress value={employee.productivity_score} className="h-2" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bench Status</p>
              <Badge variant={getBenchDaysColor(employee.bench_days)} className="mt-1">
                {employee.bench_days === 0 ? 'Active' : `${employee.bench_days} days on bench`}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Primary Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {employee.primary_skills.map((skill, index) => (
                <Badge key={index} variant="default">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Secondary Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {employee.secondary_skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bench Information */}
      {employee.status === 'Non-Billable' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Bench Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bench Start Date</p>
              <p className="text-lg font-semibold">
                {employee.bench_start_date ? formatDate(employee.bench_start_date) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Project End Date</p>
              <p className="text-lg font-semibold">
                {employee.last_project_end_date ? formatDate(employee.last_project_end_date) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Days on Bench</p>
              <p className="text-lg font-semibold text-orange-600">{employee.bench_days} days</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="outline">Assign to Project</Button>
            <Button variant="outline">View Project History</Button>
            <Button variant="outline">Generate Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeProfile;
