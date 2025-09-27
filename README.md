# Simple Blog App

A modern blog built with Next.js (App Router), React, TypeScript, Tailwind CSS, and shadcn/ui.

It supports two kinds of posts:

- **Client posts**: Created/managed in-app and stored locally (session) via `BlogContext`.
- **Content posts**: Static Markdown files in the `content/` directory compiled at build time.

Key routes:

- `/` Home feed (mix of client + content posts)
- `/posts/new` Create a client post
- `/posts/[id]/edit` Edit a client post
- `/blog/[handle]` Read a post
    - Static Markdown content by `slug`
    - Or client post by `id` (CSR fallback via `ClientPostReader`)

Theming is managed via a `ThemeProvider` (no localStorage). The `ThemeToggle` reads theme from context and the provider applies the `dark` class on `<html>`.

## Features

- **Home feed merging** of client and content posts with date-based sorting
- **Create, edit, delete** client posts
- **Markdown content** with `remark-gfm` and `rehype-highlight`
- **Unified post view** via `components/PostArticle.tsx` (used by both SSG page and CSR reader)
- **Estimated read time** on both content and client posts
- **Error boundaries and 404 pages**
    - `app/error.tsx` and `app/blog/[handle]/error.tsx`
    - `app/not-found.tsx` and `app/blog/[handle]/not-found.tsx`
- **Accessible UI** with keyboard-friendly cards and menus
- **Dark/Light theme** via context-based toggle

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 and shadcn/ui components
- `gray-matter` for Markdown frontmatter
- `react-markdown`, `remark-gfm`, `rehype-highlight` for rendering
- ESLint (flat config) + Prettier

## Project Structure

- `app/` Next.js routes and layout
- `components/` UI components (e.g., `HomeClient.tsx`, `PostArticle.tsx`, `ThemeToggle.tsx`)
- `context/` React contexts (`BlogContext.tsx`, `ThemeContext.tsx`)
- `lib/` Blog utilities (`lib/blog.ts` for Markdown fetch + mapping + caching)
- `content/` Markdown posts (`.md` with frontmatter)
- `types/` Shared types (`types/post.ts`)

### Routing and data fetching

- `generateStaticParams` uses `getAllSlugsSSG('content')` to prebuild static content routes.
- `getPostBySlugSSG(slug, 'content')` parses a single Markdown file and maps frontmatter/content.
- `getPostMetadataSSG('content')` lists slugs first, then reuses `getPostBySlugSSG` per slug.
- Best-effort in-memory caching is used in production to avoid repeat reads/parses within a process.

### Markdown frontmatter

Use the following keys in `content/*.md`:

```yaml
title: My Post Title
read_time: 5 min read
bio: Short description
image: https://...
date: 2024-01-01
```

Note: Frontmatter `read_time` is mapped to `readTime` in the app’s runtime types.

## Prerequisites

- Node.js 18.17+ (Next.js 15 requirement)
- npm (or your preferred package manager)

## Scripts

```bash
# Start dev server
npm run dev

# Build and start
npm run build
npm start

# Lint and format
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Type-check
npm run typecheck

# Remove comments from all .tsx files
npm run strip:tsx-comments
```

## Running locally

1. Install dependencies

    ```bash
    npm install
    ```

2. Start the dev server

    ```bash
    npm run dev
    ```

3. Open http://localhost:3000

Optional env: set `NEXT_PUBLIC_SITE_URL` in `.env` for correct metadata base URLs.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
