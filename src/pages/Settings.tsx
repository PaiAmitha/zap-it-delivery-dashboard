
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your IT Delivery Dashboard settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dashboard Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Configuration</CardTitle>
            <CardDescription>Customize your dashboard appearance and behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="refreshInterval">Auto-refresh Interval (minutes)</Label>
              <Input id="refreshInterval" type="number" defaultValue="5" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Switch id="notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch id="darkMode" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compactView">Compact View</Label>
              <Switch id="compactView" />
            </div>
          </CardContent>
        </Card>

        {/* Project Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Project Management Settings</CardTitle>
            <CardDescription>Configure project-related preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultProjectDuration">Default Project Duration (weeks)</Label>
              <Input id="defaultProjectDuration" type="number" defaultValue="12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warningThreshold">Budget Warning Threshold (%)</Label>
              <Input id="warningThreshold" type="number" defaultValue="80" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoAssignment">Enable Auto Resource Assignment</Label>
              <Switch id="autoAssignment" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="projectNotifications">Project Milestone Notifications</Label>
              <Switch id="projectNotifications" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Resource Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Management Settings</CardTitle>
            <CardDescription>Configure resource allocation and management preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="benchThreshold">Bench Alert Threshold (days)</Label>
              <Input id="benchThreshold" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utilizationTarget">Target Utilization Rate (%)</Label>
              <Input id="utilizationTarget" type="number" defaultValue="85" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="skillMatching">Enable Smart Skill Matching</Label>
              <Switch id="skillMatching" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="benchAlerts">Bench Duration Alerts</Label>
              <Switch id="benchAlerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>General system and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input id="sessionTimeout" type="number" defaultValue="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataRetention">Data Retention Period (months)</Label>
              <Input id="dataRetention" type="number" defaultValue="24" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auditLogs">Enable Audit Logging</Label>
              <Switch id="auditLogs" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
              <Switch id="twoFactor" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />
      
      {/* Updated Role-Based Access Control */}
      <Card>
        <CardHeader>
          <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
          <CardDescription>Current user roles and permissions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">HR Role</h4>
                <p className="text-sm text-blue-600 mb-2">Kratibha Gangwar</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Full access to personal information</li>
                  <li>• Full access to salaries & stipends</li>
                  <li>• No access to projects/resources</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Resource Manager</h4>
                <p className="text-sm text-blue-600 mb-2">Deepthi Nagam L</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Add/edit team resources</li>
                  <li>• Project allocation management</li>
                  <li>• No access to salary/HR data</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Leadership</h4>
                <p className="text-sm text-blue-600 mb-2">CEO, CIO, CTO</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Read-only access to entire dashboard</li>
                  <li>• Executive reports & insights</li>
                  <li>• Escalation management access</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Engineering Manager</h4>
                <p className="text-sm text-blue-600 mb-2">Delivery Owners</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• View project milestones & status</li>
                  <li>• No resource/financial access</li>
                  <li>• Escalation management access</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Finance Head</h4>
                <p className="text-sm text-blue-600 mb-2">Sushama Mohandasan</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Full edit access to salaries</li>
                  <li>• Budget & stipend management</li>
                  <li>• No project/resource access</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
