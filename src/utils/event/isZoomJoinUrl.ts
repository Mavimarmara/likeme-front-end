const ZOOM_MEETING_JOIN_IN_URL =
  /zoom\.us\/(?:j\/\d{8,15}(?:[?#/]|$)|wc\/j(?:oin)?\/\d{8,15}(?:[?#/]|$)|j\?[^#\s]*confno=\d{8,15})/i;

export const isZoomJoinUrl = (rawUrl: string): boolean => {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return false;
  }
  return ZOOM_MEETING_JOIN_IN_URL.test(trimmed);
};
