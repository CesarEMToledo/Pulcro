import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { wp as wpBase, hp as hpBase, moderateScale, scaleFont, scaleSpacing } from '@/constants/responsive';

/**
 * Live, orientation/size-reactive responsive helpers, built on top of
 * `useWindowDimensions()`. Use this inside components for anything that
 * must be computed from the *current* screen size — hero banners, image
 * aspect ratios, card grids — as opposed to the static helpers in
 * `constants/responsive.ts`, which are for values inside `StyleSheet.create`.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isTablet = width >= 768;
    const isSmallPhone = width <= 360;

    return {
      width,
      height,
      isTablet,
      isSmallPhone,
      /** Percentage of current screen width, in dp. */
      wp: (percentage: number) => wpBase(percentage, width),
      /** Percentage of current screen height, in dp. */
      hp: (percentage: number) => hpBase(percentage, height),
      /** Moderate-scaled spacing/size value for the current width. */
      rs: (size: number, factor?: number) => moderateScale(size, factor, width),
      /** Responsive, clamped font size for the current width. */
      rf: (size: number) => scaleFont(size, width),
      /** Responsive spacing (padding/margin/radius) for the current width. */
      rsp: (size: number) => scaleSpacing(size, width),
    };
  }, [width, height]);
}
