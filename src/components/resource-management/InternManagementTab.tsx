import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getInternResources } from "@/lib/api";

export const InternManagementTab = () => {
  const [interns, setInterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterns = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const result = await getInternResources(token);
        setInterns((result as any).interns || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch interns');
        setInterns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInterns();
  }, []);

  const getConversionColor = (status: string) => {
    switch (status) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (employeeId: string) => {
    window.location.href = `/resource-details/${employeeId}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intern Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-500">Loading interns...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : interns.length === 0 ? (
            <div className="text-gray-500">No interns found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stipend</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interns.map((intern) => (
                  <TableRow key={intern.employeeId}>
                    <TableCell>{intern.employeeId}</TableCell>
                    <TableCell className="font-medium">{intern.fullName}</TableCell>
                    <TableCell>{intern.department}</TableCell>
                    <TableCell>{intern.mentorName}</TableCell>
                    <TableCell>
                      <Badge className={getConversionColor(intern.status)}>{intern.status}</Badge>
                    </TableCell>
                    <TableCell>{intern.stipend}</TableCell>
                    <TableCell>{intern.internshipStartDate}</TableCell>
                    <TableCell>{intern.internshipEndDate}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(intern.employeeId)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
