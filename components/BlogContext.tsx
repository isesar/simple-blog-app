"use client"

import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";

export type Post = {
  id: string;
  title: string; // max 50
  summary: string; // max 250
  content: string;
  author: string; // max 40
  email: string; // valid email
  date: string; // ISO or YYYY-MM-DD
};

type State = {
  posts: Post[];
};

type Action =
  | { type: "add"; payload: Post }
  | { type: "update"; payload: Post }
  | { type: "delete"; payload: { id: string } }
  | { type: "reset"; payload: Post[] };

type BlogContextValue = {
  posts: Post[];
  createPost: (data: Omit<Post, "id">) => Post;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  getPostById: (id: string) => Post | undefined;
};

const BlogContext = createContext<BlogContextValue | null>(null);

const STORAGE_KEY = "simple_blog_posts";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add":
      return { posts: [action.payload, ...state.posts] };
    case "update":
      return {
        posts: state.posts.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case "delete":
      return { posts: state.posts.filter((p) => p.id !== action.payload.id) };
    case "reset":
      return { posts: action.payload };
    default:
      return state;
  }
}

function generateId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  ).toUpperCase();
}

const samplePosts: Post[] = [
  {
    id: "SAMPLE-POST",
    title: "Welcome to Simple Blog",
    summary: "This is a demo blog built with Next.js, React, and TypeScript.",
    content:
      "Thank you for checking out this simple blog app. You can create, edit, and delete posts. Data is stored in localStorage during your session.",
    author: "Demo Author",
    email: "demo@example.com",
    date: "2024-01-01",
  },
];

export function BlogProvider({ children }: { children: React.ReactNode }) {
  // Start with a stable initial state for SSR to avoid hydration mismatch.
  const [state, dispatch] = useReducer(reducer, { posts: samplePosts });
  const hydratedRef = useRef(false);

  // After mount, hydrate from localStorage if available.
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Post[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            dispatch({ type: "reset", payload: parsed });
          }
        }
      }
    } catch {}
    hydratedRef.current = true;
  }, []);

  // Sync to localStorage whenever posts change
  useEffect(() => {
    if (!hydratedRef.current) return; // Avoid overwriting storage before hydration completes
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.posts));
      }
    } catch {
      // ignore
    }
  }, [state.posts]);

  const value = useMemo<BlogContextValue>(() => ({
    posts: state.posts,
    createPost: (data) => {
      const post: Post = { id: generateId(), ...data };
      dispatch({ type: "add", payload: post });
      return post;
    },
    updatePost: (post) => dispatch({ type: "update", payload: post }),
    deletePost: (id) => dispatch({ type: "delete", payload: { id } }),
    getPostById: (id) => state.posts.find((p) => p.id === id),
  }), [state.posts]);

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used within BlogProvider");
  return ctx;
}
