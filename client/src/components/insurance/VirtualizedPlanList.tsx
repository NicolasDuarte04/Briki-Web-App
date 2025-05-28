import React, { useMemo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { motion } from "framer-motion";
import LazyPlanCard from "./LazyPlanCard";
import { InsurancePlan } from "@/types/insurance";

interface VirtualizedPlanListProps {
  plans: InsurancePlan[];
  onPlanSelect: (plan: InsurancePlan) => void;
  onPlanCompare: (plan: InsurancePlan) => void;
  selectedPlans: string[];
  className?: string;
  itemHeight?: number;
  itemWidth?: number;
  containerHeight?: number;
}

interface GridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    plans: InsurancePlan[];
    columnsPerRow: number;
    onPlanSelect: (plan: InsurancePlan) => void;
    onPlanCompare: (plan: InsurancePlan) => void;
    selectedPlans: string[];
  };
}

function GridItem({ columnIndex, rowIndex, style, data }: GridItemProps) {
  const { plans, columnsPerRow, onPlanSelect, onPlanCompare, selectedPlans } = data;
  const itemIndex = rowIndex * columnsPerRow + columnIndex;
  const plan = plans[itemIndex];

  if (!plan) {
    return <div style={style} />;
  }

  return (
    <div style={{ ...style, padding: '8px' }}>
      <LazyPlanCard
        planId={plan.planId}
        title={plan.name}
        provider={plan.provider || ""}
        price={plan.basePrice || 0}
        description={plan.description}
        features={plan.features}
        badge={plan.tags?.[0]}
        rating={plan.rating || "0"}
        onSelect={() => onPlanSelect(plan)}
        onCompare={() => onPlanCompare(plan)}
        isSelected={selectedPlans.includes(plan.planId)}
        isComparing={selectedPlans.length > 0}
        className="h-full"
      />
    </div>
  );
}

export function VirtualizedPlanList({
  plans,
  onPlanSelect,
  onPlanCompare,
  selectedPlans,
  className = "",
  itemHeight = 400,
  itemWidth = 350,
  containerHeight = 600
}: VirtualizedPlanListProps) {
  const { columnsPerRow, rowCount } = useMemo(() => {
    // Calculate how many columns can fit based on container width
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth - 64 : 1200; // Account for padding
    const cols = Math.floor(containerWidth / itemWidth);
    const actualColumns = Math.max(1, Math.min(cols, 4)); // Between 1-4 columns
    const rows = Math.ceil(plans.length / actualColumns);
    
    return {
      columnsPerRow: actualColumns,
      rowCount: rows
    };
  }, [plans.length, itemWidth]);

  const gridData = useMemo(() => ({
    plans,
    columnsPerRow,
    onPlanSelect,
    onPlanCompare,
    selectedPlans
  }), [plans, columnsPerRow, onPlanSelect, onPlanCompare, selectedPlans]);

  if (plans.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Grid
        height={containerHeight}
        width="100%"
        columnCount={columnsPerRow}
        columnWidth={itemWidth}
        rowCount={rowCount}
        rowHeight={itemHeight}
        itemData={gridData}
      >
        {GridItem}
      </Grid>
    </motion.div>
  );
}

export default VirtualizedPlanList;