
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EngineeringTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const EngineeringTab = ({ formData, setFormData }: EngineeringTabProps) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="development" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="qa">QA</TabsTrigger>
        </TabsList>

        <TabsContent value="development">
          <Card>
            <CardHeader>
              <CardTitle>Development Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="codeCoverage">Code Coverage (%)</Label>
                  <Input
                    id="codeCoverage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.codeCoverage}
                    onChange={(e) => setFormData({...formData, codeCoverage: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="performanceScore">Performance Score</Label>
                  <Input
                    id="performanceScore"
                    type="number"
                    step="0.1"
                    value={formData.performanceScore}
                    onChange={(e) => setFormData({...formData, performanceScore: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="buildSuccessRate">Build Success Rate (%)</Label>
                  <Input
                    id="buildSuccessRate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.buildSuccessRate}
                    onChange={(e) => setFormData({...formData, buildSuccessRate: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="deploymentFrequency">Deployment Frequency</Label>
                  <Select value={formData.deploymentFrequency} onValueChange={(value) => setFormData({...formData, deploymentFrequency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="leadTime">Lead Time</Label>
                  <Input
                    id="leadTime"
                    value={formData.leadTime}
                    onChange={(e) => setFormData({...formData, leadTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="mttr">MTTR</Label>
                  <Input
                    id="mttr"
                    value={formData.mttr}
                    onChange={(e) => setFormData({...formData, mttr: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="technicalDebt">Technical Debt</Label>
                  <Select value={formData.technicalDebt} onValueChange={(value) => setFormData({...formData, technicalDebt: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maintainability">Maintainability</Label>
                  <Select value={formData.maintainability} onValueChange={(value) => setFormData({...formData, maintainability: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="securityScore">Security Score</Label>
                  <Input
                    id="securityScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.securityScore}
                    onChange={(e) => setFormData({...formData, securityScore: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="dependenciesUpdated">Dependencies Status</Label>
                  <Select value={formData.dependenciesUpdated} onValueChange={(value) => setFormData({...formData, dependenciesUpdated: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Current">Current</SelectItem>
                      <SelectItem value="Outdated">Outdated</SelectItem>
                      <SelectItem value="Critical Updates">Critical Updates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa">
          <Card>
            <CardHeader>
              <CardTitle>QA Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testCoverage">Test Coverage (%)</Label>
                  <Input
                    id="testCoverage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.testCoverage}
                    onChange={(e) => setFormData({...formData, testCoverage: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="defectLeakageQA">Defect Leakage</Label>
                  <Input
                    id="defectLeakageQA"
                    type="number"
                    value={formData.defectLeakage}
                    onChange={(e) => setFormData({...formData, defectLeakage: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="automationCoverage">Automation Coverage (%)</Label>
                  <Input
                    id="automationCoverage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.automationCoverage || 0}
                    onChange={(e) => setFormData({...formData, automationCoverage: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="testExecutionRate">Test Execution Rate (%)</Label>
                  <Input
                    id="testExecutionRate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.testExecutionRate || 0}
                    onChange={(e) => setFormData({...formData, testExecutionRate: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="bugResolutionTime">Bug Resolution Time</Label>
                  <Input
                    id="bugResolutionTime"
                    placeholder="e.g., 2.5 days"
                    value={formData.bugResolutionTime || ""}
                    onChange={(e) => setFormData({...formData, bugResolutionTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="testCaseEffectiveness">Test Case Effectiveness (%)</Label>
                  <Input
                    id="testCaseEffectiveness"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.testCaseEffectiveness || 0}
                    onChange={(e) => setFormData({...formData, testCaseEffectiveness: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
