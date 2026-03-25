import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about WatchDecode and the mission behind the blog.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="container-shell py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">About WatchDecode</h1>
        <p className="mt-6 leading-8 text-zinc-700">
          WatchDecode is a watch review and buying guide blog focused on helping everyday buyers make smarter choices.
          We break down specs, quality, and value in plain language so you can buy with confidence.
        </p>
        <p className="mt-4 leading-8 text-zinc-700">
          Our approach is simple: practical advice, transparent trade-offs, and recommendations shaped by real-world
          wearability, not marketing hype.
        </p>
      </div>
    </div>
  );
}
