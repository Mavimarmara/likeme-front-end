import { classifyExternalJoinUrl } from '@/utils/event/classifyExternalJoinUrl';
import type { EventBannerData, EventJoinMode } from '@/types/event';

export function effectiveJoinMode(banner: EventBannerData): EventJoinMode {
  if (banner.joinMode) {
    return banner.joinMode;
  }
  const how = classifyExternalJoinUrl(banner.externalUrl);
  if (how.kind === 'none') {
    return 'none';
  }
  if (how.kind === 'zoom') {
    return 'zoom_sdk';
  }
  return 'external_browser';
}
