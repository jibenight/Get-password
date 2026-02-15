import { copyToClipboard, createPasswordElement, getSecureRandomInt } from './shared.js';

/***************************************
 * CONSTANTS AND UTILITIES
 ***************************************/

// Character categories:
const CHARACTERS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*',
};

/***************************************
 * STRENGTH CALCULATION
 ***************************************/

/**
 * Calculates the strength of a password based on simple criteria.
 * Returns an integer between 0 and 4.
 * @param {string} password
 * @param {Object} options
 * @returns {number}
 */
const calculatePasswordStrength = (password, options) => {
  let strength = 0;

  // Length
  if (password.length >= 12) strength++;

  // Uppercase letters
  if (/[A-Z]/.test(password) && options.uppercaseCheckbox.checked) strength++;

  // Lowercase letters
  if (/[a-z]/.test(password) && options.lowercaseCheckbox.checked) strength++;

  // Numbers
  if (/[0-9]/.test(password) && options.numbersCheckbox.checked) strength++;

  // Symbols
  if (/[!@#$%^&*]/.test(password) && options.symbolsCheckbox.checked)
    strength++;

  // Maximum strength: 4
  return Math.min(strength, 4);
};

/***************************************
 * PASSWORD GENERATION
 ***************************************/

/**
 * Generates a single password based on the selected options.
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

  // Gather the selected categories
  const activeCategories = [];
  if (uppercaseCheckbox.checked) activeCategories.push(CHARACTERS.uppercase);
  if (lowercaseCheckbox.checked) activeCategories.push(CHARACTERS.lowercase);
  if (numbersCheckbox.checked) activeCategories.push(CHARACTERS.numbers);
  if (symbolsCheckbox.checked) activeCategories.push(CHARACTERS.symbols);

  // If no category is selected, exit
  if (activeCategories.length === 0) {
    return null;
  }

  // Convert the slider value to a number
  const length = parseInt(lengthSlider.value, 10);

  // Step 1: Ensure at least one character from each selected category
  let passwordArray = [];
  for (let cat of activeCategories) {
    const randomIndex = getSecureRandomInt(cat.length);
    passwordArray.push(cat[randomIndex]);
  }

  // Step 2: Fill the rest of the characters randomly
  const fullCharset = activeCategories.join(''); // concatenate all selected categories
  while (passwordArray.length < length) {
    const randomIndex = getSecureRandomInt(fullCharset.length);
    passwordArray.push(fullCharset[randomIndex]);
  }

  // Step 3: Shuffle the array to avoid a fixed order
  // (e.g., 1 uppercase, then 1 lowercase, etc.)
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  // Reconstruct the password
  const password = passwordArray.join('');

  // Calculate strength
  const strength = calculatePasswordStrength(password, options);

  return { password, strength };
};

/***************************************
 * STRENGTH METER UPDATE
 ***************************************/

/**
 * Updates the strength bars based on the password.
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
 * GENERATION OF N PASSWORDS
 ***************************************/

/**
 * Generates multiple passwords based on the "count"
 * and updates the UI (passwordList).
 * @param {Object} options
 */
const generatePasswords = options => {
  const { countSlider, passwordList, strengthBars } = options;
  const count = parseInt(countSlider.value, 10);

  // Clear the list
  passwordList.innerHTML = '';

  const passwordsData = [];
  for (let i = 0; i < count; i++) {
    const result = generateSinglePassword(options);
    if (!result) {
      console.error('Error: no category selected.');
      continue;
    }
    const passwordElement = createPasswordElement(result.password);
    passwordList.appendChild(passwordElement);
    passwordsData.push(result);
  }

  // Update the strength meter with the first password
  if (passwordsData.length > 0) {
    updateStrengthMeter(passwordsData[0].password, options);
  } else {
    // If no password is generated, reset the bars
    strengthBars.forEach(bar => (bar.className = 'bar'));
  }
};

/***************************************
 * INITIALIZATION
 ***************************************/

/**
 * Initializes the password generator and attaches all event listeners.
 */
const initPasswordGenerator = () => {
  // Retrieve DOM elements
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
    console.error('Password list not found');
    return;
  }

  // Configuration of options to pass everywhere
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

  // Update length display
  lengthSlider?.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
  });

  // Update count display
  countSlider?.addEventListener('input', () => {
    countValue.textContent = countSlider.value;
  });

  // Generate button
  generateButton.addEventListener('click', () => generatePasswords(options));

  // Regenerate automatically when a parameter is changed
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

// Export the init function to be called elsewhere
export { initPasswordGenerator };
