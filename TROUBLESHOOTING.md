# Troubleshooting Guide

## Common Issues and Solutions

### 🔥 Login Timeout / "Connection timed out" Error

**Symptoms:**
- Login requests timeout after 30 seconds
- Guest users can't see any listings
- App worked yesterday but doesn't work today

**Solutions (in order):**

#### 1. Clear Metro Cache (Most Common Fix)
```bash
npm run start:fresh
```
This clears the Metro bundler cache and restarts with fresh code.

#### 2. Deep Clean (If #1 doesn't work)
```bash
npm run start:clean
```
This clears watchman cache, node_modules cache, and Metro cache.

#### 3. Check Supabase Project Status
1. Go to [supabase.com](https://supabase.com/dashboard)
2. Open your project
3. Look for green "Project Status" indicator
4. If paused, click "Restore project" and wait 1-2 minutes

#### 4. Clear App Data
- **iOS Simulator:** Device → Erase All Content and Settings
- **Android Emulator:** Settings → Apps → Renting App → Clear Data
- **Physical Device:** Shake device → "Reload" or uninstall/reinstall app

### 🐛 Tests Failing with Syntax Errors

**Solution:**
```bash
npm test
```
Tests should pass. If you see Flow syntax errors, the Jest configuration may need updating.

### 📦 NPM Vulnerabilities

**Solution:**
```bash
npm audit fix
```

## Best Practices

### Starting Development
- **First time each day:** Use `npm run start:fresh` to avoid cache issues
- **Normal development:** Use `npm start`
- **Having issues:** Use `npm run start:clean`

### Before Deployment
1. Run `npm run lint` - Fix any linting errors
2. Run `npm test` - Ensure all tests pass
3. Run `npm audit` - Check for vulnerabilities
4. Test on both iOS and Android if possible

## Quick Reference

| Command | When to Use |
|---------|-------------|
| `npm start` | Normal development |
| `npm run start:fresh` | First start of the day, or if seeing weird behavior |
| `npm run start:clean` | Deep issues, complete cache problems |
| `npm run android:fresh` | Android with cache clear |
| `npm run ios:fresh` | iOS with cache clear |
