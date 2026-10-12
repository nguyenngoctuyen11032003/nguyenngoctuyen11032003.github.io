import type { CSSProperties, PointerEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { sfx } from '../../sound';
import type { ProjectItem } from '../../data/content';

const EASE = [0.25, 0.1, 0.25, 1] as const;

/** Projects people can use right now: a logo plus a live website or a downloadable installer. */
export function launchable(items: ProjectItem[]): ProjectItem[] {
  return items.filter((p) => p.logo && (p.liveUrl || p.download));
}

/** "Fitora — AI Nutrition…" → "Fitora". */
export function productName(title: string): string {
  return title.split(' — ')[0];
}

/** "https://x.github.io/Fitora/#/login" → "x.github.io/Fitora". */
export function displayHost(url: string): string {
  const { host, pathname } = new URL(url);
  return `${host}${pathname}`.replace(/\/$/, '');
}

/** Pointer position as CSS vars, read by the spotlight and the icon tilt. */
function track(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
  el.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
  el.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
}

function LaunchCard({ product, index }: { product: ProjectItem; index: number }) {
  const { t } = useLang();
  const l = t.projects.launchpad;
  const name = productName(product.title);
  const isDownload = !product.liveUrl && Boolean(product.download);
  const href = product.liveUrl ?? product.download!.href;
  const meta = isDownload ? product.download!.meta : displayHost(href);
  const action = isDownload ? t.projects.downloadLabel : l.openLabel;

  const linkProps = isDownload
    ? { download: true }
    : { target: '_blank', rel: 'noopener noreferrer' };

  return (
    <motion.li
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
    >
      <a
        href={href}
        {...linkProps}
        className="launch-card group"
        style={{ '--accent': product.accent ?? '#34d399' } as CSSProperties}
        aria-label={
          isDownload
            ? `${action} ${name} — ${meta}`
            : `${action} ${name} (${t.a11y.openInNewTab})`
        }
        data-sfx="press"
        onPointerMove={track}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') sfx.play('hover', { intensity: 0.8, rate: 1.1, pan: sfx.panAt(e.clientX) });
        }}
      >
        <span className="launch-spot" aria-hidden="true" />
        <span className="launch-grid" aria-hidden="true" />

        <span className="launch-top">
          <span className="launch-chip">
            <span className="launch-dot" aria-hidden="true" />
            {isDownload ? l.desktopLabel : l.webLabel}
          </span>
          <span className="launch-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </span>

        <span className="launch-icon" aria-hidden="true">
          <span className="launch-halo" />
          <span className="launch-ring" />
          <img src={product.logo} alt="" width={160} height={160} loading="lazy" decoding="async" />
        </span>

        <span className="launch-name">{name}</span>
        {product.tagline && <span className="launch-tagline">{product.tagline}</span>}

        <span className="launch-foot">
          <span className="launch-meta">{meta}</span>
          <span className="launch-cta">
            {action}
            {isDownload ? (
              <ArrowDownToLine size={15} aria-hidden="true" />
            ) : (
              <ArrowUpRight size={15} aria-hidden="true" />
            )}
          </span>
        </span>
      </a>
    </motion.li>
  );
}

/** Dock of app icons above the featured work: each opens the live product or downloads it. */
export function ProductLaunchpad({ items }: { items: ProjectItem[] }) {
  const { t } = useLang();
  const l = t.projects.launchpad;
  const products = launchable(items);
  if (products.length === 0) return null;

  return (
    <div className="launch" role="region" aria-labelledby="launch-heading">
      <div className="launch-head">
        <p className="type-label flex items-center gap-3 text-white/45">
          <span className="launch-pulse" aria-hidden="true" />
          {l.eyebrow}
        </p>
        <h3 id="launch-heading" className="launch-heading">
          {l.heading}
        </h3>
        <p className="type-small text-white/55 max-w-md">{l.intro}</p>
      </div>
      <ul className="launch-list">
        {products.map((product, i) => (
          <LaunchCard key={product.title} product={product} index={i} />
        ))}
      </ul>
    </div>
  );
}
