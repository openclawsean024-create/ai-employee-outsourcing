import { clsx, type ClassValue } from 'clsx';
import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const fmtMoney = (n: number) => `NT$ ${Math.round(n).toLocaleString('zh-TW')}`;

export const fmtNumber = (n: number) => Math.round(n).toLocaleString('zh-TW');

export const fmtDate = (date: string | Date, pattern = 'yyyy-MM-dd HH:mm') => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: zhTW });
};

export const fmtShortDate = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MM/dd HH:mm', { locale: zhTW });
};

export const fmtDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
};

export const TIER_LIMITS: Record<string, { agentLimit: number; taskLimit: number; monthlyCost: number; price: string }> = {
  free: { agentLimit: 5, taskLimit: 50, monthlyCost: 0, price: '免費' },
  kol: { agentLimit: 20, taskLimit: 500, monthlyCost: 299, price: 'NT$299/月' },
  pro: { agentLimit: 144, taskLimit: 2000, monthlyCost: 499, price: 'NT$499/月' },
  enterprise: { agentLimit: 144, taskLimit: 10000, monthlyCost: 4999, price: 'NT$4,999/月' },
};

export const TIER_LABELS: Record<string, string> = {
  free: '免費版',
  kol: 'KOL 版',
  pro: 'Pro 版',
  enterprise: '企業版',
};