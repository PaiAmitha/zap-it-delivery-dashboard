
import { useEffect, useCallback } from 'react';
import { useGlobalDate } from '@/contexts/GlobalDateContext';
import { useToast } from '@/hooks/use-toast';

interface UseRealtimeDataOptions {
  onDataUpdate?: (dateRange: any) => void;
  updateInterval?: number;
  enableCRUDRefresh?: boolean;
}

export const useRealtimeData = ({ 
  onDataUpdate, 
  updateInterval = 60000, // 1 minute default
  enableCRUDRefresh = true
}: UseRealtimeDataOptions = {}) => {
  const { selectedDateRange, updateLastUpdated } = useGlobalDate();
  const { toast } = useToast();

  const handleDataRefresh = useCallback(() => {
    updateLastUpdated();
    if (onDataUpdate) {
      onDataUpdate(selectedDateRange);
    }
  }, [selectedDateRange, onDataUpdate, updateLastUpdated]);

  // Listen for date filter changes
  useEffect(() => {
    const handleDateFilterChange = (event: CustomEvent) => {
      console.log('Date filter changed:', event.detail);
      handleDataRefresh();
      toast({
        title: "Filter Updated",
        description: "Data refreshed for selected period.",
        duration: 2000,
      });
    };

    window.addEventListener('dateFilterChanged', handleDateFilterChange as EventListener);
    
    return () => {
      window.removeEventListener('dateFilterChanged', handleDateFilterChange as EventListener);
    };
  }, [handleDataRefresh, toast]);

  // Listen for CRUD operations
  useEffect(() => {
    if (!enableCRUDRefresh) return;

    const handleCRUDOperation = (event: CustomEvent) => {
      console.log('CRUD operation detected:', event.detail);
      handleDataRefresh();
      
      const operationType = event.detail.operation || 'update';
      const entityType = event.detail.entity || 'data';
      
      toast({
        title: "Data Synchronized",
        description: `${entityType} ${operationType} completed. All sections updated.`,
        duration: 3000,
      });
    };

    // Listen for various CRUD events
    const crudEvents = [
      'resourceCreated',
      'resourceUpdated', 
      'resourceDeleted',
      'projectCreated',
      'projectUpdated',
      'projectDeleted',
      'financialDataUpdated',
      'escalationCreated',
      'escalationUpdated',
      'escalationDeleted'
    ];

    crudEvents.forEach(eventType => {
      window.addEventListener(eventType, handleCRUDOperation as EventListener);
    });

    return () => {
      crudEvents.forEach(eventType => {
        window.removeEventListener(eventType, handleCRUDOperation as EventListener);
      });
    };
  }, [handleDataRefresh, toast, enableCRUDRefresh]);

  // Periodic data updates
  useEffect(() => {
    const interval = setInterval(() => {
      handleDataRefresh();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [handleDataRefresh, updateInterval]);

  // Trigger CRUD event helper
  const triggerCRUDEvent = useCallback((operation: string, entity: string, data?: any) => {
    const eventName = `${entity}${operation.charAt(0).toUpperCase() + operation.slice(1)}`;
    const customEvent = new CustomEvent(eventName, {
      detail: { operation, entity, data, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(customEvent);
  }, []);

  return {
    refreshData: handleDataRefresh,
    selectedDateRange,
    triggerCRUDEvent,
  };
};
