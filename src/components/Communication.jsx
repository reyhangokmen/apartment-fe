import React, { useState } from 'react';
import { MessageSquare, Phone, Send, User, ShieldAlert } from 'lucide-react';

const EMERGENCY_NUMBERS = [
  { name: 'Nizamiye / Güvenlik Kulübesi', phone: '0216 555 10 10', description: '7/24 Güvenlik ve Giriş Kontrol' },
  { name: 'Yönetici Reyhan Demir', phone: '0532 111 22 33', description: 'Apartman Yönetimi Genel Sorumlusu' },
  { name: 'Kapıcı Ahmet Efendi', phone: '0544 222 33 44', description: 'Ortak Alan Temizlik & Çöp Toplama' },
  { name: 'Elektrikçi Veli Usta', phone: '0555 333 44 55', description: 'Apartman Anlaşmalı Elektrikçi' },
  { name: 'Tesisatçı Ali Usta', phone: '0533 444 55 66', description: 'Apartman Anlaşmalı Sıhhi Tesisatçı' },
  { name: 'Polis İmdat', phone: '155 / 112', description: 'Acil Güvenlik Durumları' },
  { name: 'İtfaiye', phone: '110 / 112', description: 'Acil Yangın Durumları' },
  { name: 'Ambulans', phone: '112', description: 'Acil Sağlık Durumları' }
];

export default function Communication({ messages, setMessages }) {
  const [activeTab, setActiveTab] = useState('messaging'); // messaging, directory
  const [selectedThreadId, setSelectedThreadId] = useState(1);
  const [replyText, setReplyText] = useState('');

  const activeThread = messages.find(m => m.id === selectedThreadId);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (replyText.trim() === '' || !activeThread) return;

    setMessages(prev => prev.map(m => {
      if (m.id === selectedThreadId) {
        return {
          ...m,
          unread: false,
          replies: [
            ...m.replies,
            {
              sender: 'Yönetim',
              text: replyText,
              time: 'Az önce',
              isAdmin: true
            }
          ]
        };
      }
      return m;
    }));

    setReplyText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Subtab selection */}
      <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', gap: '8px' }}>
        <button 
          className={`btn ${activeTab === 'messaging' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => setActiveTab('messaging')}
        >
          Sakin Mesajları ({messages.filter(m => m.unread).length} Yeni)
        </button>
        <button 
          className={`btn ${activeTab === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => setActiveTab('directory')}
        >
          Acil Durum & Telefon Rehberi
        </button>
      </div>

      {activeTab === 'messaging' ? (
        <div className="dashboard-sections" style={{ gridTemplateColumns: '1fr 2fr' }}>
          
          {/* Thread list */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', paddingBottom: '10px', borderBottom: '1px solid var(--border-glass)' }}>Gelen Mesaj Kutusu</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '500px' }}>
              {messages.map(m => (
                <div 
                  key={m.id}
                  className={`glass-panel-interactive`}
                  style={{ 
                    padding: '12px', 
                    cursor: 'pointer', 
                    borderLeft: m.unread ? '4px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                    background: selectedThreadId === m.id ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.01)'
                  }}
                  onClick={() => {
                    setSelectedThreadId(m.id);
                    // Mark as read
                    setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, unread: false } : msg));
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Daire {m.aptNumber} - {m.residentName}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {m.subject}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Thread view */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
            {activeThread ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
                
                {/* Thread Header */}
                <div style={{ paddingBottom: '14px', borderBottom: '1px solid var(--border-glass)', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Konu: {activeThread.subject}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Gönderici: <b>Daire {activeThread.aptNumber} - {activeThread.residentName}</b>
                  </span>
                </div>

                {/* Message bubble thread log */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', padding: '10px 0', minHeight: '260px' }}>
                  
                  {/* Original message */}
                  <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '14px 14px 14px 2px', border: '1px solid var(--border-glass)' }}>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{activeThread.message}</p>
                      <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>{activeThread.time}</span>
                    </div>
                  </div>

                  {/* Replies */}
                  {activeThread.replies.map((reply, idx) => (
                    <div key={idx} style={{ alignSelf: reply.isAdmin ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                      <div style={{ 
                        background: reply.isAdmin ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)', 
                        padding: '12px 16px', 
                        borderRadius: reply.isAdmin ? '14px 14px 2px 14px' : '14px 14px 14px 2px', 
                        border: reply.isAdmin ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid var(--border-glass)'
                      }}>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{reply.text}</p>
                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>{reply.time}</span>
                      </div>
                    </div>
                  ))}

                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginTop: '16px' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Yanıtınızı buraya yazınız..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 14px' }}>
                    <Send size={16} />
                  </button>
                </form>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, color: 'var(--text-muted)' }}>
                <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                <p>Konuşmayı görüntülemek için sol taraftan bir mesaj seçiniz.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Emergency directory list */
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <ShieldAlert size={22} style={{ color: 'var(--danger)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit' }}>Acil Durum & Telefon Rehberi</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {EMERGENCY_NUMBERS.map((contact, idx) => (
              <div key={idx} className="glass-panel-interactive" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--accent-primary)' }}>
                  <Phone size={16} />
                </div>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{contact.name}</h5>
                  <code style={{ fontSize: '14px', fontWeight: '700', color: 'var(--success)' }}>{contact.phone}</code>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{contact.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
