# Prime Properties BD — Project Setup Guide

## Tech Stack
- **Framework:** Next.js 16 (App Router) with Turbopack
- **Database:** SQLite via Prisma ORM
- **Auth:** NextAuth.js (Credentials Provider)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript

---

## ✅ Prerequisites
Make sure these are installed on your machine:
- **Node.js** v18+ → https://nodejs.org
- **npm** v9+ (comes with Node.js)
- **Git** (optional, for version control)

---

## 📦 First-Time Setup (Run These Once)

### 1. Install all dependencies
```bash
npm install
```

### 2. Set up the database (generate Prisma client & push schema)
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed the database (add initial properties, FAQs, admin user)
```bash
node prisma/seed.js
```

---

## 🚀 Run the Project (Development)

```bash
npm run dev
```

➡ Opens at: **http://localhost:3000**

---

## 🔑 Admin Dashboard

| URL | Description |
|-----|-------------|
| [`/admin/login`](http://localhost:3000/admin/login) | Admin login page |
| [`/admin`](http://localhost:3000/admin) | Dashboard overview |
| [`/admin/properties`](http://localhost:3000/admin/properties) | Manage properties |
| [`/admin/leads`](http://localhost:3000/admin/leads) | View & manage leads |
| [`/admin/chatbot`](http://localhost:3000/admin/chatbot) | Manage chatbot FAQs |
| [`/admin/chat-history`](http://localhost:3000/admin/chat-history) | View chatbot conversations |

**Default Admin Credentials:**
- Email: `arif@primepropertiesbd.com`
- Password: `admin@primeproperties` *(change this after first login!)*

--

## 🏗️ Build for Production

```bash
npm run build
```

Then start the production server:
```bash
npm run start
```

---

## 🗄️ Database Commands

| Command | Description |
|---------|-------------|
| `npx prisma db push` | Sync schema to database |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma studio` | Open visual database browser at localhost:5555 |
| `node prisma/seed.js` | Re-seed the database |

---

## 🎬 Hero Video Setup

To use a **custom high-rise building video** in the homepage hero section:

1. Download an MP4 video (high-rise building footage) from:
   - https://www.pexels.com/search/videos/skyscraper/
   - https://coverr.co/s?q=building
   - https://pixabay.com/videos/search/skyscraper/

2. Rename it to **`hero-building.mp4`**

3. Place it inside the **`public/`** folder:
   ```
   Prime Properties bd/
   └── public/
       └── hero-building.mp4  ✅ Place here
   ```

4. The video will automatically loop on the homepage.

---

## 🔧 Environment Variables (`.env`)

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="primepropertiesbdsecretkeytoken123456"
NEXTAUTH_URL="http://localhost:3000"

# Hero video path (put MP4 in public/ folder)
NEXT_PUBLIC_HERO_VIDEO_URL="/hero-building.mp4"
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── properties/           # Property listing & detail pages
│   ├── about/                # About Us page
│   ├── contact/              # Contact page
│   ├── landowner/            # Landowner JV page
│   ├── nrb/                  # NRB Services page
│   ├── admin/                # Admin dashboard (protected)
│   └── api/                  # API routes (leads, chatbot, auth)
├── components/
│   ├── layout/               # Navbar, Footer, MobileStickyBar
│   ├── home/                 # Hero, FeaturedProperties, etc.
│   ├── chatbot/              # ChatbotWidget
│   ├── details/              # Property detail components
│   └── providers/            # SessionProvider
├── lib/
│   └── prisma.ts             # Prisma singleton client
prisma/
├── schema.prisma             # Database schema
├── seed.js                   # Seed data
public/
└── PPD.png                   # Brand logo
    hero-building.mp4         # Hero background video
```

---

## 🛑 Stop the Dev Server

Press `Ctrl + C` in the terminal running `npm run dev`.

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `prisma: command not found` | Run `npx prisma generate` |
| Database errors | Run `npx prisma db push` to sync schema |
| Admin login fails | Re-run `node prisma/seed.js` to reset admin |
| Port 3000 in use | Change port: `npm run dev -- -p 3001` |
| Build errors | Check terminal output, run `npm install` again |
