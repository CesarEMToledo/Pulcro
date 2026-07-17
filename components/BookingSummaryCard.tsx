import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';

export interface SummaryRow {
  label: string;
  value: string;
  valueStyle?: TextStyle;
}

interface BookingSummaryCardProps {
  rows: SummaryRow[];
  totalLabel: string;
  totalValue: string;
}

export default function BookingSummaryCard({ rows, totalLabel, totalValue }: BookingSummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      {rows.map((row, i) => (
        <View key={i} style={[styles.summaryRow, i > 0 && styles.summaryRowSpaced]}>
          <Text style={styles.summaryLabel}>{row.label}</Text>
          <Text style={[styles.summaryValue, row.valueStyle]}>{row.value}</Text>
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>{totalLabel}</Text>
        <Text style={styles.totalValue}>{totalValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryRowSpaced: { marginTop: Spacing.sm },
  summaryLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textSecondary },
  summaryValue: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  totalLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
});
