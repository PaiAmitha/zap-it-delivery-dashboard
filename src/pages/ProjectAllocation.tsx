
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

const ProjectAllocation = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    selectedProject: "",
    selectedResource: "",
    allocationStartDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Resource Allocated Successfully",
      description: "Resource has been allocated to the selected project.",
    });
    console.log("Allocation form submitted:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSmartAllocation = () => {
    toast({
      title: "Smart Allocation Initiated",
      description: "Auto-matching resources based on skills and availability...",
    });
    // In a real application, this would trigger ML-based matching
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            <Users className="inline h-8 w-8 mr-3" />
            Smart Project Resource Allocation
          </h1>
          <p className="text-gray-600">Allocate resources to projects efficiently</p>
        </div>
        <div className="flex gap-3">
          <Link to="/resource-management">
            <Button variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Allocation Details</CardTitle>
            <CardDescription>Select project and resource for allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="selectedProject">Select Project *</Label>
                <Select onValueChange={(value) => handleInputChange("selectedProject", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project-alpha">E-commerce Platform - TechCorp</SelectItem>
                    <SelectItem value="beta-platform">Mobile Banking App - FinanceFlow</SelectItem>
                    <SelectItem value="customer-portal">Customer Portal - GlobalTech</SelectItem>
                    <SelectItem value="data-migration">Data Migration - DataCorp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="selectedResource">Select Resource *</Label>
                <Select onValueChange={(value) => handleInputChange("selectedResource", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith - Senior Developer</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson - DevOps Engineer</SelectItem>
                    <SelectItem value="emma-wilson">Emma Wilson - Frontend Developer</SelectItem>
                    <SelectItem value="alex-chen">Alex Chen - QA Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="allocationStartDate">Allocation Start Date</Label>
                <Input
                  id="allocationStartDate"
                  type="date"
                  value={formData.allocationStartDate}
                  onChange={(e) => handleInputChange("allocationStartDate", e.target.value)}
                  placeholder="mm/dd/yyyy"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Allocate Resource
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Smart Resource Matching */}
        <Card>
          <CardHeader>
            <CardTitle>Smart Resource Matching</CardTitle>
            <CardDescription>AI-powered recommendations for optimal allocation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Resource Match Results */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">John Smith</h4>
                    <p className="text-sm text-gray-600">Senior Developer</p>
                  </div>
                  <Badge variant="secondary">Benched</Badge>
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">Node.js</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">Mike Johnson</h4>
                    <p className="text-sm text-gray-600">DevOps Engineer</p>
                  </div>
                  <Badge variant="secondary">Benched</Badge>
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline">AWS</Badge>
                  <Badge variant="outline">Docker</Badge>
                  <Badge variant="outline">Python</Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">Emma Wilson</h4>
                    <p className="text-sm text-gray-600">Frontend Developer</p>
                  </div>
                  <Badge variant="default">Billable</Badge>
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">CSS</Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">Alex Chen</h4>
                    <p className="text-sm text-gray-600">Associate</p>
                  </div>
                  <Badge variant="outline">Associate</Badge>
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline">Testing</Badge>
                  <Badge variant="outline">Automation</Badge>
                  <Badge variant="outline">Selenium</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectAllocation;
