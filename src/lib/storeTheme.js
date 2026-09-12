import { getBrandNameCaseStyle, getStoreFont } from './storeFonts';
import { getBorderColor, getContrastColor, getMutedColor, getReadableMutedColor, isDarkColor } from './colors';

export const defaultStoreTheme = {
  primary_color: '#FAFAFA',
  secondary_color: '#FFFFFF',
  accent_color: '#6A3E1F',
  store_font: 'inter',
  brand_name_font: 'inter',
  brand_name_case: 'original'
};

const rememberedStoreKey = 'unbley:last-store-brand';

export const rememberStoreBrand = (brand) => {
  if (!brand || typeof window === 'undefined') return;
  try {
    localStorage.setItem(rememberedStoreKey, JSON.stringify(brand));
  } catch {
    // Theme persistence is optional when storage is unavailable.
  }
};

export const getRememberedStoreBrand = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(rememberedStoreKey);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const resolveStoreTheme = (brand = {}) => {
  const theme = { ...defaultStoreTheme, ...brand };
  const primaryColor = theme.primary_color || defaultStoreTheme.primary_color;
  const dark = isDarkColor(primaryColor);
  const secondarySurface = theme.secondary_color || (dark ? '#141414' : '#FFFFFF');
  const selectedFont = getStoreFont(theme.store_font);
  const brandNameFont = getStoreFont(theme.brand_name_font || theme.store_font);

  return {
    ...theme,
    primaryColor,
    secondaryColor: secondarySurface,
    accentColor: theme.accent_color || defaultStoreTheme.accent_color,
    isDark: dark,
    textColor: getContrastColor(primaryColor),
    mutedColor: getMutedColor(primaryColor),
    secondaryTextColor: getContrastColor(theme.secondary_color || (dark ? '#141414' : '#FFFFFF')),
    secondaryMutedColor: getReadableMutedColor(secondarySurface),
    accentTextColor: getContrastColor(theme.accent_color || defaultStoreTheme.accent_color),
    borderColor: getBorderColor(primaryColor),
    inputBackground: dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
    storeFont: selectedFont.family,
    brandNameFont: brandNameFont.family,
    brandNameCase: getBrandNameCaseStyle(theme.brand_name_case)
  };
};
