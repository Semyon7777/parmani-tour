import toursData from '../../src/toursPage/toursData.json' assert { type: 'json' };

export default async (request, context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  let tourType = null;
  let tourId = null;
  let title = '';
  let description = '';
  let image = '';

  // Определяем тип и ID
  if (pathname.startsWith('/eco-tour/')) {
    tourType = 'eco';
    tourId = pathname.replace('/eco-tour/', '');
  } else if (pathname.startsWith('/group-tour/')) {
    tourType = 'group';
    tourId = pathname.replace('/group-tour/', '');
  } else if (pathname.startsWith('/private-tours/')) {
    tourType = 'private';
    tourId = pathname.replace('/private-tours/', '');
  }

  if (!tourId) return context.next();

  // Язык из браузера
  const acceptLang = request.headers.get('accept-language') || 'en';
  const lang = acceptLang.split(',')[0].split('-')[0];
  const validLang = ['en', 'ru', 'hy'].includes(lang) ? lang : 'en';

  try {
    if (tourType === 'private') {
      // Данные из локального JSON
      const tour = toursData.find(t => t.id === tourId);
      if (!tour) return context.next();

      title = tour.title?.[validLang] || tour.title?.en || '';
      description = tour.description?.[validLang] || tour.description?.en || '';
      image = `https://www.parmanitour.com${tour.imageUrl}`;

    } else {
      // Данные из Supabase (eco и group туры)
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

      title = tour.title?.[validLang] || tour.title?.en || '';
      description = tour.description?.[validLang] || tour.description?.en || '';
      image = tour.image || '';
    }

    const siteUrl = 'https://www.parmanitour.com';
    const canonical = `${siteUrl}${pathname}`;

    // Получаем оригинальный HTML
    const originalResponse = await context.next();
    const html = await originalResponse.text();

    // Вставляем мета-теги
    const injectedHtml = html.replace(
      '</head>',
      `<meta name="description" content="${description.slice(0, 155)}" />
      <link rel="canonical" href="${canonical}" />
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
  path: ["/eco-tour/*", "/group-tour/*", "/private-tours/*"]
};