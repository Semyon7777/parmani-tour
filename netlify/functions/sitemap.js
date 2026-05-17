const toursData = require('../../src/toursPage/toursData.json');

exports.handler = async function(event, context) {

  const staticRoutes = [
    '/', '/private-tours', '/group-eco-tours', '/extreme-tours',
    '/hotels', '/transport', '/all-in-one', '/history',
    '/cuisine', '/culture', '/nature', '/about-us', '/contact'
  ];

  const tourRoutes = toursData.map(tour => `/private-tours/${tour.id}`);

  let groupEcoRoutes = [];
  try {
    const url = `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/group_eco_tours?select=id,type`;
    console.log('Fetching:', url);
    console.log('Key exists:', !!process.env.REACT_APP_SUPABASE_ANON_KEY);

    const response = await fetch(url, {
      headers: {
        apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
      }
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Data received:', JSON.stringify(data));

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