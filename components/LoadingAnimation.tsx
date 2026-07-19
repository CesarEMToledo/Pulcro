import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolation,
  Easing,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  ClipPath,
  Circle,
  Ellipse,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
  G,
  Path,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

// Ported from a standalone HTML/SVG mockup (washing-machine porthole:
// water fills, swirls, drains to reveal the CLEANO wordmark, then settles).
// One linear "cycle" shared value (0-1, 3.6s loop) drives every phase via
// interpolate() at the same keyframe fractions the mockup used with SMIL
// keyTimes/values, so timing stays 1:1 with the source design.

const WATER_DARK = '#1E6FC9';
const WATER_MID = '#4FA6E8';
const WATER_LIGHT = '#BFE3FA';
const FOAM = '#F2FAFF';
const MINT = '#21D6A6';
const INK = '#0B2440';
const INK_SOFT = '#7C93A8';
const RING = '#E6EEF4';

const CYCLE_MS = 3600;
const RIPPLE_MS = 1400;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(SvgText);
const AnimatedView = Animated.View;

// Water surface: two keyframes of the same wavy-top path (M + 3 cubic
// curves), point-by-point, wobbling between them for a flowing-water look.
const WATER_TOP_A = [30, 110, 80, 90, 120, 130, 170, 110, 220, 90, 260, 130, 310, 108, 340, 96, 360, 104, 370, 110];
const WATER_TOP_B = [30, 115, 80, 133, 120, 93, 170, 117, 220, 137, 260, 97, 310, 117, 340, 125, 360, 109, 370, 115];

function lerpPoints(a: number[], b: number[], t: number) {
  'worklet';
  return a.map((v, i) => v + (b[i] - v) * t);
}

function waterFillD(p: number[]) {
  'worklet';
  return `M ${p[0]},${p[1]} C ${p[2]},${p[3]} ${p[4]},${p[5]} ${p[6]},${p[7]} C ${p[8]},${p[9]} ${p[10]},${p[11]} ${p[12]},${p[13]} C ${p[14]},${p[15]} ${p[16]},${p[17]} ${p[18]},${p[19]} L 370,420 L 30,420 Z`;
}

function waterLineD(p: number[]) {
  'worklet';
  return `M ${p[0]},${p[1]} C ${p[2]},${p[3]} ${p[4]},${p[5]} ${p[6]},${p[7]} C ${p[8]},${p[9]} ${p[10]},${p[11]} ${p[12]},${p[13]} C ${p[14]},${p[15]} ${p[16]},${p[17]} ${p[18]},${p[19]}`;
}

const DROPLETS = [
  { cx: 168, r: 3, cyStart: 238, cyEnd: 256, riseAt: 0.6, fadeInAt: 0.59, fadeOutAt: 0.68 },
  { cx: 221, r: 2.4, cyStart: 240, cyEnd: 259, riseAt: 0.62, fadeInAt: 0.61, fadeOutAt: 0.7 },
  { cx: 250, r: 2.6, cyStart: 236, cyEnd: 255, riseAt: 0.61, fadeInAt: 0.6, fadeOutAt: 0.69 },
];

function Droplet({
  cx,
  r,
  cyStart,
  cyEnd,
  riseAt,
  fadeInAt,
  fadeOutAt,
  cycle,
}: (typeof DROPLETS)[number] & { cycle: SharedValue<number> }) {
  const animatedProps = useAnimatedProps(() => {
    const cy = interpolate(cycle.value, [0, riseAt, riseAt + 0.08, 1], [cyStart, cyStart, cyEnd, cyEnd], Extrapolation.CLAMP);
    const opacity = interpolate(
      cycle.value,
      [0, fadeInAt, fadeInAt + 0.02, fadeOutAt, fadeOutAt + 0.02, 1],
      [0, 0, 1, 1, 0, 0],
      Extrapolation.CLAMP
    );
    return { cy, opacity };
  });

  return <AnimatedCircle cx={cx} r={r} fill={WATER_MID} animatedProps={animatedProps} />;
}

function useSpinValue(durationMs: number, toDeg: number) {
  const spin = useSharedValue(0);
  useEffect(() => {
    spin.value = withRepeat(withTiming(toDeg, { duration: durationMs, easing: Easing.linear }), -1, false);
  }, [durationMs, toDeg]);
  return spin;
}

export default function LoadingAnimation() {
  const cycle = useSharedValue(0);
  const ripple = useSharedValue(0);
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  const vortexSpin = useSpinValue(700, 360);
  const arcSpinOuter = useSpinValue(550, 360);
  const arcSpinInner = useSpinValue(800, -360);

  useEffect(() => {
    cycle.value = withRepeat(withTiming(1, { duration: CYCLE_MS, easing: Easing.linear }), -1, false);
    ripple.value = withRepeat(withTiming(1, { duration: RIPPLE_MS, easing: Easing.inOut(Easing.ease) }), -1, true);
    dot1.value = withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })), -1, false);
    dot2.value = withDelay(120, withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })), -1, false));
    dot3.value = withDelay(240, withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })), -1, false));
  }, []);

  const waterOffset = useDerivedValue(() =>
    interpolate(cycle.value, [0, 0.3, 0.55, 0.78, 1], [320, 0, 0, 320, 320], Extrapolation.CLAMP)
  );

  const waterBodyProps = useAnimatedProps(() => {
    const pts = lerpPoints(WATER_TOP_A, WATER_TOP_B, ripple.value);
    return { d: waterFillD(pts), transform: [{ translateY: waterOffset.value }] };
  });

  const waterLineProps = useAnimatedProps(() => {
    const pts = lerpPoints(WATER_TOP_A, WATER_TOP_B, ripple.value);
    return { d: waterLineD(pts), transform: [{ translateY: waterOffset.value }] };
  });

  const vortexGroupProps = useAnimatedProps(() => ({
    opacity: interpolate(cycle.value, [0, 0.27, 0.3, 0.52, 0.55, 1], [0, 0, 1, 1, 0, 0], Extrapolation.CLAMP),
  }));

  const vortexEllipseProps = useAnimatedProps(() => ({ rotation: vortexSpin.value, originX: 200, originY: 205 }));
  const arcOuterProps = useAnimatedProps(() => ({ rotation: arcSpinOuter.value, originX: 200, originY: 205 }));
  const arcInnerProps = useAnimatedProps(() => ({ rotation: arcSpinInner.value, originX: 200, originY: 205 }));

  const revealClipProps = useAnimatedProps(() => ({
    height: interpolate(cycle.value, [0, 0.55, 0.72, 0.82, 1], [0, 0, 60, 60, 60], Extrapolation.CLAMP),
  }));

  const wetSheenProps = useAnimatedProps(() => ({
    opacity: interpolate(cycle.value, [0, 0.55, 0.6, 0.74, 0.88, 1], [0, 0, 0.75, 0.75, 0, 0], Extrapolation.CLAMP),
  }));

  const shineProps = useAnimatedProps(() => ({
    x: interpolate(cycle.value, [0, 0.85, 0.97, 1], [-140, -140, 420, 420], Extrapolation.CLAMP),
  }));

  const captionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(cycle.value, [0, 0.55, 0.64, 1], [0, 0, 1, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(cycle.value, [0, 0.55, 0.64, 1], [5, 5, 0, 0], Extrapolation.CLAMP) }],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(cycle.value, [0, 0.55, 0.56, 1], [-48, 72, 72, 72], Extrapolation.CLAMP) }],
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot1.value, [0, 1], [0.25, 1]),
    transform: [{ translateY: interpolate(dot1.value, [0, 1], [0, -2]) }],
  }));
  const dot2Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot2.value, [0, 1], [0.25, 1]),
    transform: [{ translateY: interpolate(dot2.value, [0, 1], [0, -2]) }],
  }));
  const dot3Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot3.value, [0, 1], [0.25, 1]),
    transform: [{ translateY: interpolate(dot3.value, [0, 1], [0, -2]) }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.drumWrap}>
        <Svg viewBox="0 0 400 400" style={StyleSheet.absoluteFill}>
          <Defs>
            <ClipPath id="porthole">
              <Circle cx={200} cy={200} r={150} />
            </ClipPath>
            <SvgLinearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={WATER_LIGHT} />
              <Stop offset="40%" stopColor={WATER_MID} />
              <Stop offset="100%" stopColor={WATER_DARK} />
            </SvgLinearGradient>
            <RadialGradient id="vortexGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#0E4E86" />
              <Stop offset="55%" stopColor="#2E86C9" stopOpacity={0.55} />
              <Stop offset="100%" stopColor="#2E86C9" stopOpacity={0} />
            </RadialGradient>
            <SvgLinearGradient id="shineGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
              <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.95} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </SvgLinearGradient>
            <ClipPath id="lettersReveal">
              <AnimatedRect x={40} y={176} width={320} animatedProps={revealClipProps} />
            </ClipPath>
          </Defs>

          <Circle cx={200} cy={200} r={164} fill="none" stroke={RING} strokeWidth={14} />
          <Circle cx={200} cy={200} r={150} fill="#FBFDFF" stroke="#DCE7EF" strokeWidth={2} />

          <G clipPath="url(#porthole)">
            <G clipPath="url(#lettersReveal)">
              <SvgText x={200} y={222} textAnchor="middle" fontWeight="700" fontSize={50} fill={INK} letterSpacing={1}>
                CLEANO
              </SvgText>
              <AnimatedText
                x={200}
                y={222}
                textAnchor="middle"
                fontWeight="700"
                fontSize={50}
                fill={WATER_DARK}
                letterSpacing={1}
                animatedProps={wetSheenProps}
              >
                CLEANO
              </AnimatedText>
              <AnimatedRect y={176} width={120} height={70} fill="url(#shineGrad)" animatedProps={shineProps} />
            </G>

            {DROPLETS.map((d, i) => (
              <Droplet key={i} {...d} cycle={cycle} />
            ))}

            <AnimatedG animatedProps={vortexGroupProps}>
              <AnimatedEllipse cx={200} cy={205} rx={68} ry={28} fill="url(#vortexGrad)" animatedProps={vortexEllipseProps} />
              <G stroke={FOAM} strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
                <AnimatedPath d="M 132 205 A 68 28 0 0 1 268 205" animatedProps={arcOuterProps} />
                <AnimatedPath d="M 152 196 A 48 20 0 0 1 248 196" animatedProps={arcInnerProps} />
              </G>
            </AnimatedG>

            <AnimatedPath fill="url(#waterGrad)" opacity={0.92} animatedProps={waterBodyProps} />
            <AnimatedPath fill="none" stroke={FOAM} strokeWidth={3} opacity={0.8} strokeLinecap="round" animatedProps={waterLineProps} />
          </G>
        </Svg>
      </View>

      <AnimatedView style={captionStyle}>
        <View style={styles.captionRow}>
          <Text style={styles.caption}>ropa limpia en camino</Text>
          <View style={styles.dots}>
            <AnimatedView style={[styles.dot, dot1Style]} />
            <AnimatedView style={[styles.dot, dot2Style]} />
            <AnimatedView style={[styles.dot, dot3Style]} />
          </View>
        </View>
      </AnimatedView>

      <View style={styles.progressTrack}>
        <AnimatedView style={[styles.progressFillWrap, progressBarStyle]}>
          <LinearGradient colors={[WATER_MID, MINT]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.progressFill} />
        </AnimatedView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', gap: 22 },
  drumWrap: { width: 220, height: 220 },
  captionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 },
  caption: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: INK_SOFT,
  },
  dots: { flexDirection: 'row', marginLeft: 2 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: WATER_DARK, marginHorizontal: 1 },
  progressTrack: { width: 120, height: 4, borderRadius: 4, backgroundColor: RING, overflow: 'hidden' },
  progressFillWrap: { width: 48, height: 4 },
  progressFill: { width: '100%', height: '100%', borderRadius: 4 },
});
