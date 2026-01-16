# 🚀 GitHub Setup Guide for KnowMyCampus

## ✅ Pre-Push Checklist

Before pushing to GitHub, ensure:
- [x] `.gitignore` files created (root and backend)
- [x] `.env.example` template created
- [x] `npm run dev` script added to backend
- [ ] Verified `.env` is not being tracked by Git
- [ ] Initialized Git repository (if not done)
- [ ] Created GitHub repository
- [ ] Pushed to GitHub

---

## 📋 Step-by-Step Instructions

### 1. Initialize Git Repository (if not already done)

```bash
# Navigate to project root
cd "d:\MERN Proj\KnowMyCampus"

# Initialize Git
git init

# Add all files (your .gitignore will protect sensitive files)
git add .

# Verify .env is NOT in the staged files
git status

# Create initial commit
git commit -m "Initial commit: KnowMyCampus - Unified College Web Application"
```

### 2. Verify Sensitive Files Are Ignored

**CRITICAL:** Run this command to ensure `.env` is NOT tracked:

```bash
git status
```

You should **NOT** see:
- `backend/.env`
- Any `.env` files

If you see `.env` files, **STOP** and run:
```bash
git rm --cached backend/.env
git commit -m "Remove .env from tracking"
```

### 3. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"New Repository"**
3. Name it: `KnowMyCampus` (or your preferred name)
4. **DO NOT** initialize with README (you already have one)
5. Click **"Create Repository"**

### 4. Connect and Push to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/KnowMyCampus.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔒 Security Checklist

Before sharing your repository:

- ✅ `.env` files are in `.gitignore`
- ✅ No passwords or API keys in code
- ✅ `.env.example` has placeholder values only
- ✅ Google Client ID/Secret not in repository
- ✅ JWT secrets not in repository

---

## 📝 For Other Developers

When someone clones your repository, they should:

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/KnowMyCampus.git
   cd KnowMyCampus
   ```

2. **Set up Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with their own values
   npm install
   npm run dev
   ```

3. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🛡️ What's Protected

The following files are **NOT** pushed to GitHub:
- `backend/.env` (contains your secrets)
- `node_modules/` (dependencies)
- Build outputs (`dist/`, `build/`)
- Log files
- Editor configs

---

## 📌 Important Notes

1. **Never commit `.env` files** - They contain sensitive information
2. **Always use `.env.example`** - For sharing configuration templates
3. **Update `.env.example`** - When you add new environment variables
4. **Keep secrets secret** - Never hardcode API keys in source code

---

## 🆘 If You Accidentally Pushed Secrets

If you accidentally pushed your `.env` file:

1. **Remove from Git history:**
   ```bash
   git rm --cached backend/.env
   git commit -m "Remove .env from tracking"
   git push
   ```

2. **Rotate all secrets immediately:**
   - Generate new JWT secret
   - Create new Google OAuth credentials
   - Update MongoDB credentials if exposed

3. **Consider using Git history rewrite** (advanced):
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/.env" \
   --prune-empty --tag-name-filter cat -- --all
   ```

---

## ✨ You're Ready!

Your project is now configured for safe GitHub deployment. Happy coding! 🎉
