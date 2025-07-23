
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, DollarSign, TrendingDown } from "lucide-react";
import { Employee } from "@/types/employee";

interface BenchCostingCardProps {
  employees: Employee[];
  totalBenchCost: number;
}

export const BenchCostingCard = ({ employees, totalBenchCost }: BenchCostingCardProps) => {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  // Group employees by department and seniority
  const groupedEmployees = employees.reduce((acc, emp) => {
    const key = `${emp.department}-${emp.experience_level}`;
    if (!acc[key]) {
      acc[key] = {
        department: emp.department,
        level: emp.experience_level,
        employees: [],
        totalCost: 0
      };
    }
    acc[key].employees.push(emp);
    acc[key].totalCost += emp.cost_rate;
    return acc;
  }, {} as Record<string, { department: string; level: string; employees: Employee[]; totalCost: number }>);

  const groupedData = Object.values(groupedEmployees);

  // Calculate bench impact metrics
  const annualBenchCost = totalBenchCost * 12;
  const avgBenchDays = employees.reduce((sum, emp) => sum + emp.bench_days, 0) / employees.length;

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-500" />
            Bench Resources & Costing Analysis
          </CardTitle>
          <p className="text-sm text-gray-600">
            Detailed breakdown of non-billable resources and their financial impact
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary Metrics */}
            <div className="lg:col-span-1">
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-900 mb-4">Bench Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-orange-600">{employees.length}</div>
                    <div className="text-sm text-orange-700">Total Bench Resources</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalBenchCost)}</div>
                    <div className="text-sm text-orange-700">Monthly Bench Cost</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-600">{formatCurrency(annualBenchCost)}</div>
                    <div className="text-sm text-orange-700">Annual Impact</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{avgBenchDays.toFixed(0)} days</div>
                    <div className="text-sm text-orange-700">Avg Bench Duration</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Department & Seniority Breakdown */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department & Seniority Breakdown</h3>
              <div className="space-y-3">
                {groupedData.map((group, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{group.department}</div>
                      <div className="text-sm text-gray-600">{group.level}</div>
                      <div className="text-sm text-gray-500">
                        {group.employees.length} resource{group.employees.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">{formatCurrency(group.totalCost)}</div>
                      <div className="text-sm text-gray-500">monthly</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual Employee Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Resource Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Experience</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Bench Days</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Monthly Cost</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.employee_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{employee.full_name}</div>
                          <div className="text-sm text-gray-500">{employee.designation}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{employee.department}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{employee.experience_level}</div>
                        <div className="text-xs text-gray-500">{employee.years_of_experience} years</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-orange-600">{employee.bench_days}</div>
                        <div className="text-xs text-gray-500">days on bench</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{formatCurrency(employee.cost_rate)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {employee.primary_skills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {employee.primary_skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{employee.primary_skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Impact Analysis */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Bench Cost Impact on Profitability
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-red-700 font-medium">Annual Bench Cost</div>
                <div className="text-xl font-bold text-red-800">{formatCurrency(annualBenchCost)}</div>
                <div className="text-xs text-red-600">Non-revenue generating cost</div>
              </div>
              <div>
                <div className="text-red-700 font-medium">Daily Burn Rate</div>
                <div className="text-xl font-bold text-red-800">{formatCurrency(Math.round(totalBenchCost / 30))}</div>
                <div className="text-xs text-red-600">Average daily cost</div>
              </div>
              <div>
                <div className="text-red-700 font-medium">Utilization Target</div>
                <div className="text-xl font-bold text-red-800">85%</div>
                <div className="text-xs text-red-600">Industry benchmark</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
