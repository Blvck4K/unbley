export const storeFontOptions = [
  { value: 'inter', label: 'Inter', family: '"Inter", sans-serif' },
  { value: 'playfair', label: 'Playfair Display', family: '"Playfair Display", serif' },
  { value: 'dm-sans', label: 'DM Sans', family: '"DM Sans", sans-serif' },
  { value: 'space-grotesk', label: 'Space Grotesk', family: '"Space Grotesk", sans-serif' },
  { value: 'cormorant', label: 'Cormorant Garamond', family: '"Cormorant Garamond", serif' }
];

export const getStoreFont = (value) => {
  const selectedFont = storeFontOptions.find(option => option.value === value);
  return selectedFont || storeFontOptions.find(option => option.value === 'inter');
};