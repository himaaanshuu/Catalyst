# 🚀 Quick Start Guide - Catalyst

Quick reference for common tasks and commands.

---

## ⚡ Fast Setup (5 minutes)

```bash
# 1. Clone and install
git clone https://github.com/himaaanshuu/Catalyst.git
cd Catalyst
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run development server
npm run dev
# Visit http://localhost:3000
```

**Next Steps:**
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run SQL scripts in Supabase SQL Editor (see Database Setup below)
3. Update `.env.local` with your Supabase URL and key
4. Restart dev server

---

## 📦 NPM Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Check code quality
```

---

## 🗄️ Database Setup

### 1. Create Tables

```sql
-- Copy from README.md Database Setup section
-- Paste into Supabase SQL Editor → Run
```

### 2. Add Slug Column

```bash
# Copy contents of add_business_slugs.sql
# Paste into Supabase SQL Editor → Run
```

### 3. Enable RLS Policies

```bash
# Copy contents of setup_rls_policies.sql
# Paste into Supabase SQL Editor → Run
```

### 4. Verify Setup

```sql
-- Check tables exist
SELECT * FROM businesses LIMIT 1;
SELECT * FROM products LIMIT 1;

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';
```

### 5. Add Payments Table (Razorpay logs)

```bash
# Copy contents of add_payments_table.sql
# Paste into Supabase SQL Editor -> Run
```

---

## 🔑 Environment Variables

**Get from Supabase Dashboard → Settings → API**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay (for online payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Keep secrets safe:**
- Do not commit `.env.local`.
- Share only masked values in logs/screenshots.

```env
RAZORPAY_KEY_ID=rzp_test_xxxx****xxxx
RAZORPAY_KEY_SECRET=****REDACTED****
SUPABASE_SERVICE_ROLE_KEY=****REDACTED****
```

**Restart dev server after changes!**

---

## 🧪 Testing Your Setup

### 1. Authentication
- Visit `/Authentication/signup`
- Create account with email/password
- Should redirect to `/dashboard/business`

### 2. Create Business
- Click "Create Business" button
- Fill in: Name, Description, Phone, WhatsApp
- WhatsApp format: `919876543210` (country code + number)
- Click Save

### 3. Add Products
- Click "Manage Products" on business card
- Click "Add Product"
- Fill in: Name, Description, Price, Image URL
- Use any image URL (e.g., from Unsplash)
- Click Add Product

### 4. View Catalog
- Click 🌐 "View Catalog" button
- Should open public catalog page
- URL format: `/Catalog/your-business-slug`
- Test search and WhatsApp order buttons

---

## 🐛 Common Issues

### "Row violates row-level security policy"
```sql
-- Run setup_rls_policies.sql in Supabase SQL Editor
```

### "Business not found" on catalog
```sql
-- Verify slug exists
SELECT id, business_name, slug FROM businesses;

-- If slug is NULL, run add_business_slugs.sql
```

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Port 3000 in use
```bash
lsof -ti:3000 | xargs kill -9
# or use different port:
npm run dev -- -p 3001
```

---

## 📱 WhatsApp Integration

### Phone Number Format

```javascript
// ✅ Correct
whatsapp: "919876543210"  // Country code (91) + number

// ❌ Wrong
whatsapp: "+91 9876543210"  // No spaces or +
whatsapp: "9876543210"      // Missing country code
```

### Test WhatsApp Link

1. Add WhatsApp number to business
2. View catalog page
3. Click "Order on WhatsApp" on any product
4. Should open WhatsApp with pre-filled message

---

## 🔄 Git Workflow

### First Time Setup

```bash
# Fork repo on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Catalyst.git
cd Catalyst

# Add upstream remote
git remote add upstream https://github.com/himaaanshuu/Catalyst.git
```

### Making Changes

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes...

# Commit
git add .
git commit -m "feat: add your feature"

# Push to your fork
git push origin feature/your-feature

# Create Pull Request on GitHub
```

### Syncing with Main

```bash
git checkout main
git pull upstream main
git push origin main
```

---

## 🚀 Deployment (Vercel)

### Quick Deploy

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click Deploy

### After Deployment

1. Update Supabase Site URL:
   - Dashboard → Authentication → URL Configuration
   - Set to your Vercel domain

2. Update Google OAuth (if using):
   - Add Vercel domain to authorized origins
   - See OAUTH_SETUP_GUIDE.md

---

## 📂 File Structure Quick Reference

```
src/app/
├── Authentication/
│   ├── login/page.js       # Login page
│   └── signup/page.js      # Signup page
├── Catalog/
│   └── [businessSlug]/
│       └── page.js         # Public catalog (dynamic)
├── Component/
│   ├── Navbar.js           # Top navigation
│   ├── DashboardLayout.js  # Sidebar layout
│   ├── ProductCard.js      # Product display
│   ├── BusinessCard.js     # Business display
│   ├── UIComponents.js     # Buttons, inputs
│   └── Modal.js            # Modal dialogs
├── dashboard/
│   └── business/page.js    # Business management
├── features/page.js        # Marketing pages
├── templates/page.js
├── settings/page.js
├── layout.js               # Root layout
└── page.js                 # Homepage

src/Library/
└── Supabase.js             # Supabase client
```

---

## 🔍 Debugging Checklist

### Before Opening an Issue

- [ ] Checked browser console for errors
- [ ] Verified environment variables are set
- [ ] Restarted dev server
- [ ] Database tables exist
- [ ] RLS policies are enabled
- [ ] Tried clearing `.next` folder
- [ ] Checked Supabase logs
- [ ] Tested with different browser
- [ ] Searched existing GitHub issues

---

## 📞 Getting Help

**Documentation:**
- [README.md](README.md) - Full documentation
- [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md) - OAuth setup
- [CATALOG_FOLDER_STRATEGY.md](CATALOG_FOLDER_STRATEGY.md) - Catalog architecture
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contributing guide

**Support:**
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- README Troubleshooting: Common solutions

---

## 📋 Pre-Launch Checklist

- [ ] Environment variables configured
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Slug migration run
- [ ] Authentication working
- [ ] Can create businesses
- [ ] Can add products
- [ ] Catalog pages load
- [ ] WhatsApp links work
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Build succeeds (`npm run build`)
- [ ] Tested on multiple browsers
- [ ] Google OAuth configured (optional)
- [ ] Ready to deploy!

---

## 💡 Pro Tips

1. **Use keyboard shortcuts:**
   - `Cmd/Ctrl + K` to search files
   - `Cmd/Ctrl + P` to run commands

2. **Development workflow:**
   - Keep dev server running
   - Browser auto-refreshes on save
   - Check console for errors

3. **Database queries:**
   - Test in Supabase SQL Editor first
   - Use `LIMIT` for large tables
   - Check RLS policies affect results

4. **Image URLs:**
   - Use Unsplash for free images
   - Format: `https://images.unsplash.com/photo-xxxxx`
   - Consider image CDN for production

5. **Testing:**
   - Test both logged in and logged out views
   - Test on mobile viewport (Chrome DevTools)
   - Clear localStorage if auth issues

---

**Quick Links:**
- [Live Demo](#) (Coming soon)
- [GitHub Repo](https://github.com/himaaanshuu/Catalyst)
- [Report Issue](https://github.com/himaaanshuu/Catalyst/issues)
- [Documentation](README.md)

**Happy coding! 🎉**
