import { isZoomJoinUrl } from '@/utils/event/isZoomJoinUrl';

describe('isZoomJoinUrl', () => {
  it('aceita link /j/ com 8–15 dígitos (alinhado ao backend)', () => {
    expect(isZoomJoinUrl('https://us02web.zoom.us/j/123456789')).toBe(true);
    expect(isZoomJoinUrl('https://us02web.zoom.us/j/123456789012')).toBe(true);
  });

  it('aceita /wc/join/', () => {
    expect(isZoomJoinUrl('https://zoom.us/wc/join/1122334455')).toBe(true);
  });

  it('rejeita id curto demais', () => {
    expect(isZoomJoinUrl('https://zoom.us/j/12345')).toBe(false);
  });

  it('aceita j?confno=', () => {
    expect(isZoomJoinUrl('https://zoom.us/j?confno=1122334455')).toBe(true);
  });

  it('aceita host regional sem https (mesma heurística do backend após normalizar)', () => {
    expect(isZoomJoinUrl('us02web.zoom.us/j/123456789')).toBe(true);
  });
});
