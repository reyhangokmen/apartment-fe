import React from 'react';
import { 
  Building2, Wallet, AlertTriangle, Megaphone, 
  ArrowUpRight, ChevronRight, CreditCard, CheckCircle2 
} from 'lucide-react';

export default function Dashboard({ setCurrentTab, stats, currentUser }) {
  const isAdmin = currentUser?.role === 'Yönetici';

  return (
    <div className="dashboard-content">
      {/* Stats Cards */}
      <div className="dashboard-grid">
        {isAdmin ? (
          <>
            <div 
              className="glass-panel-interactive stat-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentTab('apartments')}
              title="Kat & Daire Yönetimine Git"
            >
              <div className="stat-info">
                <span className="stat-label">Toplam Daire / Sakin</span>
                <span className="stat-value">{stats.totalApartments} / {stats.totalResidents}</span>
                <span style={{ fontSize: '11px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowUpRight size={12} /> Doluluk Oranı: %{stats.occupancyRate}
                </span>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(205, 166, 91, 0.15)', color: 'var(--accent-primary)' }}>
                <Building2 size={24} />
              </div>
            </div>

            <div 
              className="glass-panel-interactive stat-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentTab('payments')}
              title="Aidat & Ödeme Takibine Git"
            >
              <div className="stat-info">
                <span className="stat-label">Kasa Bakiyesi & Aidat</span>
                <span className="stat-value" style={{ color: 'var(--success)' }}>{stats.balance.toLocaleString('tr-TR')} ₺</span>
                <span style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowUpRight size={12} /> Bu Ay Tahsilat: +{stats.monthlyIncome.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                <Wallet size={24} />
              </div>
            </div>

            <div 
              className="glass-panel-interactive stat-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentTab('complaints')}
              title="Şikayet & Taleplere Git"
            >
              <div className="stat-info">
                <span className="stat-label">Bekleyen Talepler</span>
                <span className="stat-value" style={{ color: 'var(--warning)' }}>{stats.pendingComplaints}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  1 talep inceleniyor
                </span>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
                <AlertTriangle size={24} />
              </div>
            </div>

            <div 
              className="glass-panel-interactive stat-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentTab('announcements')}
              title="Duyuru ve Bildirimlere Git"
            >
              <div className="stat-info">
                <span className="stat-label">Aktif Duyurular</span>
                <span className="stat-value" style={{ color: 'var(--accent-primary)' }}>3 Yayında</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Son duyuru: Asansör bakımı
                </span>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(205, 166, 91, 0.15)', color: 'var(--accent-primary)' }}>
                <Megaphone size={24} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div 
              className="glass-panel-interactive stat-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentTab('payments')}
              title="Aidat Ödemelerime Git"
            >
              <div className="stat-info">
                <span className="stat-label">Dairenizin Borcu</span>
                <span className="stat-value" style={{ color: 'var(--danger)' }}>1.500 ₺</span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Temmuz 2026 Aidatı
                </span>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
                <CreditCard size={24} />
              </div>
            </div>

            <div 
              className="glass-panel-interactive stat-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentTab('complaints')}
              title="Taleplerime Git"
            >
              <div className="stat-info">
                <span className="stat-label">Talep Durumum</span>
                <span className="stat-value" style={{ color: 'var(--warning)' }}>1 Beklemede</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Koridor Aydınlatması
                </span>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
                <AlertTriangle size={24} />
              </div>
            </div>

            <div 
              className="glass-panel-interactive stat-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentTab('announcements')}
              title="Duyurulara Git"
            >
              <div className="stat-info">
                <span className="stat-label">Duyurular & Bildirimler</span>
                <span className="stat-value" style={{ color: 'var(--accent-primary)' }}>3 Yeni</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Toplantı & Asansör Bakımı
                </span>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(205, 166, 91, 0.15)', color: 'var(--accent-primary)' }}>
                <Megaphone size={24} />
              </div>
            </div>

            <div 
              className="glass-panel-interactive stat-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentTab('payments')}
              title="Ödeme Geçmişine Git"
            >
              <div className="stat-info">
                <span className="stat-label">Ödeme Durumu</span>
                <span className="stat-value" style={{ color: 'var(--success)' }}>Düzenli</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Son ödeme: 10 Haziran 2026
                </span>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                <CheckCircle2 size={24} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Sections */}
      <div className="dashboard-sections">
        {/* Left Side: Recent Updates & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Actions */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Hızlı İşlemler</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {isAdmin ? (
                <>
                  <button className="btn btn-secondary" onClick={() => setCurrentTab('payments')} style={{ justifyContent: 'flex-start', padding: '12px' }}>
                    <Wallet size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span>Aidat & Ödeme Takibi</span>
                  </button>
                  <button className="btn btn-secondary" onClick={() => setCurrentTab('apartments')} style={{ justifyContent: 'flex-start', padding: '12px' }}>
                    <Building2 size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span>Kat & Daire Yönetimi</span>
                  </button>
                  <button className="btn btn-secondary" onClick={() => setCurrentTab('announcements')} style={{ justifyContent: 'flex-start', padding: '12px' }}>
                    <Megaphone size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span>Duyuru & Bildirim Yayınla</span>
                  </button>
                  <button className="btn btn-secondary" onClick={() => setCurrentTab('complaints')} style={{ justifyContent: 'flex-start', padding: '12px' }}>
                    <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
                    <span>Talepleri İncele</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary" onClick={() => setCurrentTab('payments')} style={{ justifyContent: 'flex-start', padding: '12px' }}>
                    <CreditCard size={16} />
                    <span>Aidat & Borç Öde</span>
                  </button>
                  <button className="btn btn-secondary" onClick={() => setCurrentTab('complaints')} style={{ justifyContent: 'flex-start', padding: '12px' }}>
                    <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
                    <span>Arıza / Talep Bildir</span>
                  </button>
                  <button className="btn btn-secondary" onClick={() => setCurrentTab('announcements')} style={{ justifyContent: 'flex-start', padding: '12px' }}>
                    <Megaphone size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span>Duyuruları Görüntüle</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Finance Overview Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit' }}>
                {isAdmin ? 'Son Aidat & Ödeme Hareketleri' : 'Dairemizin Ödeme Geçmişi'}
              </h3>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setCurrentTab('payments')}>
                Tümünü Gör <ChevronRight size={14} />
              </button>
            </div>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Açıklama</th>
                    <th>Tür</th>
                    <th>Tarih</th>
                    <th>Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {isAdmin ? (
                    <>
                      <tr>
                        <td>Daire 2 - Temmuz Aidatı tahsilatı</td>
                        <td><span className="status-badge badge-success">Tahsil Edildi</span></td>
                        <td>10.07.2026</td>
                        <td style={{ color: 'var(--success)', fontWeight: '600' }}>+1,500 ₺</td>
                      </tr>
                      <tr>
                        <td>Daire 5 - Temmuz Aidatı tahsilatı</td>
                        <td><span className="status-badge badge-success">Tahsil Edildi</span></td>
                        <td>12.07.2026</td>
                        <td style={{ color: 'var(--success)', fontWeight: '600' }}>+1,500 ₺</td>
                      </tr>
                      <tr>
                        <td>Daire 7 - Temmuz Aidatı tahsilatı</td>
                        <td><span className="status-badge badge-success">Tahsil Edildi</span></td>
                        <td>14.07.2026</td>
                        <td style={{ color: 'var(--success)', fontWeight: '600' }}>+1,500 ₺</td>
                      </tr>
                      <tr>
                        <td>Daire 1 - Temmuz Aidatı (Gecikmede)</td>
                        <td><span className="status-badge badge-danger">Beklemede</span></td>
                        <td>20.07.2026</td>
                        <td style={{ color: 'var(--danger)', fontWeight: '600' }}>1,500 ₺</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td>Temmuz 2026 Aidat Ödemesi</td>
                        <td><span className="status-badge badge-danger">Ödenmedi</span></td>
                        <td>20.07.2026</td>
                        <td style={{ color: 'var(--danger)', fontWeight: '600' }}>1.500 ₺</td>
                      </tr>
                      <tr>
                        <td>Haziran 2026 Aidat Tahsilatı</td>
                        <td><span className="status-badge badge-success">Ödendi</span></td>
                        <td>10.06.2026</td>
                        <td style={{ color: 'var(--success)', fontWeight: '600' }}>+1.500 ₺</td>
                      </tr>
                      <tr>
                        <td>Mayıs 2026 Aidat Tahsilatı</td>
                        <td><span className="status-badge badge-success">Ödendi</span></td>
                        <td>12.05.2026</td>
                        <td style={{ color: 'var(--success)', fontWeight: '600' }}>+1.500 ₺</td>
                      </tr>
                      <tr>
                        <td>Nisan 2026 Aidat Tahsilatı</td>
                        <td><span className="status-badge badge-success">Ödendi</span></td>
                        <td>14.04.2026</td>
                        <td style={{ color: 'var(--success)', fontWeight: '600' }}>+1.500 ₺</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Announcements */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit' }}>Son Bildirim & Duyuru</h3>
              <Megaphone size={18} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <span className="status-badge badge-warning" style={{ marginBottom: '8px' }}>Önemli Duyuru</span>
              <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>Asansör Bakım Çalışması</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
                A blok asansörü 16 Temmuz Perşembe günü 10:00 - 14:00 saatleri arasında genel periyodik bakım sebebiyle hizmet vermeyecektir.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bugün, 14:30</span>
                <button 
                  onClick={() => setCurrentTab('announcements')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Duyuru Detayı →
                </button>
              </div>
            </div>
          </div>

          {/* Kat ve Daire Durum Özeti */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Bina & Daire Durum Özeti</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Kat & Daire Doluluk Oranı</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>9 / 12 Daire Dolu (%75)</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', background: 'var(--accent-gradient)', borderRadius: '3px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Bu Ayki Aidat Tahsilatı</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>3 / 6 Daire Ödendi (%50)</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '50%', height: '100%', background: 'linear-gradient(to right, #CDA65B, #10b981)', borderRadius: '3px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Çözüme Ulaşan Talepler</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>1 / 3 Talep Çözüldü</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '33%', height: '100%', background: '#CDA65B', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
