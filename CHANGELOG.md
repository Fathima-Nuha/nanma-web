# Changelog

All notable changes to Nanma Living web app are documented here.  
Format: `[Date] — What changed | Why / Notes`

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
