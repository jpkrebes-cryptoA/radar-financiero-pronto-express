# Contexto del proyecto — Radar Financiero PRONTO! Express

> Documento de incorporación para colaboradores. Resume el conocimiento durable del proyecto; el historial privado de conversaciones de Codex no forma parte del repositorio.

## Propósito

Concentrar movimientos financieros de PRONTO! Express en un radar gerencial simple, trazable y actualizable. El tablero debe separar las unidades CALLAO y V. OBLIGADO, mostrar ingresos, egresos y resultado, y ayudar a detectar desvíos y prioridades.

## Estado al 13 de agosto de 2026

- Existe un tablero HTML autocontenido en `index.html` y `Radar Financiero PRONTO Express.html`.
- El último corte documentado procesa julio y agosto de 2026, con 562 movimientos válidos hasta el 6 de agosto.
- Hay documentación de diagnóstico, indicadores recomendados y reglas de actualización.
- Existe un tablero separado para analizar la cuenta corriente de un cliente.
- El repositorio remoto `radar-financiero-pronto-express` fue cambiado de público a privado el 13 de agosto de 2026 por contener información empresarial sensible.
- El archivo normalizado de movimientos contiene información financiera y dejará de formar parte de nuevos commits; las fuentes se compartirán por el servidor interno o un canal seguro.

## Estructura importante

- `index.html`: entrada principal del Radar Financiero.
- `Radar Financiero PRONTO Express.html`: copia nominal del tablero.
- `tablero-cuenta-corriente-cliente.html`: análisis de facturas, créditos, recibos, vencimientos y saldo.
- `prompt_maestro_radar_financiero_v2.md`: procedimiento para regenerar/actualizar el radar.
- `diagnostico_inicial.md`: diagnóstico de la estructura de movimientos.
- `indicadores_recomendados.md`: KPIs actuales y futuros.
- `ultima_actualizacion_radar.md`: fuente, período y control del último procesamiento.

## Criterios de negocio vigentes

1. CALLAO y V. OBLIGADO se analizan por separado y también de forma consolidada.
2. Los movimientos requieren fecha, unidad, ingreso/egreso, categoría, detalle, área y monto.
3. En pagos a proveedores, la descripción puede identificar mejor al proveedor que el campo detalle.
4. Las cifras deben respetar los signos de la fuente, incluidos ajustes positivos dentro de egresos.
5. Para cuenta corriente: factura genera deuda, nota de crédito reduce deuda y recibo representa cobranza.
6. Los recibos deben aplicarse contra facturas abiertas según vencimiento para calcular atraso o adelanto.

## Próximos pasos prioritarios

1. Mover toda fuente Excel/CSV identificable fuera de Git y mantenerla en el servidor interno.
2. Automatizar una actualización reproducible sin incrustar datos sensibles en el código.
3. Incorporar presupuesto versus real, proyección de cierre y detección de gastos atípicos.
4. Conectar indicadores validados de Chess para CALLAO.
5. Completar la lógica del tablero de cuenta corriente y probarla con casos anonimizados.
6. Revisar permisos de GitHub y limitar colaboradores a quienes realmente necesiten acceso.

## Puesta en marcha para un colaborador

1. Clonar el repositorio privado.
2. Abrir `index.html` en un navegador para revisar el tablero vigente.
3. Leer `prompt_maestro_radar_financiero_v2.md` antes de actualizar datos.
4. Solicitar el Excel/CSV fuente por el servidor interno; no copiarlo al repositorio.
5. Al actualizar, registrar archivo fuente, hojas, período y totales en `ultima_actualizacion_radar.md`.

## Información que no debe subirse

- Movimientos bancarios o financieros identificables, extractos y archivos fuente de gestión.
- Datos de clientes, proveedores, empleados o cuentas corrientes.
- Credenciales, accesos remotos, contraseñas, tokens o enlaces privados.
- Archivos temporales de Excel, logs o exportaciones no anonimizadas.
- Documentación de red, accesos remotos o infraestructura interna ajena al radar.

## Forma de colaboración

- Repositorio siempre privado.
- Cambios mediante ramas y pull requests hacia `main`.
- Cada actualización de datos debe incluir conciliación de totales y período.
- Usar muestras ficticias o anonimizadas para pruebas.
- Actualizar este archivo cuando cambien criterios, fuentes o responsables.
