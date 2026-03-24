import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how WatchDecode handles basic visitor data and privacy.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-shell py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-100">Privacy Policy</h1>
        <p className="mt-6 leading-8 text-zinc-300">
          WatchDecode respects your privacy. We collect minimal analytics data to understand overall site usage and
          improve content quality.
        </p>
        <h2 className="mt-8 text-2xl font-semibold text-zinc-100">Information We Collect</h2>
        <p className="mt-4 leading-8 text-zinc-300">
          We may collect anonymized usage data such as pages visited, referrers, and device type. If you email us, we
          use your message and contact details only to reply.
        </p>
        <h2 className="mt-8 text-2xl font-semibold text-zinc-100">How We Use Data</h2>
        <p className="mt-4 leading-8 text-zinc-300">
          Data is used to improve articles, site performance, and user experience. We do not sell personal data.
        </p>
        <h2 className="mt-8 text-2xl font-semibold text-zinc-100">Contact</h2>
        <p className="mt-4 leading-8 text-zinc-300">
          For privacy questions, contact{" "}
          <a className="text-amber-300 hover:text-amber-200" href="mailto:hello@watchdecode.com">
            hello@watchdecode.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
