import { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Smartphone,
  Wallet,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Send,
  Sparkles,
  Users,
  Bell,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { Brand, Button, ThemeToggle } from "./UI";

export default function ComingSoon({ onBackToLogin, theme, onToggleTheme }) {
  const [demoRequested, setDemoRequested] = useState(false);
  const [email, setEmail] = useState("");

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDemoRequested(true);
  };

  return (
    <div className="landing-container">
      {/* ÜST GEZİNME ÇUBUĞU */}
      <header className="landing-header">
        <div className="landing-brand-wrap">
          <Brand />
          <span className="landing-badge">Çok Yakında</span>
        </div>
        <div className="landing-header-actions">
          {onToggleTheme && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
          <Button secondary onClick={onBackToLogin}>
            <ArrowLeft size={15} /> Demo Yönetim Paneline Giriş
          </Button>
        </div>
      </header>

      {/* HERO BÖLÜMÜ */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-pill">
            <Sparkles size={14} className="text-gold" />
            <span>Yeni Nesil Konut & Site Yönetim Ekosistemi</span>
          </div>
          <h1>
            Yaşamın düzeni.<br />
            <span className="text-gradient-gold">KOVAN ile dijitalleşiyor.</span>
          </h1>
          <p className="landing-lead">
            Apartman ve site yönetimlerinin tüm aidat, sakin iletişimi, afet hazırlığı ve bakım süreçlerini tek çatı altında toplayan akıllı yönetim platformu çok yakında hizmetinizde.
          </p>

          <div className="landing-cta-row">
            <Button onClick={onBackToLogin} className="btn-hero-primary">
              Mevcut Paneli Canlı Deneyin <ArrowRight size={17} />
            </Button>
            <a href="#ozellikler" className="btn-hero-secondary">
              Özellikleri Keşfedin &darr;
            </a>
          </div>
        </div>

        {/* MİMARİ GRAFİK VURGUSU */}
        <div className="landing-hero-visual">
          <div className="landing-visual-card">
            <div className="visual-top">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
              <span className="visual-title">KOVAN ERP v2.4</span>
            </div>
            <div className="visual-metrics-grid">
              <div className="visual-stat">
                <small>Aylık Tahsilat Oranı</small>
                <strong>%98.4</strong>
                <span className="badge-sub">PayTR Sanal POS Entegre</span>
              </div>
              <div className="visual-stat">
                <small>Afet Tahliye Kaydı</small>
                <strong>Aktif</strong>
                <span className="badge-sub text-amber-500">🚨 Hasta & Öncelik Hazır</span>
              </div>
              <div className="visual-stat">
                <small>Sakin Katılımı</small>
                <strong>7 Gün</strong>
                <span className="badge-sub">Güvenli Yönetici Daveti</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÖNE ÇIKAN ÖZELLİKLER */}
      <section id="ozellikler" className="landing-features-section">
        <div className="section-heading">
          <span className="section-eyebrow">NEDEN KOVAN?</span>
          <h2>Karmaşık site yönetimini zahmetsiz ve şeffaf hale getiriyoruz.</h2>
        </div>

        <div className="features-grid-3">
          {/* Kart 1 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <Send size={24} className="text-gold" />
            </div>
            <h3>Akıllı & Toplu Sakin Davetleri</h3>
            <p>
              Yöneticiler tek tek uğraşmadan tüm blok ve dairelere 7 gün geçerli güvenli davet bağlantıları oluşturur. Sakinler tek tıkla şifresini belirleyip dairelerine bağlanır.
            </p>
            <ul className="feature-list">
              <li><CheckCircle2 size={15} /> Toplu SMS ve e-posta daveti</li>
              <li><CheckCircle2 size={15} /> Süresi dolan davetleri tek tıkla yenileme</li>
              <li><CheckCircle2 size={15} /> Asansör ve bina panosu için QR afişi</li>
            </ul>
          </div>

          {/* Kart 2 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <Wallet size={24} className="text-gold" />
            </div>
            <h3>KMK Uyumlu Aidat & Gecikme Faizi</h3>
            <p>
              Kat Mülkiyeti Kanunu Madde 20'ye tam uyumlu işletme bütçesi, isteğe bağlı gecikme faizi ayarı ve kredi kartıyla anında online tahsilat imkanı.
            </p>
            <ul className="feature-list">
              <li><CheckCircle2 size={15} /> Yönetici tercihine bağlı faiz modeli</li>
              <li><CheckCircle2 size={15} /> Daire tipi ve m² bazlı esnek aidat</li>
              <li><CheckCircle2 size={15} /> Şeffaf gelir-gider ve kasa raporları</li>
            </ul>
          </div>

          {/* Kart 3 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <AlertTriangle size={24} className="text-gold" />
            </div>
            <h3>Afet Hazırlığı & DASK Takibi</h3>
            <p>
              Olası acil durumlarda dairelerdeki kişi sayısı, evcil hayvan ve yatağa bağlı hasta bilgileri yönetici ve kurtarma ekiplerine anında rehberlik eder.
            </p>
            <ul className="feature-list">
              <li><CheckCircle2 size={15} /> Öncelikli acil tahliye listesi</li>
              <li><CheckCircle2 size={15} /> DASK deprem sigortası poliçe takibi</li>
              <li><CheckCircle2 size={15} /> Bina güvenliği ve denetçi iletişimi</li>
            </ul>
          </div>
        </div>
      </section>

      {/* MOBİL UYGULAMA TANITIMI */}
      <section className="landing-mobile-preview">
        <div className="landing-mobile-inner">
          <div className="mobile-text">
            <span className="section-eyebrow">HER YERDE YANINIZDA</span>
            <h2>Web ve Mobilde Kusursuz Senkronizasyon</h2>
            <p>
              Yönetici ve sakinler için optimize edilmiş sezgisel arayüz. Duyurular, arıza talepleri, aidat ödemeleri ve zil bildirimleri doğrudan cebinizde.
            </p>
            <div className="app-store-badges">
              <span className="app-badge"><Smartphone size={16} /> iOS Uygulaması Çok Yakında</span>
              <span className="app-badge"><Smartphone size={16} /> Android Uygulaması Çok Yakında</span>
            </div>
          </div>
          <div className="mobile-mockup-graphic">
            <div className="phone-screen-frame">
              <div className="phone-header">
                <strong>KOV<span>A</span>N</strong>
                <Bell size={14} className="text-gold" />
              </div>
              <div className="phone-card">
                <small>Eylül 2026 Aidatı</small>
                <strong>2.500 ₺</strong>
                <span className="phone-status">Online Ödendi</span>
              </div>
              <div className="phone-card alert">
                <small>🚨 Bina Afet Bilgisi</small>
                <span>Tahliye Önceliği Kayıtlı</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ERKEN ERİŞİM / BİLGİ ALMA FORMU */}
      <section className="landing-newsletter">
        <div className="newsletter-card">
          <h2>Kovan ile sitenizi geleceğe taşıyın.</h2>
          <p>
            Platform lansmanımızda ilk kullanan siteler arasında yer almak ve özel avantajlardan haberdar olmak için e-postanızı bırakın.
          </p>

          {demoRequested ? (
            <div className="newsletter-success">
              <CheckCircle2 size={24} className="text-green-500" />
              <strong>Talebiniz alındı!</strong>
              <span>Lansman öncesi ekibimiz sizinle iletişime geçecektir.</span>
            </div>
          ) : (
            <form onSubmit={handleDemoSubmit} className="newsletter-form">
              <input
                type="email"
                required
                placeholder="E-posta adresiniz..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit">
                Erken Erişim Talep Et <ArrowRight size={15} />
              </Button>
            </form>
          )}

          <div className="landing-back-action mt-4">
            <Button secondary onClick={onBackToLogin}>
              &larr; Yönetim Paneli Giriş Ekranına Dön
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div>
            <strong>KOVAN</strong>
            <p>© 2026 Kovan Konut ve Site Yönetim Teknolojileri. Tüm hakları saklıdır.</p>
          </div>
          <div className="footer-links">
            <span>6698 Sayılı KVKK Uyumlu</span>
            <span>·</span>
            <span>Kat Mülkiyeti Kanunu Uyumlu</span>
            <span>·</span>
            <span>256-Bit SSL Güvenliği</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
