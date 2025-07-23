
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EmployeeRecord {
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  seniorityLevel: string;
  experience: number;
  location: string;
  employmentType: string;
  joiningDate: string;
  reportingManager: string;
  primarySkill: string;
  skillCategory: string;
  billableStatus: boolean;
  currentEngagement: string;
  projectName: string;
  engagementDescription: string;
  engagementStart: string;
  engagementEnd: string;
  engagementDetail: string;
  monthlySalary: number;
}

interface EmployeeRecordsTableProps {
  employees: EmployeeRecord[];
  onView: (employee: EmployeeRecord) => void;
  onEdit: (employee: EmployeeRecord) => void;
  onDelete: (employee: EmployeeRecord) => void;
}

export const EmployeeRecordsTable = ({ 
  employees, 
  onView, 
  onEdit, 
  onDelete 
}: EmployeeRecordsTableProps) => {
  const getEmploymentTypeBadge = (type: string) => {
    switch (type) {
      case "FTE":
        return <Badge className="bg-green-100 text-green-800">FTE</Badge>;
      case "CTR":
        return <Badge className="bg-blue-100 text-blue-800">CTR</Badge>;
      case "Intern":
        return <Badge className="bg-purple-100 text-purple-800">Intern</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  if (employees.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No employees found matching your criteria.
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Seniority Level</TableHead>
            <TableHead>Experience (Years)</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Employment Type</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.employeeId}>
              <TableCell className="font-medium">{employee.employeeId}</TableCell>
              <TableCell>{employee.fullName}</TableCell>
              <TableCell>{employee.designation}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.seniorityLevel}</TableCell>
              <TableCell>{employee.experience}</TableCell>
              <TableCell>{employee.location}</TableCell>
              <TableCell>{getEmploymentTypeBadge(employee.employmentType)}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(employee)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(employee)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {employee.fullName}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(employee)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
