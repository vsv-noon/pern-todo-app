let logoutAndRedirectFn: (() => void) | null = null;

export const setLogoutAndRedirect = (fn: () => void) => {
  logoutAndRedirectFn = fn;
};

export const callLogoutAndRedirect = () => {
  if (logoutAndRedirectFn) logoutAndRedirectFn();
};
