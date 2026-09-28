import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Megaphone, 
  AlertTriangle 
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Gösterge Paneli', icon: LayoutDashboard },
  { id: 'apartments', label: 'Kat & Daire Yönetimi', icon: Building2 },
  { id: 'payments', label: 'Aidat & Ödeme Modülü', icon: CreditCard },
  { id: 'complaints', label: 'Talep & Şikayet Modülü', icon: AlertTriangle },
  { id: 'announcements', label: 'Duyuru & Bildirimler', icon: Megaphone },
  { id: 'users', label: 'Sakin / Kullanıcı Listesi', icon: Users }
];

export default function Sidebar({ currentTab, setCurrentTab, collapsed, currentUser }) {
  const role = currentUser?.role;

  // Sadece istenen temel modüller: Aidat, Ödeme, Kat/Daire, Talep/Şikayet, Bildirim
  const visibleMenuItems = menuItems.filter((item) => {
    if (role === 'Yönetici' || role === 'Süper Admin') {
      return true; // Yönetici tüm temel yönetim modüllerini görür
    }
    
    if (role === 'Kat Sakini') {
      // Sakin sadece kendi paneli, aidat/ödemesi, talepleri ve bildirimleri görür
      const residentTabs = ['dashboard', 'payments', 'complaints', 'announcements'];
      return residentTabs.includes(item.id);
    }
    
    // Varsayılan / Personel
    const defaultTabs = ['dashboard', 'apartments', 'payments', 'complaints', 'announcements'];
    return defaultTabs.includes(item.id);
  });

  return (
    <aside className={`sidebar glass-panel ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="/kovan-logo.png" alt="KOVAN" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
        <span className="logo-text">KOVAN</span>
      </div>

      <div style={{ padding: '0 16px 8px 16px' }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          letterSpacing: '0.08em', 
          color: '#CDA65B', 
          padding: '6px 8px', 
          background: 'rgba(205, 166, 91, 0.1)', 
          borderRadius: '6px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <span>{role === 'Yönetici' ? 'Yönetici Modu' : 'Sakin Modu'}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`menu-item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
              title={item.label}
            >
              <div className="menu-item-icon">
                <Icon size={20} />
              </div>
              <span className="menu-text">{item.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
