import React from 'react';

/**
 * Reusable SEO component for managing document head metadata using native React 19 hoisting.
 * React 19 automatically hoists <title>, <meta>, and <link> tags to the <head>.
 */
const SEO = ({
  title,
  description = "Start your professional online store with Unbley. The easiest way to sell products in Nigeria and beyond.",
  canonical,
  ogImage,
  ogType = 'website',
  twitterHandle = '@unbley',
  keywords
}) => {
  const siteName = 'Unbley';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  // Clean meta description (remove HTML, collapse whitespace, truncate to 160)
  const cleanDescription = React.useMemo(() => {
    if (!description) return "";
    // Replace tags that usually signify blocks with a space to avoid joining text (e.g., </h2><p>)
    const withSpaces = description.replace(/<\/(h[1-6]|p|div|li|br)>/gi, ' ');
    const stripped = withSpaces.replace(/<[^>]*>/g, ''); // Strip remaining HTML
    const collapsed = stripped.replace(/\s+/g, ' ').trim(); // Collapse whitespace
    return collapsed.length > 160 ? collapsed.substring(0, 157) + "..." : collapsed;
  }, [description]);

  // Default fallback image if none provided
  const defaultImage = 'https://unbley.com/og-default.jpg';
  const finalImage = ogImage || defaultImage;

  // Use canonical if provided, otherwise fallback to current origin
  const siteUrl = 'https://unbley.com';
  // During SSG/SSR, window is not available, so we use the siteUrl as base
  const finalUrl = canonical || siteUrl;

  return (
    <>
      {/* Search Engine Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={cleanDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={cleanDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:secure_url" content={finalImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1678" />
      <meta property="og:image:height" content="937" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="fb:app_id" content={import.meta.env.VITE_FB_APP_ID} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={cleanDescription} />
      <meta name="twitter:image" content={finalImage} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
    </>
  );
};

export default SEO;
