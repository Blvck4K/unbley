import { getBrandNameCaseStyle, getStoreFont } from './storeFonts';
import { getBorderColor, getContrastColor, getMutedColor, isDarkColor } from './colors';

export const defaultStoreTheme = {
  primary_color: '#FAFAFA',
  secondary_color: '#FFFFFF',
  accent_color: '#6A3E1F',
  store_font: 'inter',
  brand_name_font: 'inter',
  brand_name_case: 'original'
};

export const resolveStoreTheme = (brand = {}) => {
  const theme = { ...defaultStoreTheme, ...brand };
  const primaryColor = theme.primary_color || defaultStoreTheme.primary_color;
  const dark = isDarkColor(primaryColor);
  const selectedFont = getStoreFont(theme.store_font);
  const brandNameFont = getStoreFont(theme.brand_name_font || theme.store_font);

  return {
    ...theme,
    primaryColor,
    secondaryColor: theme.secondary_color || (dark ? '#141414' : '#FFFFFF'),
    accentColor: theme.accent_color || defaultStoreTheme.accent_color,
    isDark: dark,
    textColor: getContrastColor(primaryColor),
    mutedColor: getMutedColor(primaryColor),
    secondaryTextColor: getContrastColor(theme.secondary_color || (dark ? '#141414' : '#FFFFFF')),
    secondaryMutedColor: getMutedColor(theme.secondary_color || (dark ? '#141414' : '#FFFFFF')),
    accentTextColor: getContrastColor(theme.accent_color || defaultStoreTheme.accent_color),
    borderColor: getBorderColor(primaryColor),
    inputBackground: dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
    storeFont: selectedFont.family,
    brandNameFont: brandNameFont.family,
    brandNameCase: getBrandNameCaseStyle(theme.brand_name_case)
  };
};
