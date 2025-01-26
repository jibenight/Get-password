// Chemin : src/scripts/language-detection.js

const detectBrowserLanguage = () => {
  const supportedLanguages = ['en', 'fr', 'es']; // Langues supportées par ton site
  const defaultLanguage = 'en'; // Langue par défaut si aucune langue n'est détectée ou supportée

  // Détection de la langue préférée du navigateur
  const browserLanguage = navigator.languages
    ? navigator.languages[0] // Prend la première langue préférée
    : navigator.language; // Sinon, utilise `navigator.language`

  // Extraction de la langue principale (par exemple, "fr" de "fr-FR")
  const languageCode = browserLanguage.split('-')[0];

  // Vérifie si la langue est supportée, sinon utilise la langue par défaut
  return supportedLanguages.includes(languageCode)
    ? languageCode
    : defaultLanguage;
};

// Charger la langue détectée
const loadLanguage = async languageCode => {
  try {
    // Importe dynamiquement les traductions JSON
    const translations = await import(`../i18n/${languageCode}.json`);
    return translations.default;
  } catch (error) {
    console.error('Erreur lors du chargement des traductions :', error);
  }
};

// Exemple d'initialisation
(async () => {
  const userLanguage = detectBrowserLanguage();
  const translations = await loadLanguage(userLanguage);

  console.log('Langue détectée :', userLanguage);
  console.log('Traductions :', translations);

  // Appliquer les traductions dans l'interface utilisateur
  // Exemple : document.querySelector("#welcome-text").textContent = translations.welcome;
})();
