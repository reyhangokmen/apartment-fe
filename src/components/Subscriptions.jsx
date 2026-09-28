import React, { useState, useEffect } from 'react';
import { Package, Check, CreditCard, ShieldCheck, HelpCircle, Sparkles, MessageSquare, Mail } from 'lucide-react';

export default function Subscriptions({ currentUser }) {
  const [activeSubs, setActiveSubs] = useState({
    sms: false,
    whatsapp: false
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [isPaying, setIsPaying] = useState(false);

  const packs = [
    {
      id: 'sms',
      title: 'Aylık SMS Bildirim Paketi',
      description: 'Yasal bildirimleri, aidat borçlarını ve önemli apartman duyurularını anlık olarak cep telefonunuza SMS ile alın.',
      price: '39 ₺',
      period: '/ ay',
      features: [
        'Anlık SMS bildirimleri',
        'Kritik durumlarda yedek (fallback) kanal desteği',
        'KMK kararları ve toplantı çağrıları tebliği',
        'Limitsiz SMS alımı'
      ],
      color: 'var(--accent-primary)',
      icon: Mail
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Onay ve Bildirim Paketi',
      description: 'Güvenlik kapısına gelen ziyaretçilerinizi anlık WhatsApp mesajı üzerinden onaylayın/reddedin. Gelen kutusuyla entegre çift yönlü akış.',
      price: '59 ₺',
      period: '/ ay',
      features: [
        'Fiziksel ziyaretçi giriş WhatsApp onay butonu',
        'Çift yönlü otomatik karar motoru entegrasyonu',
        'Limitsiz onay & mesajlaşma akışı',
        'Anlık durum bildirimleri'
      ],
      color: 'var(--success)',
      icon: MessageSquare
    }
  ];

  useEffect(() => {
    // Load subscription status from localStorage
    const saved = localStorage.getItem(`kovan_subs_${currentUser.email}`);
    if (saved) {
      setActiveSubs(JSON.parse(saved));
    }
  }, [currentUser]);

  const handleSubscribeClick = (pack) => {
    setSelectedPack(pack);
    setShowCheckout(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsPaying(true);

    setTimeout(() => {
      setIsPaying(false);
      setShowCheckout(false);
      
      const newSubs = {
        ...activeSubs,
        [selectedPack.id]: true
      };
      
      setActiveSubs(newSubs);
      localStorage.setItem(`kovan_subs_${currentUser.email}`, JSON.stringify(newSubs));
      
      // Also register this under system-wide subscriptions for notification triggers
      const allSubscriptions = JSON.parse(localStorage.getItem('kovan_system_subscriptions') || '{}');
      if (!allSubscriptions[currentUser.email]) {
        allSubscriptions[currentUser.email] = {};
      }
      allSubscriptions[currentUser.email][selectedPack.id] = true;
      localStorage.setItem('kovan_system_subscriptions', JSON.stringify(allSubscriptions));

      alert(`Tebrikler! ${selectedPack.title} başarıyla etkinleştirildi.`);
      setCardData({ number: '', name: '', expiry: '', cvc: '' });
      setSelectedPack(null);
    }, 1500);
  };

  const handleCancelSubscription = (packId) => {
    if (window.confirm("Bu ek hizmet aboneliğini sonlandırmak istediğinize emin misiniz?")) {
      const newSubs = {
        ...activeSubs,
        [packId]: false
      };
      setActiveSubs(newSubs);
      localStorage.setItem(`kovan_subs_${currentUser.email}`, JSON.stringify(newSubs));

      // Remove from system storage
      const allSubscriptions = JSON.parse(localStorage.getItem('kovan_system_subscriptions') || '{}');
      if (allSubscriptions[currentUser.email]) {
        allSubscriptions[currentUser.email][packId] = false;
        localStorage.setItem('kovan_system_subscriptions', JSON.stringify(allSubscriptions));
      }
      alert('Aboneliğiniz iptal edildi.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '30px 24px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
          <Sparkles size={16} /> Bireysel Bildirim Servisleri
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Ek Hizmet ve Abonelik Mağazası
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '650px', lineHeight: '1.5' }}>
          Aidat bütçenizden tamamen bağımsız olarak, kişisel bilgilendirme ve güvenlik onay ihtiyaçlarınıza yönelik ek SMS ve WhatsApp eklentilerini anında etkinleştirebilirsiniz.
        </p>
      </div>

      {/* Grid of Packages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {packs.map((pack) => {
          const Icon = pack.icon;
          const isActive = activeSubs[pack.id];
          
          return (
            <div 
              key={pack.id} 
              className="glass-panel" 
              style={{
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                position: 'relative',
                border: isActive ? `1px solid ${pack.color}40` : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isActive ? `0 10px 30px ${pack.color}0c` : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--success)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Check size={12} /> Etkin / Aktif
                </div>
              )}

              {/* Pack Title & Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  background: `${pack.color}15`,
                  color: pack.color,
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px'
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>{pack.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4', minHeight: '55px' }}>{pack.description}</p>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>{pack.price}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pack.period}</span>
                </div>
              </div>

              {/* Separator */}
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.05)' }}></div>

              {/* Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Paket İçeriği:</span>
                {pack.features.map((feature, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    <div style={{ color: isActive ? pack.color : 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }}>
                      <Check size={14} />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {isActive ? (
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}
                  onClick={() => handleCancelSubscription(pack.id)}
                >
                  Aboneliği İptal Et
                </button>
              ) : (
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', background: pack.color }}
                  onClick={() => handleSubscribeClick(pack)}
                >
                  Abone Ol / Satın Al
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Simulator Modal */}
      {showCheckout && selectedPack && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '420px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Title */}
            <div style={{ textAlign: 'center' }}>
              <CreditCard size={28} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit' }}>Ödeme Simülatörü</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {selectedPack.title} - <strong style={{ color: 'var(--text-primary)' }}>{selectedPack.price} / ay</strong>
              </p>
            </div>

            {/* Simulated Card Preview */}
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '160px',
              boxShadow: '0 10px 20px rgba(79, 70, 229, 0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.8 }}>KOVANCARD</span>
                <ShieldCheck size={20} />
              </div>
              <div style={{ fontSize: '16px', letterSpacing: '2px', fontFamily: 'monospace', margin: '14px 0' }}>
                {cardData.number || '•••• •••• •••• ••••'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '11px' }}>
                <div>
                  <span style={{ display: 'block', opacity: 0.6, fontSize: '9px', textTransform: 'uppercase' }}>Kart Sahibi</span>
                  <span style={{ fontWeight: '600' }}>{cardData.name || 'İSİM SOYAD'}</span>
                </div>
                <div>
                  <span style={{ display: 'block', opacity: 0.6, fontSize: '9px', textTransform: 'uppercase' }}>S.K.T</span>
                  <span style={{ fontWeight: '600' }}>{cardData.expiry || 'AA/YY'}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kart Sahibi</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  placeholder="örn: ALİ YILMAZ"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kart Numarası</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  maxLength="19"
                  placeholder="1234 5678 1234 5678"
                  value={cardData.number}
                  onChange={(e) => {
                    // Simple formatting
                    const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                    const matches = v.match(/\d{4,16}/g);
                    const match = (matches && matches[0]) || '';
                    const parts = [];
                    for (let i = 0, len = match.length; i < len; i += 4) {
                      parts.push(match.substring(i, i + 4));
                    }
                    setCardData({ ...cardData, number: parts.length > 0 ? parts.join(' ') : v });
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Son Kullanma</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    placeholder="AA/YY"
                    maxLength="5"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>CVC (Güvenlik Kodu)</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    required 
                    maxLength="3"
                    placeholder="•••"
                    value={cardData.cvc}
                    onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/[^0-9]/g, '') })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flexGrow: 1, justifyContent: 'center' }}
                  disabled={isPaying}
                >
                  {isPaying ? 'Ödeme Alınıyor...' : `${selectedPack.price} Öde ve Başlat`}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setShowCheckout(false); setSelectedPack(null); }}
                  disabled={isPaying}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
