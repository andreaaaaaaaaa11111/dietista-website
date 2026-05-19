/**
 * Costanti frontend per la versione migrata (Clerk)
 * 
 * Con Clerk, il login è gestito tramite il componente SignIn di Clerk.
 * Non è più necessario costruire manualmente l'URL OAuth.
 */
export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Restituisce il percorso della pagina di login.
 * Con Clerk, il login avviene tramite il componente ClerkProvider
 * e il redirect è gestito automaticamente.
 */
export const getLoginUrl = () => "/accedi";
