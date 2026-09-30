import { useState } from "react";
import {
  Plus,
  Search,
  Paperclip,
  UploadCloud,
  MessageSquare,
  X,
} from "lucide-react";
import { Badge, Button, Empty, Field, Modal, Panel } from "./UI";
import { dateLabel, TODAY, uid } from "./data";
export default function Requests({
  requests,
  manager,
  onCreate,
  onStatus,
  residentName,
  unitId,
  openCreate = false,
}) {
  const [creating, setCreating] = useState(openCreate);
  const [filter, setFilter] = useState("Tümü");
  const [search, setSearch] = useState("");
  const filtered = requests.filter(
    (r) =>
      (filter === "Tümü" || r.status === filter) &&
      `${r.title} ${r.unitId} ${r.description}`
        .toLocaleLowerCase("tr-TR")
        .includes(search.toLocaleLowerCase("tr-TR")),
  );
  return (
    <>
      <div className="module-actions">
        <p>
          {manager
            ? "Sitenizdeki tüm taleplerin çözüm sürecini takip edin veya yeni arıza/bakım kaydı açın."
            : "Yaşam alanınız için bir talep bırakın, süreci buradan takip edin."}
        </p>
        <Button onClick={() => setCreating(true)}>
          <Plus size={17} />
          {manager ? "Yeni Talep / Arıza Kaydı Aç" : "Yeni Talep Oluştur"}
        </Button>
      </div>
      <Panel
        title={manager ? "Talepler ve şikayetler" : "Taleplerim"}
        subtitle={`${requests.filter((r) => r.status !== "Çözüldü").length} aktif talep`}
      >
        <div className="table-toolbar">
          <div className="tabs">
            {["Tümü", "Yeni", "İnceleniyor", "Çözüldü"].map((f) => (
              <button
                key={f}
                className={filter === f ? "selected" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <label className="search-box">
            <Search size={16} />
            <input
              placeholder="Talep ara…"
              aria-label="Talep ara"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        <div className="request-list">
          {filtered.map((r) => (
            <article className="request-card" key={r.id}>
              <div className="request-symbol">
                <MessageSquare size={19} />
              </div>
              <div className="request-body">
                <div className="request-meta">
                  <span>
                    {r.id.startsWith("T-")
                      ? r.id
                      : "T-" + r.id.slice(0, 4).toUpperCase()}
                  </span>
                  <span>{r.category}</span>
                  <span>{dateLabel(r.date)}</span>
                </div>
                <h3>{r.title}</h3>
                <p>{r.description}</p>
                <div className="request-footer">
                  <span>
                    {r.unitId} · {residentName(r.unitId)}
                  </span>
                  {r.file && (
                    <span>
                      <Paperclip size={13} />
                      {r.file}
                    </span>
                  )}
                </div>
              </div>
              <div className="request-status">
                {manager ? (
                  <select
                    aria-label={`${r.title} durumu`}
                    value={r.status}
                    onChange={(e) => onStatus(r.id, e.target.value)}
                  >
                    {["Yeni", "İnceleniyor", "Çözüldü"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <Badge status={r.status} />
                )}
              </div>
            </article>
          ))}
          {!filtered.length && <Empty />}
        </div>
      </Panel>
      {creating && (
        <RequestModal
          unitId={unitId || (manager ? "Ortak Alan" : "A-1")}
          manager={manager}
          onClose={() => setCreating(false)}
          onSubmit={(r) => {
            onCreate(r);
            setCreating(false);
          }}
        />
      )}
    </>
  );
}
export function RequestModal({ unitId = "Ortak Alan", manager = false, onClose, onSubmit }) {
  const [selectedLocation, setSelectedLocation] = useState(unitId || (manager ? "Ortak Alan" : "A-1"));
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const selectFile = (f) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("Dosya en fazla 10 MB olabilir.");
      return;
    }
    if (!["image/jpeg", "image/png", "application/pdf"].includes(f.type)) {
      setError("PNG, JPG veya PDF dosyası seçin.");
      return;
    }
    setError("");
    setFile(f.name);
  };
  return (
    <Modal
      title={manager ? "Yönetici Talebi / Arıza & Bakım Kaydı" : "Yeni Talep Oluştur"}
      description={
        manager
          ? `${selectedLocation} · Ortak alan veya daire adına kayıt oluşturulacak.`
          : `${unitId} · Talebiniz site yönetimine iletilecek.`
      }
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          if (!f.get("title").trim() || !f.get("description").trim()) return;
          onSubmit({
            id: uid(),
            unitId: manager ? selectedLocation : unitId,
            title: f.get("title").trim(),
            description: f.get("description").trim(),
            category: f.get("category"),
            date: TODAY,
            status: "Yeni",
            file,
          });
        }}
      >
        {manager && (
          <Field label="Konum / İlgili Alan">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="Ortak Alan">Ortak Alan (Asansör, Jeneratör, Peyzaj vb.)</option>
              <option value="A Blok">A Blok Genel</option>
              <option value="B Blok">B Blok Genel</option>
              <option value="C Blok">C Blok Genel</option>
              <option value="Kapalı Otopark">Kapalı Otopark</option>
              <option value="Sosyal Tesis & Havuz">Sosyal Tesis & Havuz</option>
              <option value="A-1">A-1 Dairesi Adına</option>
              <option value="B-2">B-2 Dairesi Adına</option>
              <option value="C-3">C-3 Dairesi Adına</option>
            </select>
          </Field>
        )}
        <Field label="Kategori">
          <select name="category">
            {[
              "Elektrik",
              "Asansör",
              "Temizlik",
              "Otopark",
              "Ortak alan",
              "Gürültü",
              "Diğer",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Talep başlığı">
          <input
            name="title"
            required
            maxLength="100"
            pattern=".*\S.*"
            placeholder="Örn. Koridor aydınlatması çalışmıyor"
          />
        </Field>
        <Field label="Açıklama">
          <textarea
            required
            name="description"
            rows="4"
            maxLength="2000"
            placeholder="Talebinizin detaylarını paylaşın…"
          />
        </Field>
        <div
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            selectFile(e.dataTransfer.files[0]);
          }}
        >
          <UploadCloud size={25} />
          <label>
            <strong>Dosya seçin</strong> veya buraya sürükleyin
            <input
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={(e) => selectFile(e.target.files[0])}
            />
          </label>
          <small>PNG, JPG, PDF · En fazla 10 MB · Demo ek</small>
        </div>
        {file && (
          <div className="attached">
            <Paperclip size={15} />
            {file}
            <button
              type="button"
              aria-label="Eki kaldır"
              onClick={() => setFile(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}
        {error && <p role="alert">{error}</p>}
        <div className="modal-footer">
          <Button secondary type="button" onClick={onClose}>
            Vazgeç
          </Button>
          <Button type="submit">
            Talebi Oluştur
            <Plus size={16} />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
