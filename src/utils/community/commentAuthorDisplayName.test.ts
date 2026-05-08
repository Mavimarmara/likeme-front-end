import {
  resolveCommentAuthorDisplayName,
  resolveOptimisticCommentAuthorLabel,
} from '@/utils/community/commentAuthorDisplayName';

describe('resolveCommentAuthorDisplayName', () => {
  it('prioriza firstName + lastName', () => {
    expect(resolveCommentAuthorDisplayName({ firstName: 'Ana', lastName: 'Silva', displayName: 'ignored' }, 'x')).toBe(
      'Ana Silva',
    );
  });

  it('aceita givenName + familyName (Amity)', () => {
    expect(resolveCommentAuthorDisplayName({ givenName: 'João', familyName: 'Costa' }, 'y')).toBe('João Costa');
  });

  it('usa displayName quando não há nome composto', () => {
    expect(resolveCommentAuthorDisplayName({ displayName: 'Equipe LIKE' }, 'z')).toBe('Equipe LIKE');
  });

  it('usa fallback de userId quando não há nome', () => {
    expect(resolveCommentAuthorDisplayName({}, 'abc12345')).toBe('User abc12345');
  });
});

describe('resolveOptimisticCommentAuthorLabel', () => {
  it('divide name em primeiro + resto', () => {
    expect(resolveOptimisticCommentAuthorLabel({ email: 'a@b.c', name: 'Maria Souza Lima' })).toBe('Maria Souza Lima');
  });

  it('nome único mantém o nome', () => {
    expect(resolveOptimisticCommentAuthorLabel({ email: 'a@b.c', name: 'Cher' })).toBe('Cher');
  });

  it('sem dados usa Você', () => {
    expect(resolveOptimisticCommentAuthorLabel(null)).toBe('Você');
  });
});
