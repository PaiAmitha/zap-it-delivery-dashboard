
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ResignationsTab = () => {
  const navigate = useNavigate();

  const resignations = [
    {
      empId: "EMP001",
      name: "John Doe",
      resignationDate: "2025-08-15",
      skill: "React.js",
      client: "TechCorp",
      projectName: "E-commerce Platform",
      replacementPlan: "In Progress",
      feedback: "Good"
    },
    {
      empId: "EMP002",
      name: "Jane Smith",
      resignationDate: "2025-09-01",
      skill: "Python",
      client: "DataSys",
      projectName: "Analytics Dashboard",
      replacementPlan: "Identified",
      feedback: "Excellent"
    },
    {
      empId: "EMP003",
      name: "Mike Johnson",
      resignationDate: "2025-09-15",
      skill: "Java",
      client: "Enterprise Corp",
      projectName: "Backend Services",
      replacementPlan: "Replacement Needed",
      feedback: "Good"
    },
    {
      empId: "EMP004",
      name: "Sarah Wilson",
      resignationDate: "2025-10-01",
      skill: "DevOps",
      client: "Cloud Systems",
      projectName: "Infrastructure Migration",
      replacementPlan: "Not Needed",
      feedback: "Excellent"
    },
    {
      empId: "EMP005",
      name: "David Brown",
      resignationDate: "2025-10-15",
      skill: "Angular",
      client: "Web Solutions",
      projectName: "Dashboard Portal",
      replacementPlan: "Replaced",
      feedback: "Good"
    }
  ];

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
