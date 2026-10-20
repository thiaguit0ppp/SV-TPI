# Plataforma de Delivery

## Descripción

Aplicación web de **delivery y gestión de pedidos** especializada en la venta de productos comestibles. Conecta comercios con clientes mediante una plataforma que permite explorar catálogos, realizar compras, gestionar pedidos y compartir opiniones sobre los productos adquiridos.

El proyecto busca simplificar la experiencia de compra y ofrecer a los vendedores un modelo de negocio basado en suscripciones, eliminando las comisiones por cada venta.

## Objetivos

- Facilitar la compra de productos comestibles con entrega a domicilio.
- Proporcionar herramientas de gestión para comercios y vendedores.
- Implementar un sistema de reseñas, comentarios y valoraciones que fomente la transparencia.
- Ofrecer un modelo SaaS con suscripciones mensuales o anuales, en lugar de comisiones por venta.

## Funcionalidades principales

### Clientes
- Registro e inicio de sesión mediante correo electrónico o Google OAuth.
- Búsqueda y filtrado de productos por categoría y precio.
- Gestión de direcciones de entrega y tarjetas guardadas.
- Carritos de compra independientes por comercio.
- Realización de pedidos con pago en efectivo o tarjeta simulada.
- Seguimiento del estado de los pedidos en tiempo real.
- Historial de compras y cancelaciones.
- Publicación de reseñas, comentarios y valoraciones positivas o negativas.

### Vendedores
- Gestión de múltiples comercios desde una misma cuenta.
- Administración de perfiles, horarios y catálogos de productos.
- Control de disponibilidad de productos.
- Gestión de pedidos mediante su aprobación o cancelación.
- Respuesta a reseñas de sus propios comercios.

### Administradores
- Gestión de categorías globales.
- Aprobación de solicitudes de nuevos vendedores.
- Administración de suscripciones.
- Moderación de reseñas y comentarios.

## Gestión de pedidos

El flujo de compra contempla las siguientes etapas:

1. El cliente selecciona los productos de un comercio.
2. Elige una dirección de entrega y un método de pago.
3. El pedido queda pendiente de confirmación.
4. El vendedor acepta o cancela la solicitud.
5. Si el pedido es aceptado, se procesa el pago con tarjeta o se establece el pago en efectivo contra entrega.
6. El cliente puede seguir las actualizaciones del pedido hasta su entrega.

Si el vendedor no responde en un plazo de 10 minutos, el sistema cancela automáticamente el pedido. Las etapas finales del envío son procesadas de forma simulada por el backend.

## Sistema de reseñas

La plataforma incorpora funcionalidades sociales para mejorar la transparencia y la confianza entre clientes y comercios:

- Publicación de reseñas con texto, emojis y una imagen.
- Distintivo de comprador verificado para compras comprobadas.
- Comentarios de clientes y respuestas de los vendedores.
- Valoraciones positivas y negativas de reseñas y comentarios.
- Moderación del contenido por parte del administrador.

## Modelo de negocio

La aplicación utiliza un modelo **B2B SaaS (Software as a Service)** dirigido a comercios de productos comestibles.

En lugar de cobrar una comisión por cada venta, ofrece suscripciones mensuales o anuales con una tarifa fija. Esto permite a los comercios conservar sus ganancias sin depender del volumen de pedidos.

El sistema contempla renovaciones automáticas y un período de gracia de cinco días ante la falta de pago, tras el cual se desactivan los beneficios de la suscripción.

## Decisiones de diseño

- **Disponibilidad binaria:** los vendedores activan o desactivan productos sin administrar cantidades numéricas de inventario.
- **Carritos independientes por comercio:** cada pedido corresponde a un único local, simplificando la gestión logística y los pagos.
- **Seguimiento automatizado:** el backend procesa las actualizaciones finales del pedido sin requerir una aplicación independiente para repartidores.
- **Experiencia reactiva:** los cambios de estado se reflejan en la interfaz sin necesidad de recargar la página.

## Roles de usuario

| Rol | Responsabilidad principal |
|---|---|
| Cliente | Comprar productos, gestionar pedidos y publicar opiniones. |
| Vendedor | Administrar comercios, productos y solicitudes de compra. |
| Administrador | Supervisar usuarios, categorías, suscripciones y contenido. |

## Estado del proyecto

Proyecto de desarrollo de una plataforma web de delivery con gestión de comercios, pedidos, suscripciones e interacción entre usuarios.