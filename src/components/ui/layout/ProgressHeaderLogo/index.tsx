import React from 'react';
import { View, Text, TextStyle } from 'react-native';
import { LogoPartialMini } from '@/assets';
import { COLORS } from '@/constants';

type Props = {
	textStyle?: TextStyle | TextStyle[];
};

const ProgressHeaderLogo: React.FC<Props> = ({ textStyle }) => {
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
			<LogoPartialMini width={50} height={16} />
			<Text
				style={[
					{
						fontFamily: 'DM Sans',
						fontSize: 14,
						fontWeight: '400',
						color: COLORS.TEXT,
						letterSpacing: 0.2,
					},
					textStyle,
				]}
			>
				Your Progress
			</Text>
		</View>
	);
};

export default ProgressHeaderLogo;

