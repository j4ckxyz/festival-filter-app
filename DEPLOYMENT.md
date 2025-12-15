# 🚀 Deployment Guide

## Quick Start (5 Minutes)

### Test Locally

1. **Navigate to the project**
   ```bash
   cd festival-filter-app
   ```

2. **Start a local server** (choose one):
   
   **Python 3:**
   ```bash
   python3 -m http.server 8000
   ```
   
   **Node.js:**
   ```bash
   npx http-server -p 8000
   ```
   
   **PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   - Desktop: `http://localhost:8000`
   - Mobile: `http://YOUR_LOCAL_IP:8000`
   
4. **Allow camera permissions** when prompted

---

## Production Deployment

### Option 1: GitHub Pages (FREE, RECOMMENDED)

Perfect for personal projects and demos.

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/festival-filter-app.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click Save

3. **Access your app**
   - URL: `https://yourusername.github.io/festival-filter-app`
   - Wait 1-2 minutes for initial deployment

**Pros:**
- ✅ Free hosting
- ✅ HTTPS by default
- ✅ Automatic deployments
- ✅ Custom domain support

**Cons:**
- ⚠️ Public repositories only (for free)

---

### Option 2: Netlify (FREE)

Great for continuous deployment.

#### Method A: Drag & Drop
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the `festival-filter-app` folder
3. Get instant URL: `https://random-name.netlify.app`

#### Method B: Git Integration
1. Push code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. "New site from Git" → Select repository
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `/`
5. Click "Deploy site"

**Pros:**
- ✅ Free tier generous
- ✅ Instant previews
- ✅ Custom domains
- ✅ HTTPS automatic
- ✅ Continuous deployment

**Cons:**
- None for this project!

---

### Option 3: Vercel (FREE)

Similar to Netlify, optimized for performance.

1. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI:**
   ```bash
   cd festival-filter-app
   vercel
   ```

3. **Or deploy via GitHub:**
   - Push to GitHub
   - Import project at [vercel.com](https://vercel.com)
   - Auto-deploys on every push

**Pros:**
- ✅ Excellent performance
- ✅ Free tier
- ✅ Serverless functions (if needed later)
- ✅ Analytics

---

### Option 4: Cloudflare Pages (FREE)

Fast global CDN.

1. Push code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. "Create a project" → Connect to Git
4. Build settings:
   - Build command: (none)
   - Output directory: `/`
5. Deploy!

**Pros:**
- ✅ Super fast (Cloudflare CDN)
- ✅ Unlimited bandwidth
- ✅ Free

---

### Option 5: Self-Hosted

For custom servers or hosting providers.

#### Using Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/festival-filter-app;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Using Apache

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/festival-filter-app
    
    <Directory /var/www/festival-filter-app>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/css application/json application/javascript
    </IfModule>
</VirtualHost>
```

---

## Custom Domain Setup

### For GitHub Pages

1. Add CNAME file:
   ```bash
   echo "your-domain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. Configure DNS:
   - Type: CNAME
   - Name: www (or @)
   - Value: yourusername.github.io

### For Netlify/Vercel/Cloudflare

1. Go to domain settings in dashboard
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

---

## Environment Considerations

### HTTPS Requirement
⚠️ **Camera API requires HTTPS or localhost**

- All deployment options above provide HTTPS
- Local testing works on `localhost`
- Don't use `http://` in production

### Browser Compatibility
Ensure your hosting serves correct MIME types:
- `.html` → `text/html`
- `.js` → `application/javascript`
- `.css` → `text/css`

Most modern hosts handle this automatically.

---

## Performance Optimization

### Before Deployment

1. **Minify JavaScript** (optional):
   ```bash
   # Using terser
   npm install -g terser
   terser app.js -o app.min.js -c -m
   terser filters.js -o filters.min.js -c -m
   terser detectionEngine.js -o detectionEngine.min.js -c -m
   ```

2. **Optimize CSS** (optional):
   ```bash
   # Using cssnano
   npm install -g cssnano-cli
   cssnano styles.css styles.min.css
   ```

3. **Update index.html** to use minified versions

### CDN Configuration

MediaPipe libraries are already loaded from CDN:
- Face Mesh: jsDelivr CDN
- Selfie Segmentation: jsDelivr CDN

No additional setup needed!

---

## Monitoring & Analytics (Optional)

### Add Google Analytics

Add to `<head>` in index.html:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Add Plausible (Privacy-friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## Testing Deployment

### Checklist

- [ ] HTTPS enabled
- [ ] Camera permissions work
- [ ] All filters load and function
- [ ] Photos capture and download
- [ ] Gallery functions properly
- [ ] Responsive on mobile
- [ ] Console has no errors
- [ ] Performance acceptable (30+ FPS)

### Test URLs

After deployment, test on:
- Desktop Chrome
- Mobile Safari (iOS)
- Mobile Chrome (Android)

Use browser DevTools:
- Network tab: Check resource loading
- Console: Check for errors
- Application tab: Verify localStorage

---

## Troubleshooting

### Camera Not Working on Deployment

**Issue:** Camera works locally but not on deployed site

**Solution:**
- Ensure HTTPS is enabled
- Check browser console for specific errors
- Verify no mixed content (HTTP resources on HTTPS page)

### Slow Loading

**Issue:** Long initial load time

**Solution:**
- MediaPipe models load from CDN (first time ~2-5s is normal)
- Enable browser caching
- Use a CDN with good global coverage

### Storage Issues

**Issue:** Photos not persisting

**Solution:**
- Check if browser allows localStorage
- Ensure no "Private Browsing" mode
- Verify HTTPS (some browsers limit localStorage on HTTP)

---

## CI/CD Setup (Advanced)

### GitHub Actions for Automated Testing

Create `.github/workflows/test.yml`:

```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Serve and test
        run: |
          npx http-server -p 8000 &
          sleep 3
          curl http://localhost:8000
```

---

## Scaling Considerations

### Current Architecture
- All client-side (no backend needed)
- Static hosting sufficient
- Scales infinitely (CDN-based)

### If You Need Backend (Future)
- User accounts: Add Firebase/Supabase
- Cloud storage: AWS S3/Cloudflare R2
- Analytics: PostHog/Mixpanel

---

## Security Headers (Recommended)

Add these headers in your hosting configuration:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(self)
```

Most modern hosts (Netlify/Vercel) include these by default.

---

## Cost Estimates

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| GitHub Pages | Unlimited (public repos) | $4/mo (private) |
| Netlify | 100GB bandwidth/mo | $19/mo Pro |
| Vercel | 100GB bandwidth/mo | $20/mo Pro |
| Cloudflare Pages | Unlimited | $20/mo Pro |

**For this app:** Free tier is more than sufficient!

---

## Launch Checklist

- [ ] Code tested locally
- [ ] Git repository created
- [ ] Deployment platform selected
- [ ] HTTPS configured
- [ ] Custom domain set (optional)
- [ ] Cross-browser tested
- [ ] Mobile tested (iOS + Android)
- [ ] Performance validated
- [ ] README updated with live demo link
- [ ] Analytics configured (optional)
- [ ] Social media sharing tested
- [ ] Documentation complete

---

## Support & Updates

### Keeping Dependencies Updated

MediaPipe libraries (from CDN):
- Check for updates: https://github.com/google/mediapipe
- Update version numbers in index.html if needed

### Monitoring Issues

Set up GitHub Issues:
- Bug reports
- Feature requests
- Browser compatibility reports

---

## Next Steps After Deployment

1. **Share your app!**
   - Social media
   - Product Hunt
   - Reddit (r/webdev, r/javascript)

2. **Collect feedback**
   - Create feedback form
   - Monitor browser console errors via Sentry

3. **Iterate**
   - Add new filters
   - Improve performance
   - Enhance UX

---

**Happy Deploying! 🎄✨**

Need help? Open an issue on GitHub or check the troubleshooting section.
