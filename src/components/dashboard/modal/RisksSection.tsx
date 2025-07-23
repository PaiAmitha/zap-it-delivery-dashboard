
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Risk {
  issue: string;
  owner: string;
  priority: string;
  status: string;
}

interface RisksSectionProps {
  risks: Risk[];
  setRisks: (risks: Risk[]) => void;
}

export const RisksSection = ({ risks, setRisks }: RisksSectionProps) => {
  const addRisk = () => {
    const newRisk: Risk = {
      issue: "",
      owner: "",
      priority: "medium",
      status: "Active"
    };
    setRisks([...risks, newRisk]);
  };

  const updateRisk = (index: number, field: string, value: any) => {
    setRisks(
      risks.map((risk, i) =>
        i === index ? { ...risk, [field]: value } : risk
      )
    );
  };

  const removeRisk = (index: number) => {
    setRisks(risks.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Risk Register</CardTitle>
          <Button onClick={addRisk} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Risk
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {risks.map((risk, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center p-3 border rounded">
              <Input
                placeholder="Risk Issue"
                value={risk.issue}
                onChange={(e) => updateRisk(index, 'issue', e.target.value)}
              />
              <Input
                placeholder="Owner"
                value={risk.owner}
                onChange={(e) => updateRisk(index, 'owner', e.target.value)}
              />
              <Select
                value={risk.priority}
                onValueChange={(value) => updateRisk(index, 'priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={risk.status}
                onValueChange={(value) => updateRisk(index, 'status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Mitigated">Mitigated</SelectItem>
                  <SelectItem value="Monitoring">Monitoring</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeRisk(index)}
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
