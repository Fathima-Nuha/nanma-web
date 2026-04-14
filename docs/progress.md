# Nanma Living — Frontend Dev Progress

**Repo:** https://github.com/Fathima-Nuha/nanma-web  
**Hosted on:** Netlify (deploy by dragging `dist/` folder)  
**Stack:** React + Vite + TailwindCSS + React Router + Custom CSS

---

## Project Structure

```
src/
  pages/
    auth/
      LoginPage.jsx / .css              ✅ Done
      OtpPage.jsx / .css                ✅ Done
      MpinPage.jsx / .css               ✅ Done
      MpinVerifyPage.jsx / .css         ✅ Done
      PortalSelectPage.jsx / .css       ✅ Done
    user/
      AddFlatPage.jsx / .css            ✅ Done
      SelectApartmentPage.jsx / .css    ✅ Done
      UserSetupPage.jsx                 ✅ Done (router helper)
      UserDashboardPage.jsx / .css      ✅ Done
      ServicesPage.jsx / .css           ✅ Done
      CreateServiceRequestPage.jsx / .css       ✅ Done
      CreateCommunityServiceRequestPage.jsx     ✅ Done
      ComplaintsPage.jsx / .css         ✅ Done
      CreateComplaintPage.jsx / .css    ✅ Done
      ComplaintDetailPage.jsx / .css    ✅ Done
    admin/
      DashboardPage.jsx                 🔲 UI pending
      ApartmentGroupPage.jsx            🔲 UI pending
  components/
    layout/
      UserLayout.jsx                    ✅ Done (sidebar + topbar shell)
    common/                             🔲 (planned)
    ui/                                 🔲 (planned)
  routes/
    AppRouter.jsx                       ✅ Done
  styles/
    theme.css                           ✅ Done (CSS variables)
```

---

## Auth Flow (User Journey)

```
/login
  │ POST /verify_user
  ├─ New user OR no MPIN → POST /generate_otp → /otp
  │                                               │ POST /verify_otp
  │                                               └─ /mpin (set MPIN)
  └─ Existing user with MPIN → /mpin-verify
                                  │ POST /login_with_mpin
                                  ├─ user_has_appartment: true  → /user-setup (SelectApartmentPage)
                                  └─ user_has_appartment: false → /user-setup (AddFlatPage)
                                                                      └─ on success → /select-apartment

/select-apartment → choose flat → /user/dashboard

/user/dashboard
  ├─ /user/services
  │     ├─ /user/services/create          (personal service request)
  │     └─ /user/services/create-community (community service request)
  └─ /user/complaints
        ├─ /user/complaints/create        (create complaint)
        └─ /user/complaints/:id           (complaint detail)
```

---

## LocalStorage Keys

| Key                        | Set in              | Used in                          |
|----------------------------|---------------------|----------------------------------|
| `access_token`             | MpinVerifyPage      | All protected APIs               |
| `refresh_token`            | MpinVerifyPage      | Token refresh                    |
| `csrf_token`               | MpinVerifyPage      | CSRF protection                  |
| `user_id`                  | MpinVerifyPage      | add_flat_request                 |
| `user_name`                | MpinVerifyPage      | AddFlatPage, UserLayout display  |
| `phone_no`                 | LoginPage           | OTP / MPIN fallback              |
| `selected_apartment_id`    | SelectApartmentPage | Complaints, Services APIs        |
| `selected_apartment_number`| SelectApartmentPage | UserLayout topbar                |
| `selected_building_id`     | SelectApartmentPage | Services, Complaints APIs        |
| `selected_building_name`   | SelectApartmentPage | UserLayout topbar                |

---

## Pages Built

### `/login` — LoginPage
- Mobile number input with `+91` prefix
- `POST /verify_user?phone_no=91{number}`
- Routing logic based on `user_exist` and `mpin_exist`

### `/otp` — OtpPage
- 6-digit OTP input boxes
- `POST /generate_otp` triggered from LoginPage
- `POST /verify_otp` on submit
- Resend OTP with 2-minute countdown

### `/mpin` — MpinPage
- Set a new 6-digit MPIN (first-time users)
- `POST /set_mpin`

### `/mpin-verify` — MpinVerifyPage
- 6-digit MPIN input boxes
- `POST /login_with_mpin`
- Stores tokens + user_id + user_name in localStorage
- Navigates to `/add-flat` or `/select-apartment` based on `user_has_appartment`
- Forgot MPIN → goes back to `/otp`

### `/select-apartment` — SelectApartmentPage
- Two-column layout: dark branded left panel + apartment card list on right
- Receives `appartment_details[]` via React Router `state`
- On card click → stores `selected_apartment_id`, `selected_apartment_number`, `selected_building_id`, `selected_building_name` in localStorage → navigates to `/user/dashboard`

### `/user/dashboard` — UserDashboardPage (inside UserLayout)
- Spotlight carousel (static slides)
- Quick services grid (8 tiles): Services, Complaints, Utility Scan, Facilities, Payments, Visitors, Offers, SOS
- Upcoming Events section (static)
- Visitors section (static)
- All-services drawer with 17 feature tiles

### UserLayout — Shared Shell
- Left sidebar with brand, 17 nav items (Services and Complaints are active links)
- Top bar showing building name, apartment number, user avatar, logout
- Wraps all `/user/*` routes via React Router `<Outlet>`

### `/user/services` — ServicesPage
- Two tabs: **Personal** (vendor services) and **Community** (admin-managed services)
- Status filter tabs and sort toggle per tab
- `POST /api/v1/get_personal_service_requests` and `get_community_service_requests`
- FAB → `/user/services/create` or `/user/services/create-community` based on active tab

### `/user/services/create` — CreateServiceRequestPage
- Vendor searchable dropdown → auto-fills service type
- Date picker + time picker
- No-of-pieces field (shown only for laundry service types)
- `POST /api/v1/service_vendors_in_a_building` to fetch vendors
- `POST /api/v1/create_service_request`

### `/user/services/create-community` — CreateCommunityServiceRequestPage
- Community service searchable dropdown → auto-fills service charge
- Date picker + time-slot dropdown (Morning / Noon / Afternoon)
- `POST /api/v1/get_admin_services` to fetch available services
- `POST /api/v1/create_community_service_request`

### `/user/complaints` — ComplaintsPage
- Filter tabs: All / New / In Progress / Completed
- Sort toggle (latest / oldest)
- Status counts badge per tab
- `POST /api/v1/search_get_complaints?building_id=&flat_id=`
- Tap card → `/user/complaints/:id`
- FAB → `/user/complaints/create`

### `/user/complaints/create` — CreateComplaintPage
- Quick-select topic chips (6 presets) + free-text override
- Multi-line description textarea
- Drag-and-drop or click-to-upload image attachment with preview
- `POST /api/v1/create_complaint` via `FormData` (supports `complaint_image`)
- On success → back to `/user/complaints`

### `/user/complaints/:id` — ComplaintDetailPage
- Status badge (NEW / PENDING / COMPLETED / CLOSED)
- 3-step progress timeline
- Image attachment with tap-to-zoom overlay
- `POST /api/v1/get_complaint` with `{ flat_id, complaint_id }`

---- Two-column layout: dark branded left panel + form right panel
- **Name:** read-only, pulled from `localStorage.getItem('user_name')`
- **Building Name:** searchable dropdown
  - `POST /api/v1/get_building_list` (auth: Bearer token)
  - Only shows buildings with `status: true`
- **Flat Number:** searchable dropdown, enabled only after building is selected
  - `POST /api/v1/list_available_appartments` with `{ building_id }`
  - Lists flats not with status `active` or `pending`
- Submit: `POST /api/v1/add_flat_request`
  - Payload: `{ username, building_id, flat_id, user_id }`
- On success → `/select-apartment`

---

## API Endpoints Used

| Endpoint                                    | Method | Page                              | Auth    |
|---------------------------------------------|--------|-----------------------------------|---------|
| `/verify_user`                              | POST   | LoginPage                         | None    |
| `/generate_otp`                             | POST   | LoginPage                         | None    |
| `/verify_otp`                               | POST   | OtpPage                           | None    |
| `/set_mpin`                                 | POST   | MpinPage                          | None    |
| `/login_with_mpin`                          | POST   | MpinVerifyPage                    | None    |
| `/api/v1/get_building_list`                 | POST   | AddFlatPage                       | Bearer  |
| `/api/v1/list_available_appartments`        | POST   | AddFlatPage                       | Bearer  |
| `/api/v1/add_flat_request`                  | POST   | AddFlatPage                       | Bearer  |
| `/api/v1/get_personal_service_requests`     | POST   | ServicesPage                      | Bearer  |
| `/api/v1/get_community_service_requests`    | POST   | ServicesPage                      | Bearer  |
| `/api/v1/service_vendors_in_a_building`     | POST   | CreateServiceRequestPage          | Bearer  |
| `/api/v1/create_service_request`            | POST   | CreateServiceRequestPage          | Bearer  |
| `/api/v1/get_admin_services`                | POST   | CreateCommunityServiceRequestPage | Bearer  |
| `/api/v1/create_community_service_request`  | POST   | CreateCommunityServiceRequestPage | Bearer  |
| `/api/v1/search_get_complaints`             | POST   | ComplaintsPage                    | Bearer  |
| `/api/v1/create_complaint`                  | POST   | CreateComplaintPage               | Bearer  |
| `/api/v1/get_complaint`                     | POST   | ComplaintDetailPage               | Bearer  |

---

## Design System

- **Font:** Manrope (headlines), Inter (body)
- **Primary gold:** `#8b6f3d` / `#c1aa7f`
- **Background:** `#fbf9f4`
- **Dark panel:** `#2b2b22` (left panels on auth pages)
- **CSS variables:** defined in `src/styles/theme.css`
- Material Symbols Outlined loaded via Google Fonts in `index.html`

---

## Roadmap

- [x] Login flow (Login → OTP → MPIN set → MPIN verify)
- [x] Add Flat page (building + flat searchable dropdowns)
- [x] Select Apartment page (`/select-apartment`)
- [x] Portal Select page (`/portal-select`)
- [x] User Dashboard (`/user/dashboard`) — spotlight, quick services grid, events, visitors
- [x] User Layout — sidebar + topbar shell
- [x] Services page — personal + community tabs with status filters
- [x] Create Service Request — vendor dropdown, date/time, laundry pieces field
- [x] Create Community Service Request — admin services dropdown, time slots
- [x] Complaints page — filter tabs, sort, status counts
- [x] Create Complaint — topic chips, description, image upload (drag-and-drop)
- [x] Complaint Detail — timeline, status badge, image zoom
- [ ] Admin Dashboard (`/admin/dashboard`)
- [ ] Admin Apartment Group page (`/admin/apartment-group`)
- [ ] Token refresh / session expiry handling
- [ ] Protected route wrapper (redirect to `/login` if no token)
- [ ] Utility Scan page
- [ ] Facilities booking page
- [ ] Payments page
