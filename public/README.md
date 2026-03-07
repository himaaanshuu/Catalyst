# Public Assets

This folder contains static files that are served directly.

## Current Files

- `favicon.ico` - Browser tab icon (default Next.js icon)

## Recommended Additions

### Favicon
Replace the default `favicon.ico` with your Catalyst branding:
- Size: 32x32 px (minimum)
- Format: ICO, PNG, or SVG
- Tool: [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/)

### Logo
Add your business logo:
- `logo.png` or `logo.svg`
- Transparent background recommended
- Multiple sizes for different uses

### Open Graph Image
For social media sharing:
- `og-image.png` or `og-image.jpg`
- Size: 1200x630 px
- Shows when catalog links are shared on social media

### App Icons (Future)
For PWA/mobile app:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `apple-touch-icon.png` (180x180)

## Usage in Code

```javascript
// In layout.js metadata
export const metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: ['/og-image.png'],
  },
};
```

## Notes

- Files in this folder are accessible at the root URL
- Example: `public/logo.png` → `https://yourdomain.com/logo.png`
- No need to import these files in code
- Changes require dev server restart
