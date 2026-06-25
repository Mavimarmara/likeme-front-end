export const CATEGORY_NAMES = {
  activity: 'Atividade',
  connection: 'Conexão',
  environment: 'Ambiente',
  nutrition: 'Nutrição',
  'purpose-vision': 'Propósito e visão',
  'self-esteem': 'Autoestima',
  sleep: 'Sono',
  smile: 'Sorriso',
  spirituality: 'Espiritualidade',
  stress: 'Estresse',
} as const;

export type CategoryName = keyof typeof CATEGORY_NAMES;

export type CategoryDisplayName = (typeof CATEGORY_NAMES)[CategoryName];

const CATEGORY_ALIASES: Record<CategoryName, readonly string[]> = {
  activity: ['activity', 'Atividade', 'Movimento', 'Move more'],
  connection: ['connection', 'Conexão', 'Relacionamento', 'Find a comunity', 'Find a community'],
  environment: ['environment', 'Ambiente', 'Find wellbeing programs'],
  nutrition: ['nutrition', 'Nutrição', 'Eat better'],
  'purpose-vision': ['purpose-vision', 'Propósito', 'Propósito e visão', 'Purpose & vision', 'Get to know me better'],
  'self-esteem': ['self-esteem', 'Autoestima', 'Improve my habits'],
  sleep: ['sleep', 'Sono', 'Improve my sleep'],
  smile: ['smile', 'Sorriso', 'Saúde bucal', 'Buy health products'],
  spirituality: ['spirituality', 'Espiritualidade', 'Track my mood'],
  stress: ['stress', 'Estresse', 'Gain insights on my wellbeing'],
};

function normalizeCategoryLookupValue(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function categoryLookupKeys(value: string): string[] {
  const rawValue = value.toLowerCase().trim();
  const normalizedValue = normalizeCategoryLookupValue(value);
  const keys = new Set<string>();

  for (const candidate of [rawValue, normalizedValue]) {
    const spacedKey = candidate.replace(/\s+/g, ' ');
    keys.add(spacedKey);
    keys.add(spacedKey.replace(/\s+/g, '-'));
  }

  return Array.from(keys);
}

function buildNameToCategoryId(): Record<string, CategoryName> {
  const nameToCategoryId: Partial<Record<string, CategoryName>> = {};

  for (const [categoryId, aliases] of Object.entries(CATEGORY_ALIASES) as [CategoryName, readonly string[]][]) {
    for (const alias of aliases) {
      for (const key of categoryLookupKeys(alias)) {
        nameToCategoryId[key] = categoryId;
      }
    }
  }

  return nameToCategoryId as Record<string, CategoryName>;
}

/** Mapeia categoryId ou nome da API para o id canônico da categoria (para ícone e label). */
export const NAME_TO_CATEGORY_ID = buildNameToCategoryId();

export function categoryApiNameToCategoryId(name: string): CategoryName | null {
  for (const key of categoryLookupKeys(name)) {
    if (NAME_TO_CATEGORY_ID[key]) return NAME_TO_CATEGORY_ID[key];
  }

  return null;
}
