import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getHolidays,
  isHoliday,
  getHolidayDetails,
  isBankHoliday,
  isPublicHoliday,
  getNextHoliday,
  getUpcomingHolidays,
  isWorkingDay,
  getBusinessDays,
  addBusinessDays,
  estimateHolidaysForYear,
} from '../dist/index.mjs';

test('getHolidays returns verified holidays for 2026', () => {
  const holidays = getHolidays({ year: 2026 });
  assert.ok(Array.isArray(holidays));
  assert.ok(holidays.length >= 20);

  // Check specific major holidays exist
  const names = holidays.map((h) => h.name);
  assert.ok(names.includes('Pakistan Day'));
  assert.ok(names.includes('Independence Day'));
  assert.ok(names.includes('Labour Day'));
  assert.ok(names.includes('Kashmir Solidarity Day'));
  assert.ok(names.some((n) => n.includes('Eid-ul-Fitr')));
  assert.ok(names.some((n) => n.includes('Eid-ul-Adha')));
  assert.ok(names.some((n) => n.includes('Ashura')));
});

test('isHoliday accurately identifies holidays by string and Date', () => {
  // Pakistan Day 2026-03-23
  assert.equal(isHoliday('2026-03-23'), true);
  assert.equal(isHoliday(new Date('2026-03-23T00:00:00')), true);

  // Independence Day 2026-08-14
  assert.equal(isHoliday('2026-08-14'), true);

  // Regular non-holiday day
  assert.equal(isHoliday('2026-03-24'), false);
  assert.equal(isHoliday('2026-08-15'), false);
});

test('getHolidayDetails returns complete structured metadata', () => {
  const details = getHolidayDetails('2026-03-23');
  assert.ok(details !== null);
  assert.equal(details?.name, 'Pakistan Day');
  assert.equal(details?.nameUrdu, 'یوم پاکستان');
  assert.equal(details?.type, 'public');
  assert.equal(details?.category, 'national');
  assert.equal(details?.isConfirmed, true);
});

test('Bank holidays are distinguished from general public holidays', () => {
  // Jan 1 is Bank Holiday, not public
  assert.equal(isBankHoliday('2026-01-01'), true);
  assert.equal(isPublicHoliday('2026-01-01'), false);

  // Pakistan Day is Public Holiday, not bank holiday
  assert.equal(isPublicHoliday('2026-03-23'), true);
  assert.equal(isBankHoliday('2026-03-23'), false);
});

test('Provincial filtering works correctly', () => {
  // Benazir Bhutto anniversary on Dec 27 is gazetted for Sindh (PK-SD)
  const sindhHolidays = getHolidays({ year: 2026, province: 'PK-SD' });
  const punjabHolidays = getHolidays({ year: 2026, province: 'PK-PB' });

  assert.ok(sindhHolidays.some((h) => h.id.includes('benazir')));
  assert.ok(!punjabHolidays.some((h) => h.id.includes('benazir')));
});

test('getNextHoliday and getUpcomingHolidays compute correct countdowns', () => {
  // From 2026-01-02, next should be Kashmir Solidarity Day (Feb 5)
  const next = getNextHoliday('2026-01-02');
  assert.ok(next !== null);
  assert.equal(next?.name, 'Kashmir Solidarity Day');
  assert.ok(next?.daysLeft > 0);
  assert.ok(typeof next?.dayOfWeek === 'string');

  const upcoming = getUpcomingHolidays(3, '2026-01-02');
  assert.equal(upcoming.length, 3);
  assert.ok(upcoming[0].daysLeft <= upcoming[1].daysLeft);
});

test('Working days and business days calculation', () => {
  // Sunday is not a working day
  const sunday = new Date('2026-03-22'); // Sunday
  assert.equal(isWorkingDay(sunday), false);

  // Monday 2026-03-23 is Pakistan Day (Public Holiday) -> Not a working day
  assert.equal(isWorkingDay('2026-03-23'), false);

  // Tuesday 2026-03-24 is regular Tuesday -> Working day
  assert.equal(isWorkingDay('2026-03-24'), true);

  // Counting business days between Monday 2026-03-16 and Friday 2026-03-20 (5 working days)
  const days = getBusinessDays('2026-03-16', '2026-03-20');
  assert.equal(days, 4); // March 20 is Eid-ul-Fitr Day 1, so 4 working days!
});

test('addBusinessDays jumps across weekends and holidays', () => {
  // Thursday 2026-03-19 + 2 business days:
  // Friday March 20 is Eid-ul-Fitr (Holiday)
  // Saturday March 21 is Weekend + Eid
  // Sunday March 22 is Weekend + Eid
  // Monday March 23 is Pakistan Day (Holiday)
  // Tuesday March 24 is 1st business day
  // Wednesday March 25 is 2nd business day
  const target = addBusinessDays('2026-03-19', 2);
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  assert.equal(`${target.getFullYear()}-${m}-${d}`, '2026-03-25');
});

test('estimateHolidaysForYear provides non-empty fallback for future years', () => {
  const est2030 = estimateHolidaysForYear(2030);
  assert.ok(est2030.length > 0);
  assert.ok(est2030.some((h) => h.name === 'Pakistan Day' && h.isConfirmed === true));
  assert.ok(est2030.some((h) => h.name.includes('Eid-ul-Fitr') && h.isConfirmed === false));
});
