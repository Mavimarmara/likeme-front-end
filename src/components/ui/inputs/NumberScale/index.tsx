import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
      <View style={styles.track} />
      <View style={styles.scaleRow}>
        {numbers.map((number) => {
          const isSelected = selectedValue === number;
          const isEdgeValue = number === min || number === max;

          return (
            <View key={number} style={styles.item}>
              <TouchableOpacity
                style={styles.pointHitbox}
                onPress={() => onValueChange(number)}
                activeOpacity={0.7}
              >
                <View style={[styles.point, isSelected && styles.pointSelected]} />
              </TouchableOpacity>

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
    height: 55,
    position: 'relative',
    marginTop: 8,
  },
  track: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 11,
    height: 1,
    backgroundColor: 'rgba(217, 217, 217, 1)',
  },
  scaleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    maxWidth: '9.09%',
  },
  pointHitbox: {
    width: 24,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  point: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(217, 217, 217, 1)',
  },
  pointSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0154f8',
  },
  numberHitbox: {
    marginTop: 8,
    paddingHorizontal: 2,
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
    marginTop: 0,
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

