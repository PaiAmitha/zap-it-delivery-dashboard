import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface MonthlyCostData {
  month: string;
  totalCost: number;
  billableCost: number;
  nonBillableCost: number;
  internCost: number;
  nonBillablePercentage: number;
}

interface FinancialSummaryProps {
  monthlyData: MonthlyCostData[];
  ytdTotals: {
    total: number;
    billable: number;
    nonBillable: number;
    intern: number;
  };
}

export const FinancialSummaryCard = ({ monthlyData, ytdTotals }: FinancialSummaryProps) => {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    return <div className="h-4 w-4" />;
  };

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* YTD Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">YTD Total Cost</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(ytdTotals.total)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">YTD Billable</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(ytdTotals.billable)}
            </div>
            <div className="text-sm text-muted-foreground">
              {((ytdTotals.billable / ytdTotals.total) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">YTD Non-Billable</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(ytdTotals.nonBillable)}
            </div>
            <div className="text-sm text-muted-foreground">
              {((ytdTotals.nonBillable / ytdTotals.total) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">YTD Intern Cost</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(ytdTotals.intern)}
            </div>
            <div className="text-sm text-muted-foreground">
              {((ytdTotals.intern / ytdTotals.total) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Cost Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            Monthly Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Billable Cost</TableHead>
                <TableHead>Non-Billable Cost</TableHead>
                <TableHead>Intern Cost</TableHead>
                <TableHead>Non-Billable %</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((data, index) => {
                const previousMonth = index > 0 ? monthlyData[index - 1] : null;
                return (
                  <TableRow key={data.month}>
                    <TableCell className="font-medium">{data.month}</TableCell>
                    <TableCell>{formatCurrency(data.totalCost)}</TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(data.billableCost)}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      {formatCurrency(data.nonBillableCost)}
                    </TableCell>
                    <TableCell className="text-purple-600">
                      {formatCurrency(data.internCost)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={data.nonBillablePercentage > 20 ? "destructive" : "secondary"}>
                        {data.nonBillablePercentage.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {previousMonth && (
                        <div className="flex items-center gap-1">
                          {getTrendIcon(data.totalCost, previousMonth.totalCost)}
                          <span className="text-sm">
                            {getTrendPercentage(data.totalCost, previousMonth.totalCost)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cost Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Monthly Cost Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line 
                type="monotone" 
                dataKey="billableCost" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Billable Cost"
              />
              <Line 
                type="monotone" 
                dataKey="nonBillableCost" 
                stroke="#f97316" 
                strokeWidth={2}
                name="Non-Billable Cost"
              />
              <Line 
                type="monotone" 
                dataKey="internCost" 
                stroke="#a855f7" 
                strokeWidth={2}
                name="Intern Cost"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};