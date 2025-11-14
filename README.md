# EV Charging Station Finder - India

A responsive web application to help electric vehicle (EV) owners in India locate, filter, and view information about charging stations.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Mapping**: Mapbox GL
- **Routing**: React Router DOM

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Mapbox account and access token

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_access_token
```

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the schema file: `supabase/schema.sql`
4. Run the seed file: `supabase/seed.sql` (to populate initial data)

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

### Phase 1 (MVP) - Completed

- ✅ Interactive map with station markers
- ✅ Status-based marker colors (Available/Busy/Offline)
- ✅ Search by city, address, or PIN code
- ✅ "Near Me" location search using browser geolocation
- ✅ Filters: Connector Type, Charger Type, Operator, Facilities, Availability
- ✅ Station details panel with full specifications
- ✅ Distance calculation from user location
- ✅ User authentication (Sign Up/Login)
- ✅ Save/remove favorites
- ✅ Save preferred filters (connector type and charging speed)

## Project Structure

```
evcharging/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts (Auth)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Library configurations (Supabase)
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── supabase/
│   ├── schema.sql       # Database schema
│   └── seed.sql         # Seed data
├── docs/                # Documentation
└── package.json
```

## Database Schema

### Tables

- **stations**: Charging station information
- **user_profiles**: User preferences (connector type, charging speed)
- **favorites**: User's favorite stations

See `supabase/schema.sql` for detailed schema definition.

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

### End-to-End Tests with Playwright

The project includes comprehensive E2E tests using Playwright. See [e2e/README.md](./e2e/README.md) for detailed documentation.

#### Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug
```

#### Test Coverage

The E2E tests cover:
- Homepage and UI elements
- Search functionality
- Filter functionality
- User authentication
- Map interactions and geolocation
- Station details panel
- Favorites functionality

## Deployment

The application is ready for deployment to various platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Options

#### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

#### GitHub Pages
- Push to GitHub
- Configure GitHub Actions secrets
- Enable GitHub Pages in repository settings

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

ISC

