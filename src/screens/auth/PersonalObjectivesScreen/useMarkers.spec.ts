import { markerIdToObjectiveName, objectiveNameToMarkerId } from './useMarkers';

describe('useMarkers objective mapping', () => {
  it('mapeia nomes do catálogo do backend para marcadores do onboarding', () => {
    expect(objectiveNameToMarkerId('Improve my sleep')).toBe('sleep');
    expect(objectiveNameToMarkerId('Move more')).toBe('activity');
    expect(objectiveNameToMarkerId('Gain insights on my wellbeing')).toBe('stress');
    expect(objectiveNameToMarkerId('Buy health products')).toBe('smile');
    expect(objectiveNameToMarkerId('Eat better')).toBe('nutrition');
  });

  it('mapeia marcadores do onboarding para nomes do catálogo do backend', () => {
    expect(markerIdToObjectiveName('sleep')).toBe('Improve my sleep');
    expect(markerIdToObjectiveName('activity')).toBe('Move more');
    expect(markerIdToObjectiveName('nutrition')).toBe('Eat better');
    expect(markerIdToObjectiveName('stress')).toBe('Gain insights on my wellbeing');
  });

  it('retorna null para marcador desconhecido', () => {
    expect(markerIdToObjectiveName('invalido')).toBeNull();
  });
});
