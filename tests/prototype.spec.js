import { test, expect } from "@playwright/test";
async function login(page, identifier = "A-12") {
  await page.getByLabel("E-posta / Telefon / Daire Kodu").fill(identifier);
  await page.getByLabel("Şifre", { exact: true }).fill("demo123");
  await page.getByRole("button", { name: "Giriş Yap", exact: true }).click();
}
async function nav(page, name) {
  await page
    .getByRole("navigation")
    .getByRole("button", { name, exact: true })
    .click();
}
async function logout(page) {
  await page.getByRole("button", { name: "Çıkış Yap", exact: true }).click();
}
test.beforeEach(async ({ page }) => {
  await page.goto("/login");
});
test("demo helpers, default resident profile and manager keyword resolution", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Sakin Deneme/ }).click();
  await expect(page.getByLabel("E-posta / Telefon / Daire Kodu")).toHaveValue(
    "ahmet.yilmaz@site.com",
  );
  await page.getByRole("button", { name: "Giriş Yap", exact: true }).click();
  await expect(page).toHaveURL(/\/resident$/);
  await expect(page.locator(".user-profile")).toContainText("Blok A, Daire 12");
  await expect(page.getByRole("navigation")).not.toContainText(
    "Kat ve Daireler",
  );
  await logout(page);
  await login(page, "YÖNETİCİ");
  await expect(page).toHaveURL(/\/manager$/);
  await expect(page.locator(".user-profile")).toContainText("Mehmet Demir");
  await nav(page, "Kat ve Daireler");
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Merhaba, Mehmet." }),
  ).toBeVisible();
  await logout(page);
  await page.goBack();
  await expect(page).toHaveURL(/\/login$/);
});
test("resident pays own dues and another resident sees isolated data", async ({
  page,
}) => {
  await login(page);
  await expect(page.locator(".accent-stat")).toContainText("₺5.000");
  await nav(page, "Aidat ve Ödemeler");
  await expect(page.locator("tbody tr")).toHaveCount(6);
  const september = page.locator("tbody tr").filter({ hasText: "Eylül 2026" });
  await september.getByRole("button", { name: "Öde", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "₺2.500 Öde", exact: true })
    .click();
  await expect(september).toContainText("Ödendi");
  await expect(
    september.getByRole("button", { name: "Öde", exact: true }),
  ).toHaveCount(0);
  await nav(page, "Genel Bakış");
  await expect(page.locator(".accent-stat")).toContainText("₺2.500");
  await logout(page);
  await login(page, "A-2");
  await expect(page.locator(".user-profile")).toContainText("Emre Yıldız");
  await nav(page, "Taleplerim");
  await expect(page.locator(".request-card")).toHaveCount(0);
});
test("requests persist across role logins, files attach and manager updates status", async ({
  page,
}) => {
  await login(page);
  await nav(page, "Taleplerim");
  await page
    .getByRole("button", { name: "Yeni Talep Oluştur", exact: true })
    .click();
  await page.getByLabel("Talep başlığı").fill("Test: bahçe kapısı");
  await page
    .getByLabel("Açıklama")
    .fill("Bahçe kapısının menteşesi kontrol edilmeli.");
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "ornek.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 mock"),
    });
  await page
    .getByRole("button", { name: "Talebi Oluştur", exact: true })
    .click();
  await expect(
    page.locator(".request-card").filter({ hasText: "Test: bahçe kapısı" }),
  ).toContainText("ornek.pdf");
  await logout(page);
  await login(page, "yonetim@site.com");
  await nav(page, "Talep ve Şikayetler");
  await page.getByLabel("Test: bahçe kapısı durumu").selectOption("Çözüldü");
  await logout(page);
  await login(page);
  await nav(page, "Taleplerim");
  await expect(
    page.locator(".request-card").filter({ hasText: "Test: bahçe kapısı" }),
  ).toContainText("Çözüldü");
});
test("transfer review queue is linked to resident payment status", async ({
  page,
}) => {
  await login(page);
  await nav(page, "Aidat ve Ödemeler");
  const september = page.locator("tbody tr").filter({ hasText: "Eylül 2026" });
  await september.getByRole("button", { name: "Öde", exact: true }).click();
  await page
    .getByRole("button", { name: "Havale bildirimi", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Ödeme Bildirimi Oluştur", exact: true })
    .click();
  await expect(september).toContainText("Onay bekliyor");
  await logout(page);
  await login(page, "admin");
  await nav(page, "Aidat ve Ödemeler");
  await page.getByRole("button", { name: /^Onay bekliyor/ }).click();
  const row = page.locator("tbody tr").filter({ hasText: "A-12" });
  await row.getByRole("button", { name: "Onayla", exact: true }).click();
  await expect(row).toHaveCount(0);
  await logout(page);
  await login(page);
  await nav(page, "Aidat ve Ödemeler");
  await expect(september).toContainText("Ödendi");
});
test("bulk accrual excludes duplicates, individual debts reach the resident", async ({
  page,
}) => {
  await login(page, "yonetim");
  await nav(page, "Aidat ve Ödemeler");
  await page
    .getByRole("button", { name: "Toplu Borçlandır", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Borçlandırmayı Oluştur", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Dönem", { exact: true }).fill("2026-10");
  await expect(page.getByRole("dialog")).toContainText("45 daire");
  await page
    .getByRole("button", { name: "Borçlandırmayı Oluştur", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Toplu Borçlandır", exact: true })
    .click();
  await page.getByLabel("Dönem", { exact: true }).fill("2026-10");
  await expect(
    page.getByRole("button", { name: "Borçlandırmayı Oluştur", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Vazgeç", exact: true }).click();
  await page.getByRole("button", { name: "Borç Ekle", exact: true }).click();
  await page.getByLabel("Açıklama", { exact: true }).fill("Kapı kumandası");
  await page.getByLabel("Tutar (₺)", { exact: true }).fill("350");
  await page
    .getByRole("button", { name: "Borçlandırmayı Oluştur", exact: true })
    .click();
  await logout(page);
  await login(page);
  await nav(page, "Aidat ve Ödemeler");
  await expect(
    page.locator("tbody tr").filter({ hasText: "Kapı kumandası" }),
  ).toContainText("₺350");
  await expect(
    page.locator("tbody tr").filter({ hasText: "Ekim 2026" }),
  ).toHaveCount(1);
});
test("vacant unit assignment resolves by apartment code and email", async ({
  page,
}) => {
  await login(page, "admin");
  await nav(page, "Kat ve Daireler");
  await page.getByRole("button", { name: /A-16 Boş daire/ }).click();
  await page.getByLabel("Ad soyad").fill("Deneme Sakin");
  await page.getByLabel("E-posta", { exact: true }).fill("deneme@site.com");
  await page.getByLabel("Telefon", { exact: true }).fill("0555 111 22 33");
  await page
    .getByRole("button", { name: "Bilgileri Kaydet", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /A-16 Deneme Sakin/ }),
  ).toBeVisible();
  await logout(page);
  await login(page, "deneme@site.com");
  await expect(page.locator(".user-profile")).toContainText("Blok A, Daire 16");
  await logout(page);
  await login(page, "A-16");
  await expect(page.locator(".user-profile")).toContainText("Deneme Sakin");
});
test("desktop and mobile layout, route guard, modal keyboard dismissal, no external requests", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const external = [];
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1:5173")) external.push(r.url());
  });
  await page.goto("/manager");
  await expect(page).toHaveURL(/\/login$/);
  await page.screenshot({
    path: "/tmp/kovan-login-desktop.png",
    fullPage: true,
  });
  await login(page, "admin");
  await page.screenshot({
    path: "/tmp/kovan-manager-desktop.png",
    fullPage: true,
  });
  await expect(page.locator(".brand img").first()).toBeVisible();
  await nav(page, "Aidat ve Ödemeler");
  await page.getByRole("button", { name: "Borç Ekle", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await logout(page);
  await login(page);
  await page.screenshot({
    path: "/tmp/kovan-resident-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "/tmp/kovan-resident-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Menüyü aç", exact: true }).click();
  await nav(page, "Aidat ve Ödemeler");
  await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await logout(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "/tmp/kovan-login-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
