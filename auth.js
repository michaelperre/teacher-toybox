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
    // These settings create a more durable login session
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
    
    if (appState && appState.target === 'upgrade') {
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
  // We will now call updateUI after the DOM is loaded.
};

// 4. Update UI based on authentication state
const updateUI = async () => {
  if (!auth0Client) return; // Add a guard clause

  const isAuthenticated = await auth0Client.isAuthenticated();
  const authButton = document.getElementById("authButton");
  const userProfileElement = document.getElementById("userProfile");

  // Ensure the global TT object exists before trying to modify it.
  window.TT = window.TT || {};
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

    // Enable the button and add the final click listener now that everything is loaded.
    authButton.disabled = false;
    authButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const authed = await auth0Client.isAuthenticated();
        if (authed) {
            logout();
        } else {
            login();
        }
    });
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

// **THE FIX**: Defer initialization and UI updates until the DOM is fully loaded.
window.addEventListener('DOMContentLoaded', async () => {
    await initializeAuth();
    await updateUI();
});

