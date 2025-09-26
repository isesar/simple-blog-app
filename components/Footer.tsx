import React from "react";

export default function Footer() {
  return (
    <footer className="border-t bg-background mt-10">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Simple Blog. All rights reserved.</p>
        <p>Built with Next.js, React & Tailwind CSS.</p>
      </div>
    </footer>
  );
}
