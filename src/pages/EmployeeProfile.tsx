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
import { ResourceData } from "@/types/resource";
import { getResource } from "@/lib/api";

const EmployeeProfile = () => {
  const { employeeId, filterType, filterValue } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [resource, setResource] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const data = await getResource(token, employeeId!);
        setResource(data as ResourceData || null);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch resource');
      } finally {
        setLoading(false);
      }
    };
    if (employeeId) fetchResource();
  }, [employeeId]);

  // Helper functions for display
  const formatCurrency = (amount?: number) => amount ? `$${amount.toLocaleString()}` : '-';

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!resource) return <div>No resource found.</div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      <BreadcrumbNavigation />
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
            {resource.fullName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{resource.reportingManager || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span>{resource.designation || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{resource.location || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{resource.joiningDate || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{resource.experience} years</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Monthly Cost: {formatCurrency(resource.monthlySalaryCost)}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Billing Rate: {formatCurrency(resource.billingRate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>Department: {resource.department || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gray-500" />
                <span>Seniority: {resource.seniorityLevel || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-500" />
                <span>Skills: {(resource.skills || []).join(', ') || '-'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeProfile;
