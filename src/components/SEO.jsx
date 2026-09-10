import React from 'react';

/**
 * Reusable SEO component for managing document head metadata using native React 19 hoisting.
 * React 19 automatically hoists <title>, <meta>, and <link> tags to the <head>.
 */
const SEO = ({
  title,
  description = "Launch a professional online store with Unbley. Build your brand, sell online, manage orders and payments, and grow your business with ease.",
  canonical,
  ogImage,
  ogType = 'website',
  twitterHandle = '@unbley',
  keywords,
  schema
}) => {
  const siteName = 'Unbley';
  const siteUrl = 'https://unbley.com';
  const finalUrl = canonical || siteUrl;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  const cleanDescription = React.useMemo(() => {
    if (!description) return "";
    const withSpaces = description.replace(/<\/(h[1-6]|p|div|li|br)>/gi, ' ');
    const stripped = withSpaces.replace(/<[^>]*>/g, '');
    const collapsed = stripped.replace(/\s+/g, ' ').trim();
    return collapsed.length > 160 ? collapsed.substring(0, 157) + "..." : collapsed;
  }, [description]);

  const defaultImage = 'https://unbley.com/og-default.jpg';
  const finalImage = ogImage || defaultImage;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Unbley',
    url: siteUrl,
    logo: 'https://unbley.com/logogo.png',
    sameAs: [
      'https://www.facebook.com/unbley',
      'https://www.instagram.com/unbley',
      'https://www.linkedin.com/company/unbley',
      'https://x.com/unbley'
    ],
    description: 'Unbley helps businesses launch professional online stores, grow sales, manage orders, and accept payments online.'
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const jsonLdData = schema || defaultSchema;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={cleanDescription} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="theme-color" content="#6A3E1F" />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={finalUrl} />

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
      <meta property="og:locale" content="en_NG" />
      <meta property="fb:app_id" content={import.meta.env.VITE_FB_APP_ID} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={cleanDescription} />
      <meta name="twitter:image" content={finalImage} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, jsonLdData])
        }}
      />
    </>
  );
};

export default SEO;
