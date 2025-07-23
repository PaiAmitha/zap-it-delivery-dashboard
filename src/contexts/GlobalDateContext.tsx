
import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export interface DatePeriod {
  start: Date;
  end: Date;
}

export interface DateOption {
  value: string;
  label: string;
  period: DatePeriod;
}

interface GlobalDateContextType {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  dateOptions: DateOption[];
  selectedDateRange: DatePeriod;
  lastUpdated: Date;
  updateLastUpdated: () => void;
}

const GlobalDateContext = createContext<GlobalDateContextType | undefined>(undefined);

export const useGlobalDate = () => {
  const context = useContext(GlobalDateContext);
  if (!context) {
    throw new Error('useGlobalDate must be used within a GlobalDateProvider');
  }
  return context;
};

export const GlobalDateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const getCurrentMonth = () => {
    const now = new Date();
    return {
      start: startOfMonth(now),
      end: endOfMonth(now)
    };
  };

  const getPreviousMonths = (monthsBack: number) => {
    const now = new Date();
    const targetMonth = subMonths(now, monthsBack);
    return {
      start: startOfMonth(targetMonth),
      end: endOfMonth(targetMonth)
    };
  };

  const dateOptions: DateOption[] = [
    { value: "current", label: "Current Month", period: getCurrentMonth() },
    { value: "last", label: "Last Month", period: getPreviousMonths(1) },
    { value: "last3", label: "Last 3 Months", period: { start: getPreviousMonths(3).start, end: getCurrentMonth().end } },
    { value: "last6", label: "Last 6 Months", period: { start: getPreviousMonths(6).start, end: getCurrentMonth().end } },
  ];

  const selectedDateRange = dateOptions.find(opt => opt.value === selectedPeriod)?.period || getCurrentMonth();

  const updateLastUpdated = () => {
    setLastUpdated(new Date());
  };

  // Simulate real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateLastUpdated();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    selectedPeriod,
    setSelectedPeriod,
    dateOptions,
    selectedDateRange,
    lastUpdated,
    updateLastUpdated,
  };

  return (
    <GlobalDateContext.Provider value={value}>
      {children}
    </GlobalDateContext.Provider>
  );
};
