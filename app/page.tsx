'use client';

import { Badge } from '@/components/ui/Badge';
import { HeroHome } from '@/components/sections/HeroHome';
import { StatsBand } from '@/components/sections/StatsBand';
import { ModuleCardGrid } from '@/components/sections/ModuleCardGrid';
import { RoleSwitcherBand } from '@/components/sections/RoleSwitcherBand';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { RoadmapTimeline } from '@/components/sections/RoadmapTimeline';
import { PartnersGrid } from '@/components/sections/PartnersGrid';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { PRIORITY_MODULES, NEW_PRIORITY_MODULES, QUEUE_MODULES, NEW_QUEUE_MODULES } from '@/lib/data/modules';
import { useT } from '@/lib/i18n';

export default function Home() {
  const t = useT();
  return (
    <>
      <HeroHome />

      {/* ★ Role switcher — 5 cabinets, visible right after hero */}
      <RoleSwitcherBand />

      <StatsBand />

      {/* 6 priority modules */}
      <section className="container-wide py-16 md:py-24">
        <div className="max-w-3xl mb-10 md:mb-12">
          <Badge variant="priority" className="mb-4">{t('home.priority.eyebrow')}</Badge>
          <h2 className="text-balance">{t('home.priority.title')}</h2>
          <p className="mt-3 text-lg text-pretty">{t('home.priority.subtitle')}</p>
        </div>
        <ModuleCardGrid modules={PRIORITY_MODULES} variant="priority" />
      </section>

      {/* ★ 2 NEW modules from international benchmarks — Phase 2 (H2 2026) */}
      <section className="container-wide py-12 md:py-16 border-t border-ink-line">
        <div className="max-w-3xl mb-8">
          <Badge variant="new" className="mb-4">NEW · предложение из бенчмарков</Badge>
          <h2 className="text-balance">Два новых модуля — расширение после 01.07.2026</h2>
          <p className="mt-3 text-pretty text-ink-muted">
            Из международного опыта: проверка контрагентов (мсп.рф · Россия) и пошаговые гайды по видам бизнеса (business.gov.au · Австралия). Не входят в 6 приоритетных по УП-50 — разворачиваются во 2-й половине 2026 после фундамента.
          </p>
        </div>
        <ModuleCardGrid modules={NEW_PRIORITY_MODULES} variant="new-priority" columns={2} />
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* 8 queue modules */}
      <section className="container-wide py-16 md:py-24">
        <div className="max-w-3xl mb-10 md:mb-12">
          <Badge variant="queue" className="mb-4">{t('home.queue.eyebrow')}</Badge>
          <h2 className="text-balance">{t('home.queue.title')}</h2>
          <p className="mt-3 text-lg text-pretty">{t('home.queue.subtitle')}</p>
        </div>
        <ModuleCardGrid modules={QUEUE_MODULES} variant="queue" />
      </section>

      {/* ★ 2 NEW queue modules */}
      <section className="container-wide py-12 md:py-16 border-t border-ink-line">
        <div className="max-w-3xl mb-8">
          <Badge variant="new" className="mb-4">NEW · предложение из бенчмарков</Badge>
          <h2 className="text-balance">Ещё два модуля — в общую очередь</h2>
          <p className="mt-3 text-pretty text-ink-muted">
            Государственные закупки для МСБ (мсп.рф, 223-ФЗ) и единая LMS по образцу SBA Learning Center (США). Развёртывание 2027–2028.
          </p>
        </div>
        <ModuleCardGrid modules={NEW_QUEUE_MODULES} variant="new-queue" columns={2} />
      </section>

      {/* Roadmap */}
      <RoadmapTimeline />

      {/* Partners */}
      <PartnersGrid />

      {/* Final CTA */}
      <FinalCTA />
    </>
  );
}
