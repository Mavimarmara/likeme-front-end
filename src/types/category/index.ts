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

/** Mapeia categoryId ou nome da API para o id canônico da categoria (para ícone e label). */
export const NAME_TO_CATEGORY_ID: Record<string, CategoryName> = {
  stress: 'stress',
  estresse: 'stress',
  connection: 'connection',
  relacionamento: 'connection',
  smile: 'smile',
  'saúde bucal': 'smile',
  nutrition: 'nutrition',
  nutrição: 'nutrition',
  sleep: 'sleep',
  sono: 'sleep',
  spirituality: 'spirituality',
  espiritualidade: 'spirituality',
  'self-esteem': 'self-esteem',
  autoestima: 'self-esteem',
  'purpose-vision': 'purpose-vision',
  propósito: 'purpose-vision',
  environment: 'environment',
  ambiente: 'environment',
  activity: 'activity',
  movimento: 'activity',
};
