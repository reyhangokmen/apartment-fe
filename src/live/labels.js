// Backend'in kod değerlerinin (enum) ekranda görünen Türkçe karşılıkları.

export const ROLE_LABELS = {
  SYSTEM_ADMIN: "Platform Yöneticisi",
  SITE_YONETICISI: "Site Yöneticisi",
  YONETIM_KURULU: "Yönetim Kurulu",
  DENETIM_KURULU: "Denetim Kurulu",
  BLOK_SORUMLUSU: "Blok Sorumlusu",
  SAKIN: "Sakin",
  TEMIZLIK_GOREVLISI: "Temizlik Görevlisi",
};

export const MEMBERSHIP_TYPE_LABELS = { MALIK: "Kat Maliki", KIRACI: "Kiracı" };

export const SITE_TYPES = [
  { value: "SITE", label: "Site (Çok Bloklu)" },
  { value: "APARTMAN", label: "Apartman (Tek Blok)" },
  { value: "REZIDANS", label: "Rezidans" },
  { value: "IS_MERKEZI", label: "İş Merkezi / Plaza" },
  { value: "KARMA", label: "Karma Yaşam Alanı (Konut + Ticari)" },
];

export const SITE_STATUS_LABELS = {
  KURULUM: "Kurulum aşamasında",
  AKTIF: "Aktif",
  KURULUM_HATASI: "Kurulum hatası",
  BAKIMDA: "Bakımda",
  PASIF: "Pasif",
};

export const AREA_TYPES = [
  { value: "KONUT", label: "Konut" },
  { value: "ISYERI", label: "İşyeri" },
  { value: "DEPO_OTOPARK", label: "Depo / Otopark" },
];

export const INVITATION_STATUS_LABELS = {
  PENDING: "Bekliyor",
  ACCEPTED: "Kabul edildi",
  EXPIRED: "Süresi doldu",
  REVOKED: "İptal edildi",
};

export const DEBTOR_RULES = [
  { value: "TENANT_FIRST", label: "Önce kiracı (kiracı yoksa kat maliki)" },
  { value: "OWNER_ONLY", label: "Yalnızca kat maliki" },
];

export const roleLabel = (code) => ROLE_LABELS[code] || code;
export const label = (list, value) => list.find((item) => item.value === value)?.label || value;

/** Backend tüm zamanları UTC döner; ekranda kullanıcının yerel saatine çevrilir. */
export function dateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dateOnly(value) {
  if (!value) return "—";
  const date = value.length === 10 ? new Date(`${value}T12:00:00`) : new Date(value);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export const fullName = (person) =>
  [person?.firstName, person?.lastName].filter(Boolean).join(" ") || person?.email || "—";
