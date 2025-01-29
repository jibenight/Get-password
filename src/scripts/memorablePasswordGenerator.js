/**
 * Dynamically loads words for a specific language.
 * @param {string} lang - The selected language (e.g., "fr", "en").
 * @returns {Promise<Array>} - A promise that returns the words in JSON.
 */
async function loadWordsForLanguage(lang) {
  const url = `/words/${lang}/words-compact.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error loading the word file for language: ${lang}`);
    }
    const data = await response.json();
    if (!data.words || !Array.isArray(data.words)) {
      throw new Error(`Invalid JSON file format for language: ${lang}`);
    }
    return data.words; // Returns the array of words directly
  } catch (error) {
    console.error(`Unable to load words for language ${lang}:`, error);
    return [];
  }
}

/**
 * Generates a memorable passphrase.
 * @param {Array} words - The list of available words.
 * @param {number} count - Number of words to include in the phrase.
 * @param {boolean} includeNumbers - Includes numbers in the phrase.
 * @param {boolean} includeSymbols - Includes symbols in the phrase.
 * @returns {string} - The generated passphrase.
 */
function generateMemorablePassword(
  words,
  count,
  includeNumbers,
  includeSymbols
) {
  if (!words || words.length === 0) {
    console.error('The word list is empty or invalid.');
    return 'Error: No words available.';
  }

  let password = '';
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    let word = words[randomIndex];
    word = word.charAt(0).toUpperCase() + word.slice(1);
    password += word;
  }

  if (includeNumbers) {
    const randomNumber = Math.floor(Math.random() * 100);
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
 * Evaluates the password strength.
 * @param {string} password - The password to evaluate.
 * @param {number} wordCount - Number of words in the password.
 * @returns {number} - A value from 1 to 4 representing the strength.
 */
function calculatePasswordStrength(password, wordCount) {
  let strength = 0;

  // If a single word, limit strength to medium
  if (wordCount === 1) {
    return 2; // Medium
  }

  if (password.length >= 16) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * Updates the password strength meter.
 * @param {string} password - The password to evaluate.
 * @param {number} wordCount - Number of words in the password.
 */
function updateStrengthMeter(password, wordCount) {
  const strengthBars = document.querySelectorAll('.bars');
  const maxBars = 4;
  const strength = calculatePasswordStrength(password, wordCount);
  strengthBars.forEach((bar, index) => {
    if (index < maxBars) {
      bar.className = 'bars';
      if (index < strength) {
        if (strength === 1) bar.classList.add('weak');
        else if (strength === 2) bar.classList.add('medium');
        else if (strength === 3) bar.classList.add('strong');
        else if (strength === 4) bar.classList.add('very-strong');
      }
    } else {
      bar.className = 'bars';
    }
  });
}

/**
 * Copies text to the clipboard.
 * @param {string} text - The text to copy.
 */
function copyToClipboard(input) {
  navigator.clipboard
    .writeText(input.value)
    .then(() => {
      const passwordItem = input.closest('.password-item');
      passwordItem.classList.add('copied');
      setTimeout(() => {
        passwordItem.classList.remove('copied');
      }, 500);
    })
    .catch(err => {
      console.error('Erreur lors de la copie dans le presse-papiers :', err);
    });
}

/**
 * Creates a password element with the expected style.
 * @param {string} password - The generated password.
 * @returns {HTMLElement} - A DOM element containing the password.
 */
function createPasswordElement(password) {
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
}

/**
 * Updates the input labels with their current values.
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
 * Initializes the memorable password generator.
 * @param {string} lang - The selected language.
 */
export async function initMemorablePasswordGenerator(lang) {
  const words = await loadWordsForLanguage(lang);

  if (!words || words.length === 0) {
    console.error(
      'Unable to initialize the generator due to a missing or empty word list.'
    );
    return;
  }

  const generateButton = document.getElementById('generateMemorableButton');
  const passwordList = document.getElementById('memorablePasswordList');
  const countInput = document.getElementById('memorablePasswordCount');
  const numberWordInput = document.getElementById('numberWordCount');
  const includeNumbersCheckbox = document.getElementById('includeNumbers');
  const includeSymbolsCheckbox = document.getElementById('includeSymbols');

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
        words,
        numberOfWords,
        includeNumbers,
        includeSymbols
      );
      const passwordElement = createPasswordElement(password);
      passwordList.appendChild(passwordElement);

      if (i === 0) {
        updateStrengthMeter(password, numberOfWords);
      }
    }
  });
  updateInputLabels();
}
