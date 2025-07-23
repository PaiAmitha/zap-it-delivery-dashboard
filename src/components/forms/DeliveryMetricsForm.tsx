
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

interface Milestone {
  name: string;
  progress: number;
  status: string;
  date: string;
}

interface Risk {
  issue: string;
  owner: string;
  priority: string;
  status: string;
}

interface DeliveryMetricsFormProps {
  formData: any;
  setFormData: (data: any) => void;
  milestones?: Milestone[];
  setMilestones?: (milestones: Milestone[]) => void;
  risks?: Risk[];
  setRisks?: (risks: Risk[]) => void;
}

export const DeliveryMetricsForm = ({ 
  formData, 
  setFormData, 
  milestones = [], 
  setMilestones,
  risks = [],
  setRisks 
}: DeliveryMetricsFormProps) => {
  
  const addMilestone = () => {
    if (setMilestones) {
      const newMilestone = {
        name: "New Milestone",
        progress: 0,
        status: "planned",
        date: new Date().toISOString().split('T')[0]
      };
      setMilestones([...milestones, newMilestone]);
    }
  };

  const removeMilestone = (index: number) => {
    if (setMilestones) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    if (setMilestones) {
      const updated = milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      );
      setMilestones(updated);
    }
  };

  const addRisk = () => {
    if (setRisks) {
      const newRisk = {
        issue: "New Risk",
        owner: "Team Lead",
        priority: "medium",
        status: "Active"
      };
      setRisks([...risks, newRisk]);
    }
  };

  const removeRisk = (index: number) => {
    if (setRisks) {
      setRisks(risks.filter((_, i) => i !== index));
    }
  };

  const updateRisk = (index: number, field: string, value: any) => {
    if (setRisks) {
      const updated = risks.map((risk, i) => 
        i === index ? { ...risk, [field]: value } : risk
      );
      setRisks(updated);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sprint Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sprintVelocity">Sprint Velocity</Label>
              <Input
                id="sprintVelocity"
                type="number"
                value={formData.sprintVelocity || ''}
                onChange={(e) => setFormData({...formData, sprintVelocity: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="predictability">Predictability (%)</Label>
              <Input
                id="predictability"
                type="number"
                min="0"
                max="100"
                value={formData.predictability || ''}
                onChange={(e) => setFormData({...formData, predictability: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="currentSprint">Current Sprint</Label>
              <Input
                id="currentSprint"
                placeholder="e.g., Sprint 15"
                value={formData.currentSprint || ''}
                onChange={(e) => setFormData({...formData, currentSprint: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="sprintProgress">Sprint Progress (%)</Label>
              <Input
                id="sprintProgress"
                type="number"
                min="0"
                max="100"
                value={formData.sprintProgress || ''}
                onChange={(e) => setFormData({...formData, sprintProgress: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="burndownRate">Burndown Rate</Label>
              <Select value={formData.burndownRate} onValueChange={(value) => setFormData({...formData, burndownRate: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Track">On Track</SelectItem>
                  <SelectItem value="Behind">Behind</SelectItem>
                  <SelectItem value="Ahead">Ahead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="velocityTrend">Velocity Trend</Label>
              <Select value={formData.velocityTrend} onValueChange={(value) => setFormData({...formData, velocityTrend: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stable">Stable</SelectItem>
                  <SelectItem value="Improving">Improving</SelectItem>
                  <SelectItem value="Declining">Declining</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Story Points & Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storyPointsComplete">Story Points Complete</Label>
              <Input
                id="storyPointsComplete"
                type="number"
                value={formData.storyPointsComplete || ''}
                onChange={(e) => setFormData({...formData, storyPointsComplete: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="storyPointsTotal">Story Points Total</Label>
              <Input
                id="storyPointsTotal"
                type="number"
                value={formData.storyPointsTotal || ''}
                onChange={(e) => setFormData({...formData, storyPointsTotal: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="qualityScore">Quality Score</Label>
              <Input
                id="qualityScore"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.qualityScore || ''}
                onChange={(e) => setFormData({...formData, qualityScore: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="defectLeakage">Defect Leakage</Label>
              <Input
                id="defectLeakage"
                type="number"
                value={formData.defectLeakage || ''}
                onChange={(e) => setFormData({...formData, defectLeakage: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="onTimeDelivery">On-Time Delivery (%)</Label>
              <Input
                id="onTimeDelivery"
                type="number"
                min="0"
                max="100"
                value={formData.onTimeDelivery || ''}
                onChange={(e) => setFormData({...formData, onTimeDelivery: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="customerSatisfaction">Customer Satisfaction (%)</Label>
              <Input
                id="customerSatisfaction"
                type="number"
                min="0"
                max="100"
                value={formData.customerSatisfaction || ''}
                onChange={(e) => setFormData({...formData, customerSatisfaction: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="featureCompletionRate">Feature Completion Rate (%)</Label>
              <Input
                id="featureCompletionRate"
                type="number"
                min="0"
                max="100"
                value={formData.featureCompletionRate || ''}
                onChange={(e) => setFormData({...formData, featureCompletionRate: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {setMilestones && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Milestones</CardTitle>
              <Button onClick={addMilestone} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 items-end p-4 border rounded-lg">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={milestone.name}
                      onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Progress (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={milestone.progress}
                      onChange={(e) => updateMilestone(index, 'progress', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={milestone.status} onValueChange={(value) => updateMilestone(index, 'status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="on track">On Track</SelectItem>
                        <SelectItem value="at risk">At Risk</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={milestone.date}
                      onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Button onClick={() => removeMilestone(index)} size="sm" variant="destructive">
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {setRisks && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Risk Register</CardTitle>
              <Button onClick={addRisk} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Risk
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {risks.map((risk, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 items-end p-4 border rounded-lg">
                  <div>
                    <Label>Issue</Label>
                    <Input
                      value={risk.issue}
                      onChange={(e) => updateRisk(index, 'issue', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Owner</Label>
                    <Input
                      value={risk.owner}
                      onChange={(e) => updateRisk(index, 'owner', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={risk.priority} onValueChange={(value) => updateRisk(index, 'priority', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={risk.status} onValueChange={(value) => updateRisk(index, 'status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Mitigated">Mitigated</SelectItem>
                        <SelectItem value="Monitoring">Monitoring</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button onClick={() => removeRisk(index)} size="sm" variant="destructive">
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
