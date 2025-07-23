
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Building, CheckCircle, AlertTriangle, DollarSign } from "lucide-react";

interface ProjectFinancials {
  projectId: string;
  projectName: string;
  projectType: "Fixed Price" | "T&M" | "Milestone";
  client: string;
  sowValue: number;
  billingRate: string;
  startDate: string;
  endDate: string;
  actualCostToDate: number;
  billableResources: number;
  nonBillableResources: number;
  shadowResources: number;
  monthlyBurn: number;
  projectedCompletion: string;
  netPosition: number;
  healthStatus: "Positive" | "Negative" | "Critical";
  profitMargin: number;
  utilizationRate: number;
  resourceCosts: {
    billableCost: number;
    nonBillableCost: number;
    shadowCost: number;
  };
}

interface ProjectFinancialHealthTableProps {
  projects: ProjectFinancials[];
}

export const ProjectFinancialHealthTable = ({ projects }: ProjectFinancialHealthTableProps) => {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const getHealthBadge = (status: string, margin: number) => {
    let variant: "default" | "destructive" | "secondary" = "default";
    let icon = <CheckCircle className="h-3 w-3" />;
    
    if (status === "Negative" || margin < 0) {
      variant = "destructive";
      icon = <AlertTriangle className="h-3 w-3" />;
    } else if (status === "Critical" || margin < 10) {
      variant = "secondary";
      icon = <AlertTriangle className="h-3 w-3" />;
    }

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        {status}
      </Badge>
    );
  };

  const getProjectTypeBadge = (type: string) => {
    const colors = {
      "Fixed Price": "bg-blue-100 text-blue-800",
      "T&M": "bg-green-100 text-green-800",
      "Milestone": "bg-purple-100 text-purple-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-green-500" />
          Project Financial Health Dashboard
        </CardTitle>
        <p className="text-sm text-gray-600">
          Comprehensive view of all projects with SOW billing, actual costs, and financial health status
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Project Details</TableHead>
                <TableHead className="min-w-[150px]">SOW & Billing</TableHead>
                <TableHead className="min-w-[150px]">Resource Allocation</TableHead>
                <TableHead className="min-w-[150px]">Financial Performance</TableHead>
                <TableHead className="min-w-[120px]">Health Status</TableHead>
                <TableHead className="min-w-[100px]">Net Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.projectId} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">{project.projectName}</div>
                      <div className="text-sm text-gray-500">ID: {project.projectId}</div>
                      <div className="text-sm text-gray-500">Client: {project.client}</div>
                      <Badge className={getProjectTypeBadge(project.projectType)}>
                        {project.projectType}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-green-600">{formatCurrency(project.sowValue)}</div>
                      <div className="text-sm text-gray-500">Rate: {project.billingRate}</div>
                      <div className="text-sm text-gray-500">Burn: {formatCurrency(project.monthlyBurn)}/mo</div>
                      <div className="text-sm text-gray-500">{project.startDate} - {project.endDate}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="default" className="text-xs">
                          {project.billableResources} Billable
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {project.nonBillableResources} Non-Billable
                        </Badge>
                        {project.shadowResources > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {project.shadowResources} Shadow
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Billable Cost: <span className="font-medium text-green-600">{formatCurrency(project.resourceCosts.billableCost)}</span></div>
                        <div>Non-Billable: <span className="font-medium text-orange-600">{formatCurrency(project.resourceCosts.nonBillableCost)}</span></div>
                        <div>Utilization: <span className="font-medium">{project.utilizationRate}%</span></div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div>Actual: <span className="font-medium text-blue-600">{formatCurrency(project.actualCostToDate)}</span></div>
                      <div>
                        Margin: <span className={`font-medium ${project.profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(project.profitMargin)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">Est. Complete: {project.projectedCompletion}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getHealthBadge(project.healthStatus, project.profitMargin)}
                  </TableCell>
                  
                  <TableCell>
                    <div className={`font-bold text-lg ${project.netPosition > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(project.netPosition)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {project.netPosition > 0 ? 'Profit' : 'Loss'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Project Portfolio Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(projects.reduce((sum, p) => sum + p.sowValue, 0))}
              </div>
              <div className="text-sm text-gray-600">Total SOW Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(projects.reduce((sum, p) => sum + p.actualCostToDate, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Actual Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(projects.reduce((sum, p) => sum + p.netPosition, 0))}
              </div>
              <div className="text-sm text-gray-600">Net Position</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
