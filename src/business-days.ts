import { WorkingDayOptions } from './types.js';
import { isHoliday } from './holidays.js';

function toMidnightDate(d: Date | string): Date {
  const date = typeof d === 'string' ? new Date(d) : new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  return date;
}

export function isWorkingDay(date: Date | string = new Date(), options: WorkingDayOptions = {}): boolean {
  const d = toMidnightDate(date);
  const weekendDays = options.weekendDays ?? [0, 6]; // Sunday (0) and Saturday (6)

  // Check weekend
  if (weekendDays.includes(d.getDay())) {
    return false;
  }

  // Check public holiday
  const holidayTypes = options.includeBankHolidays ? ['public', 'bank'] : ['public'];
  // @ts-ignore
  if (isHoliday(d, { type: holidayTypes, province: options.province })) {
    return false;
  }

  return true;
}

export function getBusinessDays(
  startDate: Date | string,
  endDate: Date | string,
  options: WorkingDayOptions = {}
): number {
  const start = toMidnightDate(startDate);
  const end = toMidnightDate(endDate);

  if (start > end) {
    return 0;
  }

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    if (isWorkingDay(current, options)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

export function addBusinessDays(
  startDate: Date | string,
  businessDaysToAdd: number,
  options: WorkingDayOptions = {}
): Date {
  const current = toMidnightDate(startDate);
  let added = 0;

  while (added < businessDaysToAdd) {
    current.setDate(current.getDate() + 1);
    if (isWorkingDay(current, options)) {
      added++;
    }
  }

  return current;
}
