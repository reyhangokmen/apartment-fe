import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Wallet,
  MessageSquare,
  Megaphone,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  CircleHelp,
  MapPin,
  Bell,
  Shield,
  Settings,
  Phone,
  Clock,
  Wrench,
  Mail,
  ArrowLeftRight,
  Home,
} from "lucide-react";
import Login from "./prototype/Login";
import Dashboard from "./prototype/Dashboard";
import Payments, { PaymentModal } from "./prototype/Payments";
import Requests, { RequestModal } from "./prototype/Requests";
import Apartments from "./prototype/Apartments";
import Roles from "./prototype/Roles";
import SiteSettings from "./prototype/SiteSettings";
import ResidentSettings from "./prototype/ResidentSettings";
import { Brand, Button, ErrorBoundary, Modal, ThemeToggle } from "./prototype/UI";
import useTheme from "./prototype/useTheme";
import {
  initialUsers,
  initialUnits,
  initialMemberships,
  initialRoles,
  initialDues,
  initialRequests,
  initialAnnouncements,
  resolveLogin,
  dateLabel,
  uid,
  TODAY,
} from "./prototype/data";
import "./App.css";

const navigation = [
  { id: "dashboard", label: "Genel Bakış", icon: LayoutDashboard },
  {
    id: "apartments",
    label: "Kat ve Daireler",
    icon: Building2,
    manager: true,
  },
  {
    id: "roles",
    label: "Rol ve Yetkiler",
    icon: Shield,
    manager: true,
  },
  { id: "payments", label: "Aidat ve Ödemeler", icon: Wallet },
  { id: "requests", label: "Talep ve Şikayetler", icon: MessageSquare },
  { id: "announcements", label: "Duyurular", icon: Megaphone },
  {
    id: "settings",
    label: "Site Ayarları",
    icon: Settings,
    manager: true,
  },
];

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [users, setUsers] = useState(initialUsers);
  const [units, setUnits] = useState(initialUnits);
  const [memberships, setMemberships] = useState(initialMemberships);
  const [roles, setRoles] = useState(initialRoles);
  const [dues, setDues] = useState(initialDues);
  const [requests, setRequests] = useState(initialRequests);
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [mobile, setMobile] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [siteMeta, setSiteMeta] = useState({
    name: "Kovan Sitesi",
    location: "Ataşehir, İstanbul",
    blockSummary: "3 blok, 48 daire",
  });
  const [siteMenuOpen, setSiteMenuOpen] = useState(true);

  const manager = session?.activeMode
    ? session.activeMode === "admin"
    : session?.role === "ADMIN";

  const user = users.find((u) => u.id === session?.userId) || session?.user || {
    name: "Mehmet Demir",
    email: "yonetim@site.com",
  };

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const switchAccountMode = useCallback((targetMode) => {
    if (!session) return;
    if (session.activeMode === targetMode) {
      setProfileMenuOpen(false);
      return;
    }
    const nextMode = targetMode;
    setSession((prev) => ({
      ...prev,
      activeMode: nextMode,
      role: nextMode === "admin" ? "ADMIN" : "RESIDENT",
    }));
    setTab("dashboard");
    setProfileMenuOpen(false);
    const targetAcc = session.accounts?.find((a) => a.mode === nextMode);
    setToast(
      nextMode === "admin"
        ? `${targetAcc?.title || "Site Yönetim Paneli"} moduna geçildi.`
        : `${targetAcc?.title || "Sakin Portalı"} moduna geçildi (${targetAcc?.subtitle || session.unitId || ""}).`
    );
    window.history.pushState(
      {},
      "",
      `/${nextMode === "admin" ? "manager" : "resident"}`
    );
  }, [session]);

  const navigate = useCallback(
    (next) => {
      setTab(next);
      if (next === "apartments" || next === "settings") {
        setSiteMenuOpen(true);
      }
      setMobile(false);
      window.history.pushState(
        {},
        "",
        `/${manager ? "manager" : "resident"}${next === "dashboard" ? "" : "/" + next}`,
      );
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [manager],
  );

  useEffect(() => {
    window.history.replaceState({}, "", "/login");
  }, []);

  useEffect(() => {
    const pop = () => {
      if (!session || window.location.pathname === "/login") {
        setSession(null);
        setTab("dashboard");
        setModal(null);
        window.history.replaceState({}, "", "/login");
        return;
      }
      const parts = window.location.pathname.split("/");
      const target = parts[2] || "dashboard";
      if (
        parts[1] !== (manager ? "manager" : "resident") ||
        !navigation.some((n) => n.id === target && (!n.manager || manager))
      ) {
        window.history.replaceState(
          {},
          "",
          `/${manager ? "manager" : "resident"}`,
        );
        setTab("dashboard");
      } else setTab(target);
      setModal(null);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [session, manager]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const closeModal = useCallback(() => setModal(null), []);
  const notify = (message) => setToast(message);

  const residentFor = (id) =>
    users.find(
      (u) => u.id === memberships.find((m) => m.unitId === id)?.userId,
    );

  const residentName = (id) => residentFor(id)?.name || "Boş daire";

  const visibleDues = manager
    ? dues
    : dues.filter((d) => d.unitId === session?.unitId);

  const visibleRequests = manager
    ? requests
    : requests.filter((r) => r.unitId === session?.unitId);

  const pay = (id, method) => {
    setDues((prev) =>
      prev.map((d) =>
        d.id === id &&
        (manager || d.unitId === session.unitId) &&
        d.status === "Ödenmemiş"
          ? {
              ...d,
              status: method === "card" ? "Ödendi" : "Onay bekliyor",
              method: method === "card" ? "Demo kart" : "Banka havalesi",
              paidDate: TODAY,
            }
          : d,
      ),
    );
    notify(
      method === "card"
        ? "Ödeme tamamlandı. Aidat durumunuz güncellendi."
        : "Ödeme bildiriminiz yönetici onayına gönderildi.",
    );
  };

  const createRequest = (r) => {
    setRequests((prev) => [r, ...prev]);
    notify(
      "Talebiniz oluşturuldu. Süreci Taleplerim ekranından takip edebilirsiniz.",
    );
  };

  const saveResident = (unitId, profile) => {
    const existing = memberships.find((m) => m.unitId === unitId);
    const duplicate = users.find(
      (u) =>
        u.email.toLocaleLowerCase("tr-TR") ===
          profile.email.toLocaleLowerCase("tr-TR") && u.id !== existing?.userId,
    );
    if (duplicate) {
      notify("Bu e-posta başka bir sakine ait. Farklı bir adres kullanın.");
      return;
    }
    if (existing)
      setUsers((prev) =>
        prev.map((u) => (u.id === existing.userId ? { ...u, ...profile } : u)),
      );
    else {
      const userId = uid(),
        membershipId = uid();
      setUsers((prev) => [...prev, { id: userId, ...profile }]);
      setMemberships((prev) => [
        ...prev,
        {
          id: membershipId,
          userId,
          unitId,
          blockId: unitId[0],
          siteId: "kovan",
        },
      ]);
      setRoles((prev) => [...prev, { membershipId, role: "RESIDENT" }]);
    }
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? {
              ...u,
              occupied: true,
              ...(profile.type ? { type: profile.type } : {}),
              ...(profile.m2 ? { m2: Number(profile.m2) } : {}),
            }
          : u,
      ),
    );
    notify(`${unitId} (${profile.type || "Daire"}) bilgileri güncellendi.`);
  };

  // Algoritmik toplu blok & daire ekleme fonksiyonu
  const handleBatchGenerate = (blockName, newUnits) => {
    setUnits((prev) => {
      const filtered = prev.filter((u) => u.block !== blockName);
      return [...filtered, ...newUnits];
    });
  };

  if (!session)
    return (
      <ErrorBoundary>
        <Login
        theme={theme}
        onToggleTheme={toggleTheme}
        users={users}
        units={units}
        onNotify={notify}
        onLogin={(identifier) => {
          const resolved = resolveLogin(identifier, users, memberships, roles);
          setSession(resolved);
          setTab("dashboard");
          setToast("");
          window.history.pushState(
            {},
            "",
            `/${resolved.role === "ADMIN" ? "manager" : "resident"}`,
          );
        }}
        onManagerRegister={(wizardData) => {
          const newManagerId = uid();
          const newManagerUser = {
            id: newManagerId,
            name: wizardData.managerName,
            email: wizardData.managerEmail,
            phone: wizardData.managerPhone,
          };
          const newMembershipId = uid();
          const newMembership = {
            id: newMembershipId,
            userId: newManagerId,
            siteId: "site-" + Date.now(),
            unitId: null,
            blockId: null,
          };

          const blocks = wizardData.blockNames
            .split(",")
            .map((s) => s.trim().toUpperCase());
          const generated = [];
          blocks.forEach((blk) => {
            let count = 1;
            for (let f = 1; f <= wizardData.floorsPerBlock; f++) {
              for (let u = 1; u <= wizardData.unitsPerFloor; u++) {
                let uNum =
                  wizardData.namingPattern === "floor"
                    ? `${f}${String(u).padStart(2, "0")}`
                    : wizardData.namingPattern === "block-prefix"
                    ? `${blk}-${count}`
                    : `${count}`;
                generated.push({
                  id: `${blk}-${uNum}`,
                  block: blk,
                  floor: f,
                  number: uNum,
                  occupied: false,
                  type: "2+1 Standart",
                });
                count++;
              }
            }
          });

          setUsers((prev) => [newManagerUser, ...prev]);
          setMemberships((prev) => [newMembership, ...prev]);
          setRoles((prev) => [
            ...prev,
            { membershipId: newMembershipId, role: "ADMIN" },
          ]);
          setUnits(generated);
          setSiteMeta({
            name: wizardData.siteName,
            location: `${wizardData.district}, ${wizardData.city}`,
            blockSummary: `${blocks.length} blok, ${generated.length} daire`,
          });
          setSession({
            userId: newManagerId,
            membershipId: newMembershipId,
            role: "ADMIN",
            unitId: null,
          });
          setTab("dashboard");
          notify(`${wizardData.siteName} kurulumu tamamlandı. Yönetici paneline yönlendirildiniz.`);
        }}
        onInviteAcceptExisting={({ userId, unitId, role, siteName }) => {
          const mId = uid();
          setMemberships((prev) => [
            ...prev,
            {
              id: mId,
              userId,
              unitId,
              blockId: unitId.split("-")[0],
              siteId: "kovan",
            },
          ]);
          setRoles((prev) => [...prev, { membershipId: mId, role: "RESIDENT" }]);
          setUnits((prev) =>
            prev.map((u) => (u.id === unitId ? { ...u, occupied: true } : u)),
          );
          setSession({
            userId,
            membershipId: mId,
            role: "RESIDENT",
            unitId,
          });
          setTab("dashboard");
        }}
        onInviteRegisterNew={({ name, email, phone, password, unitId, role, siteName }) => {
          const uId = uid();
          const mId = uid();
          const newUser = { id: uId, name, email, phone, password: password || "demo123" };
          setUsers((prev) => [...prev, newUser]);
          setMemberships((prev) => [
            ...prev,
            {
              id: mId,
              userId: uId,
              unitId,
              blockId: unitId.split("-")[0],
              siteId: "kovan",
            },
          ]);
          setRoles((prev) => [...prev, { membershipId: mId, role: "RESIDENT" }]);
          setUnits((prev) =>
            prev.map((u) => (u.id === unitId ? { ...u, occupied: true } : u)),
          );
          setSession({
            userId: uId,
            membershipId: mId,
            role: "RESIDENT",
            unitId,
          });
          setTab("dashboard");
          notify(`Hoş geldiniz ${name}! Üyeliğiniz tamamlandı ve ${unitId} dairesine bağlandı.`);
        }}
      />
      </ErrorBoundary>
    );

  const activeCount = visibleRequests.filter(
    (r) => r.status !== "Çözüldü",
  ).length;

  return (
    <div className="app-shell">
      {mobile && (
        <button
          className="sidebar-backdrop"
          aria-label="Menüyü kapat"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="icon-button mobile-only"
            aria-label="Menüyü kapat"
            onClick={() => setMobile(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="site-selector">
          <span className="site-icon">
            <Building2 size={20} />
          </span>
          <div>
            <strong>{siteMeta.name}</strong>
            <small>{siteMeta.location}</small>
          </div>
          <ChevronsUpDown size={15} />
        </div>

        <div className="nav-caption">ÇALIŞMA ALANI</div>
        <nav aria-label="Ana menü">
          {/* Genel Bakış */}
          <button
            onClick={() => navigate("dashboard")}
            aria-current={tab === "dashboard" ? "page" : undefined}
            className={`nav-item ${tab === "dashboard" ? "active" : ""}`}
          >
            <LayoutDashboard size={19} />
            <span>Genel Bakış</span>
          </button>

          {/* Yönetici İçin: Site Grubu (Kat & Daireler + Site Ayarları) */}
          {manager && (
            <div className="nav-group">
              <button
                type="button"
                className={`nav-item nav-group-header ${tab === "apartments" || tab === "settings" ? "group-active" : ""}`}
                onClick={() => setSiteMenuOpen(!siteMenuOpen)}
                aria-expanded={siteMenuOpen}
              >
                <div className="nav-group-title">
                  <Building2 size={19} />
                  <span>Site</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`menu-chevron ${siteMenuOpen ? "open" : ""}`}
                />
              </button>

              {siteMenuOpen && (
                <div className="nav-sub-items">
                  <button
                    type="button"
                    onClick={() => navigate("apartments")}
                    aria-current={tab === "apartments" ? "page" : undefined}
                    className={`nav-sub-item ${tab === "apartments" ? "active" : ""}`}
                  >
                    <span className="sub-bullet" />
                    <span>Kat ve Daireler</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("settings")}
                    aria-current={tab === "settings" ? "page" : undefined}
                    className={`nav-sub-item ${tab === "settings" ? "active" : ""}`}
                  >
                    <span className="sub-bullet" />
                    <span>Ayarlar</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Rol ve Yetkiler (Yönetici) */}
          {manager && (
            <button
              onClick={() => navigate("roles")}
              aria-current={tab === "roles" ? "page" : undefined}
              className={`nav-item ${tab === "roles" ? "active" : ""}`}
            >
              <Shield size={19} />
              <span>Rol ve Yetkiler</span>
            </button>
          )}

          {/* Ortak: Aidat ve Ödemeler */}
          <button
            onClick={() => navigate("payments")}
            aria-current={tab === "payments" ? "page" : undefined}
            className={`nav-item ${tab === "payments" ? "active" : ""}`}
          >
            <Wallet size={19} />
            <span>Aidat ve Ödemeler</span>
          </button>

          {/* Ortak: Talep ve Şikayetler */}
          <button
            onClick={() => navigate("requests")}
            aria-current={tab === "requests" ? "page" : undefined}
            className={`nav-item ${tab === "requests" ? "active" : ""}`}
          >
            <MessageSquare size={19} />
            <span>{!manager ? "Taleplerim" : "Talep ve Şikayetler"}</span>
            {activeCount > 0 && <span className="nav-count">{activeCount}</span>}
          </button>

          {/* Ortak: Duyurular */}
          <button
            onClick={() => navigate("announcements")}
            aria-current={tab === "announcements" ? "page" : undefined}
            className={`nav-item ${tab === "announcements" ? "active" : ""}`}
          >
            <Megaphone size={19} />
            <span>Duyurular</span>
          </button>

          {/* Sakin İçin: Hesap & Daire Ayarları */}
          {!manager && (
            <button
              onClick={() => navigate("settings")}
              aria-current={tab === "settings" ? "page" : undefined}
              className={`nav-item ${tab === "settings" ? "active" : ""}`}
            >
              <Settings size={19} />
              <span>Ayarlar</span>
            </button>
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="site-mini">
            <span className="eyebrow">BİRLİKTE DAHA İYİ</span>
            <img src="/brand/KOVAN_Binalar.svg" alt="" />
            <strong>Yaşamın düzeni.</strong>
            <span>
              {siteMeta.name} · {siteMeta.blockSummary}
            </span>
          </div>
          <button
            className="nav-item"
            onClick={() => setModal({ type: "help" })}
          >
            <CircleHelp size={19} />
            <span>Yardım ve İletişim</span>
            <ArrowChevron />
          </button>
          <div className="sidebar-footnote">
            <span className="status-dot" />
            Kovan ERP v2.4<span>2026</span>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-only"
              aria-label="Menüyü aç"
              onClick={() => setMobile(true)}
            >
              <Menu size={20} />
            </button>
            <span className="desktop-only">Çalışma alanı</span>
            <ChevronRight size={14} className="desktop-only" />
            {tab === "settings" ? (
              manager ? (
                <>
                  <span className="desktop-only">Site</span>
                  <ChevronRight size={14} className="desktop-only" />
                  <strong>Site Ayarları</strong>
                </>
              ) : (
                <strong>Hesap ve Daire Ayarları</strong>
              )
            ) : tab === "apartments" ? (
              <>
                <span className="desktop-only">Site</span>
                <ChevronRight size={14} className="desktop-only" />
                <strong>Kat ve Daireler</strong>
              </>
            ) : (
              <strong>{navigation.find((n) => n.id === tab)?.label}</strong>
            )}
          </div>
          <div className="topbar-right">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              className="notification-button icon-button"
              aria-label="Duyuruları görüntüle"
              onClick={() => navigate("announcements")}
            >
              <Bell size={19} />
              <i />
            </button>

            {/* Profil ve Rol Değiştirici Açılır Menüsü */}
            <div className="profile-dropdown-container" ref={profileRef}>
              <button
                type="button"
                className={`user-profile-trigger ${profileMenuOpen ? "is-active" : ""}`}
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
              >
                <span className="avatar">
                  {(user?.name || "K")
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="user-profile-meta">
                  <div className="user-profile-name-row">
                    <strong>{user?.name}</strong>
                  </div>
                  <small>
                    {manager
                      ? session?.accounts?.find((a) => a.mode === "admin")?.subtitle || "Site Yöneticisi"
                      : session?.accounts?.find((a) => a.mode === "resident")?.subtitle ||
                        (session?.unitId ? `Daire ${session.unitId}` : "Konut Sakini")}
                  </small>
                </div>
                <ChevronDown
                  size={14}
                  className={`profile-chevron ${profileMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Açılır Menü */}
              {profileMenuOpen && (
                <div className="profile-dropdown-menu">
                  {/* Profil Başlığı */}
                  <div className="profile-dropdown-header">
                    <span className="avatar avatar-lg">
                      {(user?.name || "K")
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div className="header-meta">
                      <strong>{user?.name}</strong>
                      <span className="header-email">{user?.email}</span>
                    </div>
                  </div>

                  {/* Çoklu Rol / Hesap Geçiş Bölümü (Burak Maydan, Av. Selin vb.) */}
                  {session?.accounts && session.accounts.length > 1 && (
                    <div className="profile-dropdown-section">
                      <span className="profile-section-label">Hesaplar ve Roller</span>
                      <div className="profile-accounts-list">
                        {session.accounts.map((acc) => {
                          const isActive = acc.mode === (manager ? "admin" : "resident");
                          return (
                            <button
                              key={acc.mode}
                              type="button"
                              className={`profile-account-item ${isActive ? "active" : ""}`}
                              onClick={() => switchAccountMode(acc.mode)}
                            >
                              <span className="profile-account-icon">
                                {acc.icon === "home" ? <Home size={15} /> : <Shield size={15} />}
                              </span>
                              <div className="profile-account-details">
                                <span className="profile-account-title">{acc.title}</span>
                                <span className="profile-account-sub">{acc.subtitle}</span>
                              </div>
                              {isActive ? (
                                <span className="profile-account-active-badge">
                                  <CheckCircle2 size={14} />
                                  <span>Aktif</span>
                                </span>
                              ) : (
                                <span className="profile-account-switch-hint">
                                  Geçiş Yap
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="profile-dropdown-divider" />

                  {/* Hızlı Bağlantılar */}
                  <div className="profile-dropdown-links">
                    <button
                      type="button"
                      className="profile-link-item"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("settings");
                      }}
                    >
                      <Settings size={15} />
                      <span>{manager ? "Site ve Yönetim Ayarları" : "Hesap ve Daire Ayarları"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sağda Açık Duran Çıkış Yap Butonu */}
            <button
              type="button"
              className="logout-button"
              aria-label="Çıkış Yap"
              onClick={() => {
                setProfileMenuOpen(false);
                setSession(null);
                setModal(null);
                setMobile(false);
                setToast("");
                window.history.pushState({}, "", "/login");
              }}
            >
              <LogOut size={16} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </header>
        <main className="page-content">
          {tab !== "dashboard" && (
            <div className="page-intro module-title">
              <div>
                <span className="eyebrow">
                  {tab === "settings"
                    ? manager
                      ? "SİTE YÖNETİMİ / AYARLAR"
                      : "PROFİL & DAİRE YÖNETİMİ"
                    : tab === "apartments"
                    ? "SİTE YÖNETİMİ / DAİRELER"
                    : siteMeta.name.toUpperCase()}
                </span>
                <h1>
                  {tab === "settings"
                    ? manager
                      ? "Site Ayarları"
                      : "Hesap & Daire Ayarları"
                    : navigation.find((n) => n.id === tab)?.label}
                  <span className="heading-dot">.</span>
                </h1>
              </div>
              <span className="demo-pill">
                <span />
                Aktif Yönetim
              </span>
            </div>
          )}
          <ErrorBoundary>
          {tab === "dashboard" && (
            <Dashboard
              manager={manager}
              user={user}
              units={units}
              dues={visibleDues}
              requests={visibleRequests}
              announcements={initialAnnouncements}
              onNavigate={navigate}
              onPay={(due) => setModal({ type: "pay", due })}
              onRequest={() => setModal({ type: "request" })}
              residentName={residentName}
            />
          )}{" "}
          {tab === "apartments" && manager && (
            <Apartments
              units={units}
              users={users}
              residentFor={residentFor}
              onSave={saveResident}
              onBatchGenerate={handleBatchGenerate}
              onNotify={notify}
              siteName={siteMeta?.name || "Kovan Sitesi"}
            />
          )}{" "}
          {tab === "roles" && manager && (
            <Roles
              users={users}
              units={units}
              memberships={memberships}
              residentFor={residentFor}
              onNotify={notify}
            />
          )}{" "}
          {tab === "settings" && (
            manager ? (
              <SiteSettings
                siteMeta={siteMeta}
                onUpdateSiteMeta={setSiteMeta}
                units={units}
                onNotify={notify}
              />
            ) : (
              <ResidentSettings
                user={user}
                session={session}
                units={units}
                onNotify={notify}
                onSwitchToManager={() => switchAccountMode("admin")}
              />
            )
          )}{" "}
          {tab === "payments" && (
            <Payments
              dues={visibleDues}
              units={units}
              residentName={residentName}
              manager={manager}
              onPay={pay}
              onAccrue={(items) => {
                if (!manager) return;
                setDues((prev) => [...items, ...prev]);
                notify(`${items.length} daire için borç kaydı oluşturuldu.`);
              }}
              onReview={(id, approved) => {
                if (!manager) return;
                setDues((prev) =>
                  prev.map((d) =>
                    d.id === id
                      ? {
                          ...d,
                          status: approved ? "Ödendi" : "Ödenmemiş",
                          paidDate: approved ? TODAY : null,
                        }
                      : d,
                  ),
                );
                notify(
                  approved
                    ? "Ödeme onaylandı."
                    : "Bildirim reddedildi. Borç yeniden ödenmemiş olarak işaretlendi.",
                );
              }}
              notify={notify}
            />
          )}{" "}
          {tab === "requests" && (
            <Requests
              requests={visibleRequests}
              manager={manager}
              residentName={residentName}
              unitId={session?.unitId}
              onCreate={createRequest}
              onStatus={(id, status) => {
                if (!manager) return;
                setRequests((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, status } : r)),
                );
                notify("Talep durumu güncellendi.");
              }}
            />
          )}{" "}
          {tab === "announcements" && (
            <div className="announcements-page">
              {initialAnnouncements.map((a) => (
                <article className="full-announcement" key={a.id}>
                  <span className="announcement-date">
                    <strong>
                      {new Date(`${a.date}T12:00:00`).getDate()}
                    </strong>
                    <span>
                      {new Date(`${a.date}T12:00:00`)
                        .toLocaleDateString("tr-TR", { month: "short" })
                        .toLocaleUpperCase("tr-TR")}
                    </span>
                  </span>
                  <div>
                    <span className="gold-label">{a.category}</span>
                    <h2>{a.title}</h2>
                    <p>{a.body}</p>
                    <footer>
                      <span>Kovan Site Yönetimi</span>
                      <span>{dateLabel(a.date)}</span>
                    </footer>
                  </div>
                </article>
              ))}
            </div>
          )}
          </ErrorBoundary>
          <footer className="page-footer">
            <span>© 2026 Kovan · Yaşamın düzeni.</span>
            <span>
              Tüm sistem modülleri aktif · BMS-137, BMS-138, BMS-142 tam entegre.
            </span>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
          <button aria-label="Bildirimi kapat" onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {modal?.type === "pay" && (
        <PaymentModal
          due={modal.due}
          onClose={closeModal}
          onSubmit={(id, method) => {
            pay(id, method);
            closeModal();
          }}
        />
      )}
      {modal?.type === "request" && (
        <RequestModal
          unitId={session?.unitId}
          onClose={closeModal}
          onSubmit={(r) => {
            createRequest(r);
            closeModal();
          }}
        />
      )}
      {modal?.type === "help" && (
        <Modal
          title="Yardım ve İletişim Rehberi"
          description={`${siteMeta.name} yönetim, güvenlik ve teknik destek irtibatları`}
          onClose={closeModal}
        >
          <div className="help-modal-content">
            <div className="help-cards-grid">
              {/* 1. Yönetim Ofisi */}
              <div className="help-contact-card">
                <div className="help-card-icon text-gold">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4>Yönetim Ofisi</h4>
                  <span className="help-badge">A Blok · Zemin Kat</span>
                  <div className="help-info-list">
                    <div className="help-info-item">
                      <Clock size={13} />
                      <span>Hafta İçi: 09:00 – 18:00</span>
                    </div>
                    <div className="help-info-item">
                      <Phone size={13} />
                      <span>Dahili: <strong>100</strong> (0532 555 99 00)</span>
                    </div>
                    <div className="help-info-item">
                      <Mail size={13} />
                      <span>yonetim@kovan.app</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 7/24 Güvenlik & Danışma */}
              <div className="help-contact-card">
                <div className="help-card-icon text-gold">
                  <Shield size={20} />
                </div>
                <div>
                  <h4>Güvenlik & Danışma</h4>
                  <span className="help-badge success">7/24 Kesintisiz Hizmet</span>
                  <div className="help-info-list">
                    <div className="help-info-item">
                      <MapPin size={13} />
                      <span>Ana Giriş Nizamiyesi</span>
                    </div>
                    <div className="help-info-item">
                      <Phone size={13} />
                      <span>Dahili: <strong>101</strong> (0532 555 99 01)</span>
                    </div>
                    <div className="help-info-item">
                      <Clock size={13} />
                      <span>Misafir Araç & Kargo Kabulü</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Teknik Servis & Arıza Bildirimi */}
              <div className="help-contact-card full-span">
                <div className="help-card-icon text-gold">
                  <Wrench size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center justify-between">
                    <h4>Teknik Servis & Arıza Masası</h4>
                    <span className="help-badge progress">Dahili: 102</span>
                  </div>
                  <p className="help-desc">
                    Ortak alan elektrik, hidrofor, asansör veya sıhhi tesisat arızalarını doğrudan sistem üzerinden iletebilir ve durumunu takip edebilirsiniz.
                  </p>
                  <div className="help-actions-row">
                    <Button
                      type="button"
                      secondary
                      onClick={() => {
                        closeModal();
                        navigate("requests");
                      }}
                    >
                      <MessageSquare size={14} /> Talepleri Görüntüle
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        closeModal();
                        setModal({ type: "request" });
                      }}
                    >
                      Yeni Talep / Arıza Bildir
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* SSS / Hızlı İpuçları Kutusu */}
            <div className="help-faq-box">
              <div className="faq-title">
                <CircleHelp size={15} className="text-gold" />
                <strong>Hızlı Bilgiler & Sıkça Sorulanlar</strong>
              </div>
              <ul className="faq-list">
                <li>
                  <strong>Aidat Ödemeleri:</strong> Sol menüdeki <em>"Aidat ve Ödemeler"</em> sekmesinden kredi kartı veya havale ile anında ödenebilir.
                </li>
                <li>
                  <strong>Otopark & Plaka Girişi:</strong> Araç plakanızı <em>"Ayarlar &gt; Araçlarım"</em> sekmesinden kaydederek bariyerden otomatik geçebilirsiniz.
                </li>
                <li>
                  <strong>Ziyaretçi Araçları:</strong> Güvenlik nizamiyesine önceden bilgi vererek misafir otoparkına yönlendirilmesini sağlayabilirsiniz.
                </li>
              </ul>
            </div>

            <div className="modal-footer mt-3">
              <Button secondary type="button" onClick={closeModal} className="w-full">
                Kapat
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ArrowChevron() {
  return <ChevronRight size={15} />;
}
