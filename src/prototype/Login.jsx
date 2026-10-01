import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Home,
  Building2,
  Smartphone,
  Lock,
  RotateCcw,
  AlertCircle,
  Phone,
  KeyRound,
  Users,
  CheckCircle2,
  Info,
  Shield,
  Scale,
  User,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Brand, Button, Field, ThemeToggle, Modal } from "./UI";
import {
  ForgotPasswordModal,
  ManagerRegisterWizard,
  InvitationRegisterModal,
  TermsAndPrivacyModal,
} from "./AuthModal";

// Binaların Pencerelerinde Sıcak Sarı ve Yanıp Sönen Işıklar (Mimari Efekt)
function BuildingsGraphic({ className = "" }) {
  const getWindowLitClass = (buildingNum, index) => {
    // 1. Bina (24 pencere)
    if (buildingNum === 1) {
      if ([2, 10, 18].includes(index)) return "lit-steady";
      if ([5, 14].includes(index)) return "lit-twinkle-1";
      if ([7, 21].includes(index)) return "lit-twinkle-2";
      if ([11, 23].includes(index)) return "lit-twinkle-3";
      return "";
    }
    // 2. Bina (32 pencere - Ana Kule)
    if (buildingNum === 2) {
      if ([3, 11, 19, 27].includes(index)) return "lit-steady";
      if ([6, 17, 25].includes(index)) return "lit-twinkle-1";
      if ([9, 22, 30].includes(index)) return "lit-twinkle-2";
      if ([14, 28].includes(index)) return "lit-twinkle-3";
      if ([1, 20].includes(index)) return "lit-twinkle-4";
      return "";
    }
    // 3. Bina (20 pencere)
    if (buildingNum === 3) {
      if ([1, 9, 17].includes(index)) return "lit-steady";
      if ([4, 13].includes(index)) return "lit-twinkle-1";
      if ([8, 16].includes(index)) return "lit-twinkle-2";
      if ([12, 19].includes(index)) return "lit-twinkle-4";
      return "";
    }
    return "";
  };

  return (
    <div className={`architecture ${className}`} aria-hidden="true">
      <div className="building building-one">
        {Array.from({ length: 24 }, (_, i) => (
          <i key={i} className={getWindowLitClass(1, i)} />
        ))}
      </div>
      <div className="building building-two">
        {Array.from({ length: 32 }, (_, i) => (
          <i key={i} className={getWindowLitClass(2, i)} />
        ))}
      </div>
      <div className="building building-three">
        {Array.from({ length: 20 }, (_, i) => (
          <i key={i} className={getWindowLitClass(3, i)} />
        ))}
      </div>
      <span className="architecture-caption">
        KOVAN SİTESİ <span>03 BLOK / 48 DAİRE</span>
      </span>
    </div>
  );
}

export default function Login({
  onLogin,
  theme,
  onToggleTheme,
  users = [],
  units = [],
  onManagerRegister,
  onInviteAcceptExisting,
  onInviteRegisterNew,
  onNotify,
  onNavigateTanitim,
}) {
  const [loginMethod, setLoginMethod] = useState("password"); // 'password' | 'otp'
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  // Şifresiz OTP Giriş Durumları
  const [otpStep, setOtpStep] = useState(1); // 1: Telefon/Eposta, 2: Kod
  const [otpTarget, setOtpTarget] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [otpError, setOtpError] = useState("");

  // Auth Modalları
  const [authModal, setAuthModal] = useState(null); // 'forgot' | 'wizard' | 'invite' | 'accountSwitch'
  const [inviteData, setInviteData] = useState({ email: "", unitId: "", isLocked: false });

  // URL parametresi ile davet bağlantısı kontrolü (BMS-140)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      const unitParam = params.get("unit");
      if (emailParam || unitParam || params.get("invite")) {
        setInviteData({
          email: emailParam || "",
          unitId: unitParam || "",
          isLocked: Boolean(emailParam),
        });
        setAuthModal("invite");
      }
    } catch {
      // ignore
    }
  }, []);

  const fill = (value) => {
    setIdentifier(value);
    setPassword("demo123");
    setLoginMethod("password");
  };

  // Demo Hesap Açılır Menüsü Durumu & Dış Tıklama Dinleyicisi
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const demoDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (demoDropdownRef.current && !demoDropdownRef.current.contains(e.target)) {
        setDemoDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const demoAccounts = [
    {
      email: "yonetim@site.com",
      name: "Mehmet Demir",
      role: "Site Yöneticisi & Başkan",
      unit: "Yönetim Ofisi",
      badge: "Yönetici",
      chipClass: "admin",
      icon: Building2,
    },
    {
      email: "burak.maydan@site.com",
      name: "Burak Maydan",
      role: "Yönetim Kurulu Üyesi",
      unit: "Daire B-7",
      badge: "Yönetim",
      chipClass: "board",
      icon: Home,
    },
    {
      email: "ahmet.yilmaz@site.com",
      name: "Ahmet Yılmaz",
      role: "Kat Maliki (Sakin)",
      unit: "Daire A-12",
      badge: "Kat Maliki",
      chipClass: "resident",
      icon: Home,
    },
    {
      email: "av.selin@hukuk.com",
      name: "Av. Selin Erdem",
      role: "Hukuk Müşaviri",
      unit: "Daire C-2",
      badge: "Hukuk",
      chipClass: "legal",
      icon: Scale,
    },
  ];

  // OTP Geri Sayım Sayacı
  useEffect(() => {
    let interval = null;
    if (loginMethod === "otp" && otpStep === 2 && otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loginMethod, otpStep, otpCountdown]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!otpTarget.trim()) return;
    setOtpStep(2);
    setOtpCountdown(60);
    setOtpError("");
    onNotify?.(`${otpTarget} numarasına / adresine 6 haneli giriş kodu iletildi.`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const entered = otpDigits.join("");
    if (entered === "123456" || entered.length === 6) {
      setOtpError("");
      onNotify?.("Giriş kodu doğrulandı, yönlendiriliyorsunuz...");
      onLogin(otpTarget);
    } else {
      setOtpError("Hatalı doğrulama kodu! Lütfen 6 haneli kodu kontrol ediniz.");
    }
  };

  return (
    <main className="login-page">
      {/* MOBİL ÜST BAR (Yalnızca mobilde görünür, sayfa kaymasını önler) */}
      <div className="mobile-header-bar mobile-only">
        <Brand />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      {/* MOBİLDE GÜÇLÜ MİMARİ ARKA PLAN (Yanıp sönen sarı pencere ışıkları) */}
      <div className="mobile-architecture-backdrop mobile-only" aria-hidden="true">
        <BuildingsGraphic className="mobile-arch" />
      </div>

      {/* MASAÜSTÜ SOL HİKAYE BÖLÜMÜ */}
      <section className="login-story desktop-only">
        <Brand />
        <div className="story-copy">
          <span className="eyebrow">KONUT & SİTE YÖNETİMİ</span>
          <h1>
            Birlikte yaşamak.
            <br />
            Kolayca yönetmek.
          </h1>
          <p>
            Aidattan günlük taleplere, sitenizle ilgili
            <br className="desktop-only" /> her şey tek bir yerde.
          </p>
        </div>

        {/* Masaüstü Mimari Binalar */}
        <BuildingsGraphic />

        <div className="story-footer">
          <span>Yaşamın düzeni, kovan.</span>
          <span>İstanbul · Ataşehir</span>
        </div>
      </section>

      {/* SAĞ FORM ALANI (Web & Mobil: Sayfa kaydırması kaldırılmış, klavye uyumlu) */}
      <section className="login-form-area">
        <div className="login-top-actions desktop-only">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <div className="login-form-wrap">
          <span className="eyebrow">KOVAN’A HOŞ GELDİNİZ</span>
          <h2>Sitenize giriş yapın.</h2>
          <p className="login-intro">Yaşam alanınızla bağlantıda kalın.</p>

          {/* 1. SEÇENEK: ŞİFRE İLE GİRİŞ FORMU */}
          {loginMethod === "password" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (identifier.trim() && password.trim()) onLogin(identifier);
              }}
            >
              <div className="field">
                <span>E-posta</span>
                <input
                  autoFocus
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="E-posta adresinizi girin"
                />
              </div>

              <div className="field">
                <div className="field-label-split">
                  <span>Şifre</span>
                  <button
                    type="button"
                    className="forgot-link-inline"
                    onClick={() => setAuthModal("forgot")}
                  >
                    Şifremi unuttum
                  </button>
                </div>
                <div className="password-field">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type={visible ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Şifrenizi girin"
                  />
                  <button
                    type="button"
                    aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button className="login-submit" type="submit">
                Giriş Yap
                <ArrowRight size={18} />
              </Button>

              <button
                type="button"
                className="login-otp-switch-btn"
                onClick={() => {
                  setLoginMethod("otp");
                  if (identifier && !otpTarget) setOtpTarget(identifier);
                }}
              >
                <Smartphone size={15} />
                <span>Şifresiz OTP ile Giriş</span>
              </button>
            </form>
          )}

          {/* 2. SEÇENEK: ŞİFRESİZ OTP İLE GİRİŞ FORMU */}
          {loginMethod === "otp" && (
            <div className="otp-login-area">
              {otpStep === 1 ? (
                <form onSubmit={handleSendOtp}>
                  <p className="otp-explainer-text">
                    Şifrenizi hatırlamanıza gerek yok. Kayıtlı telefon veya e-postanıza 6 haneli tek kullanımlık giriş kodu göndereceğiz.
                  </p>
                  <Field label="Telefon Numarası veya E-posta">
                    <div className="input-with-icon">
                      <Phone size={16} className="field-icon" />
                      <input
                        autoFocus
                        required
                        value={otpTarget}
                        onChange={(e) => setOtpTarget(e.target.value)}
                        placeholder="0532 555 11 00 veya ahmet.yilmaz@site.com"
                      />
                    </div>
                  </Field>
                  <Button className="login-submit" type="submit">
                    Tek Kullanımlık Kod Gönder
                    <ArrowRight size={18} />
                  </Button>
                  <button
                    type="button"
                    className="login-otp-switch-btn"
                    onClick={() => setLoginMethod("password")}
                  >
                    <Lock size={14} />
                    <span>Şifre ile Giriş Yap</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div className="otp-verify-header">
                    <span>Giriş Kodu Gönderildi:</span>
                    <strong>{otpTarget}</strong>
                  </div>

                  <div className="otp-container">
                    {otpDigits.map((digit, i) => (
                      <input
                        key={i}
                        id={`login-otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        className="otp-box"
                        autoFocus={i === 0}
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = [...otpDigits];
                          next[i] = val;
                          setOtpDigits(next);
                          if (val && i < 5) {
                            document.getElementById(`login-otp-${i + 1}`)?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
                            document.getElementById(`login-otp-${i - 1}`)?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div className="auth-error-msg">
                      <AlertCircle size={15} /> {otpError}
                    </div>
                  )}

                  <div className="otp-timer-row">
                    {otpCountdown > 0 ? (
                      <span className="otp-countdown-muted">
                        Kalan Süre: <strong>{otpCountdown} sn</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="resend-otp-btn"
                        onClick={() => {
                          setOtpCountdown(60);
                          onNotify?.("Yeni kod gönderildi.");
                        }}
                      >
                        <RotateCcw size={14} /> Tekrar Kod Gönder
                      </button>
                    )}
                    <button
                      type="button"
                      className="change-target-btn"
                      onClick={() => setOtpStep(1)}
                    >
                      Numarayı Değiştir
                    </button>
                  </div>

                  <Button className="login-submit mt-3" type="submit">
                    Doğrula & Giriş Yap
                    <ArrowRight size={18} />
                  </Button>
                  <button
                    type="button"
                    className="login-otp-switch-btn"
                    onClick={() => {
                      setLoginMethod("password");
                      setOtpStep(1);
                    }}
                  >
                    <Lock size={14} />
                    <span>Şifre ile Giriş Yap</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* YENİ KAYIT & DAVETİYE KÖPRÜLERİ (ZARİF & SADE) */}
          <div className="login-onboarding-row">
            <span className="onboarding-prompt">Hesabınız yok mu?</span>
            <div className="onboarding-links">
              <button
                type="button"
                className="onboarding-link-btn"
                onClick={() => setAuthModal("wizard")}
              >
                <Building2 size={13} className="text-gold" />
                <span>Site Kurulumu Yap</span>
              </button>
              <span className="link-divider">•</span>
              <button
                type="button"
                className="onboarding-link-btn"
                onClick={() => setAuthModal("invite")}
              >
                <KeyRound size={13} className="text-gold" />
                <span>Katılım Kodu Gir</span>
              </button>
            </div>
          </div>

          {/* HIZLI DEMO HESABI AÇILIR SEÇİCİSİ */}
          <div className="demo-selector-container" ref={demoDropdownRef}>
            <div className="demo-separator">
              <span>veya test için</span>
            </div>

            <div className="demo-dropdown-wrapper">
              <button
                type="button"
                className={`demo-dropdown-trigger ${demoDropdownOpen ? "active" : ""}`}
                onClick={() => setDemoDropdownOpen((prev) => !prev)}
                aria-expanded={demoDropdownOpen}
              >
                <div className="demo-trigger-left">
                  <Zap size={14} className="text-gold" />
                  <span className="demo-trigger-title">Hızlı Demo Hesabı ile Giriş Yap</span>
                </div>
                <ChevronDown
                  size={15}
                  className={`demo-trigger-chevron ${demoDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {demoDropdownOpen && (
                <div className="demo-dropdown-menu">
                  <div className="demo-dropdown-hint">
                    Giriş yapmak istediğiniz demo hesabı seçin:
                  </div>
                  <div className="demo-accounts-stack">
                    {demoAccounts.map((acc) => {
                      const IconComp = acc.icon;
                      return (
                        <button
                          key={acc.email}
                          type="button"
                          className="demo-account-row"
                          onClick={() => {
                            setIdentifier(acc.email);
                            setPassword("demo123");
                            setLoginMethod("password");
                            setDemoDropdownOpen(false);
                            onNotify?.(`${acc.name} (${acc.role}) ile giriş yapılıyor...`);
                            onLogin(acc.email);
                          }}
                        >
                          <div className="demo-row-avatar">
                            <IconComp size={15} />
                          </div>
                          <div className="demo-row-meta">
                            <div className="demo-row-top">
                              <strong>{acc.name}</strong>
                              <span className={`role-chip chip-${acc.chipClass}`}>{acc.badge}</span>
                            </div>
                            <small>{acc.unit} · {acc.role}</small>
                          </div>
                          <ArrowRight size={14} className="demo-row-arrow" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="login-legal-links">
          <button
            type="button"
            className="text-link-legal"
            onClick={() => setAuthModal("terms")}
          >
            Üyelik Sözleşmesi
          </button>
          <span className="dot-sep">·</span>
          <button
            type="button"
            className="text-link-legal"
            onClick={() => setAuthModal("privacy")}
          >
            KVKK & Gizlilik
          </button>
          <span className="dot-sep">·</span>
          <button
            type="button"
            className="text-link-legal highlight-tanitim"
            onClick={() => onNavigateTanitim?.()}
          >
            ✨ KOVAN Tanıtım Sayfası
          </button>
        </div>

        <footer className="login-footer">
          <span>© 2026 Kovan</span>
          <span>Konut & Site Yönetim Paneli</span>
        </footer>
      </section>

      {/* ŞİFRESİZ HESAP & DAİRE DEĞİŞTİRİCİ MODALI (Ekstra Hedef) */}
      {authModal === "accountSwitch" && (
        <Modal
          title="Şifresiz Hesap & Daire Değiştir"
          description="Aynı e-postaya bağlı birden fazla daireniz veya farklı hesaplarınız arasında tek tıkla şifresiz geçiş yapın."
          onClose={() => setAuthModal(null)}
        >
          <div className="account-card-list">
            {[
              {
                id: "acc-burak",
                name: "Burak Maydan",
                unit: "Kovan Sitesi · B Blok Daire 7",
                email: "burak.maydan@site.com",
                badge: "Kat Maliki & Yönetim Kurulu Üyesi",
                loginId: "burak.maydan@site.com",
              },
              {
                id: "acc-selin",
                name: "Av. Selin Erdem",
                unit: "Kovan Sitesi · C Blok Daire 2",
                email: "av.selin@hukuk.com",
                badge: "Kat Maliki & Hukuk Müşaviri",
                loginId: "av.selin@hukuk.com",
              },
              {
                id: "acc-1",
                name: "Ahmet Yılmaz",
                unit: "Kovan Sitesi · A Blok Daire 12",
                email: "ahmet.yilmaz@site.com",
                badge: "Kat Maliki (Birincil Konut)",
                loginId: "ahmet.yilmaz@site.com",
              },
              {
                id: "acc-2",
                name: "Ahmet Yılmaz (Yatırım)",
                unit: "Kovan Sitesi · B Blok Daire 4",
                email: "ahmet.yilmaz@site.com",
                badge: "Kat Maliki (Aynı E-posta / 2. Daire)",
                loginId: "ahmet.yilmaz@site.com",
              },
              {
                id: "acc-3",
                name: "Mehmet Demir",
                unit: "Kovan Sitesi · Yönetim Ofisi",
                email: "yonetim@site.com",
                badge: "Yönetim Kurulu Başkanı / Yönetici",
                loginId: "yonetim@site.com",
              },
            ].map((acc) => (
              <button
                key={acc.id}
                type="button"
                className="account-card-item"
                onClick={() => {
                  setAuthModal(null);
                  onNotify?.(`${acc.name} (${acc.unit}) hesabına geçiş yapıldı.`);
                  onLogin(acc.loginId);
                }}
              >
                <div className="account-card-info">
                  <div className="account-card-avatar">
                    <User size={16} />
                  </div>
                  <div className="account-card-text">
                    <strong>{acc.name}</strong>
                    <span>{acc.unit}</span>
                    <small style={{ color: "var(--muted)", fontSize: "10.5px" }}>{acc.email}</small>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="account-card-badge">{acc.badge}</span>
                  <ArrowRight size={15} style={{ color: "var(--accent)" }} />
                </div>
              </button>
            ))}
          </div>

          <div className="info-banner-sm mt-3">
            <Info size={16} /> <strong>Ekip & Mimari Notu:</strong> Çoklu oturum, token saklama (JWT) ve süresi dolma davranışı ekip politikası doğrultusunda backend ile tam senkronize çalışacaktır.
          </div>

          <div className="modal-footer mt-4">
            <Button secondary onClick={() => setAuthModal(null)}>
              Kapat
            </Button>
          </div>
        </Modal>
      )}

      {/* DİĞER MODALLAR */}
      {authModal === "forgot" && (
        <ForgotPasswordModal
          onClose={() => setAuthModal(null)}
          onNotify={onNotify}
          onSuccess={(targetId, newPass) => {
            if (targetId) setIdentifier(targetId);
            if (newPass) setPassword(newPass);
            setLoginMethod("password");
            setAuthModal(null);
          }}
        />
      )}

      {authModal === "wizard" && (
        <ManagerRegisterWizard
          onClose={() => setAuthModal(null)}
          onNotify={onNotify}
          onComplete={(wizardData) => {
            onManagerRegister?.(wizardData);
          }}
        />
      )}

      {authModal === "invite" && (
        <InvitationRegisterModal
          users={users}
          units={units}
          onClose={() => setAuthModal(null)}
          onNotify={onNotify}
          initialEmail={inviteData.email}
          initialUnitId={inviteData.unitId}
          isEmailLocked={inviteData.isLocked}
          onAcceptExisting={(data) => {
            onInviteAcceptExisting?.(data);
          }}
          onRegisterNew={(data) => {
            onInviteRegisterNew?.(data);
          }}
        />
      )}

      {(authModal === "terms" || authModal === "privacy") && (
        <TermsAndPrivacyModal
          type={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </main>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight size={14} className="demo-arrow" />;
}
