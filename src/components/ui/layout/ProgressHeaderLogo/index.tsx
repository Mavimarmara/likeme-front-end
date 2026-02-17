import React from 'react';
import { View, Text, TextStyle, StyleSheet } from 'react-native';
import { LogoPartialMini } from '@/assets';
import { COLORS } from '@/constants';
import { useTranslation } from '@/hooks/i18n';

type Props = {
  textStyle?: TextStyle | TextStyle[];
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Bricolage Grotesque',
    fontSize: 23,
    fontWeight: '400',
    color: COLORS.TEXT,
    textAlign: 'center',
    letterSpacing: -1.38,
  },
});

const ProgressHeaderLogo: React.FC<Props> = ({ textStyle }) => {
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <LogoPartialMini width={50} height={16} />
      <Text style={[styles.title, textStyle]}>{t('home.yourProgress')}</Text>
    </View>
  );
};

export default ProgressHeaderLogo;
