# pakistan-holidays

Official and gazetted public, bank, and provincial holidays for Pakistan with verified Central Ruet-e-Hilal lunar dates, business day counters, and an instant CLI.

Zero runtime dependencies. Dual ESM and CommonJS exports. Full TypeScript definitions included.

---

## Why this exists

Most global holiday packages (such as `date-holidays`) calculate Islamic holidays using Saudi Arabian or astronomical Umm al-Qura algorithms. In Pakistan, the Central Ruet-e-Hilal Committee announces lunar dates following physical moon sightings. As a result, global calculation libraries frequently miss Eid and Muharram dates by one to two days.

Additionally, standard packages often mistake State Bank of Pakistan closing days (January 1 and July 1) for full public holidays, or omit provincial holidays entirely.

`pakistan-holidays` fixes this with:
- Gazetted dates verified against Federal Ministry of Interior notifications
- Distinction between public holidays, bank closing days, and provincial observances
- Working day and business day calculators for payroll, HRMS, and logistics
- Built-in CLI that runs with `npx pakistan-holidays`
- Standalone JSON files for Python, Go, and PHP applications

---

## Quick Start (Terminal CLI)

Run directly via `npx` without installing:

```bash
# View all holidays for the current year
npx pakistan-holidays

# View the next upcoming holiday with a day countdown
npx pakistan-holidays next

# Check if today is a public holiday
npx pakistan-holidays today

# Check a specific date
npx pakistan-holidays check 2026-03-23

# Filter by type or province
npx pakistan-holidays --type bank
npx pakistan-holidays --province PK-SD --year 2026

# Output raw JSON for scripts
npx pakistan-holidays --json
```

---

## Installation

```bash
npm install pakistan-holidays
```

Or using Yarn / pnpm / Bun:

```bash
pnpm add pakistan-holidays
bun add pakistan-holidays
```

---

## Usage

### 1. Check if a date is a holiday

```typescript
import { isHoliday, isPublicHoliday, isBankHoliday, getHolidayDetails } from 'pakistan-holidays';

// General holiday check
isHoliday('2026-03-23'); // true (Pakistan Day)
isHoliday(new Date('2026-08-14')); // true (Independence Day)
isHoliday('2026-03-24'); // false

// Check specifically for general public holidays vs bank holidays
isPublicHoliday('2026-01-01'); // false (Government offices and schools are open)
isBankHoliday('2026-01-01'); // true (State Bank accounts closing day)

// Inspect structured holiday metadata
const holiday = getHolidayDetails('2026-03-23');
console.log(holiday);
/*
{
  id: 'pk-day-2026',
  name: 'Pakistan Day',
  nameUrdu: 'یوم پاکستان',
  date: '2026-03-23',
  year: 2026,
  type: 'public',
  category: 'national',
  isLunar: false,
  isConfirmed: true,
  provinces: ['ALL'],
  description: 'Commemoration of the 1940 Lahore Resolution.'
}
*/
```

### 2. List and filter holidays

```typescript
import { getHolidays } from 'pakistan-holidays';

// All holidays for 2026
const holidays2026 = getHolidays({ year: 2026 });

// Only State Bank of Pakistan closing days
const bankHolidays = getHolidays({ year: 2026, type: 'bank' });

// Holidays specific to Sindh (includes Benazir Bhutto and Z.A. Bhutto anniversaries)
const sindhHolidays = getHolidays({ year: 2026, province: 'PK-SD' });

// Confirmed gazetted holidays only (excludes unconfirmed forward lunar projections)
const confirmedOnly = getHolidays({ year: 2027, confirmedOnly: true });
```

### 3. Business days and working day calculations

Designed for payroll, HRMS leave calculations, and e-commerce delivery estimates:

```typescript
import { isWorkingDay, getBusinessDays, addBusinessDays } from 'pakistan-holidays';

// Check if a date is a working day (excludes weekends and public holidays)
isWorkingDay('2026-03-23'); // false (Pakistan Day)
isWorkingDay('2026-03-24'); // true (Regular Tuesday)
isWorkingDay('2026-03-22'); // false (Sunday)

// 6-day work weeks (pass custom weekend configuration)
isWorkingDay('2026-03-21', { weekendDays: [0] }); // false (Saturday is Eid-ul-Fitr Day 2)

// Count business days between two dates
// Between Monday 2026-03-16 and Friday 2026-03-20:
// Friday March 20 is Eid-ul-Fitr Day 1, so 4 working days
const workingDays = getBusinessDays('2026-03-16', '2026-03-20');
console.log(workingDays); // 4

// Add business days (e.g., standard 3-day delivery window)
const deliveryDate = addBusinessDays('2026-03-19', 3);
// Jumps across Eid holidays and weekend to March 25
```

### 4. Countdown to upcoming holidays

```typescript
import { getNextHoliday, getUpcomingHolidays } from 'pakistan-holidays';

const next = getNextHoliday();
console.log(`Next holiday: ${next.name} in ${next.daysLeft} days`);

// Next 3 holidays
const nextThree = getUpcomingHolidays(3);
```

---

## Standalone JSON (For Python, PHP, Go, and Flutter)

If your backend is not running Node.js, consume the prebuilt static JSON datasets via jsDelivr CDN or GitHub raw URLs:

- **2026 Holidays**: `https://cdn.jsdelivr.net/npm/pakistan-holidays/dist/pakistan-holidays-2026.json`
- **All Historical & Gazetted Holidays**: `https://cdn.jsdelivr.net/npm/pakistan-holidays/dist/all-holidays.json`

---

## Holiday Classification Reference

| Type | Description | Examples |
|---|---|---|
| `public` | Federal gazetted public holidays applicable nationwide | Pakistan Day, Independence Day, Eid-ul-Fitr, Ashura |
| `bank` | State Bank of Pakistan holidays (banks closed to public) | January 1, July 1, 1st Ramadan |
| `provincial` | Provincial government public holidays | Benazir Bhutto Anniversary (Sindh), Z.A. Bhutto Anniversary (Sindh) |
| `optional` | Cabinet Division notified optional days for minority groups | Day After Christmas, Holi, Diwali, Good Friday |

Province codes supported: `PK-PB` (Punjab), `PK-SD` (Sindh), `PK-KP` (Khyber Pakhtunkhwa), `PK-BA` (Balochistan), `PK-GB` (Gilgit-Baltistan), `PK-AJK` (Azad Kashmir).

---

## Testing

```bash
npm test
```

Runs the built-in Node.js test suite covering date parsing, provincial filters, lunar fallbacks, and business day calculations.

---

## License

MIT © [Usman Ghias](https://usmanghias.co.uk)
