# 🚀 Catalyst - Product Catalog SaaS Platform

**Catalyst** is a modern, no-code product catalog platform that enables businesses to create beautiful, mobile-optimized catalogs with WhatsApp ordering integration. Perfect for small businesses, retailers, and entrepreneurs who want to showcase their products online without technical knowledge.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Setup](#-database-setup)
- [Environment Variables](#-environment-variables)
- [Common Issues & Solutions](#-common-issues--solutions)
- [Deployment](#-deployment)
- [Currently Working On](#-currently-working-on)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)

**📚 Additional Documentation:**
- [⚡ QUICKSTART.md](QUICKSTART.md) - Fast setup and common tasks
- [🔐 OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md) - Google OAuth configuration
- [📂 CATALOG_FOLDER_STRATEGY.md](CATALOG_FOLDER_STRATEGY.md) - Catalog architecture
- [🤝 CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [📝 CHANGELOG.md](CHANGELOG.md) - Version history

---

## ✨ Features

### For Business Owners
- 🏢 **Multi-Business Management** - Create and manage multiple catalogs from one dashboard
- 📦 **Product Management** - Add, edit, delete products with images, prices, descriptions
- 🔐 **Secure Authentication** - Email/password + Google OAuth login
- 📊 **Business Dashboard** - View all businesses and products in one place
- 🌐 **Public Catalog Pages** - Each business gets a unique, shareable URL
- ⚙️ **Settings Management** - Update profile and business information
- 💳 **Razorpay Plan Checkout** - Paid plans are processed through Razorpay before catalog creation
- 🧾 **Pricing Plans** - Free / Basic / Standard / Pro plans with tiered pricing and limits
- 🪪 **Plan Lock During Signup** - Plan selected on homepage carries into registration automatically
- 🖼️ **Template/Plan Previews** - Visual previews for each available plan style
- 🔗 **Stable Public Links** - Normalized lowercase `/catalog/:slug` links for easier sharing

### For Customers
- 🛍️ **Beautiful Product Display** - Mobile-first, responsive catalog pages
- 💬 **WhatsApp Ordering** - One-click order via WhatsApp with pre-filled messages
- 💸 **Razorpay Product Payments** - Customers can pay for products directly from catalog cards
- 🔍 **Product Search** - Find products quickly with real-time search
- 📤 **Easy Sharing** - Copy link or share catalog on social media
- 📄 **Download Catalog as PDF** - Export catalog pages for offline share or print
- 📱 **Mobile Optimized** - Fast, touch-friendly interface

### Technical Features
- 🎨 **Custom Design System** - Beautiful UI with animations and transitions
- 🔒 **Row-Level Security** - Secure database access with Supabase RLS
- 🏃 **Fast Performance** - Optimized loading and caching
- 🌍 **SEO-Friendly URLs** - Clean slugs like `/catalog/your-business`
- 🔄 **Real-time Updates** - Instant sync across devices
- 🧩 **Shared Template Registry** - Centralized template config in `src/Library/catalogTemplates.js`
- 🧮 **Plan-to-DB Key Mapping** - Backward-compatible handling for legacy template keys
- 🧾 **Payment Logging** - Verified Razorpay transactions saved to Supabase `payments` table
- 🏠 **Homepage Pricing + Popup** - Dedicated pricing section and plan selector modal on `/`
- 🗺️ **SEO Metadata Routes** - Dynamic `robots.txt` and `sitemap.xml` support
- 🌐 **EN/HI Language Toggle** - Hindi and English toggle on key landing/dashboard views

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing and transformations
- **Google Fonts** - Syne (headings) + Outfit (body text)

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (Email + OAuth)
  - Row-Level Security (RLS)
  - Real-time subscriptions

### Authentication
- **Supabase Auth** - Secure authentication system
- **Google OAuth** - Social login integration
- **Session Management** - Persistent login state

### Deployment
- **Vercel** - Hosting and deployment (recommended)
- **GitHub** - Version control and CI/CD

---

## 📁 Project Structure

```
catalyst/
├── src/
│   ├── app/
│   │   ├── Authentication/          # Auth pages
│   │   │   ├── login/page.js       # Login page
│   │   │   └── signup/page.js      # Signup page
│   │   ├── Catalog/                # Public catalog
│   │   │   └── [businessSlug]/
│   │   │       └── page.js         # Dynamic catalog page
│   │   ├── Component/              # Reusable components
│   │   │   ├── Navbar.js           # Navigation bar
│   │   │   ├── DashboardLayout.js  # Dashboard sidebar
│   │   │   ├── ProductCard.js      # Product display
│   │   │   ├── BusinessCard.js     # Business display
│   │   │   ├── UIComponents.js     # Buttons, inputs, etc.
│   │   │   └── Modal.js            # Modal dialogs
│   │   ├── dashboard/
│   │   │   └── business/page.js    # Business management
│   │   ├── features/page.js        # Features marketing page
│   │   ├── templates/page.js       # Templates showcase
│   │   ├── settings/page.js        # User settings
│   │   ├── layout.js               # Root layout
│   │   ├── page.js                 # Homepage
│   │   └── globals.css             # Global styles
│   └── Library/
│       ├── Supabase.js             # Supabase client
│       └── auth.js                 # Auth utilities
├── public/                         # Static assets
├── add_business_slugs.sql          # Database migration
├── setup_rls_policies.sql          # RLS policies
├── OAUTH_SETUP_GUIDE.md            # OAuth configuration guide
├── CATALOG_FOLDER_STRATEGY.md      # Catalog architecture
├── next.config.mjs                 # Next.js config
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Supabase account** (free tier works)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/himaaanshuu/Catalyst.git
   cd Catalyst
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

From your project directory, you can run:

### `npm run dev`
Starts the development server on [http://localhost:3000](http://localhost:3000)
- Hot reload enabled
- Shows compilation errors
- Best for local development

### `npm run build`
Creates an optimized production build
- Generates static pages
- Minifies JavaScript and CSS
- Optimizes images and fonts
- Run this before deploying

### `npm start`
Starts the production server (requires `npm run build` first)
- Serves optimized build
- Use for testing production build locally

### `npm run lint`
Runs ESLint to check code quality
- Identifies potential errors
- Enforces code style
- Run before committing code

---

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your **Project URL** and **Anon Key**

### 2. Create Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create businesses table
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_products_business_id ON products(business_id);
```

### 3. Run Migration for Slugs

Execute the SQL from `add_business_slugs.sql` in Supabase SQL Editor:

```bash
# Copy the contents of add_business_slugs.sql and run in Supabase
```

### 3.1 Run Migration for `template_key`

Execute SQL from `add_business_template_key.sql` in Supabase SQL Editor.

This adds `template_key` support for business records and keeps compatibility with plan selection.

### 4. Set Up Row-Level Security

Execute the SQL from `setup_rls_policies.sql`:

```sql
-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies (see setup_rls_policies.sql for full details)
```

### 4.1 Set Up Payments Table (Razorpay)

Execute SQL from `add_payments_table.sql` to store verified payment records.

### 5. Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Email** provider
3. (Optional) Enable **Google** OAuth following `OAUTH_SETUP_GUIDE.md`

---

## 🔑 Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Required to save verified payment records from API routes
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Where to find these:**
- Go to Supabase Dashboard → Settings → API
- Copy **Project URL** and **anon/public** key

---

## ⚠️ Common Issues & Solutions

### 1. **"Row violates row-level security policy"**

**Cause:** RLS policies not set up correctly

**Solution:**
```sql
-- Run setup_rls_policies.sql in Supabase SQL Editor
-- Make sure both businesses and products tables have RLS enabled
```

### 2. **"Failed to login with Google"**

**Cause:** Google OAuth not configured

**Solution:**
- Follow `OAUTH_SETUP_GUIDE.md`
- Ensure redirect URL is: `https://your-project.supabase.co/auth/v1/callback`
- Enable Google provider in Supabase Dashboard

### 3. **"Business not found" on catalog page**

**Cause:** Slug column missing or not populated

**Solution:**
```sql
-- Run add_business_slugs.sql migration
-- Ensure slug column exists and has values
SELECT id, business_name, slug FROM businesses;
```

### 4. **"Module not found" errors**

**Cause:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 5. **Port 3000 already in use**

**Solution:**
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### 6. **"Invalid session" errors**

**Cause:** Expired or corrupted auth session

**Solution:**
```javascript
// Clear browser localStorage and cookies
// Or implement in code:
await supabase.auth.signOut()
// Then login again
```

### 7. **Images not loading**

**Cause:** Invalid image URLs or CORS issues

**Solution:**
- Use valid image URLs (https://)
- Consider using Supabase Storage for uploads
- Check browser console for CORS errors

### 8. **WhatsApp button not working**

**Cause:** Invalid phone number format

**Solution:**
- Use international format: `919876543210` (no + or spaces)
- Include country code
- Remove special characters

### 9. **"Insert error" while creating business (template_key mismatch)**

**Cause:** Database constraint still expects old template keys and migration is missing/outdated.

**Solution:**
- Run `add_business_template_key.sql` in Supabase SQL Editor.
- If constraint already exists with old values only, update the check constraint manually.
- Re-test by creating a business from homepage-selected plan.

### 10. **Razorpay modal not opening during plan/business creation**

**Cause:** Missing Razorpay env vars, script blocked, or order creation failed.

**Solution:**
- Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in `.env.local`.
- Restart dev server after env updates.
- Open DevTools Network tab and check `/api/razorpay/create-order` response.

### 11. **Payment verifies but record is not saved in `payments` table**

**Cause:** Missing `SUPABASE_SERVICE_ROLE_KEY` or `payments` table not created.

**Solution:**
- Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`.
- Run `add_payments_table.sql` migration.
- Confirm API route logs do not show insert errors.

### 12. **"Failed to load resource: 400" for image URLs (`/_next/image`)**

**Cause:** Next image optimizer rejecting preview sources in some contexts.

**Solution:**
- Hard refresh (`Cmd+Shift+R`).
- Use current code (plan preview images are configured with `unoptimized` where required).
- Verify image URLs are valid and publicly reachable.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

### Update Supabase Settings

After deployment, update:
1. **Site URL** in Supabase → Authentication → URL Configuration
2. **Redirect URLs** to include your production domain
3. **OAuth redirect URLs** in Google Cloud Console (if using OAuth)

---

## 🚧 Currently Working On

- Enforcing strict plan limits (product caps) at creation/update time
- Dashboard UI for payment history and reconciliation
- Webhook-based Razorpay confirmation for stronger backend guarantees
- Production observability and alerting for payment/API failures

---

## 🔮 Future Roadmap

### Phase 1: Near-Term Enhancements
- [ ] Image upload to Supabase Storage (replace external-only image URLs)
- [ ] Product categories and category-level filtering
- [ ] Bulk product import (CSV)
- [x] PDF export for public catalogs
- [ ] Better public catalog 404 and "business not found" UX

### Phase 2: Business Features
- [ ] Analytics dashboard (views, clicks, orders)
- [ ] Inventory management
- [ ] Product variants (size, color)
- [ ] Discount codes and pricing
- [ ] Customer reviews and ratings

### Phase 3: Advanced Features
- [ ] Custom domains for catalogs
- [ ] Theme customization (colors, fonts)
- [ ] Full multi-language coverage for all pages/components
- [x] Razorpay integration
- [ ] QR code generation
- [ ] Team collaboration

### Phase 4: Scaling
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations
- [ ] Advanced SEO optimization
- [ ] Performance monitoring
- [ ] A/B testing framework

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Test thoroughly before submitting PR
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/himaaanshuu/Catalyst/issues)
- **Documentation:** See `OAUTH_SETUP_GUIDE.md` and `CATALOG_FOLDER_STRATEGY.md`
- **Email:** [Your support email]

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)
- Icons and images from [Unsplash](https://unsplash.com/)

---

**Made with ❤️ by Himanshu**

[![GitHub Stars](https://img.shields.io/github/stars/himaaanshuu/Catalyst?style=social)](https://github.com/himaaanshuu/Catalyst)
[![GitHub Forks](https://img.shields.io/github/forks/himaaanshuu/Catalyst?style=social)](https://github.com/himaaanshuu/Catalyst)

---

## 🚀 Quick Start Checklist

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Create Supabase project
- [ ] Set up database tables
- [ ] Run SQL migrations
- [ ] Configure environment variables
- [ ] Enable RLS policies
- [ ] Run dev server (`npm run dev`)
- [ ] Create test business
- [ ] Add products
- [ ] Test catalog page
- [ ] Deploy to Vercel
- [ ] Update production URLs

**Happy coding! 🎉**

---

## ⚡ Known Limitations

### Current Version (v0.2.0)

1. **Image Storage**
   - Products use external image URLs only
   - No built-in image upload (planned for v0.2.0)
   - Workaround: Use Imgur, Cloudinary, or similar services

2. **Single Language**
   - English only
   - Multi-language support planned for future releases

3. **No Order Management**
   - Orders handled through WhatsApp only
   - No built-in order tracking
   - Consider external order management tools

4. **Limited Analytics**
   - No built-in view counter or analytics
   - Use Google Analytics or similar for tracking

5. **No Payment Integration**
   - Cash/manual payment coordination only
   - Payment gateway integration planned

6. **Product Limitations**
   - No product variants (size, color, etc.)
   - No inventory tracking
   - No product categories/collections

7. **Business Limitations**
   - One logo per catalog (logo_url field exists but not implemented in UI)
   - No custom domain mapping
   - No theme customization

8. **Mobile App**
   - Web-only (mobile responsive)
   - No native iOS/Android apps

### Performance Considerations

- Large product lists (100+) may slow catalog page
- Image loading depends on external URL speed
- Database queries not optimized for scale (adequate for <10,000 products)

### Browser Compatibility

- Modern browsers only (Chrome, Firefox, Safari, Edge)
- IE11 not supported
- JavaScript required (no SSR fallback)

---

## 🧪 Development Workflow

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit files in `src/`
   - Dev server auto-reloads

3. **Test locally**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

4. **Check for errors**
   ```bash
   npm run lint
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

7. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

### Database Changes

1. **Create migration SQL file**
   - Name it descriptively (e.g., `add_categories_table.sql`)
   - Include rollback instructions in comments

2. **Test in Supabase SQL Editor**
   - Run on development project first
   - Verify with SELECT queries

3. **Update RLS policies if needed**
   - Add to `setup_rls_policies.sql`
   - Test with different user roles

4. **Document in README**
   - Update database schema section
   - Add migration to setup instructions

### Code Style

- Use functional components (no class components)
- Prefer `const` over `let`
- Use async/await over promises
- Keep components under 300 lines
- Add comments for complex logic
- Use descriptive variable names

### Debugging Tips

1. **Check browser console** - Most errors show here
2. **Check Supabase logs** - Database errors appear here
3. **Use React DevTools** - Inspect component state
4. **Check Network tab** - API call failures
5. **Enable verbose logging** - Add console.log() statements

---
