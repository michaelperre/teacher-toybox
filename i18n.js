(function () {
    // Create a unique namespace on the window object
    window.TT_I18N = {};

    const SUPPORTED = {
      en: "English", cs: "Čeština", es: "Español", uk: "Українська", zh: "中文（简体）", hi: "हिन्दी", fr: "Français", ar: "العربية", fa: "فارسی", pt: "Português", ru: "Русский"
    };

    // Move the translation data into the namespace
    window.TT_I18N.data = {
      en: {
          meta: { title: "Teacher Toybox | Free Interactive Digital Whiteboard for Classrooms", titleShort: "Teacher Toybox | Interactive Whiteboard", description: "Teacher Toybox is a free interactive digital whiteboard with timers, dice and more to make lessons engaging. No installation required.", keywords: "digital whiteboard, interactive whiteboard, teacher tools, classroom resources, free teacher tools, online timer, classroom activities, education" },
          site: { brand: "Teacher Toybox", subtitle: "A whiteboard built by teachers for teachers." },
          lang: { label: "Language" },
          btn: { tablet: "Tablet Edition", "tablet.title": "Switch to Tablet Edition", clock: "Toggle Live Clock (K)", add: "Add New Window (N)", layouts: "Toggle Layouts (L)", colour: "Website Colour (X)", color: "Select Accent Color (C)", magic: "Extract Color from Content (M)", themePalette: "Theme Palette (Z)", originalColor: "Original Colour", bell: "Ring Bell (B)", shh: "Shush Sound (S)", "shh.label": "Shh", management: "Classroom Management Tools (/)", help: "Help & Resources (?)", laser: "Toggle Laser Pointer (P)", tour: "Start Guided Tour", demo: "Show Demo Video", info: "Show Information", contact: "Contact Us", refresh: "Refresh Page (R)", share: "Share with a Friend (J)", feedback: "Provide Feedback (F)", coffee: "Buy Me a Coffee (Y)", upgrade: "Upgrade to Premium (U)", communication: "Communication (F)" },
          layout: { 1: "Layout 1: Full Screen (1)", 2: "Layout 2: Split Vertical (2)", 3: "Layout 3: Main Left (3)", 4: "Layout 4: Main Right (4)", 5: "Layout 5: Four Quadrants (5)", 6: "Layout 6: Tall Right Column (6)", 7: "Layout 7: 1-2-2 Column (7)" },
          panel: {
              upgrade: { title: "Go Premium", intro: "Supercharge your classroom by unlocking every interactive tool in the Teacher Toybox!", feature1_title: "Unlock All Tools", feature1_desc: "Get immediate access to every premium tool.", feature2_title: "Webcam & Document Camera", feature2_desc: "Use your webcam for live demonstrations.", feature3_title: "Photo Carousel", feature3_desc: "Create engaging visual stories and slideshows.", feature4_title: "Gamify Lessons", feature4_desc: "Use the Dice Roller and Counters to make learning fun.", feature5_title: "Manage Time", feature5_desc: "Effortlessly manage classroom time with timers and stopwatches.", feature6_title: "Advanced Control", feature6_desc: "Adjust opacity and layer your windows for the perfect setup.", feature7_title: "Future Tools", feature7_desc: "Automatically get every new premium tool we release.", feature8_title: "Support Development", feature8_desc: "Help keep the core platform free for all teachers." },
              contact: {
                title: "Contact Us",
                intro: "Have a question or a suggestion? We'd love to hear from you.",
                nameLabel: "Your Name",
                emailLabel: "Your Email",
                messageLabel: "Message",
                submitButton: "Send Message",
                submitButtonSending: "Sending...",
                submitButtonSuccess: "Message Sent!"
              },
              share: { title: "Share with a Friend" },
              feedback: { title: "Provide Feedback", intro: "We'd love to hear your thoughts!", ratingLegend: "How would you rate your experience?", commentsLabel: "Comments", commentsPlaceholder: "Tell us what you liked or what could be improved...", submitButton: "Submit", submitButtonSending: "Sending...", submitButtonSuccess: "Thank You!" }
          },
          tour: {
              step1: { title: "Welcome to Teacher Toybox!", content: "This is your digital classroom command center. Let's quickly walk through the main controls. Click \"Next\" to continue." },
              step2: { title: "Add a Window", content: "This button adds a new window. If one isn't open already, I'll click it for you so we can look at the window tools." },
              step3: { title: "Window Tool Palette", content: "Excellent! This is the tool palette for the new window. It has tools like a drawing canvas and text editor." },
              step4: { title: "Drawing Canvas", content: "For example, clicking this button turns the window into an interactive whiteboard. Let's try it." },
              step5: { title: "Arrange Your Screen", content: "This button reveals preset layouts. You can instantly organize your windows into splitscreen, quadrants, and more." },
              step6: { title: "Move & Resize", content: "You can also drag this bar to move windows, and resize them from any edge or corner." },
              step7: { title: "Help & Resources", content: "That's the basics! This button groups together the tour, demo video, and more information. Click 'Finish' to start exploring." }
          }
      },
      // ... other languages remain the same
    };

    // Move the translation function into the namespace
    window.TT_I18N.t = function(dict, path) {
      try {
        return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, dict);
      } catch { return undefined; }
    }
    
    // Internal functions now reference the namespaced objects
    const I18N_DATA = window.TT_I18N.data;
    const t = window.TT_I18N.t;

    function updateMeta(lang) {
      const dict = I18N_DATA[lang] || I18N_DATA.en;
      const title = t(dict, "meta.title"), titleShort = t(dict, "meta.titleShort") || title, desc = t(dict, "meta.description");
      if (title) document.title = title;
      if (desc) {
        const m = document.querySelector('meta[name="description"]'); if (m) m.setAttribute('content', desc);
        const ogd = document.querySelector('meta[property="og:description"]'); if (ogd) ogd.setAttribute('content', desc);
        const twd = document.querySelector('meta[name="twitter:description"]'); if (twd) twd.setAttribute('content', desc);
      }
      if (titleShort) {
        const ogt = document.querySelector('meta[property="og:title"]'); if (ogt) ogt.setAttribute('content', titleShort);
        const twt = document.querySelector('meta[name="twitter:title"]'); if (twt) twt.setAttribute('content', titleShort);
      }
    }

    function updateSchema(lang) {
        const dict = I18N_DATA[lang] || I18N_DATA.en;
        const schemaEl = document.getElementById('schema-ld');
        if (!schemaEl) return;

        const name = t(dict, "meta.titleShort");
        const description = t(dict, "meta.description");
        const keywords = t(dict, "meta.keywords");

        try {
            const schema = JSON.parse(schemaEl.textContent);
            if (name) schema.name = name;
            if (description) schema.description = description;
            if (keywords) schema.keywords = keywords;
            schemaEl.textContent = JSON.stringify(schema, null, 2);
        } catch (e) {
            console.error("Failed to update JSON-LD schema", e);
        }
    }

    function applyLang(lang) {
      const dict = I18N_DATA[lang] || I18N_DATA.en;
      localStorage.setItem('ttx_lang', lang);
      document.documentElement.lang = lang;

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const val = t(dict, el.dataset.i18n) || t(I18N_DATA.en, el.dataset.i18n);
        if (typeof val === 'string') el.textContent = val;
      });

      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        const val = t(dict, key) || t(I18N_DATA.en, key);
        if (typeof val === 'string') el.setAttribute('title', val);
      });
      
      const feedbackComment = document.getElementById('feedback-comment');
      if (feedbackComment) {
          const placeholderText = t(dict, 'panel.feedback.commentsPlaceholder') || t(I18N_DATA.en, 'panel.feedback.commentsPlaceholder');
          if (placeholderText) feedbackComment.setAttribute('placeholder', placeholderText);
      }

      const shh = document.getElementById('shhButton');
      if (shh) {
        const label = t(dict, 'btn.shh.label') || 'Shh';
        const hk = shh.querySelector('.hotkey-label');
        shh.innerHTML = label + (hk ? hk.outerHTML : '');
      }

      const langLabel = document.querySelector('label[for="langSelect"][data-i18n="lang.label"]');
      if (langLabel) {
        const s = t(dict, 'lang.label') || 'Language';
        langLabel.textContent = s;
      }

      updateMeta(lang);
      updateSchema(lang);
      
      if (window.TT && typeof window.TT.updateDateDisplay === 'function') {
          window.TT.updateDateDisplay(lang);
      }

      if (window.TT && typeof window.TT.updateInfoWindowLanguage === 'function') {
        window.TT.updateInfoWindowLanguage(lang);
      }
    }

    async function detectLanguage() {
      // ... this function remains the same
    }

    async function initPicker() {
      // ... this function remains the same
    }

    document.addEventListener('click', (e) => {
      if (e.target.id === 'infoButton') {
        const sel = document.getElementById('langSelect');
        const chosen = (sel ? sel.value : 'en');
        setTimeout(() => {
          const infoSel = document.querySelector('.info-language-selector');
          if (infoSel) {
            infoSel.value = chosen;
            infoSel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, 50);
      }
    });

    document.addEventListener('DOMContentLoaded', initPicker);
})();