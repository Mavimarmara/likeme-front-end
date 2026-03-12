import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { CTACard } from '@/components/ui/cards';
import ProductItemCard from '@/components/ui/cards/ProductItemCard';
import { ToggleTabs } from '@/components/ui/tabs';
import { FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { useTranslation } from '@/hooks/i18n';
import { formatPrice } from '@/utils';
import type { Product } from '@/components/sections/product/ProductCard';
import { styles } from './styles';

type SolutionTab = 'products' | 'services' | 'professionals' | 'programs';
type OrderTab = 'default' | 'best' | 'above100';

type Props = {
  products: Product[];
  onProductPress?: (product: Product) => void;
  onProductLike?: (product: Product) => void;
};

const ShoppingList: React.FC<Props> = ({ products, onProductPress, onProductLike: _onProductLike }) => {
  const { t } = useTranslation();
  const [activeSolution, setActiveSolution] = useState<SolutionTab>('products');
  const [activeOrder, setActiveOrder] = useState<OrderTab>('default');

  const productsWithProgramTag = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        // No layout de Figma, todos os cards são programas
        tag: t('filterCategory.solutions.programs'),
      })),
    [products, t],
  );

  const orderedProducts = useMemo(() => {
    let list = [...productsWithProgramTag];

    if (activeOrder === 'above100') {
      list = list.filter((p) => (p.price ?? 0) >= 100);
    }

    if (activeOrder === 'best') {
      list = list.slice().sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    }

    return list;
  }, [productsWithProgramTag, activeOrder]);

  const orderOptions: ButtonCarouselOption<OrderTab>[] = useMemo(
    () => [
      { id: 'default', label: t('marketplace.orderBy') },
      { id: 'best', label: t('marketplace.bestRated') },
      { id: 'above100', label: t('marketplace.above100') },
    ],
    [t],
  );

  if (!products || products.length === 0) {
    return null;
  }

  const solutionTabs: { id: SolutionTab; label: string }[] = [
    { id: 'products', label: t('filterCategory.solutions.products') },
    { id: 'services', label: t('filterCategory.solutions.services') },
    { id: 'professionals', label: t('filterCategory.solutions.professionals') },
    { id: 'programs', label: t('filterCategory.solutions.programs') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.sectionTitle}>{t('community.shoppingTitle')}</Text>
        <Text style={styles.sectionSubtitle}>{t('community.shoppingSubtitle')}</Text>
      </View>

      <CTACard
        title={t('community.ctaCardTitle')}
        description={t('community.ctaCardDescription')}
        backgroundColor='#F6DEA9'
        titleStyle={styles.ctaCardTitle}
        style={styles.ctaCard}
      />

      <ToggleTabs
        tabs={solutionTabs.map((tab) => ({ id: tab.id, label: tab.label }))}
        selectedId={activeSolution}
        onSelect={(id) => setActiveSolution(id as SolutionTab)}
        containerStyle={styles.solutionsTabsRow}
        fixedWidth={false}
      />

      <View style={styles.orderRow}>
        <FilterMenu
          filterButtonLabel={t('marketplace.orderBy')}
          onFilterButtonPress={() => undefined}
          carouselOptions={orderOptions}
          selectedCarouselId={activeOrder}
          onCarouselSelect={(id) => setActiveOrder(id)}
        />
      </View>

      <View style={styles.list}>
        {orderedProducts.map((product) => (
          <View key={product.id} style={styles.cardWrapper}>
            <ProductItemCard
              image={product.image}
              title={product.title}
              badges={[product.tag]}
              price={product.price ?? undefined}
              onPress={() => onProductPress?.(product)}
              onAddPress={() => onProductPress?.(product)}
              showAddButton={false}
              formatPrice={formatPrice}
              subtitle={undefined}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ShoppingList;
