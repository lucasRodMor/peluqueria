# Peluquería - Servicios Profesionales

Este proyecto es una plataforma moderna para servicios de peluquería, diseñada para ofrecer una experiencia interactiva y fluida a los clientes. Incluye integración con IA y un sistema de reserva optimizado.

## ✨ Características

- 💇‍♂️ **Catálogo de Servicios**: Listado detallado de servicios con descripciones y precios.
- 📅 **Reservas Online**: Integración con Calendly para una gestión de citas sencilla.
- 🤖 **Asistente AI**: Potenciado por Google Gemini para responder dudas sobre servicios y disponibilidad.
- 📱 **Diseño Responsive**: Optimizado para móviles, tablets y escritorio.
- ⚡ **Alto Rendimiento**: Creado con Vite y React para una carga ultrarrápida.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19, Vite, Tailwind CSS
- **IA**: Google Generative AI (Gemini)
- **Animaciones**: Motion (framer-motion)
- **Iconos**: Lucide React
- **Componentes**: Calendly React SDK

## 🚀 Instalación y Uso Local

### Requisitos Previos

- [Node.js](https://nodejs.org/) (versión LTS recomendada)

### Pasos para Ejecutar

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/lucasRodMor/peluqueria.git
   cd peluqueria
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz (o usa `.env.example` como base) y añade tu clave de API de Gemini:
   ```env
   VITE_GEMINI_API_KEY=tu_clave_aqui
   ```

4. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

## 📦 Despliegue

Para generar la versión de producción:
```bash
npm run build
```
Esto creará una carpeta `dist/` con los archivos optimizados listos para ser desplegados en servicios como Netlify, Vercel o GitHub Pages.

---
Creado con ❤️ para un servicio de peluquería excepcional.
