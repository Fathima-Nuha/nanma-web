import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserDashboardPage.css'

const ALL_SERVICES = [
  { key: 'services', label: 'Services', icon: 'home_repair_service', desc: 'Professional housekeeping and maintenance.' },
  { key: 'complaints', label: 'Complaints', icon: 'report_problem', desc: 'Swift resolution for your living concerns.' },
  { key: 'utility', label: 'Utility Scan', icon: 'sensors', desc: 'Real-time usage and sustainability metrics.' },
  { key: 'facilities', label: 'Facilities', icon: 'layers', desc: 'Reserve the spa, gym, or tennis courts.' },
  { key: 'basket', label: 'Daily Basket', icon: 'shopping_basket', desc: 'Artisan pantry staples delivered daily.' },
  { key: 'farm2door', label: 'Farm2Door', icon: 'eco', desc: 'Direct link to local agricultural harvests.' },
  { key: 'payments', label: 'Payments', icon: 'receipt_long', desc: 'Pay maintenance and utility bills online.' },
  { key: 'accounts', label: 'My Accounts', icon: 'manage_accounts', desc: 'Manage your profile and preferences.' },
  { key: 'groups', label: 'Groups', icon: 'group', desc: 'Connect with your building community.' },
  { key: 'broadcast', label: 'Broadcast', icon: 'campaign', desc: 'Important announcements from management.' },
  { key: 'events', label: 'Events', icon: 'event', desc: 'Upcoming community events and activities.' },
  { key: 'visitors', label: 'My Visitors', icon: 'person_pin', desc: 'Track and manage your guest entries.' },
  { key: 'offers', label: 'Offers Hub', icon: 'local_offer', desc: 'Exclusive deals and resident discounts.' },
  { key: 'marketplace', label: 'MarketPlace', icon: 'storefront', desc: 'Buy and sell within your community.' },
  { key: 'help', label: 'Help & Feedback', icon: 'help_outline', desc: 'Get support or share your feedback.' },
  { key: 'gym', label: 'Gym Directory', icon: 'fitness_center', desc: 'Equipment guide and booking for the gym.' },
  { key: 'sos', label: 'Emergency SOS', icon: 'emergency', desc: 'Instant alert to security and management.' },
]

const QUICK_SERVICES = [
  { key: 'services', label: 'Services', icon: 'home_repair_service', desc: 'Housekeeping and maintenance.' },
  { key: 'complaints', label: 'Complaints', icon: 'report_problem', desc: 'Swift resolution for concerns.' },
  { key: 'utility', label: 'Utility Scan', icon: 'sensors', desc: 'Real-time usage metrics.' },
  { key: 'facilities', label: 'Facilities', icon: 'layers', desc: 'Reserve spa, gym, courts.' },
  { key: 'payments', label: 'Payments', icon: 'receipt_long', desc: 'Pay bills online.' },
  { key: 'visitors', label: 'My Visitors', icon: 'person_pin', desc: 'Track your guest entries.' },
  { key: 'offers', label: 'Offers Hub', icon: 'local_offer', desc: 'Exclusive resident deals.' },
  { key: 'sos', label: 'Emergency SOS', icon: 'emergency', desc: 'Instant alert to security.' },
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

const SPOTLIGHT_SLIDES = [
  {
    id: 1,
    badge: 'Concierge Spotlight',
    title: 'Farm-to-Door Delivery',
    desc: 'Savor the freshest organic produce from local orchards, delivered directly to your doorstep every Tuesday morning.',
    img: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&q=70',
    cta: 'Schedule First Basket',
  },
  {
    id: 2,
    badge: 'Offers Hub',
    title: '20% Off Spa Services',
    desc: 'Unwind this weekend with exclusive resident discounts on all spa and wellness treatments. Valid through April 30.',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&q=70',
    cta: 'Book Now',
  },
  {
    id: 3,
    badge: 'Offers Hub',
    title: 'Rooftop Dining Night',
    desc: 'Enjoy a complimentary appetizer at the rooftop restaurant every Friday evening. Show your resident card to avail.',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=70',
    cta: 'Reserve a Table',
  },
  {
    id: 4,
    badge: 'Offers Hub',
    title: 'Free Gym Guest Pass',
    desc: 'Bring a friend to the gym on weekends at no cost. Passes are limited — claim yours before they run out.',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=70',
    cta: 'Claim Pass',
  },
]

const NAV_PATHS = {
  services: '/user/services',
  complaints: '/user/complaints',
}

function UserDashboardPage() {
  const navigate = useNavigate()
  const [slideIndex, setSlideIndex] = useState(0)
  const [showAllServices, setShowAllServices] = useState(false)

  const userName = localStorage.getItem('user_name') || 'Resident'

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % SPOTLIGHT_SLIDES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const servicesRef = useRef(null)
  const eventsRef = useRef(null)

  const handleExploreLifestyle = () => {
    setShowAllServices(true)
    setTimeout(() => servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const handleViewSchedule = () => {
    eventsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="ud-content-left">
        {/* Hero */}
        <section className="ud-hero">
          <div className="ud-hero-text">
            <h1>Welcome home, {userName.split(' ')[0]}.</h1>
            <p>Everything you need to curate your lifestyle is at your fingertips.</p>
            <div className="ud-hero-btns">
              <button type="button" className="ud-hero-btn-primary" onClick={handleExploreLifestyle}>Explore Lifestyle</button>
              <button type="button" className="ud-hero-btn-secondary" onClick={handleViewSchedule}>View Schedule</button>
            </div>
          </div>
        </section>

        {/* Curated Services */}
        <section className="ud-section" ref={servicesRef}>
          <div className="ud-section-header">
            <div>
              <h2 className="ud-section-title">Curated Services</h2>
              <p className="ud-section-subtitle">Refined solutions for your daily living</p>
            </div>
            <button type="button" className="ud-section-view-all" onClick={() => setShowAllServices(s => !s)}>
              {showAllServices ? 'Show Less' : 'View All Services'}
            </button>
          </div>
          <div className="ud-services-grid">
            {(showAllServices ? ALL_SERVICES : QUICK_SERVICES).map(svc => (
              <div key={svc.key} className={`ud-service-card${svc.key === 'sos' ? ' sos' : ''}`} onClick={() => NAV_PATHS[svc.key] ? navigate(NAV_PATHS[svc.key]) : null}>
                <span className="material-symbols-outlined ud-service-icon">{svc.icon}</span>
                <span className="ud-service-label">{svc.label}</span>
                <span className="ud-service-desc">{svc.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Community Hub */}
        <section className="ud-section" ref={eventsRef}>
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
        {/* Spotlight / Offers Carousel */}
        <div className="ud-spotlight-card">
          <div className="ud-spotlight-slides">
            {SPOTLIGHT_SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className={`ud-spotlight-slide${i === slideIndex ? ' active' : ''}`}
              >
                <span className={`ud-spotlight-badge${slide.badge === 'Offers Hub' ? ' offers' : ''}`}>
                  {slide.badge}
                </span>
                <h3 className="ud-spotlight-title">{slide.title}</h3>
                <p className="ud-spotlight-desc">{slide.desc}</p>
                <img src={slide.img} alt={slide.title} className="ud-spotlight-img" />
                <button type="button" className="ud-spotlight-link">
                  {slide.cta}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="ud-spotlight-dots">
            {SPOTLIGHT_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                className={`ud-spotlight-dot${i === slideIndex ? ' active' : ''}`}
                onClick={() => setSlideIndex(i)}
              />
            ))}
          </div>
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
    </>
  )
}

export default UserDashboardPage

