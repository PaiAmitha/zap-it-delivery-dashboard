
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { ResourceData } from "@/types/resource";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { useToast } from "@/hooks/use-toast";
import { UserHoverCard } from "@/components/ui/user-hover-card";
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

interface ResourceTableProps {
  resources: ResourceData[];
  onEdit: (resource: ResourceData) => void;
  onView?: (resource: ResourceData) => void;
  onDelete?: (resource: ResourceData) => void;
}

export const ResourceTable = ({ resources, onEdit, onView, onDelete }: ResourceTableProps) => {
  const { triggerCRUDEvent } = useRealtimeData();
  const { toast } = useToast();
  
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const handleEdit = (resource: ResourceData) => {
    onEdit(resource);
  };

  const handleDelete = (resource: ResourceData) => {
    if (onDelete) {
      onDelete(resource);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource List ({resources.length} resources)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Skill Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.employeeId}>
                  <TableCell>{resource.employeeId}</TableCell>
                  <TableCell className="font-medium">
                    <UserHoverCard
                      name={resource.fullName}
                      role={resource.designation}
                      department={resource.department}
                      location={resource.location}
                      email={`${resource.fullName.toLowerCase().replace(/\s+/g, '.')}@company.com`}
                    >
                      <span className="cursor-pointer hover:text-blue-600 transition-colors">
                        {resource.fullName}
                      </span>
                    </UserHoverCard>
                  </TableCell>
                  <TableCell>{resource.designation}</TableCell>
                  <TableCell>{resource.department}</TableCell>
                  <TableCell>{resource.skillCategory}</TableCell>
                  <TableCell>
                    <Badge variant={resource.billableStatus ? "default" : "secondary"}>
                      {resource.billableStatus ? "Billable" : "Non-Billable"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(resource.monthlySalaryCost)}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      {onView && (
                        <Button size="sm" variant="outline" onClick={() => onView(resource)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleEdit(resource)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {onDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {resource.fullName}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(resource)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
