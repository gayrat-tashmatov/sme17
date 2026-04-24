'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import { Menu, X, Globe, Crown, ShieldCheck, UserCheck, User, Building2, ChevronDown, Check } from 'lucide-react';
import type { Lang, Role } from '@/lib/types';
import { CurrencyWidget } from '@/components/ui/CurrencyWidget';

const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/about', key: 'nav.about' },
  { href: '/modules', key: 'nav.modules' },
  { href: '/cabinet', key: 'nav.cabinet' },
];

const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: 'ru', label: 'Русский', short: 'RU' },
  { id: 'uz', label: 'Oʻzbekcha', short: 'UZ' },
  { id: 'en', label: 'English', short: 'EN' },
];

const ROLES: { id: Role; key: string; Icon: typeof User }[] = [
  { id: 'guest',        key: 'role.guest',        Icon: User },
  { id: 'entrepreneur', key: 'role.entrepreneur', Icon: UserCheck },
  { id: 'regionalMef',  key: 'role.regionalMef',  Icon: ShieldCheck },
  { id: 'mef',          key: 'role.mef',          Icon: Crown },
  { id: 'agency',       key: 'role.agency',       Icon: Building2 },
];

export default function Header() {
  const pathname = usePathname();
  const t = useT();
  const { lang, role, setLang, setRole } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  // Keep html lang in sync.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => setMobileOpen(false), [pathname]);

  const currentRole = ROLES.find((r) => r.id === role)!;

  return (
    <header className="sticky top-0 z-40 bg-bg-white/85 backdrop-blur-md border-b border-ink-line">
      <div className="container-wide flex items-center h-16 gap-6">
        {/* Logo mark */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 focus-ring rounded-md">
          <div className="relative h-9 w-11 rounded-lg bg-navy-gradient flex items-center justify-center shadow-subtle">
            <span className="font-serif text-white text-[12px] font-bold leading-none tracking-wider">YRP</span>
            <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-gold border-2 border-bg-white" />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-serif font-semibold text-navy text-[15px]">{t('brand.short')}</div>
            <div className="text-[11px] text-ink-muted uppercase tracking-wider">Государственная поддержка МСБ</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors focus-ring',
                  active ? 'text-navy bg-gold-soft' : 'text-ink-muted hover:text-navy hover:bg-bg-band',
                )}
              >
                {t(n.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Currency widget — ЦБ РУз rates (hidden on mobile) */}
        <div className="hidden lg:block">
          <CurrencyWidget />
        </div>

        {/* Lang switcher */}
        <div className="relative">
          <button
            onClick={() => { setLangOpen((v) => !v); setRoleOpen(false); }}
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-ink hover:bg-bg-band focus-ring"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4 text-ink-muted" />
            {LANGS.find((l) => l.id === lang)!.short}
            <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
          </button>
          {langOpen && (
            <DropdownMenu onClose={() => setLangOpen(false)}>
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { setLang(l.id); setLangOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-bg-band transition-colors',
                    lang === l.id && 'text-gold font-medium',
                  )}
                >
                  {l.label}
                  {lang === l.id && <Check className="h-4 w-4" />}
                </button>
              ))}
            </DropdownMenu>
          )}
        </div>

        {/* Role switcher */}
        <div className="relative">
          <button
            onClick={() => { setRoleOpen((v) => !v); setLangOpen(false); }}
            className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium border border-ink-line bg-bg-white hover:bg-bg-band focus-ring"
          >
            <currentRole.Icon className="h-4 w-4 text-gold" />
            <span className="max-w-[180px] truncate">{t(currentRole.key)}</span>
            <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
          </button>
          {roleOpen && (
            <DropdownMenu onClose={() => setRoleOpen(false)} width="w-72">
              <div className="px-3 py-2 border-b border-ink-line">
                <div className="text-xs text-ink-muted uppercase tracking-wider">{t('role.label')}</div>
              </div>
              {ROLES.map(({ id, key, Icon }) => (
                <button
                  key={id}
                  onClick={() => { setRole(id); setRoleOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-bg-band transition-colors',
                    role === id && 'bg-gold-soft',
                  )}
                >
                  <Icon className={cn('h-4 w-4', role === id ? 'text-gold' : 'text-ink-muted')} />
                  <span className="flex-1 text-left">{t(key)}</span>
                  {role === id && <Check className="h-4 w-4 text-gold" />}
                </button>
              ))}
            </DropdownMenu>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg hover:bg-bg-band focus-ring"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-ink-line bg-bg-white">
          <nav className="container-wide py-3 flex flex-col gap-1">
            {NAV.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    'px-3 py-2.5 rounded-lg text-[15px] font-medium',
                    active ? 'text-navy bg-gold-soft' : 'text-ink hover:bg-bg-band',
                  )}
                >
                  {t(n.key)}
                </Link>
              );
            })}
            <div className="mt-2 pt-3 border-t border-ink-line flex gap-2">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={cn(
                    'flex-1 h-9 rounded-lg text-sm font-medium',
                    lang === l.id ? 'bg-navy text-white' : 'bg-bg-band text-ink',
                  )}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function DropdownMenu({
  children,
  onClose,
  width = 'w-48',
}: {
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
}) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        className={cn(
          'absolute right-0 top-full mt-2 z-40 rounded-xl border border-ink-line bg-bg-white shadow-card-hover overflow-hidden',
          width,
        )}
      >
        {children}
      </div>
    </>
  );
}
