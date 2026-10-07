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
  Wrench,
  Dumbbell,
  QrCode,
  Car,
  Heart,
  Coffee,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Brand, Button, Modal, ThemeToggle } from "./UI";

function LinkedInIcon({ size = 15, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

const TEAM_MEMBERS = [
  {
    name: "Reyhan Gökmen",
    role: "Frontend & UI/UX Developer",
    focus: "React mimarisi, tasarım sistemi, mobil uyumluluk ve kullanıcı deneyimi.",
    initials: "RG",
    linkedin: "https://www.linkedin.com/in/reyhan-g%C3%B6kmen-9103391a8",
  },
  {
    name: "Hakan Tekin",
    role: "Backend & Cloud DevOps Engineer",
    focus: "Spring Boot mimarisi, DigitalOcean Kubernetes altyapısı ve API güvenliği.",
    initials: "HT",
    linkedin: "https://www.linkedin.com/in/hakan-tekin-15122b26a",
  },
  {
    name: "Ceren Mıcık",
    role: "Full-Stack Developer",
    focus: "Uçtan uca servis entegrasyonu, veri modelleri ve iş akışı yönetimi.",
    initials: "CM",
    linkedin: "https://www.linkedin.com/in/ceren-m%C4%B1c%C4%B1k-5bb308294?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "Onur Kaçar",
    role: "Backend / Software Engineer",
    focus: "Yetkilendirme (RBAC) servisleri, veritabanı kurgusu ve API optimizasyonu.",
    initials: "OK",
    linkedin: "https://www.linkedin.com/in/onurkacaar/?isSelfProfile=true",
  },
  {
    name: "Yusuf Mermertaş",
    role: "Software Engineer / Product",
    focus: "Ürün kurgusu, modül analizi ve sistem entegrasyon süreçleri.",
    initials: "YM",
    linkedin: "https://www.linkedin.com/in/yusufmermertas?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
];

const FUTURE_MODULES = [
  {
    icon: Wrench,
    badge: "Dış Servis Pazaryeri",
    title: "Tesisat & Periyodik Bakım",
    desc: "Anlaşmalı sıhhi tesisat, elektrik, jeneratör ve asansör bakım ekiplerini doğrudan sakinlerle buluşturan garantili servis entegrasyonu.",
    status: "Altyapı Fonuyla Eklenecek",
  },
  {
    icon: Dumbbell,
    badge: "Akıllı Kota & Randevu",
    title: "Sosyal Tesis & Spor Rezervasyonu",
    desc: "Basketbol/futbol sahası, fitness salonu ve mangal alanları için çakışmasız saatlik rezervasyon ve adil kullanım kotası.",
    status: "Altyapı Fonuyla Eklenecek",
  },
  {
    icon: QrCode,
    badge: "IoT & Akıllı İnterkom",
    title: "QR Kod ile Temassız Giriş",
    desc: "Sakinler için mobil dijital anahtar; kurye ve misafirler için süreli (30 dk) tek kullanımlık QR kodlu kapı açma davetiyesi.",
    status: "Donanım Kiti Bekleniyor",
  },
  {
    icon: Car,
    badge: "AI Kamera & Bariyer",
    title: "Plaka Tanıma (PTS) Akıllı Otopark",
    desc: "Bariyer kameralarıyla entegre çalışan; sakin araçlarına otomatik geçiş, yabancı park uyarısı ve misafir araç ön bildirimi.",
    status: "Donanım Kiti Bekleniyor",
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
      {/* ÜST GEZİNME ÇUBUĞU */}
      <header className="landing-header">
        <div className="landing-brand-wrap">
          <Brand />
          <span className="landing-badge">Öğrenci Girişimi</span>
        </div>
        <div className="landing-header-actions">
          {onToggleTheme && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
          <Button secondary onClick={onBackToLogin}>
            <ArrowLeft size={15} /> Canlı Yönetim Paneli
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
            Apartman ve site yönetimlerinin aidat, sakin iletişimi, afet hazırlığı ve bakım süreçlerini modern mühendislik standartlarıyla tek çatı altında toplayan öğrenci girişimi.
          </p>

          <div className="landing-cta-row">
            <Button onClick={onBackToLogin} className="btn-hero-primary">
              Mevcut Paneli Canlı Deneyin <ArrowRight size={17} />
            </Button>
            <a
              href="#gelecek-moduller"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("gelecek-moduller");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className="btn-hero-secondary"
            >
              Gelecek Modüller & Ekibimiz &darr;
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
                <small>Geliştirici Ekip</small>
                <strong>5 Mühendis</strong>
                <span className="badge-sub">Üniversite Öğrenci Girişimi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÖNE ÇIKAN TEMEL ÖZELLİKLER */}
      <section id="ozellikler" className="landing-features-section">
        <div className="section-heading">
          <span className="section-eyebrow">NEDEN KOVAN?</span>
          <h2>Karmaşık site yönetimini zahmetsiz ve şeffaf hale getiriyoruz.</h2>
        </div>

        <div className="features-grid-3">
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

      {/* GELECEK VİZYONU & DONANIM ENTEGRASYONLARI */}
      <section id="gelecek-moduller" className="landing-roadmap-section">
        <div className="section-heading">
          <span className="section-eyebrow">YOL HARİTASI & GELECEK VİZYONU</span>
          <h2>Altyapı ve Donanım Bütçesi Karşılandıkça Eklenecek Akıllı Modüller</h2>
          <p className="section-sub-desc">
            KOVAN'ın temel çekirdeğini başarıyla tamamladık. Sitemizi tam otonom bir akıllı yaşam merkezine dönüştürmek için sunucu, IoT donanım kitleri ve dış servis API lisanslarını finanse ettikçe aşama aşama devreye alacağımız özellikler:
          </p>
        </div>

        <div className="roadmap-grid-4">
          {FUTURE_MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div className="roadmap-card" key={idx}>
                <div className="roadmap-card-top">
                  <div className="roadmap-icon-wrap">
                    <Icon size={22} className="text-gold" />
                  </div>
                  <span className="roadmap-badge-sub">{mod.badge}</span>
                </div>
                <h3>{mod.title}</h3>
                <p>{mod.desc}</p>
                <div className="roadmap-card-footer">
                  <span className="roadmap-status-pill">{mod.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="roadmap-funding-note">
          <Sparkles size={18} className="text-gold" />
          <span>
            <strong>Geliştirme Notu:</strong> Bu donanım prototipleri (ESP32/Raspberry Pi tabanlı QR okuyucu interkomlar ve PTS kamera modelleri) ekibimizin Ar-Ge masasında hazır olup; sunucu ve saha montaj fonlamasıyla birlikte sitelerde test edilecektir.
          </span>
        </div>
      </section>

      {/* GELİŞTİRİCİ EKİBİMİZ (ÖĞRENCİ GİRİŞİMİ) */}
      <section className="landing-team-section">
        <div className="section-heading">
          <span className="section-eyebrow">EKİBİMİZ</span>
          <h2>Geleceğin Akıllı Şehirlerini İnşa Eden Genç Mühendisler</h2>
          <p className="section-sub-desc">
            Bizler üniversite öğrencisi genç bir yazılım ve mühendislik ekibiyiz. KOVAN'ı açık fikirli, modern teknolojilerle ve büyük bir tutkuyla hayata geçiriyoruz.
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
                <span>LinkedIn Profili</span>
                <ExternalLink size={12} className="ext-icon" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* BAĞIŞ & DESTEK ÇAĞRISI (DONATE BANNER) */}
      <section className="landing-donate-section">
        <div className="donate-banner-card">
          <div className="donate-banner-left">
            <div className="donate-icon-bubble">
              <Heart size={26} className="text-gold" />
            </div>
            <div>
              <span className="donate-eyebrow">ÖĞRENCİ PROJESİNE KATKI</span>
              <h2>Geliştirici Ekibimize Destek Olmak İster misiniz?</h2>
              <p>
                KOVAN'ın bulut sunucuları (DigitalOcean Kubernetes kümesi), domain ve geliştirmekte olduğumuz Plaka Tanıma / QR donanım kitlerinin maliyetlerini kendi öğrenci bütçemizle karşılıyoruz. 
                Gelişimimize katkıda bulunmak ya da ekibimize bir kahve ısmarlamak isterseniz desteğiniz bizim için paha biçilemez!
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
              <span>Bir Kahve Ismarla / Destek Ol</span>
            </Button>
            <small className="donate-note">Gönüllü bağışlar doğrudan altyapı fonuna aktarılır.</small>
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
            <p>© 2026 Kovan Konut ve Site Yönetim Teknolojileri. Üniversite Öğrenci Girişimi.</p>
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
          title="Öğrenci Girişimimize Destek Olun"
          description="KOVAN bulut sunucu, veritabanı ve donanım Ar-Ge bütçesine katkıda bulunun."
          onClose={() => setShowDonateModal(false)}
        >
          <div className="donate-modal-content">
            <div className="donate-modal-intro">
              <Coffee size={24} className="text-gold" />
              <p>
                Bizler üniversitede mühendislik eğitimi alan 5 genç girişimciyiz. 
                Yapacağınız her katkı, Kubernetes bulut sunucu faturalarımızın ve IoT akıllı bariyer/kapı donanımlarının geliştirilmesinde doğrudan kullanılacaktır.
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
                  <code>TR64 0006 2000 0001 2345 6789 01</code>
                  <button
                    type="button"
                    className="btn-copy-code"
                    onClick={() => handleCopy("iban", "TR640006200000012345678901")}
                  >
                    {copiedKey === "iban" ? (
                      <>
                        <Check size={13} className="text-green-500" /> Kopyalandı!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Kopyala
                      </>
                    )}
                  </button>
                </div>
                <small className="method-hint">Açıklama: KOVAN Proje Destek</small>
              </div>

              {/* Kripto Cüzdanı */}
              <div className="donate-method-box">
                <div className="method-header">
                  <strong>Kripto Varlık ile Destek (USDT / TRC-20)</strong>
                  <span className="method-tag">Kripto</span>
                </div>
                <div className="method-copy-row">
                  <code>TYD2pBv7K1wZ9xQ4aM8mN3yC5eR6tP8sL2</code>
                  <button
                    type="button"
                    className="btn-copy-code"
                    onClick={() => handleCopy("crypto", "TYD2pBv7K1wZ9xQ4aM8mN3yC5eR6tP8sL2")}
                  >
                    {copiedKey === "crypto" ? (
                      <>
                        <Check size={13} className="text-green-500" /> Kopyalandı!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Kopyala
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="donate-modal-footer">
              <p className="donate-thanks-text">
                Desteğiniz ve inancınız için sonsuz teşekkür ederiz! ❤️
              </p>
              <Button type="button" onClick={() => setShowDonateModal(false)}>
                Anladım & Kapat
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
