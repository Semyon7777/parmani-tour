// src/Components/SEO.jsx
import { Helmet } from 'react-helmet-async';

const siteName = "Parmani Tour";
const siteUrl  = "https://www.parmanitour.com";
const defaultImage = `${siteUrl}/images/og-cover.jpg`;
const defaultDescription = "Private tours across Armenia — Tatev, Garni, Geghard, Dilijan, Gyumri and more. Professional guides, comfortable transport.";

function SEO({ title, description, image, url, lang = "en", tourSchema = null }) {
  const fullTitle   = title ? `${title} — ${siteName}` : siteName;
  const metaDesc    = description || defaultDescription;
  const metaImage   = image || defaultImage;
  const canonical   = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />

      {/* Schema.org — только если передали tourSchema */}
      {tourSchema && (
        <script type="application/ld+json">
          {JSON.stringify(tourSchema)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;