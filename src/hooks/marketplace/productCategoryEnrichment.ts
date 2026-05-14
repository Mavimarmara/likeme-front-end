import categoryService from '@/services/category/categoryService';
import { logger } from '@/utils/logger';
import type { Ad } from '@/types/ad';
import type { Product, ProductCategorySummary } from '@/types/product';

export const PRODUCT_LIST_CATEGORY_TAGS_LIMIT = 2;

async function fetchCategoriesByProductIds(productIds: string[]): Promise<Map<string, ProductCategorySummary[]>> {
  const rows = await Promise.all(
    productIds.map(async (productId) => {
      try {
        const res = await categoryService.listProductCategories(productId);
        if (res.success && res.data?.categories?.length) {
          return { productId, categories: res.data.categories };
        }
      } catch (cause) {
        logger.warn('[productCategoryEnrichment] Falha ao carregar categorias do produto', {
          productId,
          cause,
        });
      }
      return { productId, categories: [] as ProductCategorySummary[] };
    }),
  );
  return new Map(rows.map((row) => [row.productId, row.categories]));
}

function mergeCategoryFields(product: Product, summaries: ProductCategorySummary[]): Product {
  const lim = PRODUCT_LIST_CATEGORY_TAGS_LIMIT;
  const namesFromFetch = summaries
    .map((c) => c.name.trim())
    .filter(Boolean)
    .slice(0, lim);
  const idsFromFetch = summaries.slice(0, lim).map((c) => c.id);

  if (namesFromFetch.length > 0) {
    return { ...product, categoryNames: namesFromFetch, categoryIds: idsFromFetch };
  }

  const fallbackNames = (product.categoryNames ?? [])
    .map((n) => (typeof n === 'string' ? n.trim() : ''))
    .filter(Boolean)
    .slice(0, lim);
  const fallbackIds = (product.categoryIds ?? []).slice(0, lim);
  if (fallbackNames.length > 0) {
    return {
      ...product,
      categoryNames: fallbackNames,
      ...(fallbackIds.length > 0 ? { categoryIds: fallbackIds } : {}),
    };
  }
  return product;
}

export async function enrichProductsWithCategoriesFromByProductApi(products: Product[]): Promise<Product[]> {
  if (products.length === 0) {
    return [];
  }
  const map = await fetchCategoriesByProductIds(products.map((p) => p.id));
  return products.map((p) => mergeCategoryFields(p, map.get(p.id) ?? []));
}

export async function enrichAdsProductsWithCategoriesFromByProductApi(ads: Ad[]): Promise<Ad[]> {
  if (ads.length === 0) {
    return ads;
  }
  const idToProduct = new Map<string, Product>();
  for (const ad of ads) {
    const pid = ad.product?.id;
    if (pid) {
      idToProduct.set(pid, ad.product as Product);
    }
  }
  const unique = [...idToProduct.values()];
  const enrichedList = await enrichProductsWithCategoriesFromByProductApi(unique);
  const enrichedById = new Map(enrichedList.map((p) => [p.id, p]));

  return ads.map((ad) => {
    const pid = ad.product?.id;
    if (!pid) {
      return ad;
    }
    const enriched = enrichedById.get(pid);
    if (!enriched || !ad.product) {
      return ad;
    }
    return {
      ...ad,
      product: {
        ...ad.product,
        categoryNames: enriched.categoryNames,
        categoryIds: enriched.categoryIds,
      },
    };
  });
}
