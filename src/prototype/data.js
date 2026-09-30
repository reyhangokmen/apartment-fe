// All records below are explicitly fictional demo data. No backend or persistence.
export const PERIOD = "2026-09";
export const TODAY = "2026-09-14";
export const money = (value) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
export const monthLabel = (value) =>
  new Date(`${value}-01T12:00:00`).toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });
export const dateLabel = (value) => {
  if (!value) return "—";
  try {
    const str = String(value);
    const d = str.includes("T") ? new Date(str) : new Date(`${str}T12:00:00`);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
};
export const normalize = (value) =>
  value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ı", "i");
export const uid = () => crypto.randomUUID();
const names = [
  "Ayşe Kaya",
  "Emre Yıldız",
  "Zeynep Arslan",
  "Burak Aydın",
  "Elif Şahin",
  "Can Özdemir",
  "Selin Koç",
  "Mert Çelik",
  "Derya Aksoy",
  "Eren Yalçın",
  "Seda Güneş",
  "Ahmet Yılmaz",
  "Deniz Polat",
  "İrem Kılıç",
  "Okan Tekin",
  "Ece Acar",
  "Hasan Demir",
  "Fatma Çetin",
  "Onur Şen",
  "Buse Kurt",
  "Ali Eren",
  "Aslı Doğan",
  "Kerem Taş",
  "Melis Yavuz",
  "Cem Uçar",
  "Esra Karaca",
  "Arda Yılmaz",
  "Gizem Ekin",
  "Tolga Er",
  "İpek Deniz",
  "Barış Güzel",
  "Ceren Yurt",
  "Umut Bayrak",
  "Pelin Keskin",
  "Kaan Akın",
  "Sibel Öz",
  "Serkan Işık",
  "Nazlı Bulut",
  "Fırat Duman",
  "Yağmur Efe",
  "Alp Karahan",
  "Dilek Sönmez",
  "Oğuz Yüksel",
  "Özge Ersoy",
  "Berk Kaplan",
  "Ebru Sezer",
  "Hakan Tunalı",
  "Gül Yalın",
];

export const APARTMENT_TYPES = [
  { id: "1+0", label: "1+0 (Stüdyo)", defaultM2: 45, defaultDue: 1400 },
  { id: "1+1", label: "1+1 Daire", defaultM2: 65, defaultDue: 1800 },
  { id: "2+0", label: "2+0 Daire", defaultM2: 75, defaultDue: 2100 },
  { id: "2+1", label: "2+1 Standart", defaultM2: 95, defaultDue: 2500 },
  { id: "3+0", label: "3+0 Daire", defaultM2: 110, defaultDue: 2800 },
  { id: "3+1", label: "3+1 Geniş", defaultM2: 130, defaultDue: 3200 },
  { id: "4+1", label: "4+1 Aile", defaultM2: 165, defaultDue: 3800 },
  { id: "Dubleks", label: "Dubleks / Çatı", defaultM2: 190, defaultDue: 4500 },
  { id: "Dükkan / Ticari", label: "Dükkan / Ticari", defaultM2: 120, defaultDue: 5000 },
  { id: "Kapıcı Dairesi", label: "Kapıcı / Görevli", defaultM2: 50, defaultDue: 0 },
];

export const initialUnits = names.map((name, i) => {
  const floor = Math.floor((i % 16) / 4) + 1;
  const mod4 = i % 4;
  let type = "2+1";
  let m2 = 95;
  if (floor === 1) {
    type = mod4 === 0 ? "1+0" : mod4 === 1 ? "1+1" : mod4 === 2 ? "2+0" : "2+1";
    m2 = mod4 === 0 ? 45 : mod4 === 1 ? 65 : mod4 === 2 ? 75 : 95;
  } else if (floor === 2) {
    type = mod4 === 0 ? "2+0" : mod4 === 1 ? "2+1" : mod4 === 2 ? "2+1" : "3+0";
    m2 = mod4 === 0 ? 75 : mod4 === 1 ? 95 : mod4 === 2 ? 95 : 110;
  } else if (floor === 3) {
    type = mod4 < 2 ? "2+1" : "3+1";
    m2 = mod4 < 2 ? 95 : 130;
  } else {
    type = mod4 === 3 ? "Dubleks" : "3+1";
    m2 = mod4 === 3 ? 190 : 130;
  }
  return {
    id: `${"ABC"[Math.floor(i / 16)]}-${(i % 16) + 1}`,
    block: "ABC"[Math.floor(i / 16)],
    floor,
    number: (i % 16) + 1,
    type,
    m2,
    occupied: ![15, 31, 47].includes(i),
  };
});
export const initialUsers = names.map((name, i) => ({
  id: `u${i}`,
  name,
  email: `${normalize(name).replace(" ", ".")}@site.com`,
  phone: `0532 555 ${String(i).padStart(2, "0")} 00`,
}));
initialUsers.push({
  id: "manager",
  name: "Mehmet Demir",
  email: "yonetim@site.com",
  phone: "0532 555 99 00",
});
initialUsers.push({
  id: "u-burak",
  name: "Burak Maydan",
  email: "burak.maydan@site.com",
  phone: "0532 555 77 88",
});
export const initialMemberships = initialUnits
  .filter((u) => u.occupied)
  .map((u) => ({
    id: `m-${u.id}`,
    userId: u.id === "B-7" ? "u-burak" : `u${initialUnits.indexOf(u)}`,
    siteId: "kovan",
    unitId: u.id,
    blockId: u.block,
  }));
initialMemberships.push({
  id: "m-manager",
  userId: "manager",
  siteId: "kovan",
  unitId: null,
  blockId: null,
});
export const initialRoles = initialMemberships.map((m) => ({
  membershipId: m.id,
  role: m.unitId ? "RESIDENT" : "ADMIN",
}));
export const initialDues = [
  "2026-04",
  "2026-05",
  "2026-06",
  "2026-07",
  "2026-08",
  "2026-09",
].flatMap((period, mi) =>
  initialUnits
    .filter((u) => u.occupied)
    .map((unit, i) => ({
      id: `${period}-${unit.id}`,
      unitId: unit.id,
      period,
      title: "Site aidatı",
      amount: 2500,
      dueDate: `${period}-20`,
      status:
        mi < 4
          ? "Ödendi"
          : unit.id === "A-12" || (mi === 5 && i % 5 === 0)
            ? "Ödenmemiş"
            : mi === 5 && ["A-2", "B-3"].includes(unit.id)
              ? "Onay bekliyor"
              : "Ödendi",
      paidDate: `${period}-10`,
      method: "Banka havalesi",
    })),
);
export const initialRequests = [
  {
    id: "T-1048",
    unitId: "A-12",
    title: "Koridor aydınlatması çalışmıyor",
    category: "Elektrik",
    description:
      "3. kattaki sensörlü aydınlatma akşam saatlerinde yanmıyor. Kontrol edilmesini rica ederim.",
    status: "İnceleniyor",
    date: "2026-09-13",
    file: null,
  },
  {
    id: "T-1047",
    unitId: "B-3",
    title: "Otopark kumandası talebi",
    category: "Otopark",
    description:
      "İkinci aracımız için bir adet otopark kumandası talep ediyoruz.",
    status: "Yeni",
    date: "2026-09-12",
    file: null,
  },
  {
    id: "T-1046",
    unitId: "C-5",
    title: "Bahçe sulama sistemi",
    category: "Ortak alan",
    description: "C blok girişindeki sulama başlığında su kaçağı var.",
    status: "Yeni",
    date: "2026-09-12",
    file: null,
  },
  {
    id: "T-1045",
    unitId: "A-4",
    title: "Asansörden gelen ses",
    category: "Asansör",
    description: "Asansör 2. kata yaklaşırken normalden fazla ses çıkarıyor.",
    status: "İnceleniyor",
    date: "2026-09-11",
    file: null,
  },
  {
    id: "T-1044",
    unitId: "B-8",
    title: "Merdiven temizliği",
    category: "Temizlik",
    description: "B blok merdivenlerinin temizliği için destek rica ediyoruz.",
    status: "Yeni",
    date: "2026-09-10",
    file: null,
  },
  {
    id: "T-1043",
    unitId: "A-12",
    title: "İsimlik güncelleme talebi",
    category: "Diğer",
    description:
      "Zil üzerindeki isimlik güncellendi. Desteğiniz için teşekkürler.",
    status: "Çözüldü",
    date: "2026-09-08",
    file: null,
  },
];
export const initialAnnouncements = [
  {
    id: "a1",
    title: "Asansör periyodik bakımı",
    body: "A ve B blok asansörleri 16 Eylül Çarşamba günü 10.00–14.00 saatleri arasında sırayla bakıma alınacaktır. Anlayışınız için teşekkür ederiz.",
    category: "Bakım",
    date: "2026-09-14",
  },
  {
    id: "a2",
    title: "Eylül ayı site toplantısı",
    body: "Ortak alan düzenlemelerini ve yeni dönem bütçesini görüşmek üzere 20 Eylül Pazar günü saat 14.00’te sosyal tesiste buluşuyoruz. Tüm sakinlerimiz davetlidir.",
    category: "Toplantı",
    date: "2026-09-12",
  },
  {
    id: "a3",
    title: "Havuz kullanım saatleri güncellendi",
    body: "15 Eylül itibarıyla açık havuzumuz 09.00–19.00 saatleri arasında hizmet verecektir. Çocukların bir yetişkin eşliğinde havuzu kullanmasını rica ederiz.",
    category: "Ortak alan",
    date: "2026-09-10",
  },
];
export function resolveLogin(identifier, users, memberships, roles) {
  const value = normalize(identifier);

  // Çift Rol Kontrolü: Burak Maydan (Daire B-7 Sakini & Yönetim Kurulu Üyesi)
  if (value.includes("burak") || value === "b-7" || value.includes("burak.maydan")) {
    const burakUser = users.find((u) => u.id === "u-burak") || {
      id: "u-burak",
      name: "Burak Maydan",
      email: "burak.maydan@site.com",
      phone: "0532 555 77 88",
    };
    const b7Membership = memberships.find((m) => m.unitId === "B-7") || {
      id: "m-B-7",
      userId: "u-burak",
      siteId: "kovan",
      unitId: "B-7",
      blockId: "B",
    };
    return {
      userId: "u-burak",
      membershipId: b7Membership.id,
      role: "RESIDENT", // Başlangıç modu Sakin
      activeMode: "resident", // 'resident' | 'admin'
      hasDualRole: true, // Çift rol (Hem Sakin hem Yönetim Kurulu)
      boardRoleTitle: "Yönetim Kurulu Üyesi",
      unitId: "B-7",
      user: burakUser,
    };
  }

  const manager = ["yonetici", "admin", "yonetim"].some((word) =>
    value.includes(word),
  );
  const unitMatch = initialUnits.find((u) => normalize(u.id) === value);
  const phone = value.replace(/\D/g, "");
  const user = manager
    ? users.find((u) => u.id === "manager")
    : users.find(
        (u) =>
          normalize(u.email) === value ||
          (phone.length >= 10 && u.phone.replace(/\D/g, "") === phone),
      );
  const membership = manager
    ? memberships.find((m) => m.userId === "manager")
    : unitMatch
      ? memberships.find((m) => m.unitId === unitMatch.id)
      : memberships.find((m) => m.userId === user?.id);
  // Unrecognized identifiers open the documented default resident demo profile.
  const resolved = membership || memberships.find((m) => m.unitId === "A-12");
  return {
    userId: resolved.userId,
    membershipId: resolved.id,
    role: roles.find((r) => r.membershipId === resolved.id)?.role || (manager ? "ADMIN" : "RESIDENT"),
    activeMode: manager ? "admin" : "resident",
    hasDualRole: false,
    unitId: resolved.unitId,
  };
}
