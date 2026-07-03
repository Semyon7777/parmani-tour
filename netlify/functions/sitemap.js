const toursData = require('../../src/toursPage/toursData.json');

exports.handler = async function(event, context) {

  const LANGS = ['en', 'ru', 'hy'];
  const baseUrl = 'https://www.parmanitour.com'; // www-piti vor ogni

  const staticRoutes = [
    '/', '/private-tours', '/group-eco-tours', '/extreme-tours',
    '/hotels', '/transport', '/all-in-one', '/history',
    '/cuisine', '/culture', '/nature', '/about-us', '/contact'
  ];

  const tourRoutes = toursData.map(tour => `/private-tours/${tour.id}`);

  let groupEcoRoutes = [];
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/group_eco_tours?select=id,type`,
      {
        headers: {
          apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
        }
      }
    );
    const data = await response.json();
    groupEcoRoutes = data.map(item =>
      item.type === 'eco'
        ? `/eco-tour/${item.id}`
        : `/group-tour/${item.id}`
    );
  } catch (err) {
    console.error('Supabase fetch error:', err);
  }

  const allRoutes = [...staticRoutes, ...tourRoutes, ...groupEcoRoutes];

  // Генерируем URL для каждого языка
  const urls = [];
  for (const route of allRoutes) {
    for (const lang of LANGS) {
      urls.push({
        loc: `${baseUrl}/${lang}${route === '/' ? '' : route}`,
        hreflang: LANGS.map(l => ({
          lang: l,
          url: `${baseUrl}/${l}${route === '/' ? '' : route}`
        }))
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
${u.hreflang.map(h => `    <xhtml:link rel="alternate" hreflang="${h.lang}" href="${h.url}"/>`).join('\n')}
  </url>`).join('\n')}
</urlset>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    },
    body: xml
  };
};