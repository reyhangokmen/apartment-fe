import React, { useState } from 'react';
import { Menu, Bell, Shield, User, Megaphone, AlertTriangle, MessageSquare, LogOut, Wallet, Sun, Moon } from 'lucide-react';

const tabTitles = {
  dashboard: 'Gösterge Paneli',
  apartments: 'Kat ve Daire Yönetimi',
  payments: 'Aidat Takip ve Ödeme Sistemi',
  complaints: 'Şikayet ve Talep Modülü',
  announcements: 'Duyurular & Bildirimler Panosu',
  users: 'Kullanıcı Hesapları & Rol Yönetimi'
};

export default function Navbar({ currentTab, collapsed, setCollapsed, setCurrentTab, currentUser, onLogout, theme, toggleTheme }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const notifications = [
    {
      id: 1,
      type: 'announcement',
      title: 'Yeni Duyuru: Asansör Bakımı',
      description: 'A blok asansörü perşembe günü bakıma alınacaktır.',
      icon: Megaphone,
      color: 'var(--warning)',
      targetTab: 'announcements'
    },
    {
      id: 2,
      type: 'complaint',
      title: 'Yeni Talep: Aydınlatma Arızası',
      description: 'Daire 6 koridor lambası arızasını bildirdi.',
      icon: AlertTriangle,
      color: 'var(--info)',
      targetTab: 'complaints'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Yeni Ödeme: Daire 2',
      description: 'Temmuz ayı aidatı online olarak tahsil edildi.',
      icon: Wallet,
      color: 'var(--success)',
      targetTab: 'payments'
    }
  ];

  const handleNotificationClick = (targetTab) => {
    setCurrentTab(targetTab);
    setShowDropdown(false);
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  return (
    <header className="navbar glass-panel" style={{ position: 'relative' }}>
      <div className="navbar-left">
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setCollapsed(!collapsed)}
          title="Menüyü daralt/genişlet"
        >
          <Menu size={20} />
        </button>
        <h1 className="navbar-title">{tabTitles[currentTab] || 'Yönetim Sistemi'}</h1>
      </div>

      <div className="navbar-right">
        {/* Theme Switcher Button */}
        <button 
          className="icon-badge-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Açık Moda Geç (Gündüz Modu)' : 'Koyu Moda Geç (Gece Modu)'}
          style={{
            color: 'var(--accent-primary)',
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Notification Container */}
        <div className="icon-badge-container" title="Bildirimler" style={{ position: 'relative' }}>
          <button className="icon-badge-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <Bell size={20} />
          </button>
          {notificationCount > 0 && <span className="badge">{notificationCount}</span>}

          {/* Premium Glassmorphic Dropdown */}
          {showDropdown && (
            <div className="glass-panel" style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '320px',
              zIndex: 1000,
              padding: '16px',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>Bildirimler</span>
                {notificationCount > 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setNotificationCount(0)}>
                    Tümünü Oku
                  </span>
                )}
              </div>

              {notificationCount === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Yeni bildirim bulunmuyor.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.slice(0, notificationCount).map((notif) => {
                    const IconComp = notif.icon;
                    return (
                      <div 
                        key={notif.id}
                        className="glass-panel-interactive"
                        style={{ 
                          padding: '10px 12px', 
                          borderRadius: '10px', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          background: 'rgba(255, 255, 255, 0.01)',
                          border: '1px solid var(--border-glass)'
                        }}
                        onClick={() => handleNotificationClick(notif.targetTab)}
                      >
                        <div style={{ 
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '8px', 
                          background: `${notif.color}1c`,
                          color: notif.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <IconComp size={16} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'left' }}>{notif.title}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'left', lineHeight: '1.3' }}>{notif.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* LogOut Button */}
        <button 
          className="btn btn-secondary" 
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => {
            if (window.confirm("Oturumu kapatmak istediğinize emin misiniz?")) {
              onLogout();
            }
          }}
          title="Oturumu Kapat"
        >
          <LogOut size={13} />
          <span>Çıkış Yap</span>
        </button>

        {/* User Profile */}
        <div className="user-profile">
          <div 
            className="user-avatar-container" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 
                currentUser.role === 'Süper Admin' ? 'rgba(245, 158, 11, 0.15)' :
                currentUser.role === 'Yönetici' ? 'rgba(99, 102, 241, 0.15)' : 
                currentUser.role === 'Personel' ? 'rgba(14, 165, 233, 0.15)' :
                'rgba(16, 185, 129, 0.15)', 
              color: 
                currentUser.role === 'Süper Admin' ? 'var(--warning)' :
                currentUser.role === 'Yönetici' ? 'var(--accent-primary)' : 
                currentUser.role === 'Personel' ? 'var(--info)' :
                'var(--success)', 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px',
              border: 
                currentUser.role === 'Süper Admin' ? '1px solid rgba(245, 158, 11, 0.3)' :
                currentUser.role === 'Yönetici' ? '1px solid rgba(99, 102, 241, 0.3)' : 
                currentUser.role === 'Personel' ? '1px solid rgba(14, 165, 233, 0.3)' :
                '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {currentUser.role === 'Süper Admin' ? (
                <>
                  <Shield size={10} style={{ color: 'var(--warning)' }} />
                  <span className="user-role">Sistem Yöneticisi</span>
                </>
              ) : currentUser.role === 'Yönetici' ? (
                <>
                  <Shield size={10} style={{ color: 'var(--accent-primary)' }} />
                  <span className="user-role">Apartman Yöneticisi</span>
                </>
              ) : currentUser.role === 'Personel' ? (
                <>
                  <User size={10} style={{ color: 'var(--info)' }} />
                  <span className="user-role">{currentUser.apartment} (Personel)</span>
                </>
              ) : (
                <>
                  <User size={10} style={{ color: 'var(--success)' }} />
                  <span className="user-role">{currentUser.apartment} (Sakin)</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
