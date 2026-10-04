import { AlertCircle, CheckCircle2, FlaskConical, Info, Loader2 } from "lucide-react";
import "./live.css";

/** Backend'i henüz yazılmamış modüllerde görünen uyarı: ekrandaki veriler örnektir. */
export function DemoBanner({ children }) {
  return (
    <div className="live-demo-banner" role="note">
      <FlaskConical size={18} />
      <span>
        {children || (
          <>
            <strong>Bu modül henüz geliştiriliyor.</strong> Ekranda görünen veriler örnektir; gerçek kayıt
            içermez ve kaydedilmez.
          </>
        )}
      </span>
    </div>
  );
}

export function Notice({ kind = "info", children }) {
  if (!children) return null;
  const Icon = kind === "error" ? AlertCircle : kind === "success" ? CheckCircle2 : Info;
  return (
    <div className={`live-notice ${kind}`} role={kind === "error" ? "alert" : "status"}>
      <Icon size={16} />
      <span>{children}</span>
    </div>
  );
}

export function Loading({ text = "Yükleniyor…" }) {
  return (
    <div className="live-loading">
      <Loader2 size={18} className="live-spin" />
      <span>{text}</span>
    </div>
  );
}
