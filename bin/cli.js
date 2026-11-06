#!/usr/bin/env node

import {
  getHolidays,
  getNextHoliday,
  getUpcomingHolidays,
  isHoliday,
  getHolidayDetails,
  isWorkingDay,
} from '../dist/index.mjs';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
Pakistan Holidays CLI (npx pakistan-holidays)
Author: Usman Ghias (https://usmanghias.co.uk)

Usage:
  npx pakistan-holidays [command] [options]

Commands:
  list                List all holidays for the specified year (default)
  next                Show the next upcoming holiday with countdown
  today               Check if today is a public or bank holiday
  check <date>        Check if a specific date (YYYY-MM-DD) is a holiday

Options:
  -y, --year <year>       Specify calendar year (default: current year)
  -t, --type <type>       Filter by type: public, bank, provincial, optional
  -p, --province <code>   Filter by province: PK-PB, PK-SD, PK-KP, PK-BA, PK-GB, PK-AJK
  -m, --month <month>     Filter by month (1 - 12)
  --json                  Output raw JSON
  -h, --help              Show this help menu
  -v, --version           Show version
  `);
}

function formatDateDisplay(isoStr) {
  const d = new Date(isoStr);
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[d.getDay()];
  return `${day} ${month} (${dayName})`;
}

function main() {
  if (args.includes('-h') || args.includes('--help')) {
    printHelp();
    return;
  }

  if (args.includes('-v') || args.includes('--version')) {
    console.log('pakistan-holidays v1.0.0');
    return;
  }

  const isJson = args.includes('--json');

  // Parse options
  let year = new Date().getFullYear();
  let type = undefined;
  let province = undefined;
  let month = undefined;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '-y' || args[i] === '--year') && args[i + 1]) {
      year = parseInt(args[i + 1], 10);
    }
    if ((args[i] === '-t' || args[i] === '--type') && args[i + 1]) {
      type = args[i + 1];
    }
    if ((args[i] === '-p' || args[i] === '--province') && args[i + 1]) {
      province = args[i + 1].toUpperCase();
      if (!province.startsWith('PK-') && province !== 'ALL') {
        province = `PK-${province}`;
      }
    }
    if ((args[i] === '-m' || args[i] === '--month') && args[i + 1]) {
      month = parseInt(args[i + 1], 10);
    }
  }

  const command = args[0] && !args[0].startsWith('-') ? args[0].toLowerCase() : 'list';

  if (command === 'next') {
    const next = getNextHoliday(new Date(), { type, province });
    if (isJson) {
      console.log(JSON.stringify(next, null, 2));
      return;
    }
    if (!next) {
      console.log('No upcoming holidays found.');
      return;
    }
    console.log('\n🇵🇰 Next Upcoming Holiday in Pakistan:');
    console.log('----------------------------------------------------');
    console.log(`  Holiday:   ${next.name} (${next.nameUrdu})`);
    console.log(`  Date:      ${formatDateDisplay(next.date)} - ${next.date}`);
    console.log(`  Countdown: In ${next.daysLeft} day${next.daysLeft === 1 ? '' : 's'}`);
    console.log(`  Type:      ${next.type.toUpperCase()} ${next.isConfirmed ? '(Gazetted)' : '(Tentative Lunar)'}`);
    console.log(`  Details:   ${next.description}\n`);
    return;
  }

  if (command === 'today') {
    const today = new Date();
    const details = getHolidayDetails(today, { province });
    const isWork = isWorkingDay(today, { province });

    if (isJson) {
      console.log(JSON.stringify({ isHoliday: Boolean(details), details, isWorkingDay: isWork }, null, 2));
      return;
    }

    if (details) {
      console.log(`\n🎉 Today IS a holiday in Pakistan!`);
      console.log(`  Name:  ${details.name} (${details.nameUrdu})`);
      console.log(`  Type:  ${details.type.toUpperCase()}`);
      console.log(`  Note:  ${details.description}\n`);
    } else {
      console.log(`\n🏢 Today is NOT a gazetted public holiday in Pakistan.`);
      console.log(`  Working Day Status: ${isWork ? 'Regular Working Day' : 'Weekend'}\n`);
    }
    return;
  }

  if (command === 'check') {
    const targetDate = args[1];
    if (!targetDate || !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
      console.error('Error: Please provide a valid date in YYYY-MM-DD format. Example: npx pakistan-holidays check 2026-03-23');
      process.exit(1);
    }
    const details = getHolidayDetails(targetDate, { province });
    const isWork = isWorkingDay(targetDate, { province });

    if (isJson) {
      console.log(JSON.stringify({ date: targetDate, isHoliday: Boolean(details), details, isWorkingDay: isWork }, null, 2));
      return;
    }

    if (details) {
      console.log(`\n🎉 ${targetDate} is a Holiday!`);
      console.log(`  Name:  ${details.name} (${details.nameUrdu})`);
      console.log(`  Type:  ${details.type.toUpperCase()}`);
      console.log(`  Note:  ${details.description}\n`);
    } else {
      console.log(`\n🏢 ${targetDate} is NOT a holiday.`);
      console.log(`  Working Day: ${isWork ? 'Yes' : 'No (Weekend)'}\n`);
    }
    return;
  }

  // Default: list
  const holidays = getHolidays({ year, type, province, month });

  if (isJson) {
    console.log(JSON.stringify(holidays, null, 2));
    return;
  }

  console.log(`\n🇵🇰 Official & Gazetted Holidays in Pakistan (${year})`);
  console.log('========================================================================================');
  console.log(' Date             | Holiday Name                             | Type       | Status');
  console.log('------------------+------------------------------------------+------------+--------------');

  for (const h of holidays) {
    const dateFormatted = formatDateDisplay(h.date).padEnd(16);
    const name = h.name.length > 40 ? h.name.slice(0, 37) + '...' : h.name.padEnd(40);
    const typeLabel = h.type.toUpperCase().padEnd(10);
    const status = (h.isConfirmed ? '✓ Confirmed' : '~ Tentative').padEnd(12);

    console.log(` ${dateFormatted} | ${name} | ${typeLabel} | ${status}`);
  }

  console.log('========================================================================================');
  console.log(`Total: ${holidays.length} holidays found for ${year}. Run 'npx pakistan-holidays next' for upcoming.\n`);
}

main();
