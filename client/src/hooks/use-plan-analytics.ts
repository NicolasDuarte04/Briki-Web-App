import { useMutation } from "@tanstack/react-query";

export const usePlanAnalytics = () => {
  const recordView = useMutation({
    mutationFn: async (planId: number) => {
      const response = await fetch(`/api/company/analytics/view/${planId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to record plan view");
      }
      
      return response.json();
    },
  });

  const recordComparison = useMutation({
    mutationFn: async (planId: number) => {
      const response = await fetch(`/api/company/analytics/comparison/${planId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to record plan comparison");
      }
      
      return response.json();
    },
  });

  const recordConversion = useMutation({
    mutationFn: async (planId: number) => {
      const response = await fetch(`/api/company/analytics/conversion/${planId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to record plan conversion");
      }
      
      return response.json();
    },
  });

  return {
    recordView,
    recordComparison,
    recordConversion,
  };
}; 