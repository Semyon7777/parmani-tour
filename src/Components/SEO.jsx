// src/Components/SEO.jsx
import { Helmet } from 'react-helmet-async';

const siteName = "Parmani Tour";
const siteUrl  = "https://www.parmanitour.com";
const defaultImage = `${siteUrl}/images/og-cover.jpg`;
const defaultDescription = "Private tours across Armenia — Tatev, Garni, Geghard, Dilijan, Gyumri and more. Professional guides, comfortable transport.";

function SEO({ title, description, image, url, lang = "en" }) {
  const fullTitle   = title ? `${title} — ${siteName}` : siteName;
  const metaDesc    = description || defaultDescription;
  const metaImage   = image || defaultImage;
  const canonical   = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description"        content={metaDesc} />
      <link rel="canonical"           href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name"   content={siteName} />
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={canonical} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image"       content={metaImage} />

      {/* Twitter
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image"       content={metaImage} /> */}
    </Helmet>
  );
}

export default SEO;