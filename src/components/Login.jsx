import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Shield, 
  User, 
  KeyRound, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Lock,
  Smartphone,
  MessageSquareCode,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Check,
  Sun,
  Moon
} from 'lucide-react';

export default function Login({ onLogin, theme = 'light', toggleTheme }) {
  const isDark = theme === 'dark';
  // Main view: 'login' or 'register'
  const [activeTab, setActiveTab] = useState('login'); 
  // Login method: 'password' or 'otp'
  const [method, setMethod] = useState('password');

  // Password Login Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login Fields
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('7428');
  const [countdown, setCountdown] = useState(60);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [siteCode, setSiteCode] = useState('');
  const [isSiteVerified, setIsSiteVerified] = useState(false);
  const [verifiedSite, setVerifiedSite] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState('A Blok');
  const [selectedUnit, setSelectedUnit] = useState('Daire 1');
  const [verificationError, setVerificationError] = useState('');

  // OTP Countdown
  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, countdown]);

  const siteMapping = {
    'DB123': { id: 1, name: 'Kovan Sitesi' },
    'MK456': { id: 2, name: 'MaviKule Rezidans' },
    'YA789': { id: 3, name: 'Yıldız Apartmanı' }
  };

  const handleMethodSwitch = (newMethod) => {
    setMethod(newMethod);
    setError('');
    setOtpSent(false);
    setOtpCode('');
  };

  // Helper to normalize Turkish email strings for comparison
  const normalizeEmail = (str) => {
    if (!str) return '';
    return str.trim().toLowerCase().replace(/ı/g, 'i');
  };

  // 1. Password Login Handler
  const handleSubmitPasswordLogin = (e) => {
    e.preventDefault();
    setError('');

    const inputEmail = email.trim();
    const inputPass = password.trim();

    if (!inputEmail) {
      setError('Lütfen e-posta adresinizi giriniz.');
      return;
    }
    if (!inputPass) {
      setError('Lütfen şifrenizi giriniz.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const normEmail = normalizeEmail(inputEmail);

      // 1. Admin Girişi (admin@kovan.com / Kovan.123456)
      if (
        (normEmail === 'admin@kovan.com' || normEmail === 'admin') &&
        (inputPass === 'Kovan.123456' || inputPass.toLowerCase() === 'kovan.123456')
      ) {
        onLogin({
          role: 'Yönetici',
          name: 'Reyhan Demir (Yönetici)',
          email: 'admin@kovan.com',
          apartment: 'Yönetim Kurulu'
        });
        return;
      }

      // 2. Sakin Girişi (ahmetyılmaz@hotmail.com / Ahmet.123456)
      if (
        (normEmail === 'ahmetyilmaz@hotmail.com' || normEmail === 'ahmetyilmaz' || normEmail === 'ahmet' || inputEmail.toLowerCase() === 'ahmetyılmaz@hotmail.com') &&
        (inputPass === 'Ahmet.123456' || inputPass.toLowerCase() === 'ahmet.123456')
      ) {
        onLogin({
          role: 'Kat Sakini',
          name: 'Ahmet Yılmaz',
          email: 'ahmetyılmaz@hotmail.com',
          phone: '0532 999 88 11',
          apartment: 'Daire 1'
        });
        return;
      }

      // 3. Sistemde sonradan kayıt olan sakinleri kontrol et (localStorage kovan_users)
      const registeredUsers = JSON.parse(localStorage.getItem('kovan_users') || '[]');
      const matchedUser = registeredUsers.find(u => normalizeEmail(u.email) === normEmail);
      if (matchedUser && (inputPass === '123456' || inputPass.length >= 4)) {
        onLogin({
          role: matchedUser.role || 'Kat Sakini',
          name: matchedUser.name,
          email: matchedUser.email,
          phone: matchedUser.phone,
          apartment: matchedUser.apartment || 'Daire 1'
        });
        return;
      }

      // Hatalı Bilgi
      setError('Hatalı e-posta adresi veya şifre girdiniz! Lütfen bilgilerinizi kontrol ediniz.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 350);
  };

  // 2. OTP Send Code Handler
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Lütfen cep telefonu numaranızı giriniz.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setOtpCode(code); // Simülasyon kolaylığı için otomatik doldur
      setOtpSent(true);
      setCountdown(60);
      setIsLoading(false);
    }, 400);
  };

  // 3. OTP Verify Code Handler
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode !== generatedOtp) {
      setError('Doğrulama kodu hatalı! Lütfen tekrar kontrol edin.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Admin telefonu kontrolü
      if (cleanPhone.includes('1002030')) {
        onLogin({
          role: 'Yönetici',
          name: 'Reyhan Demir (Yönetici)',
          email: 'admin@kovan.com',
          phone: phone,
          apartment: 'Yönetim Kurulu'
        });
      } else {
        // Sakin Ahmet Yılmaz
        onLogin({
          role: 'Kat Sakini',
          name: 'Ahmet Yılmaz',
          email: 'ahmetyılmaz@hotmail.com',
          phone: phone || '0532 999 88 11',
          apartment: 'Daire 1'
        });
      }
    }, 350);
  };

  // Registration Handlers
  const handleVerifySiteCode = () => {
    setVerificationError('');
    const matchedSite = siteMapping[siteCode.trim().toUpperCase()];
    if (matchedSite) {
      setIsSiteVerified(true);
      setVerifiedSite(matchedSite);
    } else {
      setIsSiteVerified(false);
      setVerifiedSite(null);
      setVerificationError('Geçersiz site kodu! Lütfen yöneticinizden aldığınız kodu kontrol edin.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!isSiteVerified || !verifiedSite) {
      setVerificationError('Lütfen kayıt işleminden önce site kodunuzu doğrulayın.');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('kovan_users') || '[]');
    if (registeredUsers.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setError('Bu e-posta adresi ile daha önce kayıt olunmuş!');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: regName,
      email: regEmail.trim().toLowerCase(),
      phone: regPhone,
      role: 'Kat Sakini',
      apartment: `${selectedBlock} - ${selectedUnit}`,
      siteId: verifiedSite.id,
      siteName: verifiedSite.name,
      status: 'Aktif',
      lastLogin: '-'
    };

    registeredUsers.push(newUser);
    localStorage.setItem('kovan_users', JSON.stringify(registeredUsers));

    alert('Kayıt işleminiz başarıyla tamamlandı! Artık giriş yapabilirsiniz.');
    setEmail(newUser.email);
    setActiveTab('login');
  };

  const c = {
    pageBg: isDark ? '#191A1E' : '#F1F4F8',
    glow1: isDark ? 'rgba(205, 166, 91, 0.12)' : 'rgba(205, 166, 91, 0.08)',
    glow2: isDark ? 'rgba(77, 77, 77, 0.25)' : 'rgba(77, 77, 77, 0.06)',
    cardBg: isDark ? '#232429' : '#FFFFFF',
    cardShadow: isDark ? '0 24px 60px rgba(0, 0, 0, 0.55)' : '0 20px 45px rgba(0, 0, 0, 0.07)',
    cardBorder: isDark ? '1.5px solid rgba(205, 166, 91, 0.35)' : '1px solid rgba(205, 166, 91, 0.35)',
    headerBg: isDark ? 'linear-gradient(180deg, #2D2E35 0%, #202126 100%)' : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
    headerSub: isDark ? '#A0A2AC' : '#64748B',
    demoBarBg: isDark ? '#1E1F24' : '#F8FAFC',
    demoBorder: isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0',
    demoBtnBg: isDark ? '#2A2B32' : '#FFFFFF',
    demoBtnBorder: isDark ? '#4D4D4D' : '#CBD5E1',
    demoBtnText: isDark ? '#E0E2EC' : '#334155',
    tabBarBg: isDark ? '#1A1B20' : '#F1F5F9',
    tabBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
    tabActiveBg: isDark ? '#232429' : '#FFFFFF',
    tabInactiveText: isDark ? '#8E909B' : '#64748B',
    methodInactiveBg: isDark ? '#1C1D22' : '#F8FAFC',
    methodInactiveBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
    methodInactiveText: isDark ? '#A0A2AC' : '#64748B',
    roleInactiveBg: isDark ? '#1C1D22' : '#F8FAFC',
    roleInactiveBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
    roleInactiveText: isDark ? '#A0A2AC' : '#64748B',
    labelColor: isDark ? '#A0A2AC' : '#475569',
    inputBg: isDark ? '#191A1E' : '#FFFFFF',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : '#CBD5E1',
    inputText: isDark ? '#FFFFFF' : '#1E293B',
    placeholder: isDark ? '#6A6D7A' : '#94A3B8',
    hintColor: isDark ? '#8E909B' : '#64748B'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: c.pageBg,
      transition: 'background-color 0.25s ease'
    }}>
      {/* Theme Toggle Button */}
      {toggleTheme && (
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '24px',
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(205, 166, 91, 0.3)' : '1px solid rgba(205, 166, 91, 0.4)',
            color: isDark ? '#CDA65B' : '#B68B35',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            zIndex: 10,
            fontWeight: 600,
            fontSize: '13px',
            transition: 'all 0.2s ease'
          }}
          title={isDark ? 'Açık Moda Geç (Gündüz Modu)' : 'Koyu Moda Geç (Gece Modu)'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDark ? 'Açık Mod' : 'Koyu Mod'}</span>
        </button>
      )}

      {/* Background Architectural Glows in KOVAN Gold & Charcoal */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '350px',
        height: '350px',
        background: c.glow1,
        filter: 'blur(120px)',
        borderRadius: '50%',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '350px',
        height: '350px',
        background: c.glow2,
        filter: 'blur(120px)',
        borderRadius: '50%',
        zIndex: 0
      }}></div>

      {/* Main Card Container */}
      <div 
        className={shake ? 'shake-element' : ''}
        style={{
          width: '100%',
          maxWidth: '470px',
          backgroundColor: c.cardBg,
          borderRadius: '18px',
          boxShadow: c.cardShadow,
          border: c.cardBorder,
          overflow: 'hidden',
          zIndex: 1,
          transition: 'background-color 0.25s ease, box-shadow 0.25s ease'
        }}
      >
        {/* KOVAN Logo Header */}
        <div style={{
          background: c.headerBg,
          padding: '28px 24px 20px',
          textAlign: 'center',
          borderBottom: '3px solid #CDA65B'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <img 
              src="/kovan-logo.png" 
              alt="KOVAN Logo" 
              style={{ height: '78px', objectFit: 'contain' }} 
            />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'Outfit', color: '#CDA65B', letterSpacing: '0.12em', margin: 0 }}>
            KOVAN
          </h2>
          <p style={{ fontSize: '0.8rem', color: c.headerSub, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px' }}>
            Site ve Apartman Yönetim Sistemi
          </p>
        </div>

        {/* Tab Selection: Giriş Yap vs Kayıt Ol */}
        <div style={{
          display: 'flex',
          background: c.tabBarBg,
          borderBottom: `1px solid ${c.tabBorder}`
        }}>
          <button
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'login' ? c.tabActiveBg : 'transparent',
              color: activeTab === 'login' ? '#CDA65B' : c.tabInactiveText,
              borderBottom: activeTab === 'login' ? '3px solid #CDA65B' : '3px solid transparent',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            Giriş Yap
          </button>
          <button
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'register' ? c.tabActiveBg : 'transparent',
              color: activeTab === 'register' ? '#CDA65B' : c.tabInactiveText,
              borderBottom: activeTab === 'register' ? '3px solid #CDA65B' : '3px solid transparent',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
            onClick={() => { setActiveTab('register'); setError(''); }}
          >
            Yeni Sakin Kaydı
          </button>
        </div>

        {/* LOGIN TAB CONTENT */}
        {activeTab === 'login' && (
          <div>
            {/* Primary Login Method Switcher: E-posta & Şifre VS OTP */}
            <div style={{ padding: '16px 24px 0', display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleMethodSwitch('password')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: method === 'password' ? '1.5px solid #CDA65B' : `1px solid ${c.methodInactiveBorder}`,
                  background: method === 'password' ? (isDark ? 'rgba(205, 166, 91, 0.15)' : 'rgba(205, 166, 91, 0.12)') : c.methodInactiveBg,
                  color: method === 'password' ? '#CDA65B' : c.methodInactiveText,
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Lock size={15} />
                <span>E-posta & Şifre</span>
              </button>

              <button
                type="button"
                onClick={() => handleMethodSwitch('otp')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: method === 'otp' ? '1.5px solid #CDA65B' : `1px solid ${c.methodInactiveBorder}`,
                  background: method === 'otp' ? (isDark ? 'rgba(205, 166, 91, 0.15)' : 'rgba(205, 166, 91, 0.12)') : c.methodInactiveBg,
                  color: method === 'otp' ? '#CDA65B' : c.methodInactiveText,
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Smartphone size={15} />
                <span>SMS / OTP ile Giriş</span>
              </button>
            </div>

            {/* Forms Area */}
            <div style={{ padding: '16px 24px 24px' }}>
              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: '8px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px'
                }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* METHOD 1: E-POSTA & ŞİFRE İLE GİRİŞ */}
              {method === 'password' && (
                <form onSubmit={handleSubmitPasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: c.labelColor, marginBottom: '5px' }}>
                      E-posta Adresi veya Kullanıcı Adı
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: isDark ? '#6A6D7A' : '#94A3B8' }} />
                      <input 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ad@kovan.com"
                        style={{
                          width: '100%',
                          padding: '11px 12px 11px 38px',
                          background: c.inputBg,
                          border: `1px solid ${c.inputBorder}`,
                          borderRadius: '8px',
                          color: c.inputText,
                          fontSize: '14px'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: c.labelColor, marginBottom: '5px' }}>
                      Şifre
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: isDark ? '#6A6D7A' : '#94A3B8' }} />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          padding: '11px 38px 11px 38px',
                          background: c.inputBg,
                          border: `1px solid ${c.inputBorder}`,
                          borderRadius: '8px',
                          color: c.inputText,
                          fontSize: '14px'
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          color: c.hintColor,
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: c.hintColor, cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: '#CDA65B' }} />
                      <span>Beni Hatırla</span>
                    </label>
                    <span 
                      onClick={() => alert('Şifre sıfırlama bağlantısı kayıtlı e-posta adresinize iletildi.')} 
                      style={{ color: '#CDA65B', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Şifremi Unuttum?
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      height: '44px',
                      background: 'linear-gradient(135deg, #CDA65B 0%, #B69146 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(205, 166, 91, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '4px'
                    }}
                  >
                    <KeyRound size={16} />
                    <span>{isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
                  </button>
                </form>
              )}

              {/* METHOD 2: SMS / OTP İLE GİRİŞ */}
              {method === 'otp' && (
                <div>
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <p style={{ fontSize: '13px', color: c.labelColor, lineHeight: 1.5, margin: 0 }}>
                        Kayıtlı cep telefonunuza tek kullanımlık 4 haneli SMS doğrulama kodu gönderilecektir.
                      </p>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: c.labelColor, marginBottom: '5px' }}>
                          Cep Telefonu Numarası
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Smartphone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: isDark ? '#6A6D7A' : '#94A3B8' }} />
                          <input 
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="05XX XXX XX XX"
                            style={{
                              width: '100%',
                              padding: '11px 12px 11px 38px',
                              background: c.inputBg,
                              border: `1px solid ${c.inputBorder}`,
                              borderRadius: '8px',
                              color: c.inputText,
                              fontSize: '14px'
                            }}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          height: '44px',
                          background: 'linear-gradient(135deg, #CDA65B 0%, #B69146 100%)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(205, 166, 91, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          marginTop: '6px'
                        }}
                      >
                        <MessageSquareCode size={16} />
                        <span>{isLoading ? 'Kod Gönderiliyor...' : 'Doğrulama Kodu Gönder'}</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* SMS Simulation Card */}
                      <div style={{
                        padding: '12px',
                        background: isDark ? 'rgba(205, 166, 91, 0.12)' : 'rgba(205, 166, 91, 0.12)',
                        border: '1.5px solid rgba(205, 166, 91, 0.35)',
                        borderRadius: '8px'
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#CDA65B', textTransform: 'uppercase' }}>
                          💬 Gelen SMS Mesajı (Simülasyon)
                        </div>
                        <div style={{ fontSize: '14px', color: isDark ? '#FFFFFF' : '#1E293B', fontWeight: 700, marginTop: '3px' }}>
                          KOVAN Doğrulama Kodunuz: <span style={{ color: '#CDA65B', letterSpacing: '0.15em', fontSize: '16px' }}>{generatedOtp}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', color: c.labelColor, textAlign: 'center', margin: 0 }}>
                        <strong>{phone}</strong> nolu hatta gönderilen 4 haneli kodu giriniz:
                      </p>

                      <input 
                        type="text"
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          padding: '10px',
                          background: c.inputBg,
                          border: '1.5px solid #CDA65B',
                          borderRadius: '8px',
                          color: isDark ? '#FFFFFF' : '#1E293B',
                          fontSize: '24px',
                          fontWeight: '800',
                          letterSpacing: '0.3em'
                        }}
                        required
                        autoFocus
                      />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <span 
                          onClick={() => setOtpSent(false)} 
                          style={{ color: c.hintColor, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Numarayı Değiştir
                        </span>

                        <span
                          onClick={() => {
                            if (countdown === 0) {
                              const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                              setGeneratedOtp(newCode);
                              setOtpCode(newCode);
                              setCountdown(60);
                            }
                          }}
                          style={{ 
                            color: countdown > 0 ? (isDark ? '#6A6D7A' : '#94A3B8') : '#CDA65B', 
                            cursor: countdown > 0 ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 600
                          }}
                        >
                          <RotateCcw size={13} />
                          <span>{countdown > 0 ? `Tekrar Gönder (${countdown}s)` : 'Tekrar Kod Gönder'}</span>
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || otpCode.length !== 4}
                        style={{
                          width: '100%',
                          height: '44px',
                          background: 'linear-gradient(135deg, #CDA65B 0%, #B69146 100%)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(205, 166, 91, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <ArrowRight size={16} />
                        <span>{isLoading ? 'Doğrulanıyor...' : 'Doğrula ve Giriş Yap'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* REGISTER TAB CONTENT */}
        {activeTab === 'register' && (
          <div style={{ padding: '20px 24px 24px' }}>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: c.labelColor, marginBottom: '5px' }}>
                  Site Kodu Doğrulama
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text"
                    value={siteCode}
                    onChange={(e) => setSiteCode(e.target.value)}
                    placeholder="Örn: DB123"
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      background: c.inputBg,
                      border: `1px solid ${c.inputBorder}`,
                      borderRadius: '8px',
                      color: c.inputText,
                      fontSize: '13px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifySiteCode}
                    style={{
                      padding: '10px 16px',
                      background: '#4D4D4D',
                      color: '#CDA65B',
                      border: '1px solid #CDA65B',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Doğrula
                  </button>
                </div>
                {verificationError && <span style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{verificationError}</span>}
                {isSiteVerified && <span style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', display: 'block' }}>✓ {verifiedSite.name} doğrulandı</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: c.labelColor, marginBottom: '5px' }}>
                  Ad Soyad
                </label>
                <input 
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: c.inputBg,
                    border: `1px solid ${c.inputBorder}`,
                    borderRadius: '8px',
                    color: c.inputText,
                    fontSize: '13px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: c.labelColor, marginBottom: '5px' }}>
                  E-posta
                </label>
                <input 
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="ornek@kovan.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: c.inputBg,
                    border: `1px solid ${c.inputBorder}`,
                    borderRadius: '8px',
                    color: c.inputText,
                    fontSize: '13px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: c.labelColor, marginBottom: '5px' }}>
                  Telefon
                </label>
                <input 
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: c.inputBg,
                    border: `1px solid ${c.inputBorder}`,
                    borderRadius: '8px',
                    color: c.inputText,
                    fontSize: '13px'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: c.labelColor, marginBottom: '5px' }}>
                    Blok
                  </label>
                  <select
                    value={selectedBlock}
                    onChange={(e) => setSelectedBlock(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: c.inputBg,
                      border: `1px solid ${c.inputBorder}`,
                      borderRadius: '8px',
                      color: c.inputText,
                      fontSize: '13px'
                    }}
                  >
                    <option value="A Blok">A Blok</option>
                    <option value="B Blok">B Blok</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: c.labelColor, marginBottom: '5px' }}>
                    Daire
                  </label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: c.inputBg,
                      border: `1px solid ${c.inputBorder}`,
                      borderRadius: '8px',
                      color: c.inputText,
                      fontSize: '13px'
                    }}
                  >
                    <option value="Daire 1">Daire 1</option>
                    <option value="Daire 2">Daire 2</option>
                    <option value="Daire 3">Daire 3</option>
                    <option value="Daire 4">Daire 4</option>
                    <option value="Daire 5">Daire 5</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  height: '44px',
                  background: 'linear-gradient(135deg, #CDA65B 0%, #B69146 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '6px'
                }}
              >
                Kaydı Tamamla
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
