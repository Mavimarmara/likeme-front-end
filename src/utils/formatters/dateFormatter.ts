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
