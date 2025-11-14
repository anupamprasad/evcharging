# 📝 Software Specification (PRD): India EV Charging Station Finder

## 1. Introduction

This Product Requirements Document (PRD) outlines the features and technical requirements for a responsive web application designed to help electric vehicle (EV) owners in India locate, filter, and view information about charging stations. This specification covers the **Minimum Viable Product (MVP)**.

---

## 2. Goals and Technical Stack

### 2.1. Core Goals (MVP)

* Provide users with a highly searchable and filterable map interface to locate EV charging stations across major Indian cities.
* Establish a robust, scalable backend infrastructure using Supabase and a modern React/TypeScript frontend.

### 2.2. Technical Stack & Architecture

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, TypeScript | Modern, performant UI framework with type safety. |
| **Backend/Database** | Supabase | Provides scalable PostgreSQL database, authentication, and real-time support. |
| **Mapping** | Mapbox or Google Maps API | Industry-standard for interactive map rendering and geocoding. |
| **Styling** | Utility-first CSS framework (e.g., Tailwind CSS) | Rapid and maintainable responsive design. |

---

## 3. Data Specification (MVP)

| ID | Requirement | Description |
| :--- | :--- | :--- |
| **DMS-01** | **Supabase Setup** | Configure Supabase for data storage, defining tables for Stations and User Profiles. |
| **DMS-02** | **Station Data** | Database schema must store all necessary station attributes: name, location (Lat/Lng), address, operator, connector types, power ratings, price, and facilities. |
| **DMS-03** | **Simulated Status** | Implement a field for `availability_status` (Available, Busy, Offline). For the MVP, this status will be randomized or manually set, **not** pulled from a live source. |

---

## 4. Functional Requirements (MVP Scope)

### 4.1. Search and Filtering

| ID | Feature | Description |
| :--- | :--- | :--- |
| **SRCH-01** | **Location Search** | User can enter and search for stations based on City name, PIN code, or a specific address. |
| **SRCH-02** | **"Near Me" Search** | Application uses the browser's Geolocation API to find the user's current location and centers the map there. |
| **SRCH-03** | **Filter: Charger Type** | Filter by AC, DC, Fast, or Ultra-Fast chargers. |
| **SRCH-04** | **Filter: Connector Type** | Filter by connector standards (CCS2, Type2, CHAdeMO, GB/T). |
| **SRCH-05** | **Filter: Network/Operator** | Filter by specific networks (e.g., Tata Power, Zeon, Statiq). |
| **SRCH-06** | **Filter: Facilities** | Filter stations offering amenities (Parking, café, restrooms, WiFi). |
| **SRCH-07** | **Filter: Availability** | Toggle to show only stations marked as "Available" (based on simulated status). |

### 4.2. Map View and Station Information

| ID | Feature | Description |
| :--- | :--- | :--- |
| **MAP-01** | **Interactive Map** | Map loads successfully, displaying station markers based on search and filters. |
| **MAP-02** | **Status Indicators** | Station markers use distinct colors based on the simulated `availability_status`. |
| **MAP-03** | **Distance Estimation** | Display the distance from the user's location to a selected station. |
| **MAP-04** | **Cluster Markers** | Implement marker clustering to group stations when the map zoom level is high. |
| **INFO-01** | **Information Panel** | Clicking a map marker opens a persistent, detailed sidebar/panel. |
| **INFO-02** | **Core Specs** | Panel displays the station's name, address, operator, available **Connector Types**, **Power Ratings**, and number of ports. |
| **LIVE-01** | **Simulated Status Display** | Panel shows the number of available ports for each connector type and a placeholder for "Estimated Waiting Time" (both based on simulated data). |

### 4.3. User Profile & Preferences

| ID | Feature | Description |
| :--- | :--- | :--- |
| **PROF-01** | **Basic Authentication** | Implement user sign-up/login functionality using Supabase Auth (email/password). |
| **PROF-02** | **Save Favorites** | Authenticated users can save/unsave a station to a favorites list stored in Supabase. |
| **PROF-03** | **Preferences Storage** | Users can set and save preferred Connector Type and Charging Speed, which are then applied automatically as default filters. |

---

## 5. Phase 2 Features (Future Scope)

The following high-complexity features are explicitly deferred to Phase 2, post-MVP launch:

* **Route Planning:** Route optimization algorithms, charge-stop suggestions based on battery percentage, and calculations for total travel + charging time.
* **Booking & Payment:** Advance slot booking, integration with payment gateways, pay-per-kWh billing, and user wallet/invoicing.
* **Ratings & Reviews:** Implementing the system for users to submit ratings and categorized comments (Reliability, Cleanliness, Actual Speed).
* **True Live Data Integration:** Connecting to commercial or public APIs to pull genuine real-time availability and charging speed data, replacing the simulated status.