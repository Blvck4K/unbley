export const storeFontOptions = [
  { value: 'inter', label: 'Inter', family: '"Inter", sans-serif' },
  { value: 'playfair', label: 'Playfair Display', family: '"Playfair Display", serif' },
  { value: 'dm-sans', label: 'DM Sans', family: '"DM Sans", sans-serif' },
  { value: 'space-grotesk', label: 'Space Grotesk', family: '"Space Grotesk", sans-serif' },
  { value: 'cormorant', label: 'Cormorant Garamond', family: '"Cormorant Garamond", serif' },
  { value: 'manrope', label: 'Manrope', family: '"Manrope", sans-serif' },
  { value: 'outfit', label: 'Outfit', family: '"Outfit", sans-serif' },
  { value: 'raleway', label: 'Raleway', family: '"Raleway", sans-serif' },
  { value: 'oswald', label: 'Oswald', family: '"Oswald", sans-serif' },
  { value: 'lora', label: 'Lora', family: '"Lora", serif' },
  { value: 'merriweather', label: 'Merriweather', family: '"Merriweather", serif' },
  { value: 'libre-baskerville', label: 'Libre Baskerville', family: '"Libre Baskerville", serif' },
  { value: 'josefin-sans', label: 'Josefin Sans', family: '"Josefin Sans", sans-serif' }
];

export const getStoreFont = (value) => {
  const selectedFont = storeFontOptions.find(option => option.value === value);
  return selectedFont || storeFontOptions.find(option => option.value === 'inter');
};