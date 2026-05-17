const toursData = require('../../src/toursPage/toursData.json');

exports.handler = async function(event, context) {

  const staticRoutes = [
    '/', '/private-tours', '/group-eco-tours', '/extreme-tours',
    '/hotels', '/transport', '/all-in-one', '/history',
    '/cuisine', '/culture', '/nature', '/about-us', '/contact'
  ];

  const tourRoutes = toursData.map(tour => `/private-tours/${tour.id}`);

  // Берём group и eco туры из Supabase
  let groupEcoRoutes = [];
  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/group_eco_tours?select=id,type`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
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
  const baseUrl = 'https://parmanitour.netlify.app';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
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