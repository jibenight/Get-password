// Toggle generator sections based on the clicked button
function handleToggle(event) {
  const button = event.currentTarget;
  const type = button.dataset.type;

  // Select all toggle buttons and generator sections
  const buttons = document.querySelectorAll('.toggle-button');
  const classicSection = document.getElementById('classicGenerator');
  const memorableSection = document.getElementById('memorableGenerator');

  // Remove the 'active' class from all buttons and add it to the clicked button
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  // Ensure sections exist before updating classes
  if (classicSection && memorableSection) {
    // Update generator sections based on the selected type
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
    button.addEventListener('click', handleToggle);
  });
}

// Initialize the functionality on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Reinitialize on Astro navigation events to ensure the toggle works after page changes
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
