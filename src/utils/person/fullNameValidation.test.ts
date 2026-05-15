import { parseFullName, validateFullNameForPerson } from '@/utils/person/fullNameValidation';

describe('validateFullNameForPerson', () => {
  it('aceita nome e sobrenome com pelo menos 2 caracteres cada', () => {
    expect(validateFullNameForPerson('Maria Silva')).toBeNull();
    expect(validateFullNameForPerson('João da Silva')).toBeNull();
  });

  it('rejeita nome com uma palavra só', () => {
    expect(validateFullNameForPerson('Maria')).toBe('missing_surname');
    expect(validateFullNameForPerson('John')).toBe('missing_surname');
  });

  it('rejeita parte com menos de 2 caracteres', () => {
    expect(validateFullNameForPerson('João A')).toBe('part_too_short');
    expect(validateFullNameForPerson('Li Silva')).toBeNull();
  });

  it('rejeita caracteres inválidos', () => {
    expect(validateFullNameForPerson('Maria123')).toBe('invalid_chars');
  });
});

describe('parseFullName', () => {
  it('divide primeiro token e o restante como sobrenome', () => {
    expect(parseFullName('Maria Silva Santos')).toEqual({
      firstName: 'Maria',
      lastName: 'Silva Santos',
    });
  });
});
