import React from 'react';
import { CTACard } from '@/components/ui/cards';
import { COLORS } from '@/constants';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

interface AnamnesisPromptCardProps {
	onStartPress: () => void;
}

const AnamnesisPromptCard: React.FC<AnamnesisPromptCardProps> = ({ onStartPress }) => {
	const { t } = useTranslation();

	return (
		<CTACard
			title={t('anamnesis.promptCardTitle')}
			description={t('anamnesis.promptCardDescription')}
			primaryButtonLabel={t('anamnesis.startAnamnesis')}
			primaryButtonOnPress={onStartPress}
			primaryButtonIcon="chevron-right"
			primaryButtonIconPosition="right"
			backgroundColor={COLORS.HIGHLIGHT.LIGHT}
			descriptionColor={COLORS.TEXT}
			style={styles.card}
		/>
	);
};

export default AnamnesisPromptCard;
