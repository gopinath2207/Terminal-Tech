# Affiliate Blog Platform — Walkthrough

## What Was Built

A full **MERN Stack Affiliate Blog Platform** in `e:/blog_website/` with:

- **`server/`** — Express + Node.js API (Controller→Service→Repository pattern)  
- **`client/`** — React 19 + Vite 8 + Tailwind CSS v3 SPA

---

## Server Architecture (29 files)

| Layer | Files |
|---|---|
| Entry | [index.js](file:///e:/blog_website/server/index.js) (helmet, cors, compression, rate-limit, morgan) |
| Config | [config/db.js](file:///e:/blog_website/server/config/db.js), [config/cloudinary.js](file:///e:/blog_website/server/config/cloudinary.js) |
| Models | `User`, [Post](file:///e:/blog_website/client/src/components/blog/PostCard.jsx#5-70), [Product](file:///e:/blog_website/client/src/pages/admin/ProductsPage.jsx#8-111), [Click](file:///e:/blog_website/server/repositories/click.repository.js#7-8) (Mongoose, all indexed) |
| Repositories | `post`, `product`, `click` (all reads use `.lean()`) |
| Services | `auth`, `post`, `product`, `cloudinary` |
| Controllers | `auth`, `post`, `product`, `affiliate`, `analytics` |
| Routes | `auth`, `post`, `product`, `affiliate`, `analytics` |
| Middleware | `auth` (JWT HttpOnly cookie), [error](file:///e:/blog_website/server/utils/apiResponse.utils.js#12-17) (global), [upload](file:///e:/blog_website/server/services/cloudinary.service.js#6-26) (Multer memory), [validate](file:///e:/blog_website/server/middleware/validate.middleware.js#3-16) (Zod) |
| Validators | `auth`, `post`, `product` (Zod schemas) |
| Utils | [jwt.utils.js](file:///e:/blog_website/server/utils/jwt.utils.js), [apiResponse.utils.js](file:///e:/blog_website/server/utils/apiResponse.utils.js) |

## Client Architecture (25 files)

| Area | Details |
|---|---|
| Framework | Vite 8 + React 19 + Tailwind CSS v3 |
| Routing | React Router v6, **all pages lazy-loaded** with `React.lazy` + `Suspense` |
| Data fetching | **TanStack React Query** v5 (5-min stale time, no window refocus) |
| Auth | `AuthContext` bootstraps from HttpOnly cookie on mount |
| Editor | `@uiw/react-md-editor` (React 19 compatible Markdown editor) |
| SEO | `react-helmet-async` — dynamic `<title>`, description, OG/Twitter tags per page |
| Icons | `lucide-react` throughout |

## Build Verification

```
✓ vite build — 2921 modules transformed in 993ms, zero errors
✓ All 15 route chunks lazy-split (per React.lazy)
```

## Getting Started

### 1. Server — Fill in `.env`
```bash
cp server/.env.example server/.env
# Edit server/.env with your real values:
# MONGO_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
```

### 2. Run the Stack
```bash
# Terminal 1 — Backend
cd server && npm run dev          # nodemon on port 5000

# Terminal 2 — Frontend
cd client && npm run dev          # Vite on port 5173
```

### 3. Verify Health
```
GET http://localhost:5000/api/health
# → { "success": true, "status": "ok" }
```

### 4. Create Admin Account
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"yourpassword"}'
```

### 5. Admin Routes
| URL | Description |
|---|---|
| `/admin/login` | Login page |
| `/admin/dashboard` | Stats + recent clicks |
| `/admin/posts` | Manage all posts |
| `/admin/products` | Manage all products |

### 6. Public Routes
| URL | Description |
|---|---|
| `/` | Home (Trending + Top 5 sections) |
| `/post/:slug` | Full article with comparison table |
| `/go/:shortCode` | Affiliate redirect (tracked click → 301) |

## Key Design Decisions

- **Tailwind custom colors**: `text-matrix` = `#00FF41`, `bg-[#050505]`, glassmorphism via `glass-card` utility class
- **Images**: Never stored in MongoDB — Cloudinary stream upload with `f_auto,q_auto,w_1200` transforms
- **Markdown editor**: `@uiw/react-md-editor` (replaced react-quill which doesn't support React 19)
- **Affiliate clicks**: Logged as fire-and-forget `Promise.all` — never blocks the 301 redirect

## Deployment

- **Render (server)**: Set all `.env` vars in Render dashboard, start command: `node index.js`
- **Vercel (client)**: Set `VITE_API_URL` if needed, build command: `npm run build`, output: `dist/`
- **MongoDB Atlas**: Free M0 cluster — paste connection string into `MONGO_URI`
