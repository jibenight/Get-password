const SUPPORTED_LANGS = ['en', 'fr', 'es', 'de', 'pt', 'it', 'nl', 'ru', 'ja', 'ko', 'zh', 'ar', 'tr', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'ro', 'hu', 'el', 'th', 'vi', 'id'];
const DEFAULT_LANG = 'en';

const COUNTRY_TO_LANG = {
  // French
  FR: 'fr', GP: 'fr', MQ: 'fr', GF: 'fr', RE: 'fr', YT: 'fr',
  NC: 'fr', PF: 'fr', WF: 'fr', PM: 'fr', BL: 'fr', MF: 'fr',
  MC: 'fr', SN: 'fr', CI: 'fr', ML: 'fr', BF: 'fr', NE: 'fr',
  TG: 'fr', BJ: 'fr', GA: 'fr', CG: 'fr', CD: 'fr', CM: 'fr',
  TD: 'fr', CF: 'fr', MG: 'fr', HT: 'fr', LU: 'fr', BE: 'fr',
  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es',
  CL: 'es', EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es',
  HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es',
  UY: 'es', PR: 'es', GQ: 'es',
  // German
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  // Portuguese
  PT: 'pt', BR: 'pt', AO: 'pt', MZ: 'pt',
  // Italian
  IT: 'it', SM: 'it',
  // Dutch
  NL: 'nl', SR: 'nl',
  // Russian
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
  // Japanese
  JP: 'ja',
  // Korean
  KR: 'ko',
  // Chinese
  CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh', SG: 'zh',
  // Arabic
  SA: 'ar', AE: 'ar', EG: 'ar', MA: 'ar', DZ: 'ar', TN: 'ar',
  IQ: 'ar', JO: 'ar', LB: 'ar', LY: 'ar', OM: 'ar', QA: 'ar',
  KW: 'ar', BH: 'ar', YE: 'ar', SD: 'ar',
  // Turkish
  TR: 'tr',
  // Polish
  PL: 'pl',
  // Swedish
  SE: 'sv',
  // Danish
  DK: 'da',
  // Norwegian
  NO: 'no',
  // Finnish
  FI: 'fi',
  // Czech
  CZ: 'cs',
  // Romanian
  RO: 'ro', MD: 'ro',
  // Hungarian
  HU: 'hu',
  // Greek
  GR: 'el', CY: 'el',
  // Thai
  TH: 'th',
  // Vietnamese
  VN: 'vi',
  // Indonesian
  ID: 'id',
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
