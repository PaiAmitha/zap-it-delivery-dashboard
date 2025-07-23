
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DeliveryMetricsFilterProps {
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  totalSprints: number;
}

export const DeliveryMetricsFilter = ({ 
  selectedFilter, 
  onFilterChange, 
  totalSprints 
}: DeliveryMetricsFilterProps) => {
  return (
    <div className="mb-6">
      <Label htmlFor="deliveryFilter" className="text-sm font-medium">
        Delivery Metrics Filter
      </Label>
      <Select value={selectedFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-48 mt-1">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="average">Average</SelectItem>
          {Array.from({ length: totalSprints }, (_, i) => (
            <SelectItem key={i + 1} value={`sprint-${i + 1}`}>
              Sprint {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
