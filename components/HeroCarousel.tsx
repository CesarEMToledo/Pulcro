import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow, Layout } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import { useResponsive } from '@/hooks/useResponsive';

export interface HeroOffer {
  key: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  gradient: [string, string];
  onPress: () => void;
}

interface Props {
  offers: HeroOffer[];
}

const AUTO_ADVANCE_MS = 4500;

export default function HeroCarousel({ offers }: Props) {
  const { width } = useResponsive();
  const listRef = useRef<FlatList<HeroOffer>>(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [measuredWidth, setMeasuredWidth] = useState(0);

  // Cards fill the same centered, max-width-constrained content column the
  // rest of the app uses, so the carousel lines up with everything above
  // and below it on both phones and tablets.
  //
  // We measure the wrapper's actual rendered width via onLayout instead of
  // trusting the raw window width from the first render: on some phones the
  // very first card mounts a beat before useWindowDimensions settles, which
  // made just that first card render narrower than the rest. Measuring the
  // real layout keeps every card — including the first — identical in size.
  //
  // Each FlatList "page" is exactly `containerWidth` wide (the full visible
  // viewport), with the visual card inset from it via marginHorizontal. That
  // way a page boundary always lines up with the viewport boundary, so a
  // neighboring card can never peek in at the edges while snapped.
  const fallbackWidth = Math.min(width, Layout.maxContentWidth);
  const containerWidth = measuredWidth || fallbackWidth;
  const cardWidth = containerWidth - Spacing.lg * 2;
  const imageSize = Math.max(84, Math.min(140, cardWidth * 0.32));

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w > 0) setMeasuredWidth(w);
  }, []);

  useEffect(() => {
    if (offers.length <= 1) return;
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      const next = (indexRef.current + 1) % offers.length;
      indexRef.current = next;
      setActiveIndex(next);
      listRef.current?.scrollToOffset({ offset: next * containerWidth, animated: true });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [containerWidth, offers.length]);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / containerWidth);
    const clamped = Math.max(0, Math.min(offers.length - 1, next));
    indexRef.current = clamped;
    setActiveIndex(clamped);
    pausedRef.current = false;
  };

  // Lets the user jump straight to a given offer by tapping its dot.
  const goToIndex = (i: number) => {
    if (i === indexRef.current) return;
    indexRef.current = i;
    setActiveIndex(i);
    pausedRef.current = true;
    listRef.current?.scrollToOffset({ offset: i * containerWidth, animated: true });
    setTimeout(() => {
      pausedRef.current = false;
    }, 400);
  };

  if (offers.length === 0) return null;

  return (
    <View style={styles.wrap} onLayout={handleLayout}>
      <FlatList
        ref={listRef}
        data={offers}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ width: containerWidth }}
        snapToInterval={containerWidth}
        decelerationRate="fast"
        disableIntervalMomentum
        onScrollBeginDrag={() => {
          pausedRef.current = true;
        }}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item }) => (
          <View style={{ width: containerWidth }}>
            <TouchableOpacity activeOpacity={0.9} onPress={item.onPress} style={[styles.card, { width: cardWidth }]}>
              <LinearGradient colors={item.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
                <View style={styles.content}>
                  <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText} numberOfLines={1}>{item.badge}</Text>
                  </View>
                </View>
                <Image source={{ uri: item.image }} style={[styles.image, { width: imageSize, height: imageSize }]} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      />
      {offers.length > 1 && (
        <View style={styles.dots}>
          {offers.map((item, i) => (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.7}
              onPress={() => goToIndex(i)}
              hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
            >
              <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.xl },
  card: { marginHorizontal: Spacing.lg, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.lg },
  gradient: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderRadius: Radius.xl },
  content: { flex: 1, paddingRight: Spacing.sm },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },
  subtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.9)', marginTop: 4, marginBottom: Spacing.sm },
  badge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: Spacing.sm + 2, paddingVertical: 6, borderRadius: Radius.md },
  badgeText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.white, lineHeight: 15 },
  image: { borderRadius: Radius.md, resizeMode: 'cover' },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: Spacing.sm },
  dot: { width: moderateScale(6), height: moderateScale(6), borderRadius: moderateScale(3), backgroundColor: Colors.border },
  dotActive: { width: moderateScale(18), backgroundColor: Colors.primary },
});
