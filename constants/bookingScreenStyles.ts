import { StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

/**
 * Styles shared across the service booking screens (laundry, house, car,
 * plumbing, gardening, electricity) that are byte-for-byte identical.
 * Screen-specific styles (plan/service cards, chips, etc.) stay local to
 * each screen since they differ in small but meaningful ways.
 */
export const bookingScreenStyles = StyleSheet.create({
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 6 },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.secondary },
  featureText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  popularText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  // Used when the badge sits on a colored gradient header (house, gardening plan cards)
  popularBadgeOnGradient: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
  // Used when the badge sits on a plain white card (car, plumbing, electricity service cards)
  popularBadgeOnCard: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: Colors.secondary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
});
