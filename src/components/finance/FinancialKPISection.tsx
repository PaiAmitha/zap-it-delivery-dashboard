
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Calculator, AlertTriangle } from "lucide-react";

interface FinancialKPISectionProps {
  totalSOWValue: number;
  totalActualCost: number;
  totalMonthlyBurn: number;
  netMargin: number;
  benchCost: number;
}

export const FinancialKPISection = ({
  totalSOWValue,
  totalActualCost,
  totalMonthlyBurn,
  netMargin,
  benchCost
}: FinancialKPISectionProps) => {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total SOW Value</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{formatCurrency(totalSOWValue)}</div>
          <p className="text-xs text-primary font-medium flex items-center">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            Contracted Revenue
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Actual Costs</CardTitle>
          <Calculator className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{formatCurrency(totalActualCost)}</div>
          <p className="text-xs text-muted-foreground font-medium">
            {formatPercentage((totalActualCost / totalSOWValue) * 100)} of SOW
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Burn</CardTitle>
          <TrendingDown className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{formatCurrency(totalMonthlyBurn)}</div>
          <p className="text-xs text-muted-foreground font-medium">
            Inc. Bench: {formatCurrency(benchCost)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Bench Cost</CardTitle>
          <AlertTriangle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{formatCurrency(benchCost)}</div>
          <p className="text-xs text-muted-foreground font-medium">
            Monthly Non-Revenue
          </p>
        </CardContent>
      </Card>

      <Card className={`bg-card border shadow-sm hover:shadow-md transition-shadow duration-300 ${
        netMargin > 20 ? 'border-primary' : netMargin > 0 ? 'border-yellow-500' : 'border-destructive'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Net Margin</CardTitle>
          {netMargin > 0 ? 
            <TrendingUp className="h-4 w-4 text-primary" /> : 
            <TrendingDown className="h-4 w-4 text-destructive" />
          }
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            netMargin > 20 ? 'text-primary' : netMargin > 0 ? 'text-yellow-600' : 'text-destructive'
          }`}>
            {formatPercentage(netMargin)}
          </div>
          <p className={`text-xs font-medium ${
            netMargin > 20 ? 'text-primary' : netMargin > 0 ? 'text-yellow-600' : 'text-destructive'
          }`}>
            {netMargin > 20 ? 'Healthy' : netMargin > 0 ? 'Monitor' : 'Critical'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
