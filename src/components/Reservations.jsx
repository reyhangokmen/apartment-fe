import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Clock, MapPin, User } from 'lucide-react';

const COMMON_AREAS = [
  { id: 'fitness', name: 'Fitness & Spor Salonu', icon: '🏋️‍♂️', description: 'Günlük kapasite: 15 kişi. Saatlik rezervasyon gereklidir.' },
  { id: 'pool', name: 'Yüzme Havuzu / Şezlong', icon: '🏊‍♂️', description: 'Yaz sezonunda 08:00 - 22:00 saatleri arasında açıktır.' },
  { id: 'kamelya', name: 'Kamelya / Barbekü Alanı', icon: '🍖', description: 'Bahçede bulunan barbekü alanı ve 4 adet kamelya.' },
  { id: 'tennis', name: 'Tenis & Basketbol Sahası', icon: '🎾', description: 'Aydınlatmalı açık spor sahası.' }
];

export default function Reservations({ reservations, setReservations }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    areaId: 'fitness',
    aptNumber: '1',
    residentName: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '14:00 - 16:00'
  });

  const handleBook = (e) => {
    e.preventDefault();
    const area = COMMON_AREAS.find(a => a.id === formData.areaId);
    
    // Check duplication (same date, same slot, same area)
    const isConflict = reservations.some(res => 
      res.areaId === formData.areaId && 
      res.date === formData.date && 
      res.timeSlot === formData.timeSlot
    );

    if (isConflict) {
      alert("Bu saat dilimi belirtilen tarih için zaten rezerve edilmiş durumda. Lütfen başka bir saat veya gün seçiniz.");
      return;
    }

    const newRes = {
      id: Date.now(),
      areaId: formData.areaId,
      areaName: area.name,
      aptNumber: parseInt(formData.aptNumber),
      residentName: formData.residentName || `Daire ${formData.aptNumber}`,
      date: formData.date,
      timeSlot: formData.timeSlot
    };

    setReservations(prev => [newRes, ...prev]);
    alert(`${area.name} için rezervasyonunuz (${formData.date} - ${formData.timeSlot}) başarıyla oluşturuldu.`);
    setFormData(prev => ({ ...prev, residentName: '' }));
    setShowAddForm(false);
  };

  const handleCancel = (id) => {
    if (window.confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) {
      setReservations(prev => prev.filter(res => res.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Areas Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {COMMON_AREAS.map(area => (
          <div key={area.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
            <div>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{area.icon}</div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>{area.name}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '16px' }}>{area.description}</p>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', fontSize: '13px', marginTop: 'auto' }}
              onClick={() => {
                setFormData(prev => ({ ...prev, areaId: area.id }));
                setShowAddForm(true);
              }}
            >
              Rezervasyon Yap
            </button>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        {/* Reservation List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Güncel Rezervasyon Takvimi</h3>
          {reservations.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Calendar size={40} style={{ marginBottom: '12px', opacity: '0.5' }} />
              <p>Aktif bir rezervasyon kaydı bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Ortak Alan</th>
                    <th>Daire / Sakin</th>
                    <th>Rezervasyon Tarihi</th>
                    <th>Saat Aralığı</th>
                    <th style={{ textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(res => (
                    <tr key={res.id}>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                          <span>{COMMON_AREAS.find(a => a.id === res.areaId)?.icon || '📍'}</span>
                          <span>{res.areaName}</span>
                        </span>
                      </td>
                      <td>No {res.aptNumber} - {res.residentName}</td>
                      <td>{res.date}</td>
                      <td>
                        <span className="status-badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {res.timeSlot}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleCancel(res.id)}
                        >
                          İptal Et
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Booking Form Panel */}
        {showAddForm && (
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Yer Ayırt</h3>
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label>Rezervasyon Alanı</label>
                <select 
                  className="form-control"
                  value={formData.areaId}
                  onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                >
                  {COMMON_AREAS.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
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
                <label>Sakin Adı Soyadı</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Sakin Adı"
                  value={formData.residentName}
                  onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tarih</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Saat Dilimi</label>
                <select 
                  className="form-control"
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                >
                  <option value="09:00 - 11:00">09:00 - 11:00</option>
                  <option value="11:00 - 13:00">11:00 - 13:00</option>
                  <option value="13:00 - 15:00">13:00 - 15:00</option>
                  <option value="15:00 - 17:00">15:00 - 17:00</option>
                  <option value="17:00 - 19:00">17:00 - 19:00</option>
                  <option value="19:00 - 21:00">19:00 - 21:00</option>
                  <option value="21:00 - 23:00">21:00 - 23:00</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>Rezerve Et</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>İptal</button>
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
