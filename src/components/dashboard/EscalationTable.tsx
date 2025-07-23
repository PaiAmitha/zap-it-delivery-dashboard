
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Escalation {
  id: string;
  title: string;
  customer: string;
  project: string;
  owner: string;
  priority: string;
  status: string;
  dateRaised: string;
  resolutionETA: string;
}

interface EscalationTableProps {
  escalations: Escalation[];
  onEdit: (escalation: Escalation) => void;
  onDelete: (id: string) => void;
}

export const EscalationTable = ({ escalations, onEdit, onDelete }: EscalationTableProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast({
      title: "Escalation Deleted",
      description: "The escalation has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleRowClick = (escalationId: string, event: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/escalations/${escalationId}`);
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Raised</TableHead>
            <TableHead>Resolution ETA</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {escalations.map((escalation) => (
            <TableRow 
              key={escalation.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={(e) => handleRowClick(escalation.id, e)}
            >
              <TableCell className="font-medium">{escalation.title}</TableCell>
              <TableCell>{escalation.customer}</TableCell>
              <TableCell>{escalation.project}</TableCell>
              <TableCell>{escalation.owner}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(escalation.priority)}`}>
                  {escalation.priority}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(escalation.status)}`}>
                  {escalation.status}
                </span>
              </TableCell>
              <TableCell>{escalation.dateRaised}</TableCell>
              <TableCell>{escalation.resolutionETA}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(escalation);
                    }}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Escalation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this escalation? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(escalation.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes
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
