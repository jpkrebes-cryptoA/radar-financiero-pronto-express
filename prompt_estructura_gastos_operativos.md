# Prompt maestro - Estructura de Gastos Operativos PRONTO! Express

Necesito construir y mantener una vista llamada **Estructura de Gastos Operativos** tomando como fuente `GASTOS MENSUALES 2026 LEI.xlsx`.

El objetivo es analizar cuanto gasta PRONTO! Express en su estructura operativa, separado por unidad de negocio, area/sector y categoria, sin mezclarlo con ingresos ni con pagos de mercaderia.

## Criterio de inclusion

Incluir solamente movimientos de tipo `EGRESO` que representen gastos operativos reales de funcionamiento.

Excluir por defecto:

- Todos los movimientos tipo `INGRESO`.
- Todos los movimientos tipo `MOV.INT` o movimientos entre unidades de negocio.
- Egresos de categoria `PAGO A PROVEEDORES` cuando correspondan a proveedores de mercaderia: La Paulina, Ilolay, Orali, Sodecar, Onneg u otros equivalentes.

La exclusion de proveedores de mercaderia debe poder activarse o desactivarse con un boton para comparar gasto operativo puro contra egreso total operativo ampliado.

## Indicadores requeridos

- Total de gasto operativo del periodo.
- Gasto operativo por area/sector.
- Participacion porcentual de cada area sobre el total.
- Gasto por categoria dentro de cada area.
- Comparacion entre CALLAO y V. OBLIGADO.
- Evolucion diaria o semanal acumulada del gasto operativo.
- Ranking de mayores categorias y conceptos de gasto.
- Detalle de movimientos que componen cada resultado.

## Filtros requeridos

- Fecha desde/hasta.
- Mes completo.
- Ultimos 7 dias.
- Unidad de negocio.
- Area/sector.
- Categoria.
- Boton para incluir/excluir proveedores de mercaderia.

## Finalidad del tablero

Usar esta informacion para entender cuanto cuesta operar la empresa y luego cruzarla con ventas, margen bruto, contribucion marginal y markups. La pregunta de fondo es si la rentabilidad comercial generada por la venta alcanza para cubrir la estructura de gastos que no corresponde a reposicion de mercaderia.
