'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, LayoutGrid } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { LetterBadge } from '@/components/ui/LetterBadge';
import { Icon } from '@/components/ui/Icon';
import { ALL_MODULES } from '@/lib/data/modules';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';

type FilterMode = 'all' | 'priority' | 'queue';

const FILTERS: { id: FilterMode; label: string }[] = [
  { id: 'all', label: 'Все модули' },
  { id: 'priority', label: 'Приоритет УП-50' },
  { id: 'queue', label: 'Общая очередь' },
];

export default function ModulesCatalogPage() {
  const t = useT();
  const [mode, setMode] = useState<FilterMode>('all');
  const [query, setQuery] = useState('');

  const filtered = ALL_MODULES.filter((m) => {
    if (mode !== 'all' && m.priority !== mode) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const title = t(m.titleKey).toLowerCase();
      const desc = t(m.descKey).toLowerCase();
      return title.includes(q) || desc.includes(q);
    }
    return true;
  });

  const priorityCount = ALL_MODULES.filter((m) => m.priority === 'priority').length;
  const queueCount = ALL_MODULES.filter((m) => m.priority === 'queue').length;

  return (
    <>
      {/* Hero */}
      <section className="relative hero-glow text-white overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none" />
        <div className="container-wide relative py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-5">
              <LayoutGrid className="h-3.5 w-3.5 text-gold-light" />
              <span>Каталог модулей</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-[1.05] text-balance">
              14 модулей — одна Платформа
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-3xl leading-relaxed">
              {priorityCount} приоритетных модулей к 01.07.2026 и {queueCount} модулей общей очереди к 2027–2028 гг.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-20 bg-bg-white/90 backdrop-blur-md border-b border-ink-line">
        <div className="container-wide py-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-bg-band rounded-lg p-1">
            {FILTERS.map((f) => {
              const active = f.id === mode;
              const count = f.id === 'all' ? ALL_MODULES.length : f.id === 'priority' ? priorityCount : queueCount;
              return (
                <button
                  key={f.id}
                  onClick={() => setMode(f.id)}
                  className={cn(
                    'h-9 px-3.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 focus-ring',
                    active ? 'bg-bg-white text-ink shadow-subtle' : 'text-ink-muted hover:text-ink',
                  )}
                >
                  {f.label}
                  <span className={cn('text-xs rounded-full px-1.5 py-0.5 font-semibold', active ? 'bg-gold/10 text-gold' : 'bg-ink-line text-ink-muted')}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              leftIcon={<Search className="h-4 w-4" />}
              placeholder={t('ui.search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container-wide py-10 md:py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-muted">
            <Filter className="h-8 w-8 mx-auto mb-3 opacity-50" />
            Ничего не найдено. Попробуйте другой запрос.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m, i) => (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Link href={m.href} className="block h-full focus-ring rounded-xl">
                  <Card hover className={cn('h-full flex flex-col', m.priority === 'queue' && 'bg-bg-band/50')}>
                    <div className="flex items-start gap-4">
                      {m.letter ? (
                        <LetterBadge letter={m.letter} size="md" variant="gold" />
                      ) : (
                        <div className="h-10 w-10 rounded-full border border-ink-line flex items-center justify-center text-ink-muted bg-bg-white">
                          <Icon name={m.iconName} className="h-5 w-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-[17px] leading-snug">{t(m.titleKey)}</CardTitle>
                        <CardDescription className="mt-1.5 text-[13px]">{t(m.descKey)}</CardDescription>
                      </div>
                    </div>
                    <div className="flex-1" />
                    <div className="mt-5 flex items-center justify-between">
                      <Badge variant={m.priority === 'priority' ? 'priority' : 'queue'}>
                        {t(m.priority === 'priority' ? 'ui.priority-deadline' : m.phase)}
                      </Badge>
                      <span className="text-sm text-gold font-medium">{t('ui.open')} →</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
