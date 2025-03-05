import { CronRegex } from './cron-client';

describe('CronRegex', () => {
  it('should accept valid crons', () => {
    // Basic examples
    expect(CronRegex.test('35 20 * * 1-5')).toBeTruthy(); // At 20:35 on every weekday (Monday through Friday)
    expect(CronRegex.test('0 0 * * *')).toBeTruthy(); // At 00:00 every day
    expect(CronRegex.test('*/15 * * * *')).toBeTruthy(); // Every 15 minutes
    expect(CronRegex.test('0 0 1,15 * *')).toBeTruthy(); // At 00:00 on the 1st and 15th of every month

    // Step values
    expect(CronRegex.test('0 */2 * * *')).toBeTruthy(); // Every 2 hours
    expect(CronRegex.test('0 0 */5 * *')).toBeTruthy(); // Every 5 days of the month

    // Day of week ranges and lists
    expect(CronRegex.test('0 0 * * 1,3,5')).toBeTruthy(); // At midnight on Monday, Wednesday, and Friday
    expect(CronRegex.test('30 18 * * 1-5')).toBeTruthy(); // At 18:30 on weekdays
    expect(CronRegex.test('45 17 * * 0,6')).toBeTruthy(); // At 17:45 on weekends (Sunday and Saturday)

    // Complex examples combining features
    expect(CronRegex.test('0 23 * * 5')).toBeTruthy(); // At 23:00 on Friday
    expect(CronRegex.test('45 17 1,15 * *')).toBeTruthy(); // At 17:45 on the 1st and 15th of every month
  });
});
