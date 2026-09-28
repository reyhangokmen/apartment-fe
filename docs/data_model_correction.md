# BMS-125: Kullanıcı Rol ve Site Atama Veri Modeli Düzeltmesi

Sistemimizdeki yetkilendirme ve apartman/site yönetim yapısı, kullanıcıların doğrudan `users` tablosunda `role` veya `site_id` tuttuğu bir model üzerinden **yürümemektedir**.

Bunun yerine, çoklu apartman (SaaS) yapısı ve esnek üyelik yönetimini destekleyen **Membership** tabanlı bir veri modeli kullanılmaktadır.

---

## 1. Veri Tabanı Şeması (İlişkisel Veri Modeli)

### A. `users` Tablosu
Kullanıcının kimlik ve genel profil bilgilerini saklar (Site bağımsızdır).
- `id` (PK)
- `email` (Unique)
- `phone`
- `name_surname`
- `created_at`
- `updated_at`

### B. `Membership` Tablosu
Kullanıcının belirli bir site, blok veya daire ile olan ilişkisini (üyeliğini) tanımlar. **Yönetici atamalarında da bu tabloya kayıt açılır.**
- `id` (PK)
- `user_id` (FK -> `users.id`)
- `site_id` (FK -> `sites.id`)
- `block_id` (FK -> `blocks.id`, Yönetici için NULL)
- `unit_id` (FK -> `units.id`, Yönetici için NULL)
- `created_at`

> [!NOTE]
> **Yönetici Atama Kuralı:** 
> Bir kullanıcı bir siteye yönetici olarak atandığında, `Membership` tablosuna `user_id + site_id` eşleşmesiyle bir satır eklenir. Yönetici ortak alanlardan sorumlu olduğu için spesifik bir blok (`block_id`) veya daire (`unit_id`) bilgisi **NULL** olarak kaydedilir:
> `(user_id, site_id, block_id: null, unit_id: null)`

### C. `MembershipRole` Tablosu
Kullanıcının ilgili üyelik (Membership) üzerindeki rolünü ve yetki seviyesini tanımlar.
- `id` (PK)
- `membership_id` (FK -> `Membership.id`)
- `role` (Enum: `SUPER_ADMIN`, `ADMIN`, `RESIDENT`, `STAFF`)
- `created_at`

---

## 2. Yetkilendirme & Güvenlik Akışı

Güvenlik denetimleri yapılırken istek atan kullanıcının `users` tablosundaki tekil bir rolü yerine, işlem yapılmak istenen `site_id` ile ilişkili olan üyelik rolü kontrol edilir:

```sql
SELECT mr.role 
FROM Membership m
JOIN MembershipRole mr ON m.id = mr.membership_id
WHERE m.user_id = :userId AND m.site_id = :siteId;
```

Bu yapı sayesinde bir kullanıcı aynı zamanda:
- X sitesinde **Yönetici (Admin)** iken,
- Y sitesinde **Kat Sakini (Resident)** rolüne sahip olabilir.

Yapılan bu veri modeli değişikliği, sistemin çoklu site (SaaS) yeteneklerini esnek ve güvenli bir şekilde sunmasını garanti eder.
