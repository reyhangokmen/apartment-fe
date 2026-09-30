import { useState } from "react";
import {
  User,
  Car,
  Bell,
  Shield,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  Home,
  AlertCircle,
  Sparkles,
  Info,
  Heart,
  ArrowLeftRight,
} from "lucide-react";
import { Button, Field, Panel } from "./UI";

export default function ResidentSettings({
  user,
  session,
  units = [],
  onNotify,
  onSwitchToManager,
}) {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'vehicles' | 'notifications' | 'security'

  // Sakinin Dairesi
  const residentUnit = units.find((u) => u.id === session?.unitId) || {
    id: session?.unitId || "A-12",
    block: session?.unitId?.split("-")[0] || "A",
    number: session?.unitId?.split("-")[1] || "12",
    floor: 3,
    type: "2+1",
    m2: 95,
  };

  // 1. Profil & İletişim Durumları
  const [profileData, setProfileData] = useState({
    name: user?.name || "Ahmet Yılmaz",
    email: user?.email || "ahmet.yilmaz@site.com",
    phone: user?.phone || "0532 555 12 34",
    role: "Kat Maliki (Ev Sahibi)",
    residentCount: "3", // Dairede ikamet eden toplam kişi sayısı
    hasPet: true,
    petDetails: "1 Kedi",
    // Acil Durum İletişimi
    emergencyName: "Zeynep Yılmaz",
    emergencyRelation: "Eşi",
    emergencyPhone: "0533 444 55 66",
  });

  // 2. Araç & Plaka Listesi (PTS İçin)
  const [vehicles, setVehicles] = useState([
    { id: 1, plate: "34 BJK 1903", brand: "Volkswagen Golf", color: "Beyaz" },
  ]);
  const [newPlate, setNewPlate] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newColor, setNewColor] = useState("");
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  // 3. Kişisel Bildirim Tercihleri
  const [notifications, setNotifications] = useState({
    smsDuesCreated: true,
    smsDuesReminder: true,
    emailMonthlyStatement: true,
    emailAnnouncements: true,
    requestAlerts: true,
    nightSilentMode: true,
  });

  // 4. Güvenlik & Gizlilik
  const [privacy, setPrivacy] = useState({
    hidePhoneInDirectory: true, // Komşuluk rehberinde telefonum gizli
    hidePlateInDirectory: true, // Otopark listesinde plakam gizli
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onNotify?.("Hesap ve profil bilgileriniz başarıyla güncellendi.");
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const cleanPlate = newPlate.trim().toUpperCase();
    if (!cleanPlate) return;
    setVehicles([
      ...vehicles,
      {
        id: Date.now(),
        plate: cleanPlate,
        brand: newBrand.trim() || "Belirtilmedi",
        color: newColor.trim() || "Belirtilmedi",
      },
    ]);
    setNewPlate("");
    setNewBrand("");
    setNewColor("");
    setShowAddVehicle(false);
    onNotify?.(`${cleanPlate} plakalı araç otopark tanıma sistemine eklendi.`);
  };

  const handleDeleteVehicle = (id, plate) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
    onNotify?.(`${plate} plakalı araç kaydı silindi.`);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Girdiğiniz yeni şifreler eşleşmiyor.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMsg("");
    onNotify?.("Giriş şifreniz başarıyla değiştirildi.");
  };

  return (
    <div className="resident-settings-container">
      <div className="module-actions">
        <p>
          Kişisel profilinizi, dairenize tanımlı araç plakalarını, bildirim ayarlarını ve gizlilik tercihlerinizi yapılandırın.
        </p>
        <span className="muted">
          Daire: Blok {residentUnit.block}, No {residentUnit.number} ({residentUnit.type})
        </span>
      </div>

      {/* 4 Sadeleştirilmiş Sekme (KVKK Uyumlu) */}
      <div className="subnav-tabs settings-tabs-nav">
        <button
          type="button"
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          <User size={16} /> Profil & Daire
        </button>
        <button
          type="button"
          className={activeTab === "vehicles" ? "active" : ""}
          onClick={() => setActiveTab("vehicles")}
        >
          <Car size={16} /> Araçlarım & Plaka ({vehicles.length})
        </button>
        <button
          type="button"
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          <Bell size={16} /> Bildirim Tercihleri
        </button>
        <button
          type="button"
          className={activeTab === "security" ? "active" : ""}
          onClick={() => setActiveTab("security")}
        >
          <Shield size={16} /> Güvenlik & Gizlilik
        </button>
      </div>

      {/* SEKME 1: PROFİL & DAİRE KÜNYESİ */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile}>
          {session?.hasDualRole && (
            <div className="dual-role-banner-card">
              <div className="flex items-center gap-3">
                <div className="dual-role-banner-icon">
                  <Shield size={20} />
                </div>
                <div>
                  <strong>Yönetim Kurulu Üyeliği Aktif</strong>
                  <p>
                    Hesabınız Daire {session.unitId} sakinliğinize ek olarak Kovan Sitesi Yönetim Kurulu Üyesi yetkisine sahiptir. İstediğiniz an Yönetim Paneline geçiş yapabilirsiniz.
                  </p>
                </div>
              </div>
              <Button type="button" onClick={onSwitchToManager}>
                <ArrowLeftRight size={14} /> Yönetim Paneline Geçiş Yap
              </Button>
            </div>
          )}

          <Panel
            title="Kişisel Bilgiler & İletişim"
            subtitle="Yönetim ile iletişimde kullanılacak ad-soyad, telefon ve acil durum irtibatı"
          >
            <div className="settings-grid">
              {/* Daire Künyesi Kartı */}
              <div className="settings-card-box">
                <div className="settings-card-header">
                  <div className="flex items-center gap-2">
                    <Home size={18} className="text-gold" />
                    <strong>İkamet Edilen Daire Bilgisi</strong>
                  </div>
                  <span className="badge complete">{profileData.role}</span>
                </div>
                <div className="grid-3-col mt-2">
                  <div className="info-stat-pill">
                    <small>Bağımsız Bölüm</small>
                    <strong>Blok {residentUnit.block} · No {residentUnit.number}</strong>
                  </div>
                  <div className="info-stat-pill">
                    <small>Daire Tipi & Kat</small>
                    <strong>{residentUnit.type || "2+1"} ({residentUnit.floor || 3}. Kat)</strong>
                  </div>
                  <div className="info-stat-pill">
                    <small>Daire Alanı</small>
                    <strong>{residentUnit.m2 || 95} m²</strong>
                  </div>
                </div>
              </div>

              <div className="grid-2-col">
                <Field label="Ad Soyad">
                  <input
                    required
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </Field>
                <Field label="Cep Telefonu">
                  <input
                    required
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />
                </Field>
              </div>

              <Field label="E-posta Adresi">
                <input
                  required
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </Field>

              {/* Dairede Yaşam & Afet Tahliye Özeti (KVKK Uyumlu Sayısal Alan) */}
              <div className="settings-sub-section">
                <h4>Daire İkamet & Yaşam Bilgisi</h4>
                <p className="text-xs text-muted mt-1">
                  Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca aile bireylerinin şahsi kimlik verileri toplanmaz; yalnızca bina yoğunluğu ve afet tahliyesi için sayısal bilgi tutulur.
                </p>

                <div className="grid-2-col mt-2">
                  <Field label="Dairede İkamet Eden Toplam Kişi Sayısı">
                    <select
                      value={profileData.residentCount}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          residentCount: e.target.value,
                        })
                      }
                    >
                      <option value="1">1 Kişi (Yalnız İkamet)</option>
                      <option value="2">2 Kişi</option>
                      <option value="3">3 Kişi</option>
                      <option value="4">4 Kişi</option>
                      <option value="5">5 Kişi ve Üzeri</option>
                    </select>
                  </Field>

                  <Field label="Evcil Hayvan Kaydı">
                    <select
                      value={profileData.hasPet ? "var" : "yok"}
                      onChange={(e) => {
                        const isVar = e.target.value === "var";
                        setProfileData({
                          ...profileData,
                          hasPet: isVar,
                          petDetails: isVar ? (profileData.petDetails || "1 Kedi") : "",
                        });
                      }}
                    >
                      <option value="yok">Evcil Hayvan Yok</option>
                      <option value="var">Evcil Hayvan Var</option>
                    </select>
                  </Field>
                </div>

                {profileData.hasPet && (
                  <div className="mt-2">
                    <Field label="Evcil Hayvan Cinsi / Notu">
                      <input
                        placeholder="Örn: 1 Kedi, 1 Küçük Irk Köpek"
                        value={profileData.petDetails}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            petDetails: e.target.value,
                          })
                        }
                      />
                    </Field>
                  </div>
                )}
              </div>

              {/* Acil Durum İletişimi */}
              <div className="settings-sub-section">
                <h4>Acil Durum İrtibat Kişisi (Yangın, Su Basması, Kaza vb.)</h4>
                <p className="text-xs text-muted mt-1">
                  Size ulaşılamadığı acil durumlarda site güvenliğinin arayabileceği yakınınız:
                </p>
                <div className="grid-3-col mt-2">
                  <Field label="Yakın Adı Soyadı">
                    <input
                      value={profileData.emergencyName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          emergencyName: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Yakınlık Derecesi">
                    <input
                      placeholder="Örn: Eşi, Kardeşi, Komşusu"
                      value={profileData.emergencyRelation}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          emergencyRelation: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Yakın Telefonu">
                    <input
                      type="tel"
                      value={profileData.emergencyPhone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          emergencyPhone: e.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
              </div>

              <div className="settings-footer-actions">
                <Button type="submit">
                  <Save size={16} /> Profil Bilgilerini Kaydet
                </Button>
              </div>
            </div>
          </Panel>
        </form>
      )}

      {/* SEKME 2: ARAÇLAR & PLAKA TANIMLAMA (PTS) */}
      {activeTab === "vehicles" && (
        <Panel
          title="Kayıtlı Araçlarım & Otopark Bariyer Tanımı"
          subtitle="Site giriş bariyerinden otomatik geçebilmeniz için Plaka Tanıma Sistemi (PTS) araç kaydı"
        >
          <div className="settings-grid">
            <div className="flex items-center justify-between">
              <div>
                <strong>Dairenize Tanımlı Araçlar</strong>
                <p className="text-xs text-muted">
                  Bariyer kamerası buradaki plakaları otomatik tanıyarak beklemeden geçiş sağlar.
                </p>
              </div>
              <Button
                type="button"
                secondary
                onClick={() => setShowAddVehicle(!showAddVehicle)}
              >
                <Plus size={16} /> {showAddVehicle ? "Vazgeç" : "Yeni Araç Ekle"}
              </Button>
            </div>

            {/* Yeni Araç Ekleme Formu */}
            {showAddVehicle && (
              <form onSubmit={handleAddVehicle} className="settings-card-box">
                <strong className="text-xs font-semibold">Yeni Araç & Plaka Kaydı</strong>
                <div className="grid-3-col mt-2">
                  <Field label="Araç Plakası">
                    <input
                      required
                      autoFocus
                      placeholder="Örn: 34 ABC 123"
                      style={{ textTransform: "uppercase", fontWeight: "700" }}
                      value={newPlate}
                      onChange={(e) => setNewPlate(e.target.value)}
                    />
                  </Field>
                  <Field label="Marka & Model">
                    <input
                      placeholder="Örn: Renault Megane"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                    />
                  </Field>
                  <Field label="Renk">
                    <input
                      placeholder="Örn: Beyaz"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                    />
                  </Field>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    type="button"
                    secondary
                    onClick={() => setShowAddVehicle(false)}
                  >
                    İptal
                  </Button>
                  <Button type="submit">Plakayı Kaydet</Button>
                </div>
              </form>
            )}

            {/* Mevcut Araç Kartları */}
            <div className="vehicle-cards-list">
              {vehicles.map((v) => (
                <div key={v.id} className="vehicle-item-row">
                  <div className="flex items-center gap-3">
                    <div className="plate-badge">{v.plate}</div>
                    <div>
                      <strong className="text-sm">{v.brand}</strong>
                      <span className="text-xs text-muted block">Renk: {v.color}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge complete">
                      <CheckCircle2 size={12} /> Bariyer Yetkili
                    </span>
                    <button
                      type="button"
                      className="icon-button"
                      title="Aracı Sil"
                      onClick={() => handleDeleteVehicle(v.id, v.plate)}
                    >
                      <Trash2 size={16} className="text-danger" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      )}

      {/* SEKME 3: BİLDİRİM TERCİHLERİ */}
      {activeTab === "notifications" && (
        <Panel
          title="Kişisel Bildirim Tercihleri"
          subtitle="SMS, E-posta ve mobil bildirimlerin hangi durumlarda iletileceğini belirleyin"
        >
          <div className="settings-grid">
            <div className="settings-card-box">
              <strong className="text-xs font-semibold">Aidat & Finans Bildirimleri</strong>
              <div className="mt-2 flex flex-col gap-2">
                <label className="checkbox-item-custom">
                  <input
                    type="checkbox"
                    checked={notifications.smsDuesCreated}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        smsDuesCreated: e.target.checked,
                      })
                    }
                  />
                  <span>Yeni aylık aidat tahakkuk ettiğinde SMS ile bilgilendir</span>
                </label>

                <label className="checkbox-item-custom">
                  <input
                    type="checkbox"
                    checked={notifications.smsDuesReminder}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        smsDuesReminder: e.target.checked,
                      })
                    }
                  />
                  <span>Aidat son ödeme gününden 3 gün önce hatırlatıcı SMS al</span>
                </label>

                <label className="checkbox-item-custom">
                  <input
                    type="checkbox"
                    checked={notifications.emailMonthlyStatement}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailMonthlyStatement: e.target.checked,
                      })
                    }
                  />
                  <span>Her ay başında hesap ekstremi e-posta olarak ilet</span>
                </label>
              </div>
            </div>

            <div className="settings-card-box">
              <strong className="text-xs font-semibold">Site Yaşamı & Talepler</strong>
              <div className="mt-2 flex flex-col gap-2">
                <label className="checkbox-item-custom">
                  <input
                    type="checkbox"
                    checked={notifications.emailAnnouncements}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailAnnouncements: e.target.checked,
                      })
                    }
                  />
                  <span>Yönetim duyurularını ve toplantı çağrılarını e-posta ile al</span>
                </label>

                <label className="checkbox-item-custom">
                  <input
                    type="checkbox"
                    checked={notifications.requestAlerts}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        requestAlerts: e.target.checked,
                      })
                    }
                  />
                  <span>Açtığım talep ve arıza bildirimlerinin durumu güncellendiğinde anında SMS al</span>
                </label>

                <label className="checkbox-item-custom">
                  <input
                    type="checkbox"
                    checked={notifications.nightSilentMode}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        nightSilentMode: e.target.checked,
                      })
                    }
                  />
                  <span>Gece saatlerinde (23:00 - 08:00) acil durumlar hariç bildirimleri sessize al</span>
                </label>
              </div>
            </div>

            <div className="settings-footer-actions">
              <Button
                type="button"
                onClick={() => onNotify?.("Bildirim tercihleriniz güncellendi.")}
              >
                <Save size={16} /> Tercihleri Kaydet
              </Button>
            </div>
          </div>
        </Panel>
      )}

      {/* SEKME 4: GÜVENLİK & GİZLİLİK (KVKK) */}
      {activeTab === "security" && (
        <div className="settings-grid">
          {/* Şifre Değiştirme */}
          <form onSubmit={handlePasswordChange}>
            <Panel
              title="Giriş Şifresi Değiştirme"
              subtitle="Hesabınızın güvenliği için güçlü bir şifre kullanın"
            >
              <div className="settings-grid">
                <Field label="Mevcut Şifreniz">
                  <input
                    type="password"
                    required
                    placeholder="Mevcut şifrenizi girin"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Field>
                <div className="grid-2-col">
                  <Field label="Yeni Şifre">
                    <input
                      type="password"
                      required
                      placeholder="En az 6 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Field>
                  <Field label="Yeni Şifre (Tekrar)">
                    <input
                      type="password"
                      required
                      placeholder="Şifreyi onaylayın"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Field>
                </div>
                {passwordMsg && (
                  <div className="auth-error-msg">
                    <AlertCircle size={15} /> {passwordMsg}
                  </div>
                )}
                <div className="flex justify-end">
                  <Button type="submit">Şifreyi Güncelle</Button>
                </div>
              </div>
            </Panel>
          </form>

          {/* KVKK & Komşuluk Gizlilik Ayarları */}
          <Panel
            title="Kişisel Veri Gizliliği (KVKK Tercihleri)"
            subtitle="Diğer kat malikleri ve komşularınızın görebileceği bilgileri sınırlandırın"
          >
            <div className="settings-grid">
              <label className="checkbox-item-custom">
                <input
                  type="checkbox"
                  checked={privacy.hidePhoneInDirectory}
                  onChange={(e) =>
                    setPrivacy({
                      ...privacy,
                      hidePhoneInDirectory: e.target.checked,
                    })
                  }
                />
                <div>
                  <strong>Telefon numaramı komşuluk rehberinde gizli tut</strong>
                  <span className="block text-xs text-muted">
                    İşaretli olduğunda komşularınız telefonunuzu göremez; sadece yönetici ve güvenlik görevlisi erişebilir.
                  </span>
                </div>
              </label>

              <label className="checkbox-item-custom">
                <input
                  type="checkbox"
                  checked={privacy.hidePlateInDirectory}
                  onChange={(e) =>
                    setPrivacy({
                      ...privacy,
                      hidePlateInDirectory: e.target.checked,
                    })
                  }
                />
                <div>
                  <strong>Araç plakalarımı diğer sakinlere gizle</strong>
                  <span className="block text-xs text-muted">
                    Hatalı park durumlarında komşularınız doğrudan size ulaşmak yerine güvenlik üzerinden anons talep eder.
                  </span>
                </div>
              </label>

              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  onClick={() => onNotify?.("Gizlilik tercihleriniz kaydedildi.")}
                >
                  <Save size={16} /> Gizlilik Tercihlerini Kaydet
                </Button>
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
