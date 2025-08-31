/**
 * auth.js
 * Handles Auth0 authentication and UI updates.
 * © 2025 TeacherToybox.com. All Rights Reserved.
 */

let auth0Client = null;

/**
 * Configures the Auth0 client.
 * Remember to replace placeholder values with your actual Auth0 credentials.
 */
const configureClient = async () => {
  try {
    auth0Client = await auth0.createAuth0Client({
      domain: "YOUR_AUTH0_DOMAIN", // <-- Replace with your Auth0 domain
      clientId: "YOUR_AUTH0_CLIENT_ID", // <-- Replace with your Auth0 client ID
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    });
  } catch (err) {
    console.error("Error configuring Auth0 client:", err);
  }
};

/**
 * Updates the UI based on authentication state.
 */
const updateUI = async () => {
  if (!auth0Client) return;

  const isAuthenticated = await auth0Client.isAuthenticated();
  const authButton = document.getElementById('authButton');
  const userProfile = document.getElementById('userProfile');
  const upgradeButton = document.getElementById('upgradeButton');
  
  // Store auth state globally for other scripts to access
  window.TT.isAuthenticated = isAuthenticated;

  if (authButton) {
    if (isAuthenticated) {
      // User is logged in
      authButton.innerHTML = '<i data-lucide="log-out"></i>';
      authButton.classList.add('logout-btn');
      
      const user = await auth0Client.getUser();
      if (userProfile && user.picture) {
        userProfile.style.display = 'flex';
        userProfile.style.backgroundImage = `url('${user.picture}')`;
        userProfile.style.backgroundSize = 'cover';
        userProfile.style.backgroundPosition = 'center';
      }
      if (upgradeButton) upgradeButton.style.display = 'flex';

    } else {
      // User is logged out
      authButton.innerHTML = '<i data-lucide="log-in"></i>';
      authButton.classList.remove('logout-btn');
      if (userProfile) userProfile.style.display = 'none';
      if (upgradeButton) upgradeButton.style.display = 'flex'; // Or 'none' if you want to hide it for logged-out users
    }

    // IMPORTANT: Re-render icons after changing the button's content
    if (window.lucide) {
      lucide.createIcons();
    }
  }
};

/**
 * Initiates the login process.
 */
const login = async (target) => {
  if (!auth0Client) return;
  try {
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin,
            appState: { target: target }
        }
    });
  } catch (err) {
    console.error("Login failed", err);
  }
};

/**
 * Initiates the logout process.
 */
const logout = () => {
  if (!auth0Client) return;
  try {
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (err) {
    console.error("Logout failed", err);
  }
};

/**
 * Main function to run on page load.
 */
window.addEventListener('load', async () => {
  await configureClient();
  await updateUI();

  const isAuthenticated = await auth0Client.isAuthenticated();
  if (isAuthenticated) {
    return;
  }

  // Handle the redirect callback after login
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    await updateUI();
    window.history.replaceState({}, document.title, "/");
  }
});