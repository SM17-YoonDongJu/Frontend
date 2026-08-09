export type ToastVariant = "success" | "error";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
}

const MAX_TOASTS = 3;
const DURATION_MS: Record<ToastVariant, number> = {
  success: 3000,
  error: 5000,
};

const EMPTY: ToastItem[] = [];

let toasts: ToastItem[] = EMPTY;
let counter = 0;

const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  for (const listener of listeners) listener();
}

function clearTimer(id: string) {
  const timer = timers.get(id);
  if (timer === undefined) return;
  clearTimeout(timer);
  timers.delete(id);
}

function scheduleDismiss(id: string, variant: ToastVariant) {
  clearTimer(id);
  timers.set(
    id,
    setTimeout(() => dismissToast(id), DURATION_MS[variant]),
  );
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot() {
  return toasts;
}

export function getServerSnapshot() {
  return EMPTY;
}

export function dismissToast(id: string) {
  clearTimer(id);
  const next = toasts.filter((item) => item.id !== id);
  if (next.length === toasts.length) return;
  toasts = next;
  emit();
}

function showToast(variant: ToastVariant, message: string) {
  const duplicate = toasts.find(
    (item) => item.variant === variant && item.message === message,
  );
  if (duplicate) {
    scheduleDismiss(duplicate.id, variant);
    return;
  }

  const id = `toast-${++counter}`;
  let next = [...toasts, { id, variant, message }];

  const overflow = next.length - MAX_TOASTS;
  if (overflow > 0) {
    for (const stale of next.slice(0, overflow)) clearTimer(stale.id);
    next = next.slice(overflow);
  }

  toasts = next;
  scheduleDismiss(id, variant);
  emit();
}

export const toast = {
  success: (message: string) => showToast("success", message),
  error: (message: string) => showToast("error", message),
};
