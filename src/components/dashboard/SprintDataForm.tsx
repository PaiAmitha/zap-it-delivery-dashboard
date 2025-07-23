
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeliveryMetricsForm } from "@/components/forms/DeliveryMetricsForm";

interface SprintDataFormProps {
  onSubmit: (data: any) => void;
}

export const SprintDataForm = ({ onSubmit }: SprintDataFormProps) => {
  const [sprintData, setSprintData] = useState({
    sprintNumber: 1,
    startDate: "",
    endDate: "",
    sprintGoal: "",
    
    // Delivery Metrics
    sprintVelocity: 0,
    predictability: 0,
    currentSprint: "",
    sprintProgress: 0,
    burndownRate: "On Track",
    velocityTrend: "Stable",
    storyPointsComplete: 0,
    storyPointsTotal: 0,
    qualityScore: 0,
    defectLeakage: 0,
    onTimeDelivery: 0,
    customerSatisfaction: 0,
    featureCompletionRate: 0,
    
    // Development Metrics
    developmentMetrics: {
      plannedStoryPoints: 0,
      completedStoryPoints: 0,
      velocityAchievement: 0,
      codeReviewsCompleted: 0,
      bugsIntroduced: 0,
      technicalDebtHours: 0
    },
    
    // QA Metrics
    qaMetrics: {
      testCasesExecuted: 0,
      testCasesPassed: 0,
      testPassRate: 0
    }
  });

  const [milestones, setMilestones] = useState([
    { name: "Sprint Goal", progress: 0, status: "planned", date: "" }
  ]);

  const [risks, setRisks] = useState([]);

  const calculateVelocityAchievement = () => {
    if (sprintData.developmentMetrics.plannedStoryPoints === 0) return 0;
    return Math.round((sprintData.developmentMetrics.completedStoryPoints / sprintData.developmentMetrics.plannedStoryPoints) * 100);
  };

  const calculateTestPassRate = () => {
    if (sprintData.qaMetrics.testCasesExecuted === 0) return 0;
    return Math.round((sprintData.qaMetrics.testCasesPassed / sprintData.qaMetrics.testCasesExecuted) * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      ...sprintData,
      milestones,
      risks,
      developmentMetrics: {
        ...sprintData.developmentMetrics,
        velocityAchievement: calculateVelocityAchievement()
      },
      qaMetrics: {
        ...sprintData.qaMetrics,
        testPassRate: calculateTestPassRate()
      }
    };
    onSubmit(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sprint Information */}
      <Card>
        <CardHeader>
          <CardTitle>Sprint Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sprintNumber">Sprint Number</Label>
              <Input
                id="sprintNumber"
                type="number"
                value={sprintData.sprintNumber}
                onChange={(e) => setSprintData({...sprintData, sprintNumber: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={sprintData.startDate}
                onChange={(e) => setSprintData({...sprintData, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={sprintData.endDate}
                onChange={(e) => setSprintData({...sprintData, endDate: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="sprintGoal">Sprint Goal</Label>
            <Textarea
              id="sprintGoal"
              placeholder="Enter sprint goal"
              value={sprintData.sprintGoal}
              onChange={(e) => setSprintData({...sprintData, sprintGoal: e.target.value})}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="delivery" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="delivery">Delivery Metrics</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="qa">QA Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="delivery">
          <DeliveryMetricsForm
            formData={sprintData}
            setFormData={setSprintData}
            milestones={milestones}
            setMilestones={setMilestones}
            risks={risks}
            setRisks={setRisks}
          />
        </TabsContent>

        <TabsContent value="development">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💻 Development Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="plannedStoryPoints">Planned Story Points</Label>
                  <Input
                    id="plannedStoryPoints"
                    type="number"
                    value={sprintData.developmentMetrics.plannedStoryPoints}
                    onChange={(e) => setSprintData({
                      ...sprintData,
                      developmentMetrics: {
                        ...sprintData.developmentMetrics,
                        plannedStoryPoints: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="completedStoryPoints">Completed Story Points</Label>
                  <Input
                    id="completedStoryPoints"
                    type="number"
                    value={sprintData.developmentMetrics.completedStoryPoints}
                    onChange={(e) => setSprintData({
                      ...sprintData,
                      developmentMetrics: {
                        ...sprintData.developmentMetrics,
                        completedStoryPoints: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Velocity Achievement</Label>
                  <div className="p-2 bg-muted rounded text-center font-medium">
                    {calculateVelocityAchievement()}%
                  </div>
                </div>
                <div>
                  <Label htmlFor="codeReviewsCompleted">Code Reviews Completed</Label>
                  <Input
                    id="codeReviewsCompleted"
                    type="number"
                    value={sprintData.developmentMetrics.codeReviewsCompleted}
                    onChange={(e) => setSprintData({
                      ...sprintData,
                      developmentMetrics: {
                        ...sprintData.developmentMetrics,
                        codeReviewsCompleted: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="bugsIntroduced">Bugs Introduced</Label>
                  <Input
                    id="bugsIntroduced"
                    type="number"
                    value={sprintData.developmentMetrics.bugsIntroduced}
                    onChange={(e) => setSprintData({
                      ...sprintData,
                      developmentMetrics: {
                        ...sprintData.developmentMetrics,
                        bugsIntroduced: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="technicalDebtHours">Technical Debt Hours</Label>
                  <Input
                    id="technicalDebtHours"
                    type="number"
                    value={sprintData.developmentMetrics.technicalDebtHours}
                    onChange={(e) => setSprintData({
                      ...sprintData,
                      developmentMetrics: {
                        ...sprintData.developmentMetrics,
                        technicalDebtHours: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧪 QA Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="testCasesExecuted">Test Cases Executed</Label>
                  <Input
                    id="testCasesExecuted"
                    type="number"
                    value={sprintData.qaMetrics.testCasesExecuted}
                    onChange={(e) => setSprintData({
                      ...sprintData,
                      qaMetrics: {
                        ...sprintData.qaMetrics,
                        testCasesExecuted: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="testCasesPassed">Test Cases Passed</Label>
                  <Input
                    id="testCasesPassed"
                    type="number"
                    value={sprintData.qaMetrics.testCasesPassed}
                    onChange={(e) => setSprintData({
                      ...sprintData,
                      qaMetrics: {
                        ...sprintData.qaMetrics,
                        testCasesPassed: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Test Pass Rate</Label>
                  <div className="p-2 bg-muted rounded text-center font-medium">
                    {calculateTestPassRate()}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button type="submit">Save Sprint Data</Button>
      </div>
    </form>
  );
};
