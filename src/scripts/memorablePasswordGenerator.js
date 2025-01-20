// Importation des mots depuis le fichier JSON
import wordData from '../assets/words/fr/words.json';
const words = wordData.mots || [];

// Fonction utilitaire pour générer un nombre aléatoire entre deux valeurs
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Génère un mot de passe composé d'un certain nombre de mots aléatoires
const generateRandomPassword = (
  wordCount,
  includeNumbers = false,
  includeSymbols = false
) => {
  if (!Array.isArray(words) || words.length === 0) {
    throw new Error('La liste des mots est vide ou invalide.');
  }

  // Sélectionner des mots aléatoires et capitaliser la première lettre
  let password = Array.from({ length: wordCount }, () => {
    const randomIndex = getRandomInt(0, words.length);
    const word = words[randomIndex];
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Ajouter des nombres si nécessaire
  if (includeNumbers) {
    password.push(getRandomInt(0, 100).toString());
  }

  // Ajouter des symboles si nécessaire
  if (includeSymbols) {
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    const randomSymbol = symbols[getRandomInt(0, symbols.length)];
    password.push(randomSymbol);
  }

  return password.join(''); // Retirer les espaces entre les mots
};

// Fonction pour créer un élément de mot de passe avec design original
const createPasswordElement = password => {
  console.log("Création d'un élément de mot de passe:", password); // Debug

  const passwordItem = document.createElement('div');
  passwordItem.className = 'password-item';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'password-input';
  input.value = password;
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
};

// Initialisation du générateur de mots de passe mémorables
export const initMemorablePasswordGenerator = () => {
  const generateButton = document.getElementById('generateMemorableButton');
  const passwordList = document.getElementById('memorablePasswordList');
  const wordCountInput = document.getElementById('numberWordCount');
  const memorableCountInput = document.getElementById('memorablePasswordCount');
  const includeNumbersInput = document.getElementById('includeNumbers');
  const includeSymbolsInput = document.getElementById('includeSymbols');
  const wordCountValue = document.getElementById('numberWordValue');
  const memorableCountValue = document.getElementById('memorableCountValue');

  // Mettre à jour la valeur des entrées lors du déplacement de la barre
  wordCountInput.addEventListener('input', () => {
    wordCountValue.textContent = wordCountInput.value;
  });

  memorableCountInput.addEventListener('input', () => {
    memorableCountValue.textContent = memorableCountInput.value;
  });

  const updatePasswords = () => {
    const wordCount = parseInt(wordCountInput.value, 10);
    const memorableCount = parseInt(memorableCountInput.value, 10);
    const includeNumbers = includeNumbersInput.checked;
    const includeSymbols = includeSymbolsInput.checked;

    // Générer plusieurs mots de passe
    passwordList.innerHTML = '';
    for (let i = 0; i < memorableCount; i++) {
      const password = generateRandomPassword(
        wordCount,
        includeNumbers,
        includeSymbols
      );
      const passwordElement = createPasswordElement(password);
      passwordList.appendChild(passwordElement);
    }
  };

  generateButton.addEventListener('click', updatePasswords);

  console.log('Générateur de mots de passe initialisé.');
};

// Fonction pour copier dans le presse-papier
const copyToClipboard = input => {
  input.select();
  input.setSelectionRange(0, 99999); // Pour mobile
  navigator.clipboard.writeText(input.value).then(() => {
    alert('Mot de passe copié dans le presse-papier!');
  });
};
