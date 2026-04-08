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
      LoginPage.jsx / .css          ✅ Done
      OtpPage.jsx / .css            ✅ Done
      MpinPage.jsx / .css           ✅ Done
      MpinVerifyPage.jsx / .css     ✅ Done
      PortalSelectPage.jsx          ✅ Done
    user/
      AddFlatPage.jsx / .css        ✅ Done
      SelectApartmentPage.jsx       🔲 UI pending
    admin/
      DashboardPage.jsx             🔲 UI pending
      ApartmentGroupPage.jsx        🔲 UI pending
  routes/
    AppRouter.jsx                   ✅ Done
  styles/
    theme.css                       ✅ Done (CSS variables)
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
                                  ├─ user_has_appartment: true  → /select-apartment
                                  └─ user_has_appartment: false → /add-flat
```

---

## LocalStorage Keys

| Key             | Set in          | Used in              |
|-----------------|-----------------|----------------------|
| `access_token`  | MpinVerifyPage  | All protected APIs   |
| `refresh_token` | MpinVerifyPage  | Token refresh        |
| `csrf_token`    | MpinVerifyPage  | CSRF protection      |
| `user_id`       | MpinVerifyPage  | add_flat_request     |
| `user_name`     | MpinVerifyPage  | AddFlatPage display  |
| `phone_no`      | LoginPage       | OTP / MPIN fallback  |

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

### `/add-flat` — AddFlatPage
- Two-column layout: dark branded left panel + form right panel
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

| Endpoint                             | Method | Page            | Auth    |
|--------------------------------------|--------|-----------------|---------|
| `/verify_user`                       | POST   | LoginPage       | None    |
| `/generate_otp`                      | POST   | LoginPage       | None    |
| `/verify_otp`                        | POST   | OtpPage         | None    |
| `/set_mpin`                          | POST   | MpinPage        | None    |
| `/login_with_mpin`                   | POST   | MpinVerifyPage  | None    |
| `/api/v1/get_building_list`          | POST   | AddFlatPage     | Bearer  |
| `/api/v1/list_available_appartments` | POST   | AddFlatPage     | Bearer  |
| `/api/v1/add_flat_request`           | POST   | AddFlatPage     | Bearer  |

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
- [ ] Select Apartment page (`/select-apartment`)
- [ ] Portal Select page (`/portal-select`)
- [ ] Admin Dashboard (`/admin/dashboard`)
- [ ] Admin Apartment Group page (`/admin/apartment-group`)
- [ ] Token refresh / session expiry handling
- [ ] Protected route wrapper (redirect to `/login` if no token)
