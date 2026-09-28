import { useState, useMemo } from "react";
import {
  Sparkles,
  Layers,
  Grid,
  CheckCircle2,
} from "lucide-react";
import { Button, Field, Modal } from "./UI";
import { APARTMENT_TYPES } from "./data";

export default function UnitGeneratorModal({ onGenerate, onClose }) {
  const [blockName, setBlockName] = useState("D");
  const [floorCount, setFloorCount] = useState(4);
  const [unitsPerFloor, setUnitsPerFloor] = useState(4);
  const [startNumber] = useState(1);
  const [pattern, setPattern] = useState("floor"); // 'floor' (101, 201), 'sequential' (1, 2, 3), 'prefix' (D-1)
  const [defaultType, setDefaultType] = useState("2+1");
  const [defaultArea, setDefaultArea] = useState(95);
  const [hasGroundCommercial, setHasGroundCommercial] = useState(false); // Zemin kat dükkan mı?

  const handleDefaultTypeChange = (newType) => {
    setDefaultType(newType);
    const found = APARTMENT_TYPES.find((t) => t.id === newType);
    if (found) {
      setDefaultArea(found.defaultM2);
    }
  };

  // Algoritmik olarak daireleri matris halinde üretme
  const generatedMatrix = useMemo(() => {
    const floors = [];
    let counter = startNumber;

    for (let f = floorCount; f >= 1; f--) {
      const unitsInFloor = [];
      const isGround = f === 1;

      for (let u = 1; u <= unitsPerFloor; u++) {
        let unitNumber = "";
        if (pattern === "floor") {
          unitNumber = `${f}${String(u).padStart(2, "0")}`;
        } else if (pattern === "prefix") {
          unitNumber = `${blockName}-${counter}`;
        } else {
          unitNumber = `${counter}`;
        }

        const isCommercial = isGround && hasGroundCommercial;
        const assignedType = isCommercial ? "Dükkan / Ticari" : defaultType;
        const typeInfo = APARTMENT_TYPES.find((t) => t.id === assignedType);
        const assignedM2 = isCommercial ? 120 : (typeInfo ? typeInfo.defaultM2 : defaultArea);

        unitsInFloor.push({
          id: `${blockName}-${unitNumber}`,
          block: blockName,
          floor: f,
          number: unitNumber,
          type: assignedType,
          m2: assignedM2,
          grossArea: assignedM2,
          occupied: false,
          isCommercial,
        });

        counter++;
      }
      floors.push({ floorNumber: f, units: unitsInFloor });
    }
    return floors;
  }, [blockName, floorCount, unitsPerFloor, startNumber, pattern, defaultType, defaultArea, hasGroundCommercial]);

  // İstisna yönetimi: Kullanıcının matristen tek tek değiştirdiği tipler
  const [overrides, setOverrides] = useState({});

  const allTypeIds = APARTMENT_TYPES.map((t) => t.id);

  const toggleUnitType = (unitId) => {
    const current = overrides[unitId]?.type || defaultType;
    const nextIndex = (allTypeIds.indexOf(current) + 1) % allTypeIds.length;
    const nextType = allTypeIds[nextIndex];
    const found = APARTMENT_TYPES.find((t) => t.id === nextType);
    setOverrides((prev) => ({
      ...prev,
      [unitId]: {
        type: nextType,
        m2: found ? found.defaultM2 : defaultArea,
      },
    }));
  };

  const handleApply = () => {
    const allUnits = generatedMatrix.flatMap((f) =>
      f.units.map((u) => {
        const ov = overrides[u.id];
        return {
          ...u,
          type: ov?.type || u.type,
          m2: ov?.m2 || u.m2,
        };
      })
    );
    onGenerate(blockName, allUnits);
    onClose();
  };

  const totalCount = floorCount * unitsPerFloor;

  return (
    <Modal
      title="Algoritmik Blok & Daire Üreticisi"
      description="Kural tabanlı formül ile saniyeler içinde yüzlerce daire oluşturun"
      onClose={onClose}
    >
      <div className="unit-generator-container">
        {/* Sol Panel: Parametreler */}
        <div className="generator-params">
          <div className="algo-badge-banner">
            <Sparkles size={16} />
            <strong>Otomatik Matris Motoru</strong>
          </div>

          <div className="grid-2-col">
            <Field label="Blok Adı / Kodu">
              <input
                required
                maxLength={4}
                value={blockName}
                placeholder="Örn: D"
                onChange={(e) => setBlockName(e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Numaralandırma Algoritması">
              <select value={pattern} onChange={(e) => setPattern(e.target.value)}>
                <option value="floor">Kat Bazlı (101, 102, 201...)</option>
                <option value="sequential">Düz Artan (1, 2, 3, 4...)</option>
                <option value="prefix">Blok Önekli ({blockName}-1, {blockName}-2...)</option>
              </select>
            </Field>
          </div>

          <div className="grid-2-col">
            <Field label="Kat Sayısı">
              <input
                type="number"
                min="1"
                max="40"
                value={floorCount}
                onChange={(e) => setFloorCount(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </Field>
            <Field label="Katta Daire Sayısı">
              <input
                type="number"
                min="1"
                max="16"
                value={unitsPerFloor}
                onChange={(e) => setUnitsPerFloor(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </Field>
          </div>

          <div className="grid-2-col">
            <Field label="Varsayılan Daire Tipi">
              <select value={defaultType} onChange={(e) => handleDefaultTypeChange(e.target.value)}>
                {APARTMENT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} ({t.defaultM2} m²)
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ortalama Brüt m²">
              <input
                type="number"
                value={defaultArea}
                onChange={(e) => setDefaultArea(parseInt(e.target.value) || 80)}
              />
            </Field>
          </div>

          <label className="checkbox-item-custom">
            <input
              type="checkbox"
              checked={hasGroundCommercial}
              onChange={(e) => setHasGroundCommercial(e.target.checked)}
            />
            <span>Zemin kat bağımsız bölümleri Ticari / Dükkan olarak işaretle</span>
          </label>

          <div className="generator-summary-stat">
            <Layers size={18} className="text-gold" />
            <div>
              <strong>Üretilecek Toplam Bağımsız Bölüm:</strong>
              <span>
                {blockName} Blok · {floorCount} Kat · {totalCount} Daire
              </span>
            </div>
          </div>
        </div>

        {/* Sağ Panel: Canlı İnteraktif Kesit & Matris */}
        <div className="generator-preview">
          <div className="preview-heading">
            <div className="flex items-center gap-2">
              <Grid size={16} />
              <h4>Canlı Kat Matrisi Önizlemesi</h4>
            </div>
            <span className="hint-pill">Tip değiştirmek için kutulara tıklayın</span>
          </div>

          <div className="matrix-scroll-area">
            {generatedMatrix.map((f) => (
              <div className="matrix-floor-row" key={f.floorNumber}>
                <div className="matrix-floor-label">
                  <strong>{f.floorNumber}</strong>
                  <span>KAT</span>
                </div>
                <div className="matrix-unit-cells">
                  {f.units.map((u) => {
                    const currentType = overrides[u.id]?.type || u.type;
                    const currentM2 = overrides[u.id]?.m2 || u.m2;
                    const isComm = currentType.includes("Dükkan") || currentType.includes("Ticari");
                    const isDup = currentType.includes("Dubleks");

                    return (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() => toggleUnitType(u.id)}
                        className={`matrix-cell ${isComm ? "commercial" : isDup ? "duplex" : ""}`}
                        title="Tıklayarak daire tipini ve boyutunu değiştirin"
                      >
                        <span className="cell-id">{u.number}</span>
                        <span className="cell-type">{currentType}</span>
                        <span className="cell-m2">{currentM2} m²</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="matrix-legend">
            <span><i className="legend-dot normal" /> Standart ({defaultType})</span>
            <span><i className="legend-dot duplex" /> Dubleks</span>
            <span><i className="legend-dot commercial" /> Dükkan / Ticari</span>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <Button secondary type="button" onClick={onClose}>
          Vazgeç
        </Button>
        <Button type="button" onClick={handleApply}>
          <CheckCircle2 size={16} /> {totalCount} Daireyi Sisteme Kaydet
        </Button>
      </div>
    </Modal>
  );
}
