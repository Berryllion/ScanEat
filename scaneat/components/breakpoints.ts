export enum BreakpointSizes {
  sm,
  md,
  lg,
  xl
}

export const breakpoints = {
  [BreakpointSizes.sm]: 576,
  [BreakpointSizes.md]: 768,
  [BreakpointSizes.lg]: 992,
  [BreakpointSizes.xl]: 1200,
};

export const bpdw = (bp: BreakpointSizes): string => `@media (max-width: ${breakpoints[bp]}px)`;

export const bpup = (bp: BreakpointSizes): string => `@media (min-width: ${breakpoints[bp]}px)`;
