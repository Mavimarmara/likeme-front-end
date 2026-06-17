export const PRODUCT_CATALOG_TYPE = {
  AMAZON: 'amazon product',
  PHYSICAL: 'physical product',
  PROGRAM: 'program',
  SERVICE: 'service',
} as const;

export type ProductCatalogType = (typeof PRODUCT_CATALOG_TYPE)[keyof typeof PRODUCT_CATALOG_TYPE];

export interface ProductCatalogTypeOption {
  id: ProductCatalogType;
  labelKey: string;
}

export const productCatalogTypeOptions: readonly ProductCatalogTypeOption[] = [
  { id: PRODUCT_CATALOG_TYPE.AMAZON, labelKey: 'marketplace.productCatalogType.amazonProduct' },
  { id: PRODUCT_CATALOG_TYPE.PHYSICAL, labelKey: 'marketplace.productCatalogType.physicalProduct' },
  { id: PRODUCT_CATALOG_TYPE.PROGRAM, labelKey: 'marketplace.productCatalogType.program' },
  { id: PRODUCT_CATALOG_TYPE.SERVICE, labelKey: 'marketplace.productCatalogType.service' },
] as const;

export const PRODUCT_CATALOG_TYPE_VALUES: readonly ProductCatalogType[] = productCatalogTypeOptions.map(
  (option) => option.id,
);

export const PRODUCT_CATALOG_TYPES_WITHOUT_SHIPPING: readonly ProductCatalogType[] = [
  PRODUCT_CATALOG_TYPE.PROGRAM,
  PRODUCT_CATALOG_TYPE.SERVICE,
];

export function getProductCatalogTypeLabelKey(
  catalogType: ProductCatalogType | string | undefined | null,
): string | undefined {
  if (catalogType == null || catalogType === '') {
    return undefined;
  }
  return productCatalogTypeOptions.find((option) => option.id === catalogType)?.labelKey;
}

const PRODUCT_CATALOG_TYPE_VALUE_SET = new Set<string>(PRODUCT_CATALOG_TYPE_VALUES);

export function isProductCatalogType(value: string | undefined | null): value is ProductCatalogType {
  return value != null && value !== '' && PRODUCT_CATALOG_TYPE_VALUE_SET.has(value);
}

export function isProgramCatalogType(value: string | undefined | null): boolean {
  if (value == null || value === '') {
    return false;
  }
  if (value === PRODUCT_CATALOG_TYPE.PROGRAM) {
    return true;
  }
  return value.trim().toLowerCase() === PRODUCT_CATALOG_TYPE.PROGRAM;
}

export function catalogTypeTranslatedBadgeLabels(
  catalogType: ProductCatalogType | string | undefined | null,
  translate: (key: string) => string,
): string[] {
  const labelKey = getProductCatalogTypeLabelKey(catalogType);
  if (!labelKey) {
    return [];
  }
  const text = translate(labelKey).trim();
  return text ? [text] : [];
}

/** Reconcilia `type` persistido / legado (`tags` com valor de catálogo). */
export function resolveCartItemCatalogType(raw: {
  type?: string | null;
  tags?: unknown;
}): ProductCatalogType | undefined {
  if (isProductCatalogType(raw.type ?? undefined)) {
    return raw.type as ProductCatalogType;
  }
  if (Array.isArray(raw.tags)) {
    for (const entry of raw.tags) {
      if (typeof entry === 'string' && isProductCatalogType(entry)) {
        return entry;
      }
    }
  }
  return undefined;
}
