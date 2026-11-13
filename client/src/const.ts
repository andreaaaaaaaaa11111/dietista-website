export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const getLoginUrl = () => {
  if (window.location.pathname === "/accedi") {
    return `${window.location.pathname}${window.location.search}`;
  }
  const redirect = `${window.location.pathname}${window.location.search}`;
  return `/accedi?redirect=${encodeURIComponent(redirect)}`;
};
