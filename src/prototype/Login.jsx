import { useState, useEffect } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Home,
  Building2,
  Smartphone,
  Lock,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Phone,
  KeyRound,
} from "lucide-react";
import { Brand, Button, Field, ThemeToggle } from "./UI";
import {
  ForgotPasswordModal,
  ManagerRegisterWizard,
  InvitationRegisterModal,
} from "./AuthModal";

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
  const [authModal, setAuthModal] = useState(null); // 'forgot' | 'wizard' | 'invite'
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
      <section className="login-story">
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
        <div className="architecture" aria-hidden="true">
          <div className="building building-one">
            {Array.from({ length: 24 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <div className="building building-two">
            {Array.from({ length: 32 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <div className="building building-three">
            {Array.from({ length: 20 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <span className="architecture-caption">
            KOVAN SİTESİ <span>03 BLOK / 48 DAİRE</span>
          </span>
        </div>
        <div className="story-footer">
          <span>Yaşamın düzeni, kovan.</span>
          <span>İstanbul · Ataşehir</span>
        </div>
      </section>

      <section className="login-form-area">
        <div className="login-top-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <div className="login-form-wrap">
          <span className="eyebrow">KOVAN’A HOŞ GELDİNİZ</span>
          <h2>Sitenize giriş yapın.</h2>
          <p className="login-intro">Yaşam alanınızla bağlantıda kalın.</p>

          {/* GİRİŞ METODU SEÇİCİ (Şifre vs. Şifresiz OTP) */}
          <div className="login-method-tabs">
            <button
              type="button"
              className={loginMethod === "password" ? "active" : ""}
              onClick={() => setLoginMethod("password")}
            >
              <Lock size={15} /> Şifre ile Giriş
            </button>
            <button
              type="button"
              className={loginMethod === "otp" ? "active" : ""}
              onClick={() => {
                setLoginMethod("otp");
                if (identifier && !otpTarget) setOtpTarget(identifier);
              }}
            >
              <Smartphone size={15} /> Şifresiz OTP Girişi
            </button>
          </div>

          {/* 1. SEÇENEK: ŞİFRE İLE GİRİŞ FORMU */}
          {loginMethod === "password" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (identifier.trim() && password.trim()) onLogin(identifier);
              }}
            >
              <Field label="E-posta / Telefon / Daire Kodu">
                <input
                  autoFocus
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="ahmet.yilmaz@site.com veya A-12"
                />
              </Field>

              <Field label="Şifre">
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
              </Field>

              <div className="forgot-password-row">
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => setAuthModal("forgot")}
                >
                  Şifremi unuttum?
                </button>
              </div>

              <Button className="login-submit" type="submit">
                Giriş Yap
                <ArrowRight size={18} />
              </Button>
            </form>
          )}

          {/* 2. SEÇENEK: ŞİFRESİZ OTP İLE GİRİŞ FORMU */}
          {loginMethod === "otp" && (
            <div className="otp-login-area">
              {otpStep === 1 ? (
                <form onSubmit={handleSendOtp}>
                  <p className="otp-explainer-text">
                    Şifrenizi hatırlamanıza gerek yok. Kayıtlı telefon numaranıza veya e-postanıza tek kullanımlık 6 haneli giriş kodu göndereceğiz.
                  </p>
                  <Field label="Kayıtlı Telefon Numarası veya E-posta">
                    <div className="input-with-icon">
                      <Phone size={17} className="field-icon" />
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
                </form>
              )}
            </div>
          )}

          {/* YENİ KAYIT & DAVETİYE KÖPRÜLERİ (BMS-137) */}
          <div className="onboarding-cards-grid">
            <button
              type="button"
              className="onboard-card"
              onClick={() => setAuthModal("wizard")}
            >
              <Building2 size={18} className="text-gold" />
              <div>
                <strong>Site Yöneticisi Misiniz?</strong>
                <span>Yeni site kurulum sihirbazını başlatın</span>
              </div>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              className="onboard-card"
              onClick={() => setAuthModal("invite")}
            >
              <KeyRound size={18} className="text-gold" />
              <div>
                <strong>Sakin Katılım Kodu ile Kaydol</strong>
                <span>Yöneticinizin verdiği site & blok kodu ile üye olun</span>
              </div>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="demo-separator">
            <span>Hızlı Giriş</span>
          </div>

          <div className="demo-options">
            <button type="button" onClick={() => fill("ahmet.yilmaz@site.com")}>
              <Home size={19} />
              <span>
                <strong>Sakin Hesabı</strong>
                <small>Ahmet Yılmaz · A-12</small>
              </span>
              <ArrowUpRightIcon />
            </button>
            <button type="button" onClick={() => fill("yonetim@site.com")}>
              <Building2 size={19} />
              <span>
                <strong>Yönetici Hesabı</strong>
                <small>Mehmet Demir · Yönetim</small>
              </span>
              <ArrowUpRightIcon />
            </button>
          </div>
        </div>

        <footer className="login-footer">
          <span>© 2026 Kovan</span>
          <span>Konut & Site Yönetim Paneli</span>
        </footer>
      </section>

      {/* MODALLAR */}
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
    </main>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight size={15} className="demo-arrow" />;
}
