# Última actualización del Radar Financiero

- Fecha de actualización: 02/09/2026
- Fuente: `P:\ADMINISTRACION\GASTOS MENSUALES\GASTOS MENSUALES 2026 LEI.xlsx`
- Hojas procesadas: JULIO26, AGOSTO26
- Archivo CSV generado: `movimientos_normalizados_julio_agosto_2026.csv`

## Resumen operativo
- JULIO26: 484 movimientos | ingresos $363.322.914,71 | egresos $401.131.616,55 | saldo operativo $-37.808.701,84 | MOV.INT neto $-31.908.839,20 | período 2026-07-01 a 2026-08-10
- AGOSTO26: 467 movimientos | ingresos $359.788.181,54 | egresos $372.581.380,08 | saldo operativo $-12.793.198,54 | MOV.INT neto $24.654.076,65 | período 2026-08-03 a 2026-08-31
- TOTAL: 951 movimientos | ingresos $723.111.096,25 | egresos $773.712.996,63 | saldo operativo $-50.601.900,38 | MOV.INT neto $-7.254.762,55 | período 2026-07-01 a 2026-08-31

## Criterio aplicado
- Los movimientos `MOV.INT` y los movimientos entre unidades de negocio se excluyen de ingresos, egresos y saldo operativo consolidado. Se muestran como movimientos internos para auditoría.
- `DETALLE 2` sigue quedando fuera del tablero porque funciona como información auxiliar y no como dimensión central de análisis.

## Alertas de carga
- Se detectaron 8 movimientos con signo contrario al tipo informado; se normalizaron según `Tipo Movimiento`, salvo los internos.
- El neto de movimientos internos no cierra en cero. Hay filas `INFORMACION / MOV.ENTRE U.NEGOCIOS` con contrapartidas faltantes o importes distintos; el radar las excluye del flujo operativo, pero conviene revisarlas en Excel para analizar liquidez por unidad.
- La hoja `JULIO26` contiene una fila fechada el 2026-08-10; el filtro de julio calendario la deja afuera, pero aparece si se analiza todo lo cargado.
