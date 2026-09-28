import React, { useState } from 'react';
import { AlertTriangle, Check, RefreshCw, Plus, Clock } from 'lucide-react';

export default function Complaints({ complaints, setComplaints, stats, setStats }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    aptNumber: '1',
    residentName: '',
    title: '',
    description: '',
    priority: 'Orta' // Düşük, Orta, Yüksek
  });

  const handleStatusChange = (id, newStatus) => {
    let oldStatusWasPending = false;
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        if (c.status === 'Beklemede' && newStatus !== 'Beklemede') {
          oldStatusWasPending = true;
        }
        return { ...c, status: newStatus };
      }
      return c;
    }));

    if (oldStatusWasPending && newStatus === 'Çözüldü') {
      setStats(prev => ({
        ...prev,
        pendingComplaints: Math.max(0, prev.pendingComplaints - 1)
      }));
    } else if (!oldStatusWasPending && newStatus === 'Beklemede') {
      setStats(prev => ({
        ...prev,
        pendingComplaints: prev.pendingComplaints + 1
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: Date.now(),
      aptNumber: parseInt(formData.aptNumber),
      residentName: formData.residentName || `Sakin (Daire ${formData.aptNumber})`,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: 'Beklemede',
      date: new Date().toLocaleDateString('tr-TR')
    };

    setComplaints(prev => [newComplaint, ...prev]);
    setStats(prev => ({
      ...prev,
      pendingComplaints: prev.pendingComplaints + 1
    }));
    setFormData({ aptNumber: '1', residentName: '', title: '', description: '', priority: 'Orta' });
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Overview/Action bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Bekleyen Talepler: <b style={{ color: 'var(--warning)' }}>{complaints.filter(c => c.status === 'Beklemede').length}</b>
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            İşlemdekiler: <b style={{ color: 'var(--info)' }}>{complaints.filter(c => c.status === 'Çözülüyor').length}</b>
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Çözülenler: <b style={{ color: 'var(--success)' }}>{complaints.filter(c => c.status === 'Çözüldü').length}</b>
          </span>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> {showAddForm ? 'Kapat' : 'Talep / Şikayet Bildir'}
        </button>
      </div>

      <div className="dashboard-sections">
        {/* Complaints list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {complaints.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <AlertTriangle size={40} style={{ marginBottom: '12px', opacity: '0.5' }} />
              <p>Aktif bir talep veya şikayet kaydı bulunmuyor.</p>
            </div>
          ) : (
            complaints.map(c => (
              <div key={c.id} className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      <span className={`status-badge ${
                        c.status === 'Beklemede' ? 'badge-warning' : 
                        c.status === 'Çözülüyor' ? 'badge-info' : 'badge-success'
                      }`}>
                        {c.status}
                      </span>
                      <span className="status-badge" style={{ 
                        background: c.priority === 'Yüksek' ? 'rgba(239, 68, 68, 0.1)' : c.priority === 'Orta' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: c.priority === 'Yüksek' ? 'var(--danger)' : c.priority === 'Orta' ? 'var(--warning)' : 'var(--success)'
                      }}>
                        Öncelik: {c.priority}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{c.title}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Gönderen: <b>Daire {c.aptNumber} - {c.residentName}</b> | Tarih: {c.date}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {c.status !== 'Çözülüyor' && c.status !== 'Çözüldü' && (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '12px', gap: '4px' }}
                        onClick={() => handleStatusChange(c.id, 'Çözülüyor')}
                      >
                        <RefreshCw size={12} /> İşleme Al
                      </button>
                    )}
                    {c.status !== 'Çözüldü' && (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '12px', gap: '4px', background: 'var(--success)' }}
                        onClick={() => handleStatusChange(c.id, 'Çözüldü')}
                      >
                        <Check size={12} /> Çözüldü Olarak İşaretle
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '10px' }}>
                  {c.description}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add Form Drawer */}
        {showAddForm && (
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Talep / Şikayet Kaydı</h3>
            <form onSubmit={handleSubmit}>
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
                <label>Sakin Adı</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="İsim giriniz (İsteğe bağlı)"
                  value={formData.residentName}
                  onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Konu</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Başlık giriniz..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Öncelik Seviyesi</label>
                <select 
                  className="form-control"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Düşük">Düşük</option>
                  <option value="Orta">Orta</option>
                  <option value="Yüksek">Yüksek / Acil</option>
                </select>
              </div>

              <div className="form-group">
                <label>Açıklama / Mesaj</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Detayları buraya yazınız..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Talebi Gönder
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
