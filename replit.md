# HabitFlow - Personal Habit Tracker

## Overview

HabitFlow is a modern, mobile-first habit tracking application built as a Progressive Web App (PWA). The application helps users build positive habits through an intuitive interface featuring habit management, progress tracking, analytics, calendar views, and achievement systems. It's designed to be completely free and focuses on providing a clean, user-friendly experience for habit formation and maintenance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing with four main pages (Dashboard, Analytics, Calendar, Achievements)
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Mobile-First Design**: Responsive layout with bottom navigation optimized for mobile devices
- **PWA Features**: Service worker for offline functionality, web app manifest for installability

### Backend Architecture
- **Runtime**: Node.js with Express.js for the REST API server
- **API Design**: RESTful endpoints for habits, habit entries, user statistics, and achievements
- **Data Layer**: In-memory storage implementation with interface-based design for easy database migration
- **Session Management**: Session-based authentication with demo user support
- **Development**: Vite integration for hot module replacement and development server

### Data Storage Solutions
- **Current**: In-memory storage using Map data structures for development and demo purposes
- **Database Ready**: Drizzle ORM configured with PostgreSQL schema definitions for production deployment
- **Schema Design**: Normalized relational structure with separate tables for users, habits, habit entries, and achievements
- **Data Models**: Type-safe schemas using Drizzle-Zod for validation and TypeScript type generation

### Authentication and Authorization
- **Demo Mode**: Simple demo user system for immediate app testing without registration
- **Session-Based**: Express sessions with secure cookie configuration
- **User Isolation**: All data operations scoped to user ID for data privacy and security

## External Dependencies

### Database and ORM
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **Neon Database**: Serverless PostgreSQL database service for production deployment
- **Database Configuration**: Environment-based connection with automatic schema generation

### UI and Styling Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library for interface elements
- **Font Awesome**: Additional icons for habit categorization and visual elements

### Development and Build Tools
- **Vite**: Fast build tool with hot module replacement for development
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Progressive Web App Features
- **Service Worker**: Custom offline caching strategy for app shell and API responses
- **Web App Manifest**: Native app-like installation and appearance configuration
- **Responsive Design**: Mobile-optimized interface with touch-friendly interactions

### Data Visualization and Charts
- **Recharts**: React-based charting library for analytics and progress visualization
- **Date-fns**: Date manipulation and formatting utilities for calendar features
- **Embla Carousel**: Touch-friendly carousel component for habit browsing

The architecture prioritizes developer experience, user interface quality, and scalability while maintaining a simple deployment model suitable for both development and production environments.