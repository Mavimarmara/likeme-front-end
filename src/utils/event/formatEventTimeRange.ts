function normalizeRawTime(value: string): string {
  return value.trim();
}

export function formatEventTime(value: string, locale = 'pt-BR'): string {
  const normalizedValue = normalizeRawTime(value);
  if (!normalizedValue) {
    return '';
  }

  const parsedDate = new Date(normalizedValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return normalizedValue;
  }

  return parsedDate.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatEventTimeRange(startTime: string, endTime: string, locale = 'pt-BR'): string {
  const formattedStartTime = formatEventTime(startTime, locale);
  const formattedEndTime = formatEventTime(endTime, locale);

  if (formattedStartTime && formattedEndTime) {
    return `${formattedStartTime} - ${formattedEndTime}`;
  }

  return formattedStartTime || formattedEndTime;
}
