import json
import math
import re
from datetime import datetime
from pathlib import Path

import pandas as pd


WORKBOOK = Path(r"P:\ADMINISTRACION\GASTOS MENSUALES\GASTOS MENSUALES 2026 LEI.xlsx")
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "financialData.json"

MONTH_ORDER = {
    "JUNIO": 6,
    "JULIO": 7,
    "AGOSTO": 8,
    "SEPTIEMBRE": 9,
    "SEP": 9,
}

MONTH_LABELS = {
    6: "Junio 2026",
    7: "Julio 2026",
    8: "Agosto 2026",
    9: "Septiembre 2026",
}


def clean(value):
    if pd.isna(value):
        return ""
    text = str(value).strip()
    return re.sub(r"\s+", " ", text)


def norm(value):
    text = clean(value).upper()
    text = (
        text.replace("�", "I")
        .replace("Á", "A")
        .replace("É", "E")
        .replace("Í", "I")
        .replace("Ó", "O")
        .replace("Ú", "U")
    )
    return text


def find_col(columns, candidates):
    normalized = {norm(c): c for c in columns}
    for candidate in candidates:
        if candidate in normalized:
            return normalized[candidate]
    for key, original in normalized.items():
        if any(candidate in key for candidate in candidates):
            return original
    return None


def month_from_sheet(sheet_name):
    name = norm(sheet_name)
    for month_name, month_number in MONTH_ORDER.items():
        if month_name in name:
            return month_number
    return None


def parse_amount(value):
    if pd.isna(value):
        return None
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if math.isnan(value):
            return None
        return float(value)
    text = str(value).strip().replace("$", "").replace(" ", "")
    if "," in text and "." in text:
        text = text.replace(".", "").replace(",", ".")
    elif "," in text:
        text = text.replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return None


def record_from_row(row, cols, sheet, month_number):
    fecha = row.get(cols["fecha"])
    amount = parse_amount(row.get(cols["monto"]))
    if pd.isna(fecha) or amount is None:
        return None
    if not isinstance(fecha, pd.Timestamp):
        fecha = pd.to_datetime(fecha, errors="coerce")
    if pd.isna(fecha):
        return None
    if fecha.month != month_number:
        return None
    tipo = norm(row.get(cols["tipo"])) if cols["tipo"] else ""
    categoria = norm(row.get(cols["categoria"])) if cols["categoria"] else ""
    return {
        "fecha": fecha.strftime("%Y-%m-%d"),
        "sheet": sheet,
        "periodo": f"{month_number:02d}_2026",
        "periodoLabel": MONTH_LABELS[month_number],
        "unidad": norm(row.get(cols["unidad"])) or "SIN UNIDAD",
        "tipo": tipo or ("INGRESO" if amount > 0 else "EGRESO"),
        "categoria": categoria or "SIN CATEGORIA",
        "detalle": norm(row.get(cols["detalle"])) if cols["detalle"] else "",
        "descripcion": clean(row.get(cols["descripcion"])) if cols["descripcion"] else "",
        "area": norm(row.get(cols["area"])) or "SIN AREA",
        "medio": norm(row.get(cols["medio"])) if cols["medio"] else "",
        "detalle2": clean(row.get(cols["detalle2"])) if cols["detalle2"] else "",
        "monto": round(amount, 2),
        "egreso": round(abs(amount), 2) if amount < 0 else 0,
        "ingreso": round(amount, 2) if amount > 0 else 0,
    }


def build():
    xl = pd.ExcelFile(WORKBOOK)
    rows = []
    for sheet in xl.sheet_names:
        month_number = month_from_sheet(sheet)
        if not month_number:
            continue
        df = pd.read_excel(WORKBOOK, sheet_name=sheet)
        cols = {
            "fecha": find_col(df.columns, ["FECHA"]),
            "descripcion": find_col(df.columns, ["DESCRIPCION", "DESCRIPCION"]),
            "categoria": find_col(df.columns, ["CATEGORIA"]),
            "detalle": find_col(df.columns, ["DETALLE"]),
            "monto": find_col(df.columns, ["MONTO"]),
            "medio": find_col(df.columns, ["T/E/C/ECHEQ/R", "MEDIO"]),
            "area": find_col(df.columns, ["AREA"]),
            "tipo": find_col(df.columns, ["TIPO MOVIMIENTO", "ING/EGRES", "INGRES"]),
            "unidad": find_col(df.columns, ["UNIDAD NEGOCIOS", "UNIDAD"]),
            "detalle2": find_col(df.columns, ["DETALLE 2"]),
        }
        if not cols["fecha"] or not cols["monto"]:
            continue
        for _, row in df.iterrows():
            record = record_from_row(row, cols, sheet, month_number)
            if record:
                rows.append(record)

    rows.sort(key=lambda r: (r["fecha"], r["unidad"], r["tipo"], r["categoria"]))

    periods = []
    for period in sorted({r["periodo"] for r in rows}):
        period_rows = [r for r in rows if r["periodo"] == period]
        work_days = sorted({
            r["fecha"]
            for r in period_rows
            if r["tipo"] == "INGRESO"
            and r["categoria"] == "VENTA DIARIA"
            and r["ingreso"] > 0
            and datetime.fromisoformat(r["fecha"]).weekday() < 5
        })
        periods.append({
            "id": period,
            "label": period_rows[0]["periodoLabel"],
            "month": int(period[:2]),
            "year": 2026,
            "workDays": len(work_days),
            "firstDate": min(r["fecha"] for r in period_rows),
            "lastDate": max(r["fecha"] for r in period_rows),
            "isPartial": int(period[:2]) == 9,
        })

    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "source": {
            "file": str(WORKBOOK),
            "lastModified": datetime.fromtimestamp(WORKBOOK.stat().st_mtime).isoformat(timespec="seconds"),
            "sheets": sorted({r["sheet"] for r in rows}),
        },
        "periods": periods,
        "rows": rows,
        "rules": {
            "baseOperativaDefault": "Excluye INGRESOS, MOV.INT y PAGO A PROVEEDORES para mirar estructura operativa.",
            "workingDays": "Dias con facturacion detectados como movimientos de INGRESO en VENTA DIARIA.",
        },
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    build()
