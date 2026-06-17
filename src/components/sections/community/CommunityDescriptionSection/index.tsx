import React from 'react';
import { View, Text } from 'react-native';
import { CTACard } from '@/components/ui/cards';
import { PartnerSection } from '@/components/sections/advertiser';
import { COLORS } from '@/constants';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

export type CommunityDescriptionVariant = 'feed' | 'solutions';

/** Dados do parceiro/especialista exibidos acima do feed (alinhado ao que o PartnerSection consome). */
export type CommunityDescriptionSpecialist = {
  name: string;
  subtitle?: string;
  tags?: string[];
  avatarUri?: string | null;
};

export type CommunityDescriptionSectionProps = {
  variant: CommunityDescriptionVariant;
  specialist?: CommunityDescriptionSpecialist | null;
  welcomeDismissed?: boolean;
  onWelcomeClose?: () => void;
  shoppingTipDismissed?: boolean;
  onShoppingTipClose?: () => void;
};

const CommunityDescriptionSection: React.FC<CommunityDescriptionSectionProps> = ({
  variant,
  specialist,
  welcomeDismissed = true,
  onWelcomeClose,
  shoppingTipDismissed = true,
  onShoppingTipClose,
}) => {
  const { t } = useTranslation();

  const specialistBlock =
    specialist != null ? (
      <View style={[styles.specialistBlock, variant === 'solutions' && styles.specialistBlockCompact]}>
        <PartnerSection
          name={specialist.name}
          avatar={specialist.avatarUri ?? undefined}
          specialistLabel={specialist.subtitle?.trim() || t('community.specialistLabel')}
        />
      </View>
    ) : null;

  if (variant === 'feed') {
    return (
      <>
        {!welcomeDismissed ? (
          <View style={styles.welcomeCtaWrap}>
            <CTACard
              title={t('community.ctaCardTitle')}
              description={t('community.ctaCardDescription')}
              backgroundColor='#F6CFFB'
              titleStyle={styles.welcomeCtaTitle}
              style={styles.welcomeCtaCard}
              onClose={onWelcomeClose}
            />
          </View>
        ) : null}
        {specialistBlock}
      </>
    );
  }

  return (
    <>
      {!shoppingTipDismissed && (
        <View style={styles.shoppingTipContainer}>
          <CTACard backgroundColor={COLORS.HIGHLIGHT.LIGHT} style={styles.shoppingTip} onClose={onShoppingTipClose}>
            <Text style={styles.shoppingTipTitle}>{t('community.shoppingTipTitle')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipIntro')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipBullet1')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipBullet2')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipBullet3')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipBullet4')}</Text>
            <Text style={styles.shoppingTipDescription}>{t('community.shoppingTipBullet5')}</Text>
            <Text style={[styles.shoppingTipDescription, styles.shoppingTipDescriptionBold]}>
              {t('community.shoppingTipOutro')}
            </Text>
          </CTACard>
        </View>
      )}
      {specialistBlock}
    </>
  );
};

export default CommunityDescriptionSection;
