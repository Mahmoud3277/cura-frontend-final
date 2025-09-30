# Cura - Multi-Vendor Pharmacy Platform Usage Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Frontend Structure](#frontend-structure)
4. [Backend Structure](#backend-structure)
5. [Customization Guide](#customization-guide)
6. [File Structure & Functionality](#file-structure--functionality)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Development Setup](#development-setup)
9. [Deployment](#deployment)

## Project Overview

Cura is a comprehensive multi-vendor pharmacy platform built with Next.js (frontend) and Node.js/Express (backend). The platform supports:

- **Multi-vendor marketplace** for pharmacies and vendors
- **Prescription management** with AI-powered reading
- **Order management** with real-time tracking
- **User management** (customers, pharmacies, vendors, admins)
- **Cart and checkout** with promo codes
- **Subscription services** for recurring orders
- **Admin dashboard** for platform management
- **Mobile-responsive design** with internationalization

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT tokens
- **File Storage**: Cloudinary, AWS S3
- **Payment**: Stripe integration
- **Real-time**: Socket.io
- **UI Components**: Radix UI, Lucide Icons

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 5000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Structure

### Key Directories

```
1/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── customer/          # Customer portal
│   ├── pharmacy/          # Pharmacy management
│   ├── vendor/            # Vendor management
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   └── page.tsx           # Homepage (Hero section)
├── components/            # Reusable UI components
│   ├── layout/            # Layout components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   └── common/            # Common utilities
├── lib/                   # Utilities and configurations
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── data/              # Static data
└── public/                # Static assets
    ├── images/            # Product images
    └── favicon.ico        # Site favicon
```

## Backend Structure

### Key Directories

```
cura-backend/
├── routes/                # API route handlers
│   ├── admin.js           # Admin operations
│   ├── auth.js            # Authentication
│   ├── cart.js            # Cart management
│   ├── order.js           # Order processing
│   ├── product.js         # Product management
│   ├── vendor.js          # Vendor operations
│   └── pharmacies.js      # Pharmacy operations
├── models/                # MongoDB schemas
├── middleware/            # Express middleware
├── config/                # Database configuration
├── utils/                 # Utility functions
└── server.js              # Main server file
```

## Customization Guide

### 1. Changing the Favicon

**Location**: `1/app/favicon.ico`

To change the favicon:
1. Replace the existing `favicon.ico` file in the `app/` directory
2. Ensure the new favicon is in ICO format (16x16, 32x32, or 48x48 pixels)
3. Clear browser cache to see changes

**Alternative method** (for more formats):
1. Add favicon files to `public/` directory
2. Update `1/app/layout.tsx` to include custom favicon links:

```tsx
// In app/layout.tsx, add to the <head> section:
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

### 2. Modifying the Hero Section

**Location**: `1/app/page.tsx`

The hero section is in the main homepage component. Key areas to modify:

```tsx
// Hero content is around lines 800-900 in page.tsx
// Look for sections with:
- Hero title and subtitle text
- Background images/colors
- Call-to-action buttons
- Featured categories
```

**Key elements to customize**:
- **Hero text**: Search for "Welcome to Cura" or main heading text
- **Background**: Look for `bg-gradient-to-r` or background image classes
- **Buttons**: Find CTA buttons and their links
- **Categories**: Update featured category cards

**Example customization**:
```tsx
// Find and modify the hero title
<h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
  Your Custom Title Here
</h1>

// Update hero description
<p className="text-xl text-white/90 mb-8">
  Your custom description text
</p>
```

## File Structure & Functionality

### Frontend Key Files

#### Core Pages
- **`app/page.tsx`** - Homepage with hero section, featured products, categories
- **`app/layout.tsx`** - Root layout with global providers and metadata
- **`app/globals.css`** - Global styles and Tailwind configuration

#### Authentication
- **`app/auth/login/page.tsx`** - User login page
- **`app/auth/register/page.tsx`** - User registration
- **`app/auth/forgot-password/page.tsx`** - Password reset

#### User Dashboards
- **`app/admin/`** - Admin dashboard pages (users, orders, analytics)
- **`app/customer/`** - Customer portal (orders, profile, prescriptions)
- **`app/pharmacy/`** - Pharmacy management (inventory, orders)
- **`app/vendor/`** - Vendor management (products, orders)

#### Shopping Experience
- **`app/cart/page.tsx`** - Shopping cart with quantity management
- **`app/checkout/page.tsx`** - Checkout process with payment
- **`app/product/[id]/page.tsx`** - Product detail pages
- **`app/search/page.tsx`** - Product search and filtering

#### Core Components
- **`components/layout/ResponsiveHeader.tsx`** - Main navigation header
- **`components/layout/Footer.tsx`** - Site footer
- **`components/ui/`** - Reusable UI components (buttons, inputs, modals)

#### Context & State Management
- **`lib/contexts/CartContext.tsx`** - Shopping cart state management
- **`lib/contexts/AuthContext.tsx`** - User authentication state
- **`lib/contexts/LanguageContext.tsx`** - Internationalization

### Backend Key Files

#### Route Handlers
- **`routes/auth.js`** - Authentication endpoints (login, register, password reset)
- **`routes/admin.js`** - Admin operations (user management, analytics)
- **`routes/product.js`** - Product CRUD operations
- **`routes/order.js`** - Order processing and management
- **`routes/cart.js`** - Shopping cart operations
- **`routes/vendor.js`** - Vendor-specific operations
- **`routes/pharmacies.js`** - Pharmacy-specific operations
- **`routes/prescription.js`** - Prescription management
- **`routes/promoCode.js`** - Promo code management

#### Database Models
- **`models/User.js`** - User schema (customers, admins)
- **`models/Product.js`** - Product schema with inventory
- **`models/Order.js`** - Order schema with items and status
- **`models/Cart.js`** - Shopping cart schema
- **`models/Pharmacy.js`** - Pharmacy profile schema
- **`models/Vendor.js`** - Vendor profile schema
- **`models/Prescription.js`** - Prescription schema

## API Endpoints Reference

### Authentication Endpoints (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset confirmation
- `GET /verify-token` - Token validation

### Product Endpoints (`/api/products`)
- `GET /` - Get all products with filters
- `GET /:id` - Get single product
- `POST /` - Create product (admin/vendor)
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product
- `GET /search` - Search products
- `GET /category/:category` - Get products by category

### Order Endpoints (`/api/orders`)
- `GET /` - Get user orders
- `POST /` - Create new order
- `GET /:id` - Get order details
- `PUT /:id/status` - Update order status
- `POST /:id/cancel` - Cancel order
- `GET /admin/all` - Get all orders (admin)

### Cart Endpoints (`/api/cart`)
- `GET /` - Get user cart
- `POST /add` - Add item to cart
- `PUT /update` - Update cart item quantity
- `DELETE /remove/:itemId` - Remove item from cart
- `DELETE /clear` - Clear entire cart

### Admin Endpoints (`/api/admin`)
- `GET /users` - Get all users
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /analytics` - Get platform analytics
- `GET /orders` - Get all orders
- `POST /promo-codes` - Create promo code

### Vendor Endpoints (`/api/vendors`)
- `GET /profile` - Get vendor profile
- `PUT /profile` - Update vendor profile
- `GET /products` - Get vendor products
- `GET /orders` - Get vendor orders
- `PUT /orders/:id/status` - Update order status

### Pharmacy Endpoints (`/api/pharmacies`)
- `GET /profile` - Get pharmacy profile
- `PUT /profile` - Update pharmacy profile
- `GET /inventory` - Get pharmacy inventory
- `POST /inventory` - Add inventory item
- `GET /orders` - Get pharmacy orders

## Development Setup

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Cloudinary account (for image storage)
- Stripe account (for payments)

### Frontend Setup
```bash
cd 1
npm install
cp .env.example .env.local
# Configure environment variables
npm run dev
```

### Backend Setup
```bash
cd cura-backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Environment Variables

#### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

#### Backend (`.env`)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment (Railway/Heroku)
1. Create new project on Railway/Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Configure network access
3. Get connection string for environment variables

## Common Customizations

### Adding New Product Categories
1. Update category data in `lib/data/categories.ts`
2. Add category routes in `app/[category]/page.tsx`
3. Update navigation in `components/layout/CategoriesBar.tsx`

### Modifying User Roles
1. Update User model in `models/User.js`
2. Add role-based routing in middleware
3. Update frontend role checks in components

### Adding Payment Methods
1. Integrate new payment provider in `lib/services/payment.ts`
2. Update checkout component
3. Add payment handling in backend routes
