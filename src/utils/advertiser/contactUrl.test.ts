import { resolveAdvertiserContactUrl } from './contactUrl';
import type { Contact } from '@/types/contact';

const contact = (type: Contact['type'], value: string): Contact => ({ type, value });

describe('resolveAdvertiserContactUrl', () => {
  it('bloqueia URL externa em contato Instagram', () => {
    expect(resolveAdvertiserContactUrl(contact('instagram', 'https://evil.example/login'))).toBeNull();
  });

  it('permite URL do Instagram e normaliza handle', () => {
    expect(resolveAdvertiserContactUrl(contact('instagram', 'https://instagram.com/likeme'))).toBe(
      'https://instagram.com/likeme',
    );
    expect(resolveAdvertiserContactUrl(contact('instagram', '@likeme'))).toBe('https://instagram.com/likeme');
  });

  it('bloqueia URL externa em contato WhatsApp sem telefone', () => {
    expect(resolveAdvertiserContactUrl(contact('whatsapp', 'https://evil.example/support'))).toBeNull();
  });

  it('gera link wa.me para telefone de WhatsApp', () => {
    expect(resolveAdvertiserContactUrl(contact('whatsapp', '+55 (11) 99999-0000'))).toBe(
      'https://wa.me/5511999990000',
    );
  });
});
