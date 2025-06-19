# Briki AI Insurance Platform - Cursor Agent Diagnostic Assessment

## Project Overview
**Briki** is an AI-powered insurance recommendation platform with a conversational interface that provides personalized insurance plan recommendations displayed as interactive visual glass cards. The platform supports multiple insurance categories (auto, travel, pet, health) and uses OpenAI integration with fallback responses.

## Current Architecture Stack
- **Frontend**: React + TypeScript + Vite + TailwindCSS + Shadcn/UI
- **Backend**: Express.js + TypeScript + PostgreSQL (Neon)
- **AI**: OpenAI GPT integration with context-aware responses
- **Database ORM**: Drizzle ORM
- **Routing**: Wouter (client-side)
- **State Management**: Zustand + TanStack Query
- **Authentication**: Passport.js (Google OAuth + Local)
- **Styling**: TailwindCSS + Framer Motion + Radix UI components

## Key Features Implemented
1. **AI Assistant Chat Interface** - Conversational UI with glass card plan recommendations
2. **Multi-category Insurance Support** - Auto, Travel, Pet, Health insurance plans
3. **Dynamic Plan Matching** - AI analyzes user requests and matches relevant plans
4. **Plan Recommendation Engine** - Shows exact number of plans AI recommends (not hardcoded)
5. **Premium Plan Cards** - Visual glass cards with gradient effects and highlighting
6. **User Authentication** - Google OAuth and local auth with session management
7. **Responsive Design** - Mobile-first approach with adaptive layouts

## Recent Major Improvements (Last Session)
- ✅ Fixed critical plan quantity mismatch between AI recommendations and displayed cards
- ✅ Enhanced category detection with comprehensive Spanish/English keyword matching
- ✅ Removed hardcoded 3-plan limits in favor of dynamic plan counting
- ✅ Comprehensive UI/UX enhancements including premium card styling
- ✅ Improved chat interface with better message differentiation
- ✅ Enhanced welcome card with more compact design
- ✅ Added character counter and typing indicators to input area

## File Structure & Key Components

### Frontend (`/client/src/`)
- `components/briki-ai-assistant/NewBrikiAssistant.tsx` - Main chat interface
- `components/briki-ai-assistant/SuggestedPlans.tsx` - Plan display grid
- `components/briki-ai-assistant/PlanCard.tsx` - Individual plan cards
- `components/briki-ai-assistant/WelcomeCard.tsx` - Initial welcome interface
- `pages/ask-briki-ai.tsx` - AI assistant page container

### Backend (`/server/`)
- `routes.ts` - API endpoints including `/api/ai/chat`
- `services/openai-service.ts` - OpenAI integration and plan matching logic
- `data-loader.ts` - Mock insurance plans and knowledge base loader
- `auth.ts` - Authentication middleware and session management
- `db.ts` - Database connection and Drizzle setup

### Database Schema (`/shared/schema.ts`)
- Users, trips, orders, insurance plans tables
- Proper relations using Drizzle ORM

## Data Sources
- **Mock Insurance Plans**: JSON files in `/server/data/` organized by category
- **Knowledge Base**: Insurance terms, FAQs, destinations, medical conditions
- **AI Context**: Dynamic context creation based on user queries and available plans

## Current Issues & Areas for Investigation

### 1. **Performance & Optimization**
- [ ] Check for any memory leaks in chat interface
- [ ] Analyze bundle size and loading performance
- [ ] Review database query optimization
- [ ] Assess API response times under load

### 2. **AI Integration Robustness**
- [ ] Test OpenAI API error handling and fallback mechanisms
- [ ] Verify plan matching accuracy across different user query patterns
- [ ] Check if context window limits are properly handled
- [ ] Assess Spanish/English language detection reliability

### 3. **User Experience & Accessibility**
- [ ] Test mobile responsiveness across different devices
- [ ] Verify keyboard navigation and screen reader compatibility
- [ ] Check color contrast ratios for accessibility compliance
- [ ] Test chat interface scrolling and message loading behavior

### 4. **Data Integrity & Security**
- [ ] Verify authentication flow security
- [ ] Check for potential XSS or CSRF vulnerabilities
- [ ] Assess session management and token security
- [ ] Validate user input sanitization

### 5. **Code Quality & Maintainability**
- [ ] Review TypeScript type safety across the codebase
- [ ] Check for unused dependencies and code cleanup opportunities
- [ ] Assess component reusability and architecture patterns
- [ ] Review error handling consistency

## Testing Areas to Focus On

### Functional Testing
1. **AI Chat Flow**: Test various insurance queries in Spanish/English
2. **Plan Recommendations**: Verify correct plan matching and display
3. **Authentication**: Test Google OAuth and local login flows
4. **Responsive Design**: Test on mobile, tablet, desktop viewports
5. **Plan Actions**: Test "Ver detalles" and "Cotizar" button functionality

### Technical Testing
1. **API Endpoints**: Test all routes for proper responses and error handling
2. **Database Operations**: Verify CRUD operations work correctly
3. **State Management**: Check React state synchronization
4. **Memory Usage**: Monitor for memory leaks during extended use
5. **Network Resilience**: Test offline/online behavior

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API access (if testing AI features)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (if testing OAuth)

## Development Commands
```bash
npm install          # Install dependencies
npm run dev         # Start development server (frontend + backend)
npm run db:push     # Push database schema changes
npm run build       # Build for production
```

## Expected Outputs from Diagnosis

Please provide a comprehensive assessment covering:

1. **Overall Code Quality Score** (1-10) with justification
2. **Performance Bottlenecks** identified with specific file/line references
3. **Security Vulnerabilities** found and severity assessment
4. **UI/UX Issues** with specific improvement recommendations
5. **Architecture Improvements** suggestions for better scalability
6. **Bug Reports** with steps to reproduce and proposed fixes
7. **Optimization Opportunities** for both frontend and backend
8. **Deployment Readiness** assessment with blocking issues identified

## Priority Areas
1. **Critical**: Security vulnerabilities, data integrity issues
2. **High**: Performance problems, accessibility issues
3. **Medium**: Code quality improvements, UX enhancements
4. **Low**: Nice-to-have optimizations, minor refactoring

## Questions for Investigation
- Is the plan matching algorithm working optimally?
- Are there any race conditions in the chat interface?
- Is the authentication system production-ready?
- Are there any TypeScript type safety issues?
- Is the mobile experience fully functional?
- Are there any unused dependencies or dead code?

Please conduct a thorough analysis and provide actionable insights for improving the platform's quality, performance, and user experience.