# Diagnostico inicial - Proyecto Gestion Financiera PRONTO! Express

Fuente revisada: GASTOS MENSUALES 2026 LEI.xlsx, hoja JUNIO 26.

## Hallazgos

- La hoja principal tiene 397 movimientos reales entre 2026-06-01 y 2026-06-24.
- Hay 390 movimientos clasificados y 7 pendientes de completar con unidad, categoria y tipo.
- CALLAO y V. OBLIGADO ya estan diferenciados en la columna Unidad Negocios.
- El archivo tambien tiene muchas filas vacias con formulas arrastradas; el tablero las ignora.

## Totales clasificados

- Ingresos: $308.999.839
- Egresos: $289.290.233
- Saldo operativo: $19.709.607

## Por unidad de negocio

- CALLAO: ingresos $274.823.341, egresos $277.052.161, saldo -$2.228.820.
- V. OBLIGADO: ingresos $34.176.498, egresos $12.238.071, saldo $21.938.427.

## Recomendaciones

1. Mantener una tabla base unica de movimientos.
2. Hacer obligatorios Fecha, Unidad Negocios, Ing/Egres, Categoria, Detalle, Area y Monto.
3. Para CALLAO, conectar luego informacion de Chess: ventas por marca, stock valorizado, vendedores, zonas y margen.
4. Para V. OBLIGADO, no usar indicadores de venta comercial; medir servicio logistico, costos operativos y resultado.
5. Separar GERENCIA / ADMINISTRACION cuando el gasto no pertenece directamente a un negocio.

## Actualizacion - desglose por detalle

Se agrego al tablero una pestaña **Desglose detalle** y un selector de categoria.

Para **PAGO A PROVEEDORES**, el proveedor se toma de la columna **DESCRIPCION** porque en los datos revisados la columna **DETALLE** indica principalmente **CUENTA CORRIENTE**. Para el resto de las categorias, el desglose usa la columna **DETALLE**.

Principales pagos a proveedores detectados en junio 2026:

- PAULINA: $175.170.676 de egresos, 29 movimientos.
- ILOLAY: $10.899.342 de egresos, 10 movimientos.
- ORALI: $8.656.603 de egresos, 4 movimientos.
- SODECAR: $5.807.589 de egresos, 3 movimientos.
- ONNEG: $2.808.452 de egresos, 2 movimientos.
