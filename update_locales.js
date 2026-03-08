const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const tierFeatures = {
    en: {
        tier2_feature1: "Unlimited Google Maps Export",
        tier2_feature2: "Unlock Advanced AI Logic Fine-tuning",
        tier2_feature3: "Priority Generation (Fast Track)",
        tier2_feature4: "Unlock AI Travel Map (Beta)",
        tier2_feature5: "More Trip Generations",
        tier3_feature1: "Unlimited Google Maps Export",
        tier3_feature2: "Unlock Advanced AI Logic Fine-tuning",
        tier3_feature3: "Priority Generation (Fast Track)",
        tier3_feature4: "Unlock AI Travel Map (Beta)",
        tier3_feature5: "More Trip Generations",
        tier3_feature6: "Priority Customer Service & New Features",
        tier3_feature7: "Highest Priority Generation (VIP Speed)",
    },
    zh: {
        tier2_feature1: "無限制匯出至 Google Maps",
        tier2_feature2: "解鎖進階 AI 邏輯微調",
        tier2_feature3: "優先生成權限（極速專線）",
        tier2_feature4: "解鎖 AI 旅遊地圖（Beta）",
        tier2_feature5: "擁有更多生成次數",
        tier3_feature1: "無限制匯出至 Google Maps",
        tier3_feature2: "解鎖進階 AI 邏輯微調",
        tier3_feature3: "優先生成權限（極速專線）",
        tier3_feature4: "解鎖 AI 旅遊地圖（Beta）",
        tier3_feature5: "擁有更多生成次數",
        tier3_feature6: "優先客戶服務與新功能",
        tier3_feature7: "最高優先級生成（VIP 秒速）",
    },
    ja: {
        tier2_feature1: "Google マップへの無制限エクスポート",
        tier2_feature2: "高度な AI ロジック微調整のロック解除",
        tier2_feature3: "優先生成権限（高速専用）",
        tier2_feature4: "AI 旅行マップのロック解除（Beta）",
        tier2_feature5: "より多くの旅程生成",
        tier3_feature1: "Google マップへの無制限エクスポート",
        tier3_feature2: "高度な AI ロジック微調整のロック解除",
        tier3_feature3: "優先生成権限（高速専用）",
        tier3_feature4: "AI 旅行マップのロック解除（Beta）",
        tier3_feature5: "より多くの旅程生成",
        tier3_feature6: "優先カスタマーサービスと新機能",
        tier3_feature7: "最高優先生成（VIP 速度）",
    },
    ko: {
        tier2_feature1: "Google 지도 무제한 내보내기",
        tier2_feature2: "고급 AI 로직 미세 조정 잠금 해제",
        tier2_feature3: "우선 생성 권한 (초고속 전용)",
        tier2_feature4: "AI 여행 지도 잠금 해제 (Beta)",
        tier2_feature5: "더 많은 여행 일정 생성",
        tier3_feature1: "Google 지도 무제한 내보내기",
        tier3_feature2: "고급 AI 로직 미세 조정 잠금 해제",
        tier3_feature3: "우선 생성 권한 (초고속 전용)",
        tier3_feature4: "AI 여행 지도 잠금 해제 (Beta)",
        tier3_feature5: "더 많은 여행 일정 생성",
        tier3_feature6: "우선 고객 서비스 및 신기능",
        tier3_feature7: "최고 우선 생성 (VIP 속도)",
    },
    fr: {
        tier2_feature1: "Export illimité vers Google Maps",
        tier2_feature2: "Débloquer la micro-réglage avancé de l'IA",
        tier2_feature3: "Génération prioritaire (Voie rapide)",
        tier2_feature4: "Débloquer la Carte AI (Beta)",
        tier2_feature5: "Plus de générations de voyages",
        tier3_feature1: "Export illimité vers Google Maps",
        tier3_feature2: "Débloquer la micro-réglage avancé de l'IA",
        tier3_feature3: "Génération prioritaire (Voie rapide)",
        tier3_feature4: "Débloquer la Carte AI (Beta)",
        tier3_feature5: "Plus de générations de voyages",
        tier3_feature6: "Service client prioritaire et nouvelles fonctionnalités",
        tier3_feature7: "Génération prioritaire maximale (Vitesse VIP)",
    },
    es: {
        tier2_feature1: "Exportación ilimitada a Google Maps",
        tier2_feature2: "Desbloquear ajuste fino de IA avanzado",
        tier2_feature3: "Generación prioritaria (Vía rápida)",
        tier2_feature4: "Desbloquear Mapa AI de Viajes (Beta)",
        tier2_feature5: "Más generaciones de itinerarios",
        tier3_feature1: "Exportación ilimitada a Google Maps",
        tier3_feature2: "Desbloquear ajuste fino de IA avanzado",
        tier3_feature3: "Generación prioritaria (Vía rápida)",
        tier3_feature4: "Desbloquear Mapa AI de Viajes (Beta)",
        tier3_feature5: "Más generaciones de itinerarios",
        tier3_feature6: "Servicio al cliente prioritario y nuevas funciones",
        tier3_feature7: "Generación de la más alta prioridad (Velocidad VIP)",
    },
    id: {
        tier2_feature1: "Ekspor tak terbatas ke Google Maps",
        tier2_feature2: "Buka kunci Penyesuaian AI Lanjutan",
        tier2_feature3: "Hak Generasi Prioritas (Jalur Cepat)",
        tier2_feature4: "Buka kunci Peta Perjalanan AI (Beta)",
        tier2_feature5: "Lebih banyak generasi perjalanan",
        tier3_feature1: "Ekspor tak terbatas ke Google Maps",
        tier3_feature2: "Buka kunci Penyesuaian AI Lanjutan",
        tier3_feature3: "Hak Generasi Prioritas (Jalur Cepat)",
        tier3_feature4: "Buka kunci Peta Perjalanan AI (Beta)",
        tier3_feature5: "Lebih banyak generasi perjalanan",
        tier3_feature6: "Layanan pelanggan prioritas & fitur baru",
        tier3_feature7: "Generasi Prioritas Tertinggi (Kecepatan VIP)",
    },
    hi: {
        tier2_feature1: "Google Maps में असीमित निर्यात",
        tier2_feature2: "उन्नत AI तर्क ट्यूनिंग अनलॉक करें",
        tier2_feature3: "प्राथमिकता जनरेशन (फास्ट ट्रैक)",
        tier2_feature4: "AI ट्रैवल मैप अनलॉक करें (Beta)",
        tier2_feature5: "अधिक यात्रा पीढ़ियाँ",
        tier3_feature1: "Google Maps में असीमित निर्यात",
        tier3_feature2: "उन्नत AI तर्क ट्यूनिंग अनलॉक करें",
        tier3_feature3: "प्राथमिकता जनरेशन (फास्ट ट्रैक)",
        tier3_feature4: "AI ट्रैवल मैप अनलॉक करें (Beta)",
        tier3_feature5: "अधिक यात्रा पीढ़ियाँ",
        tier3_feature6: "प्राथमिकता ग्राहक सेवा और नई सुविधाएँ",
        tier3_feature7: "उच्चतम प्राथमिकता जनरेशन (VIP गति)",
    },
    pt: {
        tier2_feature1: "Exportação ilimitada para o Google Maps",
        tier2_feature2: "Desbloquear ajuste de IA avançado",
        tier2_feature3: "Geração prioritária (Pista rápida)",
        tier2_feature4: "Desbloquear Mapa de Viagem AI (Beta)",
        tier2_feature5: "Mais gerações de itinerários",
        tier3_feature1: "Exportação ilimitada para o Google Maps",
        tier3_feature2: "Desbloquear ajuste de IA avançado",
        tier3_feature3: "Geração prioritária (Pista rápida)",
        tier3_feature4: "Desbloquear Mapa de Viagem AI (Beta)",
        tier3_feature5: "Mais gerações de itinerários",
        tier3_feature6: "Atendimento ao cliente prioritário e novos recursos",
        tier3_feature7: "Geração de mais alta prioridade (Velocidade VIP)",
    },
    ar: {
        tier2_feature1: "تصدير غير محدود إلى خرائط Google",
        tier2_feature2: "إلغاء قفل الضبط الدقيق لمنطق الذكاء الاصطناعي",
        tier2_feature3: "حق الإنشاء ذو الأولوية (المسار السريع)",
        tier2_feature4: "إلغاء قفل خريطة السفر بالذكاء الاصطناعي (Beta)",
        tier2_feature5: "مزيد من رحلات الإنشاء",
        tier3_feature1: "تصدير غير محدود إلى خرائط Google",
        tier3_feature2: "إلغاء قفل الضبط الدقيق لمنطق الذكاء الاصطناعي",
        tier3_feature3: "حق الإنشاء ذو الأولوية (المسار السريع)",
        tier3_feature4: "إلغاء قفل خريطة السفر بالذكاء الاصطناعي (Beta)",
        tier3_feature5: "مزيد من رحلات الإنشاء",
        tier3_feature6: "خدمة عملاء ذات أولوية وميزات جديدة",
        tier3_feature7: "أعلى أولوية في الإنشاء (سرعة VIP)",
    },
    ru: {
        tier2_feature1: "Неограниченный экспорт в Google Карты",
        tier2_feature2: "Разблокировать детальную настройку ИИ",
        tier2_feature3: "Приоритетная генерация (Быстрый доступ)",
        tier2_feature4: "Разблокировать карту путешествий ИИ (Beta)",
        tier2_feature5: "Больше генераций маршрутов",
        tier3_feature1: "Неограниченный экспорт в Google Карты",
        tier3_feature2: "Разблокировать детальную настройку ИИ",
        tier3_feature3: "Приоритетная генерация (Быстрый доступ)",
        tier3_feature4: "Разблокировать карту путешествий ИИ (Beta)",
        tier3_feature5: "Больше генераций маршрутов",
        tier3_feature6: "Приоритетная поддержка и новые функции",
        tier3_feature7: "Генерация наивысшего приоритета (VIP скорость)",
    },
    bn: {
        tier2_feature1: "গুগল ম্যাপে সীমাহীন এক্সপোর্ট",
        tier2_feature2: "উন্নত এআই লজিক ফাইন-টিউনিং আনলক করুন",
        tier2_feature3: "অগ্রাধিকার প্রজন্ম (ফাস্ট ট্র্যাক)",
        tier2_feature4: "এআই ট্রাভেল ম্যাপ আনলক করুন (Beta)",
        tier2_feature5: "আরও বেশি ভ্রমণ জেনারেশন",
        tier3_feature1: "গুগল ম্যাপে সীমাহীন এক্সপোর্ট",
        tier3_feature2: "উন্নত এআই লজিক ফাইন-টিউনিং আনলক করুন",
        tier3_feature3: "অগ্রাধিকার প্রজন্ম (ফাস্ট ট্র্যাক)",
        tier3_feature4: "এআই ট্রাভেল ম্যাপ আনলক করুন (Beta)",
        tier3_feature5: "আরও বেশি ভ্রমণ জেনারেশন",
        tier3_feature6: "অগ্রাধিকার গ্রাহক সেবা ও নতুন বৈশিষ্ট্য",
        tier3_feature7: "সর্বোচ্চ অগ্রাধিকার জেনারেশন (VIP গতি)",
    },
};

const mapTranslations = {
    en: { map_search_placeholder: "Where would you like to find inspiration?", map_region_all: "Global", map_region_asia: "Asia", map_region_europe: "Europe", map_region_americas: "Americas", map_region_middle_east: "Middle East", map_region_oceania: "Oceania", map_region_africa: "Africa", map_must_try_food: "🍜 Must Try Food", map_top_spot: "🏛️ Top Spot", map_actions: "Actions", map_actions_modify: "Modify & Build Itinerary", map_actions_generate: "1-Click Generate", map_actions_cost: "(Only 5 points)", map_initializing: "Initializing Global Map..." },
    zh: { map_search_placeholder: "你想去哪裡獲取靈感？", map_region_all: "全球", map_region_asia: "亞洲", map_region_europe: "歐洲", map_region_americas: "美洲", map_region_middle_east: "中東", map_region_oceania: "大洋洲", map_region_africa: "非洲", map_must_try_food: "🍜 必吃美食", map_top_spot: "🏛️ 熱門景點", map_actions: "操作", map_actions_modify: "修改並生成行程", map_actions_generate: "一鍵生成行程", map_actions_cost: "(僅需 5 點)", map_initializing: "正在初始化全球地圖..." },
    'zh-HK': { map_search_placeholder: "你想去邊度搵靈感？", map_region_all: "全球", map_region_asia: "亞洲", map_region_europe: "歐洲", map_region_americas: "美洲", map_region_middle_east: "中東", map_region_oceania: "大洋洲", map_region_africa: "非洲", map_must_try_food: "🍜 必食推薦", map_top_spot: "🏛️ 熱門景點", map_actions: "操作", map_actions_modify: "修改並生成行程", map_actions_generate: "一鍵生成行程", map_actions_cost: "(只需 5 點)", map_initializing: "正在初始化全球地圖..." },
    'zh-CN': { map_search_placeholder: "你想去哪里获取灵感？", map_region_all: "全球", map_region_asia: "亚洲", map_region_europe: "欧洲", map_region_americas: "美洲", map_region_middle_east: "中东", map_region_oceania: "大洋洲", map_region_africa: "非洲", map_must_try_food: "🍜 必吃美食", map_top_spot: "🏛️ 热门景点", map_actions: "操作", map_actions_modify: "修改并生成行程", map_actions_generate: "一键生成行程", map_actions_cost: "(仅需 5 点)", map_initializing: "正在初始化全球地图..." },
    ja: { map_search_placeholder: "どこでインスピレーションを得たいですか？", map_region_all: "すべて", map_region_asia: "アジア", map_region_europe: "ヨーロッパ", map_region_americas: "北米・南米", map_region_middle_east: "中東", map_region_oceania: "オセアニア", map_region_africa: "アフリカ", map_must_try_food: "🍜 必食グルメ", map_top_spot: "🏛️ 人気スポット", map_actions: "アクション", map_actions_modify: "変更して旅程を作成", map_actions_generate: "ワンクリック自動生成", map_actions_cost: "(わずか 5 ポイント)", map_initializing: "グローバルマップを初期化中..." },
    ko: { map_search_placeholder: "어디에서 영감을 얻고 싶으신가요?", map_region_all: "전체", map_region_asia: "아시아", map_region_europe: "유럽", map_region_americas: "아메리카", map_region_middle_east: "중동", map_region_oceania: "오세아니아", map_region_africa: "아프리카", map_must_try_food: "🍜 꼭 먹어봐야 할 음식", map_top_spot: "🏛️ 최고 명소", map_actions: "작업", map_actions_modify: "일정 수정 및 생성", map_actions_generate: "원클릭 일정 생성", map_actions_cost: "(단 5 포인트)", map_initializing: "글로벌 지도 초기화 중..." },
    fr: { map_search_placeholder: "Où aimeriez-vous trouver l'inspiration ?", map_region_all: "Global", map_region_asia: "Asie", map_region_europe: "Europe", map_region_americas: "Amériques", map_region_middle_east: "Moyen-Orient", map_region_oceania: "Océanie", map_region_africa: "Afrique", map_must_try_food: "🍜 Dégustation Incontournable", map_top_spot: "🏛️ Lieu Incontournable", map_actions: "Actions", map_actions_modify: "Modifier et créer", map_actions_generate: "Générer en 1 clic", map_actions_cost: "(Seulement 5 points)", map_initializing: "Initialisation de la carte mondiale..." },
    es: { map_search_placeholder: "¿Dónde te gustaría encontrar inspiración?", map_region_all: "Global", map_region_asia: "Asia", map_region_europe: "Europa", map_region_americas: "Américas", map_region_middle_east: "Oriente Medio", map_region_oceania: "Oceanía", map_region_africa: "África", map_must_try_food: "🍜 Comida que Debes Probar", map_top_spot: "🏛️ Lugar Principal", map_actions: "Acciones", map_actions_modify: "Modificar y crear", map_actions_generate: "Generar con 1 clic", map_actions_cost: "(Solo 5 puntos)", map_initializing: "Inicializando mapa global..." },
    id: { map_search_placeholder: "Di mana Anda ingin mencari inspirasi?", map_region_all: "Semua", map_region_asia: "Asia", map_region_europe: "Eropa", map_region_americas: "Amerika", map_region_middle_east: "Timur Tengah", map_region_oceania: "Oseania", map_region_africa: "Afrika", map_must_try_food: "🍜 Makanan yang Harus Dicoba", map_top_spot: "🏛️ Tempat Terpopuler", map_actions: "Tindakan", map_actions_modify: "Modifikasi & Buat Tur", map_actions_generate: "Buat dengan 1 klik", map_actions_cost: "(Hanya 5 poin)", map_initializing: "Menginisialisasi peta global..." },
    hi: { map_search_placeholder: "आप प्रेरणा कहाँ प्राप्त करना चाहेंगे?", map_region_all: "ग्लोबल", map_region_asia: "एशिया", map_region_europe: "यूरोप", map_region_americas: "अमेरिका", map_region_middle_east: "मध्य पूर्व", map_region_oceania: "ओशिनिया", map_region_africa: "अफ्रीका", map_must_try_food: "🍜 अवश्य आज़माएं भोजन", map_top_spot: "🏛️ शीर्ष स्थान", map_actions: "क्रियाएँ", map_actions_modify: "संशोधित करें और बनाएं", map_actions_generate: "1-क्लिक के साथ उत्पन्न करें", map_actions_cost: "(केवल 5 अंक)", map_initializing: "ग्लोबल मैप प्रारंभ हो रहा है..." },
    pt: { map_search_placeholder: "Onde você gostaria de encontrar inspiração?", map_region_all: "Global", map_region_asia: "Ásia", map_region_europe: "Europa", map_region_americas: "Américas", map_region_middle_east: "Oriente Médio", map_region_oceania: "Oceania", map_region_africa: "África", map_must_try_food: "🍜 Comida Imperdível", map_top_spot: "🏛️ Ponto Principal", map_actions: "Ações", map_actions_modify: "Modificar e Criar Itinerário", map_actions_generate: "Gerar em 1 clique", map_actions_cost: "(Apenas 5 pontos)", map_initializing: "Inicializando Mapa Global..." },
    ar: { map_search_placeholder: "أين ترغب في العثور على الإلهام؟", map_region_all: "عالمي", map_region_asia: "آسيا", map_region_europe: "أوروبا", map_region_americas: "الأمريكتان", map_region_middle_east: "الشرق الأوسط", map_region_oceania: "أوقيانوسيا", map_region_africa: "أفريقيا", map_must_try_food: "🍜 طعام يجب تجربته", map_top_spot: "🏛️ أفضل مكان", map_actions: "إجراءات", map_actions_modify: "تعديل وإنشاء خط سير", map_actions_generate: "إنشاء بنقرة واحدة", map_actions_cost: "(5 نقاط فقط)", map_initializing: "جارٍ تهيئة الخريطة العالمية..." },
    ru: { map_search_placeholder: "Где бы вы хотели найти вдохновение?", map_region_all: "Глобал", map_region_asia: "Азия", map_region_europe: "Европа", map_region_americas: "Америка", map_region_middle_east: "Ближний Восток", map_region_oceania: "Океания", map_region_africa: "Африка", map_must_try_food: "🍜 Обязательно Попробуйте", map_top_spot: "🏛️ Главное Место", map_actions: "Действия", map_actions_modify: "Изменить и создать маршрут", map_actions_generate: "Создать в 1 клик", map_actions_cost: "(Всего 5 баллов)", map_initializing: "Инициализация глобальной карты..." },
    bn: { map_search_placeholder: "আপনি কোথায় অনুপ্রেরণা খুঁজতে চান?", map_region_all: "বিশ্বব্যাপী", map_region_asia: "এশিয়া", map_region_europe: "ইউরোপ", map_region_americas: "আমেরিকা", map_region_middle_east: "মধ্যপ্রাচ্য", map_region_oceania: "ওশেনিয়া", map_region_africa: "আফ্রিকা", map_must_try_food: "🍜 অবশ্যই খেতে হবে", map_top_spot: "🏛️ শীর্ষ স্থান", map_actions: "ক্রিয়া", map_actions_modify: "পরিবর্তন এবং ভ্রমণপথ তৈরি করুন", map_actions_generate: "এক ক্লিকে তৈরি করুন", map_actions_cost: "(মাত্র ৫ পয়েন্ট)", map_initializing: "গ্লোবাল ম্যাপ শুরু হচ্ছে..." }
};

fs.readdirSync(localesDir).forEach(file => {
    if (file.endsWith('.json')) {
        const lang = file.split('.')[0];
        const filepath = path.join(localesDir, file);
        try {
            const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            const mapTrans = mapTranslations[lang] || mapTranslations['en'];
            const tierTrans = tierFeatures[lang] || tierFeatures['en'];

            // Merge both sets
            Object.assign(data, mapTrans, tierTrans);

            fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Updated ${file}`);
        } catch (err) {
            console.error(`Error with ${file}:`, err);
        }
    }
});

