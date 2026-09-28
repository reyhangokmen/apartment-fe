import React, { useState } from 'react';
import { CreditCard, Plus, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

export default function Payments({ apartments, payments, setPayments, stats, setStats, currentUser }) {
  const [activeSubTab, setActiveSubTab] = useState('debts'); // debts, history, bulk
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [bulkAmount, setBulkAmount] = useState('1500');
  const [bulkMonth, setBulkMonth] = useState('Ağustos 2026');
  
  // Payment card states
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [use3DS, setUse3DS] = useState(true);

  // Auto payment settings
  const [selectedAutoPack, setSelectedAutoPack] = useState('pack1');
  const [hasRegisteredCard, setHasRegisteredCard] = useState(true); // Default mock card active

  // cash handler
  const [cashReceiver, setCashReceiver] = useState(currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Reyhan Demir (Yönetici)');

  const isManager = currentUser?.role === 'Yönetici' || currentUser?.role === 'Süper Admin';

  const handlePayClick = (pay) => {
    setSelectedPayment(pay);
    setCardHolder(pay.residentName || '');
    setCardNumber('');
    setExpiry('');
    setCvc('');
  };

  const executePayment = (e) => {
    e.preventDefault();
    if (!selectedPayment) return;

    setIsProcessing(true);

    // Simulate different payment experiences
    setTimeout(() => {
      setIsProcessing(false);

      let successMessage = '';
      let nextStatus = 'Ödendi';

      if (paymentMethod === 'credit_card') {
        successMessage = `Tek Çekim Kredi Kartı ile ${selectedPayment.amount} ₺ tutarındaki ödeme başarıyla tahsil edilmiştir.${use3DS ? ' (3D Secure Onaylandı)' : ''}`;
      } else if (paymentMethod === 'registered_card') {
        successMessage = `Kayıtlı Kart (Tokenization) kullanılarak ${selectedPayment.amount} ₺ tutarındaki ödeme anında çekilmiştir.`;
      } else if (paymentMethod === 'auto_pay_pkg1') {
        successMessage = `Paket-1: Bildirimli Otomatik Ödeme başarıyla tanımlandı. ${selectedPayment.amount} ₺ tahsil edildi (3D Secure Onaylandı). Gelecek aylarda ödeme öncesi onay SMS'i gönderilecektir.`;
      } else if (paymentMethod === 'auto_pay_pkg2') {
        successMessage = `Paket-2: Tam Otomatik Aylık Çekim başarıyla tanımlandı. İlk ödeme ${selectedPayment.amount} ₺ 3DS ile çekildi. Sonraki aidatlar Non-3D Secure olarak kartınızdan otomatik tahsil edilecektir.`;
      } else if (paymentMethod === 'cash') {
        if (isManager) {
          successMessage = `Nakit Ödeme: ${selectedPayment.amount} ₺ tutar elden teslim alındı ve fatura kapatıldı. (Teslim Alan: ${cashReceiver})`;
          nextStatus = 'Ödendi';
        } else {
          successMessage = `Elden Nakit Ödeme talebiniz yöneticiye iletilmiştir. Yönetici elden teslim aldığını onayladığında faturanız kapatılacaktır.`;
          nextStatus = 'Onay Bekliyor';
        }
      } else if (paymentMethod === 'eft_wire') {
        successMessage = `iyzico Korumalı Havale: Sanal IBAN (Açıklama Kodu: KOV-${selectedPayment.id}) ödemesi webhook entegrasyonu tarafından otomatik doğrulandı ve fatura kapatıldı.`;
      }

      setPayments(prev => prev.map(p => {
        if (p.id === selectedPayment.id) {
          return { 
            ...p, 
            status: nextStatus, 
            paymentDate: nextStatus === 'Ödendi' ? new Date().toLocaleDateString('tr-TR') : null,
            paymentMethodUsed: paymentMethod 
          };
        }
        return p;
      }));

      // Update stats only if the payment is finalized (status is 'Ödendi')
      if (nextStatus === 'Ödendi') {
        setStats(prev => ({
          ...prev,
          balance: prev.balance + selectedPayment.amount,
          monthlyIncome: prev.monthlyIncome + selectedPayment.amount
        }));
      }

      alert(successMessage);
      setSelectedPayment(null);
    }, 1200);
  };

  const approveCashPayment = (pay) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPayments(prev => prev.map(p => {
        if (p.id === pay.id) {
          return { 
            ...p, 
            status: 'Ödendi', 
            paymentDate: new Date().toLocaleDateString('tr-TR'),
            paymentMethodUsed: 'cash' 
          };
        }
        return p;
      }));

      setStats(prev => ({
        ...prev,
        balance: prev.balance + pay.amount,
        monthlyIncome: prev.monthlyIncome + pay.amount
      }));

      alert(`No ${pay.aptNumber} - ${pay.month} aidatının elden nakit alındığı onaylanmış ve fatura kapatılmıştır.`);
    }, 1000);
  };

  const handleBulkBilling = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(bulkAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const newPayments = [];
    apartments.forEach(apt => {
      if (apt.status !== 'Boş') {
        newPayments.push({
          id: Date.now() + Math.random(),
          aptNumber: apt.number,
          residentName: apt.residentName,
          amount: amountNum,
          month: bulkMonth,
          status: 'Ödenmedi',
          dueDate: '20.08.2026'
        });
      }
    });

    setPayments(prev => [...newPayments, ...prev]);
    alert(`${bulkMonth} dönemi için ${newPayments.length} daireye ${amountNum} ₺ aidat borçlandırması yapıldı.`);
    setActiveSubTab('debts');
  };

  const unpaidPayments = payments.filter(p => p.status === 'Ödenmedi' || p.status === 'Onay Bekliyor');
  const paidPayments = payments.filter(p => p.status === 'Ödendi');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Mini-subtabs */}
      <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', gap: '8px' }}>
        <button 
          className={`btn ${activeSubTab === 'debts' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => { setActiveSubTab('debts'); setSelectedPayment(null); }}
        >
          Aktif Aidat Borçları ({unpaidPayments.length})
        </button>
        <button 
          className={`btn ${activeSubTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => { setActiveSubTab('history'); setSelectedPayment(null); }}
        >
          Ödeme Geçmişi ({paidPayments.length})
        </button>
        <button 
          className={`btn ${activeSubTab === 'bulk' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => { setActiveSubTab('bulk'); setSelectedPayment(null); }}
        >
          Toplu Borçlandır
        </button>
      </div>

      <div className="dashboard-sections">
        {/* Left Side Lists */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          {activeSubTab === 'debts' && (
            <>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Ödenmemiş Aidat Faturaları</h3>
              {unpaidPayments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <CheckCircle size={40} style={{ color: 'var(--success)', marginBottom: '12px', opacity: '0.7' }} />
                  <p>Ödenmemiş aktif aidat borcu bulunmamaktadır!</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Daire</th>
                        <th>Sakin</th>
                        <th>Dönem</th>
                        <th>Son Ödeme</th>
                        <th>Tutar</th>
                        <th style={{ textAlign: 'right' }}>Aksiyon</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unpaidPayments.map(pay => (
                        <tr key={pay.id}>
                          <td><b>No {pay.aptNumber}</b></td>
                          <td>{pay.residentName}</td>
                          <td>
                            {pay.month}
                            {pay.status === 'Onay Bekliyor' && (
                              <span style={{ 
                                marginLeft: '8px', 
                                background: 'rgba(245, 158, 11, 0.15)', 
                                color: 'var(--warning)', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontSize: '10.5px',
                                fontWeight: '600'
                              }}>
                                Onay Bekliyor
                              </span>
                            )}
                          </td>
                          <td>
                            <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertCircle size={14} /> {pay.dueDate}
                            </span>
                          </td>
                          <td style={{ fontWeight: '600' }}>{pay.amount} ₺</td>
                          <td style={{ textAlign: 'right' }}>
                            {pay.status === 'Onay Bekliyor' ? (
                              (currentUser?.role === 'Yönetici' || currentUser?.role === 'Süper Admin') ? (
                                <button 
                                  className="btn btn-primary" 
                                  style={{ padding: '6px 12px', fontSize: '12px', background: 'var(--success)', borderColor: 'var(--success)' }} 
                                  onClick={() => approveCashPayment(pay)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? 'Onaylanıyor...' : 'Tahsilatı Onayla'}
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-secondary" 
                                  style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--text-muted)' }} 
                                  disabled
                                >
                                  Onay Bekleniyor
                                </button>
                              )
                            ) : (
                              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handlePayClick(pay)}>
                                <CreditCard size={14} /> {(currentUser?.role === 'Yönetici' || currentUser?.role === 'Süper Admin') ? 'Tahsil Et' : 'Öde'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeSubTab === 'history' && (
            <>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Geçmiş Ödemeler</h3>
              {paidPayments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <p>Henüz kayıtlı bir ödeme geçmişi bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Daire</th>
                        <th>Sakin</th>
                        <th>Dönem</th>
                        <th>Ödeme Tarihi</th>
                        <th>Tutar</th>
                        <th>Ödeme Yöntemi</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paidPayments.map(pay => (
                        <tr key={pay.id}>
                          <td><b>No {pay.aptNumber}</b></td>
                          <td>{pay.residentName}</td>
                          <td>{pay.month}</td>
                          <td>{pay.paymentDate}</td>
                          <td style={{ color: 'var(--success)', fontWeight: '600' }}>{pay.amount} ₺</td>
                          <td style={{ fontSize: '12.5px' }}>
                            {pay.paymentMethodUsed === 'credit_card' && 'Kredi Kartı (Tek Çekim)'}
                            {pay.paymentMethodUsed === 'registered_card' && 'Kayıtlı Kart'}
                            {pay.paymentMethodUsed === 'auto_pay_pkg1' && 'Otomatik (Paket-1)'}
                            {pay.paymentMethodUsed === 'auto_pay_pkg2' && 'Otomatik (Paket-2)'}
                            {pay.paymentMethodUsed === 'cash' && 'Nakit (Elden)'}
                            {pay.paymentMethodUsed === 'eft_wire' && 'iyzico Havale'}
                            {!pay.paymentMethodUsed && 'Kredi Kartı'}
                          </td>
                          <td>
                            <span className="status-badge badge-success">Ödendi</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeSubTab === 'bulk' && (
            <div style={{ maxWidth: '500px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', fontFamily: 'Outfit' }}>Toplu Aidat Borçlandırması Yap</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                Bu işlem, sistemde kayıtlı olan ve boş olmayan (Dolu veya Kiracı durumundaki) tüm dairelere belirtilen dönem için aidat borç faturası ekleyecektir.
              </p>
              <form onSubmit={handleBulkBilling}>
                <div className="form-group">
                  <label>Borçlandırılacak Dönem / Ay</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={bulkMonth}
                    onChange={(e) => setBulkMonth(e.target.value)}
                    placeholder="Örn: Ağustos 2026"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Aidat Tutarı (₺)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={bulkAmount}
                    onChange={(e) => setBulkAmount(e.target.value)}
                    placeholder="Tutar"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  <Plus size={16} /> Toplu Borçlandırmayı Başlat
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side Interaction Panel (Payment Interface) */}
        <div className="glass-panel" style={{ padding: '24px', height: 'fit-content', width: '100%', maxWidth: '440px' }}>
          {selectedPayment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>Ödeme Paneli</h3>
              
              {/* Debt Info */}
              <div style={{ background: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Daire / Sakin:</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>No {selectedPayment.aptNumber} - {selectedPayment.residentName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Borç Dönemi:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedPayment.month} Aidatı</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', borderTop: '1px solid var(--border-glass)', paddingTop: '6px', marginTop: '6px' }}>
                  <span>Toplam Borç:</span>
                  <span style={{ color: 'var(--accent-primary)' }}>{selectedPayment.amount} ₺</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Ödeme Yöntemi Seçiniz</label>
                <select 
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="credit_card">Kredi / Banka Kartı (Tek Çekim)</option>
                  <option value="registered_card">Kayıtlı Kart ile Hızlı Ödeme</option>
                  <option value="auto_pay_pkg1">Otomatik Ödeme - Paket 1 (Manuel + 3DS)</option>
                  <option value="auto_pay_pkg2">Otomatik Ödeme - Paket 2 (Tam Otomatik)</option>
                  <option value="eft_wire">EFT / Havale (iyzico Korumalı)</option>
                  <option value="cash">Nakit (Elden Tahsilat)</option>
                </select>
              </div>

              {/* Separator */}
              <div style={{ height: '1px', background: 'var(--border-subtle)' }}></div>

              {/* Interactive payment forms */}
              <form onSubmit={executePayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Method 1: Credit Card Single Payment */}
                {paymentMethod === 'credit_card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kart Sahibi Ad Soyad</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={cardHolder} 
                        onChange={(e) => setCardHolder(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kart Numarası</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="4355 •••• •••• 4321" 
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>S.K.T (AA/YY)</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="09/29" 
                          required
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>CVC / CVV</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          placeholder="•••" 
                          maxLength="3"
                          required
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '4px' }}>
                      <input 
                        type="checkbox" 
                        checked={use3DS} 
                        onChange={(e) => setUse3DS(e.target.checked)} 
                      />
                      3D Secure Güvenlik Onayı Kullan
                    </label>
                  </div>
                )}

                {/* Method 2: Registered Card (Tokenization) */}
                {paymentMethod === 'registered_card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Kayıtlı Kartlarım (Tokenized)</span>
                    {hasRegisteredCard ? (
                      <div style={{
                        background: 'var(--bg-surface-subtle)',
                        border: '1px solid var(--accent-primary)30',
                        borderRadius: '10px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Visa - Yapı Kredi Bankası</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>•••• •••• •••• 4321</span>
                        </div>
                        <span style={{ fontSize: '10px', color: 'var(--accent-primary)', background: 'var(--accent-primary)15', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                          Güvenli Token
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--danger)' }}>Kayıtlı kartınız bulunmamaktadır. Lütfen ilk ödemede kartınızı kaydedin.</span>
                    )}
                  </div>
                )}

                {/* Method 3: Auto Pay Pkg 1 */}
                {paymentMethod === 'auto_pay_pkg1' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                        Paket-1: Bildirimli Manuel Ödeme
                      </span>
                      <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        Her ay aidat borcu çıktığında SMS ve e-posta ile bildirim alırsınız. Tıklayıp şifresiz giriş yaptıktan sonra **her ödemede 3D Secure şifresi** girerek ödemeyi tamamlarsınız.
                      </p>
                    </div>
                    
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kart Numarası</label>
                      <input type="text" className="form-control" placeholder="4355 •••• •••• 4321" required />
                    </div>
                  </div>
                )}

                {/* Method 4: Auto Pay Pkg 2 */}
                {paymentMethod === 'auto_pay_pkg2' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                        Paket-2: Tam Otomatik Aylık Çekim
                      </span>
                      <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        Aidat faturası kesildiği gün kartınızdan otomatik tahsilat yapılır. **İlk ödemede 3D Secure** ile yetkilendirme yapılır, sonraki aylar **Non-3D** olarak sistem kartınızdan otomatik çekim gerçekleştirir.
                      </p>
                    </div>
                    
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kart Numarası</label>
                      <input type="text" className="form-control" placeholder="4355 •••• •••• 9988" required />
                    </div>
                  </div>
                )}

                {/* Method 5: Cash Payment */}
                {paymentMethod === 'cash' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {isManager ? 'Elden nakit ödeme doğrudan yönetici tarafından teslim alınarak sisteme manuel kapatılır.' : 'Nakit elden ödemeyi tercih ettiğinizde yöneticiye onay bildirimi gönderilir. Yönetici teslim aldığında fatura kapatılacaktır.'}
                    </div>
                    {isManager && (
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Elden Nakit Teslim Alan Yetkili</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          required 
                          value={cashReceiver}
                          onChange={(e) => setCashReceiver(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Method 6: EFT / Wire Transfer - iyzico Protected Transfer */}
                {paymentMethod === 'eft_wire' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      <strong>iyzico Korumalı Havale:</strong> Aşağıdaki sanal IBAN adresine havale yapabilirsiniz. Webhook entegrasyonu sayesinde ödemeniz ulaştığı anda sistem otomatik onay verecektir.
                    </div>
                    <div style={{ background: 'var(--bg-surface-subtle)', padding: '10px', borderRadius: '8px', fontSize: '12px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>Alıcı Adı</span>
                        <span style={{ fontWeight: '600' }}>iyzico Kovan Ödeme Altyapısı</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>Sanal IBAN (Size Özel)</span>
                        <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>TR91 0006 2000 0000 1234 5678 90</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>Gerekli Açıklama Kodu (Webhook Eşleşmesi için)</span>
                        <span style={{ fontWeight: '700', color: 'var(--accent-primary)', fontFamily: 'monospace' }}>KOV-{selectedPayment.id}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flexGrow: 1, justifyContent: 'center' }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                    ) : (
                      <>
                        {paymentMethod === 'eft_wire' ? 'EFT Gönderildi Bildir (Simüle Et)' : ''}
                        {paymentMethod === 'cash' ? (isManager ? 'Elden Nakit Tahsil Et' : 'Yöneticiye Nakit Bildirimi Gönder') : ''}
                        {paymentMethod === 'auto_pay_pkg1' ? 'Paket-1 Tanımla & Öde' : ''}
                        {paymentMethod === 'auto_pay_pkg2' ? 'Paket-2 Tanımla & Öde' : ''}
                        {paymentMethod === 'credit_card' && `${selectedPayment.amount} ₺ Güvenli Ödeme Yap`}
                        {paymentMethod === 'registered_card' && 'Kayıtlı Kartla Tek Tıkla Öde'}
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setSelectedPayment(null)}
                    disabled={isProcessing}
                  >
                    İptal
                  </button>
                </div>

              </form>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <DollarSign size={40} style={{ marginBottom: '12px', opacity: '0.5', color: 'var(--success)' }} />
              <p style={{ fontSize: '14px' }}>
                Borç listesindeki herhangi bir faturayı tahsil etmek veya ödeme yöntemlerini denemek için tablodaki <b>Öde</b> butonuna tıklayınız.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
