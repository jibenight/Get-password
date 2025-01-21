/**
 * Charge dynamiquement les mots pour une langue spécifique.
 * @param {string} lang - La langue sélectionnée (ex : "fr", "en").
 * @returns {Promise<Array>} - Une promesse qui retourne les mots en JSON.
 */
async function loadWordsForLanguage(lang) {
  const url = `/words/${lang}/words-compact.json`;
  console.log(`Chargement du fichier JSON pour : ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Erreur lors du chargement du fichier des mots pour la langue : ${lang}`
      );
    }
    const data = await response.json();
    if (!data.words || !Array.isArray(data.words)) {
      throw new Error(
        `Format invalide du fichier JSON pour la langue : ${lang}`
      );
    }
    return data.words; // Retourne directement le tableau des mots
  } catch (error) {
    console.error(
      `Impossible de charger les mots pour la langue ${lang}:`,
      error
    );
    return [];
  }
}

/**
 * Génère une phrase de passe mémorable.
 * @param {Array} words - La liste des mots disponibles.
 * @param {number} count - Nombre de mots à inclure dans la phrase.
 * @param {boolean} includeNumbers - Inclut des chiffres dans la phrase.
 * @param {boolean} includeSymbols - Inclut des symboles dans la phrase.
 * @returns {string} - La phrase de passe générée.
 */
function generateMemorablePassword(
  words,
  count,
  includeNumbers,
  includeSymbols
) {
  if (!words || words.length === 0) {
    console.error('La liste des mots est vide ou invalide.');
    return 'Erreur : pas de mots disponibles.';
  }

  let password = '';
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    let word = words[randomIndex];

    // Mettre en majuscule la première lettre de chaque mot
    word = word.charAt(0).toUpperCase() + word.slice(1);

    password += word;
  }

  if (includeNumbers) {
    const randomNumber = Math.floor(Math.random() * 100); // Ajoute un nombre aléatoire à deux chiffres
    password += randomNumber;
  }

  if (includeSymbols) {
    const symbols = ['!', '@', '#', '$', '%', '&', '*'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    password += randomSymbol;
  }

  return password;
}

/**
 * Évalue la force du mot de passe.
 * @param {string} password - Le mot de passe à évaluer.
 * @param {number} wordCount - Nombre de mots dans le mot de passe.
 * @returns {number} - Une valeur de 1 à 4 représentant la force.
 */
function calculatePasswordStrength(password, wordCount) {
  let strength = 0;

  // Si un seul mot, force limitée à médium
  if (wordCount === 1) {
    return 2; // Medium
  }

  if (password.length >= 16) strength++; // Longueur supplémentaire
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * Met à jour la barre de force du mot de passe.
 * @param {string} password - Le mot de passe à évaluer.
 * @param {number} wordCount - Nombre de mots dans le mot de passe.
 */
function updateStrengthMeter(password, wordCount) {
  const strengthBars = document.querySelectorAll('.bars');
  const maxBars = 4; // Limitez le nombre de barres utilisées
  const strength = calculatePasswordStrength(password, wordCount);
  console.log('Force calculée :', strength);

  strengthBars.forEach((bar, index) => {
    if (index < maxBars) {
      // Appliquer uniquement sur les 4 premières barres
      bar.className = 'bars';
      if (index < strength) {
        if (strength === 1) bar.classList.add('weak');
        else if (strength === 2) bar.classList.add('medium');
        else if (strength === 3) bar.classList.add('strong');
        else if (strength === 4) bar.classList.add('very-strong');
      }
    } else {
      bar.className = 'bars'; // Réinitialiser les barres supplémentaires
    }
  });
}

/**
 * Copie un texte dans le presse-papiers.
 * @param {string} text - Le texte à copier.
 */
function copyToClipboard(input) {
  navigator.clipboard
    .writeText(input.value)
    .then(() => {
      const passwordItem = input.closest('.password-item');
      passwordItem.classList.add('copied');

      // Retirer la classe après l'animation
      setTimeout(() => {
        passwordItem.classList.remove('copied');
      }, 500);

      // Notification
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.textContent = 'Mot de passe copié !';
      document.body.appendChild(notification);

      // Supprimer la notification après 2 secondes
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    })
    .catch(err => {
      console.error('Erreur lors de la copie dans le presse-papiers :', err);
    });
}

/**
 * Crée un élément de mot de passe avec le style attendu.
 * @param {string} password - Le mot de passe généré.
 * @returns {HTMLElement} - Un élément DOM contenant le mot de passe.
 */
function createPasswordElement(password) {
  console.log("Création d'un élément de mot de passe:", password); // Debug

  const passwordItem = document.createElement('div');
  passwordItem.className = 'password-item';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'password-input';
  input.value = password; // Initialiser avec le mot de passe
  input.readOnly = true;

  const copyButton = document.createElement('button');
  copyButton.className = 'copy-button';
  copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
    `;
  copyButton.addEventListener('click', () => copyToClipboard(input));

  passwordItem.appendChild(input);
  passwordItem.appendChild(copyButton);

  return passwordItem;
}

/**
 * Met à jour les labels des inputs avec leurs valeurs actuelles.
 */
function updateInputLabels() {
  const countLabel = document.getElementById('memorableCountValue');
  const numberWordLabel = document.getElementById('numberWordValue');
  const countInput = document.getElementById('memorablePasswordCount');
  const numberWordInput = document.getElementById('numberWordCount');

  if (countLabel && countInput) {
    countLabel.textContent = countInput.value;
  }

  if (numberWordLabel && numberWordInput) {
    numberWordLabel.textContent = numberWordInput.value;
  }
}

/**
 * Initialise le générateur de phrases de passe mémorables.
 * @param {string} lang - La langue sélectionnée.
 */
export async function initMemorablePasswordGenerator(lang) {
  const words = await loadWordsForLanguage(lang);

  if (!words || words.length === 0) {
    console.error(
      'Impossible d’initialiser le générateur à cause d’une liste de mots manquante ou vide.'
    );
    return;
  }

  console.log('Mots chargés pour la langue :', words);

  const generateButton = document.getElementById('generateMemorableButton');
  const passwordList = document.getElementById('memorablePasswordList');
  const countInput = document.getElementById('memorablePasswordCount');
  const numberWordInput = document.getElementById('numberWordCount');
  const includeNumbersCheckbox = document.getElementById('includeNumbers');
  const includeSymbolsCheckbox = document.getElementById('includeSymbols');
  const strengthMeter = document.getElementById('strengthMeters');

  countInput.addEventListener('input', updateInputLabels);
  numberWordInput.addEventListener('input', updateInputLabels);

  generateButton.addEventListener('click', () => {
    const count = parseInt(countInput.value, 10);
    const numberOfWords = parseInt(numberWordInput.value, 10);
    const includeNumbers = includeNumbersCheckbox.checked;
    const includeSymbols = includeSymbolsCheckbox.checked;

    passwordList.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const password = generateMemorablePassword(
        words, // Utiliser directement le tableau des mots
        numberOfWords,
        includeNumbers,
        includeSymbols
      );
      const passwordElement = createPasswordElement(password);
      passwordList.appendChild(passwordElement);

      if (i === 0) {
        updateStrengthMeter(password, numberOfWords); // Met à jour la barre de force avec le premier mot de passe
      }
    }
  });
  updateInputLabels(); // Initialiser les labels avec les valeurs actuelles

  console.log(
    'Générateur de phrases de passe mémorables initialisé pour la langue :',
    lang
  );
}
