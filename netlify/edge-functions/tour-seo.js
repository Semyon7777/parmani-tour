import toursData from '../../src/toursPage/toursData.json' assert { type: 'json' };

export default async (request, context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Парсим язык и тип из URL
  // Новый формат: /:lang/eco-tour/:id
  const parts = pathname.split('/').filter(Boolean);
  // parts[0] = lang, parts[1] = tour type, parts[2] = id
  const lang = parts[0];
  const tourSegment = parts[1];
  const tourId = parts[2];

  const validLangs = ['en', 'ru', 'hy'];
  if (!validLangs.includes(lang) || !tourId) return context.next();

  let tourType = null;
  if (tourSegment === 'eco-tour') tourType = 'eco';
  else if (tourSegment === 'group-tour') tourType = 'group';
  else if (tourSegment === 'private-tours') tourType = 'private';
  else return context.next();

  let title = '';
  let description = '';
  let image = '';

  try {
    if (tourType === 'private') {
      const tour = toursData.find(t => t.id === tourId);
      if (!tour) return context.next();

      title = tour.title?.[lang] || tour.title?.en || '';
      description = tour.description?.[lang] || tour.description?.en || '';
      image = `https://www.parmanitour.com${tour.imageUrl}`;

    } else {
      const supabaseUrl = Deno.env.get('REACT_APP_SUPABASE_URL');
      const supabaseKey = Deno.env.get('REACT_APP_SUPABASE_ANON_KEY');

      const response = await fetch(
        `${supabaseUrl}/rest/v1/group_eco_tours?id=eq.${tourId}&select=title,description,image`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );

      const data = await response.json();
      const tour = data?.[0];
      if (!tour) return context.next();

      title = tour.title?.[lang] || tour.title?.en || '';
      description = tour.description?.[lang] || tour.description?.en || '';
      image = tour.image || '';
    }

    const siteUrl = 'https://www.parmanitour.com';
    const canonical = `${siteUrl}${pathname}`;

    const originalResponse = await context.next();
    const html = await originalResponse.text();

    // hreflang теги для всех языков
    const basePath = `/${tourSegment}/${tourId}`;
    const hreflangTags = ['en', 'ru', 'hy'].map(l =>
      `<link rel="alternate" hreflang="${l}" href="${siteUrl}/${l}${basePath}" />`
    ).join('\n');

    const injectedHtml = html
      .replace(
        /<meta name="description"[^>]*>/,
        `<meta name="description" content="${description.slice(0, 155)}" />`
      )
      .replace(
        '</head>',
        `<link rel="canonical" href="${canonical}" />
        ${hreflangTags}
        <meta property="og:title" content="${title} — Parmani Tour" />
        <meta property="og:description" content="${description.slice(0, 155)}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:url" content="${canonical}" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
        ${JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": title,
          "description": description,
          "image": image,
          "url": canonical,
          "touristType": tourType === 'eco' ? 'Eco tourism' : tourType === 'group' ? 'Group tourism' : 'Cultural tourism',
          "provider": {
            "@type": "TravelAgency",
            "name": "Parmani Tour",
            "url": siteUrl
          }
        })}
        </script>
        </head>`
      );

    return new Response(injectedHtml, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-seo-injected': 'true'
      }
    });

  } catch (err) {
    console.error('Edge function error:', err);
    return context.next();
  }
};

export const config = {
  path: [
    "/en/eco-tour/*", "/ru/eco-tour/*", "/hy/eco-tour/*",
    "/en/group-tour/*", "/ru/group-tour/*", "/hy/group-tour/*",
    "/en/private-tours/*", "/ru/private-tours/*", "/hy/private-tours/*"
  ]
};