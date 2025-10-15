# CIK BiH Revizijska Aplikacija

## Overview

This is a real-time electoral monitoring dashboard application for the Central Election Commission of Bosnia and Herzegovina (CIK BiH). The system provides comprehensive oversight of voting locations across BiH entities (Federation of BiH, Republika Srpska, and Brčko District), tracking authentication events, vote validity, and anomalies in real-time. Built as a desktop-optimized dashboard with a Bosnian language interface, it enables election auditors to monitor the electoral process with live data updates and interactive geographic visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool and development server
- **UI Component System**: shadcn/ui component library with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom orange theme (#FF6B35 primary color) and HSL-based color system for light/dark mode support
- **State Management**: TanStack Query (React Query) for server state management with disabled refetching to support real-time simulation
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Updates**: Custom React hook (`useRealTimeUpdates`) that simulates live data updates by periodically mutating query cache
- **Data Visualization**: Recharts for charts (pie charts, bar charts, line charts) and react-leaflet for interactive map visualization
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Layout Design Pattern
- **Desktop-First Approach**: 2x2 grid dashboard layout with full-width table section below
- **Collapsible Sidebar**: Fixed left sidebar navigation with entity-level menu organization
- **Fixed Header**: Orange-themed header (#FF6B35) with CIK BiH branding and user info
- **Component Organization**: Modular dashboard panels (MapaPanel, StatistikePanel, AutentifikacijePanel, AnomalijePanel) for separation of concerns

### Backend Architecture
- **Runtime**: Node.js with Express server
- **API Pattern**: RESTful API endpoints organized by resource (glasacka-mjesta, anomalije)
- **Development Mode**: Vite middleware integration for HMR and dev server
- **Storage Strategy**: In-memory storage implementation (MemStorage class) implementing IStorage interface for easy database swap
- **Mock Data**: Pre-populated mock data for voting locations across BiH entities with realistic metrics

### Database Design (Drizzle ORM Ready)
- **ORM**: Drizzle ORM configured for PostgreSQL with Neon serverless driver
- **Schema Definition**: Type-safe schema in `shared/schema.ts` using drizzle-orm/pg-core
- **Main Tables**:
  - `glasacka_mjesta`: Voting locations with coordinates, status, voter counts, and authentication metrics
  - `anomalije`: Anomaly tracking with severity levels and status
- **Data Validation**: Drizzle-Zod integration for runtime schema validation
- **Migration Strategy**: Drizzle-kit configured with migrations output to `./migrations` directory

### Type Safety & Code Sharing
- **Shared Types**: TypeScript types exported from `shared/schema.ts` used across client and server
- **Path Aliases**: TypeScript path mapping for clean imports (`@/`, `@shared/`, `@assets/`)
- **Validation**: Zod schemas for insert operations ensuring type safety at runtime

### Internationalization
- **Language**: Bosnian (bs) as primary interface language
- **Data Formatting**: Bosnian locale for number formatting (e.g., `toLocaleString('bs')`)
- **Content**: All UI text, labels, and messages in Bosnian

### Design System
- **Color Palette**: 
  - Primary: Orange (#FF6B35) for CIK BiH branding
  - Status indicators: Green (normal), Yellow (warning), Red (critical), Gray (inactive)
  - CSS Variables: HSL-based theming system with `--primary`, `--secondary`, etc.
- **Typography**: Inter font family optimized for Bosnian characters
- **Spacing**: Consistent Tailwind spacing (p-4, p-6, gap-4, gap-6)

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Neon serverless PostgreSQL driver for database connectivity
- **drizzle-orm**: Type-safe ORM for PostgreSQL database operations
- **drizzle-kit**: Database migration and schema management tool

### UI & Visualization
- **@radix-ui/***: Complete suite of accessible UI primitives (dialogs, dropdowns, tooltips, etc.)
- **react-leaflet**: Interactive map components for BiH geographic visualization with Leaflet.js
- **recharts**: Declarative charting library for statistics visualization
- **lucide-react**: Icon library for consistent UI iconography

### Form & Validation
- **react-hook-form**: Performant form management with validation
- **zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Integration layer between react-hook-form and Zod

### State & Data
- **@tanstack/react-query**: Async state management and server cache synchronization
- **wouter**: Minimalist client-side routing (2KB alternative to React Router)

### Development Tools
- **vite**: Fast build tool and dev server with HMR support
- **typescript**: Type safety across full stack
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-***: Replit-specific development enhancements (error overlay, cartographer, dev banner)

### Styling Utilities
- **class-variance-authority**: Type-safe variant-based component styling
- **clsx**: Conditional className utility
- **tailwind-merge**: Merge Tailwind classes without conflicts

### Session & Storage
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not actively used with current in-memory storage)