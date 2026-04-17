import React, { useState } from 'react'
import './DailyBasketPage.css'

const CATEGORIES = [
  { key: 'all', label: 'All Products' },
  { key: 'pantry', label: 'Pantry' },
  { key: 'fresh', label: 'Fresh Produce' },
  { key: 'wellness', label: 'Wellness' },
  { key: 'home', label: 'Home Care' },
  { key: 'pet', label: 'Pet Essentials' },
]

const PRODUCTS = [
  {
    id: 1,
    name: 'Daily Cream',
    vendor: 'Aurelian Labs',
    category: 'wellness',
    price: 42.0,
    badge: 'Best Seller',
    description: 'Hydrating morning moisturizer infused with botanicals and gold-leaf extract for a luminous glow.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqZ7h9kJXV_uz2p2gSBhyJs-l77aN86DWVxASGaH-eRRmL1rYr6WhRuh-eNO8tF4OsXZ4uUBXeUpno1kr_qz_JPGK35UilanJXRZknwV85jVwoOs_ERySMSLwhvoQKSpvb6K2WIAef1WrBuRrvSPPI1wISjfLJ-qx2Vjaz33bT2sdkN57cYjL5TqjB1Ygh0tWMxPpYgpJQGGFLuBCszxm9Fs3jW01qpJcEKBI6OgX7iY376iJbdnBaZ1Z-pm3V0NOxC88-0eLnrw',
  },
  {
    id: 2,
    name: 'Vegetable Kit',
    vendor: 'Root & Harvest',
    category: 'fresh',
    price: 28.0,
    badge: 'Fresh Today',
    description: 'A weekly curation of seasonal, pesticide-free vegetables harvested at peak ripeness.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtwaqmK5AJceZL65_obwzaejbAmlDtGF3Uq9SMyihy_zaL74ZCilg0n4Ie36-61u24Y5Z1KUOTZzak5inNBJ8WrcoBSnI3HIuID_TIEoroo14-Mtv7NO4ZauvotaQZcpmHlKUU6fYoLw16XJ0s0wGwORktmEo6j06pOwsaK9kIxmanEx1BvWGBtDoJlTULaNkOJ-drOnmAMVVO43_BayMwZOydNc0wGZFxg6kbj0eYUCF4a0gC5z6KHcOy-r6VKMU8yy4Hvd6rUA',
  },
  {
    id: 3,
    name: 'Pedigree Mix',
    vendor: 'Heritage Pet',
    category: 'pet',
    price: 56.0,
    badge: null,
    description: 'High-protein nutrition crafted with ancient grains and real ocean-caught salmon for active pets.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZsI3A51reeBQiTcminMUNmcq_OChdC2QmCSLX8nKIAwAA7QlJsW56ILNnLv9y-veMQkp-2OMoHjQq68sqgu-SMxEwdESyUR5ayORxX1Vhz95EcevA_Hc4_dEzMBuNp8JDQo4f2XrwOn900A7gxu6OC4ogpalExI_9tOGRJdbaJB9QkkE-j1vv5J_6_6toyd_-cPgJaHvJAeD9D93yEnxou6t9rGvJByjiRlQjCCMKaiLoyhdHyh7If02LGoJzvbPXiRUkIJHWdw',
  },
  {
    id: 4,
    name: 'Raw Forest Honey',
    vendor: 'Wildwood Apiary',
    category: 'pantry',
    price: 18.0,
    badge: null,
    description: 'Unfiltered and cold-pressed honey from wildflower meadows deep within the protected forest.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnK7SGdKufStzUMqKYwQRcbfGdR0cMK_DB7tUnhMFV65yvhQPN0yBpm9iR1P0Qggw28kztSWSrahpsIXlsPm5S3VkAP57vgquWJ32OsaT2xpMeX09dtiVHqydUTZmUYev6GodweAdkzojMB0brmiZEl4mw0yQhYNbCDS1fNgyVWgjwr2xPf4V08iGh-k2_krQ6YsEqzD1QVpbfk1ZfriNyNYtUw_PlydPsbAwv8g8ltL2YfsQdxAua0QSX-LpJeJhPfST5whYmaw',
  },
  {
    id: 5,
    name: 'Single Origin Beans',
    vendor: 'Roast & Ritual',
    category: 'pantry',
    price: 24.0,
    badge: null,
    description: 'Light roast with notes of citrus and jasmine, ethically sourced from Ethiopian highlands.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfnteD1FH3J8kHWeXjpUX2b9m7rAj1pYC217k_0SiY4FNYYPvVv-jRSulIlxTEI5c0c2Jgc1vEn45HksUGuw3QT_-y-Ie0Q_i7eLDRUK7Im3hFQ5q-xA4a7BA4U_DWja0kmm8OT73BznaoAXuUIEkUBZJ9zLNE-VDZu0rm1v9fKl9lI15FSLq1dH-6TGvd4Dne2qC1xuUMBq9B2jjNUHljpup1fRi7AzY1FEOyziwIHTFBCcooMiz5jihr80fwg2cxxFS8fFIvWw',
  },
  {
    id: 6,
    name: 'Linen Soft Wash',
    vendor: 'Pure Home',
    category: 'home',
    price: 32.0,
    badge: null,
    description: 'Plant-based concentrated formula that protects delicate fabrics with a scent of lavender and cedar.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGlm3NYJ-mpRexR6TRxvDzkCNWF7BUiyPU4mMq1RxDUoJSXRlMmxfzJMNpcPIe44-s3WalrDfVi41Teql4pJSqD_KvAsLi5j4T_vmJiMIjW7eUcZQRmFjP-C-H-gpLy9Eu0araxnmwdSsrItxBUdpEQmnu2YYoTpP1A5wOh1omHwCz2E_zoWonN_EEDOjwYknhSi_LC2jF3eu7n4r2aWgWRGR3X1ZR2enxwSqhqQ3XOQ_6sKn8-IAOVH_fslc_2WmPQ1wHJ8MZRg',
  },
]

function DailyBasketPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = PRODUCTS.filter(p => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="db-page">
      {/* Header */}
      <header className="db-header">
        <div className="db-header-text">
          <h1 className="db-title">Curated Selection</h1>
          <p className="db-subtitle">
            Daily essentials, refined for the modern household. From organic harvests to premium care,
            every item is hand-selected for quality and sustainability.
          </p>
        </div>
        <div className="db-header-actions">
          <div className="db-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search curated essentials..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Category Filters */}
      <section className="db-filters">
        <span className="db-filter-label">Filter By</span>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            type="button"
            className={`db-filter-btn${activeCategory === cat.key ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* Product Grid */}
      <div className="db-grid">
        {filtered.length === 0 && (
          <div className="db-empty">
            <span className="material-symbols-outlined">inventory_2</span>
            <p>No products found matching your criteria.</p>
          </div>
        )}

        {filtered.map(product => (
          <div key={product.id} className="db-card">
            <div className="db-card-image-wrap">
              <img
                src={product.image}
                alt={product.name}
                className="db-card-image"
              />
              {product.badge && (
                <div className="db-card-badge">
                  <span>{product.badge}</span>
                </div>
              )}
            </div>

            <div className="db-card-body">
              <div className="db-card-top">
                <div>
                  <p className="db-card-vendor">{product.vendor}</p>
                  <h3 className="db-card-name">{product.name}</h3>
                </div>
                <span className="db-card-price">${product.price.toFixed(2)}</span>
              </div>
              <p className="db-card-desc">{product.description}</p>
              <button type="button" className="db-card-btn">Subscribe</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="db-pagination">
          <p className="db-pagination-text">
            Showing {filtered.length} of {filtered.length} curated items
          </p>
          <button type="button" className="db-load-more">Load More Essentials</button>
        </div>
      )}
    </div>
  )
}

export default DailyBasketPage
