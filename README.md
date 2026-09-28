# KOVAN · Konut & Site Yönetim Paneli

React, Tailwind CSS ve Lucide ile hazırlanan, yalnızca tarayıcıda çalışan Türkçe prototip.

```sh
npm install
npm run dev
```

Yerel adres: http://localhost:5173

## Demo girişleri

- Sakin: `ahmet.yilmaz@site.com` veya `A-12` → Ahmet Yılmaz, Blok A, Daire 12.
- Yönetici: `yonetim@site.com`, `YONETICI`, `YÖNETİCİ` veya `admin` → Mehmet Demir.
- Başka sakin: `A-2` veya `emre.yildiz@site.com` → Emre Yıldız.
- Herhangi bir boş olmayan şifre kullanılabilir. Giriş ekranındaki demo düğmeleri formu doldurur.
- Bilinmeyen kimlikler varsayılan A-12 demo profiline bağlanır.

Tek giriş `/login`; oturuma göre `/manager` veya `/resident` açılır. Alt sayfalar da URL'ye yansır. Çıkış sonrası geri tuşu oturumu geri açmaz. Manuel rol değiştirici bulunmaz.

## Etkileşimler

- Sakinin kendi aidatları, borç özeti ve talepleri.
- Örnek kart formuyla anında ödeme; havale bildiriminde yönetici onayı.
- Kategori, açıklama ve dosya eki ismiyle yeni talep; yönetici durum güncellemesi.
- Blok → kat → daire görünümü; sakin atama ve düzenleme.
- Dönem bazında yinelenen aidatları atlayan toplu borçlandırma; bireysel borç ekleme.
- Ödeme onay / ret kuyruğu, filtreler, arama ve CSV indirme.
- Özet ve grafikler aynı React durumundan hesaplanır.

Veriler React belleğindedir: çıkış/giriş arasında korunur, sayfa yenilendiğinde sıfırlanır. Sunucu, fetch, axios, harici font veya ödeme servisi yoktur. Ek dosyalar yüklenmez; yalnızca dosya adı mock kayda eklenir. Gerçek kişisel bilgi veya kart bilgisi kullanılmamalıdır.

Kullanıcılar, site/daire üyelikleri ve üyelik rolleri `docs/data_model_correction.md` belgesine uygun olarak ayrı mock koleksiyonlarıdır. Bu bir güvenli kimlik doğrulama sistemi değildir; rol çözümleme yalnızca prototip davranışıdır.

## Marka ve dosyalar

`public/brand` içindeki SVG dosyaları kullanıcının KOVAN Canva paketinden alınmıştır. Ana renkler altın `#CDA65B`, antrasit `#4D4D4D`; zemin beyaz/açık gri. Altın dolgu üzerinde koyu metin, küçük altın metinlerde okunaklı koyu ton kullanılır. Orijinal logo renkleri ve oranları korunur.

- `src/App.jsx`: ortak durum, yönlendirme ve üyelik çözümleme bağlantıları.
- `src/prototype`: etkin ekranlar, ortak bileşenler ve örnek veri.
- `src/App.css`, `src/index.css`: marka sistemi, Tailwind ve duyarlı stiller.
- `src/components`: önceki projeden kalan, yeni uygulamaya bağlanmayan ekranlar; referans için korunmuştur.

## Doğrulama

```sh
npm run build
npm run lint
npm test
```

Testler yerel Google Chrome kullanır ve gerekiyorsa Vite sunucusunu açar. Giriş/çıkış, rol ayrımı, ödeme, havale onayı, talepler, dosya eki, toplu borçlandırma, sakin atama ve mobil taşma kontrolleri içerir. Eski `src/components` dosyalarında önceden mevcut kullanılmayan değişken uyarıları vardır.

## Vercel yayını

- Hesap/çalışma alanı: `yusufmrmrts18s-projects`
- Proje: `kovan-site`
- Yayın: https://kovan-site.vercel.app
- Özel alan adı: `site.yusufmermertas.com`
- `vercel.json`, Vite derlemesini ve alt sayfalar için SPA yönlendirmesini tanımlar.
- `.vercelignore`, ortam dosyalarını ve etkin olmayan eski ekranları yüklemeye dahil etmez.

Sonraki yayın: `npx vercel deploy --prod --scope yusufmrmrts18s-projects`

Özel alan adı için Turkticaret DNS kaydı:

- Tür: `CNAME`
- Ad: `site`
- Hedef: `fa09f2611de198ba.vercel-dns-017.com`
- TTL: `3600`

Vercel alan adı doğrulaması 14 Eylül 2026 tarihinde başarıyla tamamlandı.
