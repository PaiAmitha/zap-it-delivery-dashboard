
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialSummaryCard } from "@/components/dashboard/FinancialSummaryCard";

export const FinancialsTab = () => {
  const monthlyFinancialData = [
    { 
      month: 'Jan', 
      totalCost: 850000,
      billableCost: 620000, 
      nonBillableCost: 200000, 
      internCost: 30000,
      nonBillablePercentage: 23.5
    },
    { 
      month: 'Feb', 
      totalCost: 875000,
      billableCost: 630000, 
      nonBillableCost: 215000, 
      internCost: 30000,
      nonBillablePercentage: 24.6
    },
    { 
      month: 'Mar', 
      totalCost: 890000,
      billableCost: 640000, 
      nonBillableCost: 220000, 
      internCost: 30000,
      nonBillablePercentage: 24.7
    },
    { 
      month: 'Apr', 
      totalCost: 920000,
      billableCost: 650000, 
      nonBillableCost: 240000, 
      internCost: 30000,
      nonBillablePercentage: 26.1
    },
    { 
      month: 'May', 
      totalCost: 950000,
      billableCost: 660000, 
      nonBillableCost: 255000, 
      internCost: 35000,
      nonBillablePercentage: 26.8
    },
    { 
      month: 'Jun', 
      totalCost: 980000,
      billableCost: 670000, 
      nonBillableCost: 275000, 
      internCost: 35000,
      nonBillablePercentage: 28.1
    }
  ];

  const ytdTotals = {
    total: 5465000,
    billable: 3870000,
    nonBillable: 1405000,
    intern: 190000
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <FinancialSummaryCard
            monthlyData={monthlyFinancialData}
            ytdTotals={ytdTotals}
          />
        </CardContent>
      </Card>
    </div>
  );
};
