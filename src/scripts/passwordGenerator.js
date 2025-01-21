/***************************************
 * CONSTANTES ET UTILITAIRES
 ***************************************/

// Catégories de caractères :
const CHARACTERS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*',
};

/**
 * Génère un entier aléatoire dans la fourchette [0, max).
 * Utilise l’API Web Crypto pour plus de sécurité.
 * @param {number} max
 * @returns {number}
 */
const getSecureRandomInt = max => {
  // On crée un tableau d’un seul entier non signé 32 bits
  const array = new Uint32Array(1);
  // Remplit le tableau avec des valeurs aléatoires sécurisées
  window.crypto.getRandomValues(array);
  // On ramène la valeur dans la plage [0, max)
  return Math.floor((array[0] / (0xffffffff + 1)) * max);
};

/***************************************
 * CALCUL DE LA FORCE
 ***************************************/

/**
 * Calcule la force d’un mot de passe selon des critères simples.
 * Retourne un entier entre 0 et 4.
 * @param {string} password
 * @param {Object} options
 * @returns {number}
 */
const calculatePasswordStrength = (password, options) => {
  let strength = 0;

  // Longueur
  if (password.length >= 12) strength++;

  // Majuscules
  if (/[A-Z]/.test(password) && options.uppercaseCheckbox.checked) strength++;

  // Minuscules
  if (/[a-z]/.test(password) && options.lowercaseCheckbox.checked) strength++;

  // Chiffres
  if (/[0-9]/.test(password) && options.numbersCheckbox.checked) strength++;

  // Symboles
  if (/[!@#$%^&*]/.test(password) && options.symbolsCheckbox.checked)
    strength++;

  // Force max : 4
  return Math.min(strength, 4);
};

/***************************************
 * GÉNÉRATION D’UN MOT DE PASSE
 ***************************************/

/**
 * Génère un seul mot de passe selon les options sélectionnées.
 * @param {Object} options
 * @returns {{ password: string, strength: number } | null}
 */
const generateSinglePassword = options => {
  const {
    uppercaseCheckbox,
    lowercaseCheckbox,
    numbersCheckbox,
    symbolsCheckbox,
    lengthSlider,
  } = options;

  // Rassemble les catégories sélectionnées
  const activeCategories = [];
  if (uppercaseCheckbox.checked) activeCategories.push(CHARACTERS.uppercase);
  if (lowercaseCheckbox.checked) activeCategories.push(CHARACTERS.lowercase);
  if (numbersCheckbox.checked) activeCategories.push(CHARACTERS.numbers);
  if (symbolsCheckbox.checked) activeCategories.push(CHARACTERS.symbols);

  // S’il n’y a aucune catégorie sélectionnée, on sort
  if (activeCategories.length === 0) {
    return null;
  }

  // On convertit le slider en nombre
  const length = parseInt(lengthSlider.value, 10);

  // Étape 1 : On s’assure de mettre 1 caractère de chaque catégorie cochée
  let passwordArray = [];
  for (let cat of activeCategories) {
    const randomIndex = getSecureRandomInt(cat.length);
    passwordArray.push(cat[randomIndex]);
  }

  // Étape 2 : On complète le reste des caractères de manière aléatoire
  const fullCharset = activeCategories.join(''); // concat de toutes les catégories sélectionnées
  while (passwordArray.length < length) {
    const randomIndex = getSecureRandomInt(fullCharset.length);
    passwordArray.push(fullCharset[randomIndex]);
  }

  // Étape 3 : Mélange du tableau pour éviter que l’ordre soit toujours le même
  // (1 char maj, puis 1 char min, etc.)
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  // On reconstitue le mot de passe
  const password = passwordArray.join('');

  // Calcul de la force
  const strength = calculatePasswordStrength(password, options);

  return { password, strength };
};

/***************************************
 * COPY-PASTE
 ***************************************/

/**
 * Copie le contenu d’un input dans le presse-papier
 * et gère l’affichage de la notification.
 * @param {HTMLInputElement} input
 * @returns {Promise<void>}
 */
const copyToClipboard = async input => {
  try {
    // Copie dans le presse-papier
    await navigator.clipboard.writeText(input.value);

    // Effet visuel pour confirmer la copie
    const passwordItem = input.closest('.password-item');
    passwordItem.classList.add('copied');
    setTimeout(() => passwordItem.classList.remove('copied'), 500);

    // Affichage notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = 'Mot de passe copié !';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  } catch (err) {
    console.error('Erreur lors de la copie :', err);
  }
};

/***************************************
 * CRÉATION D’UN ÉLÉMENT MOT DE PASSE
 ***************************************/

/**
 * Crée et renvoie le DOM pour un mot de passe et son bouton de copie.
 * @param {string} password
 * @returns {HTMLDivElement}
 */
const createPasswordElement = password => {
  const passwordItem = document.createElement('div');
  passwordItem.className = 'password-item';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'password-input';
  input.readOnly = true;
  input.value = password; // affecte directement le mot de passe

  const copyButton = document.createElement('button');
  copyButton.className = 'copy-button';
  copyButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 
               1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
  `;
  copyButton.addEventListener('click', () => copyToClipboard(input));

  passwordItem.appendChild(input);
  passwordItem.appendChild(copyButton);

  return passwordItem;
};

/***************************************
 * MISE À JOUR DE L’INDICATEUR DE FORCE
 ***************************************/

/**
 * Met à jour les barres de force en fonction du mot de passe.
 * @param {string} password
 * @param {Object} options
 */
const updateStrengthMeter = (password, options) => {
  const strength = calculatePasswordStrength(password, options);
  const { strengthBars } = options;

  strengthBars.forEach((bar, index) => {
    bar.className = 'bar'; // reset
    if (index < strength) {
      if (strength === 1) bar.classList.add('weak');
      else if (strength === 2) bar.classList.add('medium');
      else if (strength === 3) bar.classList.add('strong');
      else if (strength === 4) bar.classList.add('very-strong');
    }
  });
};

/***************************************
 * GÉNÉRATION DE N MOTS DE PASSE
 ***************************************/

/**
 * Génère plusieurs mots de passe selon le "count"
 * et met à jour l’UI (passwordList).
 * @param {Object} options
 */
const generatePasswords = options => {
  const { countSlider, passwordList, strengthBars } = options;
  const count = parseInt(countSlider.value, 10);

  // On vide la liste
  passwordList.innerHTML = '';

  const passwordsData = [];
  for (let i = 0; i < count; i++) {
    const result = generateSinglePassword(options);
    if (!result) {
      console.error('Erreur : aucune catégorie sélectionnée.');
      continue;
    }
    const passwordElement = createPasswordElement(result.password);
    passwordList.appendChild(passwordElement);
    passwordsData.push(result);
  }

  // Mettre à jour l’indicateur de force avec le premier mot de passe
  if (passwordsData.length > 0) {
    updateStrengthMeter(passwordsData[0].password, options);
  } else {
    // S’il n’y a aucun mot de passe généré, on peut remettre les barres à zéro
    strengthBars.forEach(bar => (bar.className = 'bar'));
  }
};

/***************************************
 * INITIALISATION
 ***************************************/

/**
 * Initialise le générateur de mot de passe et attache tous les écouteurs d’événements.
 */
const initPasswordGenerator = () => {
  console.log('Initialisation du générateur de mot de passe');

  // Récupération des éléments DOM
  const passwordList = document.getElementById('passwordList');
  const lengthSlider = document.getElementById('passwordLength');
  const countSlider = document.getElementById('passwordCount');
  const lengthValue = document.getElementById('lengthValue');
  const countValue = document.getElementById('countValue');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const lowercaseCheckbox = document.getElementById('lowercase');
  const numbersCheckbox = document.getElementById('numbers');
  const symbolsCheckbox = document.getElementById('symbols');
  const generateButton = document.getElementById('generateButton');
  const strengthBars = document.querySelectorAll('.bar');

  if (!passwordList) {
    console.error('Liste de mots de passe non trouvée');
    return;
  }

  // Configuration des options à passer partout
  const options = {
    uppercaseCheckbox,
    lowercaseCheckbox,
    numbersCheckbox,
    symbolsCheckbox,
    lengthSlider,
    countSlider,
    strengthBars,
    passwordList,
  };

  // Mise à jour affichage longueur
  lengthSlider?.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
  });

  // Mise à jour affichage nombre de mots de passe
  countSlider?.addEventListener('input', () => {
    countValue.textContent = countSlider.value;
  });

  // Bouton générer
  generateButton.addEventListener('click', () => generatePasswords(options));

  // Pour régénérer automatiquement dès qu’on change un paramètre
  [
    uppercaseCheckbox,
    lowercaseCheckbox,
    numbersCheckbox,
    symbolsCheckbox,
    lengthSlider,
  ].forEach(element => {
    element?.addEventListener('change', () => generatePasswords(options));
  });
};

// On exporte la fonction d’init pour qu’elle soit appelée ailleurs
export { initPasswordGenerator };
