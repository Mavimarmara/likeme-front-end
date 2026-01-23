import React from 'react';
import { CTACard } from '@/components/ui/cards';
import { COLORS } from '@/constants';
import { styles } from './styles';

interface AnamnesisPromptCardProps {
	onStartPress: () => void;
}

const AnamnesisPromptCard: React.FC<AnamnesisPromptCardProps> = ({ onStartPress }) => {
	return (
		<CTACard
			title="Bring your avatar to life"
			description="By completing your anamnesis, your well-being avatar is born from your data and rhythms. Because feeling good should feel like you!"
			primaryButtonLabel="Start Anamnesis"
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
