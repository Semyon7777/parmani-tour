const toursData = require('../../src/toursPage/toursData.json');

exports.handler = async () => {
  
  const staticRoutes = [
    '/', '/private-tours', '/group-eco-tours', '/extreme-tours',
    '/hotels', '/transport', '/all-in-one', '/history',
    '/cuisine', '/culture', '/nature', '/about-us', '/contact'
  ];

  const tourRoutes = toursData.map(tour => `/private-tours/${tour.id}`);

  const allRoutes = [...staticRoutes, ...tourRoutes];
  const baseUrl = 'https://parmanitour.netlify.app';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
  </url>`).join('\n')}
</urlset>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/xml' },
    body: xml
  };
};