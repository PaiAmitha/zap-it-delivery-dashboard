
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialSummaryCard } from "@/components/dashboard/FinancialSummaryCard";
import { useEffect, useState } from "react";
import { getFinance } from "@/lib/api";

export const FinancialsTab = () => {
  const [finance, setFinance] = useState<any>(null);
  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const data = await getFinance(token);
        setFinance(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchFinance();
  }, []);

  // Adapt backend data to FinancialSummaryCard props
  const monthlyFinancialData = finance?.monthlyFinancials || [];
  const ytdTotals = finance?.ytdTotals || { total: 0, billable: 0, nonBillable: 0, intern: 0 };

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
