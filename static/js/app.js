/**
 * MDS Package Explorer - Client Side Logic
 * Supports UN Multilingual Translation (EN, FR, ES, RU, ZH, AR)
 * and RTL layout automatic switching.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Translation Dictionary (All 6 UN Official Languages)
    const translations = {
        en: {
            name: "English",
            dir: "ltr",
            brand_badge: "CRAN HUB",
            app_title: "MDS Package Explorer",
            subtitle: "Discover R packages for Multidimensional Scaling and related extensions",
            search_placeholder: "Search packages, keywords...",
            sync_cran: "Sync CRAN",
            readme_badge: "README.md",
            readme_title: "R Multidimensional Scaling Ecosystem",
            readme_intro: "This application is an explorer for R packages on CRAN dedicated to Multidimensional Scaling (MDS). At the core of the ecosystem is <strong class=\"highlight-text\">smacof</strong>, which implements the majorization algorithm for metric and non-metric MDS. Other packages extend its functionality or apply it to specific domains (e.g. genetics, asymmetric distances, and optimization).",
            organigram_title: "Package Dependency Organigram",
            legend_core: "Core Hub",
            legend_dep: "Imports / Depends",
            panel_ind_title: "Independent MDS",
            rel_table_title: "Ecosystem Relationships",
            csv_table_title: "Local Registry (mds_packages.csv)",
            th_package: "Package",
            th_integration: "Integration Type",
            th_role: "Primary Role",
            th_version: "Version",
            th_published: "Published Date",
            th_sync: "Sync Status",
            
            badge_core: "Core Engine",
            badge_depends: "Depends on smacof",
            badge_imports: "Imports smacof",
            
            role_smacof: "Multidimensional Scaling (majorization algorithms)",
            role_smacofx: "Flexible multidimensional scaling and smacof extensions",
            role_mdsopt: "Optimal MDS procedure search for metric and interval data",
            role_asymmetry: "Multidimensional scaling of asymmetric proximities",
            role_mdsmap: "High density genetic linkage mapping using MDS",
            role_pams: "Profile analysis via multidimensional scaling",
            
            packages_header_text: "MDS Packages",
            last_synced: "Last Synced",
            empty_title: "No packages found",
            empty_desc: "Try refining your search keyword or click Sync CRAN to fetch the latest details.",
            twitter_title: "Mock Twitter Feed",
            twitter_live: "Live Broadcast",
            twitter_empty: "No tweets posted yet. Click the \"Tweet\" button on any package card to share the updates!",
            
            // Modal
            modal_badge: "TWEET COMPOSER",
            modal_title: "Tweet about package",
            user_display: "R Stats MDS",
            user_handle: "@rstats_mds",
            composer_placeholder: "What's happening in the MDS world?",
            chars_left: "characters left",
            open_x: "Open in X (Twitter)",
            post_mock: "Post Mock Tweet",
            
            // Statuses / Toast
            toast_lang_changed: "Language changed to English!",
            toast_sync_success: "Synced {count} packages from R CRAN!",
            toast_sync_failed: "Sync Failed: {error}",
            toast_tweet_success: "Tweet about {pkg} posted successfully!",
            toast_tweet_failed: "Failed to post tweet: {error}",
            toast_liked: "Tweet Liked!",
            toast_retweeted: "Retweeted!",
            toast_intent: "Opened Twitter Intent in a new tab!",
            
            badge_r_pkg: "R package",
            btn_tweet: "Tweet",
            local_synced: "Local files synced",
            local_pending: "Relocated / Idle",
            status_synced: "Synced",
            status_pending: "Pending",
            btn_posting: "Posting..."
        },
        fr: {
            name: "Français",
            dir: "ltr",
            brand_badge: "HUB CRAN",
            app_title: "Explorateur de Packages MDS",
            subtitle: "Découvrez les packages R pour le positionnement multidimensionnel (MDS) et leurs extensions",
            search_placeholder: "Rechercher des packages, mots-clés...",
            sync_cran: "Sync CRAN",
            readme_badge: "README.md",
            readme_title: "Écosystème de Positionnement Multidimensionnel en R",
            readme_intro: "Cette application est un explorateur pour les packages R sur CRAN dédiés au positionnement multidimensionnel (MDS). Au cœur de l'écosystème se trouve <strong class=\"highlight-text\">smacof</strong>, qui implémente l'algorithme de majoration pour le MDS métrique et non métrique. D'autres packages étendent ses fonctionnalités ou l'appliquent à des domaines spécifiques (ex. génétique, distances asymétriques et optimisation).",
            organigram_title: "Organigramme des Dépendances des Packages",
            legend_core: "Noyau Central",
            legend_dep: "Imports / Dépendances",
            panel_ind_title: "MDS Indépendants",
            rel_table_title: "Relations de l'Écosystème",
            csv_table_title: "Registre Local (mds_packages.csv)",
            th_package: "Package",
            th_integration: "Type d'Intégration",
            th_role: "Rôle Principal",
            th_version: "Version",
            th_published: "Date de Publication",
            th_sync: "Statut de Sync",
            
            badge_core: "Moteur Central",
            badge_depends: "Dépend de smacof",
            badge_imports: "Importe smacof",
            
            role_smacof: "Positionnement multidimensionnel (algorithmes de majoration)",
            role_smacofx: "Positionnement multidimensionnel flexible et extensions de smacof",
            role_mdsopt: "Recherche de la procédure MDS optimale pour les données métriques et d'intervalles",
            role_asymmetry: "Positionnement multidimensionnel des proximités asymétriques",
            role_mdsmap: "Cartographie de liaison génétique à haute densité utilisant le MDS",
            role_pams: "Analyse de profil via le positionnement multidimensionnel",
            
            packages_header_text: "Packages MDS",
            last_synced: "Dernière synchronisation",
            empty_title: "Aucun package trouvé",
            empty_desc: "Essayez de modifier votre mot-clé ou cliquez sur Sync CRAN pour obtenir les derniers détails.",
            twitter_title: "Fil Twitter Simulé",
            twitter_live: "Direct",
            twitter_empty: "Aucun tweet publié pour le moment. Cliquez sur le bouton \"Tweet\" d'un package pour le partager !",
            
            modal_badge: "COMPOSITEUR DE TWEET",
            modal_title: "Tweeter sur le package",
            user_display: "R Stats MDS",
            user_handle: "@rstats_mds",
            composer_placeholder: "Que se passe-t-il dans le monde du MDS ?",
            chars_left: "caractères restants",
            open_x: "Ouvrir dans X (Twitter)",
            post_mock: "Publier le Tweet",
            
            toast_lang_changed: "Langue changée en Français !",
            toast_sync_success: "{count} packages synchronisés depuis le CRAN R !",
            toast_sync_failed: "Échec de la synchronisation : {error}",
            toast_tweet_success: "Le tweet sur {pkg} a été publié avec succès !",
            toast_tweet_failed: "Échec de la publication : {error}",
            toast_liked: "Tweet aimé !",
            toast_retweeted: "Retweeté !",
            toast_intent: "Twitter Intent ouvert dans un nouvel onglet !",
            
            badge_r_pkg: "Package R",
            btn_tweet: "Tweet",
            local_synced: "Fichiers locaux synchronisés",
            local_pending: "Relocalisé / Inactif",
            status_synced: "Synchronisé",
            status_pending: "En attente",
            btn_posting: "Publication..."
        },
        es: {
            name: "Español",
            dir: "ltr",
            brand_badge: "CENTRO CRAN",
            app_title: "Explorador de Paquetes MDS",
            subtitle: "Descubre paquetes de R para Escalado Multidimensional (MDS) y sus extensiones relacionadas",
            search_placeholder: "Buscar paquetes, palabras clave...",
            sync_cran: "Sincronizar CRAN",
            readme_badge: "README.md",
            readme_title: "Ecosistema de Escalado Multidimensional en R",
            readme_intro: "Esta aplicación es un explorador de paquetes de R en CRAN dedicados al Escalado Multidimensional (MDS). En el núcleo del ecosistema está <strong class=\"highlight-text\">smacof</strong>, que implementa el algoritmo de mayoración para MDS métrico y no métrico. Otros paquetes extienden su funcionalidad o la aplican a dominios específicos (ej. genética, distancias asimétricas y optimización).",
            organigram_title: "Organigrama de Dependencias de Paquetes",
            legend_core: "Núcleo Central",
            legend_dep: "Imports / Dependencias",
            panel_ind_title: "MDS Independientes",
            rel_table_title: "Relaciones del Ecosistema",
            csv_table_title: "Registro Local (mds_packages.csv)",
            th_package: "Paquete",
            th_integration: "Tipo de Integración",
            th_role: "Rol Principal",
            th_version: "Versión",
            th_published: "Fecha de Publicación",
            th_sync: "Estado de Sincronización",
            
            badge_core: "Motor Central",
            badge_depends: "Depende de smacof",
            badge_imports: "Importa smacof",
            
            role_smacof: "Escalado multidimensional (algoritmos de mayoración)",
            role_smacofx: "Escalado multidimensional flexible y extensiones de smacof",
            role_mdsopt: "Búsqueda del procedimiento MDS óptimo para datos métricos y de intervalo",
            role_asymmetry: "Escalado multidimensional de proximidades asimétricas",
            role_mdsmap: "Mapeo de ligamiento genético de alta densidad mediante MDS",
            role_pams: "Análisis de perfil mediante escalado multidimensional",
            
            packages_header_text: "Paquetes MDS",
            last_synced: "Última sincronización",
            empty_title: "No se encontraron paquetes",
            empty_desc: "Intenta refinar tu palabra de búsqueda o haz clic en Sincronizar CRAN para obtener detalles actualizados.",
            twitter_title: "Canal de Twitter Simulado",
            twitter_live: "Transmisión en Vivo",
            twitter_empty: "Aún no hay tweets publicados. ¡Haz clic en el botón \"Tweet\" de cualquier tarjeta para compartir actualizaciones!",
            
            modal_badge: "COMPOSITOR DE TWEET",
            modal_title: "Tuitear sobre el paquete",
            user_display: "R Stats MDS",
            user_handle: "@rstats_mds",
            composer_placeholder: "¿Qué está pasando en el mundo del MDS?",
            chars_left: "caracteres restantes",
            open_x: "Abrir en X (Twitter)",
            post_mock: "Publicar Tweet Simulado",
            
            toast_lang_changed: "¡Idioma cambiado a Español!",
            toast_sync_success: "¡Se sincronizaron {count} paquetes desde R CRAN!",
            toast_sync_failed: "Sincronización Fallida: {error}",
            toast_tweet_success: "¡El tweet sobre {pkg} se publicó correctamente!",
            toast_tweet_failed: "Error al publicar tweet: {error}",
            toast_liked: "¡Me gusta añadido!",
            toast_retweeted: "¡Retuiteado!",
            toast_intent: "¡Se abrió Twitter Intent en una nueva pestaña!",
            
            badge_r_pkg: "Paquete R",
            btn_tweet: "Tuitear",
            local_synced: "Archivos locales sincronizados",
            local_pending: "Relocalizado / Inactivo",
            status_synced: "Sincronizado",
            status_pending: "Pendiente",
            btn_posting: "Publicando..."
        },
        ru: {
            name: "Русский",
            dir: "ltr",
            brand_badge: "ЦЕНТР CRAN",
            app_title: "Обзор Пакетов MDS",
            subtitle: "Откройте для себя пакеты R для многомерного шкалирования (MDS) и их расширения",
            search_placeholder: "Поиск пакетов, ключевых слов...",
            sync_cran: "Синхронизация CRAN",
            readme_badge: "README.md",
            readme_title: "Экосистема Многомерного Шкалирования в R",
            readme_intro: "Это приложение предназначено для изучения пакетов R в репозитории CRAN, связанных с многомерным шкалированием (MDS). В основе экосистемы лежит пакет <strong class=\"highlight-text\">smacof</strong>, реализующий алгоритм мажоризации для метрического и неметрического MDS. Другие пакеты расширяют его функционал или применяют его в специальных областях (например, генетике, асимметричных расстояниях и оптимизации).",
            organigram_title: "Органограмма Зависимостей Пакетов",
            legend_core: "Ядро Системы",
            legend_dep: "Импорт / Зависимости",
            panel_ind_title: "Независимые MDS",
            rel_table_title: "Взаимосвязи Экосистемы",
            csv_table_title: "Локальный Реестр (mds_packages.csv)",
            th_package: "Пакет",
            th_integration: "Тип Интеграции",
            th_role: "Основная Роль",
            th_version: "Версия",
            th_published: "Дата Публикации",
            th_sync: "Статус Синхр.",
            
            badge_core: "Основной Движок",
            badge_depends: "Зависит от smacof",
            badge_imports: "Импортирует smacof",
            
            role_smacof: "Многомерное шкалирование (алгоритмы мажоризации)",
            role_smacofx: "Гибкое многомерное шкалирование и расширения smacof",
            role_mdsopt: "Поиск оптимальной процедуры MDS для метрических и интервальных данных",
            role_asymmetry: "Многомерное шкалирование асимметричных сходств",
            role_mdsmap: "Высокоплотное картирование генетического сцепления с использованием MDS",
            role_pams: "Профильный анализ с помощью многомерного шкалирования",
            
            packages_header_text: "Пакеты MDS",
            last_synced: "Последняя синхронизация",
            empty_title: "Пакеты не найдены",
            empty_desc: "Попробуйте уточнить поисковый запрос или нажмите «Синхронизация CRAN» для обновления данных.",
            twitter_title: "Симулируемая Лента Twitter",
            twitter_live: "Прямой Эфир",
            twitter_empty: "Твиты еще не опубликованы. Нажмите кнопку «Tweet» на любой карточке пакета, чтобы поделиться информацией!",
            
            modal_badge: "РЕДАКТОР ТВИТОВ",
            modal_title: "Твитнуть о пакете",
            user_display: "R Stats MDS",
            user_handle: "@rstats_mds",
            composer_placeholder: "Что происходит в мире MDS?",
            chars_left: "символов осталось",
            open_x: "Открыть в X (Twitter)",
            post_mock: "Опубликовать Твит",
            
            toast_lang_changed: "Язык изменен на Русский!",
            toast_sync_success: "Синхронизировано пакетов с R CRAN: {count}!",
            toast_sync_failed: "Ошибка синхронизации: {error}",
            toast_tweet_success: "Твит о {pkg} успешно опубликован!",
            toast_tweet_failed: "Не удалось опубликовать твит: {error}",
            toast_liked: "Лайк добавлен!",
            toast_retweeted: "Ретвитнуто!",
            toast_intent: "Twitter Intent открыт в новой вкладке!",
            
            badge_r_pkg: "Пакет R",
            btn_tweet: "Твитнуть",
            local_synced: "Локальные файлы синхронизированы",
            local_pending: "Перемещен / Неактивен",
            status_synced: "Синхронизирован",
            status_pending: "В ожидании",
            btn_posting: "Публикация..."
        },
        zh: {
            name: "简体中文",
            dir: "ltr",
            brand_badge: "CRAN 中心",
            app_title: "MDS 程序包管理器",
            subtitle: "探索用于多维度量表 (MDS) 的 R 语言程序包及其相关扩展",
            search_placeholder: "搜索程序包、关键字...",
            sync_cran: "同步 CRAN",
            readme_badge: "README.md",
            readme_title: "R 语言多维度量表 (MDS) 生态系统",
            readme_intro: "此应用程序是致力于多维度量表 (MDS) 的 CRAN R 程序包探索器。该生态系统的核心是 <strong class=\"highlight-text\">smacof</strong>，它实现了度量和非度量 MDS 的主化算法。其他程序包扩展了其功能或应用于特定领域（例如：遗传学、非对称距离和优化）。",
            organigram_title: "程序包依赖性关系图",
            legend_core: "核心枢纽",
            legend_dep: "导入 / 依赖",
            panel_ind_title: "独立 MDS",
            rel_table_title: "生态系统关系",
            csv_table_title: "本地注册表 (mds_packages.csv)",
            th_package: "程序包",
            th_integration: "集成类型",
            th_role: "主要角色",
            th_version: "版本",
            th_published: "发布日期",
            th_sync: "同步状态",
            
            badge_core: "核心引擎",
            badge_depends: "依赖于 smacof",
            badge_imports: "导入 smacof",
            
            role_smacof: "多维度量表 (主化算法)",
            role_smacofx: "灵活的多维度量表和 smacof 扩展",
            role_mdsopt: "为度量和区间数据搜索最佳 MDS 步骤",
            role_asymmetry: "非对称邻近度的多维度量表分析",
            role_mdsmap: "使用 MDS 的高密度遗传连锁图谱定位",
            role_pams: "通过多维度量表进行轮廓分析",
            
            packages_header_text: "MDS 程序包",
            last_synced: "上次同步",
            empty_title: "未找到程序包",
            empty_desc: "请尝试更改搜索关键字或点击“同步 CRAN”以获取最新数据。",
            twitter_title: "模拟 Twitter 动态",
            twitter_live: "实时广播",
            twitter_empty: "尚无推文发布。点击任何程序包卡片上的“Tweet”按钮即可分享更新！",
            
            modal_badge: "推文编辑框",
            modal_title: "推特发布该程序包",
            user_display: "R Stats MDS",
            user_handle: "@rstats_mds",
            composer_placeholder: "MDS 领域有什么新鲜事？",
            chars_left: "剩余字符",
            open_x: "在 X (Twitter) 中打开",
            post_mock: "发布模拟推文",
            
            toast_lang_changed: "语言已切换为简体中文！",
            toast_sync_success: "成功从 R CRAN 同步了 {count} 个程序包！",
            toast_sync_failed: "同步失败：{error}",
            toast_tweet_success: "关于 {pkg} 的推文已成功发布！",
            toast_tweet_failed: "推文发布失败：{error}",
            toast_liked: "已点赞推文！",
            toast_retweeted: "已转推！",
            toast_intent: "已在新标签页中打开推特分享窗口！",
            
            badge_r_pkg: "R 程序包",
            btn_tweet: "推特分享",
            local_synced: "本地文件已同步",
            local_pending: "已重定位 / 空闲",
            status_synced: "已同步",
            status_pending: "待同步",
            btn_posting: "发布中..."
        },
        ar: {
            name: "العربية",
            dir: "rtl",
            brand_badge: "مركز كران",
            app_title: "مستكشف حزم MDS",
            subtitle: "اكتشف حزم R للمقياس متعدد الأبعاد (MDS) والامتدادات المرتبطة بها",
            search_placeholder: "البحث عن الحزم، الكلمات المفتاحية...",
            sync_cran: "مزامنة كران",
            readme_badge: "README.md",
            readme_title: "نظام المقاييس متعددة الأبعاد (MDS) في R",
            readme_intro: "هذا التطبيق عبارة عن مستكشف لحزم R على شبكة CRAN المخصصة للمقياس متعدد الأبعاد (MDS). تقع حزمة <strong class=\"highlight-text\">smacof</strong> في قلب النظام، وتنفذ خوارزمية التعظيم للمقاييس المترية وغير المترية. وتقوم الحزم الأخرى بتوسيع وظائفها أو تطبيقها على مجالات محددة (مثل علم الوراثة، والمسافات غير المتماثلة، والتحسين).",
            organigram_title: "مخطط هيكلي لعلاقات تبعية الحزم",
            legend_core: "المحور الأساسي",
            legend_dep: "استيراد / تبعيات",
            panel_ind_title: "MDS مستقل",
            rel_table_title: "علاقات النظام البيئي",
            csv_table_title: "السجل المحلي (mds_packages.csv)",
            th_package: "الحزمة",
            th_integration: "نوع التكامل",
            th_role: "الدور الأساسي",
            th_version: "الإصدار",
            th_published: "تاريخ النشر",
            th_sync: "حالة المزامنة",
            
            badge_core: "المحرك الأساسي",
            badge_depends: "يعتمد على smacof",
            badge_imports: "يستورد smacof",
            
            role_smacof: "المقياس متعدد الأبعاد (خوارزميات التعظيم)",
            role_smacofx: "المقياس متعدد الأبعاد المرن وامتدادات smacof",
            role_mdsopt: "البحث عن إجراء MDS الأمثل للمقاييس المترية وبيانات الفترات",
            role_asymmetry: "المقياس متعدد الأبعاد للتقارب غير المتماثل",
            role_mdsmap: "رسم خرائط الارتباط الجيني عالي الكثافة باستخدام MDS",
            role_pams: "تحليل الملف الشخصي عبر المقياس متعدد الأبعاد",
            
            packages_header_text: "حزم MDS",
            last_synced: "آخر مزامنة",
            empty_title: "لم يتم العثور على حزم",
            empty_desc: "حاول تغيير كلمة البحث أو انقر فوق مزامنة كران لجلب أحدث التفاصيل.",
            twitter_title: "خلاصة تويتر المحاكاة",
            twitter_live: "بث مباشر",
            twitter_empty: "لا توجد تغريدات منشورة بعد. انقر فوق زر \"تغريد\" في أي حزمة للمشاركة!",
            
            modal_badge: "منشئ التغريدات",
            modal_title: "التغريد عن الحزمة",
            user_display: "إحصائيات R MDS",
            user_handle: "@rstats_mds",
            composer_placeholder: "ماذا يحدث في عالم MDS؟",
            chars_left: "أحرف متبقية",
            open_x: "افتح في X (تويتر)",
            post_mock: "نشر التغريدة المحاكاة",
            
            toast_lang_changed: "تم تغيير اللغة إلى العربية!",
            toast_sync_success: "تمت مزامنة {count} من الحزم بنجاح من كران R!",
            toast_sync_failed: "فشلت المزامنة: {error}",
            toast_tweet_success: "تم نشر التغريدة عن حزمة {pkg} بنجاح!",
            toast_tweet_failed: "فشل نشر التغريدة: {error}",
            toast_liked: "تم الإعجاب بالتغريدة!",
            toast_retweeted: "تمت إعادة التغريد!",
            toast_intent: "تم فتح نافذة مشاركة تويتر في علامة تبويب جديدة!",
            
            badge_r_pkg: "حزمة R",
            btn_tweet: "تغريد",
            local_synced: "الملفات المحلية متزامنة",
            local_pending: "معاد تحديد موقعها / خاملة",
            status_synced: "متزامنة",
            status_pending: "معلقة",
            btn_posting: "جاري النشر..."
        }
    };

    // Application State
    let allPackages = [];
    let activePackage = null;
    let currentLang = localStorage.getItem('mds_explorer_lang') || 'en';
    
    // UI Elements
    const elements = {
        searchInput: document.getElementById('search-input'),
        refreshBtn: document.getElementById('refresh-btn'),
        refreshSpinner: document.getElementById('refresh-spinner'),
        packagesGrid: document.getElementById('packages-grid'),
        skeletonLoader: document.getElementById('skeleton-loader'),
        emptyState: document.getElementById('empty-state'),
        pkgCount: document.getElementById('pkg-count'),
        lastSyncBadge: document.getElementById('last-sync-badge'),
        tweetsTimeline: document.getElementById('tweets-timeline'),
        csvTableBody: document.getElementById('csv-table-body'),
        
        // Language selectors
        langBtn: document.getElementById('lang-btn'),
        langDropdown: document.getElementById('lang-dropdown'),
        currentLangName: document.getElementById('current-lang-name'),
        langOpts: document.querySelectorAll('.lang-opt'),
        
        // Modal elements
        tweetModal: document.getElementById('tweet-modal'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        tweetTextarea: document.getElementById('tweet-textarea'),
        modalPkgTitle: document.getElementById('modal-package-title'),
        previewPkgName: document.getElementById('preview-pkg-name'),
        previewPkgDesc: document.getElementById('preview-pkg-desc'),
        charCounter: document.getElementById('char-counter'),
        realTweetBtn: document.getElementById('real-tweet-btn'),
        postMockBtn: document.getElementById('post-mock-btn'),
        mockBtnSpinner: document.getElementById('mock-btn-spinner'),
        toastContainer: document.getElementById('toast-container')
    };

    // Helper: i18n Translation Engine
    function translateUI() {
        const langData = translations[currentLang];
        
        // Set document language and direction
        document.documentElement.lang = currentLang;
        document.documentElement.dir = langData.dir;
        
        // 1. Translate static text elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langData[key]) {
                // If it contains tags (like strong in readme_intro), set innerHTML
                if (key === 'readme_intro') {
                    el.innerHTML = langData[key];
                } else {
                    el.textContent = langData[key];
                }
            }
        });
        
        // 2. Translate static placeholder elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (langData[key]) {
                el.placeholder = langData[key];
            }
        });
        
        // 3. Translate independent SVG panel title directly in SVG DOM
        const svgIndTitle = document.getElementById('panel-ind-title');
        if (svgIndTitle && langData['panel_ind_title']) {
            svgIndTitle.textContent = langData['panel_ind_title'];
        }
        
        // 4. Update the current language button text
        elements.currentLangName.textContent = langData.name;
        
        // Update styling active states on language options
        elements.langOpts.forEach(opt => {
            if (opt.getAttribute('data-lang') === currentLang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
        
        // Re-render packages and tweets to update dynamic texts
        filterAndRenderPackages();
        loadTweets();
    }

    // Helper: Toast Notifications
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✨';
        if (type === 'error') icon = '⚠️';
        
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px) scale(0.95)';
            toast.style.transition = 'all 0.4s ease-out';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // Helper: Format Time
    function getFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    // API: Fetch Packages
    async function loadPackages(forceRefresh = false) {
        elements.skeletonLoader.style.display = 'grid';
        elements.packagesGrid.style.display = 'none';
        elements.emptyState.style.display = 'none';
        elements.refreshSpinner.style.display = 'inline-block';
        elements.refreshBtn.disabled = true;
        
        const endpoint = forceRefresh ? '/api/refresh' : '/api/packages';
        const method = forceRefresh ? 'POST' : 'GET';
        
        try {
            const response = await fetch(endpoint, { method });
            const data = await response.json();
            
            if (data.success && data.packages) {
                allPackages = data.packages;
                filterAndRenderPackages();
                
                const langData = translations[currentLang];
                elements.lastSyncBadge.textContent = `${langData.last_synced}: ${getFormattedTime()}`;
                
                if (forceRefresh) {
                    const successMsg = langData.toast_sync_success.replace('{count}', allPackages.length);
                    showToast(successMsg, 'success');
                }
            } else {
                throw new Error(data.error || 'Failed to fetch packages');
            }
        } catch (error) {
            console.error('Error loading packages:', error);
            const failMsg = translations[currentLang].toast_sync_failed.replace('{error}', error.message);
            showToast(failMsg, 'error');
            elements.skeletonLoader.style.display = 'none';
            elements.emptyState.style.display = 'flex';
        } finally {
            elements.refreshSpinner.style.display = 'none';
            elements.refreshBtn.disabled = false;
        }
    }

    // API: Fetch Tweets Timeline
    async function loadTweets() {
        try {
            const response = await fetch('/api/tweets');
            const data = await response.json();
            if (data.success) {
                renderTweets(data.tweets);
            }
        } catch (error) {
            console.error('Error loading tweets:', error);
        }
    }

    // Render: Packages
    function renderPackages(packagesList) {
        const langData = translations[currentLang];
        elements.skeletonLoader.style.display = 'none';
        elements.packagesGrid.innerHTML = '';
        
        if (packagesList.length === 0) {
            elements.packagesGrid.style.display = 'none';
            elements.emptyState.style.display = 'flex';
            elements.pkgCount.textContent = '0';
            if (elements.csvTableBody) elements.csvTableBody.innerHTML = '';
            return;
        }
        
        elements.emptyState.style.display = 'none';
        elements.packagesGrid.style.display = 'grid';
        elements.pkgCount.textContent = packagesList.length;

        // Render the local CSV registry table dynamically
        if (elements.csvTableBody) {
            elements.csvTableBody.innerHTML = '';
            const sortedList = [...packagesList].sort((a, b) => a.name.localeCompare(b.name));
            sortedList.forEach(pkg => {
                const tr = document.createElement('tr');
                const statusBadgeText = pkg.downloaded ? langData.status_synced : langData.status_pending;
                const syncBadge = pkg.downloaded 
                    ? `<span class="rel-badge imports" style="font-size:0.7rem; padding:0.1rem 0.4rem;">${statusBadgeText}</span>`
                    : `<span class="rel-badge depends" style="background:rgba(234,179,8,0.12); border:1px solid rgba(234,179,8,0.25); color:#eab308; font-size:0.7rem; padding:0.1rem 0.4rem;">${statusBadgeText}</span>`;
                tr.innerHTML = `
                    <td><span class="table-pkg">${pkg.name}</span></td>
                    <td><span class="pkg-version" style="font-size:0.72rem;">v${pkg.version}</span></td>
                    <td><span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);">${pkg.published}</span></td>
                    <td>${syncBadge}</td>
                `;
                elements.csvTableBody.appendChild(tr);
            });
        }
        
        packagesList.forEach(pkg => {
            const card = document.createElement('article');
            card.className = 'card';
            
            // Format document list items if downloaded
            let docsHTML = '';
            if (pkg.downloaded && pkg.documents && pkg.documents.length > 0) {
                const docsList = pkg.documents.map(doc => {
                    const basename = doc.split('/').pop();
                    const ext = basename.split('.').pop();
                    let fileIcon = '📄';
                    if (ext === 'pdf') fileIcon = '📕';
                    if (ext === 'gz') fileIcon = '📦';
                    if (ext === 'html' || ext === 'R' || ext === 'Rmd') fileIcon = '🌐';
                    return `<div class="file-item" title="${doc}">${fileIcon} <span>${basename}</span></div>`;
                }).join('');
                
                docsHTML = `
                    <div class="local-files-section">
                        <div class="files-header">
                            <span class="status-indicator success"></span>
                            <span class="status-text">${langData.local_synced}</span>
                            <button class="btn-toggle-files" title="Show/Hide local documents">
                                <svg class="icon arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <div class="files-list" style="display: none;">
                            ${docsList}
                        </div>
                    </div>
                `;
            } else {
                docsHTML = `
                    <div class="local-files-section">
                        <div class="files-header">
                            <span class="status-indicator warning"></span>
                            <span class="status-text">${langData.local_pending}</span>
                        </div>
                    </div>
                `;
            }
            
            card.innerHTML = `
                <div class="card-header">
                    <div class="title-wrapper">
                        <h3 class="pkg-title">${pkg.name}</h3>
                        <span class="pkg-version">v${pkg.version}</span>
                    </div>
                    <a href="${pkg.url}" target="_blank" rel="noopener noreferrer" class="card-link" title="Open CRAN webpage">
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
                <p class="pkg-desc">${pkg.description}</p>
                ${docsHTML}
                <div class="card-footer">
                    <span class="pkg-tech-badge">${langData.badge_r_pkg}</span>
                    <button class="btn-tweet" data-pkg-id="${pkg.id}">
                        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        ${langData.btn_tweet}
                    </button>
                </div>
            `;
            
            // Attach toggle handlers
            const toggleBtn = card.querySelector('.btn-toggle-files');
            const filesList = card.querySelector('.files-list');
            const arrowIcon = card.querySelector('.arrow-icon');
            if (toggleBtn && filesList) {
                toggleBtn.addEventListener('click', () => {
                    const isHidden = filesList.style.display === 'none';
                    filesList.style.display = isHidden ? 'flex' : 'none';
                    if (arrowIcon) {
                        arrowIcon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
                    }
                });
            }
            
            // Attach tweeting handler
            const tweetBtn = card.querySelector('.btn-tweet');
            tweetBtn.addEventListener('click', () => openTweetModal(pkg));
            
            elements.packagesGrid.appendChild(card);
        });
    }

    // Render: Tweets Timeline
    function renderTweets(tweets) {
        const langData = translations[currentLang];
        elements.tweetsTimeline.innerHTML = '';
        
        if (!tweets || tweets.length === 0) {
            elements.tweetsTimeline.innerHTML = `
                <div class="timeline-empty">
                    <div class="bird-icon">🐦</div>
                    <p>${langData.twitter_empty}</p>
                </div>
            `;
            return;
        }
        
        tweets.forEach(tweet => {
            const tweetCard = document.createElement('div');
            tweetCard.className = 'tweet-card';
            
            const charSum = tweet.text.length + tweet.package_name.length;
            const mockLikes = (charSum % 15) + 3;
            const mockRetweets = (charSum % 7) + 1;
            
            tweetCard.innerHTML = `
                <div class="tweet-avatar">
                    ${tweet.package_name.substring(0, 2).toUpperCase()}
                </div>
                <div class="tweet-main">
                    <div class="tweet-user-info">
                        <span class="tweet-user-name">${langData.user_display} (${tweet.package_name})</span>
                        <span class="tweet-badge">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                        </span>
                        <span class="tweet-handle">${langData.user_handle}</span>
                        <span class="tweet-time">• ${tweet.timestamp}</span>
                    </div>
                    <p class="tweet-text">${tweet.text}</p>
                    <div class="tweet-actions">
                        <button class="tweet-action-btn btn-retweet" title="${langData.toast_retweeted}">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span>${mockRetweets}</span>
                        </button>
                        <button class="tweet-action-btn btn-like" title="${langData.toast_liked}">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>${mockLikes}</span>
                        </button>
                    </div>
                </div>
            `;
            
            const likeBtn = tweetCard.querySelector('.btn-like');
            const retweetBtn = tweetCard.querySelector('.btn-retweet');
            
            let liked = false;
            let retweeted = false;
            
            likeBtn.addEventListener('click', () => {
                liked = !liked;
                likeBtn.style.color = liked ? 'var(--error)' : 'var(--text-dimmed)';
                likeBtn.querySelector('span').textContent = mockLikes + (liked ? 1 : 0);
                if (liked) showToast(langData.toast_liked, 'info');
            });
            
            retweetBtn.addEventListener('click', () => {
                retweeted = !retweeted;
                retweetBtn.style.color = retweeted ? 'var(--success)' : 'var(--text-dimmed)';
                retweetBtn.querySelector('span').textContent = mockRetweets + (retweeted ? 1 : 0);
                if (retweeted) showToast(langData.toast_retweeted, 'success');
            });
            
            elements.tweetsTimeline.appendChild(tweetCard);
        });
    }

    // Filter Logic
    function filterAndRenderPackages() {
        const query = elements.searchInput.value.toLowerCase().trim();
        if (!query) {
            renderPackages(allPackages);
            return;
        }
        
        const filtered = allPackages.filter(pkg => 
            pkg.name.toLowerCase().includes(query) || 
            pkg.description.toLowerCase().includes(query)
        );
        renderPackages(filtered);
    }

    // Modal Composer: Open
    function openTweetModal(pkg) {
        activePackage = pkg;
        const langData = translations[currentLang];
        
        elements.modalPkgTitle.textContent = `${langData.modal_title}: ${pkg.name}`;
        elements.previewPkgName.textContent = pkg.name;
        elements.previewPkgDesc.textContent = pkg.description;
        
        // Default text depending on language
        let defaultTweet = "";
        if (currentLang === 'es') {
            defaultTweet = `📦 Actualización de Paquete R: "${pkg.name}"\n\n${pkg.description.slice(0, 110)}...\n\nDetalles: ${pkg.url}\n#rstats #MDS`;
        } else if (currentLang === 'fr') {
            defaultTweet = `📦 Mise à jour du package R: "${pkg.name}"\n\n${pkg.description.slice(0, 110)}...\n\nDétails: ${pkg.url}\n#rstats #MDS`;
        } else if (currentLang === 'ru') {
            defaultTweet = `📦 Обновление R пакета: "${pkg.name}"\n\n${pkg.description.slice(0, 110)}...\n\nПодробнее: ${pkg.url}\n#rstats #MDS`;
        } else if (currentLang === 'zh') {
            defaultTweet = `📦 R 程序包更新: "${pkg.name}"\n\n${pkg.description.slice(0, 110)}...\n\n详情: ${pkg.url}\n#rstats #MDS`;
        } else if (currentLang === 'ar') {
            defaultTweet = `📦 تحديث حزمة R الجديدة: "${pkg.name}"\n\n${pkg.description.slice(0, 110)}...\n\nتفاصيل: ${pkg.url}\n#rstats #MDS`;
        } else {
            defaultTweet = `📦 R Package Update: "${pkg.name}"\n\n${pkg.description.slice(0, 110)}...\n\nDetails: ${pkg.url}\n#rstats #MDS`;
        }
        
        elements.tweetTextarea.value = defaultTweet;
        elements.tweetTextarea.placeholder = langData.composer_placeholder;
        
        updateCharCount();
        elements.tweetModal.showModal();
    }

    // Modal Composer: Close
    function closeTweetModal() {
        elements.tweetModal.close();
        activePackage = null;
    }

    // Modal Helper: Char Count
    function updateCharCount() {
        const remaining = 280 - elements.tweetTextarea.value.length;
        elements.charCounter.textContent = remaining;
        
        elements.charCounter.className = '';
        if (remaining < 0) {
            elements.charCounter.classList.add('error');
            elements.postMockBtn.disabled = true;
            elements.realTweetBtn.disabled = true;
        } else if (remaining < 30) {
            elements.charCounter.classList.add('warning');
            elements.postMockBtn.disabled = false;
            elements.realTweetBtn.disabled = false;
        } else {
            elements.postMockBtn.disabled = false;
            elements.realTweetBtn.disabled = false;
        }
    }

    // Action: Post Mock Tweet
    async function handlePostMockTweet() {
        const text = elements.tweetTextarea.value;
        const langData = translations[currentLang];
        if (!text || text.length > 280 || !activePackage) return;
        
        elements.postMockBtn.disabled = true;
        elements.mockBtnSpinner.style.display = 'inline-block';
        elements.postMockBtn.querySelector('.btn-text').textContent = langData.btn_posting;
        
        try {
            const response = await fetch('/api/tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    package_name: activePackage.name,
                    text: text
                })
            });
            const data = await response.json();
            
            if (data.success) {
                const successMsg = langData.toast_tweet_success.replace('{pkg}', activePackage.name);
                showToast(successMsg, 'success');
                closeTweetModal();
                loadTweets();
            } else {
                throw new Error(data.error || 'Failed to post');
            }
        } catch (error) {
            console.error('Error posting mock tweet:', error);
            const failMsg = langData.toast_tweet_failed.replace('{error}', error.message);
            showToast(failMsg, 'error');
        } finally {
            elements.postMockBtn.disabled = false;
            elements.mockBtnSpinner.style.display = 'none';
            elements.postMockBtn.querySelector('.btn-text').textContent = langData.post_mock;
        }
    }

    // Action: Web Intent Tweet
    function handleOpenRealTweet() {
        const text = elements.tweetTextarea.value;
        const langData = translations[currentLang];
        if (!text || text.length > 280) return;
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
        showToast(langData.toast_intent, 'info');
    }

    // Language Dropdown togglers
    elements.langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = elements.langDropdown.style.display === 'flex';
        elements.langDropdown.style.display = isOpen ? 'none' : 'flex';
    });
    
    document.addEventListener('click', () => {
        elements.langDropdown.style.display = 'none';
    });
    
    // Choose Language Opts
    elements.langOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const newLang = opt.getAttribute('data-lang');
            if (newLang !== currentLang) {
                currentLang = newLang;
                localStorage.setItem('mds_explorer_lang', currentLang);
                translateUI();
                showToast(translations[currentLang].toast_lang_changed, 'success');
            }
        });
    });

    // Event Listeners
    elements.refreshBtn.addEventListener('click', () => loadPackages(true));
    elements.searchInput.addEventListener('input', filterAndRenderPackages);
    
    elements.closeModalBtn.addEventListener('click', closeTweetModal);
    elements.tweetTextarea.addEventListener('input', updateCharCount);
    elements.postMockBtn.addEventListener('click', handlePostMockTweet);
    elements.realTweetBtn.addEventListener('click', handleOpenRealTweet);
    
    elements.tweetModal.addEventListener('click', (e) => {
        if (e.target === elements.tweetModal) {
            closeTweetModal();
        }
    });

    // Initialize Multilingual engine & startup loads
    translateUI();
    loadPackages(false);
});
