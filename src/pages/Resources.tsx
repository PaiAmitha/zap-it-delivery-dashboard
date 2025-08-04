import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Resource {
  resourceId: string;
  employeeId?: string;
  fullName: string;
  designation: string;
  department: string;
  seniorityLevel: string;
  experience: number;
  location: string;
  joiningDate: string;
  employmentType: string;
  reportingManager: string;
  skills?: string[];
  billableStatus: boolean;
  monthlySalaryCost?: number;
}

const Resources = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kpiCounts, setKpiCounts] = useState({ total: 0, billable: 0, nonBillable: 0, intern: 0 });

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch("/api/resources").then(res => res.json()),
      fetch("/api/resources/kpi-counts").then(res => res.json())
    ])
      .then(([resourcesData, kpiData]) => {
        setResources(resourcesData.resources || []);
        setKpiCounts(kpiData.resourceCounts || { total: 0, billable: 0, nonBillable: 0, intern: 0 });
      })
      .catch(err => setError(err?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (resources && resources.length > 0) {
      console.log('Resources: Loaded employeeIds:', resources.map(r => r.employeeId));
    }
  }, [resources]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource KPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Total Resources</div>
              <div className="text-2xl">{kpiCounts.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Billable</div>
              <div className="text-2xl">{kpiCounts.billable}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Non-Billable</div>
              <div className="text-2xl">{kpiCounts.nonBillable}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Interns</div>
              <div className="text-2xl">{kpiCounts.intern}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resource Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading resources...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Monthly Cost</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => {
                  if (!resource.employeeId) {
                    return (
                      <TableRow key={resource.fullName + '-no-employee-id'}>
                        <TableCell colSpan={8} className="text-red-500 text-center">
                          Warning: Resource "{resource.fullName}" has no employeeId and cannot be viewed.
                        </TableCell>
                      </TableRow>
                    );
                  }
                  return (
                    <TableRow key={resource.employeeId}>
                      <TableCell>{resource.employeeId}</TableCell>
                      <TableCell>{resource.fullName}</TableCell>
                      <TableCell>{resource.designation}</TableCell>
                      <TableCell>{resource.department}</TableCell>
                      <TableCell>{resource.skills?.join(", ")}</TableCell>
                      <TableCell>{resource.billableStatus ? "Billable" : "Non-Billable"}</TableCell>
                      <TableCell>{resource.monthlySalaryCost || "-"}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log('Resources: Navigating to details for employeeId:', resource.employeeId);
                            if (resource.employeeId) navigate(`/resource-details/${resource.employeeId}`);
                          }}
                          disabled={!resource.employeeId}
                        >
                          <Eye size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Total Resources Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => window.open("http://localhost:8080/resource-management/total-resources", "_blank")}
            className="mb-2"
          >
            View Full Analytics
          </Button>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Total Resources</div>
              <div className="text-2xl">{kpiCounts.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Billable</div>
              <div className="text-2xl">{kpiCounts.billable}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Non-Billable</div>
              <div className="text-2xl">{kpiCounts.nonBillable}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Interns</div>
              <div className="text-2xl">{kpiCounts.intern}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;