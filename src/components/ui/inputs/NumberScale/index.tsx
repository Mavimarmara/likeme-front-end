import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface NumberScaleProps {
  selectedValue?: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

const NumberScale: React.FC<NumberScaleProps> = ({
  selectedValue,
  onValueChange,
  min = 0,
  max = 10,
}) => {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <View style={styles.container}>
      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={1}
          value={selectedValue ?? min}
          onValueChange={onValueChange}
          minimumTrackTintColor="#0154f8"
          maximumTrackTintColor="rgba(217, 217, 217, 1)"
          thumbTintColor="#0154f8"
        />
      </View>

      {/* Números abaixo do slider */}
      <View style={styles.scaleRow}>
        {numbers.map((number) => {
          const isSelected = selectedValue === number;
          const isEdgeValue = number === min || number === max;

          return (
            <View key={number} style={styles.item}>
              <TouchableOpacity
                style={styles.numberHitbox}
                onPress={() => onValueChange(number)}
                activeOpacity={0.7}
              >
                <Text style={[styles.numberText, isSelected && styles.numberTextSelected]}>
                  {number}
                </Text>
              </TouchableOpacity>

              {isEdgeValue ? (
                <View style={styles.edgeLabelContainer}>
                  {number === min ? (
                    <>
                      <Text style={styles.edgeLabelLine}>tudo a</Text>
                      <Text style={styles.edgeLabelLine}>ver comigo</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.edgeLabelLine}>nada a</Text>
                      <Text style={styles.edgeLabelLine}>ver comigo</Text>
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
    paddingTop: 8,
    paddingBottom: 8,
  },
  sliderContainer: {
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  scaleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    maxWidth: '9.09%',
  },
  numberHitbox: {
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  numberText: {
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(110, 106, 106, 1)',
    textAlign: 'center',
  },
  numberTextSelected: {
    color: 'rgba(0, 17, 55, 1)',
    fontWeight: '600',
  },
  edgeLabelContainer: {
    alignItems: 'center',
    width: 43,
    marginTop: 2,
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

