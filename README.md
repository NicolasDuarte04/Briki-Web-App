# Briki Insurance Platform

An advanced AI-powered multilingual insurance recommendation platform that delivers hyper-personalized experiences through intelligent conversational design and adaptive user interfaces.

## Features

- **AI-Powered Assistant**: Intelligent conversational interface supporting multiple languages
- **Multi-Category Insurance**: Travel, Auto, Pet, and Health insurance plans
- **Plan Visualization**: Interactive cards displaying insurance recommendations
- **Real-time Recommendations**: Context-aware plan suggestions based on user needs
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Secure Authentication**: Google OAuth integration with PostgreSQL sessions

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Radix UI components
- Framer Motion for animations
- Wouter for routing
- TanStack Query for data management

### Backend
- Express.js with TypeScript
- PostgreSQL database with Drizzle ORM
- OpenAI GPT-4 integration
- Passport.js authentication
- Stripe payment processing
- Real-time insurance plan matching

### Development
- Vite for bundling
- ESBuild for fast compilation
- Hot module replacement
- TypeScript strict mode

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- OpenAI API key (optional, falls back to mock responses)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd briki-insurance-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your DATABASE_URL, OPENAI_API_KEY, and other required variables
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API integration
│   │   └── utils/          # Utility functions
├── server/                 # Backend Express application
│   ├── data/              # Insurance plan data
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic services
│   └── auth/              # Authentication modules
├── shared/                # Shared types and schemas
└── migrations/            # Database migrations
```

## Key Components

### AI Assistant
- Natural language processing for insurance queries
- Context-aware recommendations
- Multi-turn conversations with memory
- Support for multiple insurance categories

### Insurance Plans
- Dynamic plan loading from JSON files
- Category-based filtering (travel, auto, pet, health)
- Real-time price comparisons
- Interactive plan cards with detailed information

### Authentication
- Google OAuth integration
- Session-based authentication
- User profile management
- Secure route protection

## API Endpoints

- `POST /api/ai/chat` - AI assistant conversations
- `GET /api/insurance/plans` - Retrieve insurance plans
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/user` - Get current user
- `POST /api/quotes` - Generate insurance quotes

## Environment Variables

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/briki
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
SESSION_SECRET=your_session_secret
```

### Frontend Environment Variables

For production deployment, set these in your hosting platform:

```bash
VITE_API_URL=https://api.brikiapp.com  # Your Express backend URL
VITE_ENABLE_ANALYTICS=true              # Enable analytics in production
```

## Deployment

### Vercel Deployment (Frontend)

The project includes a `vercel.json` configuration that:
- Builds the client application
- Sets up API proxying to the backend
- Handles client-side routing

The API proxy is configured to forward all `/api/*` requests to your Express backend automatically.

### Backend Deployment (Render/Heroku)

Deploy your Express backend separately and ensure:
1. All environment variables are set
2. Database is accessible
3. CORS is configured for your frontend domain

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run check` - TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or open an issue in the repository.
