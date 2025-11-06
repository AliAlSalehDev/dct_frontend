# 💻 Mini eCommerce Frontend (Next.js + Tailwind v4 + shadcn/ui)

Frontend for the **Mini eCommerce Product Listing** project.  
Built with **Next.js (App Router, TypeScript)**, **Tailwind CSS v4**, and **shadcn/ui**.

## ⚙️ Tech Stack

- Next.js (App Router, TS)
- Tailwind CSS v4 + `@tailwindcss/postcss`
- shadcn/ui (on-demand components)
- Axios (API client)
- React Hook Form + Zod (validation)
- Sonner (toasts)
- Lucide Icons

## 🚀 Features

- Products table with **search, category filter, stock filter, pagination**
- **Add Product** modal form with validation
- **Delete Product** with confirm dialog
- Responsive UI using shadcn/ui
- Simple Home page → button to **/products**

## 📦 Folder Structure

```

app/
├─ page.tsx # Home page (Go to Products)
└─ products/
└─ page.tsx # Products list + Add modal
components/
├─ ProductForm.tsx # Create product form
├─ ProductTable.tsx # List + filters + delete
└─ ui/ # shadcn/ui components
lib/
├─ http.ts # Axios instance
└─ types.ts # TS types (Product, Category, etc.)
app/globals.css # Tailwind v4 + theme tokens

```

## 🔌 API Base URL

The frontend talks to the Laravel API:

```

NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

```

Axios instance builds: `{BASE_URL}/api`.

## 🧩 Endpoints Used

- `GET  /api/v1/products?q=&category_id=&stock_status=&page=&per_page=`
- `POST /api/v1/products`
- `DELETE /api/v1/products/:id`
- `GET  /api/v1/categories?limit=200`

## ⚡ Quick Start

```bash
# 1) Install deps
npm install

# 2) Env
cp .env.example .env.local
# then set:
# NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# 3) Dev
npm run dev
# open http://localhost:3000
```
