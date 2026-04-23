type ReportContext = {
  componentStack?: string | null;
};

export function reportUnexpectedError(scope: string, error: unknown, context?: ReportContext): void {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const suffix = context?.componentStack ? `\ncomponentStack:${context.componentStack}` : '';
  console.error(`[${scope}]`, message, stack ?? '', suffix);
}
