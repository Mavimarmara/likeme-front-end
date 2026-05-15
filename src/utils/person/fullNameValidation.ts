/** Alinhado a `createPersonSchema` no backend (firstName/lastName min 2). */
export const PERSON_NAME_MIN_LENGTH = 2;

export const FULL_NAME_REGEX = /^[\p{L}\s]+$/u;

export type ParsedFullName = {
  firstName: string;
  lastName: string;
};

export type FullNameValidationIssue = 'empty' | 'invalid_chars' | 'missing_surname' | 'part_too_short';

export function parseFullName(fullName: string): ParsedFullName {
  const nameParts = fullName.trim().split(/\s+/);
  return {
    firstName: nameParts[0] ?? '',
    lastName: nameParts.slice(1).join(' '),
  };
}

export function validateFullNameForPerson(fullName: string): FullNameValidationIssue | null {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return 'empty';
  }
  if (!FULL_NAME_REGEX.test(trimmed)) {
    return 'invalid_chars';
  }

  const { firstName, lastName } = parseFullName(trimmed);
  if (!lastName) {
    return 'missing_surname';
  }
  if (firstName.length < PERSON_NAME_MIN_LENGTH || lastName.length < PERSON_NAME_MIN_LENGTH) {
    return 'part_too_short';
  }

  return null;
}
