
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InternDataFormProps {
  formData: any;
  onChange: (field: string, value: string) => void;
}

export const InternDataForm = ({ formData, onChange }: InternDataFormProps) => {
  const handleInputChange = onChange;
  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="text-blue-900">Intern Details</CardTitle>
        <CardDescription>Comprehensive information for intern resources</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-6 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="internName" className="text-sm font-medium text-gray-700">Intern Name *</Label>
                <Input
                  id="internName"
                  value={formData.internName}
                  onChange={(e) => handleInputChange("internName", e.target.value)}
                  placeholder="Enter intern's full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="internDuration" className="text-sm font-medium text-gray-700">Duration *</Label>
                <Select onValueChange={(value) => handleInputChange("internDuration", value)} value={formData.internDuration}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select internship duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2 months">2 months</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="12 months">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="internDepartment" className="text-sm font-medium text-gray-700">Department *</Label>
                <Select onValueChange={(value) => handleInputChange("internDepartment", value)} value={formData.internDepartment}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Product Management">Product Management</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assignedProject" className="text-sm font-medium text-gray-700">Assigned Project *</Label>
                <Input
                  id="assignedProject"
                  value={formData.assignedProject}
                  onChange={(e) => handleInputChange("assignedProject", e.target.value)}
                  placeholder="Enter assigned project name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="mentor" className="text-sm font-medium text-gray-700">Mentor *</Label>
                <Input
                  id="mentor"
                  value={formData.mentor}
                  onChange={(e) => handleInputChange("mentor", e.target.value)}
                  placeholder="Enter mentor name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="education" className="text-sm font-medium text-gray-700">Education Background *</Label>
                <Select onValueChange={(value) => handleInputChange("education", value)} value={formData.education}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTech Computer Science">BTech Computer Science</SelectItem>
                    <SelectItem value="BTech Information Technology">BTech Information Technology</SelectItem>
                    <SelectItem value="BTech Electronics">BTech Electronics</SelectItem>
                    <SelectItem value="MCA">MCA (Master of Computer Applications)</SelectItem>
                    <SelectItem value="MSc Computer Science">MSc Computer Science</SelectItem>
                    <SelectItem value="MBA">MBA</SelectItem>
                    <SelectItem value="BCA">BCA (Bachelor of Computer Applications)</SelectItem>
                    <SelectItem value="BSc IT">BSc Information Technology</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stipend" className="text-sm font-medium text-gray-700">Monthly Stipend *</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <Input
                    id="stipend"
                    type="number"
                    value={formData.stipend?.replace('$', '') || ''}
                    onChange={(e) => handleInputChange("stipend", e.target.value)}
                    placeholder="Enter monthly stipend amount"
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="conversionStatus" className="text-sm font-medium text-gray-700">Conversion Potential *</Label>
                <Select onValueChange={(value) => handleInputChange("conversionStatus", value)} value={formData.conversionStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select conversion potential" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High Potential</SelectItem>
                    <SelectItem value="Medium">Medium Potential</SelectItem>
                    <SelectItem value="Low">Low Potential</SelectItem>
                    <SelectItem value="Confirmed">Confirmed for Conversion</SelectItem>
                    <SelectItem value="Not Eligible">Not Eligible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="internStatus" className="text-sm font-medium text-gray-700">Current Status *</Label>
                <Select onValueChange={(value) => handleInputChange("internStatus", value)} value={formData.internStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select current status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Extended">Extended</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Additional Info Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Intern Management Guidelines</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure all mandatory fields are completed</li>
                <li>• Stipend should reflect current market standards</li>
                <li>• Regular mentor feedback is essential for conversion assessment</li>
                <li>• Project assignments should align with learning objectives</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
