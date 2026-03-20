"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, MessageSquare, Pin, Search, Share2 } from "lucide-react";

const features = [
  {
    title: "Semantic Search",
    description:
      "Search your lecture by concept, not keyword. Jump to the exact moment that answers your question.",
    icon: Search,
  },
  {
    title: "Chat with the Lecture",
    description:
      "Ask follow-up questions like you're talking to a tutor. Get answers grounded in the lecture, not the internet.",
    icon: MessageSquare,
  },
  {
    title: "Timestamped Notes",
    description:
      "Capture insights tied to exact moments. Click any note to jump back to that point in the video.",
    icon: Pin,
  },
  {
    title: "Export to Notion",
    description:
      "Send your highlights, notes, and AI summary to a Notion page in one click.",
    icon: Share2,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-[#d8dde0] text-[#f0f0f5]">
      <section
        className="px-5 pb-8 pt-5 sm:px-8 sm:pb-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(18, 29, 42, 0.12) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      >
        <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[30px] bg-[#0a1118] shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
          <nav
            className={`mx-auto flex h-16 max-w-6xl items-center justify-between px-6 transition-all ${scrolled ? "opacity-95" : "opacity-100"}`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white/20 bg-white/10">
                <BookOpen className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Nexora</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#c2c9d3]">
              <a href="#how-it-works" className="transition-colors hover:text-white">
                Solutions
              </a>
              <a href="#how-it-works" className="transition-colors hover:text-white">
                Industries
              </a>
              <a href="#how-it-works" className="transition-colors hover:text-white">
                Pricing
              </a>
              <a href="#how-it-works" className="transition-colors hover:text-white">
                About
              </a>
            </div>
          </nav>

          <div className="relative isolate min-h-[620px] px-6 pb-14 pt-14 sm:pt-20">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_34%,rgba(108,255,224,0.26),transparent_42%),radial-gradient(circle_at_50%_95%,rgba(100,250,232,0.30),transparent_52%)]" />
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <p className="mb-5 text-xs uppercase tracking-[0.14em] text-[#d0d8df]">
                AI-Powered Business Solutions
              </p>
              <h1 className="font-serif text-[48px] font-normal leading-[1.08] text-[#edf2f6] sm:text-[64px]">
                Automate and scale
                <br />
                your business with AI
              </h1>
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/workspace")}
                  className="rounded-full bg-white px-7 py-2.5 text-sm font-medium text-[#0c1721] transition hover:opacity-95"
                >
                  Start Now
                </button>
                <Link
                  href="/upload"
                  className="rounded-full border border-white/30 bg-white/10 px-7 py-2.5 text-sm font-medium text-white transition hover:bg-white/16"
                >
                  Book a Demo
                </Link>
              </div>
              <div className="mx-auto mt-8 h-10 w-px bg-gradient-to-b from-white/80 via-white/35 to-transparent" />
            </div>

            <div className="pointer-events-none absolute -bottom-44 left-1/2 -z-10 h-[420px] w-[980px] -translate-x-1/2 rounded-[100%] bg-white/40 blur-[80px]" />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24 text-white">
        <p className="text-center text-xs uppercase tracking-[0.15em] text-[#00d4aa]">Capabilities</p>
        <h2 className="mt-3 text-center font-serif text-4xl font-light leading-tight text-white md:text-5xl">
          Everything you need
          <br />
          to master a lecture
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group hover-lift rounded-2xl border border-[#1e1e2e] bg-[#16161f] p-6 transition-all duration-300 hover:border-[#00d4aa40]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#00d4aa30] bg-[#00d4aa1a]">
                  <Icon className="h-4 w-4 text-[#00d4aa]" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[#9898a8]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#1e1e2e] bg-[#111118] py-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
          <div className="text-center md:border-r md:border-[#1e1e2e]">
            <p className="text-lg font-medium text-white">+2,000 lectures indexed</p>
            <p className="mt-1 text-xs text-[#52525e]">Growing across students and teams</p>
          </div>
          <div className="text-center md:border-r md:border-[#1e1e2e]">
            <p className="text-lg font-medium text-white">Powered by Twelve Labs + OpenAI</p>
            <p className="mt-1 text-xs text-[#52525e]">Grounded multimodal AI understanding</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-white">Works with YouTube & uploads</p>
            <p className="mt-1 text-xs text-[#52525e]">Flexible input for any lecture workflow</p>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[420px] w-[420px] rounded-full bg-[#00d4aa] opacity-[0.06] blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-serif text-4xl font-light text-white">Ready to learn smarter?</h2>
          <p className="mt-4 text-base text-[#9898a8]">
            Drop in a YouTube link and start exploring in seconds.
          </p>
          <button
            type="button"
            onClick={() => router.push("/workspace")}
            className="mt-8 rounded-xl bg-[#00d4aa] px-8 py-4 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Try it now →
          </button>
        </div>
      </section>

      <footer className="border-t border-[#1e1e2e]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-6 py-6 text-xs text-[#52525e] md:flex-row">
          <p>© 2025 LectureAI</p>
          <p>Built with Twelve Labs · OpenAI · Notion</p>
        </div>
      </footer>
    </main>
  );
}
