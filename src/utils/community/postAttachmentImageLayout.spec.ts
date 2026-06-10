import { postImageGridLayout, postImageGridMoreCount } from './postAttachmentImageLayout';

describe('postAttachmentImageLayout', () => {
  it('define layout conforme quantidade de imagens', () => {
    expect(postImageGridLayout(1)).toBe('single');
    expect(postImageGridLayout(2)).toBe('pair');
    expect(postImageGridLayout(3)).toBe('triple');
    expect(postImageGridLayout(4)).toBe('quad');
    expect(postImageGridLayout(9)).toBe('quad');
  });

  it('calcula overlay +N apenas acima de 4 imagens', () => {
    expect(postImageGridMoreCount(4)).toBeNull();
    expect(postImageGridMoreCount(5)).toBe(1);
    expect(postImageGridMoreCount(10)).toBe(6);
  });
});
