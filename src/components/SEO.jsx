import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Reusable SEO component for managing document head metadata
 */
const SEO = ({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  ogType = 'website',
  twitterHandle = '@zizzystores'
}) => {
  const siteName = 'ZizzyStores';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  
  // Default fallback image if none provided
  const defaultImage = 'https://zizzystores.com/og-default.jpg'; 
  const finalImage = ogImage || defaultImage;

  // Use canonical if provided, otherwise fallback to current window location
  const finalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Search Engine Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {finalUrl && <link rel="canonical" href={finalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      {finalUrl && <meta property="og:url" content={finalUrl} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
    </Helmet>
  );
};

export default SEO;
