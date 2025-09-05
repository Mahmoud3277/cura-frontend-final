# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CURA is a comprehensive multi-vendor online pharmacy platform built with Next.js 14. It serves the Egyptian market with medicines, skincare, vitamins, and healthcare products, featuring prescription upload capabilities and city-based pharmacy selection.

## Development Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
```

## Architecture & Key Concepts

### User Roles & Dashboards

The platform supports 8 distinct user roles, each with dedicated dashboards:
- `customer` - Regular users buying products
- `admin` - System administrators with full control
- `pharmacy` - Pharmacy owners managing inventory and orders
- `prescription-reader` - Staff processing prescription uploads
- `database-input` - Data entry personnel for product catalog
- `doctor` - Medical professionals with referral systems
- `vendor` - Product suppliers
- `app-services` - Customer service and order management

### Route Protection

Authentication and authorization are handled through middleware (`middleware.ts`). The middleware:
- Uses cookie-based authentication (`cura_user`)
- Implements role-based route protection
- Redirects unauthorized users to appropriate dashboards
- Handles public vs authenticated routes

### Context Providers

The app uses React Context for global state management:
- `AuthContext` - User authentication state
- `CartContext` - Shopping cart functionality
- `CityContext` - Egyptian governorate/city selection
- `LanguageContext` - English/Arabic language switching

### Egyptian City System

The platform uses a governorate-based city system:
- 27 Egyptian governorates with their cities
- Admin-controlled city visibility
- Dynamic city expansion capabilities
- Default city: Ismailia
- Cross-city ordering (admin-controlled)

### Service Architecture

All business logic resides in `/lib/services/`:
- Mock services simulate backend functionality
- Each service handles specific domain logic
- Services use localStorage for persistence
- WebSocket service for real-time features

Key services include:
- `cityManagementService` - City/governorate operations
- `pharmacyManagementService` - Pharmacy CRUD and assignments
- `medicineSelectionService` - Prescription medicine selection
- `notificationService` - Real-time notifications
- `orderMonitoringService` - Order tracking and management

### UI Components

- Built with ShadCN UI components (`/components/ui/`)
- Custom components organized by feature (`/components/admin/`, `/components/pharmacy/`, etc.)
- Mobile-optimized components in `/components/mobile/`
- Tailwind CSS for styling with brand colors

### Performance Optimizations

The Next.js configuration includes:
- Standalone output mode
- Image optimization with WebP/AVIF
- Bundle splitting by vendor/UI/contexts
- Tree shaking and dead code elimination
- 30-day cache for static assets

## Important Notes

- No backend API - all data operations use mock services
- No test framework configured - testing would need setup
- Uses localStorage for data persistence
- Real-time features simulated through intervals
- Commission system for pharmacies and doctors
- Cash-on-delivery payment only
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.