
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Milestone {
  name: string;
  progress: number;
  status: string;
  date: string;
}

interface MilestonesSectionProps {
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
}

export const MilestonesSection = ({ milestones, setMilestones }: MilestonesSectionProps) => {
  const addMilestone = () => {
    const newMilestone: Milestone = {
      name: "",
      progress: 0,
      status: "on track",
      date: ""
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    setMilestones(
      milestones.map((milestone, i) =>
        i === index ? { ...milestone, [field]: value } : milestone
      )
    );
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Milestone Status</CardTitle>
          <Button onClick={addMilestone} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center p-3 border rounded">
              <Input
                placeholder="Milestone Name"
                value={milestone.name}
                onChange={(e) => updateMilestone(index, 'name', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Progress %"
                min="0"
                max="100"
                value={milestone.progress}
                onChange={(e) => updateMilestone(index, 'progress', parseInt(e.target.value))}
              />
              <Select
                value={milestone.status}
                onValueChange={(value) => updateMilestone(index, 'status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on track">On Track</SelectItem>
                  <SelectItem value="at risk">At Risk</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={milestone.date}
                onChange={(e) => updateMilestone(index, 'date', e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeMilestone(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
