"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MenuIcon, XIcon } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) => (pathname === href ? "text-primary" : "text-foreground/80 hover:text-foreground");

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold text-lg">Simple Blog</Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className={`text-sm ${isActive("/")}`}>Home</Link>
              <Link href="/about" className={`text-sm ${isActive("/about")}`}>About</Link>
              <Link href="/contact" className={`text-sm ${isActive("/contact")}`}>Contact</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle Menu">
              {open ? <XIcon className="size-5"/> : <MenuIcon className="size-5"/>}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t">
          <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col gap-3">
            <Link href="/" onClick={() => setOpen(false)} className={isActive("/")}>Home</Link>
            <Link href="/about" onClick={() => setOpen(false)} className={isActive("/about")}>About</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className={isActive("/contact")}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
