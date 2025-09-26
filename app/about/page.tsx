export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">About</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p>
          Simple Blog is a small demo application showcasing how to build a modern, responsive UI with
          <strong> Next.js</strong>, <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong>.
          It focuses on clear structure, maintainable state management, and accessible, mobile‑friendly design.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">Features</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Create, edit, and delete blog posts</li>
            <li>Client-side validation with helpful error messages</li>
            <li>LocalStorage persistence during a session</li>
            <li>Responsive layouts and keyboard‑accessible controls</li>
            <li>Light/Dark theme toggle</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Next.js App Router (routing, layouts, client components)</li>
            <li>React + TypeScript for type‑safe UI and logic</li>
            <li>Tailwind CSS for styling and responsive utilities</li>
            <li>Radix UI + shadcn-inspired primitives for accessible components</li>
            <li>Zod for input validation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How to Use</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Use the Home page to browse existing posts.</li>
            <li>Create a new post from the Home page button.</li>
            <li>Open any post to view details; use the actions to edit or delete.</li>
            <li>Toggle light/dark mode from the topbar.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
