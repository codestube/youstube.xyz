# Adding New CTF Writeups

## Quick Start

To add a new CTF writeup to your website:

1. Create a new file in `src/writeups/` directory
2. Use `.njk` extension for Nunjucks templates or `.md` for Markdown
3. Add frontmatter at the top
4. Write your content
5. Run `npm run build` to generate the site

## Example Writeup

Create a file like `src/writeups/my-ctf-challenge.njk`:

```njk
---
layout: base.njk
title: My CTF Challenge - Youstube
description: Writeup for the XYZ CTF challenge
---

<article>
    <h1>My CTF Challenge</h1>
    <div class="writeup-meta">
        <span>Published: 2026-02-10</span> | <span>Category: Web Exploitation</span>
    </div>
    
    <section>
        <h2>Challenge Description</h2>
        <p>The challenge provided a web application with...</p>
    </section>
    
    <section>
        <h2>Solution</h2>
        <p>Step-by-step solution...</p>
        
        <h3>Reconnaissance</h3>
        <p>First, I analyzed...</p>
        
        <h3>Exploitation</h3>
        <p>The vulnerability was...</p>
    </section>
    
    <p><a href="/writeups/">Back to all writeups</a></p>
</article>
```

## Using Markdown

You can also use Markdown (`.md`) files:

```markdown
---
layout: base.njk
title: My CTF Challenge - Youstube
description: Writeup for the XYZ CTF challenge
---

# My CTF Challenge

Published: 2026-02-10 | Category: Web

## Challenge Description

The challenge provided...

## Solution

Step-by-step solution...

[Back to all writeups](/writeups/)
```

## Updating the Writeups Index

Edit `src/writeups/index.njk` to add your new writeup to the list:

```njk
<li class="writeup-item">
    <a href="/writeups/my-ctf-challenge/" class="writeup-title">My CTF Challenge</a>
    <div class="writeup-meta">
        <span>2026-02-10</span> | <span>Web Exploitation</span>
    </div>
    <p>Brief description of the challenge.</p>
</li>
```

## Build and Deploy

After adding your writeup:

```bash
npm run build
```

The generated files will be in the `public/` directory, ready to deploy to any static hosting service.

## Tips

- Keep filenames lowercase with hyphens (e.g., `buffer-overflow-challenge.njk`)
- Use consistent date format (YYYY-MM-DD)
- Add categories to help organize your writeups
- Include code blocks with proper syntax highlighting
- Add images by placing them in a `public/images/` directory
