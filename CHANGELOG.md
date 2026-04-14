# Changelog

All notable changes to Nanma Living web app are documented here.  
Format: `[Date] — What changed | Why / Notes`

---

## [2026-04-14]

### Added
- `EditComplaintPage.jsx` (new file)
- `UtilityScanPage.css` (new file)
- `UtilityScanPage.jsx` (new file)

### Changed
- `UserLayout.jsx`
- `ComplaintDetailPage.css`
- `ComplaintDetailPage.jsx`
- `CreateComplaintPage.css`
- `CreateComplaintPage.jsx`
- `AppRouter.jsx`

---

## [2026-04-08] — Restructure: user module + docs + automation

### Added
- `docs/progress.md` — project structure, flow diagram, API table, roadmap
- `CHANGELOG.md` — this file
- `scripts/log-and-push.ps1` — auto changelog updater + git push script
- `npm run push` shortcut added to `package.json`

### Changed
- Moved `AddFlatPage.jsx / .css` from `pages/auth/` to `pages/user/`
- Moved `SelectApartmentPage.jsx` from `pages/auth/` to `pages/user/`
- Updated `AppRouter.jsx` import paths accordingly
- Updated `progress.md` structure to reflect new folder layout

---

## [2026-04-08] — Login Module Complete + Add Flat Page

### Added
- `LoginPage` — mobile number entry with `+91` prefix, routes based on user/MPIN status
- `OtpPage` — 6-digit OTP input, resend with 2-minute countdown, paste support
- `MpinPage` — first-time MPIN setup (6-digit)
- `MpinVerifyPage` — MPIN login, stores `access_token`, `refresh_token`, `user_id`, `user_name` in localStorage
- `AddFlatPage` — two-column layout with:
  - Read-only Name field from localStorage
  - Searchable building dropdown (`POST /api/v1/get_building_list`)
  - Searchable flat dropdown populated after building selection (`POST /api/v1/list_available_appartments`)
  - Submit calls `POST /api/v1/add_flat_request`
- `AppRouter` — all auth routes wired up
- `theme.css` — CSS variables for colours, fonts, spacing
- Material Symbols Outlined font added to `index.html`
- `docs/progress.md` — project structure, flow diagram, API table, roadmap

### Fixed
- `get_building_list` fetch: added `method: 'POST'` and `Authorization` Bearer header
- `add_flat_request` payload corrected to `{ username, building_id, flat_id, user_id }`

### Deployed
- Built with `npm run build`
- Deployed `dist/` folder to Netlify

---

## How to Update This File

After every meaningful push, add a new entry at the top:

```
## [YYYY-MM-DD] — Short summary

### Added
- ...

### Changed
- ...

### Fixed
- ...
```

---

## [2026-04-08]

### Added
- added a userpage to move add flat and select flat features to the folder

### Changed
- changed the folder structure

---

## [2026-04-08]

### Added
- added progress and changelog file

---

## [2026-04-08]

---

## [2026-04-14] — Complaints Module Complete

### Added
- `ComplaintDetailPage.jsx / .css` — complaint detail view with:
  - Status badge (NEW / PENDING / COMPLETED / CLOSED) mapped from `complaint_status_id`
  - Timeline steps: Complaint Filed → Assigned to Maintenance → In Progress
  - Image attachment with tap-to-zoom overlay
  - `POST /api/v1/get_complaint` with `{ flat_id, complaint_id }` payload
- `CreateComplaintPage.jsx / .css` — create complaint form with:
  - Quick-select topic chips (Plumbing, Electrical, HVAC, Cleaning, Security, Pest Control)
  - Free-text description
  - Drag-and-drop image upload with preview
  - `POST /api/v1/create_complaint` via `FormData` (includes `complaint_image`)
- `ComplaintsPage.jsx / .css` — complaints list with:
  - Filter tabs: All / New / In Progress / Completed
  - Sort toggle (latest / oldest)
  - Status counts display
  - `POST /api/v1/search_get_complaints?building_id=&flat_id=`
  - Tap card → navigates to `/user/complaints/:id`

### Changed
- `AppRouter.jsx` — added `/user/complaints`, `/user/complaints/create`, `/user/complaints/:id` routes

---

## [2026-04-13] — Services Module Complete

### Added
- `ServicesPage.jsx / .css` — services list with two tabs: Personal and Community
  - Personal: mapped from `personal_service_request_id`, icon by service type
  - Community: mapped from `service_id`, status from `status_id`
  - `POST /api/v1/get_personal_service_requests` and `get_community_service_requests`
- `CreateServiceRequestPage.jsx / .css` — personal service request form with:
  - Vendor dropdown (`POST /api/v1/service_vendors_in_a_building`)
  - Auto-fills service type, date/time picker, no-of-pieces field for laundry
  - `POST /api/v1/create_service_request`
- `CreateCommunityServiceRequestPage.jsx` — community service request form with:
  - Service dropdown (`POST /api/v1/get_admin_services`)
  - Auto-fills service charge, date/time picker
  - `POST /api/v1/create_community_service_request`
- `UserLayout.jsx` — shared sidebar + top bar shell wrapping all `/user/*` routes
  - Sidebar nav with 17 items; Services and Complaints are active links
  - Shows `user_name`, `selected_apartment_number`, `selected_building_name` from localStorage

### Changed
- `UserDashboardPage.jsx` — full dashboard: spotlight carousel, quick services grid (8 tiles), events section, visitors section, all-services drawer
- `UserDashboardPage.css` — layout polish, sidebar, topbar, cards
- `AppRouter.jsx` — user routes wrapped under `<UserLayout>` outlet

---

## [2026-04-11] — User Dashboard + Service Request Forms

### Added
- `CreateServiceRequestPage.jsx / .css` (initial scaffold)
- `CreateCommunityServiceRequestPage.jsx` (community service form)
- `components/` folder created for shared UI components

### Changed
- `SelectApartmentPage.jsx` — stores `selected_apartment_id`, `selected_building_id`, `selected_building_name` in localStorage; navigates to `/user/dashboard`
- `ServicesPage.jsx` — wired up API, added community tab
- `UserDashboardPage.jsx` — service tile navigation
- `AppRouter.jsx`

---

## [2026-04-10] — Services Page + MpinVerify Fix

### Added
- `ServicesPage.jsx / .css` — services landing page (initial)

### Changed
- `MpinVerifyPage.jsx` — fixed navigation to use `state` when passing `appartment_details`
- `UserDashboardPage.jsx / .css`

---

## [2026-04-09] — Select Apartment + Dashboard Shell

### Added
- `PortalSelectPage.css`
- `SelectApartmentPage.css`
- `UserDashboardPage.css`
- `UserSetupPage.jsx` — router helper: renders `SelectApartmentPage` or `AddFlatPage` based on `hasApartment` state

### Changed
- `MpinVerifyPage.jsx` — navigates to `/user-setup` passing `hasApartment` + `appartment_details`
- `PortalSelectPage.jsx`
- `SelectApartmentPage.jsx`
- `UserDashboardPage.jsx`
- `AppRouter.jsx`

---

## [2026-04-08]

### Added
- `UserDashboardPage.jsx` (new file)

### Changed
- `MpinVerifyPage.jsx`
- `AddFlatPage.jsx`
- `AppRouter.jsx`

---

## [2026-04-08]

### Changed
- `CHANGELOG.md`
- `progress.md`
- `log-and-push.ps1`
