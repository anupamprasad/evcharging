# 🛠️ Development TODO List: EV Charging Finder App

## Phase 1: MVP Core Functionality (Foundation)

This phase covers essential setup, data management, search, map rendering, and user authentication.

### P1.1: Project Setup and Data Infrastructure

| Status | Task | Acceptance Criteria |
| :---: | :--- | :--- |
| [x] | **P1-DMS-01:** Initialize React/Vite/TS Project | Project builds successfully and essential dependencies (Router, Map Library) are installed. |
| [x] | **P1-DMS-02/03:** Configure Supabase Client & Define Tables | Supabase client initializes, and necessary tables (`stations`, `user_profiles`) are created with the required schema fields. |
| [x] | **P1-DMS-04:** Seed Initial Station Data | At least 20 mock station records are inserted into the `stations` table, including varied simulated availability statuses. |

### P1.2: Map and Data Display

| Status | Task | Acceptance Criteria |
| :---: | :--- | :--- |
| [x] | **P1-MAP-01:** Integrate Interactive Map | A map component renders successfully, displaying the initial dataset of station markers. |
| [x] | **P1-MAP-02:** Implement Marker Status Indicators (MAP-02) | Station markers are styled using distinct colors based on the simulated availability status (Green/Red/Grey). |
| [x] | **P1-MAP-03/04:** Implement Clusters & Geolocation (MAP-04, SRCH-02) | Marker clustering is functional, and a "Use Current Location" feature centers the map based on browser Geolocation API data. |

### P1.3: Search, Filters, and Station Details

| Status | Task | Acceptance Criteria |
| :---: | :--- | :--- |
| [x] | **P1-SRCH-01:** Basic Text Search (SRCH-01) | A search input is functional, allowing users to filter stations by City/Address/PIN code text. |
| [x] | **P1-SRCH-02:** Implement Core Filters (SRCH-03 to SRCH-06) | UI and logic for Connector Type, Charger Type, Operator, and Facilities filters are implemented and successfully update the map results. |
| [x] | **P1-INFO-01:** Station Details Panel (INFO-01, INFO-02, LIVE-01) | Clicking a marker opens a panel/sidebar displaying core specs (connectors, power rating, pricing) and the simulated available ports. |
| [x] | **P1-MAP-05:** Distance Estimation (MAP-03) | The linear distance from the user's location to the selected station is calculated and displayed in the details panel. |

### P1.4: Authentication and User Profile (MVP)

| Status | Task | Acceptance Criteria |
| :---: | :--- | :--- |
| [x] | **P1-PROF-01:** Supabase User Authentication | Users can successfully Sign Up and Log In using email/password via Supabase Auth. |
| [x] | **P1-PROF-02:** Save Favorites (PROF-02) | Authenticated users can save and remove stations from a favorites list stored in the database. |
| [x] | **P1-PROF-03:** Save Preferred Filters (PROF-03) | Users can save their preferred Connector Type and Charging Speed, and these preferences auto-apply as default filters on load. |

---

## Phase 2: Advanced Features (Future Scope)

This phase focuses on complex logic, external dependencies, and user interaction features.

### P2.1: Route Planning and Optimization

| Status | Task | Acceptance Criteria |
| :---: | :--- | :--- |
| [ ] | **P2-RTE-01:** Implement Route Calculation | Integrate a routing API to calculate the driving path between a starting point and destination. |
| [ ] | **P2-RTE-02/03:** Charge-Stop Suggestion Logic | Develop the feature where the user inputs their current Battery SoC, and the app suggests optimal charging stops along the calculated route, displaying the total estimated travel time including charging. |

### P2.2: Booking and Payment

| Status | Task | Acceptance Criteria |
| :---: | :--- | :--- |
| [ ] | **P2-BK-01:** Booking Slot Interface | Create a UI for selecting a time and duration for advance slot booking. |
| [ ] | **P2-BK-02:** Payment Gateway Integration | Integrate a chosen payment gateway (e.g., Stripe, Razorpay) for processing pay-per-kWh charges. |
| [ ] | **P2-BK-03:** Wallet/Billing History | Implement user wallet functionality and a transaction history feature displaying past charging sessions and invoices. |

### P2.3: User Feedback and True Live Status

| Status | Task | Acceptance Criteria |
| :---: | :--- | :--- |
| [ ] | **P2-RATE-01/02:** Ratings & Review Submission | Authenticated users can submit 1-5 star ratings and textual reviews categorized by specific station attributes (Reliability, Cleanliness, etc.). |
| [ ] | **P2-LIVE-03:** Integrate True Live API | Successfully connect to an external API (if available and feasible) to replace the simulated data with genuine real-time availability status. |