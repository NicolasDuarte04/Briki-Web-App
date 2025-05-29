// Re-export components from public layouts
export { ExploreLayout } from './public/explore-layout';

// NOTE: OriginalExploreLayout is deprecated. Remove once migration is complete.
export { ExploreLayout as OriginalExploreLayout } from './explore-layout';

// Re-export components from authenticated layouts
export { AuthenticatedLayout } from './authenticated-layout';

// Re-export company layout - single source of truth
import CompanyLayout from './company-layout';
export { CompanyLayout };

// Re-export other layout components
export { AIAssistantProvider, useAIAssistant } from './ai-assistant-provider';
export { AIAssistantButton } from './ai-assistant-button';

export { ContentWrapper } from './ContentWrapper';
export { HeroWrapper } from './HeroWrapper';
export { MainLayout } from './main-layout';