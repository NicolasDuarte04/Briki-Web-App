import { useLocation } from "wouter";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from "@/components/ui/button";
import { useRecentlyViewed, type InsuranceCategory } from "@/contexts/recently-viewed-context";
import { Navigation, A11y, Virtual, FreeMode } from 'swiper/modules';
import { ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef } from "react";
import { CardHover } from "@/components/ui/apple-transition";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface RecentlyViewedPlansProps {
  category: InsuranceCategory;
}

export default function RecentlyViewedPlans({ category }: RecentlyViewedPlansProps) {
  const [, navigate] = useLocation();
  const { recentlyViewed, formatViewTime, clearRecentlyViewed } = useRecentlyViewed();
  const animationFrameRef = useRef<number | null>(null);
  
  const plans = recentlyViewed[category];
  
  if (plans.length === 0) {
    return null;
  }
  
  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">Recently Viewed Plans</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => clearRecentlyViewed(category)}
          className="text-sm text-gray-500 hover:text-red-500 rounded-full transition-all duration-300"
        >
          <XCircleIcon className="h-4 w-4 mr-1" />
          Clear History
        </Button>
      </div>
      
      <Swiper
        modules={[Navigation, A11y, Virtual, FreeMode]}
        spaceBetween={16}
        slidesPerView="auto"
        navigation
        freeMode={{
          enabled: true,
          minimumVelocity: 0.02,
          momentum: true,
          momentumRatio: 0.5
        }}
        className="py-2"
        virtual={{
          enabled: true,
          addSlidesAfter: 2,
          addSlidesBefore: 2,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {plans.map((plan, index) => (
          <SwiperSlide key={plan.id} className="h-auto" virtualIndex={index}>
            <CardHover>
              <div className="relative h-full overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
                <div className="p-4 h-full flex flex-col bg-gradient-to-b from-white to-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {formatViewTime(plan.viewedAt)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-grow">
                    {plan.description}
                  </p>
                  
                  <div className="flex space-x-2 mt-auto">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        // Navigate based on category using requestAnimationFrame for smoother transitions
                        animationFrameRef.current = requestAnimationFrame(() => {
                          switch (plan.category) {
                            case "travel":
                              navigate("/insurance-plans");
                              break;
                            case "auto":
                              navigate("/auto-insurance");
                              break;
                            case "pet":
                              navigate("/pet-insurance");
                              break;
                            case "health":
                              navigate("/health-insurance");
                              break;
                          }
                        });
                      }} 
                      className="w-full text-xs py-1 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      View Again
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={() => {
                        // Navigate based on category using requestAnimationFrame for smoother transitions
                        animationFrameRef.current = requestAnimationFrame(() => {
                          switch (plan.category) {
                            case "travel":
                              navigate("/compare-plans");
                              break;
                            case "auto":
                              navigate("/auto-compare");
                              break;
                            case "pet":
                              navigate("/pet-compare");
                              break;
                            case "health":
                              navigate("/health-compare");
                              break;
                          }
                        });
                      }} 
                      className="w-full text-xs py-1 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      Compare
                    </Button>
                  </div>
                </div>
              </div>
            </CardHover>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}