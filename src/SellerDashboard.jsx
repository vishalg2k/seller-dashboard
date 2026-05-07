import React, { useState, useMemo } from 'react';
import { Filter, Search, IndianRupee, Phone, User, Home, Target, Tag, MapPin, Building2, RotateCcw, Lock } from 'lucide-react';
import './SellerDashboard.css';

const MOCK_LEADS = [
  { id: 'L-1001', name: 'Rahul Sharma', number: '+91 9876543210', price: '₹50L - ₹1Cr', bhk: '2 BHK', type: 'Buy', city: 'Mumbai', locality: 'Andheri West', date: '2026-05-07' },
  { id: 'L-1002', name: 'Priya Patel', number: '+91 9876543211', price: '₹1Cr - ₹2Cr', bhk: '3 BHK', type: 'Investment', city: 'Bangalore', locality: 'Whitefield', date: '2026-05-06' },
  { id: 'L-1003', name: 'Amit Kumar', number: '+91 9876543212', price: 'Under ₹25L', bhk: '1 BHK', type: 'Rent', city: 'Delhi', locality: 'Dwarka', date: '2026-05-06' },
  { id: 'L-1004', name: 'Sneha Gupta', number: '+91 9876543213', price: '₹2Cr - ₹5Cr', bhk: '4+ BHK', type: 'Buy', city: 'Mumbai', locality: 'Bandra West', date: '2026-05-05' },
  { id: 'L-1005', name: 'Vikram Singh', number: '+91 9876543214', price: '₹50L - ₹1Cr', bhk: '2 BHK', type: 'Investment', city: 'Pune', locality: 'Hinjewadi', date: '2026-05-05' },
  { id: 'L-1006', name: 'Neha Reddy', number: '+91 9876543215', price: '₹1Cr - ₹2Cr', bhk: '3 BHK', type: 'Buy', city: 'Hyderabad', locality: 'Gachibowli', date: '2026-05-04' },
  { id: 'L-1007', name: 'Arjun Desai', number: '+91 9876543216', price: '₹25L - ₹50L', bhk: '2 BHK', type: 'Rent', city: 'Bangalore', locality: 'Koramangala', date: '2026-05-03' },
  { id: 'L-1008', name: 'Kavya Iyer', number: '+91 9876543217', price: '₹50L - ₹1Cr', bhk: '2 BHK', type: 'Buy', city: 'Bangalore', locality: 'Indiranagar', date: '2026-05-03' },
  { id: 'L-1009', name: 'Rohan Mehta', number: '+91 9876543218', price: '₹1Cr - ₹2Cr', bhk: '3 BHK', type: 'Buy', city: 'Mumbai', locality: 'Powai', date: '2026-05-02' },
  { id: 'L-1010', name: 'Anjali Verma', number: '+91 9876543219', price: '₹25L - ₹50L', bhk: '1 BHK', type: 'Rent', city: 'Pune', locality: 'Kothrud', date: '2026-05-02' },
  { id: 'L-1011', name: 'Karan Joshi', number: '+91 9876543220', price: '₹2Cr - ₹5Cr', bhk: '4+ BHK', type: 'Investment', city: 'Delhi', locality: 'Saket', date: '2026-05-01' },
  { id: 'L-1012', name: 'Divya Nair', number: '+91 9876543221', price: 'Under ₹25L', bhk: '1 BHK', type: 'Rent', city: 'Hyderabad', locality: 'Madhapur', date: '2026-05-01' },
];

const TYPE_COLORS = { Buy: '#3b82f6', Rent: '#f59e0b', Investment: '#8b5cf6' };
const CITY_COLOR = '#4f46e5';

function BarChart({ data, color = CITY_COLOR }) {
  const width = 320;
  const height = 200;
  const padding = { top: 16, right: 12, bottom: 36, left: 28 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(1, ...data.map(d => d.value));
  const barW = innerW / data.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
      {[0, 0.5, 1].map((t, i) => {
        const y = padding.top + innerH * (1 - t);
        return (
          <g key={i}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="3 3" />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#9ca3af">{Math.round(max * t)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const h = (d.value / max) * innerH;
        const x = padding.left + i * barW + barW * 0.15;
        const y = padding.top + innerH - h;
        const w = barW * 0.7;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={w} height={h} fill={color} rx="3">
              <title>{`${d.label}: ${d.value}`}</title>
            </rect>
            <text x={x + w / 2} y={y - 4} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">{d.value}</text>
            <text x={x + w / 2} y={height - padding.bottom + 14} textAnchor="middle" fontSize="10" fill="#6b7280">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PieChart({ data, colors }) {
  const size = 200;
  const radius = 80;
  const cx = size / 2;
  const cy = size / 2;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;

  const arcs = data.map((d, i) => {
    const start = (acc / total) * Math.PI * 2;
    acc += d.value;
    const end = (acc / total) * Math.PI * 2;
    const largeArc = end - start > Math.PI ? 1 : 0;
    const x1 = cx + radius * Math.sin(start);
    const y1 = cy - radius * Math.cos(start);
    const x2 = cx + radius * Math.sin(end);
    const y2 = cy - radius * Math.cos(end);
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { path, color: colors[d.label] || `hsl(${i * 70}, 60%, 55%)`, label: d.label, value: d.value };
  });

  return (
    <div className="pie-wrapper">
      <svg viewBox={`0 0 ${size} ${size}`} className="chart-svg pie">
        {arcs.map(a => (
          <path key={a.label} d={a.path} fill={a.color} stroke="#fff" strokeWidth="2">
            <title>{`${a.label}: ${a.value}`}</title>
          </path>
        ))}
      </svg>
      <div className="legend">
        {arcs.map(a => (
          <div key={a.label} className="legend-item">
            <span className="legend-dot" style={{ background: a.color }} />
            <span className="legend-label">{a.label}</span>
            <span className="legend-value">{a.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SellerDashboard = () => {
  const [filters, setFilters] = useState({
    price: '',
    bhk: '',
    type: '',
    city: '',
    locality: '',
    status: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [purchased, setPurchased] = useState(new Set());

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'city') next.locality = '';
      return next;
    });
  };

  const handleBuy = (id) => {
    setPurchased(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleReset = () => {
    if (window.confirm('Reset dashboard? Clears purchases and all filters.')) {
      setPurchased(new Set());
      setFilters({ price: '', bhk: '', type: '', city: '', locality: '', status: '' });
      setSearchTerm('');
    }
  };

  const cities = useMemo(() => [...new Set(MOCK_LEADS.map(l => l.city))].sort(), []);
  const localities = useMemo(() => {
    const pool = filters.city ? MOCK_LEADS.filter(l => l.city === filters.city) : MOCK_LEADS;
    return [...new Set(pool.map(l => l.locality))].sort();
  }, [filters.city]);

  const filteredLeads = useMemo(() => {
    return MOCK_LEADS.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            lead.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = filters.price ? lead.price === filters.price : true;
      const matchesBhk = filters.bhk ? lead.bhk === filters.bhk : true;
      const matchesType = filters.type ? lead.type === filters.type : true;
      const matchesCity = filters.city ? lead.city === filters.city : true;
      const matchesLocality = filters.locality ? lead.locality === filters.locality : true;
      const matchesStatus = filters.status
        ? (filters.status === 'purchased' ? purchased.has(lead.id) : !purchased.has(lead.id))
        : true;

      return matchesSearch && matchesPrice && matchesBhk && matchesType && matchesCity && matchesLocality && matchesStatus;
    });
  }, [filters, searchTerm, purchased]);

  const stats = useMemo(() => ({
    total: MOCK_LEADS.length,
    showing: filteredLeads.length,
    bought: purchased.size,
  }), [filteredLeads, purchased]);

  const chartCity = useMemo(() => {
    const counts = {};
    filteredLeads.forEach(l => { counts[l.city] = (counts[l.city] || 0) + 1; });
    return Object.entries(counts).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [filteredLeads]);

  const chartType = useMemo(() => {
    const counts = {};
    filteredLeads.forEach(l => { counts[l.type] = (counts[l.type] || 0) + 1; });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [filteredLeads]);

  const chartBhk = useMemo(() => {
    const counts = {};
    filteredLeads.forEach(l => { counts[l.bhk] = (counts[l.bhk] || 0) + 1; });
    const order = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'];
    return order.filter(k => counts[k]).map(k => ({ label: k, value: counts[k] }));
  }, [filteredLeads]);

  const hasActiveFilters = Object.values(filters).some(v => v) || searchTerm;

  return (
    <div className="seller-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Seller Dashboard</h1>
          <p>Manage and purchase your verified leads</p>
        </div>
        <div className="header-right">
          <div className="lead-cost-badge">
            <IndianRupee size={16} />
            <span>500 per lead</span>
          </div>
          <button className="reset-btn" onClick={handleReset} title="Reset dashboard">
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Leads</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Showing</span>
            <span className="stat-value">{stats.showing}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Purchased</span>
            <span className="stat-value">{stats.bought}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Spent</span>
            <span className="stat-value">₹{stats.bought * 500}</span>
          </div>
        </div>

        <div className="main-grid">
          <div className="left-col">
            <div className="controls-bar">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by ID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filters-container">
                <div className="filter-group">
                  <Building2 size={16} />
                  <select value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)}>
                    <option value="">All Cities</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="filter-group">
                  <MapPin size={16} />
                  <select
                    value={filters.locality}
                    onChange={(e) => handleFilterChange('locality', e.target.value)}
                    disabled={!localities.length}
                  >
                    <option value="">All Localities</option>
                    {localities.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="filter-group">
                  <Filter size={16} />
                  <select value={filters.price} onChange={(e) => handleFilterChange('price', e.target.value)}>
                    <option value="">All Prices</option>
                    <option value="Under ₹25L">Under ₹25L</option>
                    <option value="₹25L - ₹50L">₹25L - ₹50L</option>
                    <option value="₹50L - ₹1Cr">₹50L - ₹1Cr</option>
                    <option value="₹1Cr - ₹2Cr">₹1Cr - ₹2Cr</option>
                    <option value="₹2Cr - ₹5Cr">₹2Cr - ₹5Cr</option>
                  </select>
                </div>

                <div className="filter-group">
                  <Filter size={16} />
                  <select value={filters.bhk} onChange={(e) => handleFilterChange('bhk', e.target.value)}>
                    <option value="">All BHK</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4+ BHK">4+ BHK</option>
                  </select>
                </div>

                <div className="filter-group">
                  <Filter size={16} />
                  <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                    <option value="">All Intents</option>
                    <option value="Buy">Buy</option>
                    <option value="Rent">Rent</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>

                <div className="status-toggle">
                  <button
                    className={filters.status === '' ? 'active' : ''}
                    onClick={() => handleFilterChange('status', '')}
                  >
                    All ({MOCK_LEADS.length})
                  </button>
                  <button
                    className={filters.status === 'purchased' ? 'active' : ''}
                    onClick={() => handleFilterChange('status', 'purchased')}
                  >
                    Purchased ({purchased.size})
                  </button>
                  <button
                    className={filters.status === 'new' ? 'active' : ''}
                    onClick={() => handleFilterChange('status', 'new')}
                  >
                    Unpurchased ({MOCK_LEADS.length - purchased.size})
                  </button>
                </div>

                {hasActiveFilters && (
                  <button
                    className="clear-filters"
                    onClick={() => {
                      setFilters({ price: '', bhk: '', type: '', city: '', locality: '', status: '' });
                      setSearchTerm('');
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="table-container">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Lead ID</th>
                    <th><div className="th-content"><User size={14} /> Name</div></th>
                    <th><div className="th-content"><Phone size={14} /> Contact</div></th>
                    <th><div className="th-content"><Building2 size={14} /> City</div></th>
                    <th><div className="th-content"><MapPin size={14} /> Locality</div></th>
                    <th><div className="th-content"><Tag size={14} /> Price</div></th>
                    <th><div className="th-content"><Home size={14} /> BHK</div></th>
                    <th><div className="th-content"><Target size={14} /> Intent</div></th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => {
                      const isBought = purchased.has(lead.id);
                      return (
                        <tr key={lead.id} className={isBought ? 'row-bought' : ''}>
                          <td className="lead-id">{lead.id}</td>
                          <td className="lead-name">{lead.name}</td>
                          <td className="lead-number">
                            {isBought ? (
                              <span className="phone-cell revealed">{lead.number}</span>
                            ) : (
                              <span className="phone-cell locked" title="Buy lead to unlock">
                                <Lock size={12} className="lock-icon" />
                                <span className="phone-blur">{lead.number}</span>
                              </span>
                            )}
                          </td>
                          <td>{lead.city}</td>
                          <td className="locality-cell">{lead.locality}</td>
                          <td>
                            {isBought ? lead.price : (
                              <span className="phone-cell locked" title="Buy lead to unlock">
                                <Lock size={12} className="lock-icon" />
                                <span className="phone-blur">{lead.price}</span>
                              </span>
                            )}
                          </td>
                          <td>
                            {isBought ? <span className="bhk-badge">{lead.bhk}</span> : (
                              <span className="phone-cell locked" title="Buy lead to unlock">
                                <Lock size={12} className="lock-icon" />
                                <span className="phone-blur">{lead.bhk}</span>
                              </span>
                            )}
                          </td>
                          <td>
                            {isBought ? (
                              <span className={`type-badge ${lead.type.toLowerCase()}`}>{lead.type}</span>
                            ) : (
                              <span className="phone-cell locked" title="Buy lead to unlock">
                                <Lock size={12} className="lock-icon" />
                                <span className="phone-blur">{lead.type}</span>
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              className={`buy-lead-btn ${isBought ? 'bought' : ''}`}
                              onClick={() => handleBuy(lead.id)}
                              disabled={isBought}
                            >
                              {isBought ? 'Purchased' : 'Buy (₹500)'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="no-results">
                        No leads found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="right-col">
            <div className="chart-card">
              <h3>Leads by City</h3>
              {chartCity.length ? <BarChart data={chartCity} /> : <div className="empty-chart">No data</div>}
            </div>
            <div className="chart-card">
              <h3>Intent Distribution</h3>
              {chartType.length ? <PieChart data={chartType} colors={TYPE_COLORS} /> : <div className="empty-chart">No data</div>}
            </div>
            <div className="chart-card">
              <h3>BHK Mix</h3>
              {chartBhk.length ? <BarChart data={chartBhk} color="#10b981" /> : <div className="empty-chart">No data</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
