import {
  computeKeyboardInset,
  resolveKeyboardFooterOptions,
  resolveScrollContentPaddingBottom,
} from './keyboardAwareLayout';

describe('computeKeyboardInset', () => {
  it('retorna 0 quando altura do teclado é 0', () => {
    expect(computeKeyboardInset({ keyboardHeight: 0, windowHeight: 800 })).toBe(0);
    expect(computeKeyboardInset({ keyboardHeight: -1, windowHeight: 800 })).toBe(0);
  });

  it('retorna altura quando screenY está ausente ou inválido', () => {
    expect(computeKeyboardInset({ keyboardHeight: 200, windowHeight: 800 })).toBe(200);
    expect(computeKeyboardInset({ keyboardHeight: 200, screenY: 0, windowHeight: 800 })).toBe(200);
    expect(computeKeyboardInset({ keyboardHeight: 200, screenY: 900, windowHeight: 800 })).toBe(200);
  });

  it('usa max(altura, janela - screenY) quando screenY é válido', () => {
    expect(computeKeyboardInset({ keyboardHeight: 180, screenY: 500, windowHeight: 800 })).toBe(300);
    expect(computeKeyboardInset({ keyboardHeight: 350, screenY: 500, windowHeight: 800 })).toBe(350);
  });
});

describe('resolveKeyboardFooterOptions', () => {
  const defaults = {
    translateFooterWithKeyboard: true,
    keyboardFooterLiftExtra: 0,
    includeFooterHeightInKeyboardLift: false,
  };

  it('retorna defaults quando overrides é undefined', () => {
    expect(resolveKeyboardFooterOptions(defaults, undefined)).toEqual(defaults);
  });

  it('aplica overrides sobre defaults', () => {
    expect(
      resolveKeyboardFooterOptions(defaults, {
        translateFooterWithKeyboard: false,
        keyboardFooterLiftExtra: 8,
      }),
    ).toEqual({
      translateFooterWithKeyboard: false,
      keyboardFooterLiftExtra: 8,
      includeFooterHeightInKeyboardLift: false,
    });
  });
});

describe('resolveScrollContentPaddingBottom', () => {
  it('soma inset apenas com footer e teclado visível', () => {
    expect(resolveScrollContentPaddingBottom({ basePaddingBottom: 120, hasFooter: true, keyboardInset: 100 })).toBe(
      220,
    );
    expect(resolveScrollContentPaddingBottom({ basePaddingBottom: 120, hasFooter: false, keyboardInset: 100 })).toBe(
      120,
    );
    expect(resolveScrollContentPaddingBottom({ basePaddingBottom: 120, hasFooter: true, keyboardInset: 0 })).toBe(120);
  });
});
