
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { UserHoverCard } from "@/components/ui/user-hover-card";
import { Building, User, Calendar, Clock, FileText, AlertCircle, CheckCircle, XCircle, Timer } from "lucide-react";
import { getEscalation } from "@/lib/escalationApi";

interface Escalation {
  id: string;
  title: string;
  customer: string;
  project: string;
  owner: string;
  priority: string;
  status: string;
  date_raised: string;
  resolution_eta: string;
  risk_level?: string;
  description?: string;
}

const EscalationDetails = () => {
  const { id } = useParams();
  const [escalation, setEscalation] = useState<Escalation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEscalation = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getEscalation(Number(id));
        setEscalation(result || null);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch escalation');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchEscalation();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="text-center py-12">Loading escalation details...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <Card>
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-500">{error}</h2>
            <p className="text-sm text-muted-foreground mt-2">The requested escalation could not be loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!escalation) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <Card>
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground">Escalation not found</h2>
            <p className="text-sm text-muted-foreground mt-2">The requested escalation could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <AlertCircle className="h-4 w-4" />;
      case 'In Progress': return <Timer className="h-4 w-4" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escalation.priority}</div>
            <p className="text-xs text-muted-foreground">Escalation priority</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {getStatusIcon(escalation.status)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escalation.status}</div>
            <p className="text-xs text-muted-foreground">Current status</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escalation.customer}</div>
            <p className="text-xs text-muted-foreground">Affected customer</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution ETA</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escalation.resolution_eta}</div>
            <p className="text-xs text-muted-foreground">Expected resolution</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <CardTitle className="text-xl">Escalation Details</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Complete information about this escalation</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={`${getPriorityColor(escalation.priority)} border`}>
                {escalation.priority} Priority
              </Badge>
              <Badge className={`${getStatusColor(escalation.status)} border`}>
                {escalation.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">{escalation.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p className="font-medium">{escalation.customer}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date Raised</p>
                    <p className="font-medium">{escalation.date_raised}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Project Owner</p>
                    <UserHoverCard
                      name={escalation.owner}
                      role="Project Manager"
                      department="Engineering"
                      location="London, UK"
                    >
                      <span className="font-medium cursor-pointer hover:text-primary hover:underline">
                        {escalation.owner}
                      </span>
                    </UserHoverCard>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolution ETA</p>
                    <p className="font-medium">{escalation.resolution_eta}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details and Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Description & Impact</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {escalation.description || "Critical performance degradation in API response times affecting customer operations. Response times have increased by 300% over the past 48 hours, causing timeout issues for end users."}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Impact Assessment</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Customer operations severely impacted</li>
                <li>SLA breach imminent if not resolved within 24 hours</li>
                <li>Potential revenue loss of £50K per day</li>
                <li>Customer satisfaction at risk</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle>Actions & Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Actions Taken</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Infrastructure team notified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Database performance analysis initiated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Customer informed of investigation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Backup systems being activated</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Resolution Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Investigation</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EscalationDetails;
