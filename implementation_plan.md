# Wed In Click — Full Platform Implementation Plan

A comprehensive, production-grade wedding services marketplace for Algeria, built with Laravel (API) + Next.js (Frontend).

---

## Current Status — What's Already Built

| Phase | Status | Summary |
|-------|--------|---------|
| 1–2: Foundation & UI | ✅ Done | Next.js scaffold, design system, Navbar, Footer, Hero |
| 3: Authentication | ✅ Done | Sanctum auth, role-based registration, Zustand store, modal-based login/register |
| 4: Discovery & Search | ✅ Done | Categories, services, search filters, Cloudinary uploads, 58 wilayas seeded |
| 5: Dashboards (basic) | ✅ Done | Basic client/vendor/admin dashboards, vendor service CRUD, profile editing |

---

## What's Missing for a Real Platform

> [!WARNING]
> The existing implementation has significant gaps that would prevent it from functioning as a real wedding marketplace. Below is a comprehensive plan to address them.

### Critical Gaps Identified

1. **No Booking System** — Clients cannot request or manage bookings with vendors
2. **No Wishlist Backend** — Wishlist page exists but has no API or persistence
3. **No Reviews & Ratings** — No social proof mechanism for services
4. **No Messaging / Contact System** — No way for clients and vendors to communicate
5. **No Notifications** — No email or in-app notifications for any actions
6. **No Admin Role Middleware** — Admin routes have no server-side role enforcement
7. **No Vendor Subscription/Visibility** — No business model for vendor monetization
8. **No Static Pages** — Missing About, FAQ, Terms, Privacy, Pricing pages
9. **No Error/404 Pages** — No custom error handling
10. **No SEO / Meta Tags** — No dynamic meta tags for services and categories
11. **No Image Gallery** — Service detail page doesn't show multiple images properly
12. **No Password Reset** — No forgot password flow
13. **No Vendor Public Profile** — No public-facing vendor page that clients can browse

---

## Phase 6: Bookings System

> [!IMPORTANT]
> This is the core transactional feature. Without it, the platform has no purpose.

### Backend (Laravel)

#### [NEW] Migration: `create_bookings_table`
- Fields: `id`, `client_id`, `service_id`, `vendor_id`, `event_date`, `event_type`, `message`, `status` (enum: pending, accepted, rejected, completed, cancelled), `price`, `notes`, `created_at`, `updated_at`

#### [NEW] `Booking` Model
- Relationships: belongsTo User (client), belongsTo User (vendor), belongsTo Service
- Scopes: `forClient()`, `forVendor()`, `pending()`, `accepted()`

#### [NEW] `BookingController`
- `POST /api/bookings` — Client creates booking request
- `GET /api/bookings` — Authenticated user sees their bookings (client or vendor, auto-filtered)
- `GET /api/bookings/{id}` — Single booking detail
- `PUT /api/bookings/{id}/accept` — Vendor accepts
- `PUT /api/bookings/{id}/reject` — Vendor rejects
- `PUT /api/bookings/{id}/complete` — Vendor marks as completed
- `PUT /api/bookings/{id}/cancel` — Client cancels

### Frontend (Next.js)

#### Client Side
- **Booking Request Form** on service detail page (date picker, event type, message)
- **Bookings List** at `/client/bookings` with status filters and real data
- **Booking Detail** modal/page showing full status timeline

#### Vendor Side
- **Incoming Requests** page at `/vendor/bookings` with Accept/Reject actions
- **Booking Calendar** view showing upcoming accepted bookings
- **Complete Booking** action for finished events

---

## Phase 7: Wishlist System

### Backend (Laravel)

#### [NEW] Migration: `create_wishlists_table`
- Fields: `id`, `user_id`, `service_id`, `created_at`
- Unique constraint on (`user_id`, `service_id`)

#### [NEW] `WishlistController`
- `POST /api/wishlist/{serviceId}` — Toggle (add/remove)
- `GET /api/wishlist` — Get user's saved services
- `GET /api/wishlist/check/{serviceId}` — Check if a service is wishlisted

### Frontend (Next.js)
- **Heart button** on all service cards (toggles wishlist)
- **Wishlist page** at `/client/wishlist` populated with real saved services
- **Optimistic UI** — heart fills immediately, syncs in background

---

## Phase 8: Reviews & Ratings

### Backend (Laravel)

#### [NEW] Migration: `create_reviews_table`
- Fields: `id`, `user_id`, `service_id`, `booking_id`, `rating` (1–5), `comment`, `created_at`

#### [NEW] `ReviewController`
- `POST /api/reviews` — Submit review (only if booking is completed)
- `GET /api/services/{id}/reviews` — Get reviews for a service
- Add `average_rating` and `reviews_count` to service API responses

### Frontend (Next.js)
- **Star Rating** component (interactive for submission, display-only for listing)
- **Review Form** on service detail page (only shown to clients with completed bookings)
- **Reviews List** section on service detail page
- **Rating display** on service cards throughout the platform

---

## Phase 9: Messaging & Contact

### Backend (Laravel)

#### [NEW] Migration: `create_conversations_table` and `create_messages_table`
- Conversations: `id`, `client_id`, `vendor_id`, `service_id`, `created_at`
- Messages: `id`, `conversation_id`, `sender_id`, `body`, `read_at`, `created_at`

#### [NEW] `MessageController`
- `POST /api/conversations` — Start a conversation
- `GET /api/conversations` — List user's conversations
- `GET /api/conversations/{id}/messages` — Get messages in a conversation
- `POST /api/conversations/{id}/messages` — Send a message
- `PUT /api/conversations/{id}/read` — Mark as read

### Frontend (Next.js)
- **"Contacter" button** on service detail page
- **Messages page** in both client and vendor dashboards
- **Chat UI** with message bubbles, timestamps, and read status
- **Unread badge** in sidebar navigation

---

## Phase 10: Notifications

### Backend (Laravel)
- Laravel Notifications (database driver)
- **Migration**: `create_notifications_table`
- Notification types: booking received, booking accepted/rejected, new message, new review
- `GET /api/notifications` — Fetch user notifications
- `PUT /api/notifications/read-all` — Mark all as read

### Frontend (Next.js)
- **Notification bell** in Navbar with unread count badge
- **Notification dropdown** showing recent activity
- **Polling** every 30 seconds (or WebSocket upgrade later)

---

## Phase 11: Static & SEO Pages

### Frontend (Next.js)
- `/about` — About Wed In Click (mission, team, values)
- `/pricing` — Vendor pricing plans/packages
- `/faq` — Frequently asked questions (accordion style)
- `/terms` — Terms of service
- `/privacy` — Privacy policy
- `/contact` — Contact form page
- **Custom 404** — Beautiful not-found page
- **Dynamic meta tags** on service and category pages for SEO

---

## Phase 12: Security & Polish

### Backend
- **Admin middleware** — Server-side role check, not just frontend
- **Rate limiting** on auth endpoints
- **Input sanitization** — Prevent XSS in reviews/messages

### Frontend
- **Loading skeletons** on all data-fetching pages
- **Error boundaries** — Graceful error handling
- **Responsive audit** — Ensure all pages work on mobile
- **Image optimization** — Lazy loading, proper sizing
- **Accessibility** — ARIA labels, keyboard navigation

---

## Phase 13: Vendor Public Profile

### Backend (Laravel)
- `GET /api/vendors/{id}` — Public vendor profile with services, reviews, and rating

### Frontend (Next.js)
- `/vendors/{id}` — Public vendor profile page showing business info, all services, location, reviews, and average rating

---

## Verification Plan

### Automated Tests (per phase)
- Run `php artisan test` after each backend phase
- Test API endpoints with browser subagent

### Manual Verification
- Test full user flows: register → browse → wishlist → book → review
- Test vendor flows: register → add service → receive booking → complete
- Test admin flows: metrics → manage users → manage categories
- Test on mobile viewport

---

## Open Questions

> [!IMPORTANT]
> **Monetization model**: Do you want vendors to pay a subscription fee, or is the platform free for now? This affects Phase 6 scope.

> [!IMPORTANT]
> **Real-time messaging**: Do you want real-time chat (WebSockets) or is polling (refresh every 30s) acceptable for the initial version?

> [!IMPORTANT]
> **Email provider**: Do you have a SendGrid/Mailgun account for transactional emails, or should we skip email notifications for now and only do in-app notifications?
