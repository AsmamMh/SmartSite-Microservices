import Keycloak from "keycloak-js";
import { registerTokenSupplier } from "../services/api";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "smartsite",
  clientId: "site-id",
});

let initialized = false;

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

  const authenticated = await keycloak.init({
    onLoad: "login-required",
    checkLoginIframe: false,
    pkceMethod: "S256",
    redirectUri: window.location.origin + "/",
  });

  initialized = true;

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
};

/**
 * Get display name (username or email fallback)
 */
export const getUserDisplayName = (): string => {
  const parsed = keycloak.tokenParsed as any;

  const username = parsed?.preferred_username;
  const email = parsed?.email;

  if (typeof username === "string" && username.trim()) {
    return username;
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