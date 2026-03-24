import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with WatchDecode for feedback, questions, or collaboration.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="container-shell py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-100">Contact</h1>
        <p className="mt-6 leading-8 text-zinc-300">
          Questions, feedback, or partnership ideas? Reach out and we will get back to you as soon as possible.
        </p>
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <p className="text-sm uppercase tracking-wide text-zinc-400">Email</p>
          <a href="mailto:hello@watchdecode.com" className="mt-2 inline-block text-lg text-amber-300 hover:text-amber-200">
            hello@watchdecode.com
          </a>
        </div>
      </div>
    </div>
  );
}
