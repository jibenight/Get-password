// Toggle generator sections based on the clicked button
function handleToggle(event) {
  const button = event.currentTarget;
  const type = button.dataset.type;

  const buttons = document.querySelectorAll('.toggle-button');
  const classicSection = document.getElementById('classicGenerator');
  const memorableSection = document.getElementById('memorableGenerator');

  buttons.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');

  if (classicSection && memorableSection) {
    if (type === 'classic') {
      classicSection.classList.add('active');
      memorableSection.classList.remove('active');
    } else if (type === 'memorable') {
      memorableSection.classList.add('active');
      classicSection.classList.remove('active');
    }
  }
}

/**
 * Initialize toggle functionality by attaching click event listeners to toggle buttons.
 */
export function init() {
  const buttons = document.querySelectorAll('.toggle-button');
  buttons.forEach(button => {
    // Remove existing listener to prevent duplicates
    button.removeEventListener('click', handleToggle);
    button.addEventListener('click', handleToggle);
  });
}

// Initialize the functionality on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Reinitialize on Astro navigation events
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
