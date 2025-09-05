# CURA - Multi-Vendor Online Pharmacy Platform
## Complete Development Plan & Task Management

### **Project Overview**
CURA is a comprehensive multi-vendor online pharmacy web application that allows customers to buy medicines, skincare, vitamins, and supplements. The platform supports prescription uploads, city-based pharmacy selection, and multiple user dashboards.

### **Brand Colors**
- Primary: #1F1F6F (Dark Blue)
- Secondary: #14274E (Navy Blue) 
- Accent: #394867 (Blue Gray)
- Light: #9BA4B4 (Light Blue Gray)

### **Key Features**
- Multi-language support (English/Arabic - text translation only)
- Egyptian governorate/city-based pharmacy filtering with admin control
- Dynamic city expansion system (start with Ismailia)
- Admin-controlled city visibility and pharmacy coverage
- Cross-city ordering capability (admin-controlled)
- Prescription upload and processing
- Multiple user dashboards (Customer, Admin, Pharmacy, etc.)
- Real-time notifications
- Commission management system
- Cash on delivery payment

---

## **DEVELOPMENT PHASES & TASKS**

### **PHASE 1: FOUNDATION (Days 1-2)**

#### **Day 1 Tasks:**
- [ ] **T1.1** Update color scheme throughout the app
- [ ] **T1.2** Create CURA logo placeholder component
- [ ] **T1.3** Set up internationalization system (i18n)
- [ ] **T1.4** Create base layout components
- [ ] **T1.5** Set up routing structure for all dashboards

**Sub-tasks for T1.1:**
- Update tailwind.config.ts with brand colors
- Update globals.css with custom color variables
- Replace existing colors in all components

**Sub-tasks for T1.3:**
- Install i18n library
- Create translation files (en.json, ar.json)
- Create language switcher component
- Set up translation context

#### **Day 2 Tasks:**
- [ ] **T2.1** Create authentication system structure
- [ ] **T2.2** Set up role-based routing
- [ ] **T2.3** Create Egyptian city selection system with admin control
- [ ] **T2.4** Create base dashboard layouts

**Sub-tasks for T2.1:**
- Create login/register forms
- Set up user context
- Create protected route wrapper
- Add role-based access control

**Sub-tasks for T2.3:**
- Convert from Saudi to Egyptian governorates and cities
- Create comprehensive Egyptian governorate/city database (27 governorates)
- Implement admin-controlled city visibility system
- Add dynamic city addition capability
- Set Ismailia as default enabled city
- Build data structure for governorate-city relationships
- Create admin settings for city management

---

### **PHASE 2: CUSTOMER EXPERIENCE (Days 3-6)**

#### **Day 3 Tasks:**
- [ ] **T3.1** Redesign homepage with brand identity
- [ ] **T3.2** Create product catalog with filtering
- [ ] **T3.3** Implement city-based pharmacy filtering

#### **Day 4 Tasks:**
- [ ] **T4.1** Build individual product pages
- [ ] **T4.2** Add pharmacy price comparison section
- [ ] **T4.3** Create shopping cart functionality
- [ ] **T4.4** Build checkout process (cash only)

#### **Day 5 Tasks:**
- [ ] **T5.1** Create prescription upload component
- [ ] **T5.2** Add camera integration for prescription capture
- [ ] **T5.3** Build prescription processing workflow
- [ ] **T5.4** Create prescription status tracking

#### **Day 6 Tasks:**
- [ ] **T6.1** Build customer dashboard
- [ ] **T6.2** Add order history and tracking
- [ ] **T6.3** Create prescription history section
- [ ] **T6.4** Build subscription management interface

---

### **PHASE 3: ADMIN DASHBOARD (Days 7-9)**

#### **Day 7 Tasks:**
- [ ] **T7.1** Create main admin dashboard with KPIs
- [ ] **T7.2** Build user management system
- [ ] **T7.3** Add real-time analytics
- [ ] **T7.4** Build pharmacy management with commission system
- [ ] **T7.5** Create Egyptian city/governorate management system

**Sub-tasks for T7.5:**
- Build governorate enable/disable interface
- Create city enable/disable controls
- Add new city addition form with location picker
- Build pharmacy coverage area assignment
- Create cross-city ordering toggle
- Add city statistics dashboard
- Implement bulk city operations

#### **Day 8 Tasks:**
- [ ] **T8.1** Build pharmacy-city assignment system
- [ ] **T8.2** Create doctor management with referral system
- [ ] **T8.3** Build vendor management interface
- [ ] **T8.4** Add database input user management
- [ ] **T8.5** Implement cross-city ordering controls

**Sub-tasks for T8.1:**
- Create pharmacy location assignment interface
- Build coverage area management
- Add pharmacy-city relationship controls
- Implement commission per city/governorate

**Sub-tasks for T8.5:**
- Create global cross-city ordering toggle
- Build per-pharmacy cross-city settings
- Add delivery zone management
- Create customer cross-city order interface

#### **Day 9 Tasks:**
- [ ] **T9.1** Create revenue calculation system
- [ ] **T9.2** Build order monitoring dashboard
- [ ] **T9.3** Add prescription tracking system
- [ ] **T9.4** Create notification center

---

### **PHASE 4: SPECIALIZED DASHBOARDS (Days 10-13)**

#### **Day 10 Tasks:**
- [ ] **T10.1** Build pharmacy order request system
- [ ] **T10.2** Add real-time notifications with sound
- [ ] **T10.3** Create product inventory management
- [ ] **T10.4** Add low stock alerts

#### **Day 11 Tasks:**
- [ ] **T11.1** Build prescription reader dashboard
- [ ] **T11.2** Create prescription queue system
- [ ] **T11.3** Add medicine database search
- [ ] **T11.4** Build prescription processing interface

#### **Day 12 Tasks:**
- [ ] **T12.1** Create database input dashboard
- [ ] **T12.2** Build product data entry system
- [ ] **T12.3** Create doctor referral dashboard
- [ ] **T12.4** Add QR code generation for doctors

#### **Day 13 Tasks:**
- [ ] **T13.1** Build vendor dashboard
- [ ] **T13.2** Add vendor inventory tracking
- [ ] **T13.3** Create analytics for all dashboards
- [ ] **T13.4** Build reporting systems

---

### **PHASE 5: ADVANCED FEATURES & POLISH (Days 14-16)**

#### **Day 14 Tasks:**
- [ ] **T14.1** Build subscription system
- [ ] **T14.2** Create medicine interaction checker
- [ ] **T14.3** Add emergency medicine locator
- [ ] **T14.4** Build telemedicine interface

#### **Day 15 Tasks:**
- [ ] **T15.1** Create customer support chat
- [ ] **T15.2** Build health profile system
- [ ] **T15.3** Add store locator with city filtering
- [ ] **T15.4** Create comprehensive search functionality

#### **Day 16 Tasks:**
- [ ] **T16.1** Add beautiful animations throughout app
- [ ] **T16.2** Optimize for mobile responsiveness
- [ ] **T16.3** Performance optimization
- [ ] **T16.4** Final testing and bug fixes

---

## **BUSINESS LOGIC SPECIFICATIONS**

### **Commission System:**
- Each pharmacy has a custom commission percentage (set during account creation)
- Each doctor has a custom referral commission percentage
- Prescription readers commission: TBD (will be provided later)

### **Pricing Logic:**
- Pharmacies set their own prices for medicines
- Product pages show price comparison between pharmacies
- No minimum order amount required

### **Location System:**
- Egyptian governorate/city-based selection (dropdown/search)
- Admin-controlled city visibility (start with Ismailia only)
- Dynamic city expansion through admin dashboard
- Show pharmacies available in enabled cities only
- Cross-city ordering capability (admin-controlled)
- Pharmacy coverage area management
- Show medicines available in assigned pharmacies

### **Payment:**
- Cash on delivery only

---

## **REAL-TIME FEATURES CLASSIFICATION**

### **High Priority:**
- Order notifications to pharmacies (with sound alerts)
- Prescription processing status updates
- Inventory level alerts (low stock warnings)
- Order status tracking for customers

### **Medium Priority:**
- Admin dashboard live analytics updates
- New user registrations notifications
- Commission calculations updates

### **Low Priority:**
- Chat support system
- System maintenance notifications

---

## **FILE STRUCTURE**

### **App Directory Structure:**
app/ ├── (auth)/ │ ├── login/page.tsx │ ├── register/page.tsx │ └── forgot-password/page.tsx ├── (customer)/ │ ├── page.tsx (homepage) │ ├── products/ │ │ ├── page.tsx │ │ └── [id]/page.tsx │ ├── prescription/ │ │ ├── upload/page.tsx │ │ └── status/page.tsx │ ├── cart/page.tsx │ ├── checkout/page.tsx │ ├── profile/page.tsx │ └── subscriptions/page.tsx ├── (admin)/ │ ├── dashboard/page.tsx │ ├── users/page.tsx │ ├── pharmacies/page.tsx │ ├── doctors/page.tsx │ ├── vendors/page.tsx │ ├── database-users/page.tsx │ └── analytics/page.tsx ├── (pharmacy)/ │ ├── dashboard/page.tsx │ ├── orders/page.tsx │ ├── inventory/page.tsx │ └── analytics/page.tsx ├── (prescription-reader)/ │ ├── dashboard/page.tsx │ ├── queue/page.tsx │ └── completed/page.tsx ├── (database-input)/ │ ├── dashboard/page.tsx │ ├── products/page.tsx │ └── categories/page.tsx └── (doctor)/ ├── dashboard/page.tsx ├── referrals/page.tsx └── analytics/page.tsx


### **Components Directory Structure:**
components/ ├── ui/ (shadcn components) ├── layout/ │ ├── Header.tsx │ ├── Footer.tsx │ ├── Sidebar.tsx │ └── DashboardLayout.tsx ├── forms/ │ ├── LoginForm.tsx │ ├── RegisterForm.tsx │ └── PrescriptionUpload.tsx ├── product/ │ ├── ProductCard.tsx │ ├── ProductGrid.tsx │ ├── PharmacyComparison.tsx │ └── AddToCart.tsx ├── dashboard/ │ ├── AdminDashboard.tsx │ ├── PharmacyDashboard.tsx │ ├── CustomerDashboard.tsx │ └── Analytics.tsx └── common/ ├── LanguageSwitcher.tsx ├── CitySelector.tsx ├── Notifications.tsx └── LoadingSpinner.tsx


### **Lib Directory Structure:**
lib/ ├── utils.ts ├── constants.ts ├── translations/ │ ├── en.json │ └── ar.json ├── types.ts ├── mock-data.ts └── api.ts


---

## **DEVELOPMENT GUIDELINES**

### **Code Standards:**
1. Use TypeScript for all components
2. Follow Next.js 14 app router conventions
3. Use Tailwind CSS for styling with brand colors
4. Implement responsive design (mobile-first)
5. Add proper error handling and loading states

### **Component Guidelines:**
1. Create reusable components in `/components/ui/`
2. Use proper TypeScript interfaces
3. Add proper accessibility attributes
4. Implement proper SEO meta tags
5. Use consistent naming conventions

### **Performance Guidelines:**
1. Optimize images with Next.js Image component
2. Implement proper caching strategies
3. Use React.memo for expensive components
4. Implement proper loading states
5. Minimize bundle size

---

## **TESTING CHECKLIST**

### **Before Each Commit:**
- [ ] Test on mobile and desktop
- [ ] Check both English and Arabic translations
- [ ] Verify all links work correctly
- [ ] Test form validations
- [ ] Check responsive design
- [ ] Verify color scheme consistency

### **Before Each Phase Completion:**
- [ ] Test all new features thoroughly
- [ ] Check integration with existing features
- [ ] Verify user flows work end-to-end
- [ ] Test error scenarios
- [ ] Check performance metrics
- [ ] Validate accessibility standards

---

## **NOTES & REMINDERS**

### **Content:**
- Placeholder content will be used during development
- Real content will be provided and updated later
- Both English and Arabic translations needed

### **Images:**
- Sample images provided in development
- High-quality product images needed for production
- Consistent image dimensions required

### **Commission System:**
- Variable commission per pharmacy (set during account creation)
- Variable commission per doctor (set during account creation)
- Prescription reader commission: TBD

### **Future Considerations:**
- Logo design may change
- Color scheme may be updated
- Additional features may be requested