import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ComparisonChartProps {
  title: string;
  datasets: {
    name: string;
    color: string;
    points: DataPoint[];
  }[];
  height?: number;
  animated?: boolean;
  delay?: number;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  title,
  datasets,
  height = 300,
  animated = true,
  delay = 300,
}) => {
  const [isVisible, setIsVisible] = useState(!animated);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Find the maximum value across all datasets
  const maxValue = Math.max(
    ...datasets.flatMap(dataset => dataset.points.map(point => point.value))
  );
  
  // Calculate positions and sizes based on data
  useEffect(() => {
    if (animated) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
        }
      );
      
      if (chartRef.current) {
        observer.observe(chartRef.current);
      }
      
      return () => {
        observer.disconnect();
      };
    }
  }, [animated]);
  
  return (
    <div ref={chartRef} className="w-full ai-data-visual p-4">
      <h3 className="text-lg font-semibold mb-4 section-header">{title}</h3>
      
      <div className="flex mb-2">
        {datasets.map((dataset, index) => (
          <div key={index} className="flex items-center mr-4">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: dataset.color }}
            />
            <span className="text-xs text-foreground">{dataset.name}</span>
          </div>
        ))}
      </div>
      
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Grid lines */}
        <div className="absolute inset-0">
          {[0.2, 0.4, 0.6, 0.8].map((value) => (
            <div 
              key={value} 
              className="absolute w-full border-t border-dashed border-muted-foreground/20"
              style={{ bottom: `${value * 100}%` }}
            />
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
          <div>100%</div>
          <div>80%</div>
          <div>60%</div>
          <div>40%</div>
          <div>20%</div>
          <div>0%</div>
        </div>
        
        {/* Data points and lines */}
        <div className="ml-8 h-full flex items-end">
          {datasets[0].points.map((point, pointIndex) => (
            <div 
              key={pointIndex} 
              className="flex-1 flex flex-col items-center justify-end"
            >
              {/* Data bars for each dataset */}
              <div className="relative w-full flex items-end justify-center mb-10">
                {datasets.map((dataset, datasetIndex) => {
                  const dataPoint = dataset.points[pointIndex];
                  const percentage = (dataPoint.value / maxValue) * 100;
                  
                  return (
                    <motion.div
                      key={datasetIndex}
                      className="w-8 mx-1 rounded-t-md"
                      style={{ 
                        backgroundColor: dataset.color,
                        height: isVisible ? `${percentage}%` : "0%",
                        zIndex: datasets.length - datasetIndex,
                      }}
                      initial={{ height: "0%" }}
                      animate={{ height: isVisible ? `${percentage}%` : "0%" }}
                      transition={{ 
                        duration: 0.7, 
                        delay: delay / 1000 + (datasetIndex * 0.1) + (pointIndex * 0.05),
                        type: "spring",
                        stiffness: 50 
                      }}
                    >
                      {/* Value label */}
                      <motion.div 
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isVisible ? 1 : 0 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: delay / 1000 + 0.7 + (datasetIndex * 0.1) + (pointIndex * 0.05) 
                        }}
                      >
                        {dataPoint.value}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* X-axis label */}
              <div className="absolute bottom-0 text-xs font-medium text-muted-foreground">
                {point.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface RadarChartProps {
  title: string;
  categories: string[];
  datasets: {
    name: string;
    color: string;
    values: number[];
  }[];
  size?: number;
  animated?: boolean;
  delay?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  title,
  categories,
  datasets,
  size = 300,
  animated = true,
  delay = 300,
}) => {
  const [isVisible, setIsVisible] = useState(!animated);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Calculate positions based on data
  const getPointCoordinates = (index: number, value: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total;
    const normalizedValue = value / 100; // Assuming 100 is max
    const x = Math.sin(angle) * normalizedValue * size / 2;
    const y = -Math.cos(angle) * normalizedValue * size / 2;
    return { x, y };
  };
  
  // Create polygon points string for SVG
  const getPolygonPoints = (values: number[]) => {
    return values
      .map((value, index) => {
        const { x, y } = getPointCoordinates(index, value, categories.length);
        return `${x + size / 2},${y + size / 2}`;
      })
      .join(" ");
  };
  
  useEffect(() => {
    if (animated) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
        }
      );
      
      if (chartRef.current) {
        observer.observe(chartRef.current);
      }
      
      return () => {
        observer.disconnect();
      };
    }
  }, [animated]);
  
  return (
    <div ref={chartRef} className="w-full ai-data-visual p-4">
      <h3 className="text-lg font-semibold mb-4 section-header">{title}</h3>
      
      <div className="flex mb-2">
        {datasets.map((dataset, index) => (
          <div key={index} className="flex items-center mr-4">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: dataset.color }}
            />
            <span className="text-xs text-foreground">{dataset.name}</span>
          </div>
        ))}
      </div>
      
      <div className="w-full flex justify-center">
        <div 
          className="relative" 
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <svg 
            viewBox={`0 0 ${size} ${size}`} 
            className="w-full h-full"
          >
            {/* Grid lines */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
              <polygon
                key={scale}
                points={getPolygonPoints(Array(categories.length).fill(scale * 100))}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            ))}
            
            {/* Axes */}
            {categories.map((_, index) => {
              const { x, y } = getPointCoordinates(index, 100, categories.length);
              return (
                <line
                  key={index}
                  x1={size / 2}
                  y1={size / 2}
                  x2={x + size / 2}
                  y2={y + size / 2}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Data polygons */}
            {datasets.map((dataset, index) => (
              <motion.polygon
                key={index}
                points={getPolygonPoints(isVisible ? dataset.values : Array(categories.length).fill(0))}
                fill={`${dataset.color}33`}
                stroke={dataset.color}
                strokeWidth="2"
                initial={{ 
                  points: getPolygonPoints(Array(categories.length).fill(0)) 
                }}
                animate={{ 
                  points: getPolygonPoints(isVisible ? dataset.values : Array(categories.length).fill(0)) 
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: delay / 1000 + index * 0.2,
                  type: "spring",
                  stiffness: 50
                }}
              />
            ))}
            
            {/* Data points */}
            {isVisible && datasets.map((dataset, datasetIndex) => (
              <g key={datasetIndex}>
                {dataset.values.map((value, valueIndex) => {
                  const { x, y } = getPointCoordinates(valueIndex, value, categories.length);
                  return (
                    <motion.circle
                      key={valueIndex}
                      cx={x + size / 2}
                      cy={y + size / 2}
                      r="3"
                      fill={dataset.color}
                      stroke="#fff"
                      strokeWidth="1"
                      initial={{ r: 0 }}
                      animate={{ r: 3 }}
                      transition={{
                        duration: 0.3,
                        delay: delay / 1000 + 0.8 + datasetIndex * 0.1 + valueIndex * 0.05,
                      }}
                    />
                  );
                })}
              </g>
            ))}
          </svg>
          
          {/* Category labels */}
          {categories.map((category, index) => {
            const { x, y } = getPointCoordinates(index, 125, categories.length);
            
            // Adjust positions to avoid overlapping
            let adjustedX = x;
            let adjustedY = y;
            
            // Create custom positioning for specific labels to avoid overlaps
            if (category === "Medical") {
              adjustedY -= 5; // Move "Medical" up slightly
            } else if (category === "Evacuation") {
              adjustedX += 10; // Move "Evacuation" right
            }
            
            return (
              <div
                key={index}
                className="absolute text-xs font-medium text-foreground transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${adjustedX + size / 2}px`,
                  top: `${adjustedY + size / 2}px`,
                  maxWidth: "80px",
                  lineHeight: "1.2",
                }}
              >
                {category}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface CoverageComparisonProps {
  title: string;
  plans: {
    name: string;
    color: string;
    coverage: {
      category: string;
      value: number;
      icon?: React.ReactNode;
    }[];
  }[];
  animated?: boolean;
}

export const CoverageComparison: React.FC<CoverageComparisonProps> = ({
  title,
  plans,
  animated = true,
}) => {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [isVisible, setIsVisible] = useState(!animated);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const comparisonRef = useRef<HTMLDivElement>(null);
  
  // Group all categories from all plans
  const allCategories = Array.from(
    new Set(plans.flatMap(plan => plan.coverage.map(item => item.category)))
  );
  
  useEffect(() => {
    if (animated) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
        }
      );
      
      if (comparisonRef.current) {
        observer.observe(comparisonRef.current);
      }
      
      return () => {
        observer.disconnect();
      };
    }
  }, [animated]);
  
  // Check if plan data is loaded properly
  useEffect(() => {
    if (plans && plans.length > 0 && plans[0].coverage && plans[0].coverage.length > 0) {
      setIsDataLoaded(true);
    } else {
      setIsDataLoaded(false);
    }
  }, [plans]);
  
  const getValueForCategory = (planIndex: number, category: string) => {
    const plan = plans[planIndex];
    const coverageItem = plan.coverage.find(item => item.category === category);
    return coverageItem ? coverageItem.value : 0;
  };
  
  const getIconForCategory = (category: string) => {
    for (const plan of plans) {
      const item = plan.coverage.find(item => item.category === category);
      if (item && item.icon) return item.icon;
    }
    return null;
  };
  
  return (
    <div ref={comparisonRef} className="w-full ai-data-visual p-4">
      <h3 className="text-lg font-semibold mb-4 section-header">{title}</h3>
      
      <div className="flex mb-6 space-x-2">
        {plans.map((plan, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedPlan === index
                ? "bg-primary text-white shadow-lg"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            onClick={() => setSelectedPlan(index)}
            style={{
              boxShadow: selectedPlan === index ? `0 0 10px ${plan.color}80` : "",
            }}
          >
            {plan.name}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {allCategories.map((category, index) => {
          const value = getValueForCategory(selectedPlan, category);
          const icon = getIconForCategory(category);
          const plan = plans[selectedPlan];
          
          return (
            <motion.div
              key={category}
              className="bg-card border border-border rounded-lg p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {icon && <div className="mr-2">{icon}</div>}
                  <h4 className="text-sm font-medium">{category}</h4>
                </div>
                <div className="text-sm font-semibold" style={{ color: plan.color }}>
                  {value}%
                </div>
              </div>
              
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full" 
                  style={{ backgroundColor: plan.color }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
                />
              </div>
              
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};