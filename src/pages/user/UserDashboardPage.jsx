import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserDashboardPage.css'

const NAV_ITEMS = [
  { key: 'services', label: 'Services', icon: 'home_repair_service' },
  { key: 'complaints', label: 'Complaints', icon: 'report_problem' },
  { key: 'utility', label: 'Utility Scan', icon: 'sensors' },
  { key: 'facilities', label: 'Facilities', icon: 'layers' },
]

const SERVICES = [
  { key: 'services', label: 'Services', icon: 'home_repair_service', desc: 'Professional housekeeping and maintenance.' },
  { key: 'complaints', label: 'Complaints', icon: 'report_problem', desc: 'Swift resolution for your living concerns.' },
  { key: 'utility', label: 'Utility Scan', icon: 'sensors', desc: 'Real-time usage and sustainability metrics.' },
  { key: 'facilities', label: 'Facilities', icon: 'layers', desc: 'Reserve the spa, gym, or tennis courts.' },
  { key: 'basket', label: 'Daily Basket', icon: 'shopping_basket', desc: 'Artisan pantry staples delivered daily.' },
  { key: 'farm2door', label: 'Farm2Door', icon: 'eco', desc: 'Direct link to local agricultural harvests.' },
]

const EVENTS = [
  {
    id: 1,
    title: 'Summer Solstice Soirée',
    date: 'JULY 15, 6:00 PM',
    location: 'ROOFTOP GARDEN',
    desc: 'An evening of jazz, botanical cocktails, and…',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=70',
  },
  {
    id: 2,
    title: 'Mindful Flow Yoga',
    date: 'EVERY MONDAY, 7:00 AM',
    location: 'ZEN STUDIO',
    desc: 'Start your week with intentional movement…',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=120&q=70',
  },
]

const VISITORS = [
  { id: 1, name: 'Mustafa Ahmad', initials: 'MA', time: 'Expected: Today, 2:30 PM', status: 'APPROVED', statusClass: 'approved' },
  { id: 2, name: 'Sara Khan', initials: 'SK', time: 'Checked In: 10:15 AM', status: 'ACTIVE', statusClass: 'active' },
]

function UserDashboardPage() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('services')

  const userName = localStorage.getItem('user_name') || 'Resident'
  const apartmentNumber = localStorage.getItem('selected_apartment_number') || ''
  const buildingName = localStorage.getItem('selected_building_name') || ''

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
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              type="button"
              className={`ud-sidebar-nav-item${activeNav === item.key ? ' active' : ''}`}
              onClick={() => setActiveNav(item.key)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button type="button" className="ud-sidebar-book-btn">Book Amenity</button>

        <div className="ud-sidebar-footer">
          <button type="button" className="ud-sidebar-footer-link">
            <span className="material-symbols-outlined">support_agent</span>
            Support
          </button>
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

        {/* Content */}
        <div className="ud-content">
          <div className="ud-content-left">
            {/* Hero */}
            <section className="ud-hero">
              <div className="ud-hero-text">
                <h1>Welcome home, {userName.split(' ')[0]}.</h1>
                <p>Everything you need to curate your lifestyle is at your fingertips.</p>
                <div className="ud-hero-btns">
                  <button type="button" className="ud-hero-btn-primary">Explore Lifestyle</button>
                  <button type="button" className="ud-hero-btn-secondary">View Schedule</button>
                </div>
              </div>
            </section>

            {/* Curated Services */}
            <section className="ud-section">
              <div className="ud-section-header">
                <div>
                  <h2 className="ud-section-title">Curated Services</h2>
                  <p className="ud-section-subtitle">Refined solutions for your daily living</p>
                </div>
                <button type="button" className="ud-section-view-all">View All Services</button>
              </div>
              <div className="ud-services-grid">
                {SERVICES.map(svc => (
                  <div key={svc.key} className="ud-service-card">
                    <span className="material-symbols-outlined ud-service-icon">{svc.icon}</span>
                    <span className="ud-service-label">{svc.label}</span>
                    <span className="ud-service-desc">{svc.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Community Hub */}
            <section className="ud-section">
              <div className="ud-section-header">
                <h2 className="ud-section-title">Community Hub</h2>
                <button type="button" className="ud-section-view-all">All Events</button>
              </div>
              <div className="ud-events-list">
                {EVENTS.map(ev => (
                  <div key={ev.id} className="ud-event-card">
                    <img src={ev.img} alt={ev.title} className="ud-event-img" />
                    <div className="ud-event-info">
                      <span className="ud-event-meta">{ev.date} &bull; {ev.location}</span>
                      <span className="ud-event-title">{ev.title}</span>
                      <span className="ud-event-desc">{ev.desc}</span>
                    </div>
                    <button type="button" className="ud-event-arrow">
                      <span className="material-symbols-outlined">arrow_forward_ios</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Panel */}
          <aside className="ud-content-right">
            {/* Concierge Spotlight */}
            <div className="ud-spotlight-card">
              <span className="ud-spotlight-badge">Concierge Spotlight</span>
              <h3 className="ud-spotlight-title">Farm-to-Door Delivery</h3>
              <p className="ud-spotlight-desc">Savor the freshest organic produce from local orchards, delivered directly to your doorstep every Tuesday morning.</p>
              <img
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&q=70"
                alt="Farm produce"
                className="ud-spotlight-img"
              />
              <button type="button" className="ud-spotlight-link">
                Schedule First Basket
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="ud-quick-actions">
              <h3 className="ud-quick-actions-title">Quick Actions</h3>
              <div className="ud-quick-actions-grid">
                {[
                  { label: 'Invite Visitor', icon: 'person_add' },
                  { label: 'GatePass', icon: 'electric_bolt' },
                  { label: 'Pay Bills', icon: 'receipt_long' },
                  { label: 'SOS Help', icon: 'wifi_tethering', sos: true },
                ].map(action => (
                  <button key={action.label} type="button" className={`ud-quick-action-btn${action.sos ? ' sos' : ''}`}>
                    <span className="material-symbols-outlined">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Visitors */}
            <div className="ud-visitors">
              <div className="ud-section-header">
                <h3 className="ud-visitors-title">Recent Visitors</h3>
                <button type="button" className="ud-topbar-icon-btn">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <div className="ud-visitors-list">
                {VISITORS.map(v => (
                  <div key={v.id} className="ud-visitor-row">
                    <div className="ud-visitor-avatar">{v.initials}</div>
                    <div className="ud-visitor-info">
                      <span className="ud-visitor-name">{v.name}</span>
                      <span className="ud-visitor-time">{v.time}</span>
                    </div>
                    <span className={`ud-visitor-status ${v.statusClass}`}>{v.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default UserDashboardPage

