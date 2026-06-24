import {
  markerIdToObjectiveName,
  objectiveNameToMarkerId,
  useInterestCategoryMarkers,
  INTEREST_CATEGORY_MARKERS,
} from './useInterestCategoryMarkers';

describe('useInterestCategoryMarkers', () => {
  it('expõe a lista estável de categorias de interesse', () => {
    const { markers, isLoading, error } = useInterestCategoryMarkers();

    expect(markers).toEqual(INTEREST_CATEGORY_MARKERS);
    expect(markers.length).toBeGreaterThan(0);
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
  });

  it('mapeia nomes do catálogo do backend para marcadores', () => {
    expect(objectiveNameToMarkerId('Improve my sleep')).toBe('sleep');
    expect(objectiveNameToMarkerId('Move more')).toBe('activity');
    expect(objectiveNameToMarkerId('Eat better')).toBe('nutrition');
  });

  it('mapeia marcadores para nomes do catálogo do backend', () => {
    expect(markerIdToObjectiveName('sleep')).toBe('Improve my sleep');
    expect(markerIdToObjectiveName('activity')).toBe('Move more');
    expect(markerIdToObjectiveName('nutrition')).toBe('Eat better');
    expect(markerIdToObjectiveName('stress')).toBe('Gain insights on my wellbeing');
  });

  it('retorna null para marcador desconhecido', () => {
    expect(markerIdToObjectiveName('invalido')).toBeNull();
    expect(objectiveNameToMarkerId('Categoria inexistente')).toBeNull();
  });
});
