# Changelog

All notable changes to Catalyst will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-03-08

### ✨ Features Added

#### Catalog Templates
- Added centralized template registry in `src/Library/catalogTemplates.js`
- Added template selection during business creation/edit flows
- Added visual template preview assets in `public/template-previews/`
- Added template checklist document: `CATALOG_TEMPLATE_CHECKLIST.md`

#### Public Catalog & Links
- Standardized public catalog links to lowercase `/catalog/:slug`
- Added compatibility rewrite from `/catalog/*` to `/Catalog/*` in Next config
- Improved success/dashboard link generation and copy-link behavior

#### SEO & Metadata
- Added dynamic `robots.txt` via `src/app/robots.js`
- Added dynamic `sitemap.xml` via `src/app/sitemap.js`

#### Localization
- Added English/Hindi language toggle coverage for key dashboard/landing flows

#### Database
- Added migration script `add_business_template_key.sql` for `businesses.template_key`

### 🔧 Configuration Changes
- Supabase client now uses env variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and throws a clear error when missing

---

## [0.1.0] - 2026-03-07

### 🎉 Initial Release

First public release of Catalyst - Product Catalog SaaS Platform.

### ✨ Features Added

#### Authentication System
- Email/password signup and login
- Google OAuth integration
- Session management with Supabase Auth
- Protected routes and authentication guards
- User profile management

#### Business Management
- Create multiple businesses per user
- Edit business details (name, description, contact)
- Delete businesses with cascade delete of products
- Auto-generated SEO-friendly slugs
- Business dashboard with overview cards
- WhatsApp contact integration

#### Product Management
- Add products with name, description, price, and image URL
- Edit existing products
- Delete products
- Image display with fallback handling
- Price formatting with currency symbol
- Product search functionality

#### Public Catalog System
- Dynamic routing with business slugs (`/Catalog/[businessSlug]`)
- Public-facing product catalogs (no login required)
- Mobile-responsive product grid
- Business header with contact info
- Real-time product search
- Share catalog functionality
- Copy link to clipboard
- WhatsApp order integration

#### UI/UX
- Mobile-first responsive design
- Custom Tailwind CSS styling
- Google Fonts integration (Syne + Outfit)
- Smooth animations and transitions
- Loading states for async operations
- Error handling with user-friendly messages
- Modal dialogs for forms
- Toast notifications

#### Database
- PostgreSQL via Supabase
- Row-Level Security (RLS) policies
- Businesses and products tables
- Slug column with uniqueness constraints
- Foreign key relationships
- Indexes for performance

### 📚 Documentation
- Comprehensive README with setup instructions
- Database migration SQL files
- RLS policy setup scripts
- OAuth setup guide
- Catalog folder strategy document
- Contributing guidelines
- Environment variable examples
- Troubleshooting section

### 🔒 Security
- Row-Level Security on all tables
- User-specific data access
- Public read-only access for catalogs
- Secure authentication with Supabase
- Environment variable configuration

### 🛠 Technical Stack
- Next.js 16.1.6 (App Router)
- React 19.2.3
- Tailwind CSS 4
- Supabase (Auth + PostgreSQL)
- ESLint for code quality

---

## [Unreleased]

### 🔮 Planned Features

#### Short-term (v0.2.0)
- Image upload to Supabase Storage
- Product categories and filtering
- Bulk product import (CSV)
- Business logo upload
- Email verification for signup
- Analytics dashboard (basic)

#### Medium-term (v0.3.0)
- Inventory management
- Product variants (size, color)
- Discount codes and pricing
- Customer reviews and ratings
- QR code generation
- Theme customization

#### Long-term (v1.0.0)
- Custom domains for catalogs
- Multi-language support
- Payment integration (Stripe, Razorpay)
- Team collaboration
- Mobile app (React Native)
- Advanced analytics

---

## Version History

### Version Numbering

- **MAJOR** version (1.0.0) - Incompatible API changes
- **MINOR** version (0.2.0) - New features (backwards compatible)
- **PATCH** version (0.0.1) - Bug fixes (backwards compatible)

### Release Notes Format

- 🎉 Initial Release
- ✨ Features Added
- 🐛 Bug Fixes
- ⚡ Performance Improvements
- 🔒 Security Updates
- 📚 Documentation
- 🔧 Configuration Changes
- ⚠️ Breaking Changes
- 🗑️ Deprecated Features
- 🚀 Deployment

---

## [0.0.1] - 2026-03-01 (Development)

### Initial Development
- Project setup with Next.js
- Basic authentication flow
- Dashboard layout structure
- Supabase integration

---

## How to Update This Changelog

When making changes, add entries under `[Unreleased]` section:

```markdown
### ✨ Features Added
- Brief description of new feature

### 🐛 Bug Fixes
- Description of bug fixed

### ⚡ Performance Improvements
- What was improved
```

Before release, move unreleased items to a new version section with date.

---

**Repository:** [https://github.com/himaaanshuu/Catalyst](https://github.com/himaaanshuu/Catalyst)  
**Documentation:** [README.md](README.md)  
**License:** [MIT](LICENSE)
