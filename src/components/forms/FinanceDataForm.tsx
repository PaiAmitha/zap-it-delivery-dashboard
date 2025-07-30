
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FinanceDataFormProps {
  formData: any;
  onChange: (field: string, value: string) => void;
}

export const FinanceDataForm = ({ formData, onChange }: FinanceDataFormProps) => {
  const handleInputChange = onChange;
  const handleSalaryChange = (field: string, value: string) => {
    // Remove $ if present and any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    handleInputChange(field, numericValue);
  };

  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardHeader>
        <CardTitle className="text-purple-900">Finance Details</CardTitle>
        <CardDescription>Salary and financial information</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-6 pr-4">
            {/* Salary Information */}
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-4">Salary Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlySalary" className="text-sm font-medium text-gray-700">Monthly Salary *</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
                    <Input
                      id="monthlySalary"
                      type="number"
                      value={formData.monthlySalary?.replace('$', '') || ''}
                      onChange={(e) => handleSalaryChange("monthlySalary", e.target.value)}
                      placeholder="Enter monthly salary"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter amount in USD</p>
                </div>
                <div>
                  <Label htmlFor="annualSalary" className="text-sm font-medium text-gray-700">Annual Salary</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
                    <Input
                      id="annualSalary"
                      type="number"
                      value={formData.monthlySalary ? (parseFloat(formData.monthlySalary.replace('$', '') || '0') * 12).toFixed(0) : ''}
                      readOnly
                      placeholder="Auto-calculated"
                      className="pl-8 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Automatically calculated</p>
                </div>
              </div>
            </div>

            {/* Billing Information (for billable resources) */}
            {formData.billableStatus === "Billable" && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-4">Billing Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingRate" className="text-sm font-medium text-gray-700">Hourly Billing Rate</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
                      <Input
                        id="billingRate"
                        type="number"
                        value={formData.billingRate?.replace('$', '') || ''}
                        onChange={(e) => handleSalaryChange("billingRate", e.target.value)}
                        placeholder="Enter hourly rate"
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="monthlyRevenue" className="text-sm font-medium text-gray-700">Expected Monthly Revenue</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
                      <Input
                        id="monthlyRevenue"
                        type="number"
                        value={formData.billingRate && formData.billingRate !== '' ? 
                          (parseFloat(formData.billingRate.replace('$', '') || '0') * 160).toFixed(0) : ''}
                        readOnly
                        placeholder="Auto-calculated"
                        className="pl-8 bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Based on 160 hours/month</p>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Guidelines */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">Financial Guidelines</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• All salary amounts should be in USD</li>
                <li>• Monthly salary will be used for cost calculations</li>
                <li>• Billing rates should reflect market standards</li>
                <li>• Review salary bands for role consistency</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
