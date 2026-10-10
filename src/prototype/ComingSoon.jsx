import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Smartphone,
  Wallet,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Send,
  Sparkles,
  Bell,
  ArrowLeft,
  Wrench,
  Trophy,
  QrCode,
  Car,
  Heart,
  Coffee,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Brand, Button, ThemeToggle, Modal } from "./UI";

// LinkedIn SVG İkonu
function LinkedInIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

// Apple App Store Resmi Logosu
function AppleLogo({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 170 170"
      fill="currentColor"
      className={className}
    >
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.77-11.7-14.18-5.77-8.91-10.29-19.14-13.56-30.68-3.27-11.54-4.9-22.39-4.9-32.55 0-14.13 3.59-25.59 10.77-34.38 7.18-8.79 16.23-13.31 27.15-13.56 5.34 0 11.05 1.41 17.13 4.23 6.08 2.82 10.05 4.34 11.91 4.56 1.86-.22 5.94-1.74 12.24-4.56 6.3-2.82 11.83-4.12 16.59-3.9 12.19.65 21.84 5.38 28.96 14.2-10.66 6.52-15.89 15.44-15.68 26.77.22 8.7 3.64 15.93 10.27 21.68 6.63 5.76 14.56 9.08 23.79 9.95-2.18 6.52-4.79 13.04-7.83 19.57zM119.22 31.84c0-7.18 2.61-13.91 7.83-20.19 5.22-6.28 11.64-10.27 19.27-11.97.22 1.3.33 2.61.33 3.92 0 7.18-2.77 14.08-8.32 20.69-5.55 6.61-12.01 10.49-19.38 11.63-.44-1.3-.73-2.66-.73-4.08z" />
    </svg>
  );
}

// Google Play Store Resmi Logosu
function GooglePlayLogo({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
    >
      <path fill="#4285F4" d="M48.7 16.3C40.6 24.9 36 37.8 36 53.6v404.8c0 15.8 4.6 28.7 12.7 37.3l2.1 1.9L278.4 270v-5.6L50.8 14.4l-2.1 1.9z" />
      <path fill="#FBBC04" d="M358.3 350.3l-79.9-79.9v-5.6l79.9-79.9 1.8 1 94.6 53.8c27 15.3 27 40.5 0 55.9l-94.6 53.7-1.8 1z" />
      <path fill="#EA4335" d="M278.4 270.4L50.8 497.6c8.9 9.4 23.6 10.6 40.3 1.1l240.8-136.8-53.5-91.5z" />
      <path fill="#34A853" d="M278.4 241.6l53.5-91.5L91.1 13.3c-16.7-9.5-31.4-8.3-40.3 1.1L278.4 241.6z" />
    </svg>
  );
}

// Gelecekte eklenecek yol haritası modülleri
const ROADMAP_MODULES = [
  {
    id: "dis-servis",
    icon: Wrench,
    title: "Dış Servis / Tesisat & Bakım Hizmetleri",
    badge: "Pazaryeri & Entegrasyon",
    desc: "Daire sakinlerinin acil su tesisatçısı, elektrikçi, kombi/klima bakımı ve temizlik hizmetlerine tek tıkla ulaşabileceği onaylı usta pazaryeri.",
    status: "Ücret & Bütçe Karşılandığında",
  },
  {
    id: "rezervasyon",
    icon: Trophy,
    title: "Sosyal Tesis & Spor Rezervasyon Sistemi",
    badge: "Ortak Alan Yönetimi",
    desc: "Sitedeki basketbol sahası, tenis kortu, fitness/gym ve sinema odası için saatlik adil randevu ve kota sistemi.",
    status: "Planlanan Modül",
  },
  {
    id: "qr-kapi",
    icon: QrCode,
    title: "Temassız QR Kod ile Giriş & Misafir Kabul",
    badge: "IoT & Akıllı Güvenlik",
    desc: "Kuryeler ve misafirler için süreli dinamik QR kod üreterek diyafon ve turnikeden temassız, güvenli kapı açma imkanı.",
    status: "Donanım Ar-Ge Aşamasında",
  },
  {
    id: "otopark-pts",
    icon: Car,
    title: "Plaka Tanıma (PTS) Otomatize Otopark",
    badge: "Kamera & AI Otomasyon",
    desc: "Kameralı yapay zekâ plaka okuma sistemiyle yabancı araç girişini engelleyen, bariyeri otomatik kaldıran akıllı otopark sistemi.",
    status: "Kamera & Donanım Fonlandığında",
  },
];

// KOVAN Geliştirme Ekibi
const TEAM_MEMBERS = [
  {
    name: "Yusuf Mermertaş",
    role: "Mobil & Frontend Developer",
    focus: "Mobil uygulama mimarisi, Android/iOS entegrasyonu ve responsive web arayüzleri",
    linkedin: "https://www.linkedin.com/in/yusufmermertas?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    initials: "YM",
  },
  {
    name: "Onur Kaçar",
    role: "Backend & Database Developer",
    focus: "Veritabanı mimarisi, veri bütünlüğü ve backend servis geliştirme",
    linkedin: "https://www.linkedin.com/in/onurkacaar/?isSelfProfile=true",
    initials: "OK",
  },
  {
    name: "Hakan Tekin",
    role: "Backend & Cloud Architecture",
    focus: "Spring Boot backend mimarisi, Kubernetes cluster ve bulut altyapısı",
    linkedin: "https://www.linkedin.com/in/hakan-tekin-15122b26a",
    initials: "HT",
  },
  {
    name: "Ceren Mıcık",
    role: "Backend Developer",
    focus: "Backend API geliştirme, yetkilendirme mimarisi ve mikroservis entegrasyonları",
    linkedin: "https://www.linkedin.com/in/ceren-m%C4%B1c%C4%B1k-5bb308294?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    initials: "CM",
  },
  {
    name: "Reyhan Gökmen",
    role: "Frontend & UI/UX Developer",
    focus: "Modern kullanıcı arayüzü, responsive deneyim ve bileşen kütüphanesi",
    linkedin: "https://www.linkedin.com/in/reyhan-g%C3%B6kmen-9103391a8",
    initials: "RG",
  },
];

export default function ComingSoon({ onBackToLogin, theme, onToggleTheme }) {
  const [demoRequested, setDemoRequested] = useState(false);
  const [email, setEmail] = useState("");
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDemoRequested(true);
  };

  const handleCopy = (key, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2200);
  };

  return (
    <div className="landing-container">
      {/* TÜM SAYFAYI KAPSAYAN HİBRİT ARKA PLAN (APARTMAN + BAL PETEĞİ + AMBİYANS) */}
      <div className="landing-page-bg-fixed">
        <div className="landing-bg-building" />
        <div className="landing-bg-honeycomb" />
        <div className="landing-bg-glow-orb orb-top-right" />
        <div className="landing-bg-glow-orb orb-mid-left" />
        <div className="landing-bg-glow-orb orb-bottom-right" />
        <div className="landing-bg-gradient-wash" />
      </div>

      <div className="landing-content-layer">
        {/* ÜST GEZİNME ÇUBUĞU (ORİJİNAL) */}
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
              <a
                href="#ozellikler"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("ozellikler");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="btn-hero-secondary"
              >
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

              {/* Apartman Görseli Vitrini */}
              <div className="visual-building-preview">
                <img src="/login-building.jpg" alt="KOVAN Akıllı Site" />
                <div className="preview-badge">
                  <span className="pulse-dot" /> KOVAN Akıllı Site Otomasyonu
                </div>
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

        {/* MOBİL UYGULAMA MAĞAZA ÇUBUĞU (HERO İLE KARMAŞIK SİTE YÖNETİMİ ARASI) */}
        <div className="landing-store-strip">
          <div className="landing-store-strip-inner">
            <div className="strip-title-wrap">
              <span className="strip-dot" />
              <span>KOVAN Mobil Uygulaması Çok Yakında Yayında:</span>
            </div>
            <div className="app-store-badges">
              {/* App Store Resmi Rozet */}
              <div className="official-store-badge">
                <AppleLogo size={24} className="store-logo-icon" />
                <div className="badge-text-col">
                  <span className="badge-top-text">Çok Yakında</span>
                  <strong className="badge-main-text">App Store</strong>
                </div>
              </div>

              {/* Google Play Resmi Rozet */}
              <div className="official-store-badge">
                <GooglePlayLogo size={22} className="store-logo-icon" />
                <div className="badge-text-col">
                  <span className="badge-top-text">Çok Yakında</span>
                  <strong className="badge-main-text">Google Play</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* ÖNE ÇIKAN ÖZELLİKLER (ORİJİNAL) */}
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

      {/* MOBİL UYGULAMA TANITIMI (ORİJİNAL) */}
      <section className="landing-mobile-preview">
        <div className="landing-mobile-inner">
          <div className="mobile-text">
            <span className="section-eyebrow">HER YERDE YANINIZDA</span>
            <h2>Web ve Mobilde Kusursuz Senkronizasyon</h2>
            <p>
              Yönetici ve sakinler için optimize edilmiş sezgisel arayüz. Duyurular, arıza talepleri, aidat ödemeleri ve zil bildirimleri doğrudan cebinizde.
            </p>
            <div className="app-store-badges">
              {/* App Store Resmi Rozet */}
              <div className="official-store-badge">
                <AppleLogo size={24} className="store-logo-icon" />
                <div className="badge-text-col">
                  <span className="badge-top-text">Çok Yakında</span>
                  <strong className="badge-main-text">App Store</strong>
                </div>
              </div>

              {/* Google Play Resmi Rozet */}
              <div className="official-store-badge">
                <GooglePlayLogo size={22} className="store-logo-icon" />
                <div className="badge-text-col">
                  <span className="badge-top-text">Çok Yakında</span>
                  <strong className="badge-main-text">Google Play</strong>
                </div>
              </div>
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
              <div className="phone-quick-actions">
                <span>📱 QR Kapı</span>
                <span>🛠️ Talep Aç</span>
                <span>📋 Duyurular</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ERKEN ERİŞİM / BİLGİ ALMA FORMU (ORİJİNAL) */}
      <section className="landing-newsletter">
        <div className="newsletter-card">
          <span className="section-eyebrow">ÖN KAYIT AYRICALIKLARI</span>
          <h2>Ön Kayıt Yaptırın, Özel Avantajlardan Yararlanın</h2>
          <p>
            Lansman öncesi ön kayıt oluşturan siteler ilk 3 ay ücretsiz kullanım, sıfır veri aktarım maliyeti ve öncelikli destek imkanlarından yararlanır.
          </p>

          <div className="pre-register-perks">
            <span className="perk-badge"><Sparkles size={13} className="text-gold" /> İlk 3 Ay Ücretsiz Kullanım</span>
            <span className="perk-badge"><CheckCircle2 size={13} className="text-green-500" /> Ücretsiz Kurulum & Veri Aktarımı</span>
            <span className="perk-badge"><ShieldCheck size={13} className="text-blue-500" /> VIP Öncelikli Destek</span>
          </div>

          {demoRequested ? (
            <div className="newsletter-success">
              <CheckCircle2 size={24} className="text-green-500" />
              <strong>Ön Kayıt Talebiniz Alındı!</strong>
              <span>Özel lansman avantajlarınız hesabınıza tanımlandı. Lansman öncesi ekibimiz sizinle iletişime geçecektir.</span>
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
                Ön Kayıt Ol & Avantajlardan Yararlan <ArrowRight size={15} />
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

      {/* =========================================================================
          ALT KISIM: GELECEK MODÜLLER, ÖĞRENCİ GELİŞTİRME EKİBİ & BAĞIŞ ALANI
          ========================================================================= */}

      {/* 1. GELECEK MODÜLLER & YOL HARİTASI */}
      <section id="gelecek-moduller" className="landing-roadmap-section">
        <div className="section-heading">
          <span className="section-eyebrow">GELECEK VİZYONUMUZ</span>
          <h2>Geliştirilmekte Olan İleri Seviye Modüller</h2>
          <p className="section-sub-desc">
            KOVAN'ın mevcut finans ve yönetim çekirdeği aktif olarak çalışmaktadır. Aşağıdaki akıllı donanım, dış servis ve otomasyon modülleri ise gerekli lisans ve donanım bütçeleri karşılandıkça sisteme dahil edilecektir.
          </p>
        </div>

        <div className="roadmap-grid-4">
          {ROADMAP_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div className="roadmap-card" key={mod.id}>
                <div className="roadmap-card-header">
                  <div className="feature-icon-box">
                    <Icon size={22} className="text-gold" />
                  </div>
                  <span className="roadmap-status-pill">{mod.status}</span>
                </div>
                <h3>{mod.title}</h3>
                <span className="roadmap-badge-sub">{mod.badge}</span>
                <p>{mod.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="roadmap-funding-note">
          <Sparkles size={18} className="text-gold" />
          <span>
            <strong>Geliştirme Notu:</strong> Tesisat/bakım dış servis API'leri, akıllı turnike/kapı QR okuyucuları ve PTS plaka tanıma kameralarının donanım maliyetleri karşılandığında bu modüller sırayla sitelerin kullanımına açılacaktır.
          </span>
        </div>
      </section>

      {/* 2. KOVAN GELİŞTİRME EKİBİ */}
      <section className="landing-team-section">
        <div className="section-heading">
          <span className="section-eyebrow">BİZ KİMİZ?</span>
          <h2>KOVAN Geliştirme Ekibi</h2>
          <p className="section-sub-desc">
            KOVAN; yenilikçi 5 kişilik yazılım geliştirme ekibimiz tarafından sıfırdan, büyük bir emek ve tutkuyla hayata geçirilmektedir.
          </p>
        </div>

        <div className="team-grid-5">
          {TEAM_MEMBERS.map((member, idx) => (
            <div className="team-member-card" key={idx}>
              <div className="member-avatar-circle">
                <span>{member.initials}</span>
              </div>
              <h3 className="member-name">{member.name}</h3>
              <span className="member-role-badge">{member.role}</span>
              <p className="member-focus">{member.focus}</p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="member-linkedin-link"
                title={`${member.name} LinkedIn Profili`}
              >
                <LinkedInIcon size={14} />
                <span>LinkedIn</span>
                <ExternalLink size={12} className="ext-icon" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PROJE GELİŞTİRME FONUNA DESTEK / BAĞIŞ (DONATE) */}
      <section className="landing-donate-section">
        <div className="donate-banner-card">
          <div className="donate-banner-left">
            <div className="donate-icon-bubble">
              <Heart size={24} className="text-gold" />
            </div>
            <div className="donate-banner-text">
              <span className="donate-pill">PROJEYE DESTEK</span>
              <h2>Geliştirme Ekibimize Destek Olmak İster misiniz?</h2>
              <p>
                KOVAN'ın bulut sunucuları ve akıllı donanım prototiplerinin maliyetlerini kendi imkanlarımızla karşılıyoruz. 
                Gelişimimize katkıda bulunmak ya da ekibimize bir kahve ısmarlamak isterseniz desteğiniz bizim için çok kıymetli!
              </p>
            </div>
          </div>
          <div className="donate-banner-right">
            <Button
              type="button"
              className="btn-donate-trigger"
              onClick={() => setShowDonateModal(true)}
            >
              <Coffee size={17} />
              <span>Projeye Destek Ol / Bağış Yap</span>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER (ORİJİNAL) */}
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

    {/* BAĞIŞ VE DESTEK MODALI */}
      {showDonateModal && (
        <Modal
          title="Geliştirme Ekibimize Destek Olun"
          description="KOVAN sunucu, veritabanı ve donanım geliştirme bütçesine katkıda bulunun."
          onClose={() => setShowDonateModal(false)}
        >
          <div className="donate-modal-content">
            <div className="donate-modal-intro">
              <Coffee size={24} className="text-gold" />
              <p>
                Bizler teknoloji ve modern yazılıma tutkuyla bağlı 5 kişilik bir geliştirme ekibiyiz. 
                Yapacağınız her katkı, Kubernetes sunucu masraflarımızın ve IoT akıllı kapı / kamera donanımlarının geliştirilmesinde doğrudan kullanılacaktır.
              </p>
            </div>

            <div className="donate-methods-list">
              {/* IBAN Kartı */}
              <div className="donate-method-box">
                <div className="method-header">
                  <strong>Banka Havale / FAST (TRY)</strong>
                  <span className="method-tag">TR IBAN</span>
                </div>
                <div className="method-field">
                  <span className="field-title">Alıcı Adı:</span>
                  <span className="field-val">Reyhan Gökmen</span>
                </div>
                <div className="method-copy-row">
                  <code>TR76 0006 2000 0001 2345 6789 01</code>
                  <button
                    type="button"
                    className={`btn-copy-code ${copiedKey === "iban" ? "copied" : ""}`}
                    onClick={() => handleCopy("iban", "TR760006200000012345678901")}
                  >
                    {copiedKey === "iban" ? (
                      <>
                        <CheckCircle2 size={13} /> Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> IBAN Kopyala
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Kripto / USDT Kartı */}
              <div className="donate-method-box">
                <div className="method-header">
                  <strong>Kripto Desteği (USDT / TRC20)</strong>
                  <span className="method-tag">Tether</span>
                </div>
                <div className="method-copy-row">
                  <code>TYDzsxdCz9kgnTBDq2Z5kXg34848g58a8a</code>
                  <button
                    type="button"
                    className={`btn-copy-code ${copiedKey === "crypto" ? "copied" : ""}`}
                    onClick={() => handleCopy("crypto", "TYDzsxdCz9kgnTBDq2Z5kXg34848g58a8a")}
                  >
                    {copiedKey === "crypto" ? (
                      <>
                        <CheckCircle2 size={13} /> Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Cüzdan Kopyala
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="donate-footer-note">
              <small>Desteğiniz ve genç yazılımcılara olan inancınız için çok teşekkür ederiz! ❤️</small>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
