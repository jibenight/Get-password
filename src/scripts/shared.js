/**
 * Copies the content of an input to the clipboard
 * and handles the display of the notification.
 * @param {HTMLInputElement} input
 * @returns {Promise<void>}
 */
export async function copyToClipboard(input) {
  try {
    await navigator.clipboard.writeText(input.value);

    const passwordItem = input.closest('.password-item');
    passwordItem.classList.add('copied');

    // Swap copy icon to checkmark
    const copyButton = passwordItem.querySelector('.copy-button');
    const originalSvg = copyButton.innerHTML;
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    `;
    copyButton.classList.add('copied');

    setTimeout(() => {
      passwordItem.classList.remove('copied');
      copyButton.innerHTML = originalSvg;
      copyButton.classList.remove('copied');
    }, 1500);

    // Toast notification
    const existing = document.querySelector('.copy-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = 'Copied!';
    document.body.appendChild(notification);

    requestAnimationFrame(() => notification.classList.add('visible'));

    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  } catch (err) {
    console.error('Error while copying:', err);
  }
}

/**
 * Creates and returns the DOM for a password and its copy button.
 * @param {string} password
 * @returns {HTMLDivElement}
 */
export function createPasswordElement(password) {
  const passwordItem = document.createElement('div');
  passwordItem.className = 'password-item';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'password-input';
  input.readOnly = true;
  input.value = password;

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
}
