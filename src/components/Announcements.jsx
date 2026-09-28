import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';

export default function Announcements({ announcements, setAnnouncements }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'Bilgi' // Önemli, Bilgi, Etkinlik
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnn = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      type: formData.type,
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    setFormData({ title: '', content: '', type: 'Bilgi' });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Action Header */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit' }}>Yayınlanmış Duyurular</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={16} /> {showAddForm ? 'Kapat' : 'Yeni Duyuru Yayınla'}
        </button>
      </div>

      <div className="dashboard-sections">
        {/* Announcements List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Megaphone size={40} style={{ marginBottom: '12px', opacity: '0.5' }} />
              <p>Yayınlanmış herhangi bir duyuru bulunmuyor.</p>
            </div>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className="glass-panel" style={{ padding: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <span className={`status-badge ${
                      ann.type === 'Önemli' ? 'badge-danger' : 
                      ann.type === 'Etkinlik' ? 'badge-info' : 'badge-warning'
                    }`} style={{ marginBottom: '8px' }}>
                      {ann.type}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{ann.title}</h4>
                  </div>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '6px 10px', background: 'transparent', borderColor: 'transparent' }}
                    onClick={() => handleDelete(ann.id)}
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '12px' }}>
                  {ann.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {ann.date}
                  </span>
                  <span>|</span>
                  <span>{ann.time}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Form Panel */}
        {showAddForm && (
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Duyuru Oluştur</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Duyuru Başlığı</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Duyuru başlığını giriniz..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Kategori</label>
                <select 
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Bilgi">Bilgi / Duyuru</option>
                  <option value="Önemli">Önemli / Acil</option>
                  <option value="Etkinlik">Sosyal Etkinlik</option>
                </select>
              </div>

              <div className="form-group">
                <label>İçerik Detayı</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Duyuru içeriğini detaylıca yazınız..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Duyuruyu Yayınla
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
