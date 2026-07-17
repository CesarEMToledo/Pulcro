import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X, LucideIcon } from 'lucide-react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon: LucideIcon;
}

export default function InfoModal({ visible, onClose, title, message, icon: Icon }: InfoModalProps) {
  const { t } = useLanguage();
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.close}
              accessibilityRole="button"
              accessibilityLabel={t.common.close}
            >
              <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <Icon size={32} color={Colors.textMuted} strokeWidth={1.5} />
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  card: { width: '100%', backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  close: { width: 32, height: 32, borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  body: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xl, gap: Spacing.md },
  message: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center' },
});
