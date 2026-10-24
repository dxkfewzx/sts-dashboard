/**
 * Design Tokens - JavaScript Version
 * For programmatic access in components, hooks, utils
 * Mirrors CSS custom properties from token CSS files
 *
 * Usage:
 * import { colors, spacing, typography } from '@/styles/tokens/tokens';
 * element.style.color = colors.textPrimary;
 */

// Color tokens (core palette + semantic aliases)
export const colors = {
  // Base neutrals
  base950: '#0D0D12',
  base700: '#4A4A5A',
  base400: '#9A9AAB',
  base100: '#F0F0F5',
  base0:   '#FFFFFF',

  // Accent - Pure blue
  accent:        '#0066FF',
  accentHover:   '#0052CC',
  accentLight:   '#E8F0FE',

  // Semantic status
  success:       '#00A859',
  successHover:  '#008F4A',
  successLight:  '#E6F7ED',

  warning:       '#E67700',
  warningHover:  '#CC6600',
  warningLight:  '#FFF4E6',

  danger:        '#D93025',
  dangerHover:   '#C02A1E',
  dangerLight:   '#FDEAE9',

  info:          '#0066FF',
  infoHover:     '#0052CC',
  infoLight:     '#E8F0FE',

  // Legacy aliases
  primary:       '#0066FF',
  primaryHover:  '#0052CC',
  primaryLight:  '#E8F0FE',
  primaryDark:   '#0040A0',

  // Semantic aliases (for component usage)
  textPrimary:   '#0D0D12',
  textSecondary: '#4A4A5A',
  textMuted:     '#9A9AAB',
  textInverse:   '#FFFFFF',
  textLink:      '#0066FF',
  textLinkHover: '#0052CC',

  bgPage:      '#F0F0F5',
  bgSurface:   '#FFFFFF',
  bgHover:     '#F0F0F5',
  bgActive:    '#E8F0FE',
  bgDisabled:  '#F0F0F5',

  borderSubtle:  '#E0E0EA',
  borderDefault: '#9A9AAB',
  borderFocus:   '#0066FF',
  borderError:   '#D93025',

  // Status-specific
  statusAvailableBg:   '#E6F7ED',
  statusAvailableText: '#00A859',
  statusAvailableBorder: '#00A859',

  statusWithdrawnBg:   '#FFF4E6',
  statusWithdrawnText: '#856404',
  statusWithdrawnBorder: '#E67700',

  statusRepairBg:   '#FDEAE9',
  statusRepairText: '#D93025',
  statusRepairBorder: '#D93025',

  statusPendingBg:   '#F1F3F5',
  statusPendingText: '#6C757D',
  statusPendingBorder: '#6C757D',

  shadowColor: 'rgba(13, 13, 18, 0.04)',
};

// Spacing tokens (4px base unit)
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',

  // Semantic aliases
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',

  cardPadding: '24px',
  cardPaddingSm: '16px',
  modalPadding: '24px',
  pagePadding: '32px',
  sectionGap: '24px',
};

// Typography tokens
export const typography = {
  fontSans: "'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Monaco, Consolas, monospace",

  // Type scale - Original values from old App.css
  xs: '0.7rem',       // 11.2px
  sm: '0.8rem',       // 12.8px
  base: '0.9rem',     // 14.4px
  lg: '1rem',         // 16px
  xl: '1.125rem',     // 18px
  '2xl': '1.25rem',   // 20px
  '3xl': '1.5rem',    // 24px
  '4xl': '3rem',      // 48px

  // Line heights
  leadingTight: 1.2,
  leadingSnug: 1.4,
  leadingNormal: 1.6,
  leadingRelaxed: 1.75,

  // Font weights
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,

  // Letter spacing
  trackingTight: '-0.02em',
  trackingNormal: '0',
  trackingWide: '0.02em',
};

// Border radius tokens
export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  pill: '9999px',

  // Semantic
  input: '8px',
  button: '8px',
  badge: '9999px',
  card: '12px',
  modal: '16px',
  tooltip: '4px',
};

// Shadow tokens
export const shadows = {
  xs: '0 1px 2px rgba(13,13,18,0.04), 0 1px 1px rgba(13,13,18,0.04)',
  sm: '0 1px 3px rgba(13,13,18,0.04), 0 1px 2px rgba(13,13,18,0.04)',
  md: '0 4px 8px rgba(13,13,18,0.06), 0 2px 4px rgba(13,13,18,0.04)',
  lg: '0 12px 24px rgba(13,13,18,0.08), 0 4px 8px rgba(13,13,18,0.05)',
  xl: '0 20px 25px rgba(13,13,18,0.1), 0 10px 10px rgba(13,13,18,0.04)',
  inner: 'inset 0 2px 4px rgba(13,13,18,0.04)',
  focus: '0 0 0 3px #E8F0FE',
  focusError: '0 0 0 3px #FDEAE9',

  // Component-specific
  card: '0 1px 3px rgba(13,13,18,0.04), 0 1px 2px rgba(13,13,18,0.04)',
  cardHover: '0 4px 8px rgba(13,13,18,0.06), 0 2px 4px rgba(13,13,18,0.04)',
  cardElevated: '0 4px 8px rgba(13,13,18,0.06), 0 2px 4px rgba(13,13,18,0.04)',
  cardElevatedHover: '0 12px 24px rgba(13,13,18,0.08), 0 4px 8px rgba(13,13,18,0.05)',
  modal: '0 20px 25px rgba(13,13,18,0.1), 0 10px 10px rgba(13,13,18,0.04)',
  dropdown: '0 12px 24px rgba(13,13,18,0.08), 0 4px 8px rgba(13,13,18,0.05)',
  tooltip: '0 4px 8px rgba(13,13,18,0.06), 0 2px 4px rgba(13,13,18,0.04)',
  toast: '0 12px 24px rgba(13,13,18,0.08), 0 4px 8px rgba(13,13,18,0.05)',
  sidebar: '0 12px 24px rgba(13,13,18,0.08), 0 4px 8px rgba(13,13,18,0.05)',
  sidebarOpen: '0 20px 25px rgba(13,13,18,0.1), 0 10px 10px rgba(13,13,18,0.04)',
};

// Z-index tokens
export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  stickyTop: 250,
  modalBackdrop: 300,
  modal: 400,
  modalTop: 450,
  popover: 500,
  tooltip: 600,
  toast: 700,
  toastTop: 750,
  max: 9999,
};

// Transition tokens
export const transitions = {
  durations: {
    instant: '0ms',
    fast: '120ms',
    base: '200ms',
    slow: '300ms',
  },
  easings: {
    out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // Semantic
  fast: '120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  base: '200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  slow: '300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  spring: '200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  hover: '120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  focus: '120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  modal: '200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  tab: '120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  sidebar: '300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  tooltip: '120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  skeleton: '1.5s ease-in-out infinite',
};

// Breakpoint tokens
export const breakpoints = {
  mobile: '320px',
  mobileLg: '480px',
  tablet: '640px',
  tabletLg: '768px',
  desktop: '1024px',
  desktopLg: '1280px',
  wide: '1440px',
  ultrawide: '1920px',

  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',

  sidebarCollapse: '1024px',

  // Media query strings
  mq: {
    mobile: '(max-width: 639px)',
    tablet: '(min-width: 640px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px) and (max-width: 1439px)',
    wide: '(min-width: 1440px)',
    mobileLg: '(max-width: 1023px)',
  },
};

// Layout tokens
export const layout = {
  sidebarWidth: '280px',
  sidebarCollapsedWidth: '72px',
  headerHeight: '64px',
  containerMaxWidth: '1440px',
};

// Status config (maps to status.js in utils)
export const statusConfig = {
  sn: {
    Available: { label: 'พร้อมใช้งาน', badgeClass: 'badge-success', icon: 'bi-check-circle-fill', color: 'success' },
    Withdrawn: { label: 'เบิกออกแล้ว', badgeClass: 'badge-warning', icon: 'bi-box-arrow-right', color: 'warning' },
    Repair: { label: 'อยู่ระหว่างซ่อม', badgeClass: 'badge-danger', icon: 'bi-tools', color: 'danger' },
  },
  repair: {
    Pending: { label: 'รอซ่อม', badgeClass: 'badge-secondary', icon: 'bi-clock-history', color: 'secondary' },
    Repairing: { label: 'กำลังซ่อม', badgeClass: 'badge-warning', icon: 'bi-tools', color: 'warning' },
    Fixed: { label: 'ซ่อมเสร็จ', badgeClass: 'badge-success', icon: 'bi-check-circle-fill', color: 'success' },
    Returned: { label: 'ส่งคืนแล้ว', badgeClass: 'badge-info', icon: 'bi-box-arrow-left', color: 'info' },
  },
  withdrawalAction: {
    withdraw: { label: 'เบิก', badgeClass: 'badge-warning', icon: 'bi-box-arrow-right', color: 'warning' },
    return: { label: 'คืน', badgeClass: 'badge-success', icon: 'bi-box-arrow-left', color: 'success' },
  },
};

// Form tokens
export const form = {
  inputHeight: '40px',
  inputHeightSm: '36px',
  inputHeightLg: '48px',
  labelGap: '4px',
  errorGap: '4px',
  helperGap: '4px',
};

// Touch target tokens (accessibility)
export const touchTargets = {
  min: '44px',
  iconButton: '36px',
  iconButtonMobile: '40px',
  iconButtonMobileActive: '44px',
};

// Export all tokens as a single object for convenience
export const tokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  layout,
  statusConfig,
  form,
  touchTargets,
};

export default tokens;