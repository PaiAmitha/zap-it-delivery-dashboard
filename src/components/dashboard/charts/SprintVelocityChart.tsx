
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const sprintData = [
  { sprint: "Sprint 10", velocity: 38, committed: 40 },
  { sprint: "Sprint 11", velocity: 42, committed: 45 },
  { sprint: "Sprint 12", velocity: 45, committed: 42 },
  { sprint: "Sprint 13", velocity: 41, committed: 43 },
  { sprint: "Sprint 14", velocity: 44, committed: 46 },
  { sprint: "Sprint 15", velocity: 42, committed: 42 }
];

const chartConfig = {
  velocity: {
    label: "Velocity",
    color: "hsl(var(--chart-1))"
  },
  committed: {
    label: "Committed",
    color: "hsl(var(--chart-2))"
  }
};

export const SprintVelocityChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Sprint Velocity Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sprintData}>
              <XAxis 
                dataKey="sprint" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="velocity" 
                stroke="var(--color-velocity)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-velocity)", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: "var(--color-velocity)", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="committed" 
                stroke="var(--color-committed)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-committed)", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: "var(--color-committed)", strokeWidth: 2 }}
                strokeDasharray="8 8"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
