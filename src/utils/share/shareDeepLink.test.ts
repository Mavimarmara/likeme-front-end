import { CommonActions } from '@react-navigation/native';
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { GA4_EVENTS, logEvent, ANALYTICS_PARAMS } from '@/analytics';
import { SHARE_CONTENT_TYPES } from '@/constants/share';
import type { RootStackParamList } from '@/types/navigation';
import { consumePendingDeepLinkNavigation } from '@/utils/navigation/pendingDeepLinkNavigation';
import { shareEntityIdFromPath, sharePathFromUrl } from '@/utils/share/sharePath';
import {
  flushPendingDeepLinkNavigation,
  openDeepLinkTarget,
  shareDeepLinkTargetFromUrl,
} from '@/utils/share/shareDeepLink';

jest.mock('@/analytics', () => ({
  GA4_EVENTS: { SELECT_CONTENT: 'select_content' },
  ANALYTICS_PARAMS: {
    CONTENT_TYPE: 'content_type',
    ITEM_ID: 'item_id',
    ACTION_NAME: 'action_name',
  },
  logEvent: jest.fn(),
}));

jest.mock('@/config/environment', () => ({
  SHARE_CONFIG: {
    baseUrl: 'https://likeme-back-end-one.vercel.app',
  },
}));

const POST_TARGET = {
  screen: 'Community',
  params: {
    screen: 'PostDetail',
    params: { postId: 'post-xyz' },
  },
} as const;

const COMMUNITY_TARGET = {
  screen: 'Community',
  params: {
    screen: 'CommunityList',
    params: { focusCommunityId: 'community-abc' },
  },
} as const;

const HOME_TARGET = { screen: 'Summary' } as const;

const SHARE_BASE_URL = 'https://likeme-back-end-one.vercel.app';

function createNavigationRef(isReady = true) {
  return {
    isReady: () => isReady,
    dispatch: jest.fn(),
  } as unknown as NavigationContainerRefWithCurrent<RootStackParamList>;
}

describe('sharePathFromUrl', () => {
  it('extrai pathname de URL https', () => {
    expect(sharePathFromUrl('https://likeme-back-end-one.vercel.app/post/post-xyz')).toBe('/post/post-xyz');
  });

  it('aceita path sem scheme', () => {
    expect(sharePathFromUrl('/post/post-abc')).toBe('/post/post-abc');
  });

  it('ignora custom scheme e URLs vazias', () => {
    expect(sharePathFromUrl('likeme://post/abc123')).toBeNull();
    expect(sharePathFromUrl('   ')).toBeNull();
  });
});

describe('shareEntityIdFromPath', () => {
  it('extrai id de path com ou sem barra inicial', () => {
    expect(shareEntityIdFromPath('/post/post-xyz', '/post')).toBe('post-xyz');
    expect(shareEntityIdFromPath('post/post-xyz', '/post')).toBe('post-xyz');
  });

  it('decodifica id na URL', () => {
    expect(shareEntityIdFromPath('/post/post%2Fwith%2Fslash', '/post')).toBe('post/with/slash');
  });

  it('ignora paths desconhecidos', () => {
    expect(shareEntityIdFromPath('/product/abc', '/post')).toBeNull();
    expect(shareEntityIdFromPath('/post/', '/post')).toBeNull();
  });
});

describe('shareDeepLinkTargetFromUrl', () => {
  it('resolve post via Universal Link', () => {
    expect(shareDeepLinkTargetFromUrl('https://likeme-back-end-one.vercel.app/post/post-xyz')).toEqual(POST_TARGET);
  });

  it('resolve comunidade via Universal Link', () => {
    expect(shareDeepLinkTargetFromUrl('https://likeme-back-end-one.vercel.app/community/community-abc')).toEqual(
      COMMUNITY_TARGET,
    );
  });

  it('ignora custom scheme (somente Universal/App Link)', () => {
    expect(shareDeepLinkTargetFromUrl('likeme://post/abc123')).toBeNull();
  });

  it('ignora paths desconhecidos', () => {
    expect(shareDeepLinkTargetFromUrl('https://likeme-back-end-one.vercel.app/product/abc')).toBeNull();
  });
});

describe('openDeepLinkTarget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consumePendingDeepLinkNavigation();
  });

  it('navega para post quando app está pronto', () => {
    const navigationRef = createNavigationRef();

    openDeepLinkTarget(navigationRef, 'https://likeme-back-end-one.vercel.app/post/post-xyz', 'Main');

    expect(logEvent).toHaveBeenCalledWith(GA4_EVENTS.SELECT_CONTENT, {
      [ANALYTICS_PARAMS.CONTENT_TYPE]: SHARE_CONTENT_TYPES.COMMUNITY_POST,
      [ANALYTICS_PARAMS.ITEM_ID]: 'post-xyz',
      [ANALYTICS_PARAMS.ACTION_NAME]: 'deep_link_open',
    });
    expect(navigationRef.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate({
        name: 'Community',
        params: POST_TARGET.params,
      }),
    );
    expect(consumePendingDeepLinkNavigation()).toBeNull();
  });

  it('navega para feed da comunidade quando app está pronto', () => {
    const navigationRef = createNavigationRef();

    openDeepLinkTarget(navigationRef, 'https://likeme-back-end-one.vercel.app/community/community-abc', 'Main');

    expect(logEvent).toHaveBeenCalledWith(GA4_EVENTS.SELECT_CONTENT, {
      [ANALYTICS_PARAMS.CONTENT_TYPE]: SHARE_CONTENT_TYPES.COMMUNITY,
      [ANALYTICS_PARAMS.ITEM_ID]: 'community-abc',
      [ANALYTICS_PARAMS.ACTION_NAME]: 'deep_link_open',
    });
    expect(navigationRef.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate({
        name: 'Community',
        params: COMMUNITY_TARGET.params,
      }),
    );
  });

  it('enfileira destino enquanto rota de bootstrap está ativa', () => {
    const navigationRef = createNavigationRef();

    openDeepLinkTarget(navigationRef, 'https://likeme-back-end-one.vercel.app/post/post-xyz', 'Loading');

    expect(navigationRef.dispatch).not.toHaveBeenCalled();
    expect(consumePendingDeepLinkNavigation()).toEqual(POST_TARGET);
  });

  it('ignora URL inválida, outro host ou navigation não pronta', () => {
    const navigationRef = createNavigationRef(false);

    openDeepLinkTarget(navigationRef, 'https://example.com/product/1', 'Main');
    openDeepLinkTarget(navigationRef, `${SHARE_BASE_URL}/post/post-xyz`, 'Main');

    expect(logEvent).not.toHaveBeenCalled();
    expect(navigationRef.dispatch).not.toHaveBeenCalled();
  });

  it('redireciona para Summary quando path do domínio de share é desconhecido', () => {
    const navigationRef = createNavigationRef();

    openDeepLinkTarget(navigationRef, `${SHARE_BASE_URL}/product/abc`, 'Main');

    expect(logEvent).toHaveBeenCalledWith(GA4_EVENTS.SELECT_CONTENT, {
      [ANALYTICS_PARAMS.CONTENT_TYPE]: 'unknown',
      [ANALYTICS_PARAMS.ITEM_ID]: '/product/abc',
      [ANALYTICS_PARAMS.ACTION_NAME]: 'deep_link_fallback_home',
    });
    expect(navigationRef.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate({
        name: 'Summary',
      }),
    );
  });

  it('enfileira Summary como fallback enquanto bootstrap está ativo', () => {
    const navigationRef = createNavigationRef();

    openDeepLinkTarget(navigationRef, `${SHARE_BASE_URL}/unknown/path`, 'Loading');

    expect(navigationRef.dispatch).not.toHaveBeenCalled();
    expect(consumePendingDeepLinkNavigation()).toEqual(HOME_TARGET);
  });
});

describe('flushPendingDeepLinkNavigation', () => {
  beforeEach(() => {
    consumePendingDeepLinkNavigation();
  });

  it('navega quando há destino pendente e rota permite', () => {
    const navigationRef = createNavigationRef();

    openDeepLinkTarget(navigationRef, 'https://likeme-back-end-one.vercel.app/post/post-xyz', 'Loading');

    flushPendingDeepLinkNavigation(navigationRef, 'Main');

    expect(navigationRef.dispatch).toHaveBeenCalledWith(
      CommonActions.navigate({
        name: 'Community',
        params: POST_TARGET.params,
      }),
    );
    expect(consumePendingDeepLinkNavigation()).toBeNull();
  });

  it('não navega enquanto rota ainda bloqueia deep link', () => {
    const navigationRef = createNavigationRef();

    openDeepLinkTarget(navigationRef, 'https://likeme-back-end-one.vercel.app/post/post-xyz', 'Loading');

    flushPendingDeepLinkNavigation(navigationRef, 'Loading');

    expect(navigationRef.dispatch).not.toHaveBeenCalled();
    expect(consumePendingDeepLinkNavigation()).toEqual(POST_TARGET);
  });
});
