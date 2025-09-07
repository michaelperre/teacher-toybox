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
    showLoginErrorAndReload();
  }
};

// 3. Main function to initialize authentication
const initializeAuth = async () => {
  await configureClient();
  if (auth0Client) {
      await handleRedirectCallback();
      await updateUI();
  }
};

// 4. Update UI based on authentication state (WITH BANNER LOGIC)
const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();
  const authButton = document.getElementById("authButton");
  const userProfileElement = document.getElementById("userProfile");
  const upgradeButton = document.getElementById('upgradeButton');

  window.TT.isAuthenticated = isAuthenticated;
  window.TT.isPremium = false;
  document.body.classList.remove('is-premium');
  document.body.classList.remove('is-trial');
  
  // Remove any existing trial banner on UI update
  const existingBanner = document.querySelector('.trial-countdown-banner');
  if (existingBanner) {
    existingBanner.remove();
  }
  
  if (authButton) {
    if (isAuthenticated) {
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
      const hasPremiumRole = userRoles.includes('Premium');
      const trialEndDateString = claims['http://teachertoybox.com/trial_ends_at'];
      let isStillInTrial = false;
      if (trialEndDateString) {
          const trialEndDate = new Date(trialEndDateString);
          if (trialEndDate > new Date()) {
              isStillInTrial = true;
          }
      }

      if (hasPremiumRole || isStillInTrial) {
          window.TT.isPremium = true;
          document.body.classList.add('is-premium');
      }

      if (isStillInTrial) {
        document.body.classList.add('is-trial');
        
        if (upgradeButton) {
            upgradeButton.style.display = 'flex';
        }
        
        const upgradePanelTitle = document.querySelector('#upgrade-panel h3 [data-i18n="panel.upgrade.title"]');
        const upgradePanelIntro = document.querySelector('#upgrade-panel p[data-i18n="panel.upgrade.intro"]');
        const panelUpgradeBtn = document.getElementById('panel-upgrade-btn');
        
        if (upgradePanelTitle) upgradePanelTitle.textContent = "Your Premium Trial is Active!";
        if (upgradePanelIntro) upgradePanelIntro.textContent = "Subscribe now to keep your premium features when your trial ends.";
        
        // Update the panel button text for trial users
        if (panelUpgradeBtn) {
            panelUpgradeBtn.innerHTML = `
                <div class="price-big">$2 a month</div>
                <div class="price-small">Subscription $24 billed annually</div>
            `;
        }


        // --- BANNER LOGIC ---
        const trialEndDate = new Date(trialEndDateString);
        const now = new Date();
        const daysRemaining = Math.ceil((trialEndDate - now) / (1000 * 60 * 60 * 24));

        if (daysRemaining > 0) {
            const banner = document.createElement('div');
            banner.className = 'trial-countdown-banner';
            const dayText = daysRemaining === 1 ? 'day' : 'days';
            banner.innerHTML = `
                <span>You have <strong>${daysRemaining} ${dayText}</strong> left in your premium trial.</span>
                <a href="#" id="banner-upgrade-link">
                    <div class="banner-price-big">$2 a month</div>
                    <div class="banner-price-small">Subscription $24 billed annually</div>
                </a>
            `;
            document.body.appendChild(banner);
            
            document.getElementById('banner-upgrade-link').onclick = (e) => {
                e.preventDefault();
                const upgradeBackdrop = document.getElementById('upgrade-backdrop');
                const upgradePanel = document.getElementById('upgrade-panel');
                if (upgradeBackdrop && upgradePanel) {
                    upgradeBackdrop.classList.remove('hidden');
                    upgradePanel.classList.add('open');
                }
            };
        }
        // --- END BANNER LOGIC ---

      } else if (hasPremiumRole) {
         if (upgradeButton) {
            upgradeButton.style.display = 'none';
         }
      }
      
    } else {
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