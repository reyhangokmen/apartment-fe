import { useState, useMemo } from "react";
import {
  Building2,
  Search,
  Pencil,
  ChevronDown,
  Users,
  Sparkles,
  Plus,
  Copy,
  Check,
  KeyRound,
  CheckCircle2,
  Share2,
  QrCode,
  Printer,
  Mail,
  Eye,
  Code,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button, Empty, Field, Modal, Panel } from "./UI";
import UnitGeneratorModal from "./UnitGeneratorModal";
import { InvitationRegisterModal } from "./AuthModal";
import { APARTMENT_TYPES, money } from "./data";

export default function Apartments({
  units = [],
  users = [],
  residentFor,
  onSave,
  onBatchGenerate,
  onNotify,
  siteName = "Kovan Sitesi",
}) {
  // Mevcut blokları dinamik belirle
  const availableBlocks = useMemo(() => {
    const list = Array.from(new Set(units.map((u) => u.block))).filter(Boolean);
    return list.length ? list : ["A", "B", "C"];
  }, [units]);

  const [block, setBlock] = useState(availableBlocks[0] || "A");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [editType, setEditType] = useState("2+1");
  const [editM2, setEditM2] = useState(95);
  const [showGenerator, setShowGenerator] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const startEdit = (u) => {
    setEditing(u);
    const assignedType = u.type || "2+1";
    setEditType(assignedType);
    const found = APARTMENT_TYPES.find((t) => t.id === assignedType);
    setEditM2(u.m2 || (found ? found.defaultM2 : 95));
  };

  const handleEditTypeChange = (newType) => {
    setEditType(newType);
    const found = APARTMENT_TYPES.find((t) => t.id === newType);
    if (found) {
      setEditM2(found.defaultM2);
    }
  };

  // Davet Kodu ve E-posta Modalları
  const [inviteModalUnit, setInviteModalUnit] = useState(null);
  const [inviteRole, setInviteRole] = useState("Kat Maliki");
  const [showQrModal, setShowQrModal] = useState(false);
  const [emailPreviewUnit, setEmailPreviewUnit] = useState(null);
  const [emailPreviewTab, setEmailPreviewTab] = useState("preview"); // 'preview' | 'html'
  const [testInviteModal, setTestInviteModal] = useState(null); // { email, unitId, isLocked }

  const copyBlockShareMessage = (targetBlock) => {
    const msg = `Sayın Sakinimiz,\n${siteName} ${targetBlock} Blok dijital yönetim sistemimize katılmak için https://kovan.site adresine girip 'Sakin Katılım Kodu ile Kaydol' seçeneğine tıklayınız.\n\nBlok Katılım Kodunuz: KVN-BLOK-${targetBlock}\n\nDairenizi seçip ad, soyad, telefon ve şifrenizi belirleyerek kaydınızı anında tamamlayabilirsiniz.`;
    navigator.clipboard?.writeText(msg);
    setCopiedId(`share-${targetBlock}`);
    setTimeout(() => setCopiedId(null), 2500);
    onNotify?.(`${targetBlock} Blok sakin davet metni panoya kopyalandı!`);
  };

  // Seçili bloğa ait daireler ve arama filtresi
  const visible = units.filter((u) => {
    const res = residentFor(u.id);
    const matchesBlock = u.block === block;
    const searchTarget = `${u.id} ${u.number || ""} ${res?.name || ""} ${u.type || ""}`.toLocaleLowerCase("tr-TR");
    return matchesBlock && searchTarget.includes(search.toLocaleLowerCase("tr-TR"));
  });

  // Seçili bloğun katlarını büyükten küçüğe dinamik sırala
  const dynamicFloors = useMemo(() => {
    const blockUnits = units.filter((u) => u.block === block);
    const floors = Array.from(new Set(blockUnits.map((u) => u.floor || 1)));
    return floors.sort((a, b) => b - a);
  }, [units, block]);

  // Tekil daire davet kodu üretme fonksiyonu (Algoritmik)
  const getUnitInviteCode = (unitId) => `KVN-${unitId.replace("-", "")}`;

  const copyCode = (code, label = "Davet kodu") => {
    navigator.clipboard?.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2500);
    onNotify?.(`${label} panoya kopyalandı: ${code}`);
  };

  const copySmsText = (unitId, code, role) => {
    const sms = `Sayın Sakinimiz, Kovan Sitesi ${unitId} dairesi (${role}) için davet kodunuz: ${code}. Kovan giriş ekranındaki 'Davetiyeniz mi Var?' alanına bu kodu yazarak dairenize bağlanabilirsiniz.`;
    navigator.clipboard?.writeText(sms);
    setCopiedId(`sms-${unitId}`);
    setTimeout(() => setCopiedId(null), 2500);
    onNotify?.(`${unitId} için hazır SMS/WhatsApp metni kopyalandı!`);
  };

  return (
    <>
      <div className="module-actions">
        <div>
          <p>
            Blok, kat ve daire mimarisini yapılandırın; sakin atamalarını ve bağımsız bölüm detaylarını profesyonelce yönetin.
          </p>
          <span className="muted">
            Toplam: {units.length} daire · {units.filter((u) => u.occupied).length} dolu ·{" "}
            {units.filter((u) => !u.occupied).length} boş bağımsız bölüm
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowGenerator(true)}>
            <Sparkles size={16} /> Algoritmik Blok/Daire Üretici
          </Button>
        </div>
      </div>

      {/* Dinamik Blok Sekmeleri */}
      <div className="block-tabs">
        {availableBlocks.map((b) => {
          const bUnits = units.filter((u) => u.block === b);
          const bFloors = new Set(bUnits.map((u) => u.floor)).size;
          return (
            <button
              key={b}
              className={block === b ? "selected" : ""}
              onClick={() => setBlock(b)}
            >
              <Building2 size={24} />
              <div>
                <strong>{b} Blok</strong>
                <span>
                  {bFloors} kat · {bUnits.length} daire
                </span>
              </div>
              <ChevronDown size={16} />
            </button>
          );
        })}
        <button
          className="add-block-tab-btn"
          onClick={() => setShowGenerator(true)}
          title="Algoritma ile Yeni Blok Ekle"
        >
          <Plus size={20} />
          <span>Yeni Blok Tanımla</span>
        </button>
      </div>

      {/* SEÇİLİ BLOK İÇİN SAKİN KATILIM KODU & PAYLAŞIM ÇUBUĞU */}
      <div className="block-invite-banner">
        <div className="block-invite-info">
          <div className="block-invite-icon">
            <KeyRound size={22} className="text-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="block-invite-label">{block} Blok Sakin Katılım Kodu:</span>
              <code className="block-invite-code-pill">KVN-BLOK-{block}</code>
            </div>
            <p className="block-invite-desc">
              Yeni sakin taşındığında tek tek eklemenize gerek yok. Sakin bu kodla Kovan'a girip kendi dairesini seçer, isim ve şifresini belirleyerek kaydolur.
            </p>
          </div>
        </div>
        <div className="block-invite-actions">
          <button
            type="button"
            className="invite-action-btn"
            onClick={() => copyCode(`KVN-BLOK-${block}`, `${block} Blok Katılım Kodu`)}
          >
            {copiedId === `KVN-BLOK-${block}` ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            <span>{copiedId === `KVN-BLOK-${block}` ? "Kopyalandı!" : "Kodu Kopyala"}</span>
          </button>
          <button
            type="button"
            className="invite-action-btn"
            onClick={() => copyBlockShareMessage(block)}
          >
            {copiedId === `share-${block}` ? <CheckCircle2 size={14} className="text-green-500" /> : <Share2 size={14} />}
            <span>Sakin Davet Metni</span>
          </button>
          <Button
            type="button"
            secondary
            onClick={() => setShowQrModal(true)}
          >
            <QrCode size={15} /> Asansör / Pano QR Afişi
          </Button>
        </div>
      </div>

      <Panel
        title={`${block} Blok · Kat Planı & Daireler`}
        subtitle="Daire kartına tıklayarak sakin bilgilerini düzenleyin veya anahtar simgesine basarak sakine özel davet kodu üretin."
        action={
          <label className="search-box">
            <Search size={16} />
            <input
              aria-label="Daire, tip veya sakin ara"
              placeholder="Daire no, tip veya sakin ara…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        }
      >
        <div className="floor-list">
          {dynamicFloors.map((f) => {
            const floor = visible.filter((u) => u.floor === f);
            return (
              floor.length > 0 && (
                <section className="floor" key={f}>
                  <div className="floor-number">
                    <strong>{String(f).padStart(2, "0")}</strong>
                    <span>KAT</span>
                  </div>
                  <div className="unit-grid">
                    {floor.map((u) => {
                      const res = residentFor(u.id);
                      const isComm = u.type?.includes("Dükkan") || u.type?.includes("Ticari");
                      return (
                        <div
                          className={`unit-card ${!u.occupied ? "vacant" : ""} ${isComm ? "commercial-unit" : ""}`}
                          key={u.id}
                          onClick={() => startEdit(u)}
                        >
                          <div className="unit-card-header">
                            <div>
                              <strong>{u.id}</strong>
                              {u.type && <span className="unit-type-pill">{u.type} · {u.m2 || 95} m²</span>}
                            </div>
                            <div className="unit-actions-inline">
                              <button
                                type="button"
                                className="invite-quick-btn"
                                title="Davet Kodu Üret ve Paylaş"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInviteModalUnit(u);
                                }}
                              >
                                <KeyRound size={14} className="text-gold" />
                              </button>
                              <Pencil size={14} className="edit-icon" />
                            </div>
                          </div>

                          <div className="unit-resident-info">
                            <span>{res?.name || (isComm ? "Boş Ticari Alan" : "Boş daire")}</span>
                            {res?.phone && <small className="muted">{res.phone}</small>}
                          </div>

                          <footer className="unit-card-footer">
                            <span className="status-dot" />
                            <span>{u.occupied ? "Sakin atandı" : "Sakin atanmadı"}</span>
                          </footer>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )
            );
          })}
          {!visible.length && <Empty text="Bu blok veya filtreye uygun daire bulunamadı." />}
        </div>
      </Panel>

      {/* TEKİL DAİRE DAVETİYE KODU OLUŞTURMA & PAYLAŞMA MODALI */}
      {inviteModalUnit && (
        <Modal
          title={`${inviteModalUnit.id} · Davetiye Kodu Oluştur`}
          description="Sakin bu kodu Kovan giriş ekranındaki 'Davetiyeniz mi Var?' alanına yazarak daireye bağlanır"
          onClose={() => setInviteModalUnit(null)}
        >
          <div className="unit-invite-generator-box">
            <div className="invite-badge-header">
              <Building2 size={24} className="text-gold" />
              <div>
                <h4>{inviteModalUnit.id} Bağımsız Bölüm</h4>
                <p>{inviteModalUnit.block} Blok · {inviteModalUnit.floor}. Kat · {inviteModalUnit.type || "2+1 Standart"}</p>
              </div>
            </div>

            <Field label="Atanacak Sakin Rolü">
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                <option value="Kat Maliki">Kat Maliki (Mülk Sahibi)</option>
                <option value="Kiracı">Kiracı (İkamet Eden)</option>
              </select>
            </Field>

            <div className="invite-code-display-card">
              <span className="code-label">Oluşturulan Yönetici Davet Kodu:</span>
              <div className="code-value-row">
                <span className="code-text">{getUnitInviteCode(inviteModalUnit.id)}</span>
                <Button
                  secondary
                  type="button"
                  onClick={() => copyCode(getUnitInviteCode(inviteModalUnit.id), "Davet kodu")}
                >
                  {copiedId === getUnitInviteCode(inviteModalUnit.id) ? (
                    <>
                      <Check size={14} className="text-green-500" /> Kopyalandı!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Kodu Kopyala
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="sms-template-box mt-3">
              <span className="sms-label">Hazır SMS / WhatsApp Paylaşım Metni:</span>
              <p className="sms-preview">
                "Sayın Sakinimiz, Kovan Sitesi {inviteModalUnit.id} dairesi ({inviteRole}) için davet kodunuz:{" "}
                <strong>{getUnitInviteCode(inviteModalUnit.id)}</strong>. Kovan giriş ekranındaki 'Davetiyeniz mi Var?'
                alanına bu kodu yazarak dairenize bağlanabilirsiniz."
              </p>
              <Button
                type="button"
                className="w-full mt-2"
                onClick={() =>
                  copySmsText(
                    inviteModalUnit.id,
                    getUnitInviteCode(inviteModalUnit.id),
                    inviteRole
                  )
                }
              >
                {copiedId === `sms-${inviteModalUnit.id}` ? (
                  <>
                    <CheckCircle2 size={15} /> Metin Kopyalandı!
                  </>
                ) : (
                  <>
                    <Share2 size={15} /> SMS / WhatsApp Metnini Kopyala
                  </>
                )}
              </Button>
            </div>

            <div className="modal-footer mt-4">
              <Button secondary type="button" onClick={() => setInviteModalUnit(null)}>
                Kapat
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* SAKİN VE DAİRE BİLGİSİ DÜZENLEME MODALI */}
      {editing && (
        <Modal
          title={`${editing.id} · Daire & Sakin Bilgileri`}
          description={`${editing.block} Blok, ${editing.floor}. kat · ${editType} (${editM2} m²)`}
          onClose={() => setEditing(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              onSave(editing.id, {
                name: f.get("name").trim(),
                email: f.get("email").trim(),
                phone: f.get("phone").trim(),
                type: editType,
                m2: Number(editM2),
              });
              setEditing(null);
            }}
          >
            <div className="form-note">
              <Users size={17} /> Kat maliki veya kiracı bu daireye site üyeliği ile bağlanır. Daire tipi ve metrekare boyutu aidat tutarlarını belirler.
            </div>

            <div className="grid-2-col mb-3">
              <Field label="Daire Tipi">
                <select
                  value={editType}
                  onChange={(e) => handleEditTypeChange(e.target.value)}
                >
                  {APARTMENT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label} ({t.defaultM2} m²)
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Daire Boyutu (Brüt m²)">
                <input
                  type="number"
                  required
                  min="20"
                  max="600"
                  value={editM2}
                  onChange={(e) => setEditM2(parseInt(e.target.value) || 0)}
                />
              </Field>
            </div>

            {/* Daire Tipine ve Boyutuna Göre Aidat Önizleme Kutusu */}
            <div className="due-estimate-card mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Daire Tipine Göre Standart Aidat:</span>
                <strong className="text-gold">
                  {money(APARTMENT_TYPES.find((t) => t.id === editType)?.defaultDue || 2500)}
                </strong>
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-muted">
                <span>Metrekare Bazlı Aidat (25 ₺/m²):</span>
                <span>{money(editM2 * 25)}</span>
              </div>
            </div>

            <Field label="Ad Soyad">
              <input
                name="name"
                required
                pattern=".*\S.*"
                placeholder="Örn: Zeynep Çelik"
                defaultValue={residentFor(editing.id)?.name || ""}
              />
            </Field>

            <div className="grid-2-col">
              <Field label="E-posta Adresi">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="zeynep@site.com"
                  defaultValue={residentFor(editing.id)?.email || ""}
                />
              </Field>
              <Field label="Cep Telefonu">
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="0532 XXX XX XX"
                  defaultValue={residentFor(editing.id)?.phone || ""}
                />
              </Field>
            </div>

            <div className="invite-link-box mt-3">
              <div className="flex items-center justify-between">
                <span>Daire Davet Kodu:</span>
                <button
                  type="button"
                  className="text-link-gold"
                  onClick={() => copyCode(getUnitInviteCode(editing.id))}
                >
                  {copiedId === getUnitInviteCode(editing.id) ? "Kopyalandı!" : "Kodu Kopyala"}
                </button>
              </div>
              <code style={{ fontSize: "14px", fontWeight: "700", color: "var(--accent)" }}>
                {getUnitInviteCode(editing.id)}
              </code>
            </div>

            {/* BMS-140: HTML Davetiye Mail Şablonu Aksiyonu */}
            <div className="invite-link-box mt-3" style={{ background: "var(--gold-surface, #fcfbf8)", borderColor: "var(--gold-border, #e5dec9)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-gold" />
                  <strong style={{ fontSize: "12px", color: "var(--ink, #18181b)" }}>Davetiye Mail Şablonu (HTML)</strong>
                </div>
                <button
                  type="button"
                  className="text-link-gold"
                  onClick={() => {
                    const res = residentFor(editing.id);
                    setEmailPreviewUnit({
                      ...editing,
                      residentName: res?.name || "Zeynep Çelik",
                      email: res?.email || "zeynep@site.com",
                      role: editing.role || "Kat Maliki",
                    });
                  }}
                >
                  <Eye size={13} /> Şablonu Önizle
                </button>
              </div>
              <p className="text-xs text-muted mt-1" style={{ fontSize: "11px", margin: "4px 0 0 0" }}>
                Backend tarafından sakinin e-postasına iletilecek kurumsal HTML davetiyeyi görüntüleyin veya HTML kodunu kopyalayın.
              </p>
            </div>

            <div className="modal-footer mt-4">
              <Button secondary type="button" onClick={() => setEditing(null)}>
                Vazgeç
              </Button>
              <Button type="submit">Bilgileri Kaydet</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ALGORİTMİK DAİRE & BLOK ÜRETİCİ MODALI */}
      {showGenerator && (
        <UnitGeneratorModal
          existingBlocks={availableBlocks}
          onClose={() => setShowGenerator(false)}
          onGenerate={(newBlockName, generatedUnits) => {
            onBatchGenerate(newBlockName, generatedUnits);
            setBlock(newBlockName);
            onNotify?.(`${newBlockName} Blok ve ${generatedUnits.length} daire başarıyla portföye eklendi!`);
          }}
        />
      )}

      {/* ASANSÖR & PANO SAKİN KATILIM AFİŞİ & QR KOD MODALI */}
      {showQrModal && (
        <Modal
          title={`${block} Blok · Sakin Katılım Afişi & QR Kodu`}
          description="Bina panosuna veya asansöre asarak yeni sakinlerin kodla anında kaydolmasını sağlayın"
          onClose={() => setShowQrModal(false)}
        >
          <div className="qr-poster-flyer-wrap">
            <div className="qr-poster-card printable-card">
              <div className="poster-header">
                <span className="poster-brand">KOVAN KONUT & SİTE YÖNETİMİ</span>
                <h3 className="poster-title">{siteName}</h3>
                <span className="poster-block-badge">{block} BLOK</span>
              </div>

              <div className="poster-body">
                <p className="poster-greeting">HOŞ GELDİNİZ!</p>
                <p className="poster-subtext">
                  Sitemizin dijital yönetim sistemine üye olarak aidat, duyuru ve taleplerinizi takip etmek için aşağıdaki kodu kullanın:
                </p>

                <div className="poster-qr-container">
                  {/* Stylized QR Code SVG */}
                  <svg className="poster-qr-svg" viewBox="0 0 160 160" width="160" height="160" fill="none">
                    <rect width="160" height="160" rx="12" fill="#ffffff" />
                    {/* Corner Squares */}
                    <rect x="14" y="14" width="38" height="38" rx="6" stroke="#252525" strokeWidth="6" />
                    <rect x="23" y="23" width="20" height="20" rx="3" fill="#cda65b" />
                    <rect x="108" y="14" width="38" height="38" rx="6" stroke="#252525" strokeWidth="6" />
                    <rect x="117" y="23" width="20" height="20" rx="3" fill="#cda65b" />
                    <rect x="14" y="108" width="38" height="38" rx="6" stroke="#252525" strokeWidth="6" />
                    <rect x="23" y="117" width="20" height="20" rx="3" fill="#cda65b" />
                    {/* Matrix patterns */}
                    <rect x="62" y="18" width="8" height="8" rx="1" fill="#333" />
                    <rect x="76" y="18" width="8" height="8" rx="1" fill="#333" />
                    <rect x="90" y="18" width="8" height="8" rx="1" fill="#cda65b" />
                    <rect x="62" y="32" width="16" height="8" rx="1" fill="#333" />
                    <rect x="84" y="32" width="8" height="16" rx="1" fill="#333" />
                    <rect x="62" y="46" width="8" height="8" rx="1" fill="#cda65b" />
                    <rect x="18" y="62" width="16" height="8" rx="1" fill="#333" />
                    <rect x="38" y="62" width="8" height="8" rx="1" fill="#333" />
                    <rect x="52" y="62" width="8" height="8" rx="1" fill="#333" />
                    <rect x="68" y="62" width="24" height="24" rx="4" fill="#cda65b" />
                    <rect x="100" y="62" width="8" height="16" rx="1" fill="#333" />
                    <rect x="114" y="62" width="16" height="8" rx="1" fill="#333" />
                    <rect x="136" y="62" width="8" height="8" rx="1" fill="#333" />
                    <rect x="18" y="76" width="8" height="16" rx="1" fill="#333" />
                    <rect x="32" y="76" width="16" height="8" rx="1" fill="#333" />
                    <rect x="108" y="84" width="8" height="8" rx="1" fill="#333" />
                    <rect x="122" y="76" width="16" height="8" rx="1" fill="#333" />
                    <rect x="18" y="96" width="24" height="8" rx="1" fill="#333" />
                    <rect x="62" y="92" width="8" height="16" rx="1" fill="#333" />
                    <rect x="76" y="92" width="16" height="8" rx="1" fill="#333" />
                    <rect x="98" y="96" width="16" height="8" rx="1" fill="#cda65b" />
                    <rect x="120" y="92" width="8" height="16" rx="1" fill="#333" />
                    <rect x="134" y="96" width="12" height="8" rx="1" fill="#333" />
                    <rect x="62" y="114" width="16" height="8" rx="1" fill="#333" />
                    <rect x="84" y="114" width="8" height="16" rx="1" fill="#333" />
                    <rect x="98" y="114" width="16" height="8" rx="1" fill="#333" />
                    <rect x="120" y="114" width="16" height="8" rx="1" fill="#333" />
                    <rect x="62" y="130" width="8" height="16" rx="1" fill="#333" />
                    <rect x="76" y="130" width="16" height="8" rx="1" fill="#cda65b" />
                    <rect x="98" y="130" width="8" height="16" rx="1" fill="#333" />
                    <rect x="112" y="130" width="20" height="8" rx="1" fill="#333" />
                    <rect x="138" y="130" width="8" height="16" rx="1" fill="#333" />
                  </svg>
                  <span className="poster-qr-hint">QR Kodu Taratın</span>
                </div>

                <div className="poster-code-highlight">
                  <span className="poster-code-label">BLOK KATILIM KODU</span>
                  <strong className="poster-code-val">KVN-BLOK-{block}</strong>
                </div>

                <div className="poster-steps">
                  <div className="poster-step-item">
                    <span className="step-num">1</span>
                    <span><strong>kovan.site</strong> adresine gidin veya QR kodu tarayın</span>
                  </div>
                  <div className="poster-step-item">
                    <span className="step-num">2</span>
                    <span>'Sakin Katılım Kodu' alanına <strong>KVN-BLOK-{block}</strong> yazın</span>
                  </div>
                  <div className="poster-step-item">
                    <span className="step-num">3</span>
                    <span>Dairenizi seçip ad, soyad ve şifrenizi belirleyerek kaydolun</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer mt-4">
              <Button secondary type="button" onClick={() => setShowQrModal(false)}>
                Kapat
              </Button>
              <Button
                secondary
                type="button"
                onClick={() => copyBlockShareMessage(block)}
              >
                <Share2 size={15} /> WhatsApp Metni
              </Button>
              <Button
                type="button"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer size={15} /> Afişi Yazdır (A4)
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* BMS-140: E-POSTA DAVETİYE ŞABLONU ÖNİZLEME MODALI */}
      {emailPreviewUnit && (
        <Modal
          title="Davetiye E-posta Şablonu (HTML)"
          description={`${emailPreviewUnit.id} dairesi sakini için backend'in ileteceği kurumsal e-posta tasarımı`}
          onClose={() => setEmailPreviewUnit(null)}
        >
          <div className="email-preview-modal-body">
            <div className="subnav-tabs mb-3">
              <button
                type="button"
                className={emailPreviewTab === "preview" ? "active" : ""}
                onClick={() => setEmailPreviewTab("preview")}
              >
                <Eye size={14} /> E-posta Canlı Önizleme
              </button>
              <button
                type="button"
                className={emailPreviewTab === "html" ? "active" : ""}
                onClick={() => setEmailPreviewTab("html")}
              >
                <Code size={14} /> HTML Kodu (Backend)
              </button>
            </div>

            {emailPreviewTab === "preview" ? (
              <div className="email-mockup-wrapper">
                {/* BMS-140 Senaryo Seçici */}
                <div className="scenario-tester-bar p-2" style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
                  <span className="text-xs text-muted block mb-1" style={{ fontSize: "11px" }}>
                    <strong>Jira BMS-140 Kabul Kriteri Test Modu:</strong> Kayıt ekranının otomatik davranışını test edin:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      className={`btn-scenario ${emailPreviewUnit.email === "zeynep.arslan@site.com" ? "active" : ""}`}
                      onClick={() => {
                        setEmailPreviewUnit({
                          ...emailPreviewUnit,
                          residentName: "Zeynep Arslan",
                          email: "zeynep.arslan@site.com",
                        });
                      }}
                    >
                      <ShieldCheck size={13} /> Senaryo 1: Sistemde Mevcut Hesap (zeynep.arslan@site.com)
                    </button>
                    <button
                      type="button"
                      className={`btn-scenario ${emailPreviewUnit.email === "yeni.sakin@site.com" ? "active" : ""}`}
                      onClick={() => {
                        setEmailPreviewUnit({
                          ...emailPreviewUnit,
                          residentName: "Yeni Sakin",
                          email: "yeni.sakin@site.com",
                        });
                      }}
                    >
                      <User size={13} /> Senaryo 2: Yeni Kullanıcı (yeni.sakin@site.com)
                    </button>
                  </div>
                </div>

                <div className="email-mockup-meta">
                  <div className="email-meta-row">
                    <span>Kimden:</span>
                    <strong>Kovan Konut & Site Yönetimi &lt;davet@kovan.app&gt;</strong>
                  </div>
                  <div className="email-meta-row">
                    <span>Kime:</span>
                    <strong>{emailPreviewUnit.residentName} &lt;{emailPreviewUnit.email}&gt;</strong>
                  </div>
                  <div className="email-meta-row">
                    <span>Konu:</span>
                    <strong>{siteName} · Dijital Site Yönetimi Davetiyesi ({emailPreviewUnit.id})</strong>
                  </div>
                </div>

                <div className="email-rendered-card">
                  <div className="email-card-header">
                    <span className="email-brand-logo">
                      KOV<span>A</span>N
                    </span>
                    <span className="email-brand-sub">KONUT & SİTE YÖNETİMİ</span>
                  </div>
                  <div className="email-gold-stripe" />

                  <div className="email-card-content">
                    <h3>Aramıza Hoş Geldiniz! 👋</h3>
                    <p className="email-lead-text">
                      Sayın <strong>{emailPreviewUnit.residentName}</strong>,<br />
                      <strong>{siteName}</strong> yönetimi tarafından siteninizin dijital yönetim portalına davet edildiniz.
                    </p>

                    <div className="email-unit-info-box">
                      <div className="flex items-center justify-between">
                        <div>
                          <small>SİTE & BLOK</small>
                          <strong>{siteName} · {emailPreviewUnit.block} Blok</strong>
                        </div>
                        <div>
                          <small>DAİRE NO & ROL</small>
                          <strong>Daire {emailPreviewUnit.number || emailPreviewUnit.id.split("-")[1]} · <span className="text-gold">{emailPreviewUnit.role || "Kat Maliki"}</span></strong>
                        </div>
                      </div>
                      <div className="email-recipient-email mt-2">
                        Davet Edilen E-posta: <strong>{emailPreviewUnit.email}</strong>
                      </div>
                    </div>

                    <div className="email-cta-center my-4">
                      <button
                        type="button"
                        className="email-btn-cta"
                        style={{ border: "none", cursor: "pointer" }}
                        onClick={() => {
                          setTestInviteModal({
                            email: emailPreviewUnit.email,
                            unitId: emailPreviewUnit.id,
                            isLocked: true,
                          });
                        }}
                      >
                        Şifrenizi Belirleyin & Sisteme Katılın &rarr;
                      </button>
                    </div>

                    <div className="email-features-list">
                      <span className="features-title">Kovan ile Neler Yapabilirsiniz?</span>
                      <ul>
                        <li>💳 <strong>Online Aidat:</strong> 7/24 kredi kartı veya havale ile gecikme faizsiz ödeme.</li>
                        <li>🔧 <strong>Arıza & Destek:</strong> Tesisat ve ortak alan arızalarını fotoğraflı iletme.</li>
                        <li>🚗 <strong>Otopark Bariyeri:</strong> Plakanızı sisteme kaydederek otomatik geçiş.</li>
                        <li>📢 <strong>Duyurular:</strong> Toplantı ve yönetim kararlarını anında öğrenme.</li>
                      </ul>
                    </div>

                    <div className="email-security-box">
                      <small>
                        🔒 <strong>Güvenlik & Süre Bilgisi:</strong> Bu davetiye bağlantısı 48 saat geçerlidir. E-posta adresiniz kayıt formuna kilitli ve değiştirilemez aktarılır; yalnızca kendi belirleyeceğiniz şifre ile hesabınızı aktifleştireceksiniz.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="email-code-wrapper">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted">templates/resident-invite-email.html dosyasından derlenen şablon:</span>
                  <button
                    type="button"
                    className="text-link-gold"
                    onClick={() => {
                      copyCode(`<!DOCTYPE html>
<html>
<head><title>{{siteName}} Davetiye</title></head>
<body style="background:#f4f4f7;font-family:sans-serif;">
  <table width="600" align="center" style="background:#fff;border-radius:12px;">
    <tr><td style="background:#18181b;padding:24px;text-align:center;color:#fff;"><strong>KOVAN</strong></td></tr>
    <tr>
      <td style="padding:32px;">
        <h2>Aramıza Hoş Geldiniz!</h2>
        <p>Sayın {{residentName}}, {{siteName}} {{blockName}} Blok Daire {{unitNumber}} davetiyeniz oluşturuldu.</p>
        <div style="text-align:center;margin:28px 0;">
          <a href="{{inviteUrl}}" style="background:#cda65b;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;">Şifrenizi Belirleyin & Sisteme Katılın</a>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`, "HTML Kodu");
                    }}
                  >
                    Kodu Kopyala
                  </button>
                </div>
                <pre className="email-code-pre">
                  {`<!-- Kovan BMS-140 HTML E-posta Davetiye Şablonu -->
<!DOCTYPE html>
<html>
  <head>
    <title>{{siteName}} Davetiye</title>
  </head>
  <body style="background: #f4f4f7; font-family: -apple-system, sans-serif;">
    <table width="600" align="center" style="background: #fff; border-radius: 12px; border: 1px solid #e5e5eb;">
      <tr>
        <td style="background: #18181b; padding: 24px; text-align: center; color: #fff;">
          <strong>KOVAN</strong> KONUT VE SİTE YÖNETİMİ
        </td>
      </tr>
      <tr>
        <td style="padding: 36px 32px;">
          <h2>Aramıza Hoş Geldiniz! 👋</h2>
          <p>Sayın {{residentName}}, {{siteName}} {{blockName}} Blok Daire {{unitNumber}} portalına davet edildiniz.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="{{inviteUrl}}" style="background: #cda65b; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Şifrenizi Belirleyin & Sisteme Katılın &rarr;
            </a>
          </div>
          <p style="font-size: 12px; color: #71717a;">🔒 Not: Bu bağlantı 48 saat geçerlidir. E-posta adresiniz kayıt formuna kilitli ve değiştirilemez aktarılır.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`}
                </pre>
              </div>
            )}

            <div className="modal-footer mt-4">
              <Button secondary type="button" onClick={() => setEmailPreviewUnit(null)}>
                Kapat
              </Button>
              <Button
                secondary
                type="button"
                onClick={() => {
                  setTestInviteModal({
                    email: emailPreviewUnit.email,
                    unitId: emailPreviewUnit.id,
                    isLocked: true,
                  });
                }}
              >
                <Eye size={15} /> Kayıt Ekranını Canlı Test Et
              </Button>
              <Button
                type="button"
                onClick={() => {
                  onNotify?.(`Davet e-postası başarıyla iletildi: ${emailPreviewUnit.email}`);
                  setEmailPreviewUnit(null);
                }}
              >
                <Send size={15} /> Simüle E-posta Gönder
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CANLI KAYIT / ŞİFRE BELİRLEME EKRANI TEST MODALI (BMS-140) */}
      {testInviteModal && (
        <InvitationRegisterModal
          users={users}
          units={units}
          initialEmail={testInviteModal.email}
          initialUnitId={testInviteModal.unitId}
          isEmailLocked={testInviteModal.isLocked}
          onClose={() => setTestInviteModal(null)}
          onNotify={onNotify}
          onAcceptExisting={(data) => {
            onNotify?.(`Test Başarılı: ${data.siteName} ${data.unitId} dairesi mevcut hesaba bağlandı.`);
            setTestInviteModal(null);
          }}
          onRegisterNew={(data) => {
            onNotify?.(`Test Başarılı: Yeni sakin hesabı oluşturuldu (${data.name}) ve ${data.unitId} dairesine bağlandı.`);
            setTestInviteModal(null);
          }}
        />
      )}
    </>
  );
}
