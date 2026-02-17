import React, { useState } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import { useTranslation } from '@/hooks/i18n';

interface NumberScaleProps {
  selectedValue?: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

const NumberScale: React.FC<NumberScaleProps> = ({ selectedValue, onValueChange, min = 0, max = 10 }) => {
  const { t } = useTranslation();
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [tempValue, setTempValue] = useState<number | undefined>(selectedValue);

  // Calcular posição baseado no valor (usa temp durante arraste, selectedValue depois)
  const getCurrentValue = () => tempValue ?? selectedValue ?? min;

  const getThumbPosition = () => {
    const value = getCurrentValue();
    const percentage = (value - min) / (max - min);
    return percentage * sliderWidth;
  };

  // PanResponder para arrastar o slider
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      // Ao tocar, atualiza apenas visual
      updateTempValueFromPosition(evt.nativeEvent.locationX);
    },
    onPanResponderMove: (evt) => {
      // Durante arraste, atualiza apenas visual
      updateTempValueFromPosition(evt.nativeEvent.locationX);
    },
    onPanResponderRelease: () => {
      // Ao soltar, salva o valor final
      if (tempValue !== undefined && tempValue !== selectedValue) {
        onValueChange(tempValue);
      }
      setTempValue(undefined);
    },
  });

  const updateTempValueFromPosition = (x: number) => {
    if (sliderWidth === 0) return;

    const percentage = Math.max(0, Math.min(1, x / sliderWidth));
    const value = Math.round(percentage * (max - min)) + min;
    setTempValue(value);
  };

  return (
    <View style={styles.container}>
      {/* Slider customizado */}
      <View
        style={styles.sliderContainer}
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        {/* Track de fundo (cinza) */}
        <View style={styles.track}>
          {/* Track preenchido (azul) - dentro do track de fundo */}
          <View style={[styles.trackFilled, { width: getThumbPosition() }]} />
        </View>
      </View>

      {/* Números abaixo do slider */}
      <View style={styles.scaleRow}>
        {numbers.map((number) => {
          const currentValue = getCurrentValue();
          const isSelected = currentValue === number;
          const isEdgeValue = number === min || number === max;

          return (
            <View key={number} style={styles.item}>
              <Text style={[styles.numberText, isSelected && styles.numberTextSelected]}>{number}</Text>

              {isEdgeValue ? (
                <View style={styles.edgeLabelContainer}>
                  {number === min ? (
                    <>
                      <Text style={styles.edgeLabelLine}>
                        {t('anamnesis.scaleMin').split(' ')[0]} {t('anamnesis.scaleMin').split(' ')[1]}
                      </Text>
                      <Text style={styles.edgeLabelLine}>{t('anamnesis.scaleMin').split(' ').slice(2).join(' ')}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.edgeLabelLine}>
                        {t('anamnesis.scaleMax').split(' ')[0]} {t('anamnesis.scaleMax').split(' ')[1]}
                      </Text>
                      <Text style={styles.edgeLabelLine}>{t('anamnesis.scaleMax').split(' ').slice(2).join(' ')}</Text>
                    </>
                  )}
                </View>
              ) : (
                <View style={styles.edgeLabelSpacer} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 8,
    paddingBottom: 8,
  },
  sliderContainer: {
    width: '100%',
    height: 40,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 8,
  },
  track: {
    width: '100%',
    height: 28,
    backgroundColor: '#E8E8E8',
    borderRadius: 14,
    overflow: 'hidden',
  },
  trackFilled: {
    height: '100%',
    backgroundColor: '#0154f8',
    borderRadius: 14,
  },
  scaleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    maxWidth: '9.09%',
  },
  numberText: {
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(110, 106, 106, 1)',
    textAlign: 'center',
    marginTop: 4,
  },
  numberTextSelected: {
    color: 'rgba(0, 17, 55, 1)',
    fontWeight: '600',
  },
  edgeLabelContainer: {
    alignItems: 'center',
    width: 43,
    marginTop: 4,
  },
  edgeLabelSpacer: {
    height: 16,
  },
  edgeLabelLine: {
    fontFamily: 'DM Sans',
    fontSize: 8,
    fontWeight: '500',
    color: 'rgba(110, 106, 106, 1)',
    textAlign: 'center',
  },
});

export default NumberScale;
