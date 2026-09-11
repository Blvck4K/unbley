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
  { value: 'josefin-sans', label: 'Josefin Sans', family: '"Josefin Sans", sans-serif' },
  { value: 'sora', label: 'Sora', family: '"Sora", sans-serif' },
  { value: 'plus-jakarta-sans', label: 'Plus Jakarta Sans', family: '"Plus Jakarta Sans", sans-serif' },
  { value: 'nunito-sans', label: 'Nunito Sans', family: '"Nunito Sans", sans-serif' },
  { value: 'barlow-condensed', label: 'Barlow Condensed', family: '"Barlow Condensed", sans-serif' },
  { value: 'bebas-neue', label: 'Bebas Neue', family: '"Bebas Neue", sans-serif' },
  { value: 'cinzel', label: 'Cinzel', family: '"Cinzel", serif' },
  { value: 'abril-fatface', label: 'Abril Fatface', family: '"Abril Fatface", serif' },
  { value: 'figtree', label: 'Figtree', family: '"Figtree", sans-serif' },
  { value: 'bodoni-moda', label: 'Bodoni Moda', family: '"Bodoni Moda", serif' },
  { value: 'dm-serif-display', label: 'DM Serif Display', family: '"DM Serif Display", serif' },
  { value: 'fraunces', label: 'Fraunces', family: '"Fraunces", serif' },
  { value: 'prata', label: 'Prata', family: '"Prata", serif' },
  { value: 'young-serif', label: 'Young Serif', family: '"Young Serif", serif' },
  { value: 'tenor-sans', label: 'Tenor Sans', family: '"Tenor Sans", sans-serif' },
  { value: 'marcellus', label: 'Marcellus', family: '"Marcellus", serif' },
  { value: 'montserrat', label: 'Montserrat', family: '"Montserrat", sans-serif' },
  { value: 'poppins', label: 'Poppins', family: '"Poppins", sans-serif' },
  { value: 'rubik', label: 'Rubik', family: '"Rubik", sans-serif' },
  { value: 'work-sans', label: 'Work Sans', family: '"Work Sans", sans-serif' },
  { value: 'ibm-plex-sans', label: 'IBM Plex Sans', family: '"IBM Plex Sans", sans-serif' },
  { value: 'ibm-plex-serif', label: 'IBM Plex Serif', family: '"IBM Plex Serif", serif' },
  { value: 'libre-franklin', label: 'Libre Franklin', family: '"Libre Franklin", sans-serif' },
  { value: 'source-sans-3', label: 'Source Sans 3', family: '"Source Sans 3", sans-serif' },
  { value: 'karla', label: 'Karla', family: '"Karla", sans-serif' },
  { value: 'cabin', label: 'Cabin', family: '"Cabin", sans-serif' },
  { value: 'quicksand', label: 'Quicksand', family: '"Quicksand", sans-serif' },
  { value: 'syne', label: 'Syne', family: '"Syne", sans-serif' },
  { value: 'unbounded', label: 'Unbounded', family: '"Unbounded", sans-serif' },
  { value: 'archivo', label: 'Archivo', family: '"Archivo", sans-serif' },
  { value: 'anton', label: 'Anton', family: '"Anton", sans-serif' },
  { value: 'league-spartan', label: 'League Spartan', family: '"League Spartan", sans-serif' },
  { value: 'bungee', label: 'Bungee', family: '"Bungee", display' },
  { value: 'righteous', label: 'Righteous', family: '"Righteous", display' },
  { value: 'pacifico', label: 'Pacifico', family: '"Pacifico", cursive' },
  { value: 'caveat', label: 'Caveat', family: '"Caveat", cursive' },
  { value: 'dancing-script', label: 'Dancing Script', family: '"Dancing Script", cursive' },
  { value: 'great-vibes', label: 'Great Vibes', family: '"Great Vibes", cursive' }
];

export const getStoreFont = (value) => {
  const selectedFont = storeFontOptions.find(option => option.value === value);
  return selectedFont || storeFontOptions.find(option => option.value === 'inter');
};

export const getBrandNameCaseStyle = (value) => {
  if (value === 'uppercase') return 'uppercase';
  if (value === 'lowercase') return 'lowercase';
  if (value === 'title') return 'capitalize';
  return 'none';
};