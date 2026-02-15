const SUPPORTED_LANGS = ['en', 'fr', 'es', 'de'];
const DEFAULT_LANG = 'en';

const COUNTRY_TO_LANG = {
  FR: 'fr', GP: 'fr', MQ: 'fr', GF: 'fr', RE: 'fr', YT: 'fr',
  NC: 'fr', PF: 'fr', WF: 'fr', PM: 'fr', BL: 'fr', MF: 'fr',
  MC: 'fr', SN: 'fr', CI: 'fr', ML: 'fr', BF: 'fr', NE: 'fr',
  TG: 'fr', BJ: 'fr', GA: 'fr', CG: 'fr', CD: 'fr', CM: 'fr',
  TD: 'fr', CF: 'fr', MG: 'fr', HT: 'fr', LU: 'fr', BE: 'fr',
  CH: 'de',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es',
  CL: 'es', EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es',
  HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es',
  UY: 'es', PR: 'es', GQ: 'es',
  DE: 'de', AT: 'de', LI: 'de',
};

function detectLangFromAcceptLanguage(header) {
  if (!header) return null;
  const langs = header.split(',').map(part => {
    const [lang] = part.trim().split(';');
    return lang.split('-')[0].toLowerCase();
  });
  return langs.find(l => SUPPORTED_LANGS.includes(l)) || null;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Redirect pages.dev to production domain
  if (url.hostname === 'get-password.pages.dev') {
    url.hostname = 'get-password.com';
    return Response.redirect(url.toString(), 301);
  }

  // Auto-detect language on root path only
  if (url.pathname === '/' || url.pathname === '') {
    const country = context.request.cf?.country;
    const langFromCountry = country ? COUNTRY_TO_LANG[country] : null;
    const langFromHeader = detectLangFromAcceptLanguage(
      context.request.headers.get('accept-language')
    );
    const lang = langFromCountry || langFromHeader || DEFAULT_LANG;

    url.pathname = `/${lang}/`;
    return Response.redirect(url.toString(), 302);
  }

  return context.next();
}
