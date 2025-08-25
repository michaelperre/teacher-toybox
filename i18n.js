(function () {
    const SUPPORTED = {
      en: "English", cs: "Čeština", es: "Español", uk: "Українська", zh: "中文（简体）", hi: "हिन्दी", fr: "Français", ar: "العربية", fa: "فارسی", pt: "Português", ru: "Русский"
    };

    window.I18N = {
      en: {
          meta: { title: "Teacher Toybox | Free Interactive Digital Whiteboard for Classrooms", titleShort: "Teacher Toybox | Interactive Whiteboard", description: "Teacher Toybox is a free interactive digital whiteboard with timers, dice and more to make lessons engaging. No installation required.", keywords: "digital whiteboard, interactive whiteboard, teacher tools, classroom resources, free teacher tools, online timer, classroom activities, education" },
          site: { brand: "Teacher Toybox", subtitle: "A whiteboard built by teachers for teachers." },
          lang: { label: "Language" },
          btn: { tablet: "Tablet Edition", "tablet.title": "Switch to Tablet Edition", clock: "Toggle Live Clock (K)", add: "Add New Window (N)", layouts: "Toggle Layouts (L)", colour: "Website Colour (X)", color: "Select Accent Color (C)", magic: "Extract Color from Content (M)", themePalette: "Theme Palette (Z)", originalColor: "Original Colour", bell: "Ring Bell (B)", shh: "Shush Sound (S)", "shh.label": "Shh", management: "Classroom Management Tools (/)", help: "Help & Resources (?)", laser: "Toggle Laser Pointer (P)", tour: "Start Guided Tour", demo: "Show Demo Video", info: "Show Information", refresh: "Refresh Page (R)", share: "Share with a Friend (J)", feedback: "Provide Feedback (F)", coffee: "Buy Me a Coffee (Y)", upgrade: "Upgrade to Premium (U)" },
          layout: { 1: "Layout 1: Full Screen (1)", 2: "Layout 2: Split Vertical (2)", 3: "Layout 3: Main Left (3)", 4: "Layout 4: Main Right (4)", 5: "Layout 5: Four Quadrants (5)", 6: "Layout 6: Tall Right Column (6)", 7: "Layout 7: 1-2-2 Column (7)" },
          panel: {
              upgrade: { title: "Go Premium", intro: "Supercharge your classroom by unlocking every interactive tool in the Teacher Toybox!", feature1_title: "Unlock All Tools", feature1_desc: "Get immediate access to every premium tool.", feature2_title: "Webcam & Document Camera", feature2_desc: "Use your webcam for live demonstrations.", feature3_title: "Photo Carousel", feature3_desc: "Create engaging visual stories and slideshows.", feature4_title: "Gamify Lessons", feature4_desc: "Use the Dice Roller and Counters to make learning fun.", feature5_title: "Manage Time", feature5_desc: "Effortlessly manage classroom time with timers and stopwatches.", feature6_title: "Advanced Control", feature6_desc: "Adjust opacity and layer your windows for the perfect setup.", feature7_title: "Future Tools", feature7_desc: "Automatically get every new premium tool we release.", feature8_title: "Support Development", feature8_desc: "Help keep the core platform free for all teachers." },
              share: { title: "Spread the Word!" },
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
      cs: {
          meta: { title: "Teacher Toybox | Zdarma interaktivní tabule pro učitele", titleShort: "Teacher Toybox | Interaktivní tabule", description: "Teacher Toybox je zdarma interaktivní digitální tabule s časovači, kostkami a dalšími nástroji. Není potřeba instalace.", keywords: "digitální tabule, interaktivní tabule, nástroje pro učitele, zdroje pro třídu, bezplatné nástroje pro učitele, online časovač, aktivity ve třídě, vzdělávání" },
          site: { brand: "Teacher Toybox", subtitle: "Tabule vytvořená učiteli pro učitele." },
          lang: { label: "Jazyk" },
          btn: { tablet: "Verze pro tablet", "tablet.title": "Přepnout na verzi pro tablet", clock: "Zobrazit/skryt živé hodiny (K)", add: "Přidat nové okno (N)", layouts: "Přepnout nástroje rozložení (L)", colour: "Barva webu (X)", color: "Zvolit zvýrazňovací barvu (C)", magic: "Extrahovat barvu z obsahu (M)", themePalette: "Paleta motivů (Z)", originalColor: "Původní barva", bell: "Zazvonit (B)", shh: "Zvuk Ticho (S)", "shh.label": "Pšš", management: "Nástroje pro správu třídy (/)", help: "Nápověda a zdroje (?)", laser: "Přepnout laserové ukazovátko (P)", tour: "Spustit prohlídku", demo: "Zobrazit ukázkové video", info: "Zobrazit informace", refresh: "Obnovit stránku (R)", share: "Sdílet s přítelem (J)", feedback: "Zpětná vazba (F)", coffee: "Pozvat na kávu (Y)", upgrade: "Přejít na Premium (U)" },
          layout: { 1: "Rozvržení 1: Celá obrazovka (1)", 2: "Rozvržení 2: Vertikální rozdělení (2)", 3: "Rozvržení 3: Vlevo hlavní (3)", 4: "Rozvržení 4: Vpravo hlavní (4)", 5: "Rozvržení 5: Čtyři kvadranty (5)", 6: "Rozvržení 6: Vysoký pravý sloupec (6)", 7: "Rozvržení 7: 1-2-2 sloupce (7)" },
          panel: {
              upgrade: { title: "Přejít na Premium", intro: "Vylepšete svou třídu odemknutím všech interaktivních nástrojů v Teacher Toybox!", feature1_title: "Odemknout všechny nástroje", feature1_desc: "Získejte okamžitý přístup ke všem prémiovým nástrojům.", feature2_title: "Webkamera a Dokumentová kamera", feature2_desc: "Použijte svou webkameru pro živé ukázky.", feature3_title: "Fotogalerie", feature3_desc: "Vytvářejte poutavé vizuální příběhy a prezentace.", feature4_title: "Gamifikace lekcí", feature4_desc: "Použijte kostky a počítadla, aby bylo učení zábavné.", feature5_title: "Správa času", feature5_desc: "Snadno spravujte čas ve třídě pomocí časovačů a stopek.", feature6_title: "Pokročilé ovládání", feature6_desc: "Upravte průhlednost a vrstvěte okna pro dokonalé nastavení.", feature7_title: "Budoucí nástroje", feature7_desc: "Automaticky získejte každý nový prémiový nástroj, který vydáme.", feature8_title: "Podpořte vývoj", feature8_desc: "Pomozte udržet základní platformu zdarma pro všechny učitele." },
              share: { title: "Šířit dál!" },
              feedback: { title: "Poskytnout zpětnou vazbu", intro: "Rádi bychom slyšeli vaše názory!", ratingLegend: "Jak byste ohodnotili svou zkušenost?", commentsLabel: "Komentáře", commentsPlaceholder: "Řekněte nám, co se vám líbilo nebo co by se dalo vylepšit...", submitButton: "Odeslat", submitButtonSending: "Odesílání...", submitButtonSuccess: "Děkujeme!" }
          },
          tour: {
              step1: { title: "Vítejte v Teacher Toybox!", content: "Toto je vaše digitální velící centrum pro třídu. Projděme si rychle hlavní ovládací prvky. Klikněte na \"Další\" pro pokračování." },
              step2: { title: "Přidat okno", content: "Toto tlačítko přidá nové okno. Pokud ještě žádné není otevřené, kliknu na něj za vás, abychom se mohli podívat na nástroje okna." },
              step3: { title: "Paleta nástrojů okna", content: "Výborně! Toto je paleta nástrojů pro nové okno. Obsahuje nástroje jako kreslicí plátno a textový editor." },
              step4: { title: "Kreslicí plátno", content: "Například kliknutím na toto tlačítko se okno změní na interaktivní tabuli. Zkusme to." },
              step5: { title: "Uspořádat obrazovku", content: "Toto tlačítko odhalí přednastavená rozložení. Můžete okamžitě uspořádat okna do rozdělené obrazovky, kvadrantů a dalších." },
              step6: { title: "Přesunout a změnit velikost", content: "Můžete také přetáhnout tuto lištu pro přesun oken a měnit jejich velikost z jakéhokoli okraje nebo rohu." },
              step7: { title: "Nápověda a zdroje", content: "To jsou základy! Toto tlačítko sdružuje prohlídku, demo video a další informace. Klikněte na 'Dokončit' a začněte objevovat." }
          }
      },
      es: {
          meta: { title: "Teacher Toybox | Pizarra Digital Interactiva y Gratuita para Aulas", titleShort: "Teacher Toybox | Pizarra Interactiva", description: "Teacher Toybox es una pizarra digital interactiva gratuita con temporizadores, dados y más para hacer las lecciones más atractivas. No requiere instalación.", keywords: "pizarra digital, pizarra interactiva, herramientas para profesores, recursos para el aula, herramientas gratuitas para profesores, temporizador en línea, actividades para el aula, educación" },
          site: { brand: "Teacher Toybox", subtitle: "Una pizarra hecha por profesores para profesores." },
          lang: { label: "Idioma" },
          btn: { tablet: "Edición Tableta", "tablet.title": "Cambiar a Edición Tableta", clock: "Activar Reloj (K)", add: "Añadir Ventana (N)", layouts: "Cambiar Diseños (L)", colour: "Color del Sitio Web (X)", color: "Seleccionar Color (C)", magic: "Extraer Color del Contenido (M)", themePalette: "Paleta de Temas (Z)", originalColor: "Color Original", bell: "Tocar Campana (B)", shh: "Sonido de Silencio (S)", "shh.label": "Shh", management: "Herramientas de Gestión (/)", help: "Ayuda y Recursos (?)", laser: "Activar Puntero Láser (P)", tour: "Iniciar Tour Guiado", demo: "Ver Vídeo Demo", info: "Mostrar Información", refresh: "Recargar Página (R)", share: "Compartir (J)", feedback: "Enviar Comentarios (F)", coffee: "Invítame a un café (Y)", upgrade: "Actualizar a Premium (U)" },
          layout: { 1: "Diseño 1: Pantalla Completa (1)", 2: "Diseño 2: División Vertical (2)", 3: "Diseño 3: Principal Izquierda (3)", 4: "Diseño 4: Principal Derecha (4)", 5: "Diseño 5: Cuatro Cuadrantes (5)", 6: "Diseño 6: Columna Derecha Alta (6)", 7: "Diseño 7: Columna 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Hazte Premium", intro: "¡Potencia tu aula desbloqueando todas las herramientas interactivas de Teacher Toybox!", feature1_title: "Desbloquea Todo", feature1_desc: "Obtén acceso inmediato a todas las herramientas premium.", feature2_title: "Webcam y Cámara de Documentos", feature2_desc: "Usa tu webcam para demostraciones en vivo.", feature3_title: "Carrusel de Fotos", feature3_desc: "Crea historias visuales y presentaciones atractivas.", feature4_title: "Gamifica las Lecciones", feature4_desc: "Usa el Lanzador de Dados y los Contadores para que aprender sea divertido.", feature5_title: "Gestiona el Tiempo", feature5_desc: "Gestiona sin esfuerzo el tiempo en el aula con temporizadores y cronómetros.", feature6_title: "Control Avanzado", feature6_desc: "Ajusta la opacidad y superpón tus ventanas para una configuración perfecta.", feature7_title: "Herramientas Futuras", feature7_desc: "Recibe automáticamente cada nueva herramienta premium que lancemos.", feature8_title: "Apoya el Desarrollo", feature8_desc: "Ayuda a mantener la plataforma principal gratuita para todos los profesores." },
              share: { title: "¡Corre la voz!" },
              feedback: { title: "Enviar Comentarios", intro: "¡Nos encantaría conocer tu opinión!", ratingLegend: "¿Cómo calificarías tu experiencia?", commentsLabel: "Comentarios", commentsPlaceholder: "Dinos qué te gustó o qué podríamos mejorar...", submitButton: "Enviar", submitButtonSending: "Enviando...", submitButtonSuccess: "¡Gracias!" }
          },
          tour: {
              step1: { title: "¡Bienvenido a Teacher Toybox!", content: "Este es tu centro de mando digital para el aula. Repasemos rápidamente los controles principales. Haz clic en \"Siguiente\" para continuar." },
              step2: { title: "Añadir una Ventana", content: "Este botón añade una nueva ventana. Si no hay una abierta, haré clic por ti para que podamos ver las herramientas de la ventana." },
              step3: { title: "Paleta de Herramientas de Ventana", content: "¡Excelente! Esta es la paleta de herramientas para la nueva ventana. Tiene herramientas como un lienzo de dibujo y un editor de texto." },
              step4: { title: "Lienzo de Dibujo", content: "Por ejemplo, al hacer clic en este botón, la ventana se convierte en una pizarra interactiva. ¡Probémoslo!" },
              step5: { title: "Organiza tu Pantalla", content: "Este botón revela diseños preestablecidos. Puedes organizar instantáneamente tus ventanas en pantalla dividida, cuadrantes y más." },
              step6: { title: "Mover y Redimensionar", content: "También puedes arrastrar esta barra para mover las ventanas y redimensionarlas desde cualquier borde o esquina." },
              step7: { title: "Ayuda y Recursos", content: "¡Eso es lo básico! Este botón agrupa el tour, el video de demostración y más información. Haz clic en 'Finalizar' para empezar a explorar." }
          }
      },
      uk: {
          meta: { title: "Teacher Toybox | Безкоштовна інтерактивна дошка для вчителів", titleShort: "Teacher Toybox | Інтерактивна дошка", description: "Teacher Toybox — це безкоштовна інтерактивна цифрова дошка з таймерами, кубиками та іншим, щоб зробити уроки захоплюючими. Встановлення не потрібне.", keywords: "цифрова дошка, інтерактивна дошка, інструменти для вчителів, ресурси для класу, безкоштовні інструменти для вчителів, онлайн-таймер, класні заходи, освіта" },
          site: { brand: "Teacher Toybox", subtitle: "Дошка, створена вчителями для вчителів." },
          lang: { label: "Мова" },
          btn: { tablet: "Версія для планшета", "tablet.title": "Перейти на версію для планшета", clock: "Переключити годинник (K)", add: "Додати вікно (N)", layouts: "Переключити макети (L)", colour: "Колір сайту (X)", color: "Вибрати колір (C)", magic: "Витягти колір (M)", themePalette: "Палітра тем (Z)", originalColor: "Оригінальний колір", bell: "Дзвоник (B)", shh: "Звук 'тсс' (S)", "shh.label": "Тсс", management: "Інструменти управління (/)", help: "Допомога (?)", laser: "Лазерна указка (P)", tour: "Почати тур", demo: "Демо-відео", info: "Інформація", refresh: "Оновити (R)", share: "Поділитися (J)", feedback: "Відгук (F)", coffee: "Пригостити кавою (Y)", upgrade: "Оновити до Premium (U)" },
          layout: { 1: "Макет 1: Повний екран (1)", 2: "Макет 2: Вертикальний поділ (2)", 3: "Макет 3: Основний зліва (3)", 4: "Макет 4: Основний справа (4)", 5: "Макет 5: Чотири квадранти (5)", 6: "Макет 6: Високий правий стовпець (6)", 7: "Макет 7: Стовпець 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Перейти на Premium", intro: "Покращіть свій клас, розблокувавши всі інтерактивні інструменти в Teacher Toybox!", feature1_title: "Розблокувати всі інструменти", feature1_desc: "Отримайте негайний доступ до всіх преміум-інструментів.", feature2_title: "Веб-камера та документ-камера", feature2_desc: "Використовуйте веб-камеру для живих демонстрацій.", feature3_title: "Карусель фотографій", feature3_desc: "Створюйте захоплюючі візуальні історії та слайд-шоу.", feature4_title: "Гейміфікуйте уроки", feature4_desc: "Використовуйте кубики та лічильники, щоб зробити навчання веселим.", feature5_title: "Керуйте часом", feature5_desc: "Легко керуйте часом у класі за допомогою таймерів та секундомірів.", feature6_title: "Розширений контроль", feature6_desc: "Налаштовуйте прозорість та шари вікон для ідеального налаштування.", feature7_title: "Майбутні інструменти", feature7_desc: "Автоматично отримуйте кожен новий преміум-інструмент, який ми випускаємо.", feature8_title: "Підтримайте розробку", feature8_desc: "Допоможіть зберегти основну платформу безкоштовною для всіх вчителів." },
              share: { title: "Поширюйте!" },
              feedback: { title: "Надіслати відгук", intro: "Ми хотіли б почути ваші думки!", ratingLegend: "Як би ви оцінили свій досвід?", commentsLabel: "Коментарі", commentsPlaceholder: "Розкажіть, що вам сподобалося або що можна було б покращити...", submitButton: "Надіслати", submitButtonSending: "Надсилання...", submitButtonSuccess: "Дякуємо!" }
          },
          tour: {
              step1: { title: "Ласкаво просимо до Teacher Toybox!", content: "Це ваш цифровий командний центр для класної кімнати. Давайте швидко пройдемося по основним елементам керування. Натисніть \"Далі\", щоб продовжити." },
              step2: { title: "Додати вікно", content: "Ця кнопка додає нове вікно. Якщо ще немає відкритого, я натисну її за вас, щоб ми могли подивитися на інструменти вікна." },
              step3: { title: "Палітра інструментів вікна", content: "Чудово! Це палітра інструментів для нового вікна. Вона має такі інструменти, як полотно для малювання та текстовий редактор." },
              step4: { title: "Полотно для малювання", content: "Наприклад, натискання цієї кнопки перетворює вікно на інтерактивну дошку. Спробуймо." },
              step5: { title: "Організуйте свій екран", content: "Ця кнопка показує попередньо встановлені макети. Ви можете миттєво організувати свої вікна у розділений екран, квадранти тощо." },
              step6: { title: "Переміщення та зміна розміру", content: "Ви також можете перетягувати цю панель для переміщення вікон і змінювати їх розмір з будь-якого краю або кута." },
              step7: { title: "Допомога та ресурси", content: "Це основи! Ця кнопка об'єднує екскурсію, демонстраційне відео та додаткову інформацію. Натисніть 'Завершити', щоб почати дослідження." }
          }
      },
      zh: {
          meta: { title: "教师玩具箱 | 免费的课堂交互式数字白板", titleShort: "教师玩具箱 | 交互式白板", description: "教师玩具箱是一款免费的交互式数字白板，配有计时器、骰子等工具，让课程更具吸引力。无需安装。", keywords: "数字白板, 交互式白板, 教师工具, 课堂资源, 免费教师工具, 在线计时器, 课堂活动, 教育" },
          site: { brand: "教师玩具箱", subtitle: "由教师为教师打造的白板。" },
          lang: { label: "语言" },
          btn: { tablet: "平板版", "tablet.title": "切换到平板版", clock: "切换时钟 (K)", add: "添加窗口 (N)", layouts: "切换布局 (L)", colour: "网站颜色 (X)", color: "选择颜色 (C)", magic: "提取颜色 (M)", themePalette: "主题调色板 (Z)", originalColor: "原始颜色", bell: "响铃 (B)", shh: "安静声 (S)", "shh.label": "嘘", management: "管理工具 (/)", help: "帮助 (?)", laser: "激光笔 (P)", tour: "开始导览", demo: "演示视频", info: "信息", refresh: "刷新 (R)", share: "分享 (J)", feedback: "反馈 (F)", coffee: "请我喝咖啡 (Y)", upgrade: "升级到高级版 (U)" },
          layout: { 1: "布局1：全屏 (1)", 2: "布局2：垂直分割 (2)", 3: "布局3：左侧主窗口 (3)", 4: "布局4：右侧主窗口 (4)", 5: "布局5：四象限 (5)", 6: "布局6：高右栏 (6)", 7: "布局7：1-2-2列 (7)" },
          panel: {
              upgrade: { title: "升级到高级版", intro: "通过解锁教师玩具箱中的所有交互式工具，为您的课堂增添动力！", feature1_title: "解锁所有工具", feature1_desc: "立即使用所有高级工具。", feature2_title: "网络摄像头和文件摄像头", feature2_desc: "使用您的网络摄像头进行实时演示。", feature3_title: "照片轮播", feature3_desc: "创建引人入胜的视觉故事和幻灯片。", feature4_title: "游戏化课程", feature4_desc: "使用骰子和计数器使学习变得有趣。", feature5_title: "管理时间", feature5_desc: "使用计时器和秒表轻松管理课堂时间。", feature6_title: "高级控制", feature6_desc: "调整不透明度并分层窗口以实现完美设置。", feature7_title: "未来工具", feature7_desc: "自动获取我们发布的每个新的高级工具。", feature8_title: "支持开发", feature8_desc: "帮助所有教师免费使用核心平台。" },
              share: { title: "分享给他人！" },
              feedback: { title: "提供反馈", intro: "我们很想听听您的想法！", ratingLegend: "您如何评价您的体验？", commentsLabel: "评论", commentsPlaceholder: "告诉我们您喜欢什么或者可以改进的地方...", submitButton: "提交", submitButtonSending: "发送中...", submitButtonSuccess: "谢谢！" }
          },
          tour: {
              step1: { title: "欢迎来到教师玩具箱！", content: "这是您的数字课堂指挥中心。让我们快速浏览一下主要控件。点击“下一步”继续。" },
              step2: { title: "添加窗口", content: "此按钮可添加一个新窗口。如果还没有打开的窗口，我会为您点击它，以便我们查看窗口工具。" },
              step3: { title: "窗口工具面板", content: "太棒了！这是新窗口的工具面板。它有绘图画布和文本编辑器等工具。" },
              step4: { title: "绘图画布", content: "例如，点击此按钮可将窗口变成一个交互式白板。我们来试试吧。" },
              step5: { title: "整理您的屏幕", content: "此按钮可显示预设布局。您可以立即将窗口整理成分屏、象限等。" },
              step6: { title: "移动和调整大小", content: "您还可以拖动此栏来移动窗口，并从任何边缘或角落调整它们的大小。" },
              step7: { title: "帮助和资源", content: "基本功能就这些！此按钮集合了导览、演示视频和更多信息。点击“完成”开始探索。" }
          }
      },
      hi: {
          meta: { title: "टीचर टॉयबॉक्स | कक्षाओं के लिए मुफ्त इंटरैक्टिव डिजिटल व्हाइटबोर्ड", titleShort: "टीचर टॉयबॉक्स | इंटरैक्टिव व्हाइटबोर्ड", description: "टीचर टॉयबॉक्स एक मुफ्त इंटरैक्टिव डिजिटल व्हाइटबोर्ड है जिसमें टाइमर, पासा और बहुत कुछ है ताकि पाठों को आकर्षक बनाया जा सके। किसी इंस्टॉलेशन की आवश्यकता नहीं है।", keywords: "डिजिटल व्हाइटबोर्ड, इंटरैक्टिव व्हाइटबोर्ड, शिक्षक उपकरण, कक्षा संसाधन, मुफ्त शिक्षक उपकरण, ऑनलाइन टाइमर, कक्षा गतिविधियाँ, शिक्षा" },
          site: { brand: "टीचर टॉयबॉक्स", subtitle: "शिक्षकों द्वारा शिक्षकों के लिए बनाया गया एक व्हाइटबोर्ड।" },
          lang: { label: "भाषा" },
          btn: { tablet: "टैबलेट संस्करण", "tablet.title": "टैबलेट संस्करण पर स्विच करें", clock: "घड़ी टॉगल करें (K)", add: "नई विंडो जोड़ें (N)", layouts: "लेआउट टॉगल करें (L)", colour: "वेबसाइट का रंग (X)", color: "रंग चुनें (C)", magic: "रंग निकालें (M)", themePalette: "थीम पैलेट (Z)", originalColor: "मूल रंग", bell: "घंटी बजाएं (B)", shh: "चुप कराने की ध्वनि (S)", "shh.label": "श्श", management: "प्रबंधन उपकरण (/)", help: "सहायता (?)", laser: "लेजर पॉइंटर (P)", tour: "टूर शुरू करें", demo: "डेमो वीडियो", info: "जानकारी", refresh: "रीफ्रेश करें (R)", share: "शेयर करें (J)", feedback: "प्रतिक्रिया दें (F)", coffee: "मुझे एक कॉफी खरीदें (Y)", upgrade: "प्रीमियम में अपग्रेड करें (U)" },
          layout: { 1: "लेआउट 1: पूर्ण स्क्रीन (1)", 2: "लेआउट 2: लंबवत विभाजन (2)", 3: "लेआउट 3: मुख्य बाएँ (3)", 4: "लेआउट 4: मुख्य दाएँ (4)", 5: "लेआउट 5: चार चतुर्थांश (5)", 6: "लेआउट 6: लंबा दायां कॉलम (6)", 7: "लेआउट 7: 1-2-2 कॉलम (7)" },
          panel: {
              upgrade: { title: "प्रीमियम बनें", intro: "टीचर टॉयबॉक्स में हर इंटरैक्टिव टूल को अनलॉक करके अपनी कक्षा को सुपरचार्ज करें!", feature1_title: "सभी टूल अनलॉक करें", feature1_desc: "हर प्रीमियम टूल तक तुरंत पहुँच प्राप्त करें।", feature2_title: "वेबकैम और दस्तावेज़ कैमरा", feature2_desc: "लाइव प्रदर्शन के लिए अपने वेबकैम का उपयोग करें।", feature3_title: "फोटो हिंडोला", feature3_desc: "आकर्षक दृश्य कहानियाँ और स्लाइडशो बनाएँ।", feature4_title: "पाठों को गेमिफाई करें", feature4_desc: "सीखने को मजेदार बनाने के लिए डाइस रोलर और काउंटर्स का उपयोग करें।", feature5_title: "समय प्रबंधित करें", feature5_desc: "टाइमर और स्टॉपवॉच के साथ कक्षा के समय को सहजता से प्रबंधित करें।", feature6_title: "उन्नत नियंत्रण", feature6_desc: "सही सेटअप के लिए अपारदर्शिता समायोजित करें और अपनी खिड़कियों को परत करें।", feature7_title: "भविष्य के उपकरण", feature7_desc: "हमारे द्वारा जारी किए गए हर नए प्रीमियम टूल को स्वचालित रूप से प्राप्त करें।", feature8_title: "विकास का समर्थन करें", feature8_desc: "सभी शिक्षकों के लिए कोर प्लेटफॉर्म को मुफ्त रखने में मदद करें।" },
              share: { title: "इसे फैलाएं!" },
              feedback: { title: "प्रतिक्रिया दें", intro: "हमें आपके विचार सुनना अच्छा लगेगा!", ratingLegend: "आप अपने अनुभव को कैसे रेट करेंगे?", commentsLabel: "टिप्पणियाँ", commentsPlaceholder: "हमें बताएं कि आपको क्या पसंद आया या क्या સુધારા जा सकता है...", submitButton: "सबमिट करें", submitButtonSending: "भेज रहा है...", submitButtonSuccess: "धन्यवाद!" }
          },
          tour: {
              step1: { title: "टीचर टॉयबॉक्स में आपका स्वागत है!", content: "यह आपका डिजिटल कक्षा कमांड सेंटर है। आइए मुख्य नियंत्रणों को जल्दी से देखें। जारी रखने के लिए \"अगला\" पर क्लिक करें।" },
              step2: { title: "एक विंडो जोड़ें", content: "यह बटन एक नई विंडो जोड़ता है। यदि पहले से कोई खुली नहीं है, तो मैं आपके लिए इसे क्लिक करूँगा ताकि हम विंडो टूल देख सकें।" },
              step3: { title: "विंडो टूल पैलेट", content: "बहुत बढ़िया! यह नई विंडो के लिए टूल पैलेट है। इसमें ड्राइंग कैनवास और टेक्स्ट एडिटर जैसे टूल हैं।" },
              step4: { title: "ड्राइंग कैनवास", content: "उदाहरण के लिए, इस बटन पर क्लिक करने से विंडो एक इंटरैक्टिव व्हाइटबोर्ड में बदल जाती है। आइए इसे आजमाएं।" },
              step5: { title: "अपनी स्क्रीन व्यवस्थित करें", content: "यह बटन प्रीसेट लेआउट दिखाता है। आप अपनी विंडो को तुरंत स्प्लिटस्क्रीन, क्वाड्रंट्स और बहुत कुछ में व्यवस्थित कर सकते हैं।" },
              step6: { title: "स्थानांतरित करें और आकार बदलें", content: "आप विंडो को स्थानांतरित करने के लिए इस बार को खींच भी सकते हैं, और किसी भी किनारे या कोने से उनका आकार बदल सकते हैं।" },
              step7: { title: "सहायता और संसाधन", content: "यह मूल बातें हैं! यह बटन टूर, डेमो वीडियो और अधिक जानकारी को एक साथ समूहित करता है। अन्वेषण शुरू करने के लिए 'समाप्त' पर क्लिक करें।" }
          }
      },
      fr: {
          meta: { title: "Teacher Toybox | Tableau Blanc Numérique Interactif Gratuit pour les Salles de Classe", titleShort: "Teacher Toybox | Tableau Blanc Interactif", description: "Teacher Toybox est un tableau blanc numérique interactif gratuit avec des minuteurs, des dés et plus encore pour rendre les leçons attrayantes. Aucune installation requise.", keywords: "tableau blanc numérique, tableau blanc interactif, outils pour enseignants, ressources de classe, outils gratuits pour enseignants, minuteur en ligne, activités de classe, éducation" },
          site: { brand: "Teacher Toybox", subtitle: "Un tableau blanc conçu par des enseignants pour des enseignants." },
          lang: { label: "Langue" },
          btn: { tablet: "Édition Tablette", "tablet.title": "Passer à l'édition Tablette", clock: "Afficher/Masquer l'horloge (K)", add: "Ajouter une fenêtre (N)", layouts: "Changer de disposition (L)", colour: "Couleur du site (X)", color: "Sélectionner une couleur (C)", magic: "Extraire la couleur (M)", themePalette: "Palette de thèmes (Z)", originalColor: "Couleur d'origine", bell: "Sonnerie (B)", shh: "Son 'Chut' (S)", "shh.label": "Chut", management: "Outils de gestion (/)", help: "Aide (?)", laser: "Pointeur laser (P)", tour: "Démarrer le tour", demo: "Vidéo de démonstration", info: "Informations", refresh: "Actualiser (R)", share: "Partager (J)", feedback: "Donner un avis (F)", coffee: "Offrez-moi un café (Y)", upgrade: "Passer à Premium (U)" },
          layout: { 1: "Disposition 1 : Plein écran (1)", 2: "Disposition 2 : Division verticale (2)", 3: "Disposition 3 : Principal à gauche (3)", 4: "Disposition 4 : Principal à droite (4)", 5: "Disposition 5 : Quatre quadrants (5)", 6: "Disposition 6 : Colonne droite haute (6)", 7: "Disposition 7 : Colonne 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Passez à Premium", intro: "Dynamisez votre classe en débloquant tous les outils interactifs de Teacher Toybox !", feature1_title: "Débloquez tous les outils", feature1_desc: "Accédez immédiatement à tous les outils premium.", feature2_title: "Webcam et visualiseur", feature2_desc: "Utilisez votre webcam pour des démonstrations en direct.", feature3_title: "Carrousel de photos", feature3_desc: "Créez des histoires visuelles et des diaporamas attrayants.", feature4_title: "Ludifiez les leçons", feature4_desc: "Utilisez le lanceur de dés et les compteurs pour rendre l'apprentissage amusant.", feature5_title: "Gérez le temps", feature5_desc: "Gérez sans effort le temps de classe avec des minuteurs et des chronomètres.", feature6_title: "Contrôle avancé", feature6_desc: "Ajustez l'opacité et superposez vos fenêtres pour une configuration parfaite.", feature7_title: "Outils futurs", feature7_desc: "Recevez automatiquement chaque nouvel outil premium que nous publions.", feature8_title: "Soutenez le développement", feature8_desc: "Aidez à maintenir la plateforme de base gratuite pour tous les enseignants." },
              share: { title: "Faites passer le mot !" },
              feedback: { title: "Donner votre avis", intro: "Nous aimerions connaître votre opinion !", ratingLegend: "Comment évalueriez-vous votre expérience ?", commentsLabel: "Commentaires", commentsPlaceholder: "Dites-nous ce que vous avez aimé ou ce qui pourrait être amélioré...", submitButton: "Envoyer", submitButtonSending: "Envoi...", submitButtonSuccess: "Merci !" }
          },
          tour: {
              step1: { title: "Bienvenue sur Teacher Toybox !", content: "Ceci est votre centre de commande numérique pour la classe. Passons rapidement en revue les commandes principales. Cliquez sur « Suivant » pour continuer." },
              step2: { title: "Ajouter une fenêtre", content: "Ce bouton ajoute une nouvelle fenêtre. S'il n'y en a pas déjà une d'ouverte, je cliquerai dessus pour vous afin que nous puissions examiner les outils de la fenêtre." },
              step3: { title: "Palette d'outils de la fenêtre", content: "Excellent ! Ceci est la palette d'outils pour la nouvelle fenêtre. Elle contient des outils comme une toile de dessin et un éditeur de texte." },
              step4: { title: "Toile de dessin", content: "Par exemple, en cliquant sur ce bouton, la fenêtre se transforme en tableau blanc interactif. Essayons." },
              step5: { title: "Organisez votre écran", content: "Ce bouton révèle des mises en page prédéfinies. Vous pouvez organiser instantanément vos fenêtres en écran partagé, en quadrants, et plus encore." },
              step6: { title: "Déplacer et redimensionner", content: "Vous pouvez également faire glisser cette barre pour déplacer les fenêtres, et les redimensionner depuis n'importe quel bord ou coin." },
              step7: { title: "Aide et ressources", content: "Voilà les bases ! Ce bouton regroupe la visite guidée, la vidéo de démonstration et plus d'informations. Cliquez sur 'Terminer' pour commencer à explorer." }
          }
      },
      ar: {
          meta: { title: "Teacher Toybox | سبورة رقمية تفاعلية مجانية للفصول الدراسية", titleShort: "Teacher Toybox | سبورة تفاعلية", description: "Teacher Toybox هي سبورة رقمية تفاعلية مجانية بها مؤقتات ونرد وغير ذلك لجعل الدروس جذابة. لا يلزم التثبيت.", keywords: "سبورة رقمية, سبورة تفاعلية, أدوات المعلم, موارد الفصل الدراسي, أدوات المعلم المجانية, مؤقت عبر الإنترنت, أنشطة الفصل, التعليم" },
          site: { brand: "Teacher Toybox", subtitle: "سبورة بناها معلمون للمعلمين." },
          lang: { label: "اللغة" },
          btn: { tablet: "إصدار الجهاز اللوحي", "tablet.title": "التبديل إلى إصدار الجهاز اللوحي", clock: "تبديل الساعة (K)", add: "إضافة نافذة جديدة (N)", layouts: "تبديل التخطيطات (L)", colour: "لون الموقع (X)", color: "تحديد لون (C)", magic: "استخراج اللون (M)", themePalette: "لوحة السمات (Z)", originalColor: "اللون الأصلي", bell: "رنين الجرس (B)", shh: "صوت 'صه' (S)", "shh.label": "صه", management: "أدوات الإدارة (/)", help: "مساعدة (؟)", laser: "مؤشر الليزر (P)", tour: "بدء الجولة", demo: "فيديو تجريبي", info: "معلومات", refresh: "تحديث (R)", share: "مشاركة (J)", feedback: "تقديم ملاحظات (F)", coffee: "اشتر لي قهوة (Y)", upgrade: "الترقية إلى بريميوم (U)" },
          layout: { 1: "التخطيط 1: ملء الشاشة (1)", 2: "التخطيط 2: تقسيم عمودي (2)", 3: "التخطيط 3: الرئيسي على اليسار (3)", 4: "التخطيط 4: الرئيسي على اليمين (4)", 5: "التخطيط 5: أربعة أرباع (5)", 6: "التخطيط 6: عمود أيمن طويل (6)", 7: "التخطيط 7: عمود 1-2-2 (7)" },
          panel: {
              upgrade: { title: "انتقل إلى بريميوم", intro: "قم بتعزيز فصلك الدراسي عن طريق فتح كل أداة تفاعلية في Teacher Toybox!", feature1_title: "فتح جميع الأدوات", feature1_desc: "احصل على وصول فوري إلى كل أداة متميزة.", feature2_title: "كاميرا الويب وكاميرا المستندات", feature2_desc: "استخدم كاميرا الويب الخاصة بك للعروض التوضيحية الحية.", feature3_title: "دائري الصور", feature3_desc: "أنشئ قصصًا مرئية وعروض شرائح جذابة.", feature4_title: "أضف طابع الألعاب على الدروس", feature4_desc: "استخدم أداة رمي النرد والعدادات لجعل التعلم ممتعًا.", feature5_title: "إدارة الوقت", feature5_desc: "إدارة وقت الفصل بسهولة باستخدام المؤقتات وساعات الإيقاف.", feature6_title: "تحكم متقدم", feature6_desc: "اضبط العتامة وقم بوضع طبقات على نوافذك للحصول على إعداد مثالي.", feature7_title: "أدوات مستقبلية", feature7_desc: "احصل تلقائيًا على كل أداة متميزة جديدة نصدرها.", feature8_title: "دعم التطوير", feature8_desc: "ساعد في الحفاظ على النظام الأساسي مجانيًا لجميع المعلمين." },
              share: { title: "انشر الخبر!" },
              feedback: { title: "تقديم ملاحظات", intro: "يسعدنا أن نسمع أفكارك!", ratingLegend: "كيف تقيم تجربتك؟", commentsLabel: "تعليقات", commentsPlaceholder: "أخبرنا بما أعجبك أو ما يمكن تحسينه ...", submitButton: "إرسال", submitButtonSending: "جار الإرسال ...", submitButtonSuccess: "شكرًا لك!" }
          },
          tour: {
              step1: { title: "أهلاً بك في Teacher Toybox!", content: "هذا هو مركز قيادة الفصل الدراسي الرقمي الخاص بك. لنتصفح بسرعة عناصر التحكم الرئيسية. انقر على \"التالي\" للمتابعة." },
              step2: { title: "إضافة نافذة", content: "هذا الزر يضيف نافذة جديدة. إذا لم تكن هناك نافذة مفتوحة بالفعل، سأنقر عليه من أجلك حتى نتمكن من إلقاء نظرة على أدوات النافذة." },
              step3: { title: "لوحة أدوات النافذة", content: "ممتاز! هذه هي لوحة الأدوات للنافذة الجديدة. تحتوي على أدوات مثل لوحة الرسم ومحرر النصوص." },
              step4: { title: "لوحة الرسم", content: "على سبيل المثال، النقر على هذا الزر يحول النافذة إلى سبورة تفاعلية. لنجرب ذلك." },
              step5: { title: "ترتيب شاشتك", content: "هذا الزر يكشف عن تخطيطات محددة مسبقًا. يمكنك تنظيم نوافذك فورًا في شاشة مقسمة، أرباع، والمزيد." },
              step6: { title: "تحريك وتغيير الحجم", content: "يمكنك أيضًا سحب هذا الشريط لتحريك النوافذ، وتغيير حجمها من أي حافة أو زاوية." },
              step7: { title: "المساعدة والمصادر", content: "هذه هي الأساسيات! هذا الزر يجمع الجولة، الفيديو التجريبي، والمزيد من المعلومات. انقر على 'إنهاء' لبدء الاستكشاف." }
          }
      },
      fa: {
          meta: { title: "Teacher Toybox | تخته سفید دیجیتال تعاملی رایگان برای کلاس های درس", titleShort: "Teacher Toybox | تخته سفید تعامли", description: "Teacher Toybox یک تخته سفید دیجیتال تعاملی رایگان با تایمر، تاس و موارد دیگر برای جذاب کردن دروس است. نیازی به نصب ندارد.", keywords: "تخته سفید دیجیتال, تخته سفید تعاملی, ابزار معلم, منابع کلاس درس, ابزار رایگان معلم, تایمر آنلاین, فعالیت های کلاس, آموزش" },
          site: { brand: "Teacher Toybox", subtitle: "تخته سفیدی که توسط معلمان برای معلمان ساخته شده است." },
          lang: { label: "زبان" },
          btn: { tablet: "نسخه تبلت", "tablet.title": "رفتن به نسخه تبلت", clock: "تغییر ساعت (K)", add: "افزودن پنجره (N)", layouts: "تغییر چیدمان (L)", colour: "رنگ وب سایت (X)", color: "انتخاب رنگ (C)", magic: "استخراج رنگ (M)", themePalette: "پالت تم (Z)", originalColor: "رنگ اصلی", bell: "زنگ (B)", shh: "صدای 'هیس' (S)", "shh.label": "هیس", management: "ابزارهای مدیریت (/)", help: "راهنما (؟)", laser: "اشاره گر لیzری (P)", tour: "شروع تور", demo: "ویدیوی نمایشی", info: "اطلاعات", refresh: "بازخوانی (R)", share: "اشتراک گذاری (J)", feedback: "ارائه بازخورد (F)", coffee: "یک قهوه برایم بخر (Y)", upgrade: "ارتقا به پریمیوم (U)" },
          layout: { 1: "چیدمان ۱: تمام صفحه (1)", 2: "چیدمان ۲: تقسیم عمودی (2)", 3: "چیدمان ۳: اصلی چپ (3)", 4: "چیدمان ۴: اصلی راست (4)", 5: "چیدمان ۵: چهار ربع (5)", 6: "چیدمان ۶: ستون بلند راست (6)", 7: "چیدمان ۷: ستون ۱-۲-۲ (7)" },
          panel: {
              upgrade: { title: "پریمیوم شوید", intro: "با باز کردن قفل تمام ابزارهای تعاملی در Teacher Toybox، کلاس درس خود را تقویت کنید!", feature1_title: "باز کردن تمام ابزارها", feature1_desc: "دسترسی فوری به تمام ابزارهای پریمیوم داشته باشید.", feature2_title: "وب کم و دوربین اسناد", feature2_desc: "از وب کم خود برای نمایش های زنده استفاده کنید.", feature3_title: "چرخ و فلک عکس", feature3_desc: "داستان های بصری و نمایش اسلاید جذاب ایجاد کنید.", feature4_title: "بازی سازی دروس", feature4_desc: "از تاس انداز و شمارنده ها برای سرگرم کننده کردن یادگیری استفاده کنید.", feature5_title: "مدیریت زمان", feature5_desc: "با تایمر و کرونومتر به راحتی زمان کلاس را مدیریت کنید.", feature6_title: "کنترل پیشرفته", feature6_desc: "برای تنظیمات عالی، شفافیت را تنظیم کرده و پنجره های خود را لایه بندی کنید.", feature7_title: "ابزارهای آینده", feature7_desc: "به طور خودکار هر ابزار پریمیوم جدیدی را که منتشر می کنیم دریافت کنید.", feature8_title: "حمایت از توسعه", feature8_desc: "کمک کنید تا پلتفرم اصلی برای همه معلمان رایگان بماند." },
              share: { title: "منتشر کنید!" },
              feedback: { title: "ارائه بازخورد", intro: "دوست داریم نظرات شما را بشنویم!", ratingLegend: "تجربه خود را چگونه ارزیابی می کنید؟", commentsLabel: "نظرات", commentsPlaceholder: "به ما بگویید چه چیزی را دوست داشتید یا چه چیزی می تواند بهبود یابد...", submitButton: "ارسال", submitButtonSending: "در حال ارسال...", submitButtonSuccess: "متشکرم!" }
          },
          tour: {
              step1: { title: "به Teacher Toybox خوش آمدید!", content: "این مرکز فرماندهی دیجیتال کلاس درس شماست. بیایید به سرعت کنترل های اصلی را مرور کنیم. برای ادامه روی «بعدی» کلیک کنید." },
              step2: { title: "افزودن یک پنجره", content: "این دکمه یک پنجره جدید اضافه می کند. اگر پنجره ای باز نیست، من آن را برای شما کلیک می کنم تا بتوانیم ابزارهای پنجره را ببینیم." },
              step3: { title: "پالت ابزار پنجره", content: "عالی! این پالت ابزار برای پنجره جدید است. ابزارهایی مانند بوم نقاشی و ویرایشگر متن دارد." },
              step4: { title: "بوم نقاشی", content: "به عنوان مثال، با کلیک بر روی این دکمه، پنجره به یک تخته سفید تعاملی تبدیل می شود. بیایید امتحان کنیم." },
              step5: { title: "صفحه خود را مرتب کنید", content: "این دکمه طرح بندی های از پیش تعیین شده را نشان می دهد. شما می توانید فوراً پنجره های خود را به صورت تقسیم صفحه، ربع و غیره سازماندهی کنید." },
              step6: { title: "حرکت و تغییر اندازه", content: "شما همچنین می توانید این نوار را برای حرکت پنجره ها بکشید و اندازه آنها را از هر لبه یا گوشه ای تغییر دهید." },
              step7: { title: "راهنما و منابع", content: "اینها اصول اولیه هستند! این دکمه تور، ویدیوی نمایشی و اطلاعات بیشتر را با هم گروه بندی می کند. برای شروع کاوش، روی 'پایان' کلیک کنید." }
          }
      },
      pt: {
          meta: { title: "Teacher Toybox | Quadro Branco Digital Interativo Gratuito para Salas de Aula", titleShort: "Teacher Toybox | Quadro Branco Interativo", description: "O Teacher Toybox é um quadro branco digital interativo gratuito com cronômetros, dados e muito mais para tornar as aulas envolventes. Nenhuma instalação é necessária.", keywords: "quadro branco digital, quadro branco interativo, ferramentas para professores, recursos de sala de aula, ferramentas gratuitas para professores, cronômetro online, atividades de sala de aula, educação" },
          site: { brand: "Teacher Toybox", subtitle: "Um quadro branco construído por professores para professores." },
          lang: { label: "Idioma" },
          btn: { tablet: "Edição para Tablet", "tablet.title": "Mudar para a Edição para Tablet", clock: "Alternar Relógio (K)", add: "Adicionar Janela (N)", layouts: "Alternar Layouts (L)", colour: "Cor do Site (X)", color: "Selecionar Cor (C)", magic: "Extrair Cor (M)", themePalette: "Paleta de Temas (Z)", originalColor: "Cor Original", bell: "Tocar Sino (B)", shh: "Som de 'Shh' (S)", "shh.label": "Shh", management: "Ferramentas de Gestão (/)", help: "Ajuda (?)", laser: "Ponteiro Laser (P)", tour: "Iniciar Tour", demo: "Vídeo de Demonstração", info: "Informações", refresh: "Atualizar (R)", share: "Compartilhar (J)", feedback: "Enviar Feedback (F)", coffee: "Pague-me um café (Y)", upgrade: "Atualizar para Premium (U)" },
          layout: { 1: "Layout 1: Tela Cheia (1)", 2: "Layout 2: Divisão Vertical (2)", 3: "Layout 3: Principal à Esquerda (3)", 4: "Layout 4: Principal à Direita (4)", 5: "Layout 5: Quatro Quadrantes (5)", 6: "Layout 6: Coluna Direita Alta (6)", 7: "Layout 7: Coluna 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Seja Premium", intro: "Potencialize sua sala de aula desbloqueando todas as ferramentas interativas do Teacher Toybox!", feature1_title: "Desbloqueie Todas as Ferramentas", feature1_desc: "Tenha acesso imediato a todas as ferramentas premium.", feature2_title: "Webcam e Câmera de Documentos", feature2_desc: "Use sua webcam para demonstrações ao vivo.", feature3_title: "Carrossel de Fotos", feature3_desc: "Crie histórias visuais e apresentações de slides envolventes.", feature4_title: "Gamifique as Aulas", feature4_desc: "Use o Rolo de Dados e os Contadores para tornar o aprendizado divertido.",
              feature5_title: "Gerencie o Tempo", feature5_desc: "Gerencie o tempo da sala de aula sem esforço com cronômetros e temporizadores.", feature6_title: "Controle Avançado", feature6_desc: "Ajuste a opacidade e sobreponha suas janelas para a configuração perfeita.", feature7_title: "Ferramentas Futuras", feature7_desc: "Receba automaticamente todas as novas ferramentas premium que lançarmos.", feature8_title: "Apoie o Desenvolvimento", feature8_desc: "Ajude a manter a plataforma principal gratuita para todos os professores." },
              share: { title: "Divulgue!" },
              feedback: { title: "Enviar Feedback", intro: "Adoraríamos ouvir suas opiniões!", ratingLegend: "Como você avaliaria sua experiência?", commentsLabel: "Comentários", commentsPlaceholder: "Diga-nos o que você gostou ou o que poderia ser melhorado...", submitButton: "Enviar", submitButtonSending: "Enviando...", submitButtonSuccess: "Obrigado!" }
          },
          tour: {
              step1: { title: "Bem-vindo ao Teacher Toybox!", content: "Este é o seu centro de comando digital da sala de aula. Vamos percorrer rapidamente os controles principais. Clique em \"Avançar\" para continuar." },
              step2: { title: "Adicionar uma Janela", content: "Este botão adiciona uma nova janela. Se ainda não houver uma aberta, eu clico para você para que possamos ver as ferramentas da janela." },
              step3: { title: "Paleta de Ferramentas da Janela", content: "Excelente! Esta é a paleta de ferramentas para a nova janela. Ela possui ferramentas como uma tela de desenho e um editor de texto." },
              step4: { title: "Tela de Desenho", content: "Por exemplo, clicar neste botão transforma a janela em um quadro branco interativo. Vamos experimentar." },
              step5: { title: "Organize sua Tela", content: "Este botão revela layouts predefinidos. Você pode organizar instantaneamente suas janelas em tela dividida, quadrantes e muito mais." },
              step6: { title: "Mover e Redimensionar", content: "Você também pode arrastar esta barra para mover as janelas e redimensioná-las a partir de qualquer borda ou canto." },
              step7: { title: "Ajuda e Recursos", content: "Isso é o básico! Este botão agrupa o tour, o vídeo de demonstração e mais informações. Clique em 'Concluir' para começar a explorar." }
          }
      },
      ru: {
          meta: { title: "Teacher Toybox | Бесплатная интерактивная цифровая доска для классов", titleShort: "Teacher Toybox | Интерактивная доска", description: "Teacher Toybox - это бесплатная интерактивная цифровая доска с таймерами, кубиками и многим другим, чтобы сделать уроки увлекательными. Установка не требуется.", keywords: "цифровая доска, интерактивная доска, инструменты для учителя, ресурсы для класса, бесплатные инструменты для учителя, онлайн-таймер, классные мероприятия, образование" },
          site: { brand: "Teacher Toybox", subtitle: "Доска, созданная учителями для учителей." },
          lang: { label: "Язык" },
          btn: { tablet: "Планшетная версия", "tablet.title": "Переключиться на планшетную версию", clock: "Переключить часы (K)", add: "Добавить окно (N)", layouts: "Переключить макеты (L)", colour: "Цвет сайта (X)", color: "Выбрать цвет (C)", magic: "Извлечь цвет (M)", themePalette: "Палитра тем (Z)", originalColor: "Исходный цвет", bell: "Звонок (B)", shh: "Звук 'тсс' (S)", "shh.label": "Тсс", management: "Инструменты управления (/)", help: "Помощь (?)", laser: "Лазерная указка (P)", tour: "Начать тур", demo: "Демо-видео", info: "Информация", refresh: "Обновить (R)", share: "Поделиться (J)", feedback: "Оставить отзыв (F)", coffee: "Купи мне кофе (Y)", upgrade: "Перейти на Премиум (U)" },
          layout: { 1: "Макет 1: Полный экран (1)", 2: "Макет 2: Вертикальное разделение (2)", 3: "Макет 3: Основной слева (3)", 4: "Макет 4: Основной справа (4)", 5: "Макет 5: Четыре квадранта (5)", 6: "Макет 6: Высокая правая колонка (6)", 7: "Макет 7: Колонка 1-2-2 (7)" },
          panel: {
              upgrade: { title: "Перейти на Премиум", intro: "Усильте свой класс, разблокировав все интерактивные инструменты в Teacher Toybox!", feature1_title: "Разблокировать все инструменты", feature1_desc: "Получите немедленный доступ ко всем премиум-инструментам.", feature2_title: "Веб-камера и документ-камера", feature2_desc: "Используйте свою веб-камеру для живых демонстраций.", feature3_title: "Фотокарусель", feature3_desc: "Создавайте увлекательные визуальные истории и слайд-шоу.", feature4_title: "Геймифицируйте уроки", feature4_desc: "Используйте игральные кости и счетчики, чтобы сделать обучение увлекательным.", feature5_title: "Управляйте временем", feature5_desc: "Легко управляйте временем в классе с помощью таймеров и секундомеров.", feature6_title: "Расширенное управление", feature6_desc: "Настраивайте прозрачность и слои окон для идеальной настройки.", feature7_title: "Будущие инструменты", feature7_desc: "Автоматически получайте каждый новый премиум-инструмент, который мы выпускаем.", feature8_title: "Поддержите разработку", feature8_desc: "Помогите сохранить основную платформу бесплатной для всех учителей." },
              share: { title: "Расскажите другим!" },
              feedback: { title: "Оставить отзыв", intro: "Мы хотели бы услышать ваше мнение!", ratingLegend: "Как бы вы оценили свой опыт?", commentsLabel: "Комментарии", commentsPlaceholder: "Расскажите нам, что вам понравилось или что можно было бы улучшить...", submitButton: "Отправить", submitButtonSending: "Отправка...", submitButtonSuccess: "Спасибо!" }
          },
          tour: {
              step1: { title: "Добро пожаловать в Teacher Toybox!", content: "Это ваш цифровой командный центр для класса. Давайте быстро пройдемся по основным элементам управления. Нажмите «Далее», чтобы продолжить." },
              step2: { title: "Добавить окно", content: "Эта кнопка добавляет новое окно. Если оно еще не открыто, я нажму его для вас, чтобы мы могли посмотреть на инструменты окна." },
              step3: { title: "Палитра инструментов окна", content: "Отлично! Это палитра инструментов для нового окна. В ней есть такие инструменты, как холст для рисования и текстовый редактор." },
              step4: { title: "Холст для рисования", content: "Например, нажатие этой кнопки превращает окно в интерактивную доску. Давайте попробуем." },
              step5: { title: "Организуйте свой экран", content: "Эта кнопка открывает предустановленные макеты. Вы можете мгновенно организовать свои окна в разделенный экран, квадранты и многое другое." },
              step6: { title: "Перемещение и изменение размера", content: "Вы также можете перетаскивать эту панель для перемещения окон и изменять их размер с любого края или угла." },
              step7: { title: "Помощь и ресурсы", content: "Это основы! Эта кнопка объединяет тур, демонстрационное видео и дополнительную информацию. Нажмите 'Завершить', чтобы начать изучение." }
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

      // NEW: Directly update the info window's language if it is open
      if (window.TT && typeof window.TT.updateInfoWindowLanguage === 'function') {
        window.TT.updateInfoWindowLanguage(lang);
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