// src/stores/useBriefingStore.ts
// Lightweight client store connecting package cards in Caminhao with the
// 3-step guided BriefingBuilder in #contato.
import { create } from 'zustand';
import { data } from '@/data/copy/home';
import { mapPackageIdToBriefingName, type BriefingStep } from '@/lib/briefing';

interface BriefingStoreState {
  format: string;
  packageName: string;
  date: string;
  dateFlexible: boolean;
  city: string;
  step: BriefingStep;
  selectedFromCatalog: boolean;

  setFormat: (format: string) => void;
  setPackageName: (packageName: string) => void;
  setDate: (date: string) => void;
  setDateFlexible: (flexible: boolean) => void;
  setCity: (city: string) => void;
  setStep: (step: BriefingStep) => void;
  selectPackageFromCatalog: (packageId: string) => void;
  resetBriefing: () => void;
}

const INITIAL_FORMAT = data.briefing.formats[0];
const INITIAL_PACKAGE = data.briefing.packages[0].name;

export const useBriefingStore = create<BriefingStoreState>((set) => ({
  format: INITIAL_FORMAT,
  packageName: INITIAL_PACKAGE,
  date: '',
  dateFlexible: false,
  city: '',
  step: 1,
  selectedFromCatalog: false,

  setFormat: (format) => set({ format }),
  setPackageName: (packageName) => set({ packageName, selectedFromCatalog: false }),
  setDate: (date) => set({ date, dateFlexible: date.trim() ? false : false }),
  setDateFlexible: (dateFlexible) =>
    set((state) => ({
      dateFlexible,
      date: dateFlexible ? '' : state.date,
    })),
  setCity: (city) => set({ city }),
  setStep: (step) => set({ step }),
  selectPackageFromCatalog: (packageId) =>
    set({
      packageName: mapPackageIdToBriefingName(packageId),
      step: 1,
      selectedFromCatalog: true,
    }),
  resetBriefing: () =>
    set({
      format: INITIAL_FORMAT,
      packageName: INITIAL_PACKAGE,
      date: '',
      dateFlexible: false,
      city: '',
      step: 1,
      selectedFromCatalog: false,
    }),
}));
