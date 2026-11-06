import { Holiday } from './types.js';

/**
 * Generates estimated holidays for years outside the verified dataset (e.g. 2028+ or pre-2024).
 * Islamic lunar holidays shift approximately 10.87 days earlier each Gregorian year.
 */
export function estimateHolidaysForYear(year: number): Holiday[] {
  // Reference anchor: 2026 dates (verified)
  const baseYear = 2026;
  const yearDiff = year - baseYear;
  // Average lunar year is ~354.36 days, Gregorian is ~365.24 days -> difference is ~10.88 days earlier
  const shiftDays = Math.round(yearDiff * -10.88);

  const shiftDate = (baseIso: string, daysToAdd: number, targetYear: number): string => {
    const d = new Date(baseIso);
    d.setUTCDate(d.getUTCDate() + daysToAdd);
    // Ensure the year matches target
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${targetYear}-${m}-${day}`;
  };

  const fixedHolidays: Holiday[] = [
    {
      id: `pk-bank-jan-${year}`,
      name: 'Bank Holiday (Annual Closing)',
      nameUrdu: 'بینک تعطیل (سالانہ اختتام)',
      date: `${year}-01-01`,
      year,
      type: 'bank',
      category: 'banking',
      isLunar: false,
      isConfirmed: true,
      provinces: ['ALL'],
      description: 'State Bank of Pakistan annual accounts closing.',
    },
    {
      id: `pk-kashmir-${year}`,
      name: 'Kashmir Solidarity Day',
      nameUrdu: 'یوم یکجہتی کشمیر',
      date: `${year}-02-05`,
      year,
      type: 'public',
      category: 'national',
      isLunar: false,
      isConfirmed: true,
      provinces: ['ALL'],
      description: 'National solidarity day with Kashmir.',
    },
    {
      id: `pk-day-${year}`,
      name: 'Pakistan Day',
      nameUrdu: 'یوم پاکستان',
      date: `${year}-03-23`,
      year,
      type: 'public',
      category: 'national',
      isLunar: false,
      isConfirmed: true,
      provinces: ['ALL'],
      description: 'Commemoration of the 1940 Lahore Resolution.',
    },
    {
      id: `pk-za-bhutto-${year}`,
      name: 'Death Anniversary of Zulfikar Ali Bhutto',
      nameUrdu: 'برسی ذوالفقار علی بھٹو',
      date: `${year}-04-04`,
      year,
      type: 'provincial',
      category: 'cultural',
      isLunar: false,
      isConfirmed: true,
      provinces: ['PK-SD'],
      description: 'Provincial holiday gazetted by the Government of Sindh.',
    },
    {
      id: `pk-labour-${year}`,
      name: 'Labour Day',
      nameUrdu: 'یوم مزدور',
      date: `${year}-05-01`,
      year,
      type: 'public',
      category: 'national',
      isLunar: false,
      isConfirmed: true,
      provinces: ['ALL'],
      description: 'International Workers Day.',
    },
    {
      id: `pk-bank-jul-${year}`,
      name: 'Bank Holiday (Half-Yearly Closing)',
      nameUrdu: 'بینک تعطیل (ششماہی اختتام)',
      date: `${year}-07-01`,
      year,
      type: 'bank',
      category: 'banking',
      isLunar: false,
      isConfirmed: true,
      provinces: ['ALL'],
      description: 'State Bank of Pakistan half-yearly accounts closing.',
    },
    {
      id: `pk-independence-${year}`,
      name: 'Independence Day',
      nameUrdu: 'جشن آزادی',
      date: `${year}-08-14`,
      year,
      type: 'public',
      category: 'national',
      isLunar: false,
      isConfirmed: true,
      provinces: ['ALL'],
      description: 'Celebration of Independence Day.',
    },
    {
      id: `pk-iqbal-${year}`,
      name: 'Iqbal Day',
      nameUrdu: 'یوم اقبال',
      date: `${year}-11-09`,
      year,
      type: 'public',
      category: 'national',
      isLunar: false,
      isConfirmed: true,
      provinces: ['ALL'],
      description: 'Birthday of Allama Muhammad Iqbal.',
    },
    {
      id: `pk-quaid-xmas-${year}`,
      name: "Quaid-e-Azam Day & Christmas",
      nameUrdu: 'یوم قائد اعظم اور کرسمس',
      date: `${year}-12-25`,
      year,
      type: 'public',
      category: 'national',
      isLunar: false,
      isConfirmed: true,
      provinces: ['ALL'],
      description: 'Birthday of founder Quaid-e-Azam and Christmas celebration.',
    },
    {
      id: `pk-benazir-${year}`,
      name: 'Shahadat of Mohtarma Benazir Bhutto',
      nameUrdu: 'شہادت محترمہ بے نظیر بھٹو',
      date: `${year}-12-27`,
      year,
      type: 'provincial',
      category: 'cultural',
      isLunar: false,
      isConfirmed: true,
      provinces: ['PK-SD'],
      description: 'Provincial public holiday gazetted by the Government of Sindh.',
    },
  ];

  // Estimated lunar holidays with unconfirmed flag
  const eidFitrEst = shiftDate('2026-03-20', shiftDays, year);
  const eidAdhaEst = shiftDate('2026-05-27', shiftDays, year);
  const ashuraEst = shiftDate('2026-06-25', shiftDays, year);
  const miladEst = shiftDate('2026-08-25', shiftDays, year);

  const estimatedLunarHolidays: Holiday[] = [
    {
      id: `pk-eid-fitr-1-${year}`,
      name: 'Eid-ul-Fitr (Day 1)',
      nameUrdu: 'عید الفطر (پہلا دن)',
      date: eidFitrEst,
      year,
      type: 'public',
      category: 'religious',
      isLunar: true,
      isConfirmed: false,
      provinces: ['ALL'],
      description: 'Estimated Eid-ul-Fitr (Subject to moon sighting by Ruet-e-Hilal Committee).',
    },
    {
      id: `pk-eid-adha-1-${year}`,
      name: 'Eid-ul-Adha (Day 1)',
      nameUrdu: 'عید الاضحیٰ (پہلا دن)',
      date: eidAdhaEst,
      year,
      type: 'public',
      category: 'religious',
      isLunar: true,
      isConfirmed: false,
      provinces: ['ALL'],
      description: 'Estimated Eid-ul-Adha (Subject to moon sighting).',
    },
    {
      id: `pk-ashura-${year}`,
      name: 'Ashura (10th Muharram)',
      nameUrdu: 'عاشورہ (۱۰ محرم الحرام)',
      date: ashuraEst,
      year,
      type: 'public',
      category: 'religious',
      isLunar: true,
      isConfirmed: false,
      provinces: ['ALL'],
      description: 'Estimated 10th Muharram Day of Ashura (Subject to moon sighting).',
    },
    {
      id: `pk-milad-${year}`,
      name: 'Eid Milad-un-Nabi',
      nameUrdu: 'عید میلاد النبی ﷺ',
      date: miladEst,
      year,
      type: 'public',
      category: 'religious',
      isLunar: true,
      isConfirmed: false,
      provinces: ['ALL'],
      description: 'Estimated 12 Rabi-ul-Awwal (Subject to moon sighting).',
    },
  ];

  return [...fixedHolidays, ...estimatedLunarHolidays].sort((a, b) => a.date.localeCompare(b.date));
}
