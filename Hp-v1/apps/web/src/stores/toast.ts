import { create } from 'zustand';

export type ToastTone = 'default' | 'success' | 'error';

export type ToastItem = {
  id: string;
  title: string;
  message?: string;
  tone: ToastTone;
};

type ToastState = {
  items: ToastItem[];
  push: (t: Omit<ToastItem, 'id'> & { id?: string }) => void;
  dismiss: (id: string) => void;
};

let seq = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  items: [],
  push: (t) => {
    const id = t.id ?? `t-${++seq}`;
    set({ items: [...get().items, { ...t, id }] });
    if (typeof window !== 'undefined') {
      window.setTimeout(() => get().dismiss(id), 6000);
    }
  },
  dismiss: (id) =>
    set({ items: get().items.filter((x) => x.id !== id) }),
}));

export function notifySuccess(title: string, message?: string) {
  useToastStore.getState().push({ title, message, tone: 'success' });
}

export function notifyError(title: string, message?: string) {
  useToastStore.getState().push({ title, message, tone: 'error' });
}

export function notifyInfo(title: string, message?: string) {
  useToastStore.getState().push({ title, message, tone: 'default' });
}
