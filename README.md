# youstube.xyz

A lightweight developer portfolio and CTF writeups website built with Eleventy (11ty).

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

The site will be built to the `public/` directory.

## Structure

```
├── src/
│   ├── _includes/        # Layout templates
│   ├── writeups/         # CTF writeups
│   └── index.njk         # Main profile page
├── styles/
│   └── styles.css        # Site styles
├── scripts/
│   └── script.js         # Site scripts
└── public/               # Built site (generated)
```

## Adding Writeups

Create a new `.njk` or `.md` file in `src/writeups/` directory:

```markdown
---
layout: base.njk
title: Your Writeup Title
description: Brief description
---

Your content here...
```

## Deployment

The `public/` directory contains the built static site. Deploy it to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).
