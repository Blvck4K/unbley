/**
 * Dynamic color and contrast utilities to ensure high legibility
 * across user-customized storefronts and cart/checkout pages.
 */

export function parseHex(hex) {
  if (!hex || typeof hex !== 'string') return [255, 255, 255];
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return [255, 255, 255];
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [255, 255, 255];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function isDarkColor(color) {
  if (!color) return false;
  // If named colors or common defaults
  if (color === 'transparent') return false;
  const [r, g, b] = parseHex(color);
  // Standard perceptual luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

export function getContrastColor(bgColor, darkColor = '#18120E', lightColor = '#FDFBF7') {
  const darkContrast = contrastRatio(darkColor, bgColor);
  const lightContrast = contrastRatio(lightColor, bgColor);
  return lightContrast >= darkContrast ? lightColor : darkColor;
}

function channelLuminance(channel) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color) {
  const [r, g, b] = parseHex(color);
  return (0.2126 * channelLuminance(r)) + (0.7152 * channelLuminance(g)) + (0.0722 * channelLuminance(b));
}

function contrastRatio(firstColor, secondColor) {
  const first = relativeLuminance(firstColor);
  const second = relativeLuminance(secondColor);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getMutedColor(bgColor) {
  return getReadableMutedColor(bgColor);
}

export function getReadableMutedColor(bgColor) {
  return getContrastColor(bgColor, '#5B4638', '#D9CEC5');
}

export function getBorderColor(bgColor) {
  return isDarkColor(bgColor) ? 'rgba(255, 255, 255, 0.12)' : 'rgba(34, 21, 16, 0.1)';
}

export function getCardBg(bgColor) {
  return isDarkColor(bgColor) ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF';
}
