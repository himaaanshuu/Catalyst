# 🔐 OAuth Setup Guide - Catalyst

This guide walks you through setting up Google OAuth authentication for Catalyst. Currently, only Google OAuth is supported for social login.

---

## Prerequisites

- Supabase project created
- Google account for Google Cloud Console
- Basic understanding of OAuth 2.0

---

## 🟢 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name (e.g., "Catalyst Auth")
4. Click **Create**

### Step 2: Configure OAuth Consent Screen

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Click **Create**
4. Fill in required fields:
   - **App name:** Catalyst
   - **User support email:** Your email
   - **Developer contact email:** Your email
5. Click **Save and Continue**
6. Skip **Scopes** (click Save and Continue)
7. Add test users if needed
8. Click **Save and Continue**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Application type:** Web application
4. Enter **Name:** Catalyst Web Client
5. Add **Authorized JavaScript origins:**
   - `http://localhost:3000` (for development)
   - Your production URL (e.g., `https://yourdomain.com`)
6. Add **Authorized redirect URIs:**
   - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
   - Replace `YOUR_SUPABASE_PROJECT` with your actual Supabase project reference
7. Click **Create**
8. **Copy** the **Client ID** and **Client Secret** (you'll need these)

### Step 4: Configure Supabase

1. Open your Supabase project dashboard
2. Go to **Authentication** → **Providers**
3. Find **Google** in the provider list
4. Toggle **Enable Google Provider** to ON
5. Paste your **Client ID** from Step 3
6. Paste your **Client Secret** from Step 3
7. Click **Save**

### Step 5: Test the Integration

1. Run your local development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page: `http://localhost:3000/Authentication/login`

3. Click **"Continue with Google"**

4. You should be redirected to Google login

5. After successful login, you'll be redirected back to the dashboard

### Step 6: Update for Production

When deploying to production:

1. **Update Authorized JavaScript origins** in Google Cloud Console:
   - Add your production domain (e.g., `https://catalyst.vercel.app`)

2. **Update Authorized redirect URIs:**
   - Keep the Supabase callback URL (same for all environments)

3. **Update Site URL in Supabase:**
   - Go to **Authentication** → **URL Configuration**
   - Set **Site URL** to your production domain

---

## 🔍 Troubleshooting

### Error: "Invalid redirect_uri"

**Cause:** Redirect URI mismatch

**Solution:**
- Ensure the redirect URI in Google Cloud Console exactly matches:
  ```
  https://YOUR_PROJECT.supabase.co/auth/v1/callback
  ```
- No trailing slashes
- Use HTTPS (not HTTP)

### Error: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not configured properly

**Solution:**
- Complete all required fields in OAuth consent screen
- Add your email as a test user
- Ensure app is in "Testing" mode for development

### Error: "Popup closed by user"

**Cause:** Browser blocking popups or user closed the window

**Solution:**
- Enable popups for your site
- Try signing in again
- Check browser console for errors

### Error: "User not found"

**Cause:** User doesn't exist in Supabase after OAuth

**Solution:**
- Check Supabase Dashboard → Authentication → Users
- User should be created automatically after first login
- Verify RLS policies allow user creation

### Login works locally but not in production

**Cause:** Incorrect redirect URLs for production

**Solution:**
- Add production domain to authorized origins in Google Console
- Update Site URL in Supabase settings
- Clear browser cache and try again

---

## 📋 Quick Reference

### Supabase Callback URL Format
```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

### Required Google Cloud Console URLs
- **Authorized JavaScript origins:**
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`

- **Authorized redirect URIs:**
  - `https://<your-project-ref>.supabase.co/auth/v1/callback`

### Code Implementation (Already Done)

The OAuth implementation in Catalyst uses:

```javascript
// Login with Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard/business`
  }
})
```

Located in:
- `/src/app/Authentication/login/page.js`
- `/src/app/Authentication/signup/page.js`

---

## 🔒 Security Best Practices

1. **Never commit credentials**
   - Don't commit Client ID/Secret to Git
   - Use environment variables for sensitive data

2. **Restrict redirect URIs**
   - Only add URLs you control
   - Remove localhost URLs in production

3. **Review OAuth scopes**
   - Request only necessary permissions
   - Default scopes: email, profile

4. **Monitor usage**
   - Check Google Cloud Console for API usage
   - Review Supabase Auth logs regularly

5. **Keep secrets secure**
   - Rotate Client Secret periodically
   - Use Supabase's secure storage

---

## 📚 Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [OAuth 2.0 Explained](https://www.oauth.com/)

---

## ✅ Setup Checklist

- [ ] Create Google Cloud project
- [ ] Configure OAuth consent screen
- [ ] Create OAuth credentials (Client ID + Secret)
- [ ] Add authorized JavaScript origins
- [ ] Add authorized redirect URIs
- [ ] Enable Google provider in Supabase
- [ ] Add Client ID and Secret to Supabase
- [ ] Test login locally
- [ ] Update URLs for production
- [ ] Test production deployment

---

**Need help?** Check the [main README](README.md) or open an issue on GitHub.
