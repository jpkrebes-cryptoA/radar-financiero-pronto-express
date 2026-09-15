import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Factory,
  Filter,
  Gauge,
  Layers3,
  PackageX,
  Scale,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import data from "./data/financialData.json";
import "./styles.css";

const palette = {
  orange: "#f28c00",
  amber: "#ffc400",
  olive: "#81765b",
  cream: "#f5efe4",
  muted: "#b7ad9c",
  ink: "#1b1917",
  green: "#26a269",
  red: "#dc3b2f",
  blue: "#5892d1",
};

const providerCategories = new Set(["PAGO A PROVEEDORES"]);
const operatingTypesToExclude = new Set(["INGRESO", "MOV.INT", "MOV INT", "MOVIMIENTO INTERNO"]);

function money(value, compact = false) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(value || 0);
}

function pct(value, digits = 1) {
  return `${new Intl.NumberFormat("es-AR", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value || 0)}%`;
}

function titleCase(text) {
  return (text || "")
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function previousPeriod(periods, selected) {
  const index = periods.findIndex((period) => period.id === selected);
  return index > 0 ? periods[index - 1] : null;
}

function baseRows(rows, includeProviders) {
  return rows.filter((row) => {
    if (row.tipo !== "EGRESO") return false;
    if (!includeProviders && providerCategories.has(row.categoria)) return false;
    if (operatingTypesToExclude.has(row.tipo)) return false;
    return row.egreso > 0;
  });
}

function sum(rows, key = "egreso") {
  return rows.reduce((acc, row) => acc + Number(row[key] || 0), 0);
}

function groupSum(rows, keyGetter) {
  const map = new Map();
  rows.forEach((row) => {
    const key = keyGetter(row) || "Sin clasificar";
    map.set(key, (map.get(key) || 0) + row.egreso);
  });
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function dailyRows(rows) {
  const map = new Map();
  rows.forEach((row) => {
    map.set(row.fecha, (map.get(row.fecha) || 0) + row.egreso);
  });
  let acc = 0;
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => {
      acc += value;
      return {
        date,
        label: date.slice(8, 10),
        gasto: value,
        acumulado: acc,
      };
    });
}

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-pronto-line bg-pronto-panel px-3 py-2 text-sm shadow-xl">
      <div className="mb-1 font-bold text-pronto-cream">{label}</div>
      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center gap-2 text-pronto-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
          <span>{item.name}: {money(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, note, status = "neutral" }) {
  const statusClass = {
    good: "text-emerald-300",
    warn: "text-amber-300",
    bad: "text-red-300",
    neutral: "text-pronto-cream",
  }[status];
  return (
    <article className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-lg bg-white/8 p-2 text-pronto-amber"><Icon size={19} /></span>
        <span className={`text-xs font-black uppercase tracking-[0.16em] ${statusClass}`}>{label}</span>
      </div>
      <div className="text-3xl font-black text-pronto-cream">{value}</div>
      <p className="mt-2 text-sm leading-snug text-pronto-muted">{note}</p>
    </article>
  );
}

function App() {
  const orderedPeriods = [...data.periods].sort((a, b) => a.month - b.month);
  const defaultPeriod = orderedPeriods.find((period) => period.month === 8)?.id || orderedPeriods.at(-1)?.id;
  const [periodId, setPeriodId] = useState(defaultPeriod);
  const [unit, setUnit] = useState("TODAS");
  const [area, setArea] = useState("TODAS");
  const [category, setCategory] = useState("TODAS");
  const [includeProviders, setIncludeProviders] = useState(false);

  const period = orderedPeriods.find((item) => item.id === periodId);
  const periodRows = useMemo(() => data.rows.filter((row) => row.periodo === periodId), [periodId]);
  const operatingAll = useMemo(() => baseRows(periodRows, includeProviders), [periodRows, includeProviders]);
  const units = useMemo(() => ["TODAS", ...new Set(operatingAll.map((row) => row.unidad).sort())], [operatingAll]);
  const areas = useMemo(() => ["TODAS", ...new Set(operatingAll.map((row) => row.area).sort())], [operatingAll]);
  const categories = useMemo(() => ["TODAS", ...new Set(operatingAll.map((row) => row.categoria).sort())], [operatingAll]);

  const filtered = useMemo(() => {
    return operatingAll.filter((row) => {
      if (unit !== "TODAS" && row.unidad !== unit) return false;
      if (area !== "TODAS" && row.area !== area) return false;
      if (category !== "TODAS" && row.categoria !== category) return false;
      return true;
    });
  }, [operatingAll, unit, area, category]);

  const previous = previousPeriod(orderedPeriods, periodId);
  const previousRows = previous ? baseRows(data.rows.filter((row) => row.periodo === previous.id), includeProviders) : [];
  const previousComparable = previousRows.filter((row) => {
    if (unit !== "TODAS" && row.unidad !== unit) return false;
    if (area !== "TODAS" && row.area !== area) return false;
    if (category !== "TODAS" && row.categoria !== category) return false;
    return true;
  });

  const total = sum(filtered);
  const previousTotal = sum(previousComparable);
  const delta = previousTotal ? ((total - previousTotal) / previousTotal) * 100 : 0;
  const avgDay = total / Math.max(period?.workDays || 1, 1);
  const byArea = groupSum(filtered, (row) => row.area).slice(0, 8);
  const byUnitArea = useMemo(() => {
    const pairs = new Map();
    filtered.forEach((row) => {
      const key = row.area;
      const item = pairs.get(key) || { area: key, CALLAO: 0, "V. OBLIGADO": 0, OTROS: 0 };
      if (row.unidad.includes("OBLIGADO")) item["V. OBLIGADO"] += row.egreso;
      else if (row.unidad.includes("CALLAO")) item.CALLAO += row.egreso;
      else item.OTROS += row.egreso;
      pairs.set(key, item);
    });
    return [...pairs.values()].sort((a, b) => b.CALLAO + b["V. OBLIGADO"] + b.OTROS - (a.CALLAO + a["V. OBLIGADO"] + a.OTROS)).slice(0, 8);
  }, [filtered]);

  const byCategory = groupSum(filtered, (row) => row.categoria).slice(0, 10);
  const byDetail = groupSum(filtered, (row) => row.detalle).slice(0, 10);
  const daily = dailyRows(filtered);
  const bridge = orderedPeriods.map((month) => {
    const monthRows = baseRows(data.rows.filter((row) => row.periodo === month.id), includeProviders);
    return {
      name: month.label.replace(" 2026", ""),
      gasto: sum(monthRows),
      promedio: sum(monthRows) / Math.max(month.workDays || 1, 1),
    };
  });
  const topArea = byArea[0];
  const concentration = total && topArea ? (topArea.value / total) * 100 : 0;
  const signal = concentration > 60 ? "bad" : concentration > 40 ? "warn" : "good";
  const movementCount = filtered.length;

  return (
    <div className="min-h-screen bg-pronto-ink text-pronto-cream">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[330px_1fr]">
        <aside className="relative border-b border-pronto-line bg-[#14110e] p-6 xl:border-b-0 xl:border-r">
          <div className="absolute inset-y-0 right-0 hidden w-1 bg-pronto-orange xl:block" />
          <img src="./logo_pronto_express_sidebar.png" alt="PRONTO! Express" className="mb-12 w-52 max-w-full" />
          <div className="mb-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-pronto-amber">Tablero operativo</p>
            <h1 className="text-5xl font-black leading-[0.93] text-pronto-cream">Mapa de gastos</h1>
            <p className="mt-4 max-w-[28rem] text-base leading-relaxed text-pronto-muted">
              Estructura mensual de egresos por unidad, area y categoria. Base por defecto sin ingresos ni pagos a proveedores.
            </p>
          </div>
          <div className="space-y-4">
            <Control label="Mes de analisis" value={periodId} onChange={setPeriodId} options={orderedPeriods.map((p) => [p.id, p.label + (p.isPartial ? " parcial" : "")])} />
            <Control label="Unidad" value={unit} onChange={setUnit} options={units.map((x) => [x, x === "TODAS" ? "Consolidado" : titleCase(x)])} />
            <Control label="Area" value={area} onChange={setArea} options={areas.map((x) => [x, x === "TODAS" ? "Todas las areas" : titleCase(x)])} />
            <Control label="Categoria" value={category} onChange={setCategory} options={categories.map((x) => [x, x === "TODAS" ? "Todas las categorias" : titleCase(x)])} />
            <button
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-black transition ${
                includeProviders ? "border-pronto-amber bg-pronto-amber text-pronto-ink" : "border-pronto-line bg-white/5 text-pronto-cream hover:border-pronto-olive"
              }`}
              onClick={() => setIncludeProviders((value) => !value)}
            >
              <span>{includeProviders ? "Incluye proveedores" : "Sin pago a proveedores"}</span>
              <PackageX size={18} />
            </button>
          </div>
          <div className="mt-8 rounded-xl border border-pronto-line bg-white/[0.04] p-4 text-sm text-pronto-muted">
            <div className="mb-2 flex items-center gap-2 font-bold text-pronto-cream"><CalendarDays size={16} /> Fuente actualizada</div>
            <p>{new Date(data.source.lastModified).toLocaleString("es-AR")} desde Excel de gastos.</p>
          </div>
        </aside>

        <main className="space-y-6 p-5 sm:p-7 xl:p-9">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <KpiCard icon={WalletCards} label="Estructura" value={money(total, true)} note={`${movementCount} movimientos en ${period?.label}.`} status="neutral" />
            <KpiCard icon={Gauge} label="Promedio habil" value={money(avgDay, true)} note={`${period?.workDays || 0} dias con facturacion detectada.`} status="neutral" />
            <KpiCard icon={previousTotal && delta <= 0 ? ArrowDownRight : ArrowUpRight} label="Vs mes anterior" value={previousTotal ? pct(delta) : "s/d"} note={previous ? `Comparado con ${previous.label}.` : "Primer mes disponible."} status={!previousTotal ? "neutral" : delta <= 0 ? "good" : delta < 12 ? "warn" : "bad"} />
            <KpiCard icon={signal === "good" ? CheckCircle2 : AlertTriangle} label="Concentracion" value={pct(concentration)} note={topArea ? `Mayor peso: ${titleCase(topArea.name)}.` : "Sin datos."} status={signal} />
          </section>

          <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
            <article className="panel p-5">
              <SectionTitle icon={Layers3} title="Gasto operativo por area" caption="Ordenado por incidencia dentro del periodo y filtros elegidos." />
              <div className="h-[390px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byArea} layout="vertical" margin={{ left: 18, right: 38, top: 10, bottom: 10 }}>
                    <CartesianGrid horizontal={false} stroke="#40382e" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tickFormatter={titleCase} width={130} tick={{ fill: palette.muted, fontSize: 13 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Bar dataKey="value" name="Gasto" radius={[0, 10, 10, 0]}>
                      {byArea.map((entry, index) => <Cell key={entry.name} fill={index === 0 ? palette.orange : index === 1 ? palette.amber : palette.olive} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="panel p-5">
              <SectionTitle icon={Scale} title="Semaforo de lectura" caption="Alertas simples para revisar foco gerencial." />
              <div className="space-y-4">
                <Signal title="Concentracion por area" value={pct(concentration)} status={signal} text={concentration > 60 ? "Una sola area domina la estructura. Conviene auditar rubros internos." : concentration > 40 ? "Hay peso alto en un area. Revisar tendencia y responsables." : "La estructura esta razonablemente distribuida."} />
                <Signal title="Variacion mensual" value={previousTotal ? pct(delta) : "s/d"} status={!previousTotal ? "neutral" : delta <= 0 ? "good" : delta < 12 ? "warn" : "bad"} text={delta <= 0 ? "El gasto baja contra el mes anterior comparable." : "El gasto sube. Mirar categorias y detalle de mayor salto."} />
                <Signal title="Criterio actual" value={includeProviders ? "Total egresos" : "Estructura"} status="neutral" text={includeProviders ? "Incluye mercaderia y puede tapar el gasto operativo real." : "Vista recomendada para contribucion marginal y cobertura de estructura."} />
              </div>
            </article>
          </section>

          <section className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
            <article className="panel p-5">
              <SectionTitle icon={Factory} title="Unidad y area" caption="CALLAO y Vuelta Obligado comparadas en cada sector." />
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byUnitArea} layout="vertical" margin={{ left: 18, right: 28, top: 10, bottom: 10 }}>
                    <CartesianGrid horizontal={false} stroke="#40382e" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="area" type="category" tickFormatter={titleCase} width={130} tick={{ fill: palette.muted, fontSize: 13 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Legend />
                    <Bar dataKey="CALLAO" stackId="a" fill={palette.orange} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="V. OBLIGADO" stackId="a" fill={palette.olive} radius={[0, 10, 10, 0]} />
                    <Bar dataKey="OTROS" stackId="a" fill={palette.blue} radius={[0, 10, 10, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="panel p-5">
              <SectionTitle icon={TrendingUp} title="Puente mensual de estructura" caption="Total mensual y promedio por dia habil trabajado." />
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={bridge} margin={{ left: 10, right: 20, top: 20, bottom: 10 }}>
                    <CartesianGrid vertical={false} stroke="#40382e" />
                    <XAxis dataKey="name" tick={{ fill: palette.muted, fontSize: 13 }} />
                    <YAxis tickFormatter={(v) => money(v, true)} tick={{ fill: palette.muted, fontSize: 12 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Legend />
                    <Bar dataKey="gasto" name="Gasto mensual" fill={palette.orange} radius={[10, 10, 0, 0]} />
                    <Line type="monotone" dataKey="promedio" name="Promedio habil" stroke={palette.amber} strokeWidth={3} dot={{ r: 5 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
            <article className="panel p-5">
              <SectionTitle icon={Filter} title="Categorias principales" caption="Rubros que explican la presion operativa." />
              <RankList rows={byCategory} total={total} />
            </article>

            <article className="panel p-5">
              <SectionTitle icon={CircleDollarSign} title="Flujo diario de egresos" caption="Barras diarias y linea acumulada del periodo." />
              <div className="h-[330px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={daily} margin={{ left: 10, right: 20, top: 20, bottom: 10 }}>
                    <defs>
                      <linearGradient id="dailyFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor={palette.orange} stopOpacity={0.5} />
                        <stop offset="95%" stopColor={palette.orange} stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#40382e" />
                    <XAxis dataKey="label" tick={{ fill: palette.muted, fontSize: 12 }} interval="preserveStartEnd" />
                    <YAxis tickFormatter={(v) => money(v, true)} tick={{ fill: palette.muted, fontSize: 12 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Area type="monotone" dataKey="acumulado" name="Acumulado" fill="url(#dailyFill)" stroke={palette.orange} strokeWidth={3} />
                    <Line type="monotone" dataKey="gasto" name="Dia" stroke={palette.amber} strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          <section className="panel p-5">
            <SectionTitle icon={Building2} title="Detalle que mas pesa" caption="Primeros conceptos por monto para entrar rapido al origen del gasto." />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {byDetail.slice(0, 5).map((row, index) => (
                <div key={row.name} className="rounded-xl border border-pronto-line bg-white/[0.04] p-4">
                  <div className="text-xs font-black uppercase text-pronto-amber">#{index + 1}</div>
                  <div className="mt-2 min-h-[3rem] text-sm font-bold text-pronto-cream">{titleCase(row.name)}</div>
                  <div className="mt-3 text-xl font-black">{money(row.value, true)}</div>
                  <div className="mt-1 text-sm text-pronto-muted">{pct((row.value / total) * 100)} del total</div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Control({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em] text-pronto-amber">{label}</span>
      <select className="w-full rounded-xl border border-pronto-line bg-pronto-cream px-4 py-3 font-black text-pronto-ink outline-none focus:border-pronto-amber" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function SectionTitle({ icon: Icon, title, caption }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-black text-pronto-cream"><Icon size={20} className="text-pronto-orange" /> {title}</h2>
        <p className="mt-1 text-sm text-pronto-muted">{caption}</p>
      </div>
    </div>
  );
}

function Signal({ title, value, status, text }) {
  const classes = {
    good: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
    warn: "border-amber-300/35 bg-amber-300/10 text-amber-200",
    bad: "border-red-400/35 bg-red-400/10 text-red-200",
    neutral: "border-pronto-line bg-white/[0.04] text-pronto-cream",
  }[status];
  return (
    <div className={`rounded-xl border p-4 ${classes}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-black uppercase tracking-[0.12em]">{title}</div>
        <div className="text-xl font-black">{value}</div>
      </div>
      <p className="mt-2 text-sm leading-snug text-pronto-muted">{text}</p>
    </div>
  );
}

function RankList({ rows, total }) {
  return (
    <div className="space-y-3">
      {rows.map((row, index) => {
        const share = total ? (row.value / total) * 100 : 0;
        return (
          <div key={row.name}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-pronto-cream">{index + 1}. {titleCase(row.name)}</span>
              <span className="text-pronto-muted">{money(row.value, true)} · {pct(share)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-pronto-orange" style={{ width: `${Math.min(share, 100)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
