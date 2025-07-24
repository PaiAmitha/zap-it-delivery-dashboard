
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getResignations } from "@/lib/api";

export const ResignationsTab = () => {
  const navigate = useNavigate();
  const [resignations, setResignations] = useState<any[]>([]);

  useEffect(() => {
    const fetchResignations = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const result = await getResignations(token);
        setResignations(Array.isArray(result) ? result : []);
      } catch (err) {
        setResignations([]);
      }
    };
    fetchResignations();
  }, []);

  const getReplacementColor = (status: string) => {
    switch (status) {
      case "Replaced": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Identified": return "bg-blue-100 text-blue-800";
      case "Replacement Needed": return "bg-red-100 text-red-800";
      case "Not Needed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (empId: string) => {
    navigate(`/resource-view/${empId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Resignations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Resignation Date</TableHead>
                <TableHead>Primary Skill</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Replacement Plan</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resignations.map((resignation) => (
                <TableRow key={resignation.empId}>
                  <TableCell>{resignation.empId}</TableCell>
                  <TableCell className="font-medium">{resignation.name}</TableCell>
                  <TableCell>{resignation.resignationDate}</TableCell>
                  <TableCell>{resignation.skill}</TableCell>
                  <TableCell>{resignation.client}</TableCell>
                  <TableCell>{resignation.projectName}</TableCell>
                  <TableCell>
                    <Badge className={getReplacementColor(resignation.replacementPlan)}>
                      {resignation.replacementPlan}
                    </Badge>
                  </TableCell>
                  <TableCell>{resignation.feedback}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(resignation.empId)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
