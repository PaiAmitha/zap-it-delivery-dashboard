
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, User, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

export const InternsSection = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const data = await import('@/lib/api').then(m => m.getDashboard(token));
        setDashboard(data);
      } catch {
        setDashboard(null);
      }
    };
    fetchDashboard();
  }, []);

  const interns = dashboard?.intern_details_list || [];
  const totalStipendCost = interns.reduce((sum: number, intern: any) => sum + (intern.stipend || 0), 0);
  const totalInterns = dashboard?.total_interns ?? interns.length;
  const assignedInterns = dashboard?.interns_assigned ?? interns.filter((intern: any) => intern.status === 'assigned').length;
  const unassignedInterns = dashboard?.interns_unassigned ?? interns.filter((intern: any) => intern.status !== 'assigned').length;
  const conversionRate = dashboard?.intern_conversion_rate ?? 0;
  const avgLearningHours = dashboard?.avg_learning_hours ?? 0;
  const avgProductiveHours = dashboard?.avg_productive_hours ?? 0;
  const monthlyConversion = dashboard?.intern_monthly_conversion ?? [];
  const learningVsProductive = dashboard?.intern_learning_vs_productive ?? [];
  const activeInterns = interns.filter((intern: any) => intern.status === 'Active');
  const upcomingInterns = interns.filter((intern: any) => intern.status === 'Upcoming');

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Interns</p>
                <h3 className="text-2xl font-bold">{totalInterns}</h3>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                <h3 className="text-2xl font-bold">{assignedInterns}</h3>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
                <h3 className="text-2xl font-bold">{unassignedInterns}</h3>
              </div>
              <User className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <h3 className="text-2xl font-bold">{conversionRate}%</h3>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Learning Hrs</p>
                <h3 className="text-2xl font-bold">{avgLearningHours}</h3>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Productive Hrs</p>
                <h3 className="text-2xl font-bold">{avgProductiveHours}</h3>
              </div>
              <User className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interns List */}
      <Card>
        <CardHeader>
          <CardTitle>Intern Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interns.map((intern, index) => {
              const name = intern.name || '-';
              const department = intern.department || '-';
              const status = intern.status || '-';
              const conversionPotential = intern.conversionPotential || '-';
              const startDate = intern.startDate || '-';
              const endDate = intern.endDate || '-';
              const assignedProject = intern.assignedProject || intern.project || '-';
              const mentor = intern.mentor || intern.mentor_name || '-';
              const stipend = typeof intern.stipend === 'number' ? intern.stipend : 0;
              const education = intern.education || '-';
              return (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{name}</h4>
                      <p className="text-sm text-gray-600">{department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={status === 'Active' ? 'default' : 'secondary'}>
                        {status}
                      </Badge>
                      <Badge variant={conversionPotential === 'High' ? 'default' : 'secondary'}>
                        {conversionPotential} Potential
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p className="text-gray-600">{startDate} - {endDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Project:</span>
                      <p className="text-gray-600">{assignedProject}</p>
                    </div>
                    <div>
                      <span className="font-medium">Mentor:</span>
                      <p className="text-gray-600">{mentor}</p>
                    </div>
                    <div>
                      <span className="font-medium">Stipend:</span>
                      <p className="text-gray-600">${stipend.toLocaleString()}/month</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600">{education}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
