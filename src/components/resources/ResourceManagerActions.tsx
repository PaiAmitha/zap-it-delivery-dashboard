
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FolderPlus } from "lucide-react";
import { useState, useEffect } from "react";
import userData from "@/data/userData.json";

interface ResourceManagerActionsProps {
  onAddResource: () => void;
  onProjectAllocation: () => void;
}

export const ResourceManagerActions = ({ 
  onAddResource, 
  onProjectAllocation 
}: ResourceManagerActionsProps) => {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      const userDetails = userData.users.find(u => u.email === parsedUser.email);
      
      // Check if user has resource management permissions
      if (userDetails?.permissions?.resources?.edit) {
        setHasAccess(true);
      }
    }
  }, []);

  if (!hasAccess) {
    return (
      <div className="mb-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-orange-700 font-medium">Access Restricted</p>
              <p className="text-sm text-orange-600 mt-1">
                You don't have permission to manage resources
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Resource Manager Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onAddResource}>
          <CardContent className="flex items-center justify-center p-6 bg-blue-50">
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-700">Add Resource</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onProjectAllocation}>
          <CardContent className="flex items-center justify-center p-6 bg-purple-50">
            <div className="text-center">
              <FolderPlus className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-700">Project Allocation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
