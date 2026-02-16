function handleToggle() {
  const button = document.getElementById('modeToggle');
  if (!button) return;

  const classicSection = document.getElementById('classicGenerator');
  const memorableSection = document.getElementById('memorableGenerator');
  if (!classicSection || !memorableSection) return;

  const current = button.dataset.current;

  if (current === 'memorable') {
    // Switch to classic
    classicSection.classList.add('active');
    memorableSection.classList.remove('active');
    button.dataset.current = 'classic';
    button.textContent = button.dataset.labelMemorable;
    button.setAttribute('aria-label', button.dataset.labelMemorable);
  } else {
    // Switch to memorable
    memorableSection.classList.add('active');
    classicSection.classList.remove('active');
    button.dataset.current = 'memorable';
    button.textContent = button.dataset.labelClassic;
    button.setAttribute('aria-label', button.dataset.labelClassic);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function init() {
  const button = document.getElementById('modeToggle');
  if (button) {
    button.removeEventListener('click', handleToggle);
    button.addEventListener('click', handleToggle);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', init);
