# 📂 Catalog Folder Strategy - Catalyst

This document outlines the architecture and implementation strategy for the public catalog system in Catalyst.

---

## 🎯 Overview

The catalog system allows business owners to create public-facing product catalogs accessible via unique URLs. Customers can view products and place orders through WhatsApp without needing to log in.

### Key Features

- **Public Access** - No authentication required for viewing
- **SEO-Friendly URLs** - Clean slugs like `/Catalog/johns-bakery`
- **WhatsApp Integration** - Direct order placement
- **Mobile-First Design** - Optimized for smartphones
- **Real-time Search** - Filter products instantly
- **Easy Sharing** - Copy link and share buttons

---

## 🏗 Architecture

### URL Structure

```
/Catalog/[businessSlug]
```

**Example URLs:**
- `/Catalog/johns-bakery`
- `/Catalog/tech-store-2024`
- `/Catalog/fashion-boutique`

### Dynamic Routing

Uses Next.js App Router dynamic segments:

```
src/app/Catalog/[businessSlug]/page.js
```

The `[businessSlug]` parameter is extracted using `useParams()` hook.

---

## 📊 Data Flow

```
User visits → /Catalog/johns-bakery
          ↓
useParams() extracts slug → 'johns-bakery'
          ↓
Fetch business from Supabase → WHERE slug = 'johns-bakery'
          ↓
Fetch products for business → WHERE business_id = business.id
          ↓
Render catalog page → Display business info + products
          ↓
User clicks order → WhatsApp opens with pre-filled message
```

---

## 🗃 Database Schema

### Businesses Table

```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  business_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  slug TEXT UNIQUE NOT NULL,  -- URL identifier
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Key Points:**
- `slug` must be unique across all businesses
- `slug` is auto-generated from `business_name`
- Format: lowercase, alphanumeric, hyphens only
- Example: "John's Bakery" → "johns-bakery"

### Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  image_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Key Points:**
- Products cascade delete with business
- `image_url` must be valid HTTPS URL
- `price` stored as decimal for accuracy

---

## 🔐 Security & Privacy

### Row-Level Security (RLS)

**Public Read Access:**
```sql
-- Anyone can view businesses by slug
CREATE POLICY "Public can view businesses by slug"
ON businesses FOR SELECT
USING (slug IS NOT NULL);

-- Anyone can view all products
CREATE POLICY "Public can view all products"
ON products FOR SELECT
USING (true);
```

**Private Write Access:**
```sql
-- Only owners can modify their businesses
CREATE POLICY "Users can update their own businesses"
ON businesses FOR UPDATE
USING (auth.uid() = user_id);

-- Only owners can add products
CREATE POLICY "Users can create products for their businesses"
ON products FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  )
);
```

### Data Visibility

**Public Information:**
- ✅ Business name, description
- ✅ Product names, prices, images
- ✅ Contact info (phone, WhatsApp)

**Private Information:**
- ❌ User IDs
- ❌ Email addresses (unless explicitly shown)
- ❌ Creation timestamps
- ❌ Edit/delete capabilities

---

## 🎨 UI/UX Design

### Mobile-First Layout

```
┌─────────────────────┐
│   Business Header   │
│  ┌───┐              │
│  │IMG│ Name         │
│  └───┘ Description  │
│        📞 Contact   │
├─────────────────────┤
│   Search Box 🔍     │
├─────────────────────┤
│  ┌────┐  ┌────┐    │
│  │Img │  │Img │    │
│  │$10 │  │$15 │    │
│  └────┘  └────┘    │
│  ┌────┐  ┌────┐    │
│  │Img │  │Img │    │
│  │$20 │  │$12 │    │
│  └────┘  └────┘    │
└─────────────────────┘
```

### Product Card Design

Each product card shows:
- **Image** - 200x200px thumbnail
- **Name** - Bold, 2 lines max
- **Description** - Gray text, 3 lines max
- **Price** - Large, accent color
- **Order Button** - Green WhatsApp-styled

### Business Header

- **Logo/Image** - Circular, 80x80px
- **Business Name** - Large heading
- **Description** - Paragraph text
- **Contact Info** - Phone, WhatsApp icons
- **Share Button** - Copy link functionality

---

## 🔄 Component Structure

### Main Component: CatalogPage

```javascript
'use client'

export default function CatalogPage() {
  // State
  const [business, setBusiness] = useState(null)
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Extract slug from URL
  const params = useParams()
  const slug = params.businessSlug
  
  // Fetch data
  useEffect(() => {
    fetchBusinessAndProducts()
  }, [slug])
  
  // Filter products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div>
      <BusinessHeader business={business} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <ProductGrid products={filteredProducts} />
    </div>
  )
}
```

### Sub-Components

**BusinessHeader:**
- Displays business info
- Copy link button
- Share functionality

**SearchBar:**
- Real-time filtering
- Clear button
- Mobile-optimized input

**ProductGrid:**
- Responsive grid (1-2-3 columns)
- Maps over filtered products
- Renders ProductCard for each

**ProductCard:**
- Product image with fallback
- Name, description, price
- WhatsApp order button

---

## 📱 WhatsApp Integration

### Message Format

When a customer clicks "Order on WhatsApp":

```
Hi! I'd like to order:
- [Product Name] ($[Price])

From: [Business Name]
```

### URL Generation

```javascript
const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`
```

**Requirements:**
- Phone number in international format (e.g., `919876543210`)
- No spaces, dashes, or special characters
- Country code included

---

## 🔍 SEO Optimization

### Slug Generation

```javascript
const generateSlug = (businessName) => {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Remove duplicate hyphens
    .substring(0, 50)              // Limit length
}
```

### Uniqueness Checking

```javascript
let slug = generateSlug(businessName)
let isUnique = false
let attempt = 0

while (!isUnique && attempt < 10) {
  const { data } = await supabase
    .from('businesses')
    .select('slug')
    .eq('slug', slug)
    .single()
  
  if (!data) {
    isUnique = true
  } else {
    attempt++
    slug = `${generateSlug(businessName)}-${attempt}`
  }
}
```

### Meta Tags (Future Enhancement)

```html
<meta name="description" content="Business description" />
<meta property="og:title" content="Business Name" />
<meta property="og:description" content="..." />
<meta property="og:image" content="logo_url" />
```

---

## 🚀 Performance Optimization

### Current Implementation

1. **Single Query** - Fetch business and products together
2. **Client-Side Filtering** - Fast search without re-fetching
3. **Image Optimization** - Use Next.js Image component (future)
4. **Lazy Loading** - Load images as they enter viewport (future)

### Future Enhancements

1. **Static Generation** - Pre-render popular catalogs
2. **CDN Caching** - Cache catalog pages
3. **Image Compression** - Optimize product images
4. **Pagination** - For businesses with 100+ products
5. **Infinite Scroll** - Better mobile experience

---

## ✨ Future Features

### Phase 1: Core Enhancements
- [ ] Image upload to Supabase Storage
- [ ] Product categories
- [ ] Sorting options (price, name, newest)
- [ ] Filter by price range

### Phase 2: Advanced Features
- [ ] Business logo upload
- [ ] Custom color themes
- [ ] Multiple images per product
- [ ] Product variants (size, color)
- [ ] Stock quantity tracking

### Phase 3: Growth Features
- [ ] Analytics (views, clicks)
- [ ] QR code generation
- [ ] Custom domain mapping
- [ ] Multi-language support
- [ ] Dark mode

### Phase 4: Enterprise
- [ ] Team collaboration
- [ ] API access
- [ ] Bulk import/export
- [ ] Advanced SEO tools
- [ ] Payment integration

---

## 🐛 Common Issues & Solutions

### Issue: Business not found (404)

**Causes:**
- Slug doesn't exist in database
- RLS policy blocking access
- Typo in URL

**Solutions:**
```sql
-- Verify slug exists
SELECT * FROM businesses WHERE slug = 'your-slug';

-- Check RLS policies
SELECT * FROM businesses; -- Should return all if logged out
```

### Issue: Products not loading

**Causes:**
- Products table empty
- RLS policy too restrictive
- Foreign key constraint issue

**Solutions:**
```sql
-- Check products exist
SELECT * FROM products WHERE business_id = 'business-uuid';

-- Verify RLS policy allows public read
SELECT * FROM products; -- Should work even when logged out
```

### Issue: WhatsApp link not working

**Causes:**
- Invalid phone number format
- Missing country code
- Special characters in number

**Solutions:**
```javascript
// Correct format
whatsapp: "919876543210"  // ✅

// Incorrect formats
whatsapp: "+91 98765 43210"  // ❌ (spaces)
whatsapp: "98765-43210"      // ❌ (dash, no country code)
```

### Issue: Slow catalog loading

**Causes:**
- Too many products (100+)
- Large image files
- Slow network

**Solutions:**
- Implement pagination
- Optimize images
- Add loading states
- Use CDN for images

---

## 📚 Related Documentation

- [README.md](README.md) - Project overview
- [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md) - Authentication setup
- [add_business_slugs.sql](add_business_slugs.sql) - Database migration
- [setup_rls_policies.sql](setup_rls_policies.sql) - Security policies

---

## 🎓 Learning Resources

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [WhatsApp API](https://faq.whatsapp.com/5913398998672934)
- [SEO Best Practices](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

---

**Created for Catalyst v0.1.0**  
**Last Updated: March 2026**
