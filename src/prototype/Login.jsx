import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Building2, Smartphone, KeyRound } from "lucide-react";
import { Brand, Button, ThemeToggle } from "./UI";
import { ForgotPasswordModal, ManagerRegisterWizard, TermsAndPrivacyModal } from "./AuthModal";
import InviteJoinModal from "../live/InviteJoinModal";
import { Notice } from "../live/common";
import { login } from "../api/kovan";
import { errorMessage } from "../api/client";

function loginErrorMessage(error) {
  if (error.code === "ACCOUNT_LOCKED" && error.lockedUntil) {
    const until = new Date(error.lockedUntil).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    return `Çok fazla hatalı deneme nedeniyle hesabınız ${until}'e kadar kilitlendi. Şifrenizi unuttuysanız "Şifremi unuttum" ile kilidi hemen açabilirsiniz.`;
  }
  return errorMessage(error);
}

export default function Login({
  onLoggedIn,
  theme,
  onToggleTheme,
  onNotify,
  onNavigateTanitim,
  onBusyChange,
  inviteToken = "",
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Auth Modalları: 'forgot' | 'wizard' | 'invite' | 'terms' | 'privacy'
  const [authModal, setAuthModal] = useState(inviteToken ? "invite" : null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onLoggedIn(await login(identifier, password, rememberMe));
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      {/* MOBİL ÜST BAR (Yalnızca mobilde görünür, sayfa kaymasını önler) */}
      <div className="mobile-header-bar mobile-only">
        <Brand />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      {/* MOBİLDE MİMARİ BİNA ARKA PLANI */}
      <div className="mobile-login-backdrop mobile-only" aria-hidden="true">
        <div className="mobile-login-img" />
        <div className="mobile-login-overlay" />
      </div>

      {/* MASAÜSTÜ SOL HİKAYE BÖLÜMÜ (MİMARİ BİNA FOTOĞRAF ARKA PLANLI) */}
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

        {/* Masaüstü Mimari Cam Rozet */}
        <div className="story-architecture-badge">
          <div className="story-badge-glass">
            <Building2 size={16} className="text-gold" />
            <div>
              <strong>Kovan Yaşam Kompleksi</strong>
              <span>03 Blok · 48 Bağımsız Bölüm · Ataşehir / İstanbul</span>
            </div>
          </div>
        </div>

        <div className="story-footer">
          <span>Yaşamın düzeni, kovan.</span>
          <span>İstanbul · Ataşehir</span>
        </div>
      </section>

      {/* SAĞ FORM ALANI */}
      <section className="login-form-area">
        <div className="login-top-actions desktop-only">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <div className="login-form-wrap">
          <span className="eyebrow">KOVAN’A HOŞ GELDİNİZ</span>
          <h2>Sitenize giriş yapın.</h2>
          <p className="login-intro">Yaşam alanınızla bağlantıda kalın.</p>

          <form onSubmit={submit}>
            <div className="field">
              <span>E-posta</span>
              <input
                autoFocus
                type="email"
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
                <button type="button" className="forgot-link-inline" onClick={() => setAuthModal("forgot")}>
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

            <label className="terms-checkbox" style={{ marginBottom: 12 }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span className="terms-text">Beni hatırla (90 gün)</span>
            </label>

            <Notice kind="error">{error}</Notice>

            <Button className="login-submit" type="submit" disabled={busy}>
              {busy ? "Giriş yapılıyor…" : "Giriş Yap"}
              <ArrowRight size={18} />
            </Button>

            <button
              type="button"
              className="login-otp-switch-btn"
              onClick={() => onNotify?.("Şifresiz OTP ile giriş yakında kullanıma açılacak.")}
            >
              <Smartphone size={15} />
              <span>Şifresiz OTP ile Giriş (yakında)</span>
            </button>
          </form>

          {/* YENİ KAYIT & DAVETİYE KÖPRÜLERİ */}
          <div className="login-onboarding-row">
            <span className="onboarding-prompt">Hesabınız yok mu?</span>
            <div className="onboarding-links">
              <button type="button" className="onboarding-link-btn" onClick={() => setAuthModal("wizard")}>
                <Building2 size={13} className="text-gold" />
                <span>Site Kurulumu Yap</span>
              </button>
              <span className="link-divider">•</span>
              <button type="button" className="onboarding-link-btn" onClick={() => setAuthModal("invite")}>
                <KeyRound size={13} className="text-gold" />
                <span>Davet Bağlantım Var</span>
              </button>
            </div>
          </div>
        </div>

        <footer className="login-footer">
          <div className="login-legal-links">
            <button type="button" className="text-link-legal" onClick={() => setAuthModal("terms")}>
              Üyelik Sözleşmesi
            </button>
            <span className="dot-sep">·</span>
            <button type="button" className="text-link-legal" onClick={() => setAuthModal("privacy")}>
              KVKK & Gizlilik
            </button>
            <span className="dot-sep">·</span>
            <button type="button" className="text-link-legal highlight-tanitim" onClick={() => onNavigateTanitim?.()}>
              ✨ KOVAN Tanıtım Sayfası
            </button>
          </div>
          <div className="login-footer-meta">
            <span>© 2026 Kovan</span>
            <span className="dot-sep">·</span>
            <span>Konut & Site Yönetim Paneli</span>
          </div>
        </footer>
      </section>

      {authModal === "forgot" && (
        <ForgotPasswordModal
          onClose={() => setAuthModal(null)}
          onNotify={onNotify}
          onSuccess={(targetId) => {
            if (targetId) setIdentifier(targetId);
            setPassword("");
            setAuthModal(null);
          }}
        />
      )}

      {authModal === "wizard" && (
        <ManagerRegisterWizard
          onClose={() => setAuthModal(null)}
          onNotify={onNotify}
          onComplete={onLoggedIn}
          onBusyChange={onBusyChange}
        />
      )}

      {authModal === "invite" && (
        <InviteJoinModal
          initialToken={inviteToken}
          onClose={() => setAuthModal(null)}
          onNotify={onNotify}
          onJoined={onLoggedIn}
          onBusyChange={onBusyChange}
        />
      )}

      {(authModal === "terms" || authModal === "privacy") && (
        <TermsAndPrivacyModal type={authModal} onClose={() => setAuthModal(null)} />
      )}
    </main>
  );
}
