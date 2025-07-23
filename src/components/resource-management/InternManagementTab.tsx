
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const InternManagementTab = () => {
  const navigate = useNavigate();

  const interns = [
    {
      id: "INT001",
      name: "Priya Sharma",
      duration: "3 months",
      department: "QA",
      mentor: "Sarah Wilson",
      conversionStatus: "High",
      status: "Active",
      feedback: "Excellent performance"
    },
    {
      id: "INT002",
      name: "Arjun Patel",
      duration: "6 months",
      department: "Engineering",
      mentor: "John Doe",
      conversionStatus: "Medium",
      status: "Active",
      feedback: "Good progress"
    }
  ];

  const getConversionColor = (status: string) => {
    switch (status) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (internId: string) => {
    navigate(`/resource-details/interns?id=${internId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intern Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Intern ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Conversion Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interns.map((intern) => (
                <TableRow key={intern.id}>
                  <TableCell>{intern.id}</TableCell>
                  <TableCell className="font-medium">{intern.name}</TableCell>
                  <TableCell>{intern.duration}</TableCell>
                  <TableCell>{intern.department}</TableCell>
                  <TableCell>{intern.mentor}</TableCell>
                  <TableCell>
                    <Badge className={getConversionColor(intern.conversionStatus)}>
                      {intern.conversionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{intern.status}</TableCell>
                  <TableCell>{intern.feedback}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(intern.id)}
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
