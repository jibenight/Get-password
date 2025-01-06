// Fonction pour appliquer les styles
function applyStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .password-list {
            width: 100%;
            margin-bottom: 2rem;
        }

        .password-item {
            position: relative;
            display: flex;
            width: 100%;
            margin-bottom: 0.5rem;
        }

        .password-input {
            width: 100%;
            padding: 1rem;
            font-size: 1.1rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            background: #f8f8f8;
            color: #333;
            font-family: 'Courier New', monospace;
        }

        .copy-button {
            position: absolute;
            right: 0.5rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }

        .copy-button:hover {
            transform: translateY(-50%) scale(1.1);
        }

        .copy-button svg {
            fill: #666;
            width: 24px;
            height: 24px;
        }

        .mode-selector {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
            padding: 1rem;
            background: #f8f8f8;
            border-radius: 8px;
        }

        .mode-selector label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        .mode-selector label:hover {
            background: #e0e0e0;
        }

        .mode-selector input[type="radio"] {
            margin: 0;
        }

        #memorableMode .options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        #memorableMode .option {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        #memorableMode input[type="range"] {
            flex: 1;
        }

        #memorableMode input[type="checkbox"] {
            margin: 0;
            margin-right: 0.5rem;
        }

        .password-display {
            margin-bottom: 2rem;
            width: 100%;
        }

        .password-item.copied {
            animation: copied 0.5s;
        }

        @keyframes copied {
            0% {
                background-color: #f8f8f8;
            }
            50% {
                background-color: #d4edda;
            }
            100% {
                background-color: #f8f8f8;
            }
        }

        .copy-notification {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background-color: #dff0d8;
            color: #3c763d;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            animation: fade-in 0.3s;
        }

        .copy-notification.fade-out {
            animation: fade-out 0.3s;
        }

        @keyframes fade-in {
            from {
                opacity: 0;
                transform: translateY(-1rem);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fade-out {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-1rem);
            }
        }
    `;
    document.head.appendChild(style);
}

// Constantes pour les caractères
const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*'
};

// Fonction pour copier le mot de passe
async function copyToClipboard(input) {
    try {
        await navigator.clipboard.writeText(input.value);
        
        // Effet visuel pour confirmer la copie
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

    } catch (err) {
        console.error('Erreur lors de la copie:', err);
    }
}

// Fonction de calcul de la force du mot de passe
function calculatePasswordStrength(password, options) {
    let strength = 0;
    
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && options.uppercaseCheckbox.checked) strength++;
    if (/[a-z]/.test(password) && options.lowercaseCheckbox.checked) strength++;
    if (/[0-9]/.test(password) && options.numbersCheckbox.checked) strength++;
    if (/[!@#$%^&*]/.test(password) && options.symbolsCheckbox.checked) strength++;
    
    return Math.min(strength, 4);
}

// Fonction de génération d'un seul mot de passe
function generateSinglePassword(options) {
    const { uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox, lengthSlider } = options;
    let charset = '';
    let password = '';
    
    if (!uppercaseCheckbox.checked && !lowercaseCheckbox.checked && 
        !numbersCheckbox.checked && !symbolsCheckbox.checked) {
        return null;
    }

    if (uppercaseCheckbox.checked) charset += characters.uppercase;
    if (lowercaseCheckbox.checked) charset += characters.lowercase;
    if (numbersCheckbox.checked) charset += characters.numbers;
    if (symbolsCheckbox.checked) charset += characters.symbols;

    const length = parseInt(lengthSlider.value);
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    // Vérifier que le mot de passe contient au moins un caractère de chaque type sélectionné
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSymbol = false;

    for (const char of password) {
        if (characters.uppercase.includes(char)) hasUppercase = true;
        if (characters.lowercase.includes(char)) hasLowercase = true;
        if (characters.numbers.includes(char)) hasNumber = true;
        if (characters.symbols.includes(char)) hasSymbol = true;
    }

    if ((uppercaseCheckbox.checked && !hasUppercase) ||
        (lowercaseCheckbox.checked && !hasLowercase) ||
        (numbersCheckbox.checked && !hasNumber) ||
        (symbolsCheckbox.checked && !hasSymbol)) {
        return generateSinglePassword(options);
    }

    const strength = calculatePasswordStrength(password, options);
    return { password, strength };
}

// Fonction pour créer un élément de mot de passe
function createPasswordElement(password, strength) {
    console.log('Création d\'un élément de mot de passe:', password); // Debug

    const passwordItem = document.createElement('div');
    passwordItem.className = 'password-item';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'password-input';
    input.value = ''; // Initialiser avec une chaîne vide
    input.readOnly = true;

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
    `;
    copyButton.addEventListener('click', () => copyToClipboard(input));

    // Mettre à jour la valeur de l'input uniquement lors de la génération
    input.value = password;

    passwordItem.appendChild(input);
    passwordItem.appendChild(copyButton);

    return passwordItem;
}

// Fonction d'initialisation
function initPasswordGenerator() {
    console.log('Initialisation du générateur de mot de passe'); // Debug

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

    // Vérification des éléments DOM
    if (!passwordList) {
        console.error('Liste de mots de passe non trouvée');
        return;
    }

    // Configuration des options
    const options = {
        uppercaseCheckbox,
        lowercaseCheckbox,
        numbersCheckbox,
        symbolsCheckbox,
        lengthSlider,
        countSlider,
        strengthBars
    };

    // Fonction de mise à jour de l'indicateur de force
    function updateStrengthMeter(password) {
        const strength = calculatePasswordStrength(password, options);
        strengthBars.forEach((bar, index) => {
            bar.className = 'bar';
            if (index < strength) {
                if (strength === 1) bar.classList.add('weak');
                else if (strength === 2) bar.classList.add('medium');
                else if (strength === 3) bar.classList.add('strong');
                else if (strength === 4) bar.classList.add('very-strong');
            }
        });
    }

    // Fonction de génération de mots de passe
    function generatePasswords() {
        console.log('Génération des mots de passe'); // Debug

        const count = parseInt(countSlider.value);
        const passwords = [];

        // Vider la liste
        passwordList.innerHTML = '';

        // Générer les mots de passe
        for (let i = 0; i < count; i++) {
            const result = generateSinglePassword(options);
            if (!result) {
                console.error('Erreur de génération de mot de passe');
                continue;
            }

            console.log('Mot de passe généré:', result.password); // Debug
            
            const passwordElement = createPasswordElement(result.password, result.strength);
            passwordList.appendChild(passwordElement);
            passwords.push(result);
        }

        // Mettre à jour l'indicateur de force avec le premier mot de passe
        if (passwords.length > 0) {
            updateStrengthMeter(passwords[0].password);
        }
    }

    // Mise à jour des valeurs affichées
    lengthSlider?.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    countSlider?.addEventListener('input', () => {
        countValue.textContent = countSlider.value;
    });

    // Ajout des écouteurs d'événements
    generateButton.addEventListener('click', generatePasswords);

    const allOptions = [
        uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox,
        lengthSlider
    ];

    allOptions.forEach(element => {
        if (element) {
            element.addEventListener('change', generatePasswords);
        }
    });

    // SUPPRESSION de la génération initiale
    // generatePasswords(); // Cette ligne est commentée/supprimée
}

// Export de la fonction d'initialisation
export { initPasswordGenerator };
