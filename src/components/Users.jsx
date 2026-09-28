import React, { useState } from 'react';
import { 
  Search, UserPlus, Shield, Mail, Phone, Check, X, 
  RefreshCw, Trash2, Edit2, Info, Lock, CheckSquare 
} from 'lucide-react';

export default function Users({ users, setUsers, apartments }) {
  const [activeSubTab, setActiveSubTab] = useState('list'); // list, invite, roles
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null); // Detailed view
  const [editingUser, setEditingUser] = useState(null);
  
  // Invitation/Creation Form state
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Kat Sakini',
    apartmentId: ''
  });

  // Edit User Form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: ''
  });

  // Roles & Permissions state (Mock configuration)
  const [rolePermissions, setRolePermissions] = useState({
    'Yönetici': { daire: true, aidat: true, duyuru: true, sikayet: true, otopark: true, gorev: true, iletisim: true },
    'Kat Sakini': { daire: false, aidat: false, duyuru: false, sikayet: true, otopark: false, gorev: false, iletisim: true },
    'Kiracı': { daire: false, aidat: false, duyuru: false, sikayet: true, otopark: false, gorev: false, iletisim: true },
    'Personel': { daire: false, aidat: false, duyuru: false, sikayet: false, otopark: true, gorev: true, iletisim: false }
  });

  const handleTogglePermission = (role, module) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: !prev[role][module]
      }
    }));
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    const selectedApt = apartments.find(a => a.id === parseInt(inviteForm.apartmentId));
    const apartmentText = selectedApt ? `Daire ${selectedApt.number} (${inviteForm.role})` : 'Görevli Dairesi';

    const newUser = {
      id: Date.now(),
      name: inviteForm.name,
      email: inviteForm.email,
      phone: inviteForm.phone,
      role: inviteForm.role,
      apartment: apartmentText,
      status: 'Davet Edildi',
      lastLogin: '-'
    };

    setUsers(prev => [newUser, ...prev]);
    
    // Clear form
    setInviteForm({
      name: '',
      email: '',
      phone: '',
      role: 'Kat Sakini',
      apartmentId: ''
    });

    setActiveSubTab('list');
    alert(`${newUser.name} adına e-posta/SMS daveti simüle edildi ve kullanıcı listesine eklendi!`);
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setUsers(prev => prev.map(u => {
      if (u.id === editingUser) {
        return {
          ...u,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          role: editForm.role,
          status: editForm.status
        };
      }
      return u;
    }));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Bu kullanıcının hesabını ve erişim yetkilerini tamamen silmek istediğinize emin misiniz?")) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
      }
    }
  };

  const handleResendInvite = (userName) => {
    alert(`${userName} için davet bağlantısı tekrar gönderildi.`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.apartment && user.apartment.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Sub-navigation Tabs */}
      <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', gap: '12px' }}>
        <button 
          className={`btn ${activeSubTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveSubTab('list'); setSelectedUser(null); setEditingUser(null); }}
        >
          Kullanıcı Listesi
        </button>
        <button 
          className={`btn ${activeSubTab === 'invite' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveSubTab('invite'); setSelectedUser(null); setEditingUser(null); }}
        >
          Yeni Davet Gönder
        </button>
        <button 
          className={`btn ${activeSubTab === 'roles' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveSubTab('roles'); setSelectedUser(null); setEditingUser(null); }}
        >
          Roller & Yetki Matrisi
        </button>
      </div>

      {activeSubTab === 'list' && (
        <div className="dashboard-sections">
          
          {/* Main User List Section */}
          <div className="glass-panel" style={{ padding: '24px', flexGrow: 1 }}>
            
            {/* Search and Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexGrow: 1, minWidth: '200px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="İsim, e-posta veya daire ara..." 
                  className="form-control" 
                  style={{ paddingLeft: '38px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="form-control" 
                style={{ width: '160px' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tüm Roller</option>
                <option value="Yönetici">Yöneticiler</option>
                <option value="Kat Sakini">Kat Sakinleri</option>
                <option value="Kiracı">Kiracılar</option>
                <option value="Personel">Personeller</option>
              </select>

              <select 
                className="form-control" 
                style={{ width: '160px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="Aktif">Aktifler</option>
                <option value="Davet Edildi">Davet Edilenler</option>
                <option value="Pasif">Pasifler</option>
              </select>
            </div>

            {/* Editing Form (inline modal-like card) */}
            {editingUser && (
              <div className="glass-panel" style={{ padding: '18px', marginBottom: '20px', borderColor: 'var(--accent-primary)', background: 'rgba(99, 102, 241, 0.05)' }}>
                <h4 style={{ marginBottom: '14px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: '600' }}>Kullanıcı Bilgilerini Düzenle</h4>
                <form onSubmit={handleEditSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ad Soyad</label>
                    <input type="text" className="form-control" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>E-posta</label>
                    <input type="email" className="form-control" required value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Telefon</label>
                    <input type="text" className="form-control" required value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Rol</label>
                    <select className="form-control" value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})}>
                      <option value="Yönetici">Yönetici</option>
                      <option value="Kat Sakini">Kat Sakini</option>
                      <option value="Kiracı">Kiracı</option>
                      <option value="Personel">Personel</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Durum</label>
                    <select className="form-control" value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}>
                      <option value="Aktif">Aktif</option>
                      <option value="Davet Edildi">Davet Edildi</option>
                      <option value="Pasif">Pasif</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Kaydet</button>
                    <button type="button" className="btn btn-secondary" style={{ padding: '8px 16px' }} onClick={() => setEditingUser(null)}>İptal</button>
                  </div>
                </form>
              </div>
            )}

            {/* Table Container */}
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Kullanıcı Bilgileri</th>
                    <th>Rol</th>
                    <th>Eşleşen Daire / Birim</th>
                    <th>Durum</th>
                    <th>Son Giriş</th>
                    <th style={{ textAlign: 'right' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Kriterlere uygun kullanıcı bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedUser(user)}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                            <Shield size={14} style={{ color: user.role === 'Yönetici' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                            {user.role}
                          </span>
                        </td>
                        <td>{user.apartment || '-'}</td>
                        <td>
                          <span className={`status-badge ${
                            user.status === 'Aktif' ? 'badge-success' : 
                            user.status === 'Davet Edildi' ? 'badge-info' : 'badge-danger'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.lastLogin}</td>
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 10px' }} 
                              onClick={() => handleEditClick(user)}
                              title="Düzenle"
                            >
                              <Edit2 size={14} />
                            </button>
                            {user.status === 'Davet Edildi' && (
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '6px 10px' }} 
                                onClick={() => handleResendInvite(user.name)}
                                title="Daveti Yenile"
                              >
                                <RefreshCw size={14} style={{ color: 'var(--info)' }} />
                              </button>
                            )}
                            <button 
                              className="btn btn-danger" 
                              style={{ padding: '6px 10px' }} 
                              onClick={() => handleDeleteUser(user.id)}
                              title="Hesabı Kaldır"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Detail Side Drawer Panel */}
          <div className="glass-panel" style={{ padding: '24px', width: '360px', height: 'fit-content', position: 'sticky', top: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} style={{ color: 'var(--accent-primary)' }} />
              Kullanıcı Profili
            </h3>

            {selectedUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{selectedUser.name}</div>
                  <span className={`status-badge ${selectedUser.status === 'Aktif' ? 'badge-success' : 'badge-info'}`} style={{ marginBottom: '12px', display: 'inline-block' }}>
                    {selectedUser.status}
                  </span>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Mail size={14} /> {selectedUser.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Phone size={14} /> {selectedUser.phone}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Sistem Rol Yetkisi</h4>
                  <div style={{ fontSize: '13px', background: 'rgba(99, 102, 241, 0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.1)' }}>
                    <strong>{selectedUser.role}</strong> Rolüne Atanmış.
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {selectedUser.role === 'Yönetici' ? 'Sistem genelinde tam yetkili, tüm ayarları ve finansal raporları düzenleyebilir.' : 
                       selectedUser.role === 'Personel' ? 'İş takip, otopark kontrolleri ve arıza giderme modüllerine erişebilir.' :
                       'Kendi dairesine ait aidat ödemelerini, anketleri görebilir, talep ve şikayet iletebilir.'}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Son Aktivite Kayıtları</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Sisteme Giriş Yaptı</span>
                      <span style={{ color: 'var(--text-muted)' }}>{selectedUser.lastLogin !== '-' ? selectedUser.lastLogin : 'Giriş Yok'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Temmuz Aidatı</span>
                      <span style={{ color: 'var(--success)' }}>Ödendi (Havale)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Talep Gönderimi</span>
                      <span style={{ color: 'var(--info)' }}>Aydınlatma Arızası</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '13px' }}>
                  Kullanıcının detaylı profil verilerini, aktivite geçmişini ve finansal kayıt özetini görüntülemek için listeden bir kullanıcının üzerine tıklayın.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {activeSubTab === 'invite' && (
        <div className="glass-panel" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={22} style={{ color: 'var(--accent-primary)' }} />
            Yeni Üye Davet Et
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Sakinleri, kiracıları veya kapıcı gibi apartman görevlilerini sisteme davet etmek için aşağıdaki formu doldurun. Davet bağlantısı SMS ve e-posta ile gönderilecektir.
          </p>

          <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="form-group">
              <label>Adı Soyadı</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="Ad Soyad yazınız..."
                value={inviteForm.name}
                onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>E-posta Adresi</label>
                <input 
                  type="email" 
                  className="form-control" 
                  required 
                  placeholder="ornek@email.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Telefon Numarası</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  required 
                  placeholder="05xx xxx xx xx"
                  value={inviteForm.phone}
                  onChange={(e) => setInviteForm({...inviteForm, phone: e.target.value})}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Sistem Rolü</label>
                <select 
                  className="form-control"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                >
                  <option value="Kat Sakini">Kat Sakini (Mülk Sahibi)</option>
                  <option value="Kiracı">Kiracı</option>
                  <option value="Yönetici">Yönetici Yardımcısı</option>
                  <option value="Personel">Apartman Görevlisi / Kapıcı</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Eşleşecek Daire</label>
                <select 
                  className="form-control"
                  required
                  value={inviteForm.apartmentId}
                  onChange={(e) => setInviteForm({...inviteForm, apartmentId: e.target.value})}
                >
                  <option value="">Seçiniz...</option>
                  {apartments.map(apt => (
                    <option key={apt.id} value={apt.id}>
                      Kat {apt.floor} - No {apt.number} ({apt.residentName || 'Boş'})
                    </option>
                  ))}
                  <option value="staff">Daire Dışı / Personel Birimi</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>Davet E-postası & SMS Gönder</button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveSubTab('list')}>İptal</button>
            </div>

          </form>
        </div>
      )}

      {activeSubTab === 'roles' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={20} style={{ color: 'var(--accent-primary)' }} />
                Rol Yetki ve İzin Matrisi
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0 0 0' }}>
                Farklı kullanıcı gruplarının hangi dijital modüllere erişebileceğini belirleyen matris tablosu. Tıklayarak izinleri düzenleyebilirsiniz.
              </p>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', border: '1px dashed var(--border-glass)', padding: '6px 12px', borderRadius: '6px' }}>
              Değişiklikler anlık olarak oturumlara yansır.
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>Kullanıcı Rolü</th>
                  <th style={{ textAlign: 'center' }}>Kat & Daire Yönetimi</th>
                  <th style={{ textAlign: 'center' }}>Aidat & Finans</th>
                  <th style={{ textAlign: 'center' }}>Duyuru Yayınlama</th>
                  <th style={{ textAlign: 'center' }}>Talep & Şikayet Bildirimi</th>
                  <th style={{ textAlign: 'center' }}>Otopark Kontrolleri</th>
                  <th style={{ textAlign: 'center' }}>İş Takip Modülü</th>
                  <th style={{ textAlign: 'center' }}>Komşularla İletişim</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(rolePermissions).map((role) => (
                  <tr key={role}>
                    <td>
                      <b style={{ color: 'var(--text-primary)' }}>{role}</b>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].daire} 
                        onChange={() => handleTogglePermission(role, 'daire')}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].aidat} 
                        onChange={() => handleTogglePermission(role, 'aidat')}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].duyuru} 
                        onChange={() => handleTogglePermission(role, 'duyuru')}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].sikayet} 
                        onChange={() => handleTogglePermission(role, 'sikayet')}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].otopark} 
                        onChange={() => handleTogglePermission(role, 'otopark')}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].gorev} 
                        onChange={() => handleTogglePermission(role, 'gorev')}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].iletisim} 
                        onChange={() => handleTogglePermission(role, 'iletisim')}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
