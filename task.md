# Wed In Click — Full Task Tracker

---

## Phase 1 & 2: Foundation & Global UI ✅
- [x] Scaffold Next.js with Tailwind CSS v4, shadcn/ui, next-intl (AR/FR)
- [x] Design system tokens in `globals.css` (gold, cream, charcoal palette)
- [x] Global Navbar with language switcher
- [x] Global Footer with links and contact info
- [x] Hero Section with search widget
- [x] Modal-based Login & Registration (replaces old page-based auth)

## Phase 3: Authentication & User Profiles ✅
### Backend
- [x] Laravel project initialized with Sanctum
- [x] Users migration (name, email, password, role, phone, language_preference)
- [x] VendorProfiles migration (business_name, category, wilaya, description, address, phone, status)
- [x] Auth endpoints: register/client, register/vendor, login, logout, me
- [x] CORS + Sanctum configured for local IP

### Frontend
- [x] Axios instance with token auth
- [x] Zustand `useAuthStore` (setAuth, clearAuth, fetchUser, logout)
- [x] AuthModal with LoginForm, RegisterClientForm, RegisterVendorForm
- [x] ProtectedRoute component with role-based access
- [x] Dynamic Navbar (shows "Mon Espace" when logged in)

## Phase 4: Discovery & Search ✅
### Backend
- [x] Categories migration/model with 8 seeded categories (AR/FR)
- [x] Services migration/model with vendor/category relationships
- [x] GET /api/categories, GET /api/services, GET /api/services/{id}
- [x] Search filters: category, wilaya, min_price, max_price
- [x] Cloudinary image upload endpoint
- [x] 58 Algerian wilayas constant

### Frontend
- [x] `/search` page with advanced filters (category, wilaya, price range)
- [x] Service detail page `/services/{id}`
- [x] Dynamic categories in filters and vendor registration

## Phase 5: Dashboards & Management ✅
### Backend
- [x] VendorServiceController (CRUD for vendor's own services)
- [x] ProfileController (update user profile + vendor business profile)
- [x] AdminController (metrics, user management, category CRUD)
- [x] All routes registered under `auth:sanctum` middleware

### Frontend
- [x] **Client Dashboard**: Home overview, Profile, Bookings placeholder, Wishlist placeholder
- [x] **Vendor Dashboard**: Overview stats, Service management with modal CRUD, Profile editing
- [x] **Admin Dashboard**: Metrics cards, User management table, Category CRUD
- [x] Responsive sidebar layouts for all three dashboards
- [x] Cursor pointer on all buttons/links (global CSS)

---

## Phase 6: Bookings System
### Backend
- [ ] Create `bookings` migration
  - [ ] Fields: client_id, service_id, vendor_id, event_date, event_type, message, status, price, notes
  - [ ] Status enum: pending, accepted, rejected, completed, cancelled
- [ ] Create `Booking` model with relationships (client, vendor, service)
- [ ] Create `BookingController`:
  - [ ] `POST /api/bookings` — Client submits booking request
  - [ ] `GET /api/bookings` — List bookings (auto-filtered by role)
  - [ ] `GET /api/bookings/{id}` — Single booking detail
  - [ ] `PUT /api/bookings/{id}/accept` — Vendor accepts
  - [ ] `PUT /api/bookings/{id}/reject` — Vendor rejects
  - [ ] `PUT /api/bookings/{id}/complete` — Vendor marks completed
  - [ ] `PUT /api/bookings/{id}/cancel` — Client cancels
- [ ] Register all booking routes in `api.php`

### Frontend — Client
- [ ] **Booking Request Form** on service detail page (date, event type, message)
- [ ] **Client Bookings page** `/client/bookings` — Real data, status badges, filters
- [ ] Booking detail view with status timeline

### Frontend — Vendor
- [ ] **Vendor Bookings page** `/vendor/bookings` — Incoming requests list
- [ ] Accept / Reject / Complete action buttons
- [ ] Booking status filter (Pending, Accepted, Completed)
- [ ] Add "Bookings" link to vendor sidebar navigation

---

## Phase 7: Wishlist System
### Backend
- [ ] Create `wishlists` migration (user_id, service_id, unique constraint)
- [ ] Create `Wishlist` model
- [ ] Create `WishlistController`:
  - [ ] `POST /api/wishlist/{serviceId}` — Toggle add/remove
  - [ ] `GET /api/wishlist` — Get user's wishlist with service details
  - [ ] `GET /api/wishlist/check/{serviceId}` — Check if wishlisted
- [ ] Register wishlist routes in `api.php`

### Frontend
- [ ] **Heart button** component on all service cards
- [ ] **Wishlist page** `/client/wishlist` — Display saved services grid
- [ ] Optimistic toggle with API sync
- [ ] Heart state in service detail page

---

## Phase 8: Reviews & Ratings
### Backend
- [ ] Create `reviews` migration (user_id, service_id, booking_id, rating 1-5, comment)
- [ ] Create `Review` model with relationships
- [ ] Create `ReviewController`:
  - [ ] `POST /api/reviews` — Submit review (validated: completed booking required)
  - [ ] `GET /api/services/{id}/reviews` — Get reviews for a service
- [ ] Add `average_rating` and `reviews_count` computed fields to service API responses
- [ ] Register review routes in `api.php`

### Frontend
- [ ] **Star Rating component** (interactive + display-only modes)
- [ ] **Review submission form** on service detail page (gated by completed booking)
- [ ] **Reviews list** section on service detail page
- [ ] **Average rating stars** displayed on all service cards

---

## Phase 9: Messaging & Contact
### Backend
- [ ] Create `conversations` migration (client_id, vendor_id, service_id, last_message_at)
- [ ] Create `messages` migration (conversation_id, sender_id, body, read_at)
- [ ] Create `Conversation` and `Message` models
- [ ] Create `MessageController`:
  - [ ] `POST /api/conversations` — Start conversation from service page
  - [ ] `GET /api/conversations` — List user's conversations
  - [ ] `GET /api/conversations/{id}/messages` — Get messages
  - [ ] `POST /api/conversations/{id}/messages` — Send message
  - [ ] `PUT /api/conversations/{id}/read` — Mark messages as read
- [ ] Register message routes in `api.php`

### Frontend
- [ ] **"Contacter" button** on service detail page
- [ ] **Messages page** in client dashboard `/client/messages`
- [ ] **Messages page** in vendor dashboard `/vendor/messages`
- [ ] Chat UI with message bubbles, timestamps, send input
- [ ] Unread message badge in sidebar navigation
- [ ] Add "Messages" link to both client and vendor sidebar navs

---

## Phase 10: Notifications
### Backend
- [ ] Create `notifications` migration (user_id, type, title, body, data JSON, read_at)
- [ ] Create `Notification` model
- [ ] Create `NotificationController`:
  - [ ] `GET /api/notifications` — Fetch user's notifications (paginated)
  - [ ] `GET /api/notifications/unread-count` — Unread count
  - [ ] `PUT /api/notifications/read-all` — Mark all as read
- [ ] Create notification helper that fires on:
  - [ ] New booking request (to vendor)
  - [ ] Booking status change (to client)
  - [ ] New message (to recipient)
  - [ ] New review (to vendor)
- [ ] Register notification routes in `api.php`

### Frontend
- [ ] **Notification bell icon** in Navbar with unread count badge
- [ ] **Notification dropdown** with list of recent notifications
- [ ] Click notification → navigate to relevant page
- [ ] Polling every 30 seconds for new notifications

---

## Phase 11: Static & SEO Pages
### Frontend
- [ ] `/about` — About page (mission, how it works, team)
- [ ] `/pricing` — Vendor pricing plans UI
- [ ] `/faq` — FAQ with accordion components
- [ ] `/terms` — Terms of service page
- [ ] `/privacy` — Privacy policy page
- [ ] `/contact` — Contact form page
- [ ] **Custom 404 page** — Beautiful not-found page with navigation
- [ ] **Dynamic meta tags** on service pages (title, description, og:image)
- [ ] **Dynamic meta tags** on category pages

---

## Phase 12: Security & Polish
### Backend
- [ ] **Admin middleware** — Create `EnsureAdmin` middleware for admin routes
- [ ] **Vendor middleware** — Create `EnsureVendor` middleware for vendor routes
- [ ] **Rate limiting** — Apply to auth endpoints (5 attempts/min)
- [ ] **Input sanitization** — Strip HTML from reviews, messages, descriptions

### Frontend
- [ ] **Loading skeletons** on search, dashboard, and listing pages
- [ ] **Error boundaries** — Catch and display errors gracefully
- [ ] **Responsive audit** — Test all pages on mobile (375px), tablet (768px), desktop
- [ ] **Image optimization** — Lazy loading, srcset for different sizes
- [ ] **Accessibility** — ARIA labels on interactive elements, keyboard nav
- [ ] **Empty states** — Beautiful empty states for all list pages
- [ ] **Toast notifications** — Success/error feedback for all actions

---

## Phase 13: Vendor Public Profile
### Backend
- [ ] `GET /api/vendors/{id}` — Public vendor profile endpoint
  - [ ] Include: business info, all services, average rating, review count, location

### Frontend
- [ ] `/vendors/{id}` — Public vendor profile page
  - [ ] Hero banner with vendor info and rating
  - [ ] Service grid showing all vendor's services
  - [ ] Reviews section
  - [ ] Contact / Book CTA buttons
  - [ ] Location map or wilaya display
