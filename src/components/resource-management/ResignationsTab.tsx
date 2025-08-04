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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResignations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const result = await getResignations(token);
        setResignations((result as any).resignations || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch resignations');
      } finally {
        setLoading(false);
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

  const handleViewDetails = (resourceId: string) => {
    navigate(`/resource-details/${resourceId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">Loading resignations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 w-full">
        <div className="text-center">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

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
                <TableHead>Full Name</TableHead>
                <TableHead>Last Working Day</TableHead>
                <TableHead>Primary Skill</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Replacement Plan</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resignations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">No resignations found.</TableCell>
                </TableRow>
              ) : (
                resignations.map((resignation) => (
                  <TableRow key={resignation.employeeId || resignation.id}>
                    <TableCell>{resignation.employeeId || resignation.id || '-'}</TableCell>
                    <TableCell className="font-medium">{resignation.fullName || '-'}</TableCell>
                    <TableCell>{resignation.last_working_day || '-'}</TableCell>
                    <TableCell>{(() => {
                      let primarySkills = resignation.primarySkills;
                      const cleanSkill = (s: string) => s.replace(/[{}\[\]"\\]+/g, '').trim();
                      if (Array.isArray(primarySkills)) {
                        const cleaned = primarySkills.map(s => cleanSkill(s)).filter(s => !!s);
                        return cleaned.length ? cleaned.join(', ') : '—';
                      }
                      if (typeof primarySkills === 'string') {
                        primarySkills = primarySkills.replace(/[{}\[\]"\\]+/g, '').split(',').map(s => cleanSkill(s)).filter(s => !!s);
                        return primarySkills.length ? primarySkills.join(', ') : '—';
                      }
                      return '—';
                    })()}
                    </TableCell>
                    <TableCell>{resignation.client || '-'}</TableCell>
                    <TableCell>{resignation.project_name || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getReplacementColor(resignation.replacement_plan || '')}>
                        {resignation.replacement_plan || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{resignation.feedback || '-'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(resignation.resourceId || resignation.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
