import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import userData from "@/data/userData.json";

interface HRDataFormProps {
  formData: any;
  onChange: (field: string, value: string) => void;
}

export const HRDataForm = ({ formData, onChange }: HRDataFormProps) => {
  const handleInputChange = onChange;
  const [hasHRAccess, setHasHRAccess] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      const userDetails = userData.users.find(
        (u) => u.email === parsedUser.email
      );

      // Check if user has HR data access
      if (userDetails?.permissions?.personalInfo?.edit) {
        setHasHRAccess(true);
      }
    }
  }, []);

  if (!hasHRAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>HR Data Section</CardTitle>
          <CardDescription>
            Access restricted - HR permissions required
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 bg-orange-50 rounded-lg">
            <div className="text-center">
              <p className="text-orange-700 font-medium">Access Restricted</p>
              <p className="text-sm text-orange-600 mt-1">
                You don't have permission to view or edit HR data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>HR Data Section</CardTitle>
        <CardDescription>
          Basic employee information managed by HR
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) =>
                    handleInputChange("employeeId", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email ID*</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone No.*</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) =>
                    handleInputChange("designation", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("department", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Quality Assurance">
                      Quality Assurance
                    </SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Project Management">
                      Project Management
                    </SelectItem>
                    <SelectItem value="Business Analysis">
                      Business Analysis
                    </SelectItem>
                    <SelectItem value="Data Engineering">
                      Data Engineering
                    </SelectItem>
                    <SelectItem value="Data Science & AI">
                      Data Science & AI
                    </SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Product Management">
                      Product Management
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="seniorityLevel">Seniority Level</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("seniorityLevel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select seniority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Junior (1-3 years)">
                      Junior (1–3 years)
                    </SelectItem>
                    <SelectItem value="Senior (3+ years)">
                      Senior (3+ years)
                    </SelectItem>
                    <SelectItem value="Intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("location", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) =>
                    handleInputChange("joiningDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("employmentType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FTE">
                      FTE (Full Time Employee)
                    </SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reportingManager">Reporting Manager</Label>
                <Input
                  id="reportingManager"
                  value={formData.reportingManager}
                  onChange={(e) =>
                    handleInputChange("reportingManager", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="onNoticePeriod">On Notice Period</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("onNoticePeriod", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.onNoticePeriod === "Yes" && (
                <div>
                  <Label htmlFor="lastWorkingDay">Last Working Day</Label>
                  <Input
                    id="lastWorkingDay"
                    type="date"
                    value={formData.lastWorkingDay}
                    onChange={(e) =>
                      handleInputChange("lastWorkingDay", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
