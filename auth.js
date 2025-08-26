// auth.js
let auth0Client = null;

// 1. Configure the Auth0 Client
const configureClient = async () => {
  auth0Client = await auth0.createAuth0Client({
    domain: "teachertoybox.uk.auth0.com",
    clientId: "olhwjFTXOIx1mxJB2cn2BHVb1Vny1jZa",
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
};

// 2. Handle the redirect after login [UPDATED]
const handleRedirectCallback = async () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("code") && params.has("state")) {
    const { appState } = await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
    
    // Check if we need to perform an action after login
    if (appState && appState.target === 'upgrade') {
      // Fire a custom event that our main script can listen for
      document.dispatchEvent(new CustomEvent('postLoginAction', { detail: 'upgrade' }));
    }
  }
};

// 3. Main function to initialize authentication
const initializeAuth = async () => {
  await configureClient();
  await handleRedirectCallback();
  await updateUI();
};

// 4. Update UI based on authentication state
const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();
  const authButton = document.getElementById("authButton");
  const userProfileElement = document.getElementById("userProfile");
  const upgradeButton = document.getElementById("upgradeButton");

  // Reset premium status and set authentication status globally
  window.TT.isAuthenticated = isAuthenticated;
  window.TT.isPremium = false;
  document.body.classList.remove('is-premium');
  
  if (authButton) {
    if (isAuthenticated) {
      // --- Logged In State ---
      authButton.title = "Log Out";
      authButton.innerHTML = `<i class="fas fa-sign-out-alt"></i>`;
      authButton.classList.add('logout-btn');
      
      const user = await auth0Client.getUser();
      if (user && userProfileElement) {
          userProfileElement.innerHTML = `<img src="${user.picture}" alt="${user.name}" style="width: 40px; height: 40px; border-radius: 50%;">`;
          userProfileElement.style.display = 'flex';
      }

      // **FIX:** Force a refresh of the token from the server to get the latest roles
      await auth0Client.getTokenSilently({ cacheMode: 'off' });
      const claims = await auth0Client.getIdTokenClaims();
      
      // Check for the premium role and add a class to the body if it exists.
      // The CSS file will now handle showing/hiding the upgrade button.
      const userRoles = claims['http://teachertoybox.com/roles'] || [];
      if (userRoles.includes('Premium')) {
          window.TT.isPremium = true;
          document.body.classList.add('is-premium');
      }

    } else {
      // --- Logged Out State ---
      authButton.title = "Log In / Sign Up";
      authButton.innerHTML = `<i class="fas fa-sign-in-alt"></i>`;
      authButton.classList.remove('logout-btn');
      
      if (userProfileElement) userProfileElement.style.display = 'none';
    }
  }
};

// 5. Login and Logout functions (made globally accessible) [UPDATED]
window.login = async (action = 'default') => {
  await auth0Client.loginWithRedirect({
    appState: { target: action }
  });
};

window.logout = () => {
  auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
};

// Initialize Auth0 when the page loads
window.addEventListener('load', initializeAuth);