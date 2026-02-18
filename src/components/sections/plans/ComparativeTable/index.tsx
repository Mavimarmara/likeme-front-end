import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { IconButton } from '@/components/ui/buttons';
import { COLORS } from '@/constants';
import { styles } from './styles';

export type CompareCellValue = 'yes' | 'no' | 'unlimited';

export type ComparativeTableRow = {
  feature: string;
  values: CompareCellValue[];
};

export type ComparativeTableProps = {
  columnHeaders: string[];
  rows: ComparativeTableRow[];
  noLabel: string;
  unlimitedLabel: string;
  style?: ViewStyle | ViewStyle[];
};

const ComparativeTable: React.FC<ComparativeTableProps> = ({ columnHeaders, rows, noLabel, unlimitedLabel, style }) => {
  // Largura de cada coluna de valores proporcional ao tamanho do título
  const columnFlex = columnHeaders.map((h) => Math.max(h.length, 1));

  const renderCell = (value: CompareCellValue) => {
    if (value === 'yes') {
      return (
        <View style={styles.iconWrapper}>
          <IconButton
            icon='check'
            iconSize={18}
            iconColor={COLORS.NEUTRAL.LOW.PURE}
            backgroundTintColor={COLORS.NEUTRAL.HIGH.PURE}
            backgroundSize='small'
            onPress={() => undefined}
            containerStyle={styles.iconButtonContainer}
            iconContainerStyle={styles.iconButtonBackground}
          />
        </View>
      );
    }
    if (value === 'unlimited') {
      return <Text style={styles.cellText}>{unlimitedLabel}</Text>;
    }
    return <Text style={styles.cellText}>{noLabel}</Text>;
  };

  return (
    <View style={[styles.table, style]}>
      <View style={styles.headerRow}>
        <View style={styles.featureCol} />
        {columnHeaders.map((header, index) => (
          <Text key={index} style={[styles.headerCell, { flex: columnFlex[index] }]}>
            {header}
          </Text>
        ))}
      </View>
      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.featureCell} numberOfLines={2}>
            {row.feature}
          </Text>
          {row.values.map((value, cellIndex) => (
            <View key={cellIndex} style={[styles.cell, { flex: columnFlex[cellIndex] }]}>
              {renderCell(value)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default ComparativeTable;
