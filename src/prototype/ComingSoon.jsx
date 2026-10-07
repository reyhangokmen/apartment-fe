import { useState } from "react";
import {
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

// KOVAN Öğrenci Geliştirme Ekibi
const TEAM_MEMBERS = [
  {
    name: "Yusuf Mermertaş",
    role: "Full Stack Developer",
    focus: "Sistem mimarisi, servis entegrasyonu ve mobil/web ürün geliştirme",
    linkedin: "https://www.linkedin.com/in/yusufmermertas?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    initials: "YM",
  },
  {
    name: "Onur Kaçar",
    role: "Backend & Database Developer",
    focus: "Veritabanı ilişkileri, veri bütünlüğü ve backend servis geliştirme",
    linkedin: "https://www.linkedin.com/in/onurkacaar/?isSelfProfile=true",
    initials: "OK",
  },
  {
    name: "Hakan Tekin",
    role: "Backend & Cloud Architecture",
    focus: "Kubernetes kümesi, Spring Boot mimarisi ve bulut dağıtımı",
    linkedin: "https://www.linkedin.com/in/hakan-tekin-15122b26a",
    initials: "HT",
  },
  {
    name: "Ceren Mıcık",
    role: "Full Stack Developer",
    focus: "Yetkilendirme mimarisi, servis katmanı ve sistem entegrasyonları",
    linkedin: "https://www.linkedin.com/in/ceren-m%C4%B1c%C4%B1k-5bb308294?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    initials: "CM",
  },
  {
    name: "Reyhan Gökmen",
    role: "Frontend & UI/UX Developer",
    focus: "Modern kullanıcı arayüzü, responsive deneyim ve bileşen tasarımı",
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

      {/* HERO BÖLÜMÜ (MİMARİ GÖRSEL + BAL PETEĞİ MİX) */}
      <section className="landing-hero-wrapper">
        <div className="landing-hero-backdrop">
          <div className="landing-hero-building-bg" />
          <div className="landing-hero-honeycomb" />
          <div className="landing-hero-glow-orb glow-orb-1" />
          <div className="landing-hero-glow-orb glow-orb-2" />
          <div className="landing-hero-gradient-overlay" />
        </div>

        <div className="landing-hero">
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
        </div>
      </section>

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

      {/* ERKEN ERİŞİM / BİLGİ ALMA FORMU (ORİJİNAL) */}
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

      {/* 2. KOVAN ÖĞRENCİ GELİŞTİRME EKİBİ */}
      <section className="landing-team-section">
        <div className="section-heading">
          <span className="section-eyebrow">BİZ KİMİZ?</span>
          <h2>KOVAN Öğrenci Geliştirme Ekibi</h2>
          <p className="section-sub-desc">
            KOVAN; üniversite öğrencisi 5 kişilik genç bir yazılım geliştirme ekibi tarafından sıfırdan, büyük bir emek ve tutkuyla geliştirilmektedir.
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

      {/* 3. ÖĞRENCİ EKİBİNE DESTEK / BAĞIŞ (DONATE) */}
      <section className="landing-donate-section">
        <div className="donate-banner-card">
          <div className="donate-banner-left">
            <div className="donate-icon-bubble">
              <Heart size={26} className="text-gold" />
            </div>
            <div>
              <span className="donate-eyebrow">ÖĞRENCİ PROJESİNE KATKI</span>
              <h2>Öğrenci Ekibimize Destek Olmak İster misiniz?</h2>
              <p>
                KOVAN'ın bulut sunucuları (Kubernetes kümesi), domain ve geliştirmekte olduğumuz Plaka Tanıma / QR donanım prototiplerinin maliyetlerini kendi öğrenci bütçemizle karşılıyoruz. 
                Gelişimimize katkıda bulunmak ya da ekibimize bir kahve ısmarlamak isterseniz bağış ve destekleriniz bizim için çok kıymetli!
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

      {/* BAĞIŞ VE DESTEK MODALI */}
      {showDonateModal && (
        <Modal
          title="Öğrenci Ekibimize Destek Olun"
          description="KOVAN sunucu, veritabanı ve donanım geliştirme bütçesine katkıda bulunun."
          onClose={() => setShowDonateModal(false)}
        >
          <div className="donate-modal-content">
            <div className="donate-modal-intro">
              <Coffee size={24} className="text-gold" />
              <p>
                Bizler üniversitede yazılım ve mühendislik eğitimi alan 5 öğrenciyiz. 
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
