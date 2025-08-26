// auth.js
let auth0Client = null;

// 1. Configure the Auth0 Client
const configureClient = async () => {
  auth0Client = await auth0.createAuth0Client({
    domain: "teachertoybox.uk.auth0.com",
    clientId: "olhwjFTXOIx1mxJB2cn2BHVb1Vny1jZa",
    authorizationParams: {
      redirect_uri: window.location.origin
    },
    useRefreshTokens: true,
    cacheLocation: 'localstorage'
  });
};

// 2. Handle the redirect after login
const handleRedirectCallback = async () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("code") && params.has("state")) {
    const { appState } = await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
    
    // **THE FIX**: If the user's goal was to upgrade,
    // call the checkout function directly now that they are logged in.
    if (appState && appState.target === 'upgrade') {
      // We use a short timeout to ensure the rest of the app has initialized.
      setTimeout(() => {
        if (window.TT && typeof window.TT.initiateCheckout === 'function') {
          window.TT.initiateCheckout();
        }
      }, 500);
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

      const claims = await auth0Client.getIdTokenClaims();
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

// 5. Login and Logout functions
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
