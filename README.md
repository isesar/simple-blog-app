# Simple Blog App

A modern blog built with Next.js (App Router), React, TypeScript, Tailwind CSS, and shadcn/ui.

It supports two kinds of posts:

- **Client posts**: Created/managed in-app and stored locally (session) via `BlogContext`.
- **Content posts**: Static Markdown files in the `content/` directory compiled at build time, so there are some blogs already.

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
- `getPostListSSG('content')` returns a lightweight list (no `content` field) for the homepage to reduce payload.
- `app/blog/[handle]/page.tsx` renders server-side content when a static post exists, and dynamically imports the client reader (`ClientPostReader`) only as a fallback for client posts.
- Best-effort in-memory caching is used in production to avoid repeat reads/parses within a process.

## Authoring content posts

Place Markdown files in the `content/` directory. The filename (without `.md`) becomes the `slug`, rendered at `/blog/[slug]`.

Required/optional frontmatter:

```yaml
title: My Post Title # required
read_time: 5 min read # required (fallback may be derived in code)
bio: Short description # required
date: 2024-01-01 # optional (YYYY-MM-DD)
```

### Markdown frontmatter

Use the following keys in `content/*.md`:

```yaml
title: My Post Title
read_time: 5 min read
bio: Short description
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

    ```

3. Open http://localhost:3000

Optional env: set `NEXT_PUBLIC_SITE_URL` in `.env` for correct metadata base URLs.

## Architecture overview

- **Server-first rendering**
    - `app/page.tsx` is a server component that fetches a lightweight post list via `getPostListSSG`.
    - `app/blog/[handle]/page.tsx` server-renders Markdown content when available; otherwise it dynamically imports the client-only reader.
- **Client islands**
    - `components/ClientPostReader.tsx` for client-stored posts (uses `BlogContext`).
    - Interactive UI bits (menus, toggles) stay client-side; static markup stays server-side.
- **Caching**
    - In-memory caches in `lib/blog.ts` avoid repeated file reads during build/SSR.

## Client vs Content posts

- **Client posts** (local/session)
    - Created at `/posts/new`, edited at `/posts/[id]/edit`.
    - Read under `/blog/[id]` via the client reader fallback.
    - Data is persisted to `localStorage` by `BlogContext` after hydration.
- **Content posts** (Markdown in `content/`)
    - Each `*.md` file is a post; filename becomes the `slug`.
    - Read under `/blog/[slug]` and fully server-rendered with Markdown.

## What I could have done more/better?

- If I have wanted to fetch blogs from an API, I could have used `getServerSideProps` or `getStaticProps`.
- Since functionality is very simple, I did not write tests, but if there was more functionality, I would have written tests, with Vitest and React Testing Library.
- Add toast messages on create/update/delete.
