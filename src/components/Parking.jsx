import React, { useState } from 'react';
import { Car, Plus, Search, CheckCircle, Info } from 'lucide-react';

export default function Parking({ vehicles, setVehicles }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '',
    ownerName: '',
    aptNumber: '1',
    type: 'Sakin', // Sakin, Misafir
    slotNumber: ''
  });

  const handleRegister = (e) => {
    e.preventDefault();
    const plate = formData.plateNumber.toUpperCase().replace(/\s+/g, '');
    
    // Check if plate exists
    const exists = vehicles.some(v => v.plateNumber.replace(/\s+/g, '') === plate);
    if (exists) {
      alert("Bu plaka zaten otopark sisteminde kayıtlıdır.");
      return;
    }

    const newVehicle = {
      id: Date.now(),
      plateNumber: formData.plateNumber.toUpperCase(),
      ownerName: formData.ownerName,
      aptNumber: parseInt(formData.aptNumber),
      type: formData.type,
      slotNumber: formData.slotNumber || `P-${Math.floor(Math.random() * 50) + 1}`,
      date: new Date().toLocaleDateString('tr-TR')
    };

    setVehicles(prev => [newVehicle, ...prev]);
    alert(`${newVehicle.plateNumber} plakalı araç ${newVehicle.slotNumber} numaralı otopark yerine kaydedilmiştir.`);
    setFormData({ plateNumber: '', ownerName: '', aptNumber: '1', type: 'Sakin', slotNumber: '' });
    setShowAddForm(false);
  };

  const handleRemove = (id) => {
    if (window.confirm("Araç kaydını silmek istediğinize emin misiniz?")) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.aptNumber.toString().includes(searchTerm)
  );

  const capacity = 50;
  const occupiedCount = vehicles.length;
  const freeCount = capacity - occupiedCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Otopark Stats */}
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="stat-info">
            <span className="stat-label">Toplam Otopark Kapasitesi</span>
            <span className="stat-value">{capacity} Araç</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              1 araç = 1 tahsisli yer
            </span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
            <Car size={24} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-info">
            <span className="stat-label">Dolu Park Yerleri</span>
            <span className="stat-value" style={{ color: 'var(--warning)' }}>{occupiedCount} Araç</span>
            <span style={{ fontSize: '11px', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              Doluluk Oranı: %{Math.round((occupiedCount / capacity) * 100)}
            </span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <Car size={24} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-info">
            <span className="stat-label">Boş Park Yerleri</span>
            <span className="stat-value" style={{ color: 'var(--success)' }}>{freeCount} Yer</span>
            <span style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <CheckCircle size={12} /> Rezervasyona Açık
            </span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <Car size={24} />
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="dashboard-sections">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit' }}>Kayıtlı Araç Listesi</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Plaka veya Sakin Ara..." 
                  style={{ paddingLeft: '32px', height: '36px', width: '200px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={() => setShowAddForm(!showAddForm)}>
                <Plus size={14} /> Yeni Araç Ekle
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Plaka</th>
                  <th>Sakin / Sahip</th>
                  <th>Daire</th>
                  <th>Otopark No</th>
                  <th>Tür</th>
                  <th>Kayıt Tarihi</th>
                  <th style={{ textAlign: 'right' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map(v => (
                  <tr key={v.id}>
                    <td><b style={{ background: '#f1f5f9', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px', fontFamily: 'monospace', fontSize: '13px' }}>{v.plateNumber}</b></td>
                    <td>{v.ownerName}</td>
                    <td>No {v.aptNumber}</td>
                    <td><span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{v.slotNumber}</span></td>
                    <td>
                      <span className={`status-badge ${v.type === 'Sakin' ? 'badge-success' : 'badge-info'}`}>
                        {v.type}
                      </span>
                    </td>
                    <td>{v.date}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => handleRemove(v.id)}
                      >
                        Kaydı Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Form Drawer */}
        {showAddForm && (
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Araç Kayıt Formu</h3>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Plaka Numarası</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Örn: 34XYZ999"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Sürücü Ad Soyad</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="İsim Giriniz"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Daire No</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="1" 
                  max="48"
                  value={formData.aptNumber}
                  onChange={(e) => setFormData({ ...formData, aptNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Zimmetli Park Yeri (İsteğe bağlı)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Örn: P-12 (Boş bırakılırsa atanır)"
                  value={formData.slotNumber}
                  onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Tür</label>
                <select 
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Sakin">Sakin Aracı</option>
                  <option value="Misafir">Misafir Aracı</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Aracı Kaydet
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
