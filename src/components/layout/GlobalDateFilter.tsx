
import { format } from "date-fns";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalDate } from "@/contexts/GlobalDateContext";

export const GlobalDateFilter = () => {
  const { selectedPeriod, setSelectedPeriod, dateOptions } = useGlobalDate();
  
  const selectedOption = dateOptions.find(opt => opt.value === selectedPeriod);

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    // Trigger data refresh when period changes
    window.dispatchEvent(new CustomEvent('dateFilterChanged', { detail: { period: value } }));
  };

  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10">
        <Calendar className="h-4 w-4 text-primary" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-48 justify-between text-foreground hover:bg-accent font-semibold rounded-xl focus-enhanced"
          >
            {selectedOption?.label}
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 p-2 glass-enhanced shadow-xl border-0">
          {dateOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handlePeriodChange(option.value)}
              className={`cursor-pointer rounded-xl p-3 transition-all duration-200 ${
                selectedPeriod === option.value 
                  ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold shadow-sm" 
                  : "hover:bg-accent/50"
              }`}
            >
              <div className="flex flex-col gap-1 w-full">
                <span className="font-semibold">{option.label}</span>
                <span className="text-caption text-muted-foreground">
                  {format(option.period.start, "MMM d")} - {format(option.period.end, "MMM d, yyyy")}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
