import { supportFloatingBottomOffset } from '@/utils/layout/supportFloatingBottomOffset';

describe('supportFloatingBottomOffset', () => {
  it('sobe o suporte acima do composer no PostDetail', () => {
    expect(supportFloatingBottomOffset('PostDetail', false, 34)).toBe(64 + 15);
  });

  it('sobe o suporte acima do menu flutuante', () => {
    expect(supportFloatingBottomOffset('CommunityList', true, 0)).toBe(64 + 15);
  });

  it('usa inset padrão sem barra inferior', () => {
    expect(supportFloatingBottomOffset('CommunityList', false, 34)).toBe(34 + 20);
  });
});
