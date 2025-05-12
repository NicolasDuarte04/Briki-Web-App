import { createContext, useContext, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

// Types for our context
export type InsuranceCategory = "travel" | "auto" | "pet" | "health";

export interface Plan {
  id: string;
  name: string;
  category: InsuranceCategory;
  imageUrl: string;
  description: string;
  rating: number;
  provider?: string;
}

export interface ViewedPlan extends Plan {
  viewedAt: string;
}

interface RecentlyViewedContextType {
  recentlyViewed: Record<InsuranceCategory, ViewedPlan[]>;
  addToRecentlyViewed: (plan: Plan) => void;
  clearRecentlyViewed: (category?: InsuranceCategory) => void;
  formatViewTime: (timestamp: string) => string;
}

// Create the context
const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

// Maximum number of plans to store per category
const MAX_RECENT_PLANS = 5;

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Record<InsuranceCategory, ViewedPlan[]>>({
    travel: [],
    auto: [],
    pet: [],
    health: [],
  });

  // Load from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem("recentlyViewedPlans");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setRecentlyViewed(parsed);
      } catch (error) {
        console.error("Failed to parse recently viewed plans from localStorage", error);
        // Initialize with empty arrays if parsing fails
        setRecentlyViewed({
          travel: [],
          auto: [],
          pet: [],
          health: [],
        });
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("recentlyViewedPlans", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Add a plan to recently viewed
  const addToRecentlyViewed = (plan: Plan) => {
    setRecentlyViewed((prev) => {
      const category = plan.category;
      // Remove if already exists to avoid duplicates
      const filteredPlans = prev[category].filter((p) => p.id !== plan.id);
      // Add the new plan with current timestamp
      const updatedPlan: ViewedPlan = {
        ...plan,
        viewedAt: new Date().toISOString(),
      };
      // Ensure we don't exceed the maximum number of plans
      const updatedPlans = [updatedPlan, ...filteredPlans].slice(0, MAX_RECENT_PLANS);
      
      return {
        ...prev,
        [category]: updatedPlans,
      };
    });
  };

  // Clear recently viewed plans
  const clearRecentlyViewed = (category?: InsuranceCategory) => {
    if (category) {
      setRecentlyViewed((prev) => ({
        ...prev,
        [category]: [],
      }));
    } else {
      setRecentlyViewed({
        travel: [],
        auto: [],
        pet: [],
        health: [],
      });
    }
  };

  // Format view time to readable format (e.g., "5 minutes ago")
  const formatViewTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error("Invalid date format", error);
      return "recently";
    }
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
        formatViewTime,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

// Custom hook for using the context
export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}