## Descripción del Proyecto
Campus Parking es una aplicación web diseñada para automatizar la gestión de un
estacionamiento, asegurando el cumplimiento de formatos de placa y cálculos
precisos de cobro por tiempo transcurrido.

## DIAGRAMA DE FLUJO
![alt text](./IMAGENES/image.png)

# Campus Parking 
Sistema de gestión de estacionamiento desarrollado para el
control de ingreso, salida y cobro de vehículos en tiempo


## Funcionalidades
- **Gestión de Vehículos**: Registro de entrada con validación
de placa (3 letras y 3 números).
- **Control de Espacios**: Visualización interactiva de 10
espacios (Libre/Ocupado).
- **Cálculo Automático**: Cobro basado en tipos de vehículos
configurables y tiempo de estancia.
- **Historial y Registros**: Bitácora completa de movimientos
y gestión (CRUD) de tarifas.
- **Perfil de Usuario**: Edición de datos del administrador.

## Tecnologías
- HTML / CSS
- JavaScript 
## Reglas de Negocio Implementadas
1. **Formato de Placa**: Solo se aceptan placas con el formato
`AAA123`.
2. **Validación de Tiempo**: No se permite marcar salida si la
hora es anterior a la de entrada.
3. **Persistencia**: Todos los datos se almacenan en el
navegador mediante `localStorage`.

---
Desarrollado por **Sergio Ajú** - Guatemala 2026.