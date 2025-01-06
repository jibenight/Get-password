// Import des listes de mots
import adjectivesList from '../assets/words/adjectives.json';
import nounsList from '../assets/words/nouns.json';
import verbsList from '../assets/words/verbs.json';
import symbolsList from '../assets/words/symbols.json';

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Fonction pour conjuguer un verbe au présent
function conjugateVerb(verb) {
    // Règles de conjugaison basiques pour le présent
    if (verb.endsWith('er')) {
        return verb.slice(0, -2) + 'e';
    }
    return verb; // Pour les autres cas, retourner le verbe tel quel
}

// Fonction pour accorder l'adjectif avec le nom
function agreeAdjective(adjective, noun) {
    // Liste des noms féminins (à compléter selon besoin)
    const feminineNouns = ['maison', 'table', 'fleur', 'porte', 'fenêtre', 'voiture', 'montagne', 'rivière', 'forêt', 'plage', 'ville', 'mer', 'lune'];
    
    // Si le nom est féminin
    if (feminineNouns.includes(noun.toLowerCase())) {
        // Règles d'accord basiques
        if (adjective.endsWith('')) {
            return adjective + 'e';
        }
        if (adjective.endsWith('eux')) {
            return adjective.slice(0, -3) + 'euse';
        }
        if (adjective.endsWith('f')) {
            return adjective.slice(0, -1) + 've';
        }
    }
    return adjective;
}

export function generateMemorablePassword(options) {
    const { phraseType = 'simple', includeNumbers = true, includeSymbols = true } = options;
    let password = [];
    let phrase = '';

    // Générer une phrase selon le type choisi
    switch (phraseType) {
        case 'simple': // Le [adjectif] [nom] [verbe]
            const noun = getRandomElement(nounsList.nouns);
            const adjective = agreeAdjective(getRandomElement(adjectivesList.adjectives), noun);
            const verb = conjugateVerb(getRandomElement(verbsList.verbs));
            
            phrase = `Le${noun.toLowerCase().startsWith('a') || noun.toLowerCase().startsWith('e') || 
                       noun.toLowerCase().startsWith('i') || noun.toLowerCase().startsWith('o') || 
                       noun.toLowerCase().startsWith('u') || noun.toLowerCase().startsWith('y') ? '\'' : ' '}` +
                     `${adjective} ${noun} ${verb}`;
            break;
            
        case 'descriptive': // Le [nom] [adjectif] [verbe] [adverbe]
            const noun2 = getRandomElement(nounsList.nouns);
            const adjective2 = agreeAdjective(getRandomElement(adjectivesList.adjectives), noun2);
            const verb2 = conjugateVerb(getRandomElement(verbsList.verbs));
            
            phrase = `Le${noun2.toLowerCase().startsWith('a') || noun2.toLowerCase().startsWith('e') || 
                       noun2.toLowerCase().startsWith('i') || noun2.toLowerCase().startsWith('o') || 
                       noun2.toLowerCase().startsWith('u') || noun2.toLowerCase().startsWith('y') ? '\'' : ' '}` +
                     `${noun2} ${adjective2} ${verb2}`;
            break;
    }

    password.push(phrase.split(' ').map(capitalizeFirstLetter).join(''));

    // Ajouter un nombre si demandé
    if (includeNumbers) {
        password.push(Math.floor(Math.random() * 100).toString().padStart(2, '0'));
    }

    // Ajouter un symbole si demandé
    if (includeSymbols) {
        password.push(getRandomElement(symbolsList.symbols));
    }

    return password.join('');
}

export function initMemorablePasswordGenerator() {
    console.log('Début de l\'initialisation du générateur de mots de passe mémorable');

    // Récupérer tous les éléments nécessaires
    const generateButton = document.getElementById('generateMemorableButton');
    const passwordList = document.getElementById('memorablePasswordList');
    const phraseTypeSelect = document.getElementById('phraseType');
    const includeNumbersCheckbox = document.getElementById('includeNumbers');
    const includeSymbolsCheckbox = document.getElementById('includeSymbols');
    const countSlider = document.getElementById('memorablePasswordCount');
    const countValue = document.getElementById('memorableCountValue');

    // Vérification de l'existence des éléments
    const elementsToCheck = [
        { element: generateButton, name: 'Bouton Générer' },
        { element: passwordList, name: 'Liste des mots de passe' },
        { element: phraseTypeSelect, name: 'Sélection du type de phrase' },
        { element: includeNumbersCheckbox, name: 'Checkbox Nombres' },
        { element: includeSymbolsCheckbox, name: 'Checkbox Symboles' },
        { element: countSlider, name: 'Slider de nombre' },
        { element: countValue, name: 'Valeur du nombre' }
    ];

    // Vérifier que tous les éléments existent
    const missingElements = elementsToCheck.filter(item => !item.element);
    if (missingElements.length > 0) {
        console.error('Éléments manquants :', missingElements.map(item => item.name));
        return; // Arrêter l'initialisation si des éléments sont manquants
    }

    // Fonction pour créer un élément de mot de passe
    function createPasswordElement(password) {
        console.log('Création d\'un élément de mot de passe:', password);

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
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(input.value);
                
                const passwordItem = input.closest('.password-item');
                passwordItem.classList.add('copied');
                
                setTimeout(() => {
                    passwordItem.classList.remove('copied');
                }, 500);

                // Notification
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
                console.error('Erreur lors de la copie:', err);
            }
        });

        // Mettre à jour la valeur de l'input uniquement lors de la génération
        input.value = password;

        passwordItem.appendChild(input);
        passwordItem.appendChild(copyButton);

        return passwordItem;
    }

    function generatePasswords() {
        console.log('Génération des mots de passe mémorables');
        const count = parseInt(countSlider.value);
        const options = {
            phraseType: phraseTypeSelect.value,
            includeNumbers: includeNumbersCheckbox.checked,
            includeSymbols: includeSymbolsCheckbox.checked
        };

        // Vider la liste
        passwordList.innerHTML = '';

        // Générer les mots de passe
        for (let i = 0; i < count; i++) {
            const password = generateMemorablePassword(options);
            console.log('Mot de passe généré:', password);
            const passwordElement = createPasswordElement(password);
            passwordList.appendChild(passwordElement);
        }
    }

    // Mise à jour des valeurs affichées
    countSlider?.addEventListener('input', () => {
        console.log('Mise à jour du nombre de phrases');
        countValue.textContent = countSlider.value;
    });

    // Génération des mots de passe
    generateButton?.addEventListener('click', generatePasswords);

    console.log('Fin de l\'initialisation du générateur de mots de passe mémorable');
}
