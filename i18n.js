(function () {
    const SUPPORTED = {
      en: "English", ar: "العربية", bn: "বাংলা", cs: "Čeština", de: "Deutsch", es: "Español", fa: "فارسی", fr: "Français", hi: "हिन्दी", id: "Bahasa Indonesia", ja: "日本語", ko: "한국어", pt: "Português", ru: "Русский", tr: "Türkçe", uk: "Українська", zh: "中文（简体）"
    };

    window.I18N = {
      en: {
          meta: { title: "Teacher Toybox | Free Interactive Digital Whiteboard for Classrooms", titleShort: "Teacher Toybox | Interactive Whiteboard", description: "Teacher Toybox is a free interactive digital whiteboard with timers, dice and more to make lessons engaging. No installation required.", keywords: "digital whiteboard, interactive whiteboard, teacher tools, classroom resources, free teacher tools, online timer, classroom activities, education" },
          site: { brand: "Teacher Toybox", subtitle: "A whiteboard built by teachers for teachers." },
          lang: { label: "Language" },
          btn: { tablet: "Tablet Edition", "tablet.title": "Switch to Tablet Edition", clock: "Toggle Live Clock (K)", add: "Add New Window (N)", layouts: "Toggle Layouts (L)", colour: "Website Colour (X)", color: "Select Accent Color (C)", magic: "Extract Color from Content (M)", themePalette: "Theme Palette (Z)", bell: "Ring Bell (B)", shh: "Shush Sound (S)", "shh.label": "Shh", management: "Classroom Management Tools (/)", help: "Help & Resources (?)", laser: "Toggle Laser Pointer (P)", tour: "Start Guided Tour", demo: "Show Demo Video", info: "Show Information", refresh: "Refresh Page (R)", share: "Share with a Friend (J)", feedback: "Provide Feedback (F)", coffee: "Buy Me a Coffee (Y)", upgrade: "Upgrade to Premium (U)" },
          layout: { 1: "Layout 1: Full Screen (1)", 2: "Layout 2: Split Vertical (2)", 3: "Layout 3: Main Left (3)", 4: "Layout 4: Main Right (4)", 5: "Layout 5: Four Quadrants (5)", 6: "Layout 6: Tall Right Column (6)", 7: "Layout 7: 1-2-2 Column (7)" },
          panel: {
              upgrade: { title: "Go Premium", intro: "Supercharge your classroom by unlocking every interactive tool in the Teacher Toybox!", feature1_title: "Unlock All Tools", feature1_desc: "Get immediate access to every premium tool.", feature2_title: "Webcam & Document Camera", feature2_desc: "Use your webcam for live demonstrations.", feature3_title: "Photo Carousel", feature3_desc: "Create engaging visual stories and slideshows.", feature4_title: "Gamify Lessons", feature4_desc: "Use the Dice Roller and Counters to make learning fun.", feature5_title: "Manage Time", feature5_desc: "Effortlessly manage classroom time with timers and stopwatches.", feature6_title: "Advanced Control", feature6_desc: "Adjust opacity and layer your windows for the perfect setup.", feature7_title: "Future Tools", feature7_desc: "Automatically get every new premium tool we release.", feature8_title: "Support Development", feature8_desc: "Help keep the core platform free for all teachers." },
              share: { title: "Spread the Word!" },
              feedback: { title: "Provide Feedback", intro: "We'd love to hear your thoughts!", ratingLegend: "How would you rate your experience?", commentsLabel: "Comments", commentsPlaceholder: "Tell us what you liked or what could be improved...", submitButton: "Submit", submitButtonSending: "Sending...", submitButtonSuccess: "Thank You!" }
          }
      },
      ar: {
          meta: { title: "Teacher Toybox | سبورة رقمية تفاعلية مجانية للفصول الدراسية", titleShort: "Teacher Toybox | سبورة تفاعلية", description: "Teacher Toybox هي سبورة رقمية تفاعلية مجانية بها مؤقتات ونرد وغير ذلك لجعل الدروس جذابة. لا يلزم التثبيت.", keywords: "سبورة رقمية, سبورة تفاعلية, أدوات المعلم, موارد الفصل الدراسي, أدوات المعلم المجانية, مؤقت عبر الإنترنت, أنشطة الفصل, التعليم" },
          site: { brand: "Teacher Toybox", subtitle: "سبورة بناها معلمون للمعلمين." },
          lang: { label: "اللغة" },
          btn: { tablet: "إصدار الجهاز اللوحي", "tablet.title": "التبديل إلى إصدار الجهاز اللوحي", clock: "تبديل الساعة (K)", add: "إضافة نافذة جديدة (N)", layouts: "تبديل التخطيطات (L)", colour: "لون الموقع (X)", color: "تحديد لون (C)", magic: "استخراج اللون (M)", themePalette: "لوحة السمات (Z)", bell: "رنين الجرس (B)", shh: "صوت 'صه' (S)", "shh.label": "صه", management: "أدوات الإدارة (/)", help: "مساعدة (؟)", laser: "مؤشر الليزر (P)", tour: "بدء الجولة", demo: "فيديو تجريبي", info: "معلومات", refresh: "تحديث (R)", share: "مشاركة (J)", feedback: "تقديم ملاحظات (F)", coffee: "اشتر لي قهوة (Y)", upgrade: "الترقية إلى بريميوم (U)" },
          layout: { 1: "التخطيط 1: ملء الشاشة (1)", 2: "التخطيط 2: تقسيم عمودي (2)", 3: "التخطيط 3: الرئيسي على اليسار (3)", 4: "التخطيط 4: الرئيسي على اليمين (4)", 5: "التخطيط 5: أربعة أرباع (5)", 6: "التخطيط 6: عمود أيمن طويل (6)", 7: "التخطيط 7: عمود 1-2-2 (7)" },
          panel: {
              upgrade: { title: "انتقل إلى بريميوم", intro: "قم بتعزيز فصلك الدراسي عن طريق فتح كل أداة تفاعلية في Teacher Toybox!", feature1_title: "فتح جميع الأدوات", feature1_desc: "احصل على وصول فوري إلى كل أداة متميزة.", feature2_title: "كاميرا الويب وكاميرا المستندات", feature2_desc: "استخدم كاميرا الويب الخاصة بك للعروض التوضيحية الحية.", feature3_title: "دائري الصور", feature3_desc: "أنشئ قصصًا مرئية وعروض شرائح جذابة.", feature4_title: "أضف طابع الألعاب على الدروس", feature4_desc: "استخدم أداة رمي النرد والعدادات لجعل التعلم ممتعًا.", feature5_title: "إدارة الوقت", feature5_desc: "إدارة وقت الفصل بسهولة باستخدام المؤقتات وساعات الإيقاف.", feature6_title: "تحكم متقدم", feature6_desc: "اضبط العتامة وقم بوضع طبقات على نوافذك للحصول على إعداد مثالي.", feature7_title: "أدوات مستقبلية", feature7_desc: "احصل تلقائيًا على كل أداة متميزة جديدة نصدرها.", feature8_title: "دعم التطوير", feature8_desc: "ساعد في الحفاظ على النظام الأساسي مجانيًا لجميع المعلمين." },
              share: { title: "انشر الخبر!" },
              feedback: { title: "تقديم ملاحظات", intro: "يسعدنا أن نسمع أفكارك!", ratingLegend: "كيف تقيم تجربتك؟", commentsLabel: "تعليقات", commentsPlaceholder: "أخبرنا بما أعجبك أو ما يمكن تحسينه ...", submitButton: "إرسال", submitButtonSending: "جار الإرسال ...", submitButtonSuccess: "شكرًا لك!" }
          }
      },
      bn: {
          meta: { title: "টিচার টয়বক্স | শ্রেণীকক্ষের জন্য বিনামূল্যে ইন্টারেক্টিভ ডিজিটাল হোয়াইটবোর্ড", titleShort: "টিচার টয়বক্স | ইন্টারেক্টিভ হোয়াইটবোর্ড", description: "টিচার টয়বক্স একটি বিনামূল্যে ইন্টারেক্টিভ ডিজিটাল হোয়াইটবোর্ড যা পাঠকে আকর্ষণীয় করার জন্য টাইমার, ডাইস এবং আরও অনেক কিছু দিয়ে সজ্জিত। কোন ইনস্টলেশনের প্রয়োজন নেই।", keywords: "ডিজিটাল হোয়াইটবোর্ড, ইন্টারেক্টিভ হোয়াইটবোর্ড, শিক্ষকের সরঞ্জাম, শ্রেণীকক্ষের সম্পদ, বিনামূল্যে শিক্ষকের সরঞ্জাম, অনলাইন টাইমার, শ্রেণীকক্ষের কার্যকলাপ, শিক্ষা" },
          site: { brand: "Teacher Toybox", subtitle: "শিক্ষকদের দ্বারা শিক্ষকদের জন্য নির্মিত একটি হোয়াইটবোর্ড।" },
          lang: { label: "ভাষা" },
          btn: { tablet: "ট্যাবলেট সংস্করণ", "tablet.title": "ট্যাবলেট সংস্করণে স্যুইচ করুন", clock: "লাইভ ঘড়ি টগল করুন (K)", add: "নতুন উইন্ডো যোগ করুন (N)", layouts: "লেআউট টগল করুন (L)", colour: "ওয়েবসাইটের রঙ (X)", color: "অ্যাকসেন্ট রঙ নির্বাচন করুন (C)", magic: "বিষয়বস্তু থেকে রঙ বের করুন (M)", themePalette: "থিম প্যালেট (Z)", bell: "ঘণ্টা বাজান (B)", shh: "شش শব্দ (S)", "shh.label": "شش", management: "শ্রেণীকক্ষ ব্যবস্থাপনা সরঞ্জাম (/)", help: "সহায়তা ও সম্পদ (?)", laser: "লেজার পয়েন্টার টগল করুন (P)", tour: "গাইডেড ট্যুর শুরু করুন", demo: "ডেমো ভিডিও দেখুন", info: "তথ্য দেখুন", refresh: "পৃষ্ঠা রিফ্রেশ করুন (R)", share: "বন্ধুর সাথে শেয়ার করুন (J)", feedback: "মতামত দিন (F)", coffee: "আমাকে একটি কফি কিনুন (Y)", upgrade: "প্রিমিয়ামে আপগ্রেড করুন (U)" },
          layout: { 1: "বিন্যাস ১: পূর্ণ স্ক্রীন (1)", 2: "বিন্যাস ২: উল্লম্ব বিভাজন (2)", 3: "বিন্যাস ৩: প্রধান বাম (3)", 4: "বিন্যাস ৪: প্রধান ডান (4)", 5: "বিন্যাস ৫: চার চতুর্থাংশ (5)", 6: "বিন্যাস ৬: লম্বা ডান কলাম (6)", 7: "বিন্যাস ৭: ১-২-২ কলাম (7)" },
          panel: {
              upgrade: { title: "প্রিমিয়ামে যান", intro: "টিচার টয়বক্সের প্রতিটি ইন্টারেক্টিভ টুল আনলক করে আপনার শ্রেণীকক্ষকে সুপারচার্জ করুন!", feature1_title: "সমস্ত টুল আনলক করুন", feature1_desc: "প্রতিটি প্রিমিয়াম টুলে অবিলম্বে অ্যাক্সেস পান।", feature2_title: "ওয়েবক্যাম এবং ডকুমেন্ট ক্যামেরা", feature2_desc: "লাইভ প্রদর্শনের জন্য আপনার ওয়েবক্যাম ব্যবহার করুন।", feature3_title: "ফটো ক্যারোসেল", feature3_desc: "আকর্ষণীয় ভিজ্যুয়াল গল্প এবং স্লাইডশো তৈরি করুন।", feature4_title: "পাঠকে গেমিফাই করুন", feature4_desc: "শেখা মজাদার করতে ডাইস রোলার এবং কাউন্টার ব্যবহার করুন।", feature5_title: "সময় পরিচালনা করুন", feature5_desc: "টাইমার এবং স্টপওয়াচ দিয়ে অনায়াসে শ্রেণীকক্ষের সময় পরিচালনা করুন।", feature6_title: "উন্নত নিয়ন্ত্রণ", feature6_desc: "নিখুঁত সেটআপের জন্য অস্বচ্ছতা সামঞ্জস্য করুন এবং আপনার উইন্ডোগুলিকে স্তর করুন।", feature7_title: "ভবিষ্যতের সরঞ্জাম", feature7_desc: "আমরা প্রকাশ করা প্রতিটি নতুন প্রিমিয়াম টুল স্বয়ংক্রিয়ভাবে পান।", feature8_title: "উন্নয়নে সহায়তা করুন", feature8_desc: "মূল প্ল্যাটফর্মটি সকল শিক্ষকের জন্য বিনামূল্যে রাখতে সহায়তা করুন।" },
              share: { title: "কথাটি ছড়িয়ে দিন!" },
              feedback: { title: "মতামত দিন", intro: "আমরা আপনার চিন্তা শুনতে চাই!", ratingLegend: "আপনি আপনার অভিজ্ঞতাকে কীভাবে রেট দেবেন?", commentsLabel: "মন্তব্য", commentsPlaceholder: "আমাদের বলুন আপনি কী পছন্দ করেছেন বা কী উন্নত করা যেতে পারে...", submitButton: "জমা দিন", submitButtonSending: "পাঠানো হচ্ছে...", submitButtonSuccess: "ধন্যবাদ!" }
          }
      },
      cs: {
          meta: { title: "Teacher Toybox | Zdarma interaktivní tabule pro učitele", titleShort: "Teacher Toybox | Interaktivní tabule", description: "Teacher Toybox je zdarma interaktivní digitální tabule s časovači, kostkami a dalšími nástroji. Není potřeba instalace.", keywords: "digitální tabule, interaktivní tabule, nástroje pro učitele, zdroje pro třídu, bezplatné nástroje pro učitele, online časovač, aktivity ve třídě, vzdělávání" },
          site: { brand: "Teacher Toybox", subtitle: "Tabule vytvořená učiteli pro učitele." },
          lang: { label: "Jazyk" },
          btn: { tablet: "Verze pro tablet", "tablet.title": "Přepnout na verzi pro tablet", clock: "Zobrazit/skryt živé hodiny (K)", add: "Přidat nové okno (N)", layouts: "Přepnout nástroje rozložení (L)", colour: "Barva webu (X)", color: "Zvolit zvýrazňovací barvu (C)", magic: "Extrahovat barvu z obsahu (M)", themePalette: "Paleta motivů (Z)", bell: "Zazvonit (B)", shh: "Zvuk Ticho (S)", "shh.label": "Pšš", management: "Nástroje pro správu třídy (/)", help: "Nápověda a zdroje (?)", laser: "Přepnout laserové ukazovátko (P)", tour: "Spustit prohlídku", demo: "Zobrazit ukázkové video", info: "Zobrazit informace", refresh: "Obnovit stránku (R)", share: "Sdílet s přítelem (J)", feedback: "Zpětná vazba (F)", coffee: "Pozvat na kávu (Y)", upgrade: "Přejít na Premium (U)" },
          layout: { 1: "Rozvržení 1: Celá obrazovka (1)", 2: "Rozvržení 2: Vertikální rozdělení (2)", 3: "Rozvržení 3: Vlevo hlavní (3)", 4: "Rozvržení 4: Vpravo hlavní (4)", 5: "Rozvržení 5: Čtyři kvadranty (5)", 6: "Rozvržení 6: Vysoký pravý sloupec (6)", 7: "Rozvržení 7: 1-2-2 sloupce (7)" },
          panel: {
              upgrade: { title: "Přejít na Premium", intro: "Vylepšete svou třídu odemknutím všech interaktivních nástrojů v Teacher Toybox!", feature1_title: "Odemknout všechny nástroje", feature1_desc: "Získejte okamžitý přístup ke všem prémiovým nástrojům.", feature2_title: "Webkamera a Dokumentová kamera", feature2_desc: "Použijte svou webkameru pro živé ukázky.", feature3_title: "Fotogalerie", feature3_desc: "Vytvářejte poutavé vizuální příběhy a prezentace.", feature4_title: "Gamifikace lekcí", feature4_desc: "Použijte kostky a počítadla, aby bylo učení zábavné.", feature5_title: "Správa času", feature5_desc: "Snadno spravujte čas ve třídě pomocí časovačů a stopek.", feature6_title: "Pokročilé ovládání", feature6_desc: "Upravte průhlednost a vrstvěte okna pro dokonalé nastavení.", feature7_title: "Budoucí nástroje", feature7_desc: "Automaticky získejte každý nový prémiový nástroj, který vydáme.", feature8_title: "Podpořte vývoj", feature8_desc: "Pomozte udržet základní platformu zdarma pro všechny učitele." },
              share: { title: "Šířit dál!" },
              feedback: { title: "Poskytnout zpětnou vazbu", intro: "Rádi bychom slyšeli vaše názory!", ratingLegend: "Jak byste ohodnotili svou zkušenost?", commentsLabel: "Komentáře", commentsPlaceholder: "Řekněte nám, co se vám líbilo nebo co by se dalo vylepšit...", submitButton: "Odeslat", submitButtonSending: "Odesílání...", submitButtonSuccess: "Děkujeme!" }
          }
      },
      de: {
          meta: { title: "Teacher Toybox | Kostenloses interaktives digitales Whiteboard für Klassenzimmer", titleShort: "Teacher Toybox | Interaktives Whiteboard", description: "Teacher Toybox ist ein kostenloses interaktives digitales Whiteboard mit Timern, Würfeln und mehr, um den Unterricht ansprechend zu gestalten. Keine Installation erforderlich.", keywords: "digitales Whiteboard, interaktives Whiteboard, Lehrerwerkzeuge, Unterrichtsmaterialien, kostenlose Lehrerwerkzeuge, Online-Timer, Unterrichtsaktivitäten, Bildung" },
          site: { brand: "Teacher Toybox", subtitle: "Ein Whiteboard, von Lehrern für Lehrer gemacht." },
          lang: { label: "Sprache" },
          btn: { tablet: "Tablet-Version", "tablet.title": "Zur Tablet-Version wechseln", clock: "Live-Uhr umschalten (K)", add: "Neues Fenster hinzufügen (N)", layouts: "Layouts umschalten (L)", colour: "Website-Farbe (X)", color: "Akzentfarbe auswählen (C)", magic: "Farbe aus Inhalt extrahieren (M)", themePalette: "Themenpalette (Z)", bell: "Glocke läuten (B)", shh: "Pst-Ton (S)", "shh.label": "Pst", management: "Klassenraum-Management-Tools (/)", help: "Hilfe & Ressourcen (?)", laser: "Laserpointer umschalten (P)", tour: "Geführte Tour starten", demo: "Demo-Video ansehen", info: "Informationen anzeigen", refresh: "Seite aktualisieren (R)", share: "Mit einem Freund teilen (J)", feedback: "Feedback geben (F)", coffee: "Kauf mir einen Kaffee (Y)", upgrade: "Auf Premium upgraden (U)" },
          layout: { 1: "Layout 1: Vollbild (1)", 2: "Layout 2: Vertikal geteilt (2)", 3: "Layout 3: Hauptbereich links (3)", 4: "Layout 4: Hauptbereich rechts (4)", 5: "Layout 5: Vier Quadranten (5)", 6: "Layout 6: Hohe rechte Spalte (6)", 7: "Layout 7: 1-2-2 Spalte (7)" },
          panel: {
              upgrade: { title: "Premium werden", intro: "Laden Sie Ihr Klassenzimmer auf, indem Sie jedes interaktive Werkzeug in der Teacher Toybox freischalten!", feature1_title: "Alle Werkzeuge freischalten", feature1_desc: "Erhalten Sie sofortigen Zugriff auf jedes Premium-Werkzeug.", feature2_title: "Webcam & Dokumentenkamera", feature2_desc: "Verwenden Sie Ihre Webcam für Live-Demonstrationen.", feature3_title: "Fotokarussell", feature3_desc: "Erstellen Sie ansprechende visuelle Geschichten und Diashows.", feature4_title: "Unterricht spielerisch gestalten", feature4_desc: "Verwenden Sie den Würfelroller und die Zähler, um das Lernen unterhaltsam zu gestalten.", feature5_title: "Zeitmanagement", feature5_desc: "Verwalten Sie mühelos die Unterrichtszeit mit Timern und Stoppuhren.", feature6_title: "Erweiterte Steuerung", feature6_desc: "Passen Sie die Deckkraft an und schichten Sie Ihre Fenster für das perfekte Setup.", feature7_title: "Zukünftige Werkzeuge", feature7_desc: "Erhalten Sie automatisch jedes neue Premium-Werkzeug, das wir veröffentlichen.", feature8_title: "Unterstützen Sie die Entwicklung", feature8_desc: "Helfen Sie mit, die Kernplattform für alle Lehrer kostenlos zu halten." },
              share: { title: "Weitersagen!" },
              feedback: { title: "Feedback geben", intro: "Wir würden gerne Ihre Meinung hören!", ratingLegend: "Wie würden Sie Ihre Erfahrung bewerten?", commentsLabel: "Kommentare", commentsPlaceholder: "Sagen Sie uns, was Ihnen gefallen hat oder was verbessert werden könnte...", submitButton: "Senden", submitButtonSending: "Senden...", submitButtonSuccess: "Vielen Dank!" }
          }
      },
      es: {
          meta: { title: "Teacher Toybox | Pizarra Digital Interactiva y Gratuita para Aulas", titleShort: "Teacher Toybox | Pizarra Interactiva", description: "Teacher Toybox es una pizarra digital interactiva gratuita con temporizadores, dados y más para hacer las lecciones más atractivas. No requiere instalación.", keywords: "pizarra digital, pizarra interactiva, herramientas para profesores, recursos para el aula, herramientas gratuitas para profesores, temporizador en línea, actividades para el aula, educación" },
          site: { brand: "Teacher Toybox", subtitle: "Una pizarra hecha por profesores para profesores." },
          lang: { label: "Idioma" },
          btn: { tablet: "Edición Tableta", "tablet.title": "Cambiar a Edición Tableta", clock: "Activar Reloj (K)", add: "Añadir Ventana (N)", layouts: "Cambiar Diseños (L)", colour: "Color del Sitio Web (X)", color: "Seleccionar Color (C)", magic: "Extraer Color del Contenido (M)", themePalette: "Paleta de Temas (Z)", bell: "Tocar Campana (B)", shh: "Sonido de Silencio (S)", "shh.label": "Shh", management: "Herramientas de Gestión (/)", help: "Ayuda y Recursos (?)", laser: "Activar Puntero Láser (P)", tour: "Iniciar Tour Guiado", demo: "Ver Vídeo Demo", info: "Mostrar Información", refresh: "Recargar Página (R)", share: "Compartir (J)", feedback: "Enviar Comentarios (F)", coffee: "Invítame a un café (Y)", upgrade: "Actualizar a Premium (U)" },
          layout: { 1: "Diseño 1: Pantalla Completa (1)", 2: "Diseño 2: División Vertical (2)", 3: "Diseño 3: Principal Izquierda (3)", 4: "Diseño 4: Principal Derecha (4)", 5: "Diseño 5: Cuatro Cuadrantes (5)", 6: "Diseño 6: Columna Derecha Alta (6)", 7: "Diseño 7: Columna 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Hazte Premium", intro: "¡Potencia tu aula desbloqueando todas las herramientas interactivas de Teacher Toybox!", feature1_title: "Desbloquea Todo", feature1_desc: "Obtén acceso inmediato a todas las herramientas premium.", feature2_title: "Webcam y Cámara de Documentos", feature2_desc: "Usa tu webcam para demostraciones en vivo.", feature3_title: "Carrusel de Fotos", feature3_desc: "Crea historias visuales y presentaciones atractivas.", feature4_title: "Gamifica las Lecciones", feature4_desc: "Usa el Lanzador de Dados y los Contadores para que aprender sea divertido.", feature5_title: "Gestiona el Tiempo", feature5_desc: "Gestiona sin esfuerzo el tiempo en el aula con temporizadores y cronómetros.", feature6_title: "Control Avanzado", feature6_desc: "Ajusta la opacidad y superpón tus ventanas para una configuración perfecta.", feature7_title: "Herramientas Futuras", feature7_desc: "Recibe automáticamente cada nueva herramienta premium que lancemos.", feature8_title: "Apoya el Desarrollo", feature8_desc: "Ayuda a mantener la plataforma principal gratuita para todos los profesores." },
              share: { title: "¡Corre la voz!" },
              feedback: { title: "Enviar Comentarios", intro: "¡Nos encantaría conocer tu opinión!", ratingLegend: "¿Cómo calificarías tu experiencia?", commentsLabel: "Comentarios", commentsPlaceholder: "Dinos qué te gustó o qué podríamos mejorar...", submitButton: "Enviar", submitButtonSending: "Enviando...", submitButtonSuccess: "¡Gracias!" }
          }
      },
      fa: {
          meta: { title: "Teacher Toybox | تخته سفید دیجیتال تعاملی رایگان برای کلاس های درس", titleShort: "Teacher Toybox | تخته سفید تعاملی", description: "Teacher Toybox یک تخته سفید دیجیتال تعاملی رایگان با تایمر، تاس و موارد دیگر برای جذاب کردن دروس است. نیازی به نصب ندارد.", keywords: "تخته سفید دیجیتال, تخته سفید تعاملی, ابزار معلم, منابع کلاس درس, ابزار رایگان معلم, تایمر آنلاین, فعالیت های کلاس, آموزش" },
          site: { brand: "Teacher Toybox", subtitle: "تخته سفیدی که توسط معلمان برای معلمان ساخته شده است." },
          lang: { label: "زبان" },
          btn: { tablet: "نسخه تبلت", "tablet.title": "رفتن به نسخه تبلت", clock: "تغییر ساعت (K)", add: "افزودن پنجره (N)", layouts: "تغییر چیدمان (L)", colour: "رنگ وب سایت (X)", color: "انتخاب رنگ (C)", magic: "استخراج رنگ (M)", themePalette: "پالت تم (Z)", bell: "زنگ (B)", shh: "صدای 'هیس' (S)", "shh.label": "هیس", management: "ابزارهای مدیریت (/)", help: "راهنما (؟)", laser: "اشاره گر لیزری (P)", tour: "شروع تور", demo: "ویدیوی نمایشی", info: "اطلاعات", refresh: "بازخوانی (R)", share: "اشتراک گذاری (J)", feedback: "ارائه بازخورد (F)", coffee: "یک قهوه برایم بخر (Y)", upgrade: "ارتقا به پریمیوم (U)" },
          layout: { 1: "چیدمان ۱: تمام صفحه (1)", 2: "چیدمان ۲: تقسیم عمودی (2)", 3: "چیدمان ۳: اصلی چپ (3)", 4: "چیدمان ۴: اصلی راست (4)", 5: "چیدمان ۵: چهار ربع (5)", 6: "چیدمان ۶: ستون بلند راست (6)", 7: "چیدمان ۷: ستون ۱-۲-২ (7)" },
          panel: {
              upgrade: { title: "پریمیوم شوید", intro: "با باز کردن قفل تمام ابزارهای تعاملی در Teacher Toybox، کلاس درس خود را تقویت کنید!", feature1_title: "باز کردن تمام ابزارها", feature1_desc: "دسترسی فوری به تمام ابزارهای پریمیوم داشته باشید.", feature2_title: "وب کم و دوربین اسناد", feature2_desc: "از وب کم خود برای نمایش های زنده استفاده کنید.", feature3_title: "چرخ و فلک عکس", feature3_desc: "داستان های بصری و نمایش اسلاید جذاب ایجاد کنید.", feature4_title: "بازی سازی دروس", feature4_desc: "از تاس انداز و شمارنده ها برای سرگرم کننده کردن یادگیری استفاده کنید.", feature5_title: "مدیریت زمان", feature5_desc: "با تایمر و کرونومتر به راحتی زمان کلاس را مدیریت کنید.", feature6_title: "کنترل پیشرفته", feature6_desc: "برای تنظیمات عالی، شفافیت را تنظیم کرده و پنجره های خود را لایه بندی کنید.", feature7_title: "ابزارهای آینده", feature7_desc: "به طور خودکار هر ابزار پریمیوم جدیدی را که منتشر می کنیم دریافت کنید.", feature8_title: "حمایت از توسعه", feature8_desc: "کمک کنید تا پلتفرم اصلی برای همه معلمان رایگان بماند." },
              share: { title: "منتشر کنید!" },
              feedback: { title: "ارائه بازخورد", intro: "دوست داریم نظرات شما را بشنویم!", ratingLegend: "تجربه خود را چگونه ارزیابی می کنید؟", commentsLabel: "نظرات", commentsPlaceholder: "به ما بگویید چه چیزی را دوست داشتید یا چه چیزی می تواند بهبود یابد...", submitButton: "ارسال", submitButtonSending: "در حال ارسال...", submitButtonSuccess: "متشکرم!" }
          }
      },
      fr: {
          meta: { title: "Teacher Toybox | Tableau Blanc Numérique Interactif Gratuit pour les Salles de Classe", titleShort: "Teacher Toybox | Tableau Blanc Interactif", description: "Teacher Toybox est un tableau blanc numérique interactif gratuit avec des minuteurs, des dés et plus encore pour rendre les leçons attrayantes. Aucune installation requise.", keywords: "tableau blanc numérique, tableau blanc interactif, outils pour enseignants, ressources de classe, outils gratuits pour enseignants, minuteur en ligne, activités de classe, éducation" },
          site: { brand: "Teacher Toybox", subtitle: "Un tableau blanc conçu par des enseignants pour des enseignants." },
          lang: { label: "Langue" },
          btn: { tablet: "Édition Tablette", "tablet.title": "Passer à l'édition Tablette", clock: "Afficher/Masquer l'horloge (K)", add: "Ajouter une fenêtre (N)", layouts: "Changer de disposition (L)", colour: "Couleur du site (X)", color: "Sélectionner une couleur (C)", magic: "Extraire la couleur (M)", themePalette: "Palette de thèmes (Z)", bell: "Sonnerie (B)", shh: "Son 'Chut' (S)", "shh.label": "Chut", management: "Outils de gestion (/)", help: "Aide (?)", laser: "Pointeur laser (P)", tour: "Démarrer le tour", demo: "Vidéo de démonstration", info: "Informations", refresh: "Actualiser (R)", share: "Partager (J)", feedback: "Donner un avis (F)", coffee: "Offrez-moi un café (Y)", upgrade: "Passer à Premium (U)" },
          layout: { 1: "Disposition 1 : Plein écran (1)", 2: "Disposition 2 : Division verticale (2)", 3: "Disposition 3 : Principal à gauche (3)", 4: "Disposition 4 : Principal à droite (4)", 5: "Disposition 5 : Quatre quadrants (5)", 6: "Disposition 6 : Colonne droite haute (6)", 7: "Disposition 7 : Colonne 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Passez à Premium", intro: "Dynamisez votre classe en débloquant tous les outils interactifs de Teacher Toybox !", feature1_title: "Débloquez tous les outils", feature1_desc: "Accédez immédiatement à tous les outils premium.", feature2_title: "Webcam et visualiseur", feature2_desc: "Utilisez votre webcam pour des démonstrations en direct.", feature3_title: "Carrousel de photos", feature3_desc: "Créez des histoires visuelles et des diaporamas attrayants.", feature4_title: "Ludifiez les leçons", feature4_desc: "Utilisez le lanceur de dés et les compteurs pour rendre l'apprentissage amusant.", feature5_title: "Gérez le temps", feature5_desc: "Gérez sans effort le temps de classe avec des minuteurs et des chronomètres.", feature6_title: "Contrôle avancé", feature6_desc: "Ajustez l'opacité et superposez vos fenêtres pour une configuration parfaite.", feature7_title: "Outils futurs", feature7_desc: "Recevez automatiquement chaque nouvel outil premium que nous publions.", feature8_title: "Soutenez le développement", feature8_desc: "Aidez à maintenir la plateforme de base gratuite pour tous les enseignants." },
              share: { title: "Faites passer le mot !" },
              feedback: { title: "Donner votre avis", intro: "Nous aimerions connaître votre opinion !", ratingLegend: "Comment évalueriez-vous votre expérience ?", commentsLabel: "Commentaires", commentsPlaceholder: "Dites-nous ce que vous avez aimé ou ce qui pourrait être amélioré...", submitButton: "Envoyer", submitButtonSending: "Envoi...", submitButtonSuccess: "Merci !" }
          }
      },
      hi: {
          meta: { title: "टीचर टॉयबॉक्स | कक्षाओं के लिए मुफ्त इंटरैक्टिव डिजिटल व्हाइटबोर्ड", titleShort: "टीचर टॉयबॉक्स | इंटरैक्टिव व्हाइटबोर्ड", description: "टीचर टॉयबॉक्स एक मुफ्त इंटरैक्टिव डिजिटल व्हाइटबोर्ड है जिसमें टाइमर, पासा और बहुत कुछ है ताकि पाठों को आकर्षक बनाया जा सके। किसी इंस्टॉलेशन की आवश्यकता नहीं है।", keywords: "डिजिटल व्हाइटबोर्ड, इंटरैक्टिव व्हाइटबोर्ड, शिक्षक उपकरण, कक्षा संसाधन, मुफ्त शिक्षक उपकरण, ऑनलाइन टाइमर, कक्षा गतिविधियाँ, शिक्षा" },
          site: { brand: "टीचर टॉयबॉक्स", subtitle: "शिक्षकों द्वारा शिक्षकों के लिए बनाया गया एक व्हाइटबोर्ड।" },
          lang: { label: "भाषा" },
          btn: { tablet: "टैबलेट संस्करण", "tablet.title": "टैबलेट संस्करण पर स्विच करें", clock: "घड़ी टॉगल करें (K)", add: "नई विंडो जोड़ें (N)", layouts: "लेआउट टॉगल करें (L)", colour: "वेबसाइट का रंग (X)", color: "रंग चुनें (C)", magic: "रंग निकालें (M)", themePalette: "थीम पैलेट (Z)", bell: "घंटी बजाएं (B)", shh: "चुप कराने की ध्वनि (S)", "shh.label": "श्श", management: "प्रबंधन उपकरण (/)", help: "सहायता (?)", laser: "लेजर पॉइंटर (P)", tour: "टूर शुरू करें", demo: "डेमो वीडियो", info: "जानकारी", refresh: "रीफ्रेश करें (R)", share: "शेयर करें (J)", feedback: "प्रतिक्रिया दें (F)", coffee: "मुझे एक कॉफी खरीदें (Y)", upgrade: "प्रीमियम में अपग्रेड करें (U)" },
          layout: { 1: "लेआउट 1: पूर्ण स्क्रीन (1)", 2: "लेआउट 2: लंबवत विभाजन (2)", 3: "लेआउट 3: मुख्य बाएँ (3)", 4: "लेआउट 4: मुख्य दाएँ (4)", 5: "लेआउट 5: चार चतुर्थांश (5)", 6: "लेआउट 6: लंबा दायां कॉलम (6)", 7: "लेआउट 7: 1-2-2 कॉलम (7)" },
          panel: {
              upgrade: { title: "प्रीमियम बनें", intro: "टीचर टॉयबॉक्स में हर इंटरैक्टिव टूल को अनलॉक करके अपनी कक्षा को सुपरचार्ज करें!", feature1_title: "सभी टूल अनलॉक करें", feature1_desc: "हर प्रीमियम टूल तक तुरंत पहुँच प्राप्त करें।", feature2_title: "वेबकैम और दस्तावेज़ कैमरा", feature2_desc: "लाइव प्रदर्शन के लिए अपने वेबकैम का उपयोग करें।", feature3_title: "फोटो हिंडोला", feature3_desc: "आकर्षक दृश्य कहानियाँ और स्लाइडशो बनाएँ।", feature4_title: "पाठों को गेमिफाई करें", feature4_desc: "सीखने को मजेदार बनाने के लिए डाइस रोलर और काउंटर्स का उपयोग करें।", feature5_title: "समय प्रबंधित करें", feature5_desc: "टाइमर और स्टॉपवॉच के साथ कक्षा के समय को सहजता से प्रबंधित करें।", feature6_title: "उन्नत नियंत्रण", feature6_desc: "सही सेटअप के लिए अपारदर्शिता समायोजित करें और अपनी खिड़कियों को परत करें।", feature7_title: "भविष्य के उपकरण", feature7_desc: "हमारे द्वारा जारी किए गए हर नए प्रीमियम टूल को स्वचालित रूप से प्राप्त करें।", feature8_title: "विकास का समर्थन करें", feature8_desc: "सभी शिक्षकों के लिए कोर प्लेटफॉर्म को मुफ्त रखने में मदद करें।" },
              share: { title: "इसे फैलाएं!" },
              feedback: { title: "प्रतिक्रिया दें", intro: "हमें आपके विचार सुनना अच्छा लगेगा!", ratingLegend: "आप अपने अनुभव को कैसे रेट करेंगे?", commentsLabel: "टिप्पणियाँ", commentsPlaceholder: "हमें बताएं कि आपको क्या पसंद आया या क्या સુધારા जा सकता है...", submitButton: "सबमिट करें", submitButtonSending: "भेज रहा है...", submitButtonSuccess: "धन्यवाद!" }
          }
      },
      id: {
          meta: { title: "Teacher Toybox | Papan Tulis Digital Interaktif Gratis untuk Ruang Kelas", titleShort: "Teacher Toybox | Papan Tulis Interaktif", description: "Teacher Toybox adalah papan tulis digital interaktif gratis dengan timer, dadu, dan lainnya untuk membuat pelajaran menjadi menarik. Tidak perlu instalasi.", keywords: "papan tulis digital, papan tulis interaktif, alat guru, sumber daya kelas, alat guru gratis, timer online, kegiatan kelas, pendidikan" },
          site: { brand: "Teacher Toybox", subtitle: "Papan tulis yang dibuat oleh guru untuk guru." },
          lang: { label: "Bahasa" },
          btn: { tablet: "Edisi Tablet", "tablet.title": "Beralih ke Edisi Tablet", clock: "Aktifkan/Nonaktifkan Jam (K)", add: "Tambah Jendela Baru (N)", layouts: "Aktifkan/Nonaktifkan Tata Letak (L)", colour: "Warna Situs Web (X)", color: "Pilih Warna Aksen (C)", magic: "Ekstrak Warna dari Konten (M)", themePalette: "Palet Tema (Z)", bell: "Bunyikan Lonceng (B)", shh: "Suara 'Sst' (S)", "shh.label": "Sst", management: "Alat Manajemen Kelas (/)", help: "Bantuan & Sumber Daya (?)", laser: "Aktifkan/Nonaktifkan Penunjuk Laser (P)", tour: "Mulai Tur Terpandu", demo: "Tonton Video Demo", info: "Tampilkan Informasi", refresh: "Segarkan Halaman (R)", share: "Bagikan dengan Teman (J)", feedback: "Berikan Umpan Balik (F)", coffee: "Belikan saya kopi (Y)", upgrade: "Tingkatkan ke Premium (U)" },
          layout: { 1: "Tata Letak 1: Layar Penuh (1)", 2: "Tata Letak 2: Terpisah Vertikal (2)", 3: "Tata Letak 3: Utama Kiri (3)", 4: "Tata Letak 4: Utama Kanan (4)", 5: "Tata Letak 5: Empat Kuadran (5)", 6: "Tata Letak 6: Kolom Kanan Tinggi (6)", 7: "Tata Letak 7: Kolom 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Menjadi Premium", intro: "Tingkatkan kelas Anda dengan membuka setiap alat interaktif di Teacher Toybox!", feature1_title: "Buka Semua Alat", feature1_desc: "Dapatkan akses langsung ke setiap alat premium.", feature2_title: "Webcam & Kamera Dokumen", feature2_desc: "Gunakan webcam Anda untuk demonstrasi langsung.", feature3_title: "Korsel Foto", feature3_desc: "Buat cerita visual dan tayangan slide yang menarik.", feature4_title: "Gamifikasi Pelajaran", feature4_desc: "Gunakan Penggulir Dadu dan Penghitung untuk membuat belajar menjadi menyenangkan.", feature5_title: "Kelola Waktu", feature5_desc: "Kelola waktu kelas dengan mudah menggunakan timer dan stopwatch.", feature6_title: "Kontrol Lanjutan", feature6_desc: "Sesuaikan opasitas dan lapisi jendela Anda untuk pengaturan yang sempurna.", feature7_title: "Alat Masa Depan", feature7_desc: "Dapatkan setiap alat premium baru yang kami rilis secara otomatis.", feature8_title: "Dukung Pengembangan", feature8_desc: "Bantu menjaga platform inti tetap gratis untuk semua guru." },
              share: { title: "Sebarkan Berita!" },
              feedback: { title: "Berikan Umpan Balik", intro: "Kami ingin mendengar pendapat Anda!", ratingLegend: "Bagaimana Anda menilai pengalaman Anda?", commentsLabel: "Komentar", commentsPlaceholder: "Beri tahu kami apa yang Anda sukai atau apa yang bisa diperbaiki...", submitButton: "Kirim", submitButtonSending: "Mengirim...", submitButtonSuccess: "Terima Kasih!" }
          }
      },
      ja: {
          meta: { title: "Teacher Toybox | 教室向けの無料インタラクティブデジタルホワイトボード", titleShort: "Teacher Toybox | インタラクティブホワイトボード", description: "Teacher Toyboxは、タイマーやサイコロなどのツールを備えた無料のインタラクティブデジタルホワイトボードで、授業を魅力的にします。インストールは不要です。", keywords: "デジタルホワイトボード, インタラクティブホワイトボード, 教師用ツール, 教室用リソース, 無料教師用ツール, オンラインタイマー, 教室活動, 教育" },
          site: { brand: "Teacher Toybox", subtitle: "教師が教師のために作ったホワイトボード。" },
          lang: { label: "言語" },
          btn: { tablet: "タブレット版", "tablet.title": "タブレット版に切り替え", clock: "ライブ時計の切り替え (K)", add: "新しいウィンドウを追加 (N)", layouts: "レイアウトの切り替え (L)", colour: "ウェブサイトの色 (X)", color: "アクセントカラーを選択 (C)", magic: "コンテンツから色を抽出 (M)", themePalette: "テーマパレット (Z)", bell: "ベルを鳴らす (B)", shh: "「シー」という音 (S)", "shh.label": "シー", management: "教室管理ツール (/)", help: "ヘルプとリソース (?)", laser: "レーザーポインターの切り替え (P)", tour: "ガイド付きツアーを開始", demo: "デモビデオを表示", info: "情報を表示", refresh: "ページを更新 (R)", share: "友達と共有 (J)", feedback: "フィードバックを送信 (F)", coffee: "コーヒーをおごる (Y)", upgrade: "プレミアムにアップグレード (U)" },
          layout: { 1: "レイアウト1：全画面 (1)", 2: "レイアウト2：垂直分割 (2)", 3: "レイアウト3：メイン（左） (3)", 4: "レイアウト4：メイン（右） (4)", 5: "レイアウト5：四分割 (5)", 6: "レイアウト6：高い右列 (6)", 7: "レイアウト7：1-2-2列 (7)" },
          panel: {
              upgrade: { title: "プレミアムに移行", intro: "Teacher Toyboxのすべてのインタラクティブツールをアンロックして、あなたの教室をパワーアップさせましょう！", feature1_title: "すべてのツールをアンロック", feature1_desc: "すべてのプレミアムツールにすぐにアクセスできます。", feature2_title: "ウェブカメラ＆書画カメラ", feature2_desc: "ライブデモンストレーションにウェブカメラを使用します。", feature3_title: "写真カルーセル", feature3_desc: "魅力的なビジュアルストーリーやスライドショーを作成します。", feature4_title: "授業をゲーミフィケーション", feature4_desc: "サイコロローラーやカウンターを使って、学習を楽しくします。", feature5_title: "時間を管理", feature5_desc: "タイマーやストップウォッチで教室の時間を簡単に管理します。", feature6_title: "高度なコントロール", feature6_desc: "完璧なセットアップのために、不透明度を調整し、ウィンドウを重ねます。", feature7_title: "将来のツール", feature7_desc: "リリースされるすべての新しいプレミアムツールを自動的に入手できます。", feature8_title: "開発をサポート", feature8_desc: "コアプラットフォームをすべての教師に無料で提供し続けるのを手伝ってください。" },
              share: { title: "広めよう！" },
              feedback: { title: "フィードバックを送信", intro: "ご意見をお聞かせください！", ratingLegend: "あなたの経験をどのように評価しますか？", commentsLabel: "コメント", commentsPlaceholder: "気に入った点や改善できる点をお知らせください...", submitButton: "送信", submitButtonSending: "送信中...", submitButtonSuccess: "ありがとうございました！" }
          }
      },
      ko: {
          meta: { title: "Teacher Toybox | 교실용 무료 인터랙티브 디지털 화이트보드", titleShort: "Teacher Toybox | 인터랙티브 화이트보드", description: "Teacher Toybox는 타이머, 주사위 등 수업을 흥미롭게 만드는 도구가 포함된 무료 인터랙티브 디지털 화이트보드입니다. 설치가 필요 없습니다.", keywords: "디지털 화이트보드, 인터랙티브 화이트보드, 교사용 도구, 교실 자료, 무료 교사용 도구, 온라인 타이머, 교실 활동, 교육" },
          site: { brand: "Teacher Toybox", subtitle: "교사가 교사를 위해 만든 화이트보드." },
          lang: { label: "언어" },
          btn: { tablet: "태블릿 버전", "tablet.title": "태블릿 버전으로 전환", clock: "라이브 시계 토글 (K)", add: "새 창 추가 (N)", layouts: "레이아웃 토글 (L)", colour: "웹사이트 색상 (X)", color: "강조 색상 선택 (C)", magic: "콘텐츠에서 색상 추출 (M)", themePalette: "테마 팔레트 (Z)", bell: "종 울리기 (B)", shh: "조용히 소리 (S)", "shh.label": "쉿", management: "교실 관리 도구 (/)", help: "도움말 및 자료 (?)", laser: "레이저 포인터 토글 (P)", tour: "가이드 투어 시작", demo: "데모 비디오 보기", info: "정보 보기", refresh: "페이지 새로고침 (R)", share: "친구와 공유 (J)", feedback: "피드백 제공 (F)", coffee: "커피 사주기 (Y)", upgrade: "프리미엄으로 업그레이드 (U)" },
          layout: { 1: "레이아웃 1: 전체 화면 (1)", 2: "레이아웃 2: 수직 분할 (2)", 3: "레이아웃 3: 왼쪽 메인 (3)", 4: "레이아웃 4: 오른쪽 메인 (4)", 5: "레이아웃 5: 4분할 (5)", 6: "레이아웃 6: 높은 오른쪽 열 (6)", 7: "레이아웃 7: 1-2-2 열 (7)" },
          panel: {
              upgrade: { title: "프리미엄으로 가기", intro: "Teacher Toybox의 모든 인터랙티브 도구를 잠금 해제하여 교실을 한 단계 업그레이드하세요!", feature1_title: "모든 도구 잠금 해제", feature1_desc: "모든 프리미엄 도구에 즉시 액세스할 수 있습니다.", feature2_title: "웹캠 및 문서 카메라", feature2_desc: "라이브 시연에 웹캠을 사용하세요.", feature3_title: "사진 캐러셀", feature3_desc: "매력적인 비주얼 스토리와 슬라이드쇼를 만드세요.", feature4_title: "수업 게임화", feature4_desc: "주사위 굴리기와 카운터를 사용하여 학습을 재미있게 만드세요.", feature5_title: "시간 관리", feature5_desc: "타이머와 스톱워치로 교실 시간을 손쉽게 관리하세요.", feature6_title: "고급 제어", feature6_desc: "완벽한 설정을 위해 불투명도를 조절하고 창을 레이어링하세요.", feature7_title: "미래의 도구", feature7_desc: "새로 출시되는 모든 프리미엄 도구를 자동으로 받으세요.", feature8_title: "개발 지원", feature8_desc: "핵심 플랫폼을 모든 교사에게 무료로 제공할 수 있도록 도와주세요." },
              share: { title: "널리 알려주세요!" },
              feedback: { title: "피드백 제공", intro: "여러분의 생각을 듣고 싶습니다!", ratingLegend: "경험을 어떻게 평가하시겠습니까?", commentsLabel: "의견", commentsPlaceholder: "좋았던 점이나 개선할 점을 알려주세요...", submitButton: "제출", submitButtonSending: "보내는 중...", submitButtonSuccess: "감사합니다!" }
          }
      },
      pt: {
          meta: { title: "Teacher Toybox | Quadro Branco Digital Interativo Gratuito para Salas de Aula", titleShort: "Teacher Toybox | Quadro Branco Interativo", description: "O Teacher Toybox é um quadro branco digital interativo gratuito com cronômetros, dados e muito mais para tornar as aulas envolventes. Nenhuma instalação é necessária.", keywords: "quadro branco digital, quadro branco interativo, ferramentas para professores, recursos de sala de aula, ferramentas gratuitas para professores, cronômetro online, atividades de sala de aula, educação" },
          site: { brand: "Teacher Toybox", subtitle: "Um quadro branco construído por professores para professores." },
          lang: { label: "Idioma" },
          btn: { tablet: "Edição para Tablet", "tablet.title": "Mudar para a Edição para Tablet", clock: "Alternar Relógio (K)", add: "Adicionar Janela (N)", layouts: "Alternar Layouts (L)", colour: "Cor do Site (X)", color: "Selecionar Cor (C)", magic: "Extrair Cor (M)", themePalette: "Paleta de Temas (Z)", bell: "Tocar Sino (B)", shh: "Som de 'Shh' (S)", "shh.label": "Shh", management: "Ferramentas de Gestão (/)", help: "Ajuda (?)", laser: "Ponteiro Laser (P)", tour: "Iniciar Tour", demo: "Vídeo de Demonstração", info: "Informações", refresh: "Atualizar (R)", share: "Compartilhar (J)", feedback: "Enviar Feedback (F)", coffee: "Pague-me um café (Y)", upgrade: "Atualizar para Premium (U)" },
          layout: { 1: "Layout 1: Tela Cheia (1)", 2: "Layout 2: Divisão Vertical (2)", 3: "Layout 3: Principal à Esquerda (3)", 4: "Layout 4: Principal à Direita (4)", 5: "Layout 5: Quatro Quadrantes (5)", 6: "Layout 6: Coluna Direita Alta (6)", 7: "Layout 7: Coluna 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Seja Premium", intro: "Potencialize sua sala de aula desbloqueando todas as ferramentas interativas do Teacher Toybox!", feature1_title: "Desbloqueie Todas as Ferramentas", feature1_desc: "Tenha acesso imediato a todas as ferramentas premium.", feature2_title: "Webcam e Câmera de Documentos", feature2_desc: "Use sua webcam para demonstrações ao vivo.", feature3_title: "Carrossel de Fotos", feature3_desc: "Crie histórias visuais e apresentações de slides envolventes.", feature4_title: "Gamifique as Aulas", feature4_desc: "Use o Rolo de Dados e os Contadores para tornar o aprendizado divertido.",
              feature5_title: "Gerencie o Tempo", feature5_desc: "Gerencie o tempo da sala de aula sem esforço com cronômetros e temporizadores.", feature6_title: "Controle Avançado", feature6_desc: "Ajuste a opacidade e sobreponha suas janelas para a configuração perfeita.", feature7_title: "Ferramentas Futuras", feature7_desc: "Receba automaticamente todas as novas ferramentas premium que lançarmos.", feature8_title: "Apoie o Desenvolvimento", feature8_desc: "Ajude a manter a plataforma principal gratuita para todos os professores." },
              share: { title: "Divulgue!" },
              feedback: { title: "Enviar Feedback", intro: "Adoraríamos ouvir suas opiniões!", ratingLegend: "Como você avaliaria sua experiência?", commentsLabel: "Comentários", commentsPlaceholder: "Diga-nos o que você gostou ou o que poderia ser melhorado...", submitButton: "Enviar", submitButtonSending: "Enviando...", submitButtonSuccess: "Obrigado!" }
          }
      },
      ru: {
          meta: { title: "Teacher Toybox | Бесплатная интерактивная цифровая доска для классов", titleShort: "Teacher Toybox | Интерактивная доска", description: "Teacher Toybox - это бесплатная интерактивная цифровая доска с таймерами, кубиками и многим другим, чтобы сделать уроки увлекательными. Установка не требуется.", keywords: "цифровая доска, интерактивная доска, инструменты для учителя, ресурсы для класса, бесплатные инструменты для учителя, онлайн-таймер, классные мероприятия, образование" },
          site: { brand: "Teacher Toybox", subtitle: "Доска, созданная учителями для учителей." },
          lang: { label: "Язык" },
          btn: { tablet: "Планшетная версия", "tablet.title": "Переключиться на планшетную версию", clock: "Переключить часы (K)", add: "Добавить окно (N)", layouts: "Переключить макеты (L)", colour: "Цвет сайта (X)", color: "Выбрать цвет (C)", magic: "Извлечь цвет (M)", themePalette: "Палитра тем (Z)", bell: "Звонок (B)", shh: "Звук 'тсс' (S)", "shh.label": "Тсс", management: "Инструменты управления (/)", help: "Помощь (?)", laser: "Лазерная указка (P)", tour: "Начать тур", demo: "Демо-видео", info: "Информация", refresh: "Обновить (R)", share: "Поделиться (J)", feedback: "Оставить отзыв (F)", coffee: "Купи мне кофе (Y)", upgrade: "Перейти на Премиум (U)" },
          layout: { 1: "Макет 1: Полный экран (1)", 2: "Макет 2: Вертикальное разделение (2)", 3: "Макет 3: Основной слева (3)", 4: "Макет 4: Основной справа (4)", 5: "Макет 5: Четыре квадранта (5)", 6: "Макет 6: Высокая правая колонка (6)", 7: "Макет 7: Колонка 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Перейти на Премиум", intro: "Усильте свой класс, разблокировав все интерактивные инструменты в Teacher Toybox!", feature1_title: "Разблокировать все инструменты", feature1_desc: "Получите немедленный доступ ко всем премиум-инструментам.", feature2_title: "Веб-камера и документ-камера", feature2_desc: "Используйте свою веб-камеру для живых демонстраций.", feature3_title: "Фотокарусель", feature3_desc: "Создавайте увлекательные визуальные истории и слайд-шоу.", feature4_title: "Геймифицируйте уроки", feature4_desc: "Используйте игральные кости и счетчики, чтобы сделать обучение увлекательным.", feature5_title: "Управляйте временем", feature5_desc: "Легко управляйте временем в классе с помощью таймеров и секундомеров.", feature6_title: "Расширенное управление", feature6_desc: "Настраивайте прозрачность и слои окон для идеальной настройки.", feature7_title: "Будущие инструменты", feature7_desc: "Автоматически получайте каждый новый премиум-инструмент, который мы выпускаем.", feature8_title: "Поддержите разработку", feature8_desc: "Помогите сохранить основную платформу бесплатной для всех учителей." },
              share: { title: "Расскажите другим!" },
              feedback: { title: "Оставить отзыв", intro: "Мы хотели бы услышать ваше мнение!", ratingLegend: "Как бы вы оценили свой опыт?", commentsLabel: "Комментарии", commentsPlaceholder: "Расскажите нам, что вам понравилось или что можно было бы улучшить...", submitButton: "Отправить", submitButtonSending: "Отправка...", submitButtonSuccess: "Спасибо!" }
          }
      },
      tr: {
          meta: { title: "Teacher Toybox | Sınıflar için Ücretsiz Etkileşimli Dijital Beyaz Tahta", titleShort: "Teacher Toybox | Etkileşimli Beyaz Tahta", description: "Teacher Toybox, dersleri ilgi çekici hale getirmek için zamanlayıcılar, zarlar ve daha fazlasını içeren ücretsiz bir etkileşimli dijital beyaz tahtadır. Kurulum gerektirmez.", keywords: "dijital beyaz tahta, etkileşimli beyaz tahta, öğretmen araçları, sınıf kaynakları, ücretsiz öğretmen araçları, çevrimiçi zamanlayıcı, sınıf etkinlikleri, eğitim" },
          site: { brand: "Teacher Toybox", subtitle: "Öğretmenler tarafından öğretmenler için yapılmış bir beyaz tahta." },
          lang: { label: "Dil" },
          btn: { tablet: "Tablet Sürümü", "tablet.title": "Tablet Sürümüne Geç", clock: "Canlı Saati Aç/Kapat (K)", add: "Yeni Pencere Ekle (N)", layouts: "Düzenleri Aç/Kapat (L)", colour: "Web Sitesi Rengi (X)", color: "Vurgu Rengini Seç (C)", magic: "İçerikten Renk Çıkar (M)", themePalette: "Tema Paleti (Z)", bell: "Zili Çal (B)", shh: "Şşşt Sesi (S)", "shh.label": "Şşşt", management: "Sınıf Yönetim Araçları (/)", help: "Yardım ve Kaynaklar (?)", laser: "Lazer İşaretçiyi Aç/Kapat (P)", tour: "Rehberli Turu Başlat", demo: "Demo Videosunu Göster", info: "Bilgileri Göster", refresh: "Sayfayı Yenile (R)", share: "Bir Arkadaşınla Paylaş (J)", feedback: "Geri Bildirimde Bulun (F)", coffee: "Bana bir kahve ısmarla (Y)", upgrade: "Premium'a Yükselt (U)" },
          layout: { 1: "Düzen 1: Tam Ekran (1)", 2: "Düzen 2: Dikey Bölme (2)", 3: "Düzen 3: Ana Sol (3)", 4: "Düzen 4: Ana Sağ (4)", 5: "Düzen 5: Dört Çeyrek (5)", 6: "Düzen 6: Yüksek Sağ Sütun (6)", 7: "Düzen 7: 1-2-2 Sütun (7)" },
          panel: {
              upgrade: { title: "Premium'a Geç", intro: "Teacher Toybox'taki her etkileşimli aracı açarak sınıfınızı güçlendirin!", feature1_title: "Tüm Araçların Kilidini Aç", feature1_desc: "Her premium araca anında erişim sağlayın.", feature2_title: "Web Kamerası ve Belge Kamerası", feature2_desc: "Canlı gösterimler için web kameranızı kullanın.", feature3_title: "Fotoğraf Karuseli", feature3_desc: "Etkileyici görsel hikayeler ve slayt gösterileri oluşturun.", feature4_title: "Dersleri Oyunlaştır", feature4_desc: "Öğrenmeyi eğlenceli hale getirmek için Zar Atıcı ve Sayaçları kullanın.", feature5_title: "Zamanı Yönet", feature5_desc: "Zamanlayıcılar ve kronometrelerle sınıf zamanını zahmetsizce yönetin.", feature6_title: "Gelişmiş Kontrol", feature6_desc: "Mükemmel kurulum için opaklığı ayarlayın ve pencerelerinizi katmanlayın.", feature7_title: "Gelecekteki Araçlar", feature7_desc: "Yayınladığımız her yeni premium aracı otomatik olarak alın.", feature8_title: "Gelişimi Destekle", feature8_desc: "Çekirdek platformun tüm öğretmenler için ücretsiz kalmasına yardımcı olun." },
              share: { title: "Haberi Yay!" },
              feedback: { title: "Geri Bildirimde Bulun", intro: "Düşüncelerinizi duymak isteriz!", ratingLegend: "Deneyiminizi nasıl değerlendirirsiniz?", commentsLabel: "Yorumlar", commentsPlaceholder: "Neleri beğendiğinizi veya nelerin iyileştirilebileceğini bize bildirin...", submitButton: "Gönder", submitButtonSending: "Gönderiliyor...", submitButtonSuccess: "Teşekkürler!" }
          }
      },
      uk: {
          meta: { title: "Teacher Toybox | Безкоштовна інтерактивна дошка для вчителів", titleShort: "Teacher Toybox | Інтерактивна дошка", description: "Teacher Toybox — це безкоштовна інтерактивна цифрова дошка з таймерами, кубиками та іншим, щоб зробити уроки захоплюючими. Встановлення не потрібне.", keywords: "цифрова дошка, інтерактивна дошка, інструменти для вчителів, ресурси для класу, безкоштовні інструменти для вчителів, онлайн-таймер, класні заходи, освіта" },
          site: { brand: "Teacher Toybox", subtitle: "Дошка, створена вчителями для вчителів." },
          lang: { label: "Мова" },
          btn: { tablet: "Версія для планшета", "tablet.title": "Перейти на версію для планшета", clock: "Переключити годинник (K)", add: "Додати вікно (N)", layouts: "Переключити макети (L)", colour: "Колір сайту (X)", color: "Вибрати колір (C)", magic: "Витягти колір (M)", themePalette: "Палітра тем (Z)", bell: "Дзвоник (B)", shh: "Звук 'тсс' (S)", "shh.label": "Тсс", management: "Інструменти управління (/)", help: "Допомога (?)", laser: "Лазерна указка (P)", tour: "Почати тур", demo: "Демо-відео", info: "Інформація", refresh: "Оновити (R)", share: "Поділитися (J)", feedback: "Відгук (F)", coffee: "Пригостити кавою (Y)", upgrade: "Оновити до Premium (U)" },
          layout: { 1: "Макет 1: Повний екран (1)", 2: "Макет 2: Вертикальний поділ (2)", 3: "Макет 3: Основний зліва (3)", 4: "Макет 4: Основний справа (4)", 5: "Макет 5: Чотири квадранти (5)", 6: "Макет 6: Високий правий стовпець (6)", 7: "Макет 7: Стовпець 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Перейти на Premium", intro: "Покращіть свій клас, розблокувавши всі інтерактивні інструменти в Teacher Toybox!", feature1_title: "Розблокувати всі інструменти", feature1_desc: "Отримайте негайний доступ до всіх преміум-інструментів.", feature2_title: "Веб-камера та документ-камера", feature2_desc: "Використовуйте веб-камеру для живих демонстрацій.", feature3_title: "Карусель фотографій", feature3_desc: "Створюйте захоплюючі візуальні історії та слайд-шоу.", feature4_title: "Гейміфікуйте уроки", feature4_desc: "Використовуйте кубики та лічильники, щоб зробити навчання веселим.", feature5_title: "Керуйте часом", feature5_desc: "Легко керуйте часом у класі за допомогою таймерів та секундомірів.", feature6_title: "Розширений контроль", feature6_desc: "Налаштовуйте прозорість та шари вікон для ідеального налаштування.", feature7_title: "Майбутні інструменти", feature7_desc: "Автоматично отримуйте кожен новий преміум-інструмент, який ми випускаємо.", feature8_title: "Підтримайте розробку", feature8_desc: "Допоможіть зберегти основну платформу безкоштовною для всіх вчителів." },
              share: { title: "Поширюйте!" },
              feedback: { title: "Надіслати відгук", intro: "Ми хотіли б почути ваші думки!", ratingLegend: "Як би ви оцінили свій досвід?", commentsLabel: "Коментарі", commentsPlaceholder: "Розкажіть, що вам сподобалося або що можна було б покращити...", submitButton: "Надіслати", submitButtonSending: "Надсилання...", submitButtonSuccess: "Дякуємо!" }
          }
      },
      zh: {
          meta: { title: "教师玩具箱 | 免费的课堂交互式数字白板", titleShort: "教师玩具箱 | 交互式白板", description: "教师玩具箱是一款免费的交互式数字白板，配有计时器、骰子等工具，让课程更具吸引力。无需安装。", keywords: "数字白板, 交互式白板, 教师工具, 课堂资源, 免费教师工具, 在线计时器, 课堂活动, 教育" },
          site: { brand: "教师玩具箱", subtitle: "由教师为教师打造的白板。" },
          lang: { label: "语言" },
          btn: { tablet: "平板版", "tablet.title": "切换到平板版", clock: "切换时钟 (K)", add: "添加窗口 (N)", layouts: "切换布局 (L)", colour: "网站颜色 (X)", color: "选择颜色 (C)", magic: "提取颜色 (M)", themePalette: "主题调色板 (Z)", bell: "响铃 (B)", shh: "安静声 (S)", "shh.label": "嘘", management: "管理工具 (/)", help: "帮助 (?)", laser: "激光笔 (P)", tour: "开始导览", demo: "演示视频", info: "信息", refresh: "刷新 (R)", share: "分享 (J)", feedback: "反馈 (F)", coffee: "请我喝咖啡 (Y)", upgrade: "升级到高级版 (U)" },
          layout: { 1: "布局1：全屏 (1)", 2: "布局2：垂直分割 (2)", 3: "布局3：左侧主窗口 (3)", 4: "布局4：右侧主窗口 (4)", 5: "布局5：四象限 (5)", 6: "布局6：高右栏 (6)", 7: "布局7：1-2-2列 (7)" },
          panel: {
              upgrade: { title: "升级到高级版", intro: "通过解锁教师玩具箱中的所有交互式工具，为您的课堂增添动力！", feature1_title: "解锁所有工具", feature1_desc: "立即使用所有高级工具。", feature2_title: "网络摄像头和文件摄像头", feature2_desc: "使用您的网络摄像头进行实时演示。", feature3_title: "照片轮播", feature3_desc: "创建引人入胜的视觉故事和幻灯片。", feature4_title: "游戏化课程", feature4_desc: "使用骰子和计数器使学习变得有趣。", feature5_title: "管理时间", feature5_desc: "使用计时器和秒表轻松管理课堂时间。", feature6_title: "高级控制", feature6_desc: "调整不透明度并分层窗口以实现完美设置。", feature7_title: "未来工具", feature7_desc: "自动获取我们发布的每个新的高级工具。", feature8_title: "支持开发", feature8_desc: "帮助所有教师免费使用核心平台。" },
              share: { title: "分享给他人！" },
              feedback: { title: "提供反馈", intro: "我们很想听听您的想法！", ratingLegend: "您如何评价您的体验？", commentsLabel: "评论", commentsPlaceholder: "告诉我们您喜欢什么或者可以改进的地方...", submitButton: "提交", submitButtonSending: "发送中...", submitButtonSuccess: "谢谢！" }
          }
      }
    };

    window.t = function(dict, path) {
      try {
        return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, dict);
      } catch { return undefined; }
    }

    function updateMeta(lang) {
      const dict = I18N[lang] || I18N.en;
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
        const dict = I18N[lang] || I18N.en;
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
      const dict = I18N[lang] || I18N.en;
      localStorage.setItem('ttx_lang', lang);
      document.documentElement.lang = lang;

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const val = t(dict, el.dataset.i18n) || t(I18N.en, el.dataset.i18n);
        if (typeof val === 'string') el.textContent = val;
      });

      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        const val = t(dict, key) || t(I18N.en, key);
        if (typeof val === 'string') el.setAttribute('title', val);
      });
      
      const feedbackComment = document.getElementById('feedback-comment');
      if (feedbackComment) {
          const placeholderText = t(dict, 'panel.feedback.commentsPlaceholder') || t(I18N.en, 'panel.feedback.commentsPlaceholder');
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
      
      if (global.TT && typeof global.TT.updateDateDisplay === 'function') {
          global.TT.updateDateDisplay(lang);
      }

      const infoLangSel = document.querySelector('.info-language-selector');
      if (infoLangSel) {
        infoLangSel.value = lang;
        infoLangSel.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    async function detectLanguage() {
      const supported = Object.keys(SUPPORTED);
      const regionMap = {
        'CZ': 'cs', 'UA': 'uk', 'CN': 'zh', 'HK':'zh', 'MO':'zh', 'TW':'zh', 'SG':'zh', 'MY':'zh',
        'IN': 'hi', 'ES': 'es', 'MX':'es', 'AR':'es', 'CL':'es', 'CO':'es', 'PE':'es', 'VE':'es', 'UY':'es', 'EC':'es', 'BO':'es', 'PY':'es', 'PA':'es', 'CR':'es', 'NI':'es', 'SV':'es', 'GT':'es', 'HN':'es', 'DO':'es', 'PR':'es',
        'FR': 'fr', 'BE':'fr', 'CH':'fr', 'CA':'fr', 'LU':'fr', 'AE': 'ar', 'SA':'ar', 'EG':'ar', 'MA':'ar', 'DZ':'ar', 'TN':'ar', 'QA':'ar', 'KW':'ar', 'OM':'ar', 'BH':'ar', 'IQ':'ar', 'JO':'ar', 'LB':'ar', 'LY':'ar', 'SD':'ar', 'YE':'ar',
        'IR': 'fa', 'PT': 'pt', 'BR':'pt', 'RU': 'ru', 'BY':'ru', 'KZ':'ru', 'KG':'ru',
        'US':'en', 'GB':'en', 'AU':'en', 'NZ':'en', 'IE':'en', 'ZA':'en', 'PH':'en', 'PK':'en', 'NG':'en', 'KE':'en'
      };

      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('IP API request failed');
        const data = await response.json();
        const country = data.country_code;
        if (country && regionMap[country]) {
          const lang = regionMap[country];
          if (supported.includes(lang)) {
            return lang;
          }
        }
      } catch (error) {
        console.warn('IP-based language detection failed, falling back to browser language.', error);
      }
      
      const nav = (navigator.language || 'en').split('-');
      const base = (nav[0] || 'en').toLowerCase();
      if (supported.includes(base)) return base;

      return 'en';
    }

    async function initPicker() {
      const sel = document.getElementById('langSelect');
      if (!sel) return;
      
      let userInteracted = false;
      
      sel.innerHTML = '';
      Object.entries(SUPPORTED).forEach(([code, name]) => {
        const opt = document.createElement('option');
        opt.value = code; opt.textContent = name;
        sel.appendChild(opt);
      });

      sel.addEventListener('change', (event) => {
        event.preventDefault(); // Prevent any default browser action
        event.stopPropagation(); // Stop the event from bubbling up to other listeners
        userInteracted = true;
        applyLang(sel.value);
      });
      
      const storedLang = localStorage.getItem('ttx_lang');
      let finalLang;

      if (storedLang && SUPPORTED[storedLang]) {
          finalLang = storedLang;
      } else {
          finalLang = await detectLanguage();
          if (userInteracted) return;
      }
      
      sel.value = finalLang;
      applyLang(finalLang); 
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