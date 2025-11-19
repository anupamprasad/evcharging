# 📋 Pending Items - EV Charging Finder App

## Summary
- **Phase 1 (MVP):** ✅ **COMPLETED** - All 13 tasks completed
- **Phase 2 (Advanced Features):** ⏳ **PENDING** - 6 tasks remaining

---

## Phase 2: Advanced Features (Pending Items)

### P2.1: Route Planning and Optimization

#### 🔴 P2-RTE-01: Implement Route Calculation
**Status:** Pending  
**Description:** Integrate a routing API to calculate the driving path between a starting point and destination.

**Acceptance Criteria:**
- Integrate a routing API (e.g., Mapbox Directions API, Google Maps Directions API)
- Calculate the driving path between a starting point and destination
- Display the route on the map
- Show route distance and estimated travel time

**Dependencies:**
- Mapbox/Google Maps API key with routing enabled
- Route calculation service integration

---

#### 🔴 P2-RTE-02/03: Charge-Stop Suggestion Logic
**Status:** Pending  
**Description:** Develop the feature where the user inputs their current Battery SoC, and the app suggests optimal charging stops along the calculated route, displaying the total estimated travel time including charging.

**Acceptance Criteria:**
- User can input their current Battery State of Charge (SoC)
- App calculates optimal charging stops along the route
- Suggests stations based on:
  - Distance from route
  - Battery range remaining
  - Charging speed available
- Displays total estimated travel time including charging stops
- Shows charging duration estimates at each stop

**Dependencies:**
- P2-RTE-01 (Route Calculation) must be completed first
- Vehicle battery capacity and efficiency data
- Charging speed calculations

---

### P2.2: Booking and Payment

#### 🔴 P2-BK-01: Booking Slot Interface
**Status:** Pending  
**Description:** Create a UI for selecting a time and duration for advance slot booking.

**Acceptance Criteria:**
- Calendar/date picker for selecting booking date
- Time slot selection interface
- Duration selector (e.g., 30 min, 1 hour, 2 hours)
- Display available vs. booked slots
- Confirmation dialog before booking
- Store booking data in database

**Database Requirements:**
- New `bookings` table with fields:
  - user_id, station_id, booking_date, start_time, duration, status

---

#### 🔴 P2-BK-02: Payment Gateway Integration
**Status:** Pending  
**Description:** Integrate a chosen payment gateway (e.g., Stripe, Razorpay) for processing pay-per-kWh charges.

**Acceptance Criteria:**
- Integrate payment gateway (Stripe/Razorpay recommended for India)
- Secure payment processing
- Support for multiple payment methods (card, UPI, net banking)
- Calculate charges based on:
  - Energy consumed (kWh)
  - Price per kWh at the station
- Generate payment receipts
- Handle payment failures gracefully

**Dependencies:**
- Payment gateway account and API keys
- SSL certificate for secure transactions
- P2-BK-01 (Booking Interface) recommended

---

#### 🔴 P2-BK-03: Wallet/Billing History
**Status:** Pending  
**Description:** Implement user wallet functionality and a transaction history feature displaying past charging sessions and invoices.

**Acceptance Criteria:**
- User wallet with balance management
- Add money to wallet functionality
- Transaction history page showing:
  - Past charging sessions
  - Payment method used
  - Amount charged
  - Date and time
- Invoice generation and download
- Filter/search transactions
- Export transaction history (CSV/PDF)

**Database Requirements:**
- `wallet_transactions` table
- `charging_sessions` table
- `invoices` table

---

### P2.3: User Feedback and True Live Status

#### 🔴 P2-RATE-01/02: Ratings & Review Submission
**Status:** Pending  
**Description:** Authenticated users can submit 1-5 star ratings and textual reviews categorized by specific station attributes (Reliability, Cleanliness, etc.).

**Acceptance Criteria:**
- Star rating system (1-5 stars)
- Text review input
- Category-based ratings:
  - Reliability
  - Cleanliness
  - Speed of Service
  - Value for Money
  - Overall Experience
- Display average ratings on station details
- Show review history per station
- User can edit/delete their own reviews
- Moderation system (optional)

**Database Requirements:**
- `reviews` table with fields:
  - user_id, station_id, overall_rating, category_ratings (JSONB), review_text, created_at

---

#### 🔴 P2-LIVE-03: Integrate True Live API
**Status:** Pending  
**Description:** Successfully connect to an external API (if available and feasible) to replace the simulated data with genuine real-time availability status.

**Acceptance Criteria:**
- Identify and integrate with real-time charging station API
- Replace simulated availability status with live data
- Update station status in real-time or near real-time
- Handle API failures gracefully (fallback to cached data)
- Display last updated timestamp
- WebSocket or polling mechanism for live updates

**Potential API Sources:**
- Open Charge Map API
- ChargePoint API
- Station operator APIs
- Government charging network APIs (India)

**Dependencies:**
- API access credentials
- API documentation and integration guide
- Error handling and fallback mechanisms

---

## Priority Recommendations

### High Priority (Core Features)
1. **P2-RTE-01** - Route Calculation (enables trip planning)
2. **P2-RATE-01/02** - Ratings & Reviews (user engagement)

### Medium Priority (Revenue Features)
3. **P2-BK-01** - Booking Interface (user convenience)
4. **P2-BK-02** - Payment Integration (monetization)

### Lower Priority (Enhancement Features)
5. **P2-RTE-02/03** - Charge-Stop Suggestions (advanced planning)
6. **P2-BK-03** - Wallet/Billing History (user management)
7. **P2-LIVE-03** - True Live API (data accuracy)

---

## Estimated Effort

| Task | Estimated Effort | Complexity |
|------|-----------------|------------|
| P2-RTE-01 | 2-3 weeks | Medium |
| P2-RTE-02/03 | 3-4 weeks | High |
| P2-BK-01 | 1-2 weeks | Low-Medium |
| P2-BK-02 | 2-3 weeks | Medium-High |
| P2-BK-03 | 2 weeks | Medium |
| P2-RATE-01/02 | 1-2 weeks | Low-Medium |
| P2-LIVE-03 | 2-4 weeks | Medium-High (depends on API) |

**Total Estimated Effort:** 13-20 weeks

---

## Notes

- All Phase 1 MVP features are complete and functional
- Phase 2 features are enhancements and can be implemented incrementally
- Consider user feedback and market demand when prioritizing Phase 2 features
- Some features may require additional infrastructure or third-party services

