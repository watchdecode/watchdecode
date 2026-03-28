import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Plain-language watch research and honest recommendations — no sponsored placements, no marketing hype.",
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
          We started WatchDecode because we got tired of the same problem every time we wanted to buy a watch. Either
          the review was written by someone who had clearly never worn the watch, or it was buried in a Reddit thread
          that assumed you already knew what an NH35 movement was. There was no middle ground — no place that spoke
          plainly, did the research properly, and actually helped you make a decision.
        </p>
        <p className="mt-4 leading-8 text-zinc-700">So we built it.</p>
        <p className="mt-4 leading-8 text-zinc-700">
          WatchDecode is run by a small team of people who have been wearing, reading about, and quietly obsessing over
          watches for years. We have collectively spent more hours than we&apos;d like to admit on watch forums,
          community threads, and spec sheets. We have bought watches that disappointed us, found ones that punched far
          above their price, and learned to tell the difference between a genuine recommendation and a reworded press
          release.
        </p>
        <p className="mt-4 leading-8 text-zinc-700">That experience shapes everything we publish.</p>
        <p className="mt-4 leading-8 text-zinc-700">
          When we research a watch, we go beyond the spec sheet. We dig into what long-term owners actually say — the
          things that only show up after six months on the wrist, not six hours out of the box. We look at community
          consensus across experienced collectors and everyday wearers, and we weigh value honestly against price.
        </p>
        <p className="mt-4 leading-8 text-zinc-700">
          We cover watches across every budget, from dependable sub-₹2000 daily wearers to considered mid-range purchases
          that need to earn their place on your wrist. Our job is to give you the full picture — what a watch does well,
          where it falls short, and whether it is worth your money.
        </p>
        <p className="mt-4 leading-8 text-zinc-700">
          No sponsored placements. No rankings shaped by who paid us. Just research, honest trade-offs, and
          recommendations we would stand behind ourselves.
        </p>
        <p className="mt-4 leading-8 text-zinc-700">That is what WatchDecode is here for.</p>
      </div>
    </div>
  );
}
