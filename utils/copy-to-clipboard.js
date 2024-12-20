export const copyToClipboard = async (text) => {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text);
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return fallbackCopyTextToClipboard(text);
  }
};

function fallbackCopyTextToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    return window.clipboardData.setData('Text', text);
  } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      return document.execCommand('copy');
    } catch (e) {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
