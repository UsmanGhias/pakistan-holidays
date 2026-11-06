import { Holiday, HolidayFilterOptions, HolidayCountdown } from './types.js';
import { VERIFIED_HOLIDAYS } from './dataset.js';
import { estimateHolidaysForYear } from './lunar-estimate.js';

function normalizeDateStr(date: Date | string): string {
  if (typeof date === 'string') {
    // If string is already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getHolidays(options: HolidayFilterOptions = {}): Holiday[] {
  const targetYear = options.year ?? new Date().getFullYear();

  // 1. Get raw holiday pool for the year
  const known = VERIFIED_HOLIDAYS.filter((h) => h.year === targetYear);
  const basePool = known.length > 0 ? known : estimateHolidaysForYear(targetYear);

  // 2. Apply filters
  return basePool.filter((h) => {
    // Type filter
    if (options.type) {
      const allowedTypes = Array.isArray(options.type) ? options.type : [options.type];
      if (!allowedTypes.includes(h.type)) return false;
    }

    // Category filter
    if (options.category) {
      const allowedCats = Array.isArray(options.category) ? options.category : [options.category];
      if (!allowedCats.includes(h.category)) return false;
    }

    // Province filter
    if (options.province && options.province !== 'ALL') {
      const matchesProvince = h.provinces.includes('ALL') || h.provinces.includes(options.province);
      if (!matchesProvince) return false;
    }

    // Confirmed only
    if (options.confirmedOnly && !h.isConfirmed) {
      return false;
    }

    // Month filter
    if (options.month) {
      const holidayMonth = parseInt(h.date.split('-')[1], 10);
      if (holidayMonth !== options.month) return false;
    }

    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));
}

export function isHoliday(date: Date | string = new Date(), options: HolidayFilterOptions = {}): boolean {
  const dateStr = normalizeDateStr(date);
  const year = parseInt(dateStr.split('-')[0], 10);
  const holidays = getHolidays({ ...options, year });
  return holidays.some((h) => h.date === dateStr);
}

export function getHolidayDetails(date: Date | string = new Date(), options: HolidayFilterOptions = {}): Holiday | null {
  const dateStr = normalizeDateStr(date);
  const year = parseInt(dateStr.split('-')[0], 10);
  const holidays = getHolidays({ ...options, year });
  return holidays.find((h) => h.date === dateStr) || null;
}

export function isBankHoliday(date: Date | string = new Date()): boolean {
  return isHoliday(date, { type: 'bank' });
}

export function isPublicHoliday(date: Date | string = new Date(), province?: HolidayFilterOptions['province']): boolean {
  return isHoliday(date, { type: 'public', province });
}

export function getNextHoliday(
  fromDate: Date | string = new Date(),
  options: HolidayFilterOptions = {}
): HolidayCountdown | null {
  const upcoming = getUpcomingHolidays(1, fromDate, options);
  return upcoming.length > 0 ? upcoming[0] : null;
}

export function getUpcomingHolidays(
  count: number = 5,
  fromDate: Date | string = new Date(),
  options: HolidayFilterOptions = {}
): HolidayCountdown[] {
  const startStr = normalizeDateStr(fromDate);
  const currentYear = parseInt(startStr.split('-')[0], 10);

  // Pool from current year and next year to prevent wrap-around gaps in November/December
  const currentYearHolidays = getHolidays({ ...options, year: currentYear });
  const nextYearHolidays = getHolidays({ ...options, year: currentYear + 1 });
  const allUpcoming = [...currentYearHolidays, ...nextYearHolidays].filter((h) => h.date >= startStr);

  const startMs = new Date(startStr).getTime();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return allUpcoming.slice(0, count).map((h) => {
    const hDate = new Date(h.date);
    const diffMs = hDate.getTime() - startMs;
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const dayOfWeek = dayNames[hDate.getDay()];

    return {
      ...h,
      daysLeft,
      dayOfWeek,
    };
  });
}
