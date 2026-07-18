import { Dimensions, PixelRatio } from 'react-native';

/**
 * Responsive design utilities for Pulcro.
 *
 * These are plain functions (not hooks) so they can be used directly inside
 * `StyleSheet.create({...})` blocks, which run once at module-load time
 * outside of any component. They read the window size at import time, which
 * is safe because the app is orientation-locked to portrait (see app.json),
 * so width/height don't change during a session except across app restarts
 * (e.g. opening on a different device).
 *
 * For styles that must react live to size changes (rare — mostly hero
 * banners, images, and cards with an intentionally fixed aspect ratio), use
 * the `useResponsive()` hook from `hooks/useResponsive.ts` instead, which is
 * built on top of `useWindowDimensions()`.
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Reference design size (a common mid-size phone). Scale factors are
// computed relative to this so spacing/fonts look "right" at this size and
// scale gently up/down from there.
export const BASE_WIDTH = 375;
export const BASE_HEIGHT = 812;

export const SCREEN = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };

/** True on tablets / large screens (width >= 768dp). */
export const isTablet = SCREEN_WIDTH >= 768;

/** Width in dp for a given percentage of the screen width. */
export function wp(percentage: number, width: number = SCREEN_WIDTH): number {
  return Math.round((percentage / 100) * width);
}

/** Height in dp for a given percentage of the screen height. */
export function hp(percentage: number, height: number = SCREEN_HEIGHT): number {
  return Math.round((percentage / 100) * height);
}

/**
 * Widths beyond this stop increasing the scale ratio. Without a cap, spacing
 * and radii keep growing linearly with window width on web — on a wide
 * desktop viewport that inflates gaps enough to break percentage-based grids
 * (e.g. two 47%-wide cards + a scaled-up gap no longer fit in one row).
 * Matches the `isTablet` breakpoint below: past tablet size, absolute
 * spacing should stay constant rather than keep scaling toward desktop
 * widths that were never part of the reference design.
 */
const MAX_SCALE_WIDTH = 768;

/**
 * Moderate scale: scales a size toward the device's width ratio, but only
 * partially (via `factor`), so spacing doesn't blow up on tablets or shrink
 * too aggressively on small phones. This is the standard technique used by
 * libraries like react-native-size-matters.
 */
export function moderateScale(size: number, factor = 0.5, width: number = SCREEN_WIDTH): number {
  const ratio = Math.min(width, MAX_SCALE_WIDTH) / BASE_WIDTH;
  return size + (size * ratio - size) * factor;
}

/**
 * Scales a fontSize proportionally to screen width, clamped so text never
 * gets unreadably small on tiny phones or comically large on tablets, and
 * respects the user's OS font-scale settings via PixelRatio.
 */
export function scaleFont(size: number, width: number = SCREEN_WIDTH): number {
  const scaled = moderateScale(size, 0.3, width);
  const min = size * 0.88;
  const max = size * 1.3;
  const clamped = Math.min(max, Math.max(min, scaled));
  return Math.round(PixelRatio.roundToNearestPixel(clamped));
}

/** Scales spacing/padding/margins/radii proportionally to screen width. */
export function scaleSpacing(size: number, width: number = SCREEN_WIDTH): number {
  return Math.round(moderateScale(size, 0.4, width));
}
