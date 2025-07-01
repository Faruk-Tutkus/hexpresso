type DatePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
type PeriodResult = 'TODAY' | 'THISWEEK' | 'THISMONTHLY' | 'THISYEAR';

/**
 * Parses a date range string and returns start and end dates
 * @param dateRangeString - Date range in format "30.12.2024 - 05.01.2025"
 * @returns Object with start and end date strings
 */
function parseDateRangeString(dateRangeString: string): { start: string; end: string } {
  const parts = dateRangeString.split(' - ').map(part => part.trim());
  if (parts.length !== 2) {
    throw new Error('Invalid date range format. Expected format: "30.12.2024 - 05.01.2025"');
  }
  return {
    start: parts[0],
    end: parts[1]
  };
}

/**
 * Converts ISO date string to DD.MM.YYYY format
 * @param isoDate - ISO date string like "2017-06-13T17:07:00.000Z"
 * @returns Formatted date string like "13.06.2017"
 */
function formatDateToDisplay(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Converts Date object to DD.MM.YYYY format
 * @param date - Date object
 * @returns Formatted date string like "13.06.2017"
 */
function formatDateObjectToDisplay(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Converts DD.MM.YYYY format to Date object
 * @param dateString - Date string in DD.MM.YYYY format
 * @returns Date object
 */
function parseDisplayDate(dateString: string): Date {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Gets the start and end of the week for a given date (Monday to Sunday)
 * @param date - Date object
 * @returns Object with start and end Date objects
 */
function getWeekRange(date: Date): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  
  // Create separate date objects for start and end
  const start = new Date(d);
  start.setDate(diff);
  
  const end = new Date(d);
  end.setDate(diff + 6);
  
  return { start, end };
}

/**
 * Gets the start and end of the month for a given date
 * @param date - Date object
 * @returns Object with start and end Date objects
 */
function getMonthRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  return { start, end };
}

/**
 * Returns the date range string for the given period containing the specified date
 * @param period - The period type: 'daily', 'weekly', 'monthly', or 'yearly'
 * @param isoDate - ISO date string like "2017-06-13T17:07:00.000Z"
 * @returns Date range string like "30.12.2024 - 05.01.2025"
 */
export function getDateRangeForPeriod(
  period: DatePeriod,
  isoDate: string
): string {
  const date = new Date(isoDate);
  
  switch (period) {
    case 'daily': {
      const formattedDate = formatDateObjectToDisplay(date);
      return formattedDate;
    }
    
    case 'weekly': {
      const { start, end } = getWeekRange(date);
      const startFormatted = formatDateObjectToDisplay(start);
      const endFormatted = formatDateObjectToDisplay(end);
      return `${startFormatted} - ${endFormatted}`;
    }
    
    case 'monthly': {
      const { start, end } = getMonthRange(date);
      const startFormatted = formatDateObjectToDisplay(start);
      const endFormatted = formatDateObjectToDisplay(end);
      return `${startFormatted} - ${endFormatted}`;
    }
    
    case 'yearly': {
      return date.getFullYear().toString();
    }
    
    default:
      const formattedDate = formatDateObjectToDisplay(date);
      return formattedDate;
  }
}

/**
 * Checks if a date is within a given date range
 * @param targetDate - Date to check
 * @param rangeStart - Start of the range (DD.MM.YYYY)
 * @param rangeEnd - End of the range (DD.MM.YYYY)
 * @returns True if date is within range
 */
function isDateInRange(targetDate: Date, rangeStart: string, rangeEnd: string): boolean {
  const startDate = parseDisplayDate(rangeStart);
  const endDate = parseDisplayDate(rangeEnd);
  
  // Set time to start of day for accurate comparison
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
  return target >= start && target <= end;
}

/**
 * Main function that determines the period type based on date parameters
 * @param period - The period type: 'daily', 'weekly', 'monthly', or 'yearly'
 * @param dateRange - Either an ISO date string or a date range string like "30.12.2024 - 05.01.2025"
 * @returns Period result: 'TODAY', 'THISWEEK', 'THISMONTHLY', or 'THISYEAR'
 */
export function checkDatePeriod(
  period: DatePeriod,
  dateRange: string
): PeriodResult {
  const today = new Date();
  
  switch (period) {
    case 'daily': {
      // For daily, dateRange should be an ISO date string
      if (dateRange.includes('T') || dateRange.includes('Z')) {
        // ISO date format
        const targetDate = new Date(dateRange);
        const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        return targetDay.getTime() === todayDay.getTime() ? 'TODAY' : 'TODAY';
      }
      return 'TODAY';
    }
    
    case 'weekly': {
      // For weekly, dateRange should be like "30.12.2024 - 05.01.2025"
      if (dateRange.includes(' - ')) {
        const { start, end } = parseDateRangeString(dateRange);
        if (isDateInRange(today, start, end)) {
          return 'THISWEEK';
        }
      }
      return 'THISWEEK';
    }
    
    case 'monthly': {
      // For monthly, dateRange should be like "30.12.2024 - 05.01.2025"
      if (dateRange.includes(' - ')) {
        const { start, end } = parseDateRangeString(dateRange);
        if (isDateInRange(today, start, end)) {
          return 'THISMONTHLY';
        }
      }
      return 'THISMONTHLY';
    }
    
    case 'yearly': {
      // For yearly, dateRange should be like "01.01.2024 - 31.12.2024"
      if (dateRange.includes(' - ')) {
        const { start, end } = parseDateRangeString(dateRange);
        if (isDateInRange(today, start, end)) {
          return 'THISYEAR';
        }
      }
      return 'THISYEAR';
    }
    
    default:
      return 'TODAY';
  }
}

/**
 * Helper function to check if a specific ISO date is within a given range
 * @param isoDate - ISO date string like "2017-06-13T17:07:00.000Z"
 * @param dateRangeString - Date range string like "30.12.2024 - 05.01.2025"
 * @returns True if the ISO date is within the range
 */
export function isIsoDateInRange(
  isoDate: string,
  dateRangeString: string
): boolean {
  const { start, end } = parseDateRangeString(dateRangeString);
  const targetDate = new Date(isoDate);
  return isDateInRange(targetDate, start, end);
}

/**
 * Utility function to format ISO date for display
 * @param isoDate - ISO date string
 * @returns Formatted date string in DD.MM.YYYY format
 */
export { formatDateToDisplay };

// Example usage:
// getDateRangeForPeriod('daily', '2017-06-13T17:07:00.000Z') → "13.06.2017"
// getDateRangeForPeriod('weekly', '2017-06-13T17:07:00.000Z') → "12.06.2017 - 18.06.2017"
// getDateRangeForPeriod('monthly', '2017-06-13T17:07:00.000Z') → "01.06.2017 - 30.06.2017"
// getDateRangeForPeriod('yearly', '2017-06-13T17:07:00.000Z') → "2017"
// checkDatePeriod('weekly', '30.12.2024 - 05.01.2025')
// isIsoDateInRange('2017-06-13T17:07:00.000Z', '30.12.2024 - 05.01.2025')
