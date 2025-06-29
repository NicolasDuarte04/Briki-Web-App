# Testing Real SURA Plans Integration

## ✅ Completed Steps

1. **Updated `realPlans.ts`** with 4 real SURA auto insurance plans
2. **Committed and pushed** changes to GitHub

## 🧪 Testing Steps

### 1. Enable Real Plans Mode

To test the real SURA plans, you need to configure the app to use real plans instead of mock plans:

**Option A: Environment Variable**
Create/update `.env` file in `client/` directory:
```env
VITE_USE_MOCK_PLANS=false
VITE_ENABLE_MIXED_PLANS=false
```

**Option B: Toggle in Browser Console**
```javascript
// Run this in browser console
localStorage.setItem('briki_use_mock_plans', 'false');
location.reload();
```

### 2. Test AI Assistant

1. Navigate to `/ask-briki` or click the AI Assistant button
2. Ask about auto insurance:
   - "Necesito un seguro para mi carro"
   - "Muéstrame seguros de auto"
   - "Qué planes de SURA tienen para autos?"

3. Verify:
   - ✅ Shows 4 SURA plans (Básico, Pérdidas Totales, Clásico, Global)
   - ✅ Each plan shows correct features
   - ✅ "Cotizar" buttons display with external link icon

### 3. Test External Links

1. Click "Cotizar" on any SURA plan
2. Verify:
   - ✅ Opens SURA website in new tab
   - ✅ Shows toast "Redirigiendo al proveedor"
   - ✅ Console shows `[External Redirect]` log

### 4. Check Analytics

Open browser console and look for:
```
[External Redirect] {
  planId: "sura-auto-001",
  provider: "SURA",
  category: "auto",
  userId: "anonymous",
  timestamp: "2024-01-20T..."
}
```

Also check Network tab for POST request to `/api/log/external-redirect`

### 5. Test Plan Display

The 4 SURA plans should show:

**Plan Autos Básico**
- Responsabilidad civil hasta $640M COP
- Link: https://suraenlinea.com/autos/seguro-basico

**Plan Básico Pérdidas Totales**
- Responsabilidad civil hasta $1.040M COP
- Note: "Cotización solo disponible presencialmente"

**Plan Autos Clásico**
- Responsabilidad civil hasta $2.040M COP
- Vehículo de reemplazo incluido

**Plan Autos Global**
- Responsabilidad civil hasta $4.100M COP
- Asistencias premium ilimitadas

## 🐛 Troubleshooting

### Plans Not Showing?
1. Check console for errors
2. Verify `VITE_USE_MOCK_PLANS=false`
3. Clear localStorage and refresh

### External Links Not Working?
1. Check popup blocker settings
2. Verify `isExternal: true` in plan data
3. Check console for network errors

### Still Seeing Mock Plans?
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)
2. Clear site data and refresh
3. Check that server is using unified plan loader

## 📊 Expected Results

When asking about auto insurance, Briki should:
1. Show 4 SURA auto plans
2. Display them with proper formatting
3. Allow external redirect on "Cotizar" click
4. Track analytics for each redirect
5. Show "Ver todos los planes" after recommendations

## 🚀 Next Steps

Once testing is successful:
1. Add more real plans from other providers (Bolívar, AXA, etc.)
2. Implement full category pages with PlanListView
3. Add conversion tracking dashboard
4. Set up A/B testing between mock and real plans 