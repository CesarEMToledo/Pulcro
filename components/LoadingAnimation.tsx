import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

const BUBBLES = [
  { size: 14, left: 18, bottom: 10, color: Colors.primary, delay: 0, duration: 1500 },
  { size: 22, left: 44, bottom: 24, color: Colors.secondary, delay: 180, duration: 1700 },
  { size: 10, left: 74, bottom: 6, color: Colors.accent, delay: 340, duration: 1300 },
  { size: 26, left: 100, bottom: 20, color: Colors.primaryLight, delay: 90, duration: 1800 },
  { size: 16, left: 128, bottom: 14, color: Colors.secondaryLight, delay: 260, duration: 1500 },
  { size: 12, left: 60, bottom: 34, color: Colors.accent, delay: 430, duration: 1400 },
];

type BubbleConfig = (typeof BUBBLES)[number];

function Bubble({ size, left, bottom, color, delay, duration }: BubbleConfig) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(withTiming(-90, { duration, easing: Easing.out(Easing.quad) }), -1, false),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: duration * 0.3, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: duration * 0.7, easing: Easing.in(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bubble,
        { width: size, height: size, borderRadius: size / 2, left, bottom, backgroundColor: color },
        style,
      ]}
    />
  );
}

export default function LoadingAnimation() {
  const [showLogo, setShowLogo] = useState(false);
  const bubblesOpacity = useSharedValue(1);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.85);

  useEffect(() => {
    const timer = setTimeout(() => {
      bubblesOpacity.value = withTiming(0, { duration: 300 });
      setShowLogo(true);
      logoOpacity.value = withDelay(150, withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }));
      logoScale.value = withDelay(
        150,
        withSequence(
          withTiming(1.08, { duration: 400, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        ),
      );
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  const bubblesStyle = useAnimatedStyle(() => ({ opacity: bubblesOpacity.value }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bubbleField, bubblesStyle]} pointerEvents="none">
        {BUBBLES.map((bubble, index) => (
          <Bubble key={index} {...bubble} />
        ))}
      </Animated.View>
      {showLogo && (
        <Animated.Text style={[styles.logo, logoStyle]} accessibilityLabel="Cleano">
          CLEANO
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleField: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    position: 'absolute',
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.primary,
  },
});
