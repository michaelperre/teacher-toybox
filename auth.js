// auth.js
let auth0Client = null;

/**
 * Displays a custom error popup for 3 seconds, then reloads the page.
 * This is used for critical login failures, often caused by network issues.
 */
const showLoginErrorAndReload = () => {
  const backdrop = document.getElementById('error-popup-backdrop');
  if (backdrop) {
    backdrop.style.pointerEvents = 'auto'; // Make it visible to interactions if needed
    backdrop.classList.add('visible'); // Show the popup
  }

  // Wait for 3 seconds before reloading the page
  setTimeout(() => {
    window.location.reload();
  }, 3000);
};


// 1. Configure the Auth0 Client
const configureClient = async () => {
  try {
    auth0Client = await auth0.createAuth0Client({
      domain: "teachertoybox.uk.auth0.com",
      clientId: "olhwjFTXOIx1mxJB2cn2BHVb1Vny1jZa",
      authorizationParams: {
        redirect_uri: window.location.origin
      },
      useRefreshTokens: true,
      cacheLocation: 'localstorage'
    });
  } catch (err) {
    console.error("Auth0 configuration failed:", err);
    showLoginErrorAndReload();
  }
};

// 2. Handle the redirect after login
const handleRedirectCallback = async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("code") && params.has("state")) {
      const { appState } = await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
      
      if (appState && appState.target === 'upgrade') {
        setTimeout(() => {
          if (window.TT && typeof window.TT.initiateCheckout === 'function') {
            window.TT.initiateCheckout();
          }
        }, 500);
      }
    }
  } catch (err) {
    console.error("Auth0 redirect callback failed:", err);
    // You might not want to reload here, as it could cause a loop.
    // A simple error message might be better, but for now we'll stick to the request.
    showLoginErrorAndReload();
  }
};

// 3. Main function to initialize authentication
const initializeAuth = async () => {
  await configureClient();
  // If configureClient fails, it will call the error handler and this line won't be reached.
  if (auth0Client) {
      await handleRedirectCallback();
      await updateUI();
  }
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
  try {
    await auth0Client.loginWithRedirect({
      appState: { target: action }
    });
  } catch (err) {
    console.error("Auth0 login redirect failed:", err);
    showLoginErrorAndReload();
  }
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