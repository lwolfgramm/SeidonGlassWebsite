# Seidon Glass Website — Developer README

## Quick Start: How to Edit Files

All content files are plain HTML. Open any `.html` file in a text editor
(Notepad, VS Code, Sublime Text) and edit the text between the tags.

---

## File Map

```
seidon-glass/
├── index.html              ← Homepage (main page)
├── about.html              ← About page (create next)
├── contact.html            ← Contact page (create next)
├── services/
│   ├── index.html          ← Services overview
│   ├── shower-doors.html   ← Shower door service page
│   ├── mirrors.html        ← (create: copy shower-doors.html, update content)
│   ├── commercial-glazing.html
│   ├── storefront.html
│   └── window-replacement.html
├── projects/
│   └── index.html          ← Photo gallery
├── css/
│   └── style.css           ← All visual styles. Edit colors/fonts at the top.
├── js/
│   └── main.js             ← Mobile menu, form submission, scroll effects
└── images/
    ├── hero.webp           ← Homepage hero background (1920×1080 ideal)
    └── projects/           ← Drop project photos here
```

---

## Deploying to Cloudflare Pages (Free Hosting)

### Step 1: GitHub
1. Create a free account at github.com
2. Click "New repository" → name it `seidon-glass`
3. Upload all files, keeping the folder structure

### Step 2: Cloudflare Pages
1. Create a free account at pages.cloudflare.com
2. Click "Create a project" → "Connect to Git" → connect your GitHub
3. Select the `seidon-glass` repository
4. Build settings: leave blank (static HTML, no build needed)
5. Click Deploy — your site is live in ~30 seconds

### Step 3: Custom Domain
1. In Cloudflare Pages, go to your project → Custom domains
2. Add `www.seidonglass.com`
3. Update your domain registrar's DNS nameservers to Cloudflare's

---

## Setting Up the Contact Form (Formspree)

1. Go to https://formspree.io and create a free account
2. Click "New Form" and name it "Seidon Glass Estimates"
3. Copy the Form ID (looks like: `xpwzajkb`)
4. Open `js/main.js`
5. Find line: `const response = await fetch('https://formspree.io/f/YOUR_FORM_ID'`
6. Replace `YOUR_FORM_ID` with your actual ID
7. Push to GitHub — Cloudflare redeploys automatically

**Free Formspree tier:** 50 submissions/month. Upgrade ($10/mo) for unlimited.

---

## Adding Photos

Best practices:
- Shoot in landscape (horizontal) orientation
- Good natural light, no clutter in background
- Resize to max 1200px wide using https://squoosh.app (use WebP format)
- File size under 200KB per image

To add a project photo:
1. Save photo as `images/projects/project-name.webp`
2. Open `projects/index.html`
3. Find a `<div class="gallery-placeholder">` block
4. Replace that whole div with:
   `<img src="../images/projects/project-name.webp" alt="Brief description of the project" loading="lazy">`

---

## Updating Phone Number / Email / Address

Search all files for `8015550000` and `info@seidonglass.com` and replace.
Also update the Schema JSON in `index.html` (the big block at the top).

---

## Things To Do After Launch

Priority order:
1. ☐ Replace (801) 555-0000 with your real number throughout all files
2. ☐ Replace info@seidonglass.com with your real email
3. ☐ Update the address in footer and schema JSON
4. ☐ Replace "YOUR_FORM_ID" in main.js with Formspree ID
5. ☐ Add hero image: images/hero.webp (remove class="no-image" from hero-bg-img div)
6. ☐ Add real project photos to images/projects/
7. ☐ Replace placeholder testimonials with real Google reviews
8. ☐ Update stats (15+ years, 2400+ projects) to match reality
9. ☐ Update the Google Business Profile schema in index.html
10. ☐ Set up Google Analytics or Cloudflare Web Analytics
11. ☐ Build remaining service pages (mirrors, commercial-glazing, storefront, window-replacement)
12. ☐ Build about.html and contact.html

---

## Customizing Colors

Open `css/style.css` and edit the variables at the top of the file:

```css
:root {
  --navy:    #0f1f35;   /* dark navy — header, footer, trust bar */
  --sky:     #2a7dc9;   /* primary blue — buttons, links, accents */
  --gold:    #c8a855;   /* gold — phone number, CTA button, accents */
  --white:   #ffffff;
  --off-white: #f7f8fa; /* alternating section background */
}
```

Change any hex value and it applies everywhere consistently.

---

## Performance Tips

- Images: always use WebP format, max 200KB each
- The site has zero JavaScript dependencies (no jQuery, no React, no Vue)
- Google Fonts load asynchronously — already optimized
- Cloudflare Pages CDN serves files from edge nodes globally
- Expected PageSpeed score: 95+ on mobile, 99 on desktop

---

## Need Help?

For any changes beyond basic text edits, open a conversation with Claude
and paste in the file you want to change. It can rewrite sections, add new
pages following the same pattern, or help debug anything.
