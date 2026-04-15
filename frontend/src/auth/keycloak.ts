import Keycloak from "keycloak-js";
import { registerTokenSupplier } from "../services/api";

const KEYCLOAK_URL =  "http://localhost:8080";
const KEYCLOAK_REALM =  "smartsite";
const KEYCLOAK_CLIENT_ID =  "site-id";
const INIT_RETRY_FLAG = "kc-init-retry-once";

const keycloak = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID,
});

let initialized = false;
let initPromise: Promise<boolean> | null = null;

const hasAuthCallbackParams = (): boolean => {
  const url = new URL(window.location.href);
  const keys = ["code", "state", "session_state", "error", "error_description"];
  const hasQueryParams = keys.some((key) => url.searchParams.has(key));
  const hash = url.hash.replace(/^#/, "");
  const hashParams = new URLSearchParams(hash);
  const hasHashParams = keys.some((key) => hashParams.has(key));

  return hasQueryParams || hasHashParams;
};

const clearAuthCallbackParams = () => {
  const url = new URL(window.location.href);
  const keys = ["code", "state", "session_state", "error", "error_description"];

  keys.forEach((key) => url.searchParams.delete(key));
  url.hash = "";

  const cleanUrl = `${url.origin}${url.pathname}${url.search}`;
  window.history.replaceState({}, document.title, cleanUrl);
};

/**
 * Token provider for API layer
 */
registerTokenSupplier(async () => {
  if (!keycloak.authenticated) {
    return undefined;
  }

  try {
    // refresh token if expiring soon
    await keycloak.updateToken(60);
  } catch (error) {
    console.error("Token refresh failed, redirecting to login", error);
    await keycloak.login();
    return undefined;
  }

  return keycloak.token;
});

/**
 * Initialize Keycloak (call this before rendering app)
 */
export const initKeycloak = async (): Promise<boolean> => {
  if (initialized) {
    return !!keycloak.authenticated;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = keycloak
    .init({
      onLoad: "login-required",
      checkLoginIframe: false,
      pkceMethod: "S256",
      flow: "standard",
      responseMode: "query",
      redirectUri: window.location.origin + "/",
    })
    .then((authenticated) => {
      initialized = true;
      sessionStorage.removeItem(INIT_RETRY_FLAG);

      // auto refresh when token expires
      keycloak.onTokenExpired = () => {
        keycloak
          .updateToken(60)
          .catch((error) => {
            console.error("Session expired, redirecting to login", error);
            keycloak.login();
          });
      };

      return authenticated;
    })
    .catch((error) => {
      initPromise = null;

      // Recover once from stale/invalid auth callback state then force a fresh login.
      if (hasAuthCallbackParams() && sessionStorage.getItem(INIT_RETRY_FLAG) !== "1") {
        sessionStorage.setItem(INIT_RETRY_FLAG, "1");
        clearAuthCallbackParams();
        return keycloak.login({ redirectUri: window.location.origin + "/" }).then(() => false);
      }

      console.error("Keycloak init failed", {
        keycloakUrl: KEYCLOAK_URL,
        realm: KEYCLOAK_REALM,
        clientId: KEYCLOAK_CLIENT_ID,
        error,
      });
      throw error;
    });

  return initPromise;
};

/**
 * Get display name (username or email fallback)
 */
export const getUserDisplayName = (): string => {
  const parsed = keycloak.tokenParsed as any;

  const username = parsed?.preferred_username;
  const fullName = parsed?.name;
  const givenName = parsed?.given_name;
  const familyName = parsed?.family_name;
  const email = parsed?.email;

  if (typeof username === "string" && username.trim()) {
    return username;
  }

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName;
  }

  const composedName = [givenName, familyName]
    .filter((part: unknown): part is string => typeof part === "string" && part.trim().length > 0)
    .join(" ")
    .trim();

  if (composedName) {
    return composedName;
  }

  if (typeof email === "string" && email.trim()) {
    return email;
  }

  return "Utilisateur";
};

/**
 * Logout helper
 */
export const logout = () => {
  return keycloak.logout({
    redirectUri: window.location.origin,
  });
};

export default keycloak;