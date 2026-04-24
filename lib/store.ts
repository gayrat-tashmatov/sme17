'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Lang, Role } from './types';

/** Results from any of the 6 assessments (digital/finlit/export/finance/legal/tax). */
export interface AssessmentResult {
  type: 'digital' | 'finlit' | 'export' | 'finance' | 'legal' | 'tax';
  scorePct: number;
  level: 'low' | 'medium' | 'high';
  completedAt: number; // timestamp
}

/** 7.3 — unified business profile across modules */
export interface UserProfile {
  name: string;           // имя предпринимателя
  businessName: string;   // название бизнеса
  inn: string;            // ИНН
  form: 'ip' | 'ooo' | null; // форма
  industry: string;        // отрасль
  region: string;          // регион
  employees: number;       // число сотрудников
  yearFounded: number;     // год основания
  revenueLastYear: number; // выручка за прошлый год, млн сум
  isItParkResident: boolean;
  isChampion: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Азамат Каримов',
  businessName: 'ООО «Силк Трейд»',
  inn: '304567891',
  form: 'ooo',
  industry: 'Текстильное производство',
  region: 'Ферганская обл.',
  employees: 34,
  yearFounded: 2021,
  revenueLastYear: 1_840,
  isItParkResident: false,
  isChampion: false,
};

interface YarpState {
  lang: Lang;
  role: Role;
  assistantOpen: boolean;

  // 7.1 — assessment results across modules
  assessments: Partial<Record<AssessmentResult['type'], AssessmentResult>>;

  // 7.2 — cross-module context for region-aware recommendations
  selectedRegion: string | null;

  // 7.3 — unified business profile
  profile: UserProfile;

  setLang: (l: Lang) => void;
  setRole: (r: Role) => void;
  toggleAssistant: () => void;
  closeAssistant: () => void;

  recordAssessment: (result: AssessmentResult) => void;
  setSelectedRegion: (regionId: string | null) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
}

export const useStore = create<YarpState>()(
  persist(
    (set) => ({
      lang: 'ru',
      role: 'guest',
      assistantOpen: false,
      assessments: {},
      selectedRegion: null,
      profile: DEFAULT_PROFILE,

      setLang: (lang) => set({ lang }),
      setRole: (role) => set({ role }),
      toggleAssistant: () => set((s) => ({ assistantOpen: !s.assistantOpen })),
      closeAssistant: () => set({ assistantOpen: false }),

      recordAssessment: (result) =>
        set((s) => ({ assessments: { ...s.assessments, [result.type]: result } })),
      setSelectedRegion: (regionId) => set({ selectedRegion: regionId }),
      updateProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),
    }),
    {
      name: 'yarp.preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        lang: s.lang,
        role: s.role,
        assessments: s.assessments,
        selectedRegion: s.selectedRegion,
        profile: s.profile,
      }),
      // Legacy role 'admin' from earlier versions → 'mef'.
      migrate: (persisted: any) => {
        if (persisted && persisted.role === 'admin') persisted.role = 'mef';
        if (persisted && !persisted.profile) persisted.profile = DEFAULT_PROFILE;
        return persisted;
      },
      version: 4,
    },
  ),
);
