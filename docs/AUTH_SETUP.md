# Supabase Authentication Setup

## 🔐 Enable Email Authentication

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your `golf-tracker-ai` project
3. Navigate to **Authentication** → **Providers**
4. **Email** should already be enabled by default
5. Confirm **"Confirm email"** is set to your preference:
   - **Disabled** = Users can sign in immediately (recommended for development)
   - **Enabled** = Users must verify email first (recommended for production)

---

## 🔵 Enable Google OAuth (Optional but Recommended)

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**
5. Configure OAuth consent screen if prompted:
   - User Type: **External**
   - App name: **Golf Tracker**
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **Golf Tracker**
   - Authorized redirect URIs:
     ```
     https://ajvivmpdwkgsiioregzf.supabase.co/auth/v1/callback
     ```
7. Copy your **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Toggle **"Enable Sign in with Google"**
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

---

## ✅ Test Authentication

### Test Email/Password Sign Up

1. Go to `http://localhost:3000/signup`
2. Fill in the form:
   - First name: Test
   - Last name: User
   - Email: test@example.com
   - Password: password123
3. Click **"Create account"**
4. You should be redirected to `/dashboard`

### Test Email/Password Login

1. Go to `http://localhost:3000/login`
2. Enter the credentials you just created
3. Click **"Sign in"**
4. You should be redirected to `/dashboard`

### Test Google OAuth

1. Go to `http://localhost:3000/login`
2. Click **"Log in with Google"**
3. Select your Google account
4. You should be redirected to `/dashboard`

---

## 🐛 Troubleshooting

### "Invalid login credentials"
- Check that email/password are correct
- Verify email authentication is enabled in Supabase
- Check Supabase logs in Dashboard → **Authentication** → **Logs**

### Google OAuth not working
- Verify redirect URI matches exactly in Google Console
- Check that Google provider is enabled in Supabase
- Make sure Client ID and Secret are correct
- Check browser console for errors

### "User already registered"
- This email is already in use
- Try logging in instead of signing up
- Or use a different email address

### Redirected to login after signup
- Check that your `.env.local` has correct Supabase credentials
- Verify the `handle_new_user()` trigger is working in Supabase
- Check Supabase logs for errors

---

## 📝 What Was Implemented

### Auth Helper Functions (`src/lib/auth.ts`)
- ✅ `signUp()` - Email/password registration
- ✅ `signIn()` - Email/password login
- ✅ `signInWithGoogle()` - Google OAuth
- ✅ `signOut()` - Sign out user
- ✅ `getCurrentUser()` - Get current user
- ✅ `isAuthenticated()` - Check if user is logged in

### Login Page (`src/app/login/page.tsx`)
- ✅ Email/password form
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Google OAuth button
- ✅ Redirect to dashboard on success

### Signup Page (`src/app/signup/page.tsx`)
- ✅ Email/password registration form
- ✅ First name & last name fields
- ✅ Form validation (min 8 chars password)
- ✅ Loading states
- ✅ Error handling
- ✅ Google OAuth button
- ✅ Redirect to dashboard on success

### OAuth Callback (`src/app/auth/callback/route.ts`)
- ✅ Handles Google OAuth redirect
- ✅ Exchanges code for session
- ✅ Redirects to dashboard

### Dashboard (`src/app/dashboard/page.tsx`)
- ✅ Protected route (redirects to login if not authenticated)
- ✅ Shows user email
- ✅ Sign out button
- ✅ Placeholder content

---

## 🚀 Next Steps

1. **Test the authentication flow**
2. **Enable Google OAuth** (optional)
3. **Build out the dashboard** with actual golf tracking features
4. **Add password reset** functionality
5. **Add email verification** for production

---

*Authentication is now fully functional!* 🎉
