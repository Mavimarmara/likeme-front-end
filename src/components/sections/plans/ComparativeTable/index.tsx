import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
  const renderCell = (value: CompareCellValue) => {
    if (value === 'yes') {
      return <Icon name='check' size={20} color={COLORS.WHITE} />;
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
          <Text key={index} style={styles.headerCell}>
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
            <View key={cellIndex} style={styles.cell}>
              {renderCell(value)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default ComparativeTable;
