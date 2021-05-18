import { startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear } from 'date-fns';

export const today = () => new Date('2021-12-12');

export const weekStart = () => startOfWeek(today());
export const weekEnd = () => endOfWeek(today());

export const monthStart = () => startOfMonth(today());
export const monthEnd = () => endOfMonth(today());

export const yearStart = () => startOfYear(today());
export const yearEnd = () => endOfYear(today());
