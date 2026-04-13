import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import '../../pages/user/UserDashboardPage.css'

const NAV_ITEMS = [
  { key: 'services', label: 'Services', icon: 'home_repair_service', path: '/user/services' },
  { key: 'complaints', label: 'Complaints', icon: 'report_problem', path: '/user/complaints' },
  { key: 'utility', label: 'Utility Scan', icon: 'sensors' },
  { key: 'facilities', label: 'Facilities', icon: 'layers' },
  { key: 'basket', label: 'Daily Basket', icon: 'shopping_basket' },
  { key: 'farm2door', label: 'Farm2Door', icon: 'eco' },
  { key: 'payments', label: 'Payments', icon: 'receipt_long' },
  { key: 'accounts', label: 'My Accounts', icon: 'manage_accounts' },
  { key: 'groups', label: 'Groups', icon: 'group' },
  { key: 'broadcast', label: 'Broadcast', icon: 'campaign' },
  { key: 'events', label: 'Events', icon: 'event' },
  { key: 'visitors', label: 'My Visitors', icon: 'person_pin' },
  { key: 'offers', label: 'Offers Hub', icon: 'local_offer' },
  { key: 'marketplace', label: 'MarketPlace', icon: 'storefront' },
  { key: 'help', label: 'Help & Feedback', icon: 'help_outline' },
  { key: 'gym', label: 'Gym Directory', icon: 'fitness_center' },
  { key: 'sos', label: 'Emergency SOS', icon: 'emergency' },
]

function UserLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [navServicesOpen, setNavServicesOpen] = useState(false)

  const userName = localStorage.getItem('user_name') || 'Resident'
  const apartmentNumber = localStorage.getItem('selected_apartment_number') || ''
  const buildingName = localStorage.getItem('selected_building_name') || ''

  const isHome = location.pathname === '/user/dashboard'

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="ud-layout">
      {/* ── Sidebar ── */}
      <aside className="ud-sidebar">
        <div className="ud-sidebar-brand">
          <span className="ud-sidebar-brand-name">Nanma Living</span>
          <span className="ud-sidebar-brand-tag">The Modern Curator</span>
        </div>

        <nav className="ud-sidebar-nav">
          {/* Home */}
          <button
            type="button"
            className={`ud-sidebar-nav-item${isHome ? ' active' : ''}`}
            onClick={() => navigate('/user/dashboard')}
          >
            <span className="material-symbols-outlined">home</span>
            Home
          </button>

          {/* Services Dropdown */}
          <button
            type="button"
            className={`ud-sidebar-nav-item${navServicesOpen ? ' active' : ''}`}
            onClick={() => setNavServicesOpen(o => !o)}
          >
            <span className="material-symbols-outlined">apps</span>
            Services
            <span className={`ud-sidebar-chevron material-symbols-outlined${navServicesOpen ? ' open' : ''}`}>expand_more</span>
          </button>

          {navServicesOpen && (
            <div className="ud-sidebar-dropdown">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.key}
                  type="button"
                  className={`ud-sidebar-dropdown-item${item.path && location.pathname.startsWith(item.path) ? ' active' : ''}`}
                  onClick={() => item.path ? navigate(item.path) : null}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <button type="button" className="ud-sidebar-nav-item">
            <span className="material-symbols-outlined">info</span>
            About Us
          </button>
          <button type="button" className="ud-sidebar-nav-item">
            <span className="material-symbols-outlined">contact_support</span>
            Contact
          </button>
        </nav>

        <button type="button" className="ud-sidebar-book-btn">Book Amenity</button>

        <div className="ud-sidebar-footer">
          <button type="button" className="ud-sidebar-footer-link" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="ud-main">
        {/* Top Bar */}
        <header className="ud-topbar">
          <div className="ud-topbar-search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search services, events..." />
          </div>
          <nav className="ud-topbar-tabs">
            {['Concierge', 'Notices', 'Events'].map(tab => (
              <button key={tab} type="button" className={`ud-topbar-tab${tab === 'Concierge' ? ' active' : ''}`}>{tab}</button>
            ))}
          </nav>
          <div className="ud-topbar-actions">
            <button type="button" className="ud-topbar-icon-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button type="button" className="ud-topbar-icon-btn">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="ud-topbar-profile">
              <div className="ud-topbar-profile-info">
                <span className="ud-topbar-profile-name">{userName}</span>
                <span className="ud-topbar-profile-apt">{apartmentNumber || buildingName}</span>
              </div>
              <div className="ud-topbar-avatar">{userName.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="ud-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserLayout
