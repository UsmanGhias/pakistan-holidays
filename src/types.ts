export type HolidayType = 'public' | 'bank' | 'optional' | 'provincial';

export type HolidayCategory = 'national' | 'religious' | 'banking' | 'cultural';

export type ProvinceCode =
  | 'PK-PB'  // Punjab
  | 'PK-SD'  // Sindh
  | 'PK-KP'  // Khyber Pakhtunkhwa
  | 'PK-BA'  // Balochistan
  | 'PK-GB'  // Gilgit-Baltistan
  | 'PK-AJK' // Azad Jammu & Kashmir
  | 'ALL';

export interface Holiday {
  id: string;
  name: string;
  nameUrdu: string;
  date: string; // 'YYYY-MM-DD'
  year: number;
  type: HolidayType;
  category: HolidayCategory;
  isLunar: boolean;
  isConfirmed: boolean;
  provinces: ProvinceCode[];
  description: string;
}

export interface HolidayFilterOptions {
  year?: number;
  type?: HolidayType | HolidayType[];
  category?: HolidayCategory | HolidayCategory[];
  province?: ProvinceCode;
  confirmedOnly?: boolean;
  month?: number; // 1 - 12
}

export interface WorkingDayOptions {
  weekendDays?: number[]; // Default: [0, 6] (Sunday, Saturday). Use [0] for 6-day working week.
  includeBankHolidays?: boolean; // Default: false (Bank closing does not halt regular offices).
  province?: ProvinceCode;
}

export interface HolidayCountdown extends Holiday {
  daysLeft: number;
  dayOfWeek: string;
}
