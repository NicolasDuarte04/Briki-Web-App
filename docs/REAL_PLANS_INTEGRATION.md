# Real Plans Integration Guide

## Overview

This guide explains how to integrate real insurance plans from external providers (SURA, Bolívar, AXA, etc.) into the Briki platform.

## Key Features

### 1. **Dual Plan Support**
The system supports both mock plans (for testing) and real plans (from actual providers):
- Mock plans: Internal test data
- Real plans: External provider links with redirect tracking

### 2. **External Redirect Handling**
When users click "Cotizar" on real plans:
- Opens provider's website in a new tab
- Logs analytics for tracking conversions
- Shows appropriate toast notifications

### 3. **Provider Diversity**
The AI assistant ensures variety by showing only 1 plan per provider (up to 4 total).

## Configuration

### Toggle Between Mock and Real Plans

Set environment variables:
```env
# Use only mock plans
VITE_USE_MOCK_PLANS=true
VITE_ENABLE_MIXED_PLANS=false

# Use only real plans
VITE_USE_MOCK_PLANS=false
VITE_ENABLE_MIXED_PLANS=false

# Use both (testing mode)
VITE_USE_MOCK_PLANS=false
VITE_ENABLE_MIXED_PLANS=true
```

Or toggle programmatically:
```typescript
import { togglePlanSource } from '@/config/plan-sources';

// Switch between mock and real plans
togglePlanSource();
```

## Adding Real Plans

Edit `client/src/data/realPlans.ts`:

```typescript
export const realPlans: RealInsurancePlan[] = [
  {
    id: "sura-auto-premium",
    name: "SURA Auto Premium",
    provider: "SURA",
    category: "auto",
    price: "Desde $150.000 COP/mes",
    basePrice: 150000, // Numeric value for sorting
    description: "Cobertura premium para vehículos",
    features: [
      "Todo riesgo",
      "Carro de reemplazo",
      "Asistencia 24/7"
    ],
    externalLink: "https://www.sura.com/seguros/auto/premium",
    isExternal: true,
    rating: "4.8",
    country: "Colombia"
  }
  // ... more plans
];
```

## Component Usage

### PlanCard Component
Automatically handles external vs internal plans:
```typescript
<PlanCard 
  plan={plan}
  highlighted={index === 0}
  onQuote={handleQuote}
/>
```

### SuggestedPlans Component
Displays AI recommendations with "Ver todos los planes" option:
```typescript
<SuggestedPlans 
  plans={recommendedPlans}
  category="auto"
  onViewAllPlans={() => navigate('/insurance/auto')}
/>
```

### PlanListView Component
Full-featured plan display with filters:
```typescript
<PlanListView
  plans={allPlans}
  category="travel"
  showFilters={true}
  onPlanSelect={handlePlanSelect}
/>
```

## Analytics Tracking

External redirects are logged to track conversion rates:

```typescript
// Automatic logging when user clicks external plan
{
  planId: "sura-auto-001",
  provider: "SURA",
  category: "auto",
  userId: "user123",
  timestamp: "2024-01-20T10:30:00Z"
}
```

## AI Assistant Integration

The unified plan loader ensures the AI assistant uses the correct data source:

```typescript
import { getAIRecommendedPlans } from '@/services/unified-plan-loader';

// Get recommended plans with provider diversity
const plans = await getAIRecommendedPlans(
  userQuery,
  category,
  4 // max plans
);
```

## Testing

1. **Test External Links**
   - Click "Cotizar" on real plans
   - Verify new tab opens with correct URL
   - Check analytics logging in console

2. **Test Plan Sources**
   - Toggle between mock/real/mixed modes
   - Verify correct plans display

3. **Test Filters**
   - Use PlanListView filters
   - Verify price range and provider filters work

## Migration Path

1. **Phase 1**: Deploy with `VITE_USE_MOCK_PLANS=true` (current state)
2. **Phase 2**: Add real plans to `realPlans.ts`
3. **Phase 3**: Enable mixed mode for testing
4. **Phase 4**: Switch to real plans only
5. **Phase 5**: Remove mock plans code

## Troubleshooting

### External Link Not Working
- Check `externalLink` format (must include https://)
- Verify `isExternal: true` is set
- Check browser console for errors

### Plans Not Showing
- Verify plan category matches user query
- Check `basePrice` is set for sorting
- Ensure features array is not empty

### Analytics Not Logging
- Check `/api/log/external-redirect` endpoint
- Verify network tab shows POST request
- Check server logs for errors 