// Re-export components from public layouts
export { ExploreLayout } from './public/explore-layout';

// Re-export components from authenticated layouts
export { AuthenticatedLayout } from './authenticated/authenticated-layout';

// Original ExploreLayout (deprecated but kept for backward compatibility)
export { ExploreLayout as OriginalExploreLayout } from './explore-layout';

// Re-export other layout components
export { AIAssistantProvider } from './ai-assistant-provider';
export { AIAssistantButton } from './ai-assistant-button';
export { FloatingAssistantButton } from './floating-assistant-button';
export { ContentWrapper } from './ContentWrapper';
export { HeroWrapper } from './HeroWrapper';
export { MainLayout } from './main-layout';
export { useAIAssistantUI } from './ai-assistant-context';