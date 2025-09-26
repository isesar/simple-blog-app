"use client"

import React from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(100, "Max 100 characters"),
  message: z.string().min(1, "Message is required").max(1000, "Max 1000 characters"),
});

export default function ContactPage() {
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0]) errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("submitting");

    // Simulate sending the message; in real apps this would POST to an API route.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
    setValues({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Contact</h1>

      <div className="prose dark:prose-invert max-w-none mb-8">
        <p>
          Have feedback, a feature request, or just want to say hello? Send a message using the
          form below. I typically respond within 1–2 business days.
        </p>
        <p>
          You can also email directly at
          {" "}
          <a href="mailto:demo@example.com" className="underline">demo@example.com</a>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <Input id="name" name="name" value={values.name} onChange={handleChange} placeholder="Your name" />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <Input id="email" name="email" value={values.email} onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
          <Input id="subject" name="subject" value={values.subject} onChange={handleChange} placeholder="How can we help?" />
          {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
          <Textarea id="message" name="message" value={values.message} onChange={handleChange} placeholder="Write your message..." className="min-h-40" />
          {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Send message"}
          </Button>
          {status === "success" && (
            <span className="text-sm text-emerald-600 dark:text-emerald-400">Message sent! Thanks for reaching out.</span>
          )}
        </div>
      </form>
    </main>
  );
}
