// auth.js
let auth0Client = null;

// 1. Configure the Auth0 Client
const configureClient = async () => {
  auth0Client = await auth0.createAuth0Client({
    // V V V V  REPLACE THIS LINE V V V V
    domain: "teachertoybox.uk.auth0.com", // e.g., "teachertoybox.uk.auth0.com"
    // V V V V  REPLACE THIS LINE V V V V
    clientId: "olhwjFTXOIx1mxJB2cn2BHVb1Vny1jZa", // e.g., "a1b2c3d4e5f6g7h8i9j0"
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
};

// 2. Handle the redirect after login
const handleRedirectCallback = async () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("code") && params.has("state")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
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
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");
  const userProfileElement = document.getElementById("userProfile");

  if (isAuthenticated) {
    loginButton.style.display = "none";
    logoutButton.style.display = "flex";

    const user = await auth0Client.getUser();
    if (user && userProfileElement) {
        userProfileElement.innerHTML = `<img src="${user.picture}" alt="${user.name}" style="width: 40px; height: 40px; border-radius: 50%;">`;
        userProfileElement.style.display = 'flex';
    }

  } else {
    loginButton.style.display = "flex";
    logoutButton.style.display = "none";
    if (userProfileElement) userProfileElement.style.display = 'none';
  }
};

// 5. Login and Logout functions (made globally accessible)
window.login = async () => {
  await auth0Client.loginWithRedirect();
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