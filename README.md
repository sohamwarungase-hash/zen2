## MGS Web – ZenSolve (Smart Urban Grievance System)

ZenSolve is a **Smart Urban Grievance & Service Response System**.  
Citizens can report issues (waste, water supply, roads, streetlights, sanitation, etc.), and administrators can track, prioritize, and resolve complaints through a centralized web dashboard.

This repository contains the **web frontend (MGS Web)** built with **React + Vite + Tailwind** and integrates with **Supabase Auth**.

---

### Features

- **Citizen Login & Registration** (via Supabase Auth).
- **Role‑based navigation** for citizens vs. admins.
- **Modern UI** using Tailwind and shadcn-style components.
- **State management** with Zustand (`authStore`).
- Prepared structure to later integrate:
  - Complaint creation & listing.
  - Admin analytics and performance dashboards.

---

### Tech Stack

- **Frontend**: React 18, Vite, React Router, Tailwind CSS.
- **Auth & Backend-as-a-Service**: Supabase (`@supabase/supabase-js`).
- **State Management**: Zustand.
- **HTTP Client (reserved for future backend)**: Axios (configured but not required for Supabase-only auth).

---

### Project Structure (web)

- `src/`
  - `App.jsx` – root component, sets up router and global listeners.
  - `lib/supabase.js` – Supabase client and auth helpers.
  - `store/authStore.js` – Zustand store for auth/session.
  - `api/authApi.js` – login/register helpers using Supabase Auth.
  - `pages/auth/Login.jsx` – login screen.
  - Other pages/components can be added under `src/pages`, `src/components`, etc.
- `public/` – static assets (if any, standard Vite folder).
- `dist/` – production build output (ignored in Git).

Mobile and backend stubs live under `ZenSolve/` but are not required to run the basic web app:

- `ZenSolve/mgs-mobile/` – Expo React Native app (work-in-progress).
- `ZenSolve/mgs-backend/` – Node/Express + Prisma backend skeleton (work-in-progress).

---

### Environment Variables

Create a `.env` file in the project root (same folder as `package.json`) based on `.env.example`:

```env
# Supabase project settings
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>

# (Optional, for future custom backend)
VITE_API_URL=http://localhost:5000
```

- You can find `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Supabase project settings under **Project Settings → API**.
- `.env` is **ignored by Git** (see `.gitignore`).  
  Only commit `.env.example` to show other developers which keys are required.

After changing `.env`, **restart** the dev server so Vite picks up the new values.

---

### Getting Started (Local Development)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set environment variables**

   - Copy `.env.example` → `.env`.
   - Fill in your Supabase URL and anon key.

3. **Run the development server**

   ```bash
   npm run dev
   ```

   - Open the printed `http://localhost:5173` (or whatever Vite shows).

4. **Build for production**

   ```bash
   npm run build
   ```

   - Output goes to `dist/` (already ignored by `.gitignore`).

5. **Preview the production build (optional)**

   ```bash
   npm run preview
   ```

---

### Git / GitHub Notes

- This repo already includes a `.gitignore` that excludes:
  - `node_modules/`
  - `dist/` and `dist-ssr/`
  - `.env` and other local/editor files
- Safe to commit:
  - All source files in `src/`
  - Config files (`package.json`, `package-lock.json`, Vite/Tailwind configs, etc.)
  - `.env.example`, `README.md`, documentation, and design assets that do **not** contain secrets.

Basic Git workflow:

```bash
git init
git add .
git commit -m "Initial commit: MGS Web (ZenSolve)"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

---

### Roadmap Ideas

- Citizen dashboard:
  - Submit new complaints with photo & location.
  - Track status (submitted → in progress → resolved).
- Admin dashboard:
  - Analytics: complaints by category/ward, avg. resolution time.
  - Assignment to departments and officers.
  - SLA tracking and overdue alerts.
- Real-time updates via WebSockets (Socket.IO or Supabase Realtime).

---

### License

Add your preferred license here (e.g., MIT, Apache-2.0) before publishing publicly on GitHub.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
