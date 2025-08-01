# HabitFlow - Personal Habit Tracker

## Overview

HabitFlow is a modern, mobile-first habit tracking application built as a Progressive Web App (PWA). The application helps users build positive habits through an intuitive interface featuring habit management, progress tracking, analytics, calendar views, and achievement systems. It's designed to be completely free and focuses on providing a clean, user-friendly experience for habit formation and maintenance.

The app includes inspirational long-term achievements designed to motivate users who commit to years of consistent habit building, with special recognition for 5+ year journeys including milestones like "Diamond Dedication" (5 years), "Time Guardian" (6 years), "Eternal Champion" (7+ years), and "Legendary Soul" (10+ years).

## Recent Enhancements (January 2025)

### Enhanced Habit Creation Experience
- **Expanded Icon Library**: Added 40+ categorized icons across fitness, wellness, nutrition, learning, creative, social, work, and home categories
- **Step-by-Step Modal**: Implemented 3-step habit creation process with progress indicators
- **Category Filtering**: Users can filter icons by category for easier selection
- **Color Customization**: 10 color options with live preview functionality
- **Smart Previews**: Real-time habit preview showing final appearance before creation
- **Improved Form Validation**: Better error handling and user guidance

### Dashboard UI/UX Improvements
- **Quick Action Buttons**: Four prominent action buttons for common tasks (Add Habit, Goals, Analytics, Calendar)
- **Motivational Elements**: Dynamic streak celebration banners and progress insights
- **Smart Notifications**: Contextual messages based on user progress and streaks
- **Habit Suggestions**: Popular habit recommendations for new users
- **Enhanced Empty States**: Inspirational messaging and suggested starter habits
- **Progress Indicators**: Visual completion badges and percentage tracking

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