import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import type { ProjectItem } from '../../data/content';

/** Projects people can use right now: a logo plus a live website or a downloadable installer. */
export function launchable(items: ProjectItem[]): ProjectItem[] {
  return items.filter((p) => p.logo && (p.liveUrl || p.download));
}

/** "Fitora — AI Nutrition…" → "Fitora"; "Stratos (Note_mytasks) — …" → "Stratos". */
export function productName(title: string): string {
  return title.split(' — ')[0].replace(/\s*\(.*\)$/, '');
}

/** "https://x.github.io/Fitora/#/login" → "x.github.io/Fitora". */
export function displayHost(url: string): string {
  const { host, pathname } = new URL(url);
  return `${host}${pathname}`.replace(/\/$/, '');
}

// Design canvas (px). Everything inside is placed in these units and scaled by one --k.
const CW = 1172;
const CH = 820;
const TAB_MAX = 1080;
const TAB_MIN = 701;
const DW_MIN = 920;

// Ring geometry: a cylinder seen from its centre, so each card faces the camera.
const R = 891;
const N = 37;
const STEP = 360 / N;
const CULL = 42;
const SPEED = 1.9; // deg/s
const AUTO_ADVANCE = 6500; // ms between products while nobody is interacting

/** Scale and design-window width for a stage of `w` x `vh` px; null on phones (flow layout). */
export function stageScale(w: number, vh: number): { k: number; W: number } | null {
  if (w < TAB_MIN) return null;
  const W = w > TAB_MAX ? CW : DW_MIN + ((w - TAB_MIN) * (CW - DW_MIN)) / (TAB_MAX - TAB_MIN);
  return { k: Math.min(w / W, (vh * 0.96) / CH), W };
}

/** Place every card of the ring for the current phase (degrees). */
export function ringTransform(i: number, phase: number) {
  const a = ((((i * STEP + phase) % 360) + 540) % 360) - 180;
  if (Math.abs(a) > CULL) return null;
  const r = (a * Math.PI) / 180;
  const c = Math.cos(r);
  return {
    transform: `translate3d(${(R * Math.sin(r)).toFixed(2)}px,0,${(R * (1 - c)).toFixed(2)}px) rotateY(${(-a).toFixed(3)}deg)`,
    // Darker toward the centre (was brightness(0.84..1)); drawn as a black layer's opacity, which
    // the compositor blends for free, instead of a per-card filter pass every frame.
    dim: Math.max(0, 0.16 - 0.5 * (1 / c - 1)).toFixed(3),
  };
}

/** Deterministic starfield: one box-shadow list per layer. */
function stars(count: number, blur: number, aMin: number, aMax: number, seed: number) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: count }, () => {
    const x = (rnd() * CW).toFixed(0);
    const y = (rnd() * CH).toFixed(0);
    const a = (aMin + rnd() * (aMax - aMin)).toFixed(2);
    return `${x}px ${y}px ${blur}px 0 rgba(255,255,255,${a})`;
  }).join(',');
}

type Shot =
  | { kind: 'logo'; product: ProjectItem }
  | { kind: 'shot'; product: ProjectItem; src: string }
  | { kind: 'stat'; count: number };

/** The ring's creatives: each product as a logo card and a screenshot card, then a count card. */
function shotsFor(products: ProjectItem[]): Shot[] {
  const out: Shot[] = [];
  for (const product of products) {
    out.push({ kind: 'logo', product });
    if (product.preview) out.push({ kind: 'shot', product, src: product.preview });
  }
  out.push({ kind: 'stat', count: products.length });
  return out;
}

function Card({ shot, label }: { shot: Shot; label: string }) {
  const broken = (e: { currentTarget: HTMLImageElement }) => e.currentTarget.parentElement?.classList.add('broken');
  if (shot.kind === 'stat') {
    return (
      <>
        <div className="vx-cv" style={{ top: 120, fontSize: 4.6, letterSpacing: '.22em', color: 'rgba(255,255,255,.7)' }}>
          LIVE · 2026
        </div>
        <div
          className="vx-cv vx-big"
          style={{ top: 132, fontSize: 52, color: '#3fe3ff', textShadow: '0 0 16px rgba(63,227,255,.5)' }}
        >
          {String(shot.count).padStart(2, '0')}
        </div>
        <div className="vx-cv vx-big" style={{ top: 188, fontSize: 7.5, lineHeight: 1.2, color: '#fff', whiteSpace: 'normal' }}>
          {label}
        </div>
      </>
    );
  }
  const name = productName(shot.product.title);
  if (shot.kind === 'logo') {
    return (
      <>
        <div className="vx-cv vx-k">{shot.product.download ? 'WINDOWS' : 'WEB APP'}</div>
        <img className="vx-logo" src={shot.product.logo} alt="" loading="lazy" decoding="async" onError={broken} />
        <div className="vx-cv vx-big" style={{ top: 158, fontSize: 15, textAlign: 'center' }}>
          {name}
        </div>
        <div
          className="vx-cv"
          style={{ top: 178, fontSize: 5.6, lineHeight: 1.5, textAlign: 'center', color: 'rgba(255,255,255,.78)' }}
        >
          {shot.product.tagline}
        </div>
      </>
    );
  }
  return (
    <>
      <img
        src={shot.src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={broken}
        style={{ objectPosition: `${shot.product.previewFocus ?? 50}% 0` }}
      />
      <div className="vx-fill" />
      <div className="vx-cv" style={{ top: 262, fontSize: 5.4, fontWeight: 600, letterSpacing: '.2em' }}>
        {name.toUpperCase()}
      </div>
    </>
  );
}

const Bolt = () => (
  <svg viewBox="5 1 14 22" preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z"
      fill="rgba(16,112,152,.72)"
      stroke="rgba(190,236,255,.6)"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const Mark = () => (
  <svg className="vx-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="vx-sw" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8ef4ff" />
        <stop offset=".5" stopColor="#35d8ff" />
        <stop offset="1" stopColor="#0a86d8" />
      </linearGradient>
      <linearGradient id="vx-sw2" x1="40" y1="10" x2="10" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a6f7ff" />
        <stop offset="1" stopColor="#0f9ae0" stopOpacity=".25" />
      </linearGradient>
    </defs>
    <g transform="rotate(-32 24 24)">
      <ellipse
        cx="24"
        cy="24"
        rx="18.5"
        ry="9.6"
        stroke="url(#vx-sw2)"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeDasharray="58 30"
        strokeDashoffset="14"
      />
      <circle cx="41.4" cy="20.6" r="3.1" fill="#bff6ff" />
    </g>
    <circle cx="24" cy="24" r="6.6" fill="url(#vx-sw)" />
    <circle cx="24" cy="24" r="2.6" fill="#fff" />
  </svg>
);

const EXPO = 'cubic-bezier(.16,1,.3,1)';
const SOFT = 'cubic-bezier(.22,.61,.36,1)';

/** Entrance choreography: the frame settles, then the message, then the wheel and the browser. */
function runIntro(root: HTMLElement, done: () => void) {
  const D = root.clientWidth <= 700 ? 0.66 : 1;
  const Y = (px: number) => `0 ${px * D}px`;
  const anims: Animation[] = [];
  const play = (sel: string, from: Keyframe, dur: number, delay: number | ((i: number) => number), ease: string) => {
    root.querySelectorAll<HTMLElement>(sel).forEach((el, i) => {
      const to: Keyframe = { opacity: 1 };
      if (from.translate) to.translate = '0 0';
      if (from.scale) to.scale = '1';
      if (from.clipPath) to.clipPath = 'inset(-30% 0 -30% 0)';
      anims.push(
        el.animate([from, to], {
          duration: dur,
          delay: typeof delay === 'function' ? delay(i) : delay,
          easing: ease,
          fill: 'both',
        }),
      );
    });
  };
  play('.vx-nav', { opacity: 0, translate: Y(-9) }, 620, 60, EXPO);
  play('.vx-mark', { opacity: 0, translate: Y(6) }, 520, 150, SOFT);
  play('.vx-wm', { opacity: 0, translate: Y(6) }, 520, 185, SOFT);
  play('.vx-tab', { opacity: 0, translate: Y(6) }, 460, (i) => 215 + i * 45, SOFT);
  play('.vx-nav .vx-btn', { opacity: 0, translate: Y(6) }, 500, 400, SOFT);
  play('.vx-badge', { opacity: 0, translate: Y(11), scale: '.985' }, 560, 270, EXPO);
  play('.vx-h1 > span', { opacity: 0, translate: Y(15), clipPath: 'inset(100% 0 -30% 0)' }, 900, (i) => 380 + i * 90, EXPO);
  play('.vx-sub > span', { opacity: 0, translate: Y(10) }, 620, (i) => 690 + i * 55, EXPO);
  play('.vx-cta2', { opacity: 0, translate: Y(13), scale: '.985' }, 620, 830, EXPO);
  play('.vx-more', { opacity: 0, translate: Y(8) }, 560, 900, EXPO);
  play('.vx-ring', { opacity: 0, translate: Y(18), scale: '.99' }, 950, 700, EXPO);
  play('.vx-browser', { opacity: 0, translate: Y(26) }, 900, 900, EXPO);
  // Nothing survives completion: the settled frame is the authored design.
  const settle = () => {
    anims.forEach((a) => a.cancel());
    done();
  };
  Promise.all(anims.map((a) => a.finished)).then(settle, settle);
}

/**
 * The products people can use right now, staged like a launch hero: a pill switches product, a
 * glow button opens or downloads it, and a browser frame in front of a slowly turning 3D ring of
 * cards shows the live app.
 */
export function ProductLaunchpad({
  items,
  onDetails,
}: {
  items: ProjectItem[];
  onDetails?: (project: ProjectItem) => void;
}) {
  const { t } = useLang();
  const l = t.projects.launchpad;
  const products = useMemo(() => launchable(items), [items]);
  const shots = useMemo(() => shotsFor(products), [products]);

  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [scale, setScale] = useState<{ k: number; W: number } | null>({ k: 1, W: CW });
  const [intro, setIntro] = useState<'pre' | 'done'>('pre');
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false); // pointer or focus inside: hold the auto-advance
  const pickedRef = useRef(false); // once someone picks a product, stop auto-advancing

  const starsA = useMemo(() => stars(150, 0, 0.05, 0.3, 7), []);
  const starsB = useMemo(() => stars(18, 1.2, 0.35, 0.7, 19), []);

  const reduced = () =>
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scale the design canvas to the stage.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => setScale(stageScale(root.clientWidth, window.innerHeight));
    measure();
    window.addEventListener('resize', measure);
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    ro?.observe(root);
    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, []);

  // Visibility drives the entrance (once) and pauses the ring off screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const canAnimate = typeof root.animate === 'function' && !reduced();
    if (!canAnimate) setIntro('done');
    let started = !canAnimate;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting && !started) {
          started = true;
          runIntro(root, () => setIntro('done'));
          // Failsafe: content can never be stranded invisible.
          window.setTimeout(() => setIntro('done'), 4000);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // The ring: placed once, then turned by rAF while on screen (frozen for reduced motion).
  const phaseRef = useRef(-2);
  const placeCards = useCallback(() => {
    const cards = ringRef.current?.children;
    if (!cards) return;
    for (let i = 0; i < cards.length; i++) {
      const el = cards[i] as HTMLElement;
      const p = ringTransform(i, phaseRef.current);
      if (!p) {
        el.style.visibility = 'hidden';
        continue;
      }
      el.style.visibility = 'visible';
      el.style.transform = p.transform;
      (el.lastElementChild as HTMLElement).style.opacity = p.dim;
    }
  }, []);
  useEffect(() => {
    placeCards();
    if (!visible || reduced()) return;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      phaseRef.current -= SPEED * dt;
      placeCards();
      raf = requestAnimationFrame(tick);
    };
    const onVis = () => {
      last = 0;
    };
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [visible, placeCards]);

  // Auto-advance through the products until someone picks one.
  useEffect(() => {
    if (!visible || held || pickedRef.current || products.length < 2 || reduced()) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % products.length), AUTO_ADVANCE);
    return () => window.clearInterval(id);
  }, [visible, held, products.length]);

  const pick = (i: number) => {
    pickedRef.current = true;
    setActive(i);
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = products.length;
    const to =
      e.key === 'ArrowRight' ? (i + 1) % n
      : e.key === 'ArrowLeft' ? (i - 1 + n) % n
      : e.key === 'Home' ? 0
      : e.key === 'End' ? n - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    pick(to);
    tabsRef.current[to]?.focus();
  };

  if (products.length === 0) return null;

  const product = products[Math.min(active, products.length - 1)];
  const name = productName(product.title);
  const isDownload = !product.liveUrl && Boolean(product.download);
  const href = product.liveUrl ?? product.download!.href;
  const meta = isDownload ? product.download!.meta : displayHost(href);
  const action = isDownload ? t.projects.downloadLabel : l.openLabel;
  const linkProps = isDownload ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' };
  const phone = scale === null;

  return (
    <div
      ref={rootRef}
      className={`vx${phone ? ' vx--phone' : ''}`}
      role="region"
      aria-labelledby="launch-heading"
      data-intro={intro}
      data-no-trail
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <div className="vx-stage" style={phone ? undefined : ({ '--h': `${CH * scale.k}px` } as CSSProperties)}>
        <div className="vx-bg" aria-hidden="true" />
        <div className="vx-canvas" style={phone ? undefined : ({ '--k': scale.k } as CSSProperties)}>
          <div className="vx-stars" style={{ boxShadow: starsA }} aria-hidden="true" />
          <div className="vx-stars" style={{ boxShadow: starsB }} aria-hidden="true" />

          <div className="vx-showcase">
            <div className="vx-ring" ref={ringRef} aria-hidden="true">
              {Array.from({ length: N }, (_, i) => {
                const shot = shots[i % shots.length];
                const accent = shot.kind === 'stat' ? undefined : shot.product.accent;
                return (
                  <div
                    key={i}
                    className={`vx-card vx-card--${shot.kind}`}
                    style={accent ? ({ '--accent': accent } as CSSProperties) : undefined}
                  >
                    <Card shot={shot} label={l.heading} />
                    <div className="vx-edge" />
                    <div className="vx-dim" />
                  </div>
                );
              })}
            </div>

            <div className="vx-browser" aria-hidden="true">
              <div className="vx-bar">
                <div className="vx-dots">
                  <i style={{ background: '#ee5c62' }} />
                  <i style={{ background: '#f6b719' }} />
                  <i style={{ background: '#12c02f' }} />
                </div>
                <div className="vx-omni">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.8-3.8" />
                  </svg>
                  <span>{isDownload ? product.download!.href.split('/').pop() : displayHost(href)}</span>
                </div>
                <div className="vx-tools">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                    <path d="M4 15v5h16v-5" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M12 3 3 8l9 5 9-5-9-5Z" fill="#fff" opacity=".95" />
                    <path d="M3 13l9 5 9-5" opacity=".55" />
                  </svg>
                </div>
              </div>
              <div className="vx-page">
                {products.map((p, i) =>
                  p.preview ? (
                    <img
                      key={p.title}
                      src={p.preview}
                      alt=""
                      className={i === active ? 'on' : undefined}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null,
                )}
              </div>
            </div>
          </div>

          <div className="vx-stack">
            <div className="vx-nav">
              <Mark />
              <span className="vx-wm" aria-hidden="true">
                <span className="vx-kick">LIVE</span>
                <span className="vx-name">APPS</span>
              </span>
              <div className="vx-links" role="tablist" aria-label={l.switcherLabel}>
                {products.map((p, i) => (
                  <button
                    key={p.title}
                    ref={(el) => {
                      tabsRef.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`vx-tab-${i}`}
                    aria-selected={i === active}
                    aria-controls="vx-panel"
                    tabIndex={i === active ? 0 : -1}
                    className="vx-tab"
                    data-sfx="press"
                    onClick={() => pick(i)}
                    onKeyDown={(e) => onTabKey(e, i)}
                  >
                    <img src={p.logo} alt="" width={18} height={18} decoding="async" />
                    <span>{productName(p.title)}</span>
                  </button>
                ))}
              </div>
              {onDetails && (
                <button type="button" className="vx-btn" data-sfx="press" onClick={() => onDetails(product)}>
                  <span>{l.detailsCta}</span>
                </button>
              )}
            </div>

            <div className="vx-badge">
              <i>
                <Bolt />
              </i>
              <b>{l.eyebrow}</b>
            </div>

            <h3 id="launch-heading" className="vx-h1" aria-label={l.heading}>
              <span aria-hidden="true">{l.headingLines[0]}</span>
              <span aria-hidden="true">{l.headingLines[1]}</span>
            </h3>

            <p className="vx-sub" id="vx-panel" role="tabpanel" aria-labelledby={`vx-tab-${active}`} aria-live="polite">
              <span>
                <b>{name}</b> — {product.tagline}
              </span>
              <span>
                {isDownload ? meta : `${l.webLabel} · ${meta}`}
              </span>
            </p>

            <a
              href={href}
              {...linkProps}
              className="vx-btn vx-cta2"
              aria-label={isDownload ? `${action} ${name} — ${meta}` : `${action} ${name} (${t.a11y.openInNewTab})`}
              data-sfx="press"
            >
              <span>
                {action}
                {isDownload ? (
                  <ArrowDownToLine size={16} aria-hidden="true" />
                ) : (
                  <ArrowUpRight size={16} aria-hidden="true" />
                )}
              </span>
            </a>

            {onDetails && (
              <button type="button" className="vx-more" onClick={() => onDetails(product)}>
                {l.detailsCta}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
