export const PRODUCT_CATALOG_TYPE = {
  AMAZON: 'amazon product',
  PHYSICAL: 'physical product',
  PROGRAM: 'program',
} as const;

export type ProductCatalogType = (typeof PRODUCT_CATALOG_TYPE)[keyof typeof PRODUCT_CATALOG_TYPE];

export const PRODUCT_CATALOG_TYPE_VALUES: readonly ProductCatalogType[] = [
  PRODUCT_CATALOG_TYPE.AMAZON,
  PRODUCT_CATALOG_TYPE.PHYSICAL,
  PRODUCT_CATALOG_TYPE.PROGRAM,
];
