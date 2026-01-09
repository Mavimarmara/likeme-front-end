export class DateFormatter {
  private readonly date: Date;

  constructor(date: Date | string | number) {
    this.date = new Date(date);
  }

  toShortDate(): string {
    return this.date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short' 
    });
  }

  toLongDate(): string {
    return this.date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  toTime(): string {
    return this.date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  toDateTime(): string {
    return `${this.toShortDate()} at ${this.toTime()}`;
  }

  getDate(): Date {
    return this.date;
  }

  isValid(): boolean {
    return !isNaN(this.date.getTime());
  }
}

export const formatDate = (date: Date | string | number): string => {
  return new DateFormatter(date).toShortDate();
};

export const formatDateTime = (date: Date | string | number): string => {
  return new DateFormatter(date).toDateTime();
};

/**
 * Extrai a parte da data de uma string datetime no formato "13 Nov. at 8:15 pm"
 * @param dateTime - String no formato "13 Nov. at 8:15 pm" ou similar
 * @returns String no formato YYYY-MM-DD ou data atual se não conseguir parsear
 */
export const getDateFromDatetime = (dateTime: string): string => {
  try {
    const parts = dateTime.split(' at ');
    if (parts.length > 0) {
      const datePart = parts[0]; // "13 Nov."
      const [day, month] = datePart.split(' ');
      const monthMap: Record<string, string> = {
        'Jan.': '01', 'Feb.': '02', 'Mar.': '03', 'Apr.': '04',
        'May.': '05', 'Jun.': '06', 'Jul.': '07', 'Aug.': '08',
        'Sep.': '09', 'Oct.': '10', 'Nov.': '11', 'Dec.': '12',
      };
      const currentYear = new Date().getFullYear();
      const monthNum = monthMap[month] || '01';
      return `${currentYear}-${monthNum}-${day.padStart(2, '0')}`;
    }
  } catch (e) {
    console.error('Error parsing date from datetime:', e);
  }
  return new Date().toISOString().split('T')[0];
};

/**
 * Extrai a parte do tempo de uma string datetime no formato "13 Nov. at 8:15 pm"
 * @param dateTime - String no formato "13 Nov. at 8:15 pm" ou similar
 * @returns String com o tempo (ex: "8:15 pm") ou "8:00 am" como padrão
 */
export const getTimeFromDatetime = (dateTime: string): string => {
  try {
    const parts = dateTime.split(' at ');
    if (parts.length > 1) {
      return parts[1]; // "8:15 pm"
    }
  } catch (e) {
    console.error('Error parsing time from datetime:', e);
  }
  return '8:00 am';
};
