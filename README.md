<div align="center">

# 🏋️ GymConnect

**Plataforma web full stack para gimnasios: reserva de clases, roles, tienda online y panel de administración.**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/auth-JWT%20%2B%20bcrypt-F05032?style=flat-square)

[Funcionalidades](#funcionalidades) · [Arquitectura](#arquitectura) · [Cómo correrlo](#cómo-correrlo) · [API](#api) · [Manual de usuario](Manual_Usuario_GymConnect%20(1).docx.pdf)

</div>

## Qué resuelve

Un gimnasio suele manejar socios, horarios de clases y venta de productos por separado. GymConnect junta todo en una sola aplicación: los socios reservan cupos y compran en la tienda, los profesores publican sus clases y el administrador controla usuarios y permisos.

Proyecto académico de la materia *Proyecto II* (ET 36), desarrollado en equipo.

## Funcionalidades

| Rol | Qué puede hacer |
|---|---|
| 👤 **Cliente** | Registrarse, editar su perfil, ver clases, inscribirse y desinscribirse, comprar en la tienda y ver su historial de compras |
| 🧑‍🏫 **Profesor** | Crear y gestionar sus clases con cupos y horarios |
| 🛠️ **Administrador** | Gestionar usuarios, cambiar roles, eliminar cuentas y aprobar o rechazar solicitudes de profesor |

Además:

- 🔐 **Autenticación** con JWT y contraseñas hasheadas con bcrypt.
- 📩 **Solicitud para ser profesor**, con aprobación del admin y envío automático de emails (Nodemailer).
- 🛒 **Tienda** con catálogo, carrito lateral y órdenes de compra.
- 💾 **Persistencia real** en SQLite: los datos sobreviven al reinicio.
- 📱 Interfaz **responsive**.

## Stack

| Capa | Tecnologías |
|---|---|
| Frontend | React 19, Vite 7, React Router 7, Axios, Context API |
| Backend | Node.js, Express 4, Sequelize 6, JWT (`jsonwebtoken`), bcrypt, Nodemailer |
| Base de datos | SQLite (se crea y sincroniza sola al iniciar) |

## Arquitectura

```
backend/
└── src/
    ├── config/        base de datos, JWT y email
    ├── middlewares/   verificación de token y roles
    ├── models/        User, Role, Class, Enrollment, ProfesorRequest, Product, Order, OrderItem
    ├── routes/        auth, class, enrollment, profesor, admin, shop
    └── server.js      punto de entrada

frontend/
└── src/
    ├── components/    Navbar, ClassCard, ProductCard, CartSideBar
    ├── contexts/      AuthContext (sesión)
    ├── pages/         Home, Login, Register, Dashboard, Classes, MyClasses,
    │                  Tienda, Cart, Purchases, Profile, AdminPanel, SolicitarProfesor
    └── services/      cliente de la API
```

Las relaciones entre modelos (usuarios ↔ clases mediante inscripciones, órdenes ↔ productos) se definen en `models/asociacion.js`.

## Cómo correrlo

Necesitás **Node.js 18+** y npm.

```bash
git clone https://github.com/carolinalobo-dev/Proyecto-II-GymConnect.git
cd Proyecto-II-GymConnect

# Backend  →  http://localhost:5000
cd backend
npm install
cp .env.example .env     # completá JWT_SECRET y, si querés emails, los datos SMTP
npm run dev

# Frontend  →  http://localhost:5173  (en otra terminal)
cd frontend
npm install
npm run dev
```

Al iniciar por primera vez, el backend crea las tablas, los roles, clases y productos de ejemplo, y un usuario administrador:

| Usuario | Email | Contraseña |
|---|---|---|
| Admin | `admin@gymconnect.com` | `admin123` |

> Credenciales de demostración para desarrollo local. Cambialas antes de cualquier despliegue.

## API

Rutas principales (prefijo `/api`):

| Módulo | Endpoints |
|---|---|
| **Auth** | `POST /auth/register` · `POST /auth/login` · `GET /auth/validar-token` · `POST /auth/logout` |
| **Tienda** | `GET /shop/productos` · `POST /shop/ordenes` · `GET /shop/mis-compras` |
| **Clases, inscripciones, solicitudes de profesor y administración** | definidos en `routes/class`, `enrollment`, `profesor` y `admin` |

Las rutas protegidas requieren el token JWT en el encabezado `Authorization`.

## Próximas mejoras

- Notificaciones en tiempo real.
- Feed social con comentarios y reseñas de clases.
- Pasarela de pagos.
- Logros y gamificación.
- Reportes exportables.

## Autora

**Carolina Lobo** · [LinkedIn](https://www.linkedin.com/in/carolina-lobo-469705297) · lobocarolina99@gmail.com
