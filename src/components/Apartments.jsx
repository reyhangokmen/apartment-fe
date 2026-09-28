import React, { useState } from 'react';
import { Plus, UserPlus, Trash2, Edit2, Search } from 'lucide-react';

export default function Apartments({ apartments, setApartments }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingApartment, setEditingApartment] = useState(null);
  const [formData, setFormData] = useState({
    residentName: '',
    residentPhone: '',
    status: 'Dolu' // Dolu, Boş, Kiracı
  });

  const handleEdit = (apt) => {
    setEditingApartment(apt.id);
    setFormData({
      residentName: apt.residentName || '',
      residentPhone: apt.residentPhone || '',
      status: apt.status || 'Boş'
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setApartments(prev => prev.map(apt => {
      if (apt.id === editingApartment) {
        return {
          ...apt,
          residentName: formData.status === 'Boş' ? '' : formData.residentName,
          residentPhone: formData.status === 'Boş' ? '' : formData.residentPhone,
          status: formData.status
        };
      }
      return apt;
    }));
    setEditingApartment(null);
  };

  const handleClear = (aptId) => {
    if (window.confirm("Bu dairedeki sakin bilgisini silmek istediğinize emin misiniz?")) {
      setApartments(prev => prev.map(apt => {
        if (apt.id === aptId) {
          return {
            ...apt,
            residentName: '',
            residentPhone: '',
            status: 'Boş'
          };
        }
        return apt;
      }));
    }
  };

  const filteredApartments = apartments.filter(apt => 
    apt.number.toString().includes(searchTerm) || 
    (apt.residentName && apt.residentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Search and Action Bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Daire no veya sakin ara..." 
            className="form-control" 
            style={{ paddingLeft: '38px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Toplam: <b>{apartments.length} Daire</b> | Dolu: <b>{apartments.filter(a => a.status !== 'Boş').length}</b> | Boş: <b>{apartments.filter(a => a.status === 'Boş').length}</b>
        </div>
      </div>

      <div className="dashboard-sections">
        {/* Main Apartment Table */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Daire Listesi</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Kat</th>
                  <th>Daire No</th>
                  <th>Sakin Adı Soyadı</th>
                  <th>Durum</th>
                  <th>Telefon</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredApartments.map((apt) => (
                  <tr key={apt.id}>
                    <td>Kat {apt.floor}</td>
                    <td><b>No {apt.number}</b></td>
                    <td>{apt.residentName || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Boş Daire</span>}</td>
                    <td>
                      <span className={`status-badge ${
                        apt.status === 'Dolu' ? 'badge-success' : 
                        apt.status === 'Kiracı' ? 'badge-info' : 'badge-danger'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>{apt.residentPhone || '-'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '6px 10px' }} 
                          onClick={() => handleEdit(apt)}
                          title="Düzenle"
                        >
                          <Edit2 size={14} />
                        </button>
                        {apt.status !== 'Boş' && (
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '6px 10px' }} 
                            onClick={() => handleClear(apt.id)}
                            title="Sakini Çıkar"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Editor Form Panel */}
        <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>
            {editingApartment ? `Daire No ${apartments.find(a => a.id === editingApartment)?.number} Düzenle` : 'Daire İşlemi'}
          </h3>
          
          {editingApartment ? (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Durum</label>
                <select 
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Dolu">Kat Malik (Dolu)</option>
                  <option value="Kiracı">Kiracı</option>
                  <option value="Boş">Boş Daire</option>
                </select>
              </div>

              {formData.status !== 'Boş' && (
                <>
                  <div className="form-group">
                    <label>Sakin Adı Soyadı</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required
                      value={formData.residentName}
                      onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                      placeholder="Ad Soyad giriniz..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon Numarası</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      required
                      value={formData.residentPhone}
                      onChange={(e) => setFormData({ ...formData, residentPhone: e.target.value })}
                      placeholder="05xx xxx xx xx"
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>Kaydet</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingApartment(null)}>İptal</button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <UserPlus size={40} style={{ marginBottom: '12px', opacity: '0.5' }} />
              <p style={{ fontSize: '14px' }}>
                Daire sakin bilgilerini güncellemek veya yeni sakin atamak için tablodan ilgili dairenin yanındaki <b>Düzenle</b> butonuna tıklayınız.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
