let toastCallback = null;

export const registerToast = (callback) => {
  toastCallback = callback;
};

export const unregisterToast = () => {
  toastCallback = null;
};

export const showToast = (message, type = 'success') => {
  if (toastCallback) {
    toastCallback(message, type);
  } else {
    // Fallback if layout hasn't mounted yet
    console.log(`[Toast ${type}]: ${message}`);
  }
};
