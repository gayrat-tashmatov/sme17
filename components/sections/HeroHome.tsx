'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Rocket, TrendingUp, Users2, Landmark, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useT } from '@/lib/i18n';
import { REGIONS } from '@/lib/data/regions';

export function HeroHome() {
  const t = useT();
  return (
    <section className="relative hero-glow text-white overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-60 pointer-events-none" />
      <div className="container-wide relative py-20 md:py-28 lg:py-32 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold-light" />
            <span>{t('ui.draft-badge')}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.05] text-balance">
            {t('home.hero.title')}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cabinet">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                {t('home.hero.cta-primary')}
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline-white">
                {t('home.hero.cta-secondary')}
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/65">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold-light" /> {t('home.hero.trust.oneid')}
            </span>
            <span className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-gold-light" /> {t('home.hero.trust.deadline')}
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="hidden lg:block"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// Hero visual: real UZ map + compact live dashboard below
// ════════════════════════════════════════════════════════════════════

// Approximate city coordinates in the map viewBox "0 0 1000 652"
// Positions for 7 FEZ locations
const FEZ_POINTS = [
  { id: 'navoi',     name: 'Навои',     x: 488, y: 318 },
  { id: 'angren',    name: 'Ангрен',    x: 758, y: 252 },
  { id: 'jizzakh',   name: 'Джизак',    x: 620, y: 288 },
  { id: 'urgut',     name: 'Ургут',     x: 615, y: 360 },
  { id: 'kokand',    name: 'Коканд',    x: 770, y: 325 },
  { id: 'gijduvan',  name: 'Гиждуван',  x: 438, y: 370 },
  { id: 'khazarasp', name: 'Хазарасп',  x: 275, y: 285 },
];

function HeroVisual() {
  return (
    <div className="relative">
      {/* Map card */}
      <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gold-light font-semibold">Платформа · География</div>
            <div className="font-serif text-sm text-white font-semibold mt-0.5">14 регионов · 7 СЭЗ · 340+ МПЗ</div>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span>live</span>
          </div>
        </div>

        <svg viewBox="0 0 1000 652" className="w-full h-auto" aria-label="Карта Узбекистана · СЭЗ">
          {/* Uzbekistan regions — heat map by SME density */}
          {REGIONS.map((r) => {
            // Heat intensity from smeDensity (0–100 normalized)
            const intensity = Math.min(1, (r.smeDensity ?? 10) / 50);
            return (
              <path
                key={r.id}
                d={r.d}
                fill={`rgba(176, 141, 76, ${0.12 + intensity * 0.35})`}
                stroke="rgba(176, 141, 76, 0.45)"
                strokeWidth="1"
              />
            );
          })}

          {/* FEZ pulsing points */}
          {FEZ_POINTS.map((p, i) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r="10" fill="#EDD9A6" opacity="0.3">
                <animate attributeName="r"       values="8;16;8"    dur="2.5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={p.x} cy={p.y} r="5" fill="#EDD9A6" stroke="#1B2A3D" strokeWidth="1.5" />
              <text x={p.x + 9} y={p.y + 4} fill="#ffffff" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600" opacity="0.85">
                {p.name}
              </text>
            </g>
          ))}
        </svg>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-3 text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: 'rgba(176,141,76,0.5)' }} /> плотность МСБ
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold-light animate-pulse" /> СЭЗ
            </span>
          </div>
          <span className="text-gold-light font-mono">2.1M+ бизнесов</span>
        </div>
      </div>

      {/* Dashboard strip — 4 KPI */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <KpiTile
          Icon={TrendingUp}
          label="Доля МСБ в ВВП"
          value="54.1%"
          sub="+4.2% за 2024"
          accent="success"
        />
        <KpiTile
          Icon={Users2}
          label="Создано рабочих мест 2025"
          value="+480K"
          sub="в секторе МСБ"
          accent="gold"
        />
        <KpiTile
          Icon={Landmark}
          label="Модулей готово"
          value="20 / 20"
          sub="все интерактивные"
          accent="gold"
        />
        <CountdownTile />
      </div>
    </div>
  );
}

function KpiTile({ Icon, label, value, sub, accent }: {
  Icon: typeof TrendingUp; label: string; value: string; sub: string; accent: 'success' | 'gold';
}) {
  const colorClass = accent === 'success' ? 'text-success' : 'text-gold-light';
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
        <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">{label}</div>
      </div>
      <div className={`font-serif text-2xl font-semibold ${colorClass}`}>{value}</div>
      <div className="text-[10.5px] text-white/55 mt-0.5">{sub}</div>
    </div>
  );
}

function CountdownTile() {
  const deadline = new Date('2026-07-01T00:00:00+05:00').getTime();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));
      setDaysLeft(diff);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-gold-light/40 bg-gold-light/10 backdrop-blur-sm p-3 relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-15 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-1.5 mb-1">
          <Clock className="h-3.5 w-3.5 text-gold-light" />
          <div className="text-[10px] uppercase tracking-wider text-gold-light font-semibold">До дедлайна УП-50</div>
        </div>
        <div className="font-serif text-2xl font-semibold text-gold-light">
          {daysLeft === null ? '—' : `${daysLeft} дн.`}
        </div>
        <div className="text-[10.5px] text-white/60 mt-0.5">01.07.2026 · MVP</div>
      </div>
    </div>
  );
}

