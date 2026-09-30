import { useState } from "react";
import {
  Shield,
  UserPlus,
  Search,
  Building,
  Briefcase,
  Mail,
  SlidersHorizontal,
  Trash2,
  UserCheck,
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Users as UsersIcon,
  RefreshCw,
  AlertCircle,
  User,
} from "lucide-react";
import { Button, Field, Modal, Panel } from "./UI";

export default function Roles({
  users = [],
  units = [],
  memberships = [],
  residentFor,
  onNotify,
}) {
  const [activeTab, setActiveTab] = useState("members"); // 'members' | 'residents' | 'matrix'
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Tanımlı Roller ve Kurul Üyeleri Listesi (BMS Jira Acceptance Criteria ile Uyumlu)
  const [boardMembers, setBoardMembers] = useState([
    {
      id: "bm-1",
      name: "Mehmet Demir",
      email: "yonetim@site.com",
      phone: "0532 555 99 00",
      role: "Yönetim Kurulu Başkanı",
      scope: "Tüm Site Geneli", // Site / Blok kapsamı
      scopeType: "SITE",
      type: "MALIK", // Membership.type
      unitId: "A-1",
      hasResidentMembership: true, // Sakinlik üyeliği var mı
      startDate: "2026-01-01", // MembershipRole.start_date
      endDate: "2026-12-31", // MembershipRole.end_date
      isActive: true, // MembershipRole.is_active
    },
    {
      id: "bm-burak",
      name: "Burak Maydan",
      email: "burak.maydan@site.com",
      phone: "0532 555 77 88",
      role: "Yönetim Kurulu Üyesi",
      scope: "Tüm Site Geneli",
      scopeType: "SITE",
      type: "MALIK",
      unitId: "B-7",
      hasResidentMembership: true, // Hem Daire B-7 Sakini hem Yönetim Kurulu
      startDate: "2026-01-01",
      endDate: "2027-01-01",
      isActive: true,
    },
    {
      id: "bm-2",
      name: "Ahmet Yılmaz",
      email: "ahmet.yilmaz@site.com",
      phone: "0532 555 11 00",
      role: "Denetim Kurulu Üyesi",
      scope: "Tüm Site Geneli",
      scopeType: "SITE",
      type: "MALIK",
      unitId: "A-12",
      hasResidentMembership: true,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      isActive: true,
    },
    {
      id: "bm-3",
      name: "Ayşe Kaya",
      email: "ayse.kaya@site.com",
      phone: "0532 555 00 00",
      role: "A Blok Temsilcisi / Kurul Üyesi",
      scope: "A Blok",
      scopeType: "BLOCK",
      type: "MALIK",
      unitId: "A-2",
      hasResidentMembership: true,
      startDate: "2026-02-01",
      endDate: "2027-02-01",
      isActive: true,
    },
    {
      id: "bm-4",
      name: "Kemal Sönmez",
      email: "kemal.sonmez@site.com",
      phone: "0532 777 88 99",
      role: "Denetim Kurulu Üyesi (Geçmiş Dönem)",
      scope: "Tüm Site Geneli",
      scopeType: "SITE",
      type: "MALIK",
      unitId: "B-4",
      hasResidentMembership: true,
      startDate: "2025-01-01",
      endDate: "2025-12-31", // Süresi dolmuş!
      isActive: false, // is_active pasifleşti
    },
    {
      id: "bm-5",
      name: "SMMM Serdar Özkan",
      email: "serdar.ozkan@muhasebe.com",
      phone: "0533 111 22 33",
      role: "Dış Mali Müşavir / Muhasebe",
      scope: "Tüm Site Geneli",
      scopeType: "SITE",
      type: "DIS", // Dışarıdan atanan
      unitId: null,
      hasResidentMembership: false,
      startDate: "2026-03-01",
      endDate: "2027-03-01",
      isActive: true,
    },
    {
      id: "bm-6",
      name: "Av. Selin Erdem",
      email: "av.selin@hukuk.com",
      phone: "0544 222 33 44",
      role: "Dış Hukuk Danışmanı",
      scope: "Tüm Site Geneli",
      scopeType: "SITE",
      type: "DIS",
      unitId: null,
      hasResidentMembership: false,
      startDate: "2026-04-01",
      endDate: "2027-04-01",
      isActive: true,
    },
  ]);

  // Yetki Matrisi (Permission Matrix)
  const [permissions, setPermissions] = useState({
    "Yönetim Kurulu Başkanı": {
      viewFinance: true,
      editFinance: true,
      manageUnits: true,
      manageRequests: true,
      postAnnouncements: true,
      siteSettings: true,
    },
    "Yönetim Kurulu Üyesi": {
      viewFinance: true,
      editFinance: true,
      manageUnits: true,
      manageRequests: true,
      postAnnouncements: true,
      siteSettings: false,
    },
    "Denetim Kurulu Üyesi": {
      viewFinance: true,
      editFinance: false,
      manageUnits: false,
      manageRequests: true,
      postAnnouncements: false,
      siteSettings: false,
    },
    "Dış Mali Müşavir": {
      viewFinance: true,
      editFinance: true,
      manageUnits: false,
      manageRequests: false,
      postAnnouncements: false,
      siteSettings: false,
    },
    "SAKİN (Kat Maliki & Kiracı Ortak)": {
      viewFinance: false,
      editFinance: false,
      manageUnits: false,
      manageRequests: true,
      postAnnouncements: false,
      siteSettings: false,
    },
  });

  const togglePermission = (roleName, key) => {
    setPermissions((prev) => ({
      ...prev,
      [roleName]: {
        ...prev[roleName],
        [key]: !prev[roleName]?.[key],
      },
    }));
    onNotify?.(`${roleName} için yetki kuralı güncellendi.`);
  };

  // Yeni Üye Ekleme Form Durumları
  const [addSourceType, setAddSourceType] = useState("malik"); // 'malik' | 'dis'
  const [selectedMalikUnit, setSelectedMalikUnit] = useState("");
  const [selectedRole, setSelectedRole] = useState("Denetim Kurulu Üyesi");
  const [selectedScope, setSelectedScope] = useState("Tüm Site Geneli");
  const [formStartDate, setFormStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [formEndDate, setFormEndDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  });
  const [formIsActive, setFormIsActive] = useState(true);

  const [externalForm, setExternalForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
  });

  // Görev süresi sona erince pasifleştirme veya yeniden uzatma
  const toggleRoleStatus = (member) => {
    const newActiveState = !member.isActive;
    setBoardMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? {
              ...m,
              isActive: newActiveState,
              // Eğer tekrar aktif ediliyorsa ve süresi geçmişse bitiş tarihini 1 yıl ileri al
              endDate:
                newActiveState && new Date(m.endDate) < new Date()
                  ? (() => {
                      const d = new Date();
                      d.setFullYear(d.getFullYear() + 1);
                      return d.toISOString().split("T")[0];
                    })()
                  : m.endDate,
            }
          : m
      )
    );

    if (!newActiveState) {
      if (member.hasResidentMembership) {
        onNotify?.(
          `${member.name} için ${member.role} görevi pasifleştirildi. Daire ${member.unitId} kat maliki sakinlik üyeliği kesintisiz devam etmektedir.`
        );
      } else {
        onNotify?.(`${member.name} için görev pasifleştirildi.`);
      }
    } else {
      onNotify?.(`${member.name} için ${member.role} görevi aktifleştirildi.`);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (addSourceType === "malik") {
      if (!selectedMalikUnit) return;
      const resident = residentFor?.(selectedMalikUnit);
      if (!resident) {
        alert("Lütfen geçerli bir daire ve sakin seçin.");
        return;
      }

      const newMember = {
        id: `bm-${Date.now()}`,
        name: resident.name,
        email: resident.email,
        phone: resident.phone,
        role: selectedRole,
        scope: selectedScope,
        scopeType: selectedScope === "Tüm Site Geneli" ? "SITE" : "BLOCK",
        type: "MALIK",
        unitId: selectedMalikUnit,
        hasResidentMembership: true,
        startDate: formStartDate,
        endDate: formEndDate,
        isActive: formIsActive,
      };

      setBoardMembers((prev) => [newMember, ...prev]);
      onNotify?.(
        `${resident.name} (${selectedMalikUnit}), ${selectedRole} olarak atandı (${selectedScope}).`
      );
    } else {
      if (!externalForm.name || !externalForm.email) return;

      const newMember = {
        id: `bm-${Date.now()}`,
        name: externalForm.name,
        email: externalForm.email,
        phone: externalForm.phone || "05XX XXX XX XX",
        role: selectedRole,
        scope: selectedScope,
        scopeType: selectedScope === "Tüm Site Geneli" ? "SITE" : "BLOCK",
        type: "DIS",
        unitId: null,
        hasResidentMembership: false,
        startDate: formStartDate,
        endDate: formEndDate,
        isActive: formIsActive,
      };

      setBoardMembers((prev) => [newMember, ...prev]);
      onNotify?.(
        `${externalForm.name} adına ${selectedRole} görevi ve davetiyesi oluşturuldu.`
      );
    }

    setShowAddModal(false);
    setSelectedMalikUnit("");
    setExternalForm({ name: "", email: "", phone: "", title: "" });
  };

  const removeMember = (id, name, unitId, hasResident) => {
    setBoardMembers((prev) => prev.filter((m) => m.id !== id));
    if (hasResident && unitId) {
      onNotify?.(
        `${name} kurul görevinden silindi. Daire ${unitId} kat malikliği sakinlik kaydı korundu.`
      );
    } else {
      onNotify?.(`${name} kurul görevinden silindi.`);
    }
  };

  const filteredMembers = boardMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.unitId && m.unitId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "all" || m.role.includes(roleFilter);
    const matchesScope =
      scopeFilter === "all" ||
      (scopeFilter === "SITE" && m.scopeType === "SITE") ||
      (scopeFilter === "BLOCK" && m.scopeType === "BLOCK");
    return matchesSearch && matchesRole && matchesScope;
  });

  return (
    <>
      <div className="module-actions">
        <p>
          Yönetim kurulu, denetim kurulu ve blok yetkililerini belirleyin; görev
          sürelerini, kapsamlarını ve yetki matrisini yönetin.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus size={16} /> Yeni Yetkili / Kurul Üyesi Ata
          </Button>
        </div>
      </div>

      {/* Mimari Bilgilendirme Banner'ı (Jira Kuralı) */}
      <div className="roles-architecture-callout">
        <Info size={20} className="callout-icon" />
        <div>
          <strong>RBAC ve Üyelik Mimarisi Standartları:</strong>
          <p style={{ margin: "4px 0 0 0", color: "var(--muted)" }}>
            Kat maliki ve kiracı ayrı birer sistem erişim rolü değildir; her iki kullanıcı da sisteme <strong>SAKİN</strong> rolüyle giriş yapar. Malik/kiracı ayrımı mülkiyet durumu üzerinden tutulur.
            Yönetim ve denetim kuruluna atanan kişilerin görev süresi dolduğunda veya görevi sonlandırıldığında yönetim rolü pasifleşir, ancak kat malikliği veya sakinlik üyeliği kesintisiz devam eder.
          </p>
        </div>
      </div>

      <div className="subnav-tabs">
        <button
          className={activeTab === "members" ? "active" : ""}
          onClick={() => setActiveTab("members")}
        >
          <Shield size={16} /> Kurul ve Görevliler ({boardMembers.length})
        </button>
        <button
          className={activeTab === "residents" ? "active" : ""}
          onClick={() => setActiveTab("residents")}
        >
          <UsersIcon size={16} /> Sakinler & RBAC Rol Dağılımı ({units.filter((u) => u.occupied).length})
        </button>
        <button
          className={activeTab === "matrix" ? "active" : ""}
          onClick={() => setActiveTab("matrix")}
        >
          <SlidersHorizontal size={16} /> Yetki Matrisi (RBAC)
        </button>
      </div>

      {/* 1. SEKME: KURUL VE YÖNETİM ROLLERİ */}
      {activeTab === "members" && (
        <Panel
          title="Yönetim & Denetim Kurulu Kadrosu"
          subtitle="Site veya Blok kapsamında yetkilendirilen kat malikleri ve dış uzmanlar"
          action={
            <div className="flex gap-2">
              <label className="search-box">
                <Search size={16} />
                <input
                  placeholder="İsim, rol veya daire ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
              <select
                className="filter-select"
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
              >
                <option value="all">Tüm Kapsamlar</option>
                <option value="SITE">Tüm Site Geneli</option>
                <option value="BLOCK">Blok Bazlı Kapsam</option>
              </select>
              <select
                className="filter-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tüm Roller</option>
                <option value="Yönetim">Yönetim Kurulu</option>
                <option value="Denetim">Denetim Kurulu</option>
                <option value="Temsilci">Blok Temsilcisi</option>
                <option value="Dış">Dış Uzmanlar</option>
              </select>
            </div>
          }
        >
          <div className="table-responsive">
            <table className="roles-table">
              <thead>
                <tr>
                  <th>Yetkili Kişi</th>
                  <th>Atanan Rol</th>
                  <th>Kapsam (Scope)</th>
                  <th>Kaynak / Mülkiyet</th>
                  <th>Görev Süresi (Start / End)</th>
                  <th>Rol Durumu (is_active)</th>
                  <th style={{ textAlign: "right" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => {
                  const isExpired = new Date(m.endDate) < new Date();
                  const effectiveActive = m.isActive && !isExpired;

                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="user-table-cell">
                          <div className="user-mini-avatar">
                            <User size={13} />
                          </div>
                          <div>
                            <strong>{m.name}</strong>
                            <small>{m.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-tag-badge">
                          <Shield size={13} /> {m.role}
                        </span>
                      </td>
                      <td>
                        <span className="scope-tag">
                          {m.scopeType === "SITE" ? (
                            <Building size={12} />
                          ) : (
                            <Layers size={12} />
                          )}
                          {m.scope}
                        </span>
                      </td>
                      <td>
                        {m.type === "MALIK" ? (
                          <span className="source-tag internal">
                            <Building size={12} /> Daire {m.unitId} (Kat Maliki)
                          </span>
                        ) : (
                          <span className="source-tag external">
                            <Briefcase size={12} /> Dış Yetkili / Danışman
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="date-meta-cell">
                          <span>
                            <Clock size={11} /> <strong>Başlangıç:</strong> {m.startDate}
                          </span>
                          <span>
                            <Calendar size={11} /> <strong>Bitiş:</strong> {m.endDate}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          {effectiveActive ? (
                            <span className="status-chip active">
                              ● Aktif Görevde
                            </span>
                          ) : (
                            <span className="status-chip expired">
                              ● {isExpired ? "Süresi Doldu (Pasif)" : "Görevi Pasif"}
                            </span>
                          )}

                          {/* Görev süresi sona erse de sakinlik üyeliği devam eder kuralı */}
                          {m.hasResidentMembership && (
                            <div>
                              <span
                                className="resident-safeguard-badge"
                                title="Yönetim/denetim görevi bitse bile daire sakinliği ve mülkiyet hakları kesintisiz devam eder."
                              >
                                <CheckCircle2 size={11} /> Sakin Üyeliği Korunuyor
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="flex gap-1" style={{ justifyContent: "flex-end" }}>
                          <Button
                            secondary
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            title={
                              effectiveActive
                                ? "Görevi sonlandır ve rolü pasifleştir"
                                : "Görevi tekrar aktifleştir ve süreyi uzat"
                            }
                            onClick={() => toggleRoleStatus(m)}
                          >
                            {effectiveActive ? "Görevi Bitir" : "Süreyi Uzat"}
                          </Button>
                          <button
                            type="button"
                            className="icon-action-btn delete"
                            title="Yetki Kaydını Kaldır"
                            onClick={() =>
                              removeMember(m.id, m.name, m.unitId, m.hasResidentMembership)
                            }
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* 2. SEKME: SAKİNLER & RBAC ROL DAĞILIMI (Malik ve Kiracı Ayrımı) */}
      {activeTab === "residents" && (
        <Panel
          title="Sakinler ve Sistem Yetki Dağılımı"
          subtitle="Tüm sakinlerin sistem giriş rolü SAKİN'dir. Malik ve kiracı ayrımı ise mülkiyet durumu üzerinden yönetilir."
        >
          <div className="table-responsive">
            <table className="roles-table">
              <thead>
                <tr>
                  <th>Daire</th>
                  <th>Sakin Adı</th>
                  <th>İletişim</th>
                  <th>Sistem Erişim Rolü (RBAC)</th>
                  <th>Mülkiyet Durumu</th>
                  <th>Ek Kurul Görevi</th>
                  <th>Sakinlik Durumu</th>
                </tr>
              </thead>
              <tbody>
                {units
                  .filter((u) => u.occupied)
                  .map((u, idx) => {
                    const resident = residentFor?.(u.id);
                    // Demo verisi: Her 3 daireden biri kiracı, diğerleri malik
                    const isKiraci = idx % 3 === 1;
                    const membershipType = isKiraci ? "KIRACI" : "MALIK";
                    // Kurulda görevli mi?
                    const boardAssign = boardMembers.find((b) => b.unitId === u.id);

                    return (
                      <tr key={u.id}>
                        <td>
                          <strong>{u.id}</strong> ({u.block} Blok)
                        </td>
                        <td>
                          <strong>{resident?.name || `Daire ${u.id} Sakini`}</strong>
                        </td>
                        <td>
                          <small className="tabular-nums">{resident?.phone || "0532 555 00 00"}</small>
                        </td>
                        <td>
                          <span className="badge-rbac">
                            <Shield size={12} /> SAKİN
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge-membership ${
                              membershipType === "MALIK" ? "malik" : "kiraci"
                            }`}
                          >
                            {membershipType === "MALIK" ? "KAT MALİKİ" : "KİRACI"}
                          </span>
                        </td>
                        <td>
                          {boardAssign ? (
                            <span
                              className={`role-tag-badge ${
                                !boardAssign.isActive ? "style-passive" : ""
                              }`}
                            >
                              <Shield size={12} /> {boardAssign.role}
                              {!boardAssign.isActive && " (Süresi Doldu)"}
                            </span>
                          ) : (
                            <span style={{ color: "var(--muted)", fontSize: "11px" }}>
                              Görev Atanmadı
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="status-chip active">
                            ● Üyeliği Aktif
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* 3. SEKME: YETKİ MATRİSİ (RBAC) */}
      {activeTab === "matrix" && (
        <Panel
          title="Modül & Yetki Matrisi (Permission Matrix)"
          subtitle="Sistem rollerinin hangi alanlarda okuma/yazma yetkisine sahip olduğunu belirleyin"
        >
          <div className="table-responsive">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Sistem Rolü</th>
                  <th>Aidat & Finans Görüntüleme</th>
                  <th>Aidat Tahakkuk / Onay</th>
                  <th>Kat & Daire Düzenleme</th>
                  <th>Talep & Şikayet Yönetimi</th>
                  <th>Duyuru Yayınlama</th>
                  <th>Site Ayarları Değiştirme</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissions).map(([role, perms]) => (
                  <tr key={role}>
                    <td>
                      <strong>{role}</strong>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={perms.viewFinance}
                        onChange={() => togglePermission(role, "viewFinance")}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={perms.editFinance}
                        onChange={() => togglePermission(role, "editFinance")}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={perms.manageUnits}
                        onChange={() => togglePermission(role, "manageUnits")}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={perms.manageRequests}
                        onChange={() => togglePermission(role, "manageRequests")}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={perms.postAnnouncements}
                        onChange={() => togglePermission(role, "postAnnouncements")}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={perms.siteSettings}
                        onChange={() => togglePermission(role, "siteSettings")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* YENİ ROL / KURUL ÜYESİ ATAMA MODALI (JIRA KULLANICI ROL TANIMLAMA) */}
      {showAddModal && (
        <Modal
          title="Kurul Üyesi / Yetkili Ata"
          description="Kat maliklerinden seçin veya dışarıdan uzman bir kişiyi davet edin"
          onClose={() => setShowAddModal(false)}
        >
          <div className="source-toggle-tabs">
            <button
              type="button"
              className={addSourceType === "malik" ? "active" : ""}
              onClick={() => setAddSourceType("malik")}
            >
              <Building size={16} /> Tanımlı Kat Maliklerinden Seç
            </button>
            <button
              type="button"
              className={addSourceType === "dis" ? "active" : ""}
              onClick={() => setAddSourceType("dis")}
            >
              <UserPlus size={16} /> Dışarıdan Yeni Kişi Davet Et
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="mt-4">
            <div className="grid-2-col">
              <Field label="Atanacak Görev / Rol">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="Yönetim Kurulu Başkanı">Yönetim Kurulu Başkanı</option>
                  <option value="Yönetim Kurulu Üyesi">Yönetim Kurulu Üyesi</option>
                  <option value="Yönetim Kurulu Üyesi (Mali Sayman)">
                    Yönetim Kurulu Üyesi (Mali Sayman)
                  </option>
                  <option value="Denetim Kurulu Başkanı">Denetim Kurulu Başkanı</option>
                  <option value="Denetim Kurulu Üyesi">Denetim Kurulu Üyesi</option>
                  <option value="Blok Temsilcisi">Blok Temsilcisi</option>
                  <option value="Dış Mali Müşavir / Muhasebe">
                    Dış Mali Müşavir / Muhasebe
                  </option>
                  <option value="Dış Hukuk Danışmanı">Dış Hukuk Danışmanı</option>
                </select>
              </Field>

              <Field label="Yetki Kapsamı (Site / Blok)">
                <select
                  value={selectedScope}
                  onChange={(e) => setSelectedScope(e.target.value)}
                >
                  <option value="Tüm Site Geneli">Tüm Site Geneli</option>
                  <option value="A Blok">A Blok Kapsamı</option>
                  <option value="B Blok">B Blok Kapsamı</option>
                  <option value="C Blok">C Blok Kapsamı</option>
                </select>
              </Field>
            </div>

            {addSourceType === "malik" ? (
              <div className="mt-3">
                <Field label="Kat Maliki / Daire Seçin">
                  <select
                    required
                    value={selectedMalikUnit}
                    onChange={(e) => setSelectedMalikUnit(e.target.value)}
                  >
                    <option value="">-- Listeden Bir Daire ve Kat Maliki Seçin --</option>
                    {units
                      .filter((u) => u.occupied)
                      .map((u) => {
                        const resident = residentFor?.(u.id);
                        return (
                          <option key={u.id} value={u.id}>
                            {u.id} Dairesi ({u.block} Blok) — {resident?.name || "İsimsiz Kat Maliki"} (MALIK)
                          </option>
                        );
                      })}
                  </select>
                </Field>
                <div className="info-banner-sm mt-3">
                  <Sparkles size={15} /> Seçilen kat malikine yönetim/denetim rolü tanımlanır. Görev süresi dolduğunda bu rol pasife düşer, ancak <strong>dairesindeki kat maliki sakinlik üyeliği kesintisiz devam eder.</strong>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <Field label="Ad Soyad ve Mesleki Unvan">
                  <input
                    required
                    placeholder="Örn: SMMM Canan Yurt (Mali Müşavir)"
                    value={externalForm.name}
                    onChange={(e) =>
                      setExternalForm({ ...externalForm, name: e.target.value })
                    }
                  />
                </Field>
                <div className="grid-2-col">
                  <Field label="E-posta Adresi">
                    <input
                      type="email"
                      required
                      placeholder="canan@muhasebe.com"
                      value={externalForm.email}
                      onChange={(e) =>
                        setExternalForm({ ...externalForm, email: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Cep Telefonu">
                    <input
                      type="tel"
                      placeholder="0532 XXX XX XX"
                      value={externalForm.phone}
                      onChange={(e) =>
                        setExternalForm({ ...externalForm, phone: e.target.value })
                      }
                    />
                  </Field>
                </div>
                <div className="info-banner-sm mt-3">
                  <Mail size={15} /> Kaydedildiğinde bu dış uzmana rol aktivasyon bağlantısı ve sisteme giriş davetiyesi iletilecektir.
                </div>
              </div>
            )}

            {/* Tarih ve Durum Alanları (MembershipRole.start_date, end_date, is_active) */}
            <div className="grid-2-col mt-4">
              <Field label="Görev Başlangıç Tarihi (start_date)">
                <input
                  type="date"
                  required
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                />
              </Field>

              <Field label="Görev Bitiş Tarihi (end_date)">
                <input
                  type="date"
                  required
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                />
              </Field>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="formIsActive"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "var(--accent)" }}
              />
              <label htmlFor="formIsActive" style={{ fontSize: "12px", cursor: "pointer" }}>
                Görevi hemen aktif olarak başlat
              </label>
            </div>

            <div className="modal-footer mt-5">
              <Button secondary type="button" onClick={() => setShowAddModal(false)}>
                Vazgeç
              </Button>
              <Button type="submit">
                <UserCheck size={16} /> Görevlendirmeyi Kaydet
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
