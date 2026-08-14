# Criterio para movimientos internos - PRONTO! Express

## Objetivo

Registrar traspasos de liquidez entre unidades de negocio sin alterar el cash flow operativo consolidado.

Ejemplo actual: traslado de un ECHEQ desde V. OBLIGADO hacia CALLAO para que CALLAO pueda afrontar pagos a proveedores.

## Criterio recomendado

Usar `TIPO` = `MOV.INT` cuando el movimiento:

- No sea una venta, cobranza, gasto ni pago operativo externo.
- No represente entrada o salida de dinero frente a terceros.
- Sea solo un traslado interno entre unidades, cajas, bancos o medios de pago.

## Como cargarlo en Excel

La forma mas prolija es cargar siempre dos lineas:

1. Unidad que entrega la liquidez:
   - `UNIDAD DE NEGOCIO`: unidad origen, por ejemplo `V. OBLIGADO`.
   - `TIPO`: `MOV.INT`.
   - `MONTO`: negativo.

2. Unidad que recibe la liquidez:
   - `UNIDAD DE NEGOCIO`: unidad destino, por ejemplo `CALLAO`.
   - `TIPO`: `MOV.INT`.
   - `MONTO`: positivo.

Ambas lineas deberian tener:

- Misma fecha.
- Mismo importe absoluto.
- Misma descripcion, por ejemplo `DESC-ECHEQ`.
- Mismo detalle, por ejemplo `TRASPASO INTERNO ECHEQ`.
- Mismo medio, por ejemplo `ECHEQ`.

## Como lo interpreta el radar

El radar financiero no considera `MOV.INT` como ingreso ni como egreso operativo.

Por lo tanto:

- No suma en ingresos.
- No suma en egresos.
- No altera el saldo operativo consolidado.
- Si se filtra por `MOV.INT`, permite auditar los traspasos internos.

## Nota sobre la carga actual

Si se carga solo la linea positiva en CALLAO y no la negativa en V. OBLIGADO, el tablero igualmente excluye ese importe del flujo operativo para no inflar el resultado consolidado.

Para analizar liquidez real por unidad de negocio, conviene cargar ambas puntas del movimiento interno.
