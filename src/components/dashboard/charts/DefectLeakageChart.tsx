
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const defectData = [
  { sprint: "Sprint 10", bugsPostRelease: 5, totalBugs: 12 },
  { sprint: "Sprint 11", bugsPostRelease: 3, totalBugs: 8 },
  { sprint: "Sprint 12", bugsPostRelease: 2, totalBugs: 6 },
  { sprint: "Sprint 13", bugsPostRelease: 4, totalBugs: 10 },
  { sprint: "Sprint 14", bugsPostRelease: 1, totalBugs: 4 },
  { sprint: "Sprint 15", bugsPostRelease: 3, totalBugs: 7 }
];

const chartConfig = {
  bugsPostRelease: {
    label: "Bugs Post-Release",
    color: "hsl(var(--destructive))"
  },
  totalBugs: {
    label: "Total Bugs",
    color: "hsl(var(--muted-foreground))"
  }
};

export const DefectLeakageChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📉 Defect Leakage Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={defectData}>
              <XAxis 
                dataKey="sprint" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="totalBugs" 
                fill="var(--color-totalBugs)" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="bugsPostRelease" 
                fill="var(--color-bugsPostRelease)" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
