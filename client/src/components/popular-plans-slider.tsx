import { useLocation } from "wouter";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay, EffectFade } from 'swiper/modules';
import { Button } from "./ui/button";
import { useRecentlyViewed, type Plan } from "../contexts/recently-viewed-context";
import { SlideIn } from "./ui/transition-effect";
import { FadeScale, CardHover } from "./ui/apple-transition";
import { useCallback, useEffect, useRef } from "react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface PopularPlansSliderProps {
  plans: Plan[];
}

export default function PopularPlansSlider({ plans }: PopularPlansSliderProps) {
  const [, navigate] = useLocation();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleViewDetails = useCallback((plan: Plan) => {
    addToRecentlyViewed(plan);
    
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
  }, [addToRecentlyViewed, navigate]);

  const handleGetQuote = useCallback((plan: Plan) => {
    addToRecentlyViewed(plan);
    
    // Navigate based on category using requestAnimationFrame for smoother transitions
    animationFrameRef.current = requestAnimationFrame(() => {
      switch (plan.category) {
        case "travel":
          navigate("/trip-info");
          break;
        case "auto":
          navigate("/auto-quote");
          break;
        case "pet":
          navigate("/pet-insurance");
          break;
        case "health":
          navigate("/health-insurance");
          break;
      }
    });
  }, [addToRecentlyViewed, navigate]);

  // Map category to accent color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "travel":
        return "bg-primary";
      case "auto":
        return "bg-green-600";
      case "pet":
        return "bg-yellow-500";
      case "health":
        return "bg-red-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="w-full">
      <SlideIn>
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay, EffectFade]}
          spaceBetween={16}
          slidesPerView="auto"
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          className="py-4"
          // Remove virtual module due to compatibility issues
          speed={600}
          watchSlidesProgress={true}
          grabCursor={true}
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
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
        >
          {plans.map((plan, index) => (
            <SwiperSlide key={plan.id} className="h-auto">
              <FadeScale delay={index * 0.05}>
                <CardHover>
                  <div className="relative h-full overflow-hidden rounded-lg bg-white shadow-lg border border-gray-200">
                    <div className={`py-2 px-4 ${getCategoryColor(plan.category)} text-white text-sm font-semibold backdrop-blur-sm bg-opacity-90`}>
                      {plan.category.charAt(0).toUpperCase() + plan.category.slice(1)} Insurance
                    </div>
                    <div className="p-6 h-full flex flex-col bg-gradient-to-b from-white to-gray-50">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="flex items-center mb-4">
                        {/* Render stars based on rating */}
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(plan.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        {plan.provider && (
                          <span className="ml-2 text-sm text-gray-600">{plan.provider}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-4 flex-grow">
                        {plan.description}
                      </p>
                      <div className="flex space-x-2 mt-auto">
                        <Button 
                          size="sm" 
                          onClick={() => handleViewDetails(plan)} 
                          className="w-full rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => handleGetQuote(plan)} 
                          className="w-full rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                          Get a Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHover>
              </FadeScale>
            </SwiperSlide>
          ))}
        </Swiper>
      </SlideIn>
    </div>
  );
}