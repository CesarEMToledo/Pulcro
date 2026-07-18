import { moderateScale } from '@/constants/responsive';

// Regression: scaleSpacing/moderateScale had no upper bound, so on wide web
// viewports (e.g. 1344px) spacing scaled up enough that two 47%-wide cards
// plus a scaled-up gap no longer fit in one row (app/(tabs)/shop.tsx grid
// collapsed to a single column). moderateScale should stop scaling past the
// tablet breakpoint instead of growing indefinitely with window width.
// Found during manual responsive review, 2026-07-18.

describe('moderateScale', () => {
  it('does not keep growing for widths beyond the tablet breakpoint', () => {
    const atTablet = moderateScale(16, 0.4, 768);
    const wellPastTablet = moderateScale(16, 0.4, 1344);
    const veryWideDesktop = moderateScale(16, 0.4, 2560);

    expect(wellPastTablet).toBe(atTablet);
    expect(veryWideDesktop).toBe(atTablet);
  });

  it('still scales normally below the cap', () => {
    const atBase = moderateScale(16, 0.4, 375);
    const atSmallPhone = moderateScale(16, 0.4, 320);

    expect(atBase).toBe(16);
    expect(atSmallPhone).toBeLessThan(atBase);
  });
});
