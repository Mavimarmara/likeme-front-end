import { CommonActions } from '@react-navigation/native';
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { GA4_EVENTS, logEvent, ANALYTICS_PARAMS } from '@/analytics';
import { SHARE_CONTENT_TYPES } from '@/constants/share';
import type { RootStackParamList } from '@/types/navigation';
import { consumePendingDeepLinkNavigation } from '@/utils/navigation/pendingDeepLinkNavigation';
import {
  communityPostDeepLinkTargetFromUrl,
  communityPostIdFromSharePath,
  communityPostIdFromShareUrl,
  flushPendingDeepLinkNavigation,
  openDeepLinkTarget,
} from '@/utils/share/communityPostShareDeepLink';

jest.mock('@/analytics', () => ({
  GA4_EVENTS: { SELECT_CONTENT: 'select_content' },
  ANALYTICS_PARAMS: {
    CONTENT_TYPE: 'content_type',
    ITEM_ID: 'item_id',
    ACTION_NAME: 'action_name',
  },
  logEvent: jest.fn(),
}));

const POST_TARGET = {
  screen: 'Community',
  params: {
    screen: 'PostDetail',
    params: { postId: 'post-xyz' },
  },
} as const;

function createNavigationRef(isReady = true) {
  return {
    isReady: () => isReady,
    dispatch: jest.fn(),
  } as unknown as NavigationContainerRefWithCurrent<RootStackParamList>;
}

describe('communityPostIdFromSharePath', () => {
  it('extrai postId de path com ou sem barra inicial', () => {
    expect(communityPostIdFromSharePath('/post/post-xyz')).toBe('post-xyz');
    expect(communityPostIdFromSharePath('post/post-xyz')).toBe('post-xyz');
  });

  it('decodifica postId na URL', () => {
    expect(communityPostIdFromSharePath('/post/post%2Fwith%2Fslash')).toBe('post/with/slash');
  });

  it('ignora paths desconhecidos', () => {
    expect(communityPostIdFromSharePath('/product/abc')).toBeNull();
    expect(communityPostIdFromSharePath('/post/')).toBeNull();
  });
});

describe('communityPostIdFromShareUrl', () => {
  it('extrai postId de URL https', () => {
    expect(communityPostIdFromShareUrl('https://likeme-back-end-one.vercel.app/post/post-xyz')).toBe('post-xyz');
  });

  it('aceita path sem scheme', () => {
    expect(communityPostIdFromShareUrl('/post/post-abc')).toBe('post-abc');
  });

  it('ignora custom scheme e URLs vazias', () => {
    expect(communityPostIdFromShareUrl('likeme://post/abc123')).toBeNull();
    expect(communityPostIdFromShareUrl('   ')).toBeNull();
  });
});

describe('communityPostDeepLinkTargetFromUrl', () => {
  it('resolve URL https do Universal Link', () => {
    expect(communityPostDeepLinkTargetFromUrl('https://likeme-back-end-one.vercel.app/post/post-xyz')).toEqual(
      POST_TARGET,
    );
  });

  it('ignora custom scheme (somente Universal/App Link)', () => {
    expect(communityPostDeepLinkTargetFromUrl('likeme://post/abc123')).toBeNull();
  });

  it('ignora paths desconhecidos', () => {
    expect(communityPostDeepLinkTargetFromUrl('https://likeme-back-end-one.vercel.app/product/abc')).toBeNull();
  });
});

describe('openDeepLinkTarget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consumePendingDeepLinkNavigation();
  });

  it('navega quando app está pronto e rota permite deep link', () => {
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

  it('enfileira destino enquanto rota de bootstrap está ativa', () => {
    const navigationRef = createNavigationRef();

    openDeepLinkTarget(navigationRef, 'https://likeme-back-end-one.vercel.app/post/post-xyz', 'Loading');

    expect(navigationRef.dispatch).not.toHaveBeenCalled();
    expect(consumePendingDeepLinkNavigation()).toEqual(POST_TARGET);
  });

  it('ignora URL inválida ou navigation não pronta', () => {
    const navigationRef = createNavigationRef(false);

    openDeepLinkTarget(navigationRef, 'https://example.com/product/1', 'Main');
    openDeepLinkTarget(navigationRef, 'https://likeme-back-end-one.vercel.app/post/post-xyz', 'Main');

    expect(logEvent).not.toHaveBeenCalled();
    expect(navigationRef.dispatch).not.toHaveBeenCalled();
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
