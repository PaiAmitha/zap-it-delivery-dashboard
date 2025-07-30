
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, Users, FolderPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AddEditResourceModal } from "@/components/resources/AddEditResourceModal";
import { ProjectAllocationModal } from "@/components/resource-management/ProjectAllocationModal";

export const RMQuickActionsCard = () => {
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [isProjectAllocationModalOpen, setIsProjectAllocationModalOpen] = useState(false);

  // TODO: Add authentication check for Resource Manager role
  const isResourceManager = true; // This should be replaced with actual auth check

  if (!isResourceManager) {
    return null;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-500" />
          Resource Manager Quick Actions
        </CardTitle>
        <p className="text-gray-600 text-sm">Streamlined access to key resource management functions</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Resource Widget */}
          <Link to="/add-resource" className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:border-blue-200 transition-all duration-300 cursor-pointer hover:shadow-lg" style={{ textDecoration: 'none' }}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500 text-white rounded-lg">
                  <Plus className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-blue-900">Add New Resource</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Add new employees with comprehensive HR, resource, and financial details
              </p>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                type="button"
              >
                Add Resource
              </Button>
            </div>
          </Link>

          {/* Project Allocation Widget */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:border-green-200 transition-all duration-300 cursor-pointer hover:shadow-lg"
               onClick={() => setIsProjectAllocationModalOpen(true)}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 text-white rounded-lg">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-green-900">Project Allocation</h3>
              </div>
              <p className="text-sm text-green-700 mb-4">
                Smart resource allocation based on skills, availability, and utilization
              </p>
              <Button 
                variant="outline" 
                className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white shadow-md hover:shadow-lg transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProjectAllocationModalOpen(true);
                }}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Open Allocation Tool
              </Button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddEditResourceModal
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
      </CardContent>
    </Card>
  );
};
