import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import bgMusicAsset from "@/assets/background-music.mp3.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nasrin & Amal — 18 July 2026" },
      { name: "description", content: "Wedding invitation of Nasrin Aboobacker & Amal Abdurahiman — Saturday, 18 July 2026, Hayath Convention Centre, Thali." },
      { property: "og:title", content: "Nasrin & Amal — Wedding Invitation" },
      { property: "og:description", content: "Saturday, 18 July 2026 · 11:30 AM · Hayath Convention Centre, Thali" },
    ],
  }),
  component: Index,
});

const WEDDING_DATE = new Date("2026-07-18T11:30:00+05:30");
const VENUE = "Hayath Convention Centre, Thali, Thrissur, Kerala";
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE)}`;
// 🎵 Background music — swap to your own track by replacing this URL.
// For the GitHub Pages build, drop background.mp3 into static-site/music/.
const BG_MUSIC_SRC = bgMusicAsset.url;

function useCountdown(target: Date) {
  // Start at target so SSR and first client paint show 00:00:00:00 (no hydration mismatch).
  const [now, setNow] = useState(target.getTime());
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function buildIcs() {
  const dt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = new Date(WEDDING_DATE.getTime() + 3 * 60 * 60 * 1000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nasrin-Amal//Wedding//EN",
    "BEGIN:VEVENT",
    `UID:nasrin-amal-2026-07-18@wedding`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(WEDDING_DATE)}`,
    `DTEND:${dt(end)}`,
    "SUMMARY:Wedding of Nasrin & Amal",
    `LOCATION:${VENUE}`,
    "DESCRIPTION:With the blessings of Allah — Saturday 18 July 2026, 11:30 AM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 my-6" aria-hidden>
      <span className="h-px w-16 bg-[var(--gold)]/60" />
      <svg width="22" height="22" viewBox="0 0 24 24" className="text-[var(--gold)]">
        <path
          fill="currentColor"
          d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"
        />
      </svg>
      <span className="h-px w-16 bg-[var(--gold)]/60" />
    </div>
  );
}

function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (playing) {
        a.pause();
        setPlaying(false);
      } else {
        a.volume = 0.4;
        await a.play();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  };
  return (
    <>
      <audio ref={audioRef} src={BG_MUSIC_SRC} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause background music" : "Play background music"}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[var(--emerald)] text-[var(--cream)] w-12 h-12 shadow-lg border border-[var(--gold)]/40 hover:scale-105 transition-transform flex items-center justify-center"
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
    </>
  );
}

/* --- Pretext-inspired scroll reveal ------------------------------------ */
function Reveal({
  children,
  delay = 0,
  as: As = "div",
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: any;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <As
      ref={ref as any}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </As>
  );
}

/* --- Floating gold sparkles in the hero -------------------------------- */
function Sparkles({ count = 40 }: { count?: number }) {
  // Deterministic positions/durations to keep SSR & client markup identical.
  const items = useMemo(() => {
    const rng = (n: number) => ((Math.sin(n * 9301 + 49297) * 233280) % 1 + 1) % 1;
    return Array.from({ length: count }, (_, i) => ({
      left: `${(rng(i + 1) * 100).toFixed(2)}%`,
      size: 3 + rng(i + 2) * 5,
      duration: 12 + rng(i + 3) * 14,
      delay: rng(i + 4) * -18,
      opacity: 0.35 + rng(i + 5) * 0.55,
    }));
  }, [count]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((it, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            left: it.left,
            width: it.size,
            height: it.size,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            opacity: it.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* --- Wishes & Duas wall (localStorage, works on static GH Pages) ------- */
type Wish = { id: string; name: string; message: string; at: number };
const WISHES_KEY = "nasrin-amal-wishes-v1";

function WishesWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHES_KEY);
      if (raw) setWishes(JSON.parse(raw));
    } catch {}
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const m = message.trim();
    if (!n || !m) return;
    const next: Wish[] = [
      { id: crypto.randomUUID(), name: n, message: m, at: Date.now() },
      ...wishes,
    ].slice(0, 100);
    setWishes(next);
    try {
      localStorage.setItem(WISHES_KEY, JSON.stringify(next));
    } catch {}
    setMessage("");
  };

  return (
    <div className="rounded-lg border border-[var(--gold)]/40 bg-white/50 p-6 md:p-8 text-left">
      <form onSubmit={submit} className="grid gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          className="w-full rounded-md border border-[var(--gold)]/40 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-[var(--emerald)]"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Leave your wishes & duas for Nasrin and Amal…"
          rows={3}
          maxLength={300}
          className="w-full rounded-md border border-[var(--gold)]/40 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-[var(--emerald)] resize-none"
        />
        <button
          type="submit"
          disabled={!name.trim() || !message.trim()}
          className="self-start px-5 py-2 rounded-md bg-[var(--emerald)] text-[var(--cream)] text-sm tracking-wide disabled:opacity-40 hover:opacity-90"
        >
          Send your wish
        </button>
      </form>

      <ul className="mt-6 grid gap-3 max-h-72 overflow-y-auto pr-1">
        {wishes.length === 0 && (
          <li className="text-sm italic text-[var(--sage)]/70 text-center py-4">
            Be the first to leave a wish ✦
          </li>
        )}
        {wishes.map((w) => (
          <li
            key={w.id}
            className="rounded-md border border-[var(--gold)]/30 bg-[var(--cream)]/60 p-3"
          >
            <p
              className="prose-body text-[var(--emerald)] leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}
            >
              "{w.message}"
            </p>
            <p className="mt-1 text-[10px] tracking-[0.25em] uppercase text-[var(--sage)]">
              — {w.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --- Page-wide falling petals ----------------------------------------- */
function Petals({ count = 22 }: { count?: number }) {
  const items = useMemo(() => {
    const rng = (n: number) => ((Math.sin(n * 9301 + 49297) * 233280) % 1 + 1) % 1;
    return Array.from({ length: count }, (_, i) => ({
      left: `${(rng(i + 11) * 100).toFixed(2)}%`,
      size: 8 + rng(i + 12) * 14,
      duration: 14 + rng(i + 13) * 16,
      delay: rng(i + 14) * -28,
      sway: (rng(i + 15) * 80 - 40).toFixed(0),
    }));
  }, [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden>
      {items.map((it, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: it.left,
            width: it.size,
            height: it.size,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            // @ts-ignore
            "--sway": `${it.sway}px`,
          }}
        />
      ))}
    </div>
  );
}

function Index() {
  const { d, h, m, s } = useCountdown(WEDDING_DATE);

  const downloadIcs = () => {
    const blob = new Blob([buildIcs()], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nasrin-amal-wedding.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main
      className="min-h-screen text-[var(--emerald)]"
      style={{
        backgroundColor: "var(--cream)",
        fontFamily: "'Inter', sans-serif",
        backgroundImage:
          "radial-gradient(circle at 10% 0%, rgba(201,169,110,0.10), transparent 40%), radial-gradient(circle at 90% 100%, rgba(45,74,62,0.10), transparent 40%)",
      }}
    >
      <MusicToggle />
      <Petals />

      {/* HERO */}
      <section className="relative px-6 pt-16 pb-12 text-center max-w-3xl mx-auto">
        <Sparkles />
        <p
          className="text-2xl md:text-3xl leading-relaxed relative"
          style={{ fontFamily: "'Amiri', serif", direction: "rtl" }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="mt-3 text-xs tracking-[0.35em] uppercase text-[var(--sage)] relative">
          In the name of Allah, the Most Gracious, the Most Merciful
        </p>

        <Ornament />

        <h1
          className="prose-display name-glow text-6xl md:text-8xl leading-none relative"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
        >
          Nasrin
          <span className="block text-3xl md:text-4xl italic my-2 text-[var(--gold)] shimmer">
            &amp;
          </span>
          Amal
        </h1>

        <p className="mt-6 text-sm tracking-[0.3em] uppercase text-[var(--sage)] relative">
          Saturday · 18 July 2026 · 11:30 AM
        </p>

        <div className="mt-10 grid grid-cols-4 gap-3 max-w-md mx-auto relative">
          {[
            ["Days", d],
            ["Hours", h],
            ["Mins", m],
            ["Secs", s],
          ].map(([label, val]) => (
            <div
              key={label as string}
              className="rounded-md border border-[var(--gold)]/40 bg-white/40 py-3"
            >
              <div
                className="text-3xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {String(val).padStart(2, "0")}
              </div>
              <div className="text-[10px] tracking-widest uppercase text-[var(--sage)]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INVITATION */}
      <Reveal as="section" className="px-6 py-12 text-center max-w-2xl mx-auto">
        <Ornament />
        <p className="text-sm tracking-[0.3em] uppercase text-[var(--sage)]">
          Together with their families
        </p>
        <p
          className="prose-body mt-4 text-xl md:text-2xl leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Mr Aboobacker K A &amp; Mrs Rajula Aboobacker
          <br />
          <span className="text-sm text-[var(--sage)]">
            Kazhungil House, Thali, Varavoor, Thrissur
          </span>
        </p>
        <p className="prose-body mt-6 italic text-[var(--sage)]">
          request the honour of your presence at the wedding of their daughter
        </p>

        <h2
          className="prose-display mt-8 text-4xl md:text-5xl"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
        >
          Nasrin Aboobacker
        </h2>
        <p className="my-4 text-[var(--gold)] italic text-lg">with</p>
        <h2
          className="prose-display text-4xl md:text-5xl"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
        >
          Amal Abdurahiman
        </h2>
        <p className="prose-body mt-4 text-sm text-[var(--sage)]">
          S/O Mr Khaja Abdurahiman A N &amp; Mrs Sarafunnisa Khaja
          <br />
          Pulikkal Kattil, Ponnani, Malappuram
        </p>
      </Reveal>

      {/* EVENT */}
      <Reveal as="section" className="px-6 py-12 max-w-2xl mx-auto">
        <Ornament />
        <div className="rounded-lg border border-[var(--gold)]/40 bg-white/50 p-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--sage)]">
            Save the date
          </p>
          <div
            className="mt-4 flex items-center justify-center gap-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <div className="text-right">
              <div className="text-sm uppercase tracking-widest text-[var(--sage)]">
                Sat
              </div>
              <div className="text-sm uppercase tracking-widest text-[var(--sage)]">
                July
              </div>
            </div>
            <div className="text-6xl md:text-7xl border-x border-[var(--gold)]/50 px-6">
              18
            </div>
            <div className="text-left">
              <div className="text-sm uppercase tracking-widest text-[var(--sage)]">
                2026
              </div>
              <div className="text-sm uppercase tracking-widest text-[var(--sage)]">
                11:30 AM
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p
              className="text-xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Hayath Convention Centre
            </p>
            <p className="text-sm text-[var(--sage)]">Thali, Thrissur</p>
          </div>

          <div className="mt-6 rounded-md overflow-hidden border border-[var(--gold)]/40 bg-white/40">
            <iframe
              title="Hayath Convention Centre map"
              src="https://www.google.com/maps?q=Hayath+Convention+Centre+Thali+Thrissur&output=embed"
              width="100%"
              height="300"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0, display: "block" }}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href={MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-md bg-[var(--emerald)] text-[var(--cream)] text-sm tracking-wide hover:opacity-90"
            >
              Open in Maps
            </a>
            <button
              onClick={downloadIcs}
              className="px-5 py-2.5 rounded-md border border-[var(--emerald)] text-[var(--emerald)] text-sm tracking-wide hover:bg-[var(--emerald)] hover:text-[var(--cream)] transition-colors"
            >
              Add to Calendar
            </button>
            <a
              href="tel:9846881469"
              className="px-5 py-2.5 rounded-md border border-[var(--gold)] text-[var(--sage)] text-sm tracking-wide hover:bg-[var(--gold)]/20"
            >
              Call · 98468 81469
            </a>
          </div>
        </div>
      </Reveal>

      {/* WISHES & DUAS */}
      <Reveal as="section" className="px-6 py-12 max-w-2xl mx-auto">
        <Ornament />
        <p className="text-center text-xs tracking-[0.3em] uppercase text-[var(--sage)]">
          Wishes &amp; Duas
        </p>
        <h3
          className="prose-display mt-2 mb-6 text-center text-3xl md:text-4xl"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
        >
          Leave a blessing
        </h3>
        <WishesWall />
      </Reveal>

      {/* FOOTER */}
      <Reveal as="footer" className="px-6 py-16 text-center max-w-2xl mx-auto">
        <Ornament />
        <p
          className="prose-body text-xl md:text-2xl italic leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          “And among His signs is this, that He created for you mates from
          among yourselves, that you may dwell in tranquillity with them, and
          He has put love and mercy between your hearts.”
        </p>
        <p className="mt-3 text-xs tracking-[0.3em] uppercase text-[var(--sage)]">
          Qur'an · Ar-Rum 30:21
        </p>
        <p className="mt-10 text-xs tracking-widest uppercase text-[var(--sage)]/70">
          Made with love · Nasrin &amp; Amal · 2026
        </p>
      </Reveal>
    </main>
  );
}
