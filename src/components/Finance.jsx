import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export default function Finance({ transactions, setTransactions, stats, setStats }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Gelir', // Gelir, Gider
    category: 'Aidat',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const totalIncome = transactions
    .filter(t => t.type === 'Gelir')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Gider')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const newTx = {
      id: Date.now(),
      title: formData.title,
      type: formData.type,
      category: formData.category,
      amount: amountNum,
      date: formData.date
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update global dashboard stats
    setStats(prev => {
      const balanceDiff = formData.type === 'Gelir' ? amountNum : -amountNum;
      const incomeDiff = formData.type === 'Gelir' ? amountNum : 0;
      return {
        ...prev,
        balance: prev.balance + balanceDiff,
        monthlyIncome: prev.monthlyIncome + incomeDiff
      };
    });

    alert("İşlem kaydı başarıyla kaydedildi.");
    setFormData({
      title: '',
      type: 'Gelir',
      category: 'Aidat',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Finance Metrics */}
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="stat-info">
            <span className="stat-label">Toplam Kasa Hesabı</span>
            <span className="stat-value" style={{ color: 'var(--text-primary)' }}>{netBalance.toLocaleString('tr-TR')} ₺</span>
            <span style={{ fontSize: '11px', color: netBalance >= 0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={12} /> Bütçe Durumu: Dengeli
            </span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
            <Wallet size={24} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-info">
            <span className="stat-label">Toplam Gelirler</span>
            <span className="stat-value" style={{ color: 'var(--success)' }}>+{totalIncome.toLocaleString('tr-TR')} ₺</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Aidat ve ortak gelirler
            </span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <ArrowUpRight size={24} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-info">
            <span className="stat-label">Toplam Giderler</span>
            <span className="stat-value" style={{ color: 'var(--danger)' }}>-{totalExpense.toLocaleString('tr-TR')} ₺</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Bakım, onarım ve faturalar
            </span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
            <ArrowDownRight size={24} />
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        {/* Transaction History */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit' }}>Kasa Hareketleri Log Defteri</h3>
            <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={16} /> {showAddForm ? 'Kapat' : 'Yeni Gelir / Gider Ekle'}
            </button>
          </div>
          
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Açıklama</th>
                  <th>Kategori</th>
                  <th>Tarih</th>
                  <th>Tür</th>
                  <th style={{ textAlign: 'right' }}>Tutar</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td><b>{t.title}</b></td>
                    <td><span style={{ color: 'var(--text-secondary)' }}>{t.category}</span></td>
                    <td>{t.date}</td>
                    <td>
                      <span className={`status-badge ${t.type === 'Gelir' ? 'badge-success' : 'badge-danger'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td style={{ 
                      textAlign: 'right', 
                      fontWeight: '600',
                      color: t.type === 'Gelir' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {t.type === 'Gelir' ? '+' : '-'}{t.amount.toLocaleString('tr-TR')} ₺
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Transaction Drawer */}
        {showAddForm && (
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Kasa Hareketi Ekle</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>İşlem Türü</label>
                <select 
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, category: e.target.value === 'Gelir' ? 'Aidat' : 'Asansör Bakım' })}
                >
                  <option value="Gelir">Gelir (Giriş)</option>
                  <option value="Gider">Gider (Çıkış)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Açıklama / Başlık</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Örn: Temmuz ayı aidat tahsilatları, Temizlik gideri..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Kategori</label>
                {formData.type === 'Gelir' ? (
                  <select 
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Aidat">Aidat Tahsilatı</option>
                    <option value="Otopark Geliri">Otopark Geliri</option>
                    <option value="Sosyal Tesis">Sosyal Tesis Kullanım</option>
                    <option value="Faiz/Diğer">Faiz / Ek Gelir</option>
                  </select>
                ) : (
                  <select 
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Asansör Bakım">Asansör Bakım</option>
                    <option value="Peyzaj / Bahçe">Peyzaj / Bahçe</option>
                    <option value="Personel Maaş">Personel Maaşları</option>
                    <option value="Ortak Elektrik / Su">Ortak Elektrik / Su</option>
                    <option value="Temizlik / Hijyen">Temizlik / Hijyen</option>
                    <option value="Hukuk / Büro">Hukuk / Büro Gideri</option>
                  </select>
                )}
              </div>

              <div className="form-group">
                <label>Tutar (₺)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Kaydet
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
