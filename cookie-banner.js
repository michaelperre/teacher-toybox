document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    // Check if the user has already consented to cookies by looking for a specific item in localStorage.
    // If the 'cookies_accepted' item is not found, it means it's a new visitor or they've cleared their cache.
    if (!localStorage.getItem('cookies_accepted')) {
        // If no consent is found, make the cookie banner visible.
        // The banner is hidden by default in the CSS to prevent it from flashing on screen for returning visitors.
        cookieBanner.style.display = 'flex';
    }

    // Ensure the accept button exists before adding a listener to it.
    if (acceptCookiesBtn) {
        // When the 'accept' button is clicked...
        acceptCookiesBtn.addEventListener('click', () => {
            // ...set an item in localStorage to remember the user's consent.
            // This will prevent the banner from showing up on their next visit.
            localStorage.setItem('cookies_accepted', 'true');
            
            // Start a fade-out animation for a smooth dismissal.
            cookieBanner.style.opacity = '0';
            
            // After the fade-out animation completes (500ms), set the display to 'none'
            // to remove it from the page layout entirely.
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 500); 
        });
    }
});