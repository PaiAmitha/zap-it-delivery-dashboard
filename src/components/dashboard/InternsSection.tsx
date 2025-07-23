
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, User, DollarSign } from "lucide-react";

interface Intern {
  name: string;
  startDate: string;
  endDate: string;
  department: string;
  assignedProject: string;
  status: 'Active' | 'Upcoming';
  mentor: string;
  education: string;
  stipend: number;
  conversionPotential: 'High' | 'Medium' | 'Low';
}

interface InternsSectionProps {
  interns: Intern[];
  totalStipendCost: number;
  onViewDetails?: (intern: Intern) => void;
}

export const InternsSection = ({ interns, totalStipendCost, onViewDetails }: InternsSectionProps) => {
  const activeInterns = interns.filter(intern => intern.status === 'Active');
  const upcomingInterns = interns.filter(intern => intern.status === 'Upcoming');

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Interns</p>
                <h3 className="text-2xl font-bold">{interns.length}</h3>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Interns</p>
                <h3 className="text-2xl font-bold">{activeInterns.length}</h3>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <h3 className="text-2xl font-bold">{upcomingInterns.length}</h3>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
                <h3 className="text-2xl font-bold">${(totalStipendCost / 1000).toFixed(1)}K</h3>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
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
            {interns.map((intern, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{intern.name}</h4>
                    <p className="text-sm text-gray-600">{intern.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={intern.status === 'Active' ? 'default' : 'secondary'}>
                      {intern.status}
                    </Badge>
                    <Badge variant={intern.conversionPotential === 'High' ? 'default' : 'secondary'}>
                      {intern.conversionPotential} Potential
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p className="text-gray-600">{intern.startDate} - {intern.endDate}</p>
                  </div>
                  <div>
                    <span className="font-medium">Project:</span>
                    <p className="text-gray-600">{intern.assignedProject}</p>
                  </div>
                  <div>
                    <span className="font-medium">Mentor:</span>
                    <p className="text-gray-600">{intern.mentor}</p>
                  </div>
                  <div>
                    <span className="font-medium">Stipend:</span>
                    <p className="text-gray-600">${intern.stipend.toLocaleString()}/month</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600">{intern.education}</p>
                  <div className="flex gap-2">
                    {onViewDetails && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onViewDetails(intern)}
                      >
                        View Details
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
