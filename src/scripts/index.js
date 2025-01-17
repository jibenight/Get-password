// Gestion du toggle des générateurs
function handleToggle(event) {
  const button = event.currentTarget;
  const type = button.dataset.type;

  // Sélectionner tous les éléments nécessaires
  const buttons = document.querySelectorAll('.toggle-button');
  const classicSection = document.getElementById('classicGenerator');
  const memorableSection = document.getElementById('memorableGenerator');

  // Mettre à jour les boutons
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  // Mettre à jour les sections
  if (type === 'classic') {
    classicSection.classList.add('active');
    memorableSection.classList.remove('active');
  } else {
    memorableSection.classList.add('active');
    classicSection.classList.remove('active');
  }
}

// Fonction d'initialisation
function init() {
  // Initialisation des boutons de toggle
  const buttons = document.querySelectorAll('.toggle-button');
  buttons.forEach(button => {
    button.addEventListener('click', handleToggle);
  });
}

// Exécuter l'initialisation au chargement de la page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Réinitialiser lors de la navigation Astro
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
