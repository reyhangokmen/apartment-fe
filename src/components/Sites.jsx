import React, { useState } from 'react';
import { Plus, Building2, MapPin, UserCheck, CheckCircle2, AlertCircle, PlusCircle, Search } from 'lucide-react';

export default function Sites({ sites, setSites }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    manager: '',
    totalApts: '',
    status: 'Aktif'
  });

  const handleSave = (e) => {
    e.preventDefault();
    const newSite = {
      id: Date.now(),
      name: formData.name,
      address: formData.address,
      manager: formData.manager,
      totalApts: parseInt(formData.totalApts) || 0,
      status: formData.status
    };

    setSites(prev => [...prev, newSite]);
    setFormData({
      name: '',
      address: '',
      manager: '',
      totalApts: '',
      status: 'Aktif'
    });
    setShowAddForm(false);
    alert(`${newSite.name} başarıyla sisteme eklendi ve yönetici atandı!`);
  };

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    site.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Metrics Row for Super Admin */}
      <div className="dashboard-grid">
        <div className="glass-panel stat-card" style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>
          <div className="stat-info">
            <span className="stat-label" style={{ color: 'var(--text-secondary)' }}>Toplam Yönetilen Site</span>
            <span className="stat-value" style={{ color: 'var(--warning)' }}>{sites.length}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Farklı şehir ve semtlerde</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <Building2 size={24} />
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.15)' }}>
          <div className="stat-info">
            <span className="stat-label">Toplam Yönetici (Admin)</span>
            <span className="stat-value">{sites.filter(s => s.manager).length}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Atanmış apartman yöneticileri</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
            <UserCheck size={24} />
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
          <div className="stat-info">
            <span className="stat-label">Toplam Daire Portföyü</span>
            <span className="stat-value" style={{ color: 'var(--success)' }}>
              {sites.reduce((acc, curr) => acc + curr.totalApts, 0)} Daire
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Aktif yönetim altında</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ background: 'rgba(236, 72, 153, 0.05)', borderColor: 'rgba(236, 72, 153, 0.15)' }}>
          <div className="stat-info">
            <span className="stat-label">Abonelik Geliri</span>
            <span className="stat-value" style={{ color: 'var(--accent-tertiary)' }}>
              {(sites.filter(s => s.status === 'Aktif').length * 2500).toLocaleString('tr-TR')} ₺/Ay
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Site başı 2.500 ₺ SaaS bedeli</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: 'var(--accent-tertiary)' }}>
            <PlusCircle size={24} />
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="dashboard-sections">
        
        {/* Sites Table Listing */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit' }}>Site ve Apartman Listesi</h3>
            <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '380px' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Site veya yönetici ara..." 
                  className="form-control" 
                  style={{ paddingLeft: '38px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
                style={{ whiteSpace: 'nowrap', display: 'flex', gap: '6px' }}
              >
                <Plus size={16} /> Yeni Ekle
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Apartman / Site Adı</th>
                  <th>Konum</th>
                  <th>Atanmış Yönetici</th>
                  <th>Daire Sayısı</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((site) => (
                  <tr key={site.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Building2 size={16} style={{ color: 'var(--warning)' }} />
                        <b>{site.name}</b>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <MapPin size={12} /> {site.address}
                      </div>
                    </td>
                    <td>{site.manager || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Atanmadı</span>}</td>
                    <td>{site.totalApts} Daire</td>
                    <td>
                      <span className={`status-badge ${
                        site.status === 'Aktif' ? 'badge-success' : 
                        site.status === 'Beklemede' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {site.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Site Panel */}
        {showAddForm ? (
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Yeni Site Kaydı</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Site/Apartman Adı</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="örn: MaviKule Rezidans"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Adres/Konum</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="örn: Ankara, Çankaya"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Atanacak Yönetici</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="örn: Burak Kaya"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Daire Sayısı</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    required
                    placeholder="örn: 24"
                    value={formData.totalApts}
                    onChange={(e) => setFormData({ ...formData, totalApts: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Abonelik Durumu</label>
                  <select 
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Beklemede">Beklemede</option>
                    <option value="Pasif">Pasif</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>Kaydet</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>İptal</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}>
            <Building2 size={40} style={{ color: 'var(--accent-primary)', marginBottom: '12px', opacity: 0.6 }} />
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>SaaS Site Yönetimi</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0 0 16px 0' }}>
              Sisteme yeni bir apartman veya toplu konut (site) ekleyip, yönetim paneline erişebilecek bir yönetici (admin) atamak için butonuna tıklayın.
            </p>
            <button className="btn btn-secondary" onClick={() => setShowAddForm(true)}>
              Yeni Site Kaydı Başlat
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
