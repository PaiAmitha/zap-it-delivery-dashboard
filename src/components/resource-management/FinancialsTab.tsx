import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialSummaryCard } from "@/components/dashboard/FinancialSummaryCard";
import { useEffect, useState } from "react";
import { getFinancialDashboard } from "@/lib/api";

export const FinancialsTab = () => {
  const [finance, setFinance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancials = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const result = await getFinancialDashboard(token);
        setFinance((result as any).financialDashboard || {});
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch financials');
      } finally {
        setLoading(false);
      }
    };
    fetchFinancials();
  }, []);

  // Adapt backend data to FinancialSummaryCard props
  const monthlyFinancialData = (finance?.monthlyFinancials || []).map((item: any) => ({
    month: item.month,
    totalCost: item.total ?? 0,
    billableCost: item.billable ?? 0,
    nonBillableCost: item.nonBillable ?? 0,
    internCost: item.intern ?? 0,
    nonBillablePercentage: item.total ? (item.nonBillable / item.total) * 100 : 0,
  }));
  const ytdTotals = finance?.ytdTotals || { total: 0, billable: 0, nonBillable: 0, intern: 0 };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-500">Loading financials...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (!monthlyFinancialData.length && !ytdTotals.total) ? (
            <div className="text-gray-500">No financial data available.</div>
          ) : (
            <FinancialSummaryCard
              monthlyData={monthlyFinancialData}
              ytdTotals={ytdTotals}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
