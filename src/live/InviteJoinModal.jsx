import { useEffect, useState } from "react";
import { ArrowRight, Building2, Clock, KeyRound, Lock, Mail, User } from "lucide-react";
import { Button, Field, Modal } from "../prototype/UI";
import { errorMessage, getAuth } from "../api/client";
import {
  acceptInvitation,
  extractInvitationToken,
  login,
  previewInvitation,
  registerWithInvitation,
  reloadWorkspaces,
  selectSite,
} from "../api/kovan";
import { Loading, Notice } from "./common";
import { INVITATION_STATUS_LABELS, MEMBERSHIP_TYPE_LABELS, dateTime, roleLabel } from "./labels";

/**
 * Davet linkiyle katılım (BMS-131). E-posta davetinde e-posta davetten gelir; hesabı olan giriş yapıp kabul eder,
 * olmayan kayıt olur. Daire linkinde (UNIT_LINK) kişi malik/kiracı olduğunu seçer ve başvuru yönetici onayına düşer.
 */
export default function InviteJoinModal({ initialToken = "", onClose, onJoined, onNotify, onBusyChange }) {
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [token, setToken] = useState(extractInvitationToken(initialToken));
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialToken));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [mode, setMode] = useState("register"); // daire linkinde: 'register' | 'login'
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    membershipType: "MALIK",
  });
  const session = getAuth();
  const signedInEmail = session?.user?.email?.toLowerCase();

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    previewInvitation(token)
      .then((preview) => !cancelled && setInvitation(preview))
      .catch((err) => !cancelled && setError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [token]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // İşlem sürerken (kayıt → giriş → site seçimi) uygulama ekran değiştirmesin diye üst bileşene haber verilir.
  const run = async (action) => {
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  };

  const finishJoined = async (siteId) => {
    await reloadWorkspaces();
    const next = await selectSite(siteId);
    onNotify?.(`${invitation.siteName} sitesine katıldınız. Hoş geldiniz!`);
    onJoined?.(next);
  };

  const isEmailInvite = invitation?.kind === "EMAIL";
  const usable = invitation?.status === "PENDING";
  const unitLabel = invitation?.unitNo ? `${invitation.blockName || ""} · Daire ${invitation.unitNo}` : null;

  const passwordProblem = () => {
    if (form.password.length < 8) return "Şifre en az 8 karakter olmalıdır.";
    if (form.password !== form.passwordConfirm) return "Girdiğiniz şifreler birbiriyle eşleşmiyor.";
    return "";
  };

  const submitRegister = (e) => {
    e.preventDefault();
    const problem = passwordProblem();
    if (problem) {
      setError(problem);
      return;
    }
    run(async () => {
      const email = isEmailInvite ? invitation.email : form.email.trim();
      const result = await registerWithInvitation({
        token,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
        email: isEmailInvite ? null : email,
        membershipType: isEmailInvite ? null : form.membershipType,
      });
      await login(email, form.password);
      if (result.result === "JOINED") {
        await finishJoined(result.siteId);
      } else {
        setPendingApproval(true);
        onJoined?.(getAuth());
      }
    });
  };

  const submitAccept = (e) => {
    e?.preventDefault();
    run(async () => {
      const current = getAuth();
      if (!current?.token) {
        await login(isEmailInvite ? invitation.email : form.email, form.password);
      }
      const result = await acceptInvitation(token, isEmailInvite ? null : form.membershipType);
      if (result.result === "JOINED") {
        await finishJoined(result.siteId);
      } else {
        setPendingApproval(true);
        onJoined?.(getAuth());
      }
    });
  };

  const membershipTypeField = (
    <Field label="Bu dairede">
      <select value={form.membershipType} onChange={(e) => update("membershipType", e.target.value)}>
        <option value="MALIK">Kat Malikiyim (ev sahibi)</option>
        <option value="KIRACI">Kiracıyım</option>
      </select>
    </Field>
  );

  const passwordFields = (
    <div className="grid-2-col">
      <Field label="Şifre Belirleyin">
        <div className="input-with-icon">
          <Lock size={17} className="field-icon" />
          <input
            type="password"
            required
            autoComplete="new-password"
            placeholder="En az 8 karakter"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </div>
      </Field>
      <Field label="Şifre (Tekrar)">
        <input
          type="password"
          required
          autoComplete="new-password"
          value={form.passwordConfirm}
          onChange={(e) => update("passwordConfirm", e.target.value)}
        />
      </Field>
    </div>
  );

  const nameFields = (
    <div className="grid-2-col">
      <Field label="Adınız">
        <div className="input-with-icon">
          <User size={17} className="field-icon" />
          <input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
        </div>
      </Field>
      <Field label="Soyadınız">
        <input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
      </Field>
    </div>
  );

  const renderBody = () => {
    if (!token) {
      return (
        <form
          className="auth-form-flow"
          onSubmit={(e) => {
            e.preventDefault();
            const extracted = extractInvitationToken(tokenInput);
            if (!extracted) {
              setError("Lütfen size gelen davet bağlantısını yapıştırın.");
              return;
            }
            setToken(extracted);
          }}
        >
          <p className="form-subtext">
            Yöneticinizin e-postayla gönderdiği ya da sizinle paylaştığı <strong>davet bağlantısını</strong> buraya
            yapıştırın.
          </p>
          <Field label="Davet Bağlantısı">
            <div className="input-with-icon">
              <KeyRound size={18} className="field-icon" />
              <input
                autoFocus
                required
                placeholder="https://…/davet?token=…"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
              />
            </div>
          </Field>
          <Notice kind="error">{error}</Notice>
          <div className="modal-footer">
            <Button secondary type="button" onClick={onClose}>
              Vazgeç
            </Button>
            <Button type="submit">
              Daveti Görüntüle <ArrowRight size={16} />
            </Button>
          </div>
        </form>
      );
    }

    if (loading) return <Loading text="Davet kontrol ediliyor…" />;

    if (!invitation) {
      return (
        <>
          <Notice kind="error">{error || "Davet bulunamadı."}</Notice>
          <div className="modal-footer">
            <Button
              secondary
              type="button"
              onClick={() => {
                setToken("");
                setError("");
              }}
            >
              Başka Bağlantı Gir
            </Button>
            <Button type="button" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </>
      );
    }

    const header = (
      <div className="invite-badge-header">
        <Building2 size={24} className="text-gold flex-shrink-0" />
        <div style={{ flex: 1 }}>
          <h4>{invitation.siteName}</h4>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
            {[unitLabel, roleLabel(invitation.roleCode), invitation.membershipType && MEMBERSHIP_TYPE_LABELS[invitation.membershipType]]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: "var(--muted)" }}>
            <Clock size={11} /> Son geçerlilik: {dateTime(invitation.expiresAt)}
          </p>
        </div>
      </div>
    );

    if (pendingApproval) {
      return (
        <>
          {header}
          <Notice kind="success">
            Başvurunuz site yönetiminin onayına gönderildi. Onaylandığında giriş yaptığınızda siteniz görünecek.
          </Notice>
          <div className="modal-footer">
            <Button type="button" onClick={onClose}>
              Tamam
            </Button>
          </div>
        </>
      );
    }

    if (!usable) {
      return (
        <>
          {header}
          <Notice kind="error">
            Bu davet kullanılamıyor: {INVITATION_STATUS_LABELS[invitation.status] || invitation.status}. Yöneticinizden
            yeni bir davet isteyin.
          </Notice>
          <div className="modal-footer">
            <Button type="button" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </>
      );
    }

    // E-posta daveti, hesabı olan kişi: giriş yapıp kabul eder (hesabın e-postası davetinkiyle aynı olmalı).
    if (isEmailInvite && invitation.accountExists) {
      const signedInAsOther = signedInEmail && signedInEmail !== invitation.email.toLowerCase();
      return (
        <form className="auth-form-flow" onSubmit={submitAccept}>
          {header}
          {signedInAsOther ? (
            <Notice kind="error">
              Bu davet {invitation.email} adresine gönderilmiş. Çıkış yapıp o hesapla giriş yaparak kabul edin.
            </Notice>
          ) : signedInEmail ? (
            <p className="form-subtext">Daveti hesabınıza ({invitation.email}) bağlamak için onaylayın.</p>
          ) : (
            <>
              <p className="form-subtext">
                <strong>{invitation.email}</strong> adresiyle zaten bir Kovan hesabınız var. Şifrenizle giriş yaparak
                daveti kabul edin.
              </p>
              <Field label="Şifreniz">
                <div className="input-with-icon">
                  <Lock size={17} className="field-icon" />
                  <input
                    type="password"
                    required
                    autoFocus
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                </div>
              </Field>
            </>
          )}
          <Notice kind="error">{error}</Notice>
          <div className="modal-footer">
            <Button secondary type="button" onClick={onClose}>
              Vazgeç
            </Button>
            <Button type="submit" disabled={busy || signedInAsOther}>
              {busy ? "İşleniyor…" : "Daveti Kabul Et"} <ArrowRight size={16} />
            </Button>
          </div>
        </form>
      );
    }

    // E-posta daveti, hesabı olmayan kişi: kayıt olur; e-posta davetle doğrulanmış sayılır.
    if (isEmailInvite) {
      return (
        <form className="auth-form-flow" onSubmit={submitRegister}>
          {header}
          <p className="form-subtext">
            <strong>{invitation.email}</strong> için yeni Kovan hesabınızı oluşturun.
          </p>
          {nameFields}
          {passwordFields}
          <Notice kind="error">{error}</Notice>
          <div className="modal-footer">
            <Button secondary type="button" onClick={onClose}>
              Vazgeç
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Kaydediliyor…" : "Üyeliği Tamamla"} <ArrowRight size={16} />
            </Button>
          </div>
        </form>
      );
    }

    // Daire linki: yeni hesapla başvuru ya da mevcut hesapla başvuru; ikisi de yönetici onayına düşer.
    const loggedIn = Boolean(session?.token);
    return (
      <div className="auth-form-flow">
        {header}
        {!loggedIn && (
          <div className="source-toggle-tabs mb-3">
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
              Hesabım yok
            </button>
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              Hesabım var
            </button>
          </div>
        )}

        {loggedIn || mode === "login" ? (
          <form onSubmit={submitAccept}>
            {loggedIn ? (
              <p className="form-subtext">Bu daire için mevcut hesabınızla ({session.user?.email}) başvurun.</p>
            ) : (
              <div className="grid-2-col">
                <Field label="E-posta">
                  <div className="input-with-icon">
                    <Mail size={17} className="field-icon" />
                    <input
                      type="email"
                      required
                      autoComplete="username"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Şifre">
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                </Field>
              </div>
            )}
            {membershipTypeField}
            <Notice kind="error">{error}</Notice>
            <div className="modal-footer">
              <Button secondary type="button" onClick={onClose}>
                Vazgeç
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Gönderiliyor…" : "Başvuruyu Gönder"} <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={submitRegister}>
            {nameFields}
            <Field label="E-posta">
              <div className="input-with-icon">
                <Mail size={17} className="field-icon" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            </Field>
            {passwordFields}
            {membershipTypeField}
            <Notice kind="error">{error}</Notice>
            <div className="modal-footer">
              <Button secondary type="button" onClick={onClose}>
                Vazgeç
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Gönderiliyor…" : "Kaydol ve Başvur"} <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  };

  return (
    <Modal
      title="Davetle Katılım"
      description="Yöneticinizin gönderdiği davetle sitenize katılın"
      onClose={onClose}
    >
      {renderBody()}
    </Modal>
  );
}
