
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { AddEditEmployeeModal } from "@/components/resources/AddEditEmployeeModal";
import { ProjectAllocationModal } from "@/components/resource-management/ProjectAllocationModal";
import userData from "@/data/userData.json";

export const RMQuickActionsTab = () => {
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [isProjectAllocationModalOpen, setIsProjectAllocationModalOpen] = useState(false);
  const [hasResourceAccess, setHasResourceAccess] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      const userDetails = userData.users.find(u => u.email === parsedUser.email);
      
      // Check if user has resource management permissions
      if (userDetails?.permissions?.resources?.edit) {
        setHasResourceAccess(true);
      }
    }
  }, []);

  if (!hasResourceAccess) {
    return (
      <div className="mb-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Access Restricted</h3>
              <p className="text-sm text-orange-600">
                You don't have permission to manage resources or projects
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Resource Widget */}
        <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Plus className="h-5 w-5" />
              Add Resource
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Add new employees with comprehensive HR, resource, and financial details
            </p>
            <Button 
              onClick={() => setIsAddResourceModalOpen(true)}
              className="w-full"
            >
              Add New Resource
            </Button>
          </CardContent>
        </Card>

        {/* Project Allocation Widget */}
        <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Target className="h-5 w-5" />
              Project Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Smart resource allocation based on skills, availability, and utilization
            </p>
            <Button 
              onClick={() => setIsProjectAllocationModalOpen(true)}
              className="w-full"
              variant="outline"
            >
              Open Allocation Tool
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddEditEmployeeModal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        onSave={(data) => {
          console.log("New resource added:", data);
          setIsAddResourceModalOpen(false);
        }}
        mode="add"
      />

      <ProjectAllocationModal
        isOpen={isProjectAllocationModalOpen}
        onClose={() => setIsProjectAllocationModalOpen(false)}
      />
    </div>
  );
};
