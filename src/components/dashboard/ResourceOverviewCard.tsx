
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RoleDistribution {
  role: string;
  count: number;
  percentage: number;
}

interface ExperienceDistribution {
  level: string;
  count: number;
  percentage: number;
}

interface BillableRatio {
  billable: number;
  nonBillable: number;
  billablePercentage: number;
}

interface ResourceOverviewCardProps {
  totalEngineers: number;
  benchPercentage: number;
  allocationPercentage: number;
  roleDistribution: RoleDistribution[];
  experienceDistribution: ExperienceDistribution[];
  billableRatio: BillableRatio;
}

export const ResourceOverviewCard = ({
  totalEngineers,
  benchPercentage,
  allocationPercentage,
  roleDistribution,
  experienceDistribution,
  billableRatio
}: ResourceOverviewCardProps) => {
  const billableCount = Math.round((billableRatio.billablePercentage / 100) * totalEngineers);
  const benchedCount = totalEngineers - billableCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-3xl font-bold text-primary">{totalEngineers}</div>
            <div className="text-sm text-muted-foreground">Total Engineers</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{billableCount}</div>
            <div className="text-sm text-muted-foreground">Billable</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">{benchedCount}</div>
            <div className="text-sm text-muted-foreground">Benched</div>
          </div>
        </div>

        {/* Allocation Visualization */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Allocation Percentage</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Allocation</span>
              <span className="text-sm font-medium">{allocationPercentage}%</span>
            </div>
            <Progress value={allocationPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Role Distribution - With Light Colors */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Role Distribution</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {roleDistribution.map((role, index) => {
              const lightColors = [
                'bg-blue-50 border-blue-200',
                'bg-green-50 border-green-200',
                'bg-purple-50 border-purple-200',
                'bg-orange-50 border-orange-200',
                'bg-pink-50 border-pink-200',
                'bg-teal-50 border-teal-200'
              ];
              const colorClass = lightColors[index % lightColors.length];
              
              return (
                <div key={role.role} className={`flex items-center justify-between p-3 ${colorClass} border rounded-lg`}>
                  <span className="text-sm font-medium">{role.role}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold">{role.count}</div>
                    <div className="text-xs text-muted-foreground">{role.percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Experience Distribution - With Light Colors */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Experience Distribution</h4>
          <div className="grid grid-cols-3 gap-3">
            {experienceDistribution.map((exp, index) => {
              const lightColors = [
                'bg-emerald-50 border-emerald-200',
                'bg-amber-50 border-amber-200',
                'bg-cyan-50 border-cyan-200'
              ];
              const colorClass = lightColors[index % lightColors.length];
              
              return (
                <div key={exp.level} className={`flex items-center justify-between p-3 ${colorClass} border rounded-lg`}>
                  <span className="text-sm font-medium">{exp.level}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold">{exp.count}</div>
                    <div className="text-xs text-muted-foreground">{exp.percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
