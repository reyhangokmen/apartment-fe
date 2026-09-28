import React, { useState } from 'react';
import { QrCode, Clipboard, Calendar, Clock, UserCheck, ShieldCheck } from 'lucide-react';

export default function QrService() {
  const [formData, setFormData] = useState({
    serviceType: 'Kurye / Kargo',
    providerName: '',
    plateNumber: '',
    aptNumber: '1',
    validityHours: '2' // 1, 2, 4, 12, 24
  });

  const [generatedPass, setGeneratedPass] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    
    // Generate a unique token
    const token = 'AURA-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + parseInt(formData.validityHours));

    setGeneratedPass({
      token,
      serviceType: formData.serviceType,
      providerName: formData.providerName || 'Belirtilmedi',
      plateNumber: formData.plateNumber || 'Plaka Kaydı Yok',
      aptNumber: formData.aptNumber,
      expiryString: expiryTime.toLocaleString('tr-TR'),
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${token}&color=6366f1&bgcolor=ffffff`
    });
  };

  const copyToken = () => {
    if (generatedPass) {
      navigator.clipboard.writeText(generatedPass.token);
      alert("Geçiş kodu panoya kopyalandı!");
    }
  };

  return (
    <div className="dashboard-sections">
      
      {/* Generate form */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Geçici Giriş QR Kodu Üret</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
          Gelen kurye, teknik servis veya misafirleriniz için nizamiyede/güvenlik kapısında okutulmak üzere geçici ve süreli bir giriş izin QR kodu oluşturun.
        </p>

        <form onSubmit={handleGenerate}>
          <div className="form-group">
            <label>Servis Türü</label>
            <select 
              className="form-control"
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            >
              <option value="Kurye / Kargo">Kurye / Kargo</option>
              <option value="Teknik Servis">Teknik Servis</option>
              <option value="Temizlik / Ev Hizmetleri">Temizlik / Ev Hizmetleri</option>
              <option value="Misafir">Misafir / Ziyaretçi</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ziyaretçi Adı / Şirket</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Örn: Trendyol Kurye, Ahmet Yılmaz..."
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Araç Plakası (Varsa)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Örn: 34 ABC 123 (İsteğe bağlı)"
              value={formData.plateNumber}
              onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Hedef Daire</label>
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
              <label>Geçerlilik Süresi</label>
              <select 
                className="form-control"
                value={formData.validityHours}
                onChange={(e) => setFormData({ ...formData, validityHours: e.target.value })}
              >
                <option value="1">1 Saat</option>
                <option value="2">2 Saat</option>
                <option value="4">4 Saat</option>
                <option value="12">12 Saat</option>
                <option value="24">24 Saat</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            <QrCode size={16} /> QR Giriş İzni Oluştur
          </button>
        </form>
      </div>

      {/* QR Code display */}
      <div className="glass-panel qr-card" style={{ justifyContent: 'center' }}>
        {generatedPass ? (
          <div style={{ width: '100%' }}>
            <span className="status-badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
              <ShieldCheck size={14} /> Aktif İzin Kartı
            </span>
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {generatedPass.serviceType} Giriş Yetkisi
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Hedef Daire: {generatedPass.aptNumber} | {generatedPass.providerName}
            </p>

            <div className="qr-box" style={{ margin: '20px auto' }}>
              <svg width="150" height="150" viewBox="0 0 29 29" style={{ fill: 'var(--bg-primary)' }}>
                {/* Visual Simulation of QR Code */}
                <path d="M0 0h9v9H0zm1 1v7h7V1zm1 1h5v5H2zm18-2h9v9h-9zm1 1v7h7V1zm1 1h5v5H22zM0 20h9v9H0zm1 1v7h7v-7zm1 1h5v5H2z" fill="#6366f1"/>
                <path d="M12 0h2v2h-2zm3 0h2v4h-2zm3 0h1v2h-1zm-9 3h3v2H6zm6 1h2v3h-2zm3 1h2v1h-2zm3 1h1v2h-1zm0-3h1v1h-1zm2 1h1v2h-1zm-7 5h2v3h-2zm3 0h1v2h-1zm2 1h1v1h-1zm3 1h1v1h-1zm-9 3h1v2h-1zm2 0h2v1h-2zm3 1h1v2h-1zm2 0h1v1h-1zm2 1h1v2h-1z" fill="#8b5cf6"/>
                <circle cx="14.5" cy="14.5" r="2.5" fill="#ec4899"/>
              </svg>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Geçiş Kodu (Token)</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <code style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent-primary)', letterSpacing: '1px' }}>{generatedPass.token}</code>
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  onClick={copyToken}
                  title="Kopyala"
                >
                  <Clipboard size={14} />
                </button>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', justify: 'center', gap: '4px' }}>
                <Clock size={12} style={{ color: 'var(--warning)' }} /> 
                Son Geçerlilik: <b>{generatedPass.expiryString}</b>
              </span>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>
            <QrCode size={64} style={{ marginBottom: '16px', opacity: '0.2', margin: '0 auto' }} />
            <p style={{ fontSize: '14px' }}>Geçiş kartı bilgilerini doldurup oluşturduktan sonra QR kodunuz ve izin kartınız burada gösterilecektir.</p>
          </div>
        )}
      </div>

    </div>
  );
}
