/**
 * Central theme config for the site.
 * Update these values when changing the site theme - the contribution calendar
 * and other theme-dependent components will pick them up automatically.
 */
export const themeColors = {
  // Dark mode (default)
  dark: {
    background: '#0a192f',
    backgroundSecondary: '#112240',
    border: '#233554',
    text: '#a8b2d1',
    primary: '#64ffda',
  },
  // Light mode
  light: {
    background: '#ffffff',
    backgroundSecondary: '#f0f4f8',
    border: '#cbd5e1',
    text: '#233554',
    primary: '#0891b2',
  },
} as const;

/**
 * Contribution calendar color scale (5 levels: 0 = empty, 1-4 = activity).
 * Uses primary color with increasing intensity to match site theme.
 */
export const contributionCalendarTheme = {
  dark: [
    '#161b22', // 0: empty (subtle dark)
    '#0e3d35', // 1: very low
    '#0d5c4a', // 2: low
    '#0d7a62', // 3: medium
    '#64ffda', // 4: high (primary)
  ],
  light: [
    '#ebedf0', // 0: empty (subtle light)
    '#b3e5dc', // 1: very low
    '#7dd3c4', // 2: low
    '#47c1ad', // 3: medium
    '#0891b2', // 4: high (primary light)
  ],
};
