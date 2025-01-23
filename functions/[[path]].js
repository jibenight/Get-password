export async function onRequest(context) {
  // 1. Récupérer l'URL d'origine
  const url = new URL(context.request.url);

  // 2. Vérifier le hostname
  if (url.hostname === 'get-password.pages.dev') {
    // 3. Modifier le hostname pour le domaine final
    url.hostname = 'get-password.com';
    // 4. Rediriger (code 301)
    return Response.redirect(url.toString(), 301);
  }

  // Sinon, laisser la requête se poursuivre normalement
  return context.next();
}
