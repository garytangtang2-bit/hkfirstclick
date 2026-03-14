export type SupportedLang = 'TW' | 'EN' | 'JP' | 'KR' | 'FR' | 'ES' | 'ID' | 'HI' | 'PT' | 'AR' | 'RU';

export const cityDataTranslations: Record<string, { 
    name: Partial<Record<SupportedLang, string>>, 
    description: Partial<Record<SupportedLang, string>>,
    top_food: Partial<Record<SupportedLang, string>>,
    must_visit_spot: Partial<Record<SupportedLang, string>>,
    recommendedDays?: number
}> = {
  "香港": {
    name: {
      // [FIX] EN: "Hongkong" → "Hong Kong"; ID: "Hongkong" → "Hong Kong"
      TW: "香港", EN: "Hong Kong", JP: "ホンコン", KR: "홍콩", FR: "Hong Kong", ES: "Hong Kong", ID: "Hong Kong", HI: "हांगकांग", PT: "Hong Kong", AR: "هونغ كونغ", RU: "Гонконг",
    },
    description: {
      TW: "中西合璧，璀璨夜景與金融中心", EN: "Combining Chinese and Western elements, dazzling night view and financial center", JP: "中国と西洋の要素が融合した、まばゆい夜景と金融センター", KR: "중국과 서양의 요소가 결합된 눈부신 야경과 금융센터", FR: "Combinant des éléments chinois et occidentaux, une vue nocturne éblouissante et un centre financier", ES: "Combinando elementos chinos y occidentales, deslumbrante vista nocturna y centro financiero", ID: "Menggabungkan unsur Tiongkok dan Barat, pemandangan malam yang mempesona, dan pusat keuangan", HI: "चीनी और पश्चिमी तत्वों का मिश्रण, चमकदार रात का दृश्य और वित्तीय केंद्र", PT: "Combinando elementos chineses e ocidentais, vista noturna deslumbrante e centro financeiro", AR: "يجمع بين العناصر الصينية والغربية وإطلالة ليلية مبهرة ومركز مالي", RU: "Сочетание китайских и западных элементов, великолепный ночной вид и финансовый центр.",
    },
    top_food: {
      // [FIX] EN: "Desserts" → "Dim sum"（點心≠甜點）
      TW: "點心、燒鵝、奶茶", EN: "Dim sum, roast goose, milk tea", JP: "点心、ローストグース、ミルクティー", KR: "딤섬, 구운 거위, 밀크티", FR: "Dim sum, oie rôtie, thé au lait", ES: "Dim sum, ganso asado, té con leche.", ID: "Dim sum, angsa panggang, teh susu", HI: "डिम सम, भुना हुआ हंस, दूध वाली चाय", PT: "Dim sum, ganso assado, chá com leite", AR: "ديم سم، أوزة مشوية، شاي الحليب", RU: "Дим сам, жареный гусь, чай с молоком",
    },
    must_visit_spot: {
      TW: "太平山、維多利亞港", EN: "Victoria Peak, Victoria Harbor", JP: "ビクトリア ピーク、ビクトリア ハーバー", KR: "빅토리아 피크, 빅토리아 항구", FR: "Pic Victoria, port de Victoria", ES: "Pico Victoria, Puerto Victoria", ID: "Puncak Victoria, Pelabuhan Victoria", HI: "विक्टोरिया पीक, विक्टोरिया हार्बर", PT: "Pico Victoria, Porto Victoria", AR: "فيكتوريا بيك، ميناء فيكتوريا", RU: "Пик Виктория, гавань Виктория",
    },
    recommendedDays: 3
  },
  "曼谷": {
    name: {
      TW: "曼谷", EN: "Bangkok", JP: "バンコク", KR: "방콕", FR: "Bangkok", ES: "Bangkok", ID: "Bangkok", HI: "बैंकाक", PT: "Bangkok", AR: "بانكوك", RU: "Бангкок",
    },
    description: {
      TW: "街頭活力，高CP值按摩與佛教文化", EN: "Street vitality, high CP value massage and Buddhist culture", JP: "街の活気、CP価値の高いマッサージと仏教文化", KR: "거리의 활력, 높은 CP 가치의 마사지와 불교문화", FR: "Vitalité de rue, massage à haute valeur CP et culture bouddhiste", ES: "Vitalidad callejera, masajes de alto valor CP y cultura budista.", ID: "Vitalitas jalanan, pijat bernilai CP tinggi, dan budaya Buddha", HI: "स्ट्रीट जीवन शक्ति, उच्च सीपी मूल्य मालिश और बौद्ध संस्कृति", PT: "Vitalidade das ruas, massagem de alto valor CP e cultura budista", AR: "حيوية الشارع والتدليك عالي القيمة والثقافة البوذية", RU: "Уличная энергия, высокоэффективный массаж CP и буддийская культура",
    },
    top_food: {
      TW: "冬蔭功、泰式炒粉", EN: "Tom Yum Kung, Pad Thai", JP: "トムヤムクン、パッタイ", KR: "톰양쿵, 팟타이", FR: "Tom Yum Kung, Pad Thaï", ES: "Tom Yum Kung, Pad Thai", ID: "Tom Yum Kung, Pad Thai", HI: "टॉम यम कुंग, पैड थाई", PT: "Tom Yum Kung, Pad Thai", AR: "توم يم كونغ، باد تاي", RU: "Том Ям Кунг, Пад Тай",
    },
    must_visit_spot: {
      TW: "大皇宮、鄭王廟", EN: "Grand Palace, Temple of Dawn (Wat Arun)", JP: "王宮、暁の寺（ワット・アルン）", KR: "왕궁, 새벽 사원(왓 아룬)", FR: "Grand Palais, Temple de l'Aube (Wat Arun)", ES: "Gran Palacio, Templo del Amanecer (Wat Arun)", ID: "Istana Agung, Kuil Fajar (Wat Arun)", HI: "ग्रांड पैलेस, भोर का मंदिर (वट अरुण)", PT: "Grande Palácio, Templo da Aurora (Wat Arun)", AR: "القصر الكبير، معبد الفجر (وات أرون)", RU: "Большой дворец, Храм Рассвета (Ват Арун)",
    },
    recommendedDays: 3
  },
  "東京": {
    name: {
      TW: "東京", EN: "Tokyo", JP: "東京", KR: "도쿄", FR: "Tokyo", ES: "Tokio", ID: "Tokyo", HI: "टोक्यो", PT: "Tóquio", AR: "طوكيو", RU: "Токио",
    },
    description: {
      TW: "極致秩序，動漫天堂與潮流聖地", EN: "Ultimate order, animation paradise and trendy holy land", JP: "究極の秩序、アニメ天国、そして流行の聖地", KR: "궁극의 질서, 애니메이션 천국, 트렌디한 성지", FR: "Ordre ultime, paradis de l'animation et terre sainte branchée", ES: "Orden definitivo, paraíso de la animación y tierra santa de moda", ID: "Keteraturan tertinggi, surga animasi, dan tanah suci yang trendi", HI: "अंतिम आदेश, एनीमेशन स्वर्ग और आधुनिक पवित्र भूमि", PT: "Ordem definitiva, paraíso da animação e terra santa da moda", AR: "النظام النهائي وجنة الرسوم المتحركة والأرض المقدسة العصرية", RU: "Абсолютный порядок, анимационный рай и модная святая земля",
    },
    top_food: {
      TW: "壽司、拉麵、和牛", EN: "Sushi, ramen, wagyu", JP: "寿司、ラーメン、和牛", KR: "스시, 라면, 와규", FR: "Sushis, ramen, wagyu", ES: "Sushi, ramen, wagyu", ID: "Sushi, ramen, wagyu", HI: "सुशी, रेमन, वाग्यू", PT: "Sushi, ramen, wagyu", AR: "السوشي، رامين، واغيو", RU: "Суши, рамен, вагю",
    },
    must_visit_spot: {
      TW: "澀谷、淺草寺", EN: "Shibuya, Sensoji Temple", JP: "渋谷、浅草寺", KR: "시부야, 센소지", FR: "Shibuya, temple Sensoji", ES: "Shibuya, Templo Sensoji", ID: "Shibuya, Kuil Sensoji", HI: "शिबुया, सेंसोजी मंदिर", PT: "Shibuya, Templo Sensoji", AR: "شيبويا، معبد سينسوجي", RU: "Сибуя, храм Сэнсодзи",
    },
    recommendedDays: 5
  },
  "巴黎": {
    name: {
      TW: "巴黎", EN: "Paris", JP: "パリ", KR: "파리", FR: "Paris", ES: "París", ID: "Paris", HI: "पेरिस", PT: "Paris", AR: "باريس", RU: "Париж",
    },
    description: {
      TW: "浪漫之都，藝術畫廊與咖啡文化", EN: "Romantic city, art galleries and coffee culture", JP: "ロマンチックな街、アートギャラリー、コーヒー文化", KR: "낭만의 도시, 미술관과 커피 문화", FR: "Ville romantique, galeries d'art et culture du café", ES: "Ciudad romántica, galerías de arte y cultura cafetera.", ID: "Kota romantis, galeri seni, dan budaya kopi", HI: "रोमांटिक शहर, कला दीर्घाएँ और कॉफ़ी संस्कृति", PT: "Cidade romântica, galerias de arte e cultura cafeeira", AR: "مدينة رومانسية ومعارض فنية وثقافة القهوة", RU: "Романтический город, художественные галереи и кофейная культура",
    },
    top_food: {
      TW: "馬卡龍、油封鴨", EN: "Macarons, duck confit", JP: "マカロン、鴨のコンフィ", KR: "마카롱, 오리콩피", FR: "Macarons, canard confit", ES: "Macarons, pato confitado", ID: "Macaron, bebek confit", HI: "मैकरॉन, डक कॉन्फिट", PT: "Macarons, confit de pato", AR: "ماكارونس، كونفيت البط", RU: "Макаронс, утиное конфи",
    },
    must_visit_spot: {
      TW: "艾菲爾鐵塔、羅浮宮", EN: "Eiffel Tower, Louvre Museum", JP: "エッフェル塔、ルーブル美術館", KR: "에펠탑, 루브르 박물관", FR: "Tour Eiffel, Musée du Louvre", ES: "Torre Eiffel, Museo del Louvre", ID: "Menara Eiffel, Museum Louvre", HI: "एफिल टॉवर, लौवर संग्रहालय", PT: "Torre Eiffel, Museu do Louvre", AR: "برج إيفل، متحف اللوفر", RU: "Эйфелева башня, Лувр",
    },
    recommendedDays: 7
  },
  "倫敦": {
    name: {
      // [FIX] EN: "london" → "London"
      TW: "倫敦", EN: "London", JP: "ロンドン", KR: "런던", FR: "Londres", ES: "Londres", ID: "London", HI: "लंदन", PT: "Londres", AR: "لندن", RU: "Лондон",
    },
    description: {
      TW: "皇室優雅，歷史博物館與大笨鐘", EN: "Royal elegance, history museum and Big Ben", JP: "王室の優雅さ、歴史博物館、ビッグ ベン", KR: "왕실의 우아함, 역사 박물관, 빅벤", FR: "Élégance royale, musée d'histoire et Big Ben", ES: "Elegancia real, museo de historia y Big Ben", ID: "Keanggunan kerajaan, museum sejarah, dan Big Ben", HI: "शाही भव्यता, इतिहास संग्रहालय और बिग बेन", PT: "Elegância real, museu de história e Big Ben", AR: "الأناقة الملكية ومتحف التاريخ وبيغ بن", RU: "Королевская элегантность, исторический музей и Биг-Бен",
    },
    top_food: {
      TW: "炸魚薯條、下午茶", EN: "Fish and chips, afternoon tea", JP: "フィッシュアンドチップス、アフタヌーンティー", KR: "피쉬 앤 칩스, 애프터눈 티", FR: "Fish and chips, thé de l'après-midi", ES: "Fish and chips, té de la tarde", ID: "Ikan dan keripik, teh sore", HI: "मछली और चिप्स, दोपहर की चाय", PT: "Peixe e batatas fritas, chá da tarde", AR: "السمك والبطاطا والشاي بعد الظهر", RU: "Рыба с жареным картофелем, послеобеденный чай",
    },
    must_visit_spot: {
      TW: "大英博物館、倫敦塔橋", EN: "British Museum, Tower Bridge", JP: "大英博物館、タワーブリッジ", KR: "대영박물관, 타워브리지", FR: "British Museum, Tower Bridge", ES: "Museo Británico, Puente de la Torre", ID: "Museum Inggris, Tower Bridge", HI: "ब्रिटिश संग्रहालय, टावर ब्रिज", PT: "Museu Britânico, Tower Bridge", AR: "المتحف البريطاني، جسر البرج", RU: "Британский музей, Тауэрский мост",
    },
    recommendedDays: 3
  },
  "新加坡": {
    name: {
      TW: "新加坡", EN: "Singapore", JP: "シンガポール", KR: "싱가포르", FR: "Singapour", ES: "Singapur", ID: "Singapura", HI: "सिंगापुर", PT: "Cingapura", AR: "سنغافورة", RU: "Сингапур",
    },
    description: {
      TW: "花園城市，科技與自然完美結合", EN: "Garden City, a perfect combination of technology and nature", JP: "テクノロジーと自然が完璧に融合した田園都市", KR: "기술과 자연이 완벽하게 결합된 가든시티", FR: "Garden City, une combinaison parfaite entre technologie et nature", ES: "Ciudad Jardín, una combinación perfecta entre tecnología y naturaleza", ID: "Garden City, kombinasi sempurna antara teknologi dan alam", HI: "गार्डन सिटी, प्रौद्योगिकी और प्रकृति का एक आदर्श संयोजन", PT: "Garden City, uma combinação perfeita de tecnologia e natureza", AR: "جاردن سيتي، مزيج مثالي من التكنولوجيا والطبيعة", RU: "Город-сад: идеальное сочетание технологий и природы",
    },
    top_food: {
      TW: "海南雞飯、肉骨茶", EN: "Hainanese chicken rice, bak kut teh", JP: "海南チキンライス、バクテー", KR: "하이난식 치킨 라이스, 바쿠테", FR: "Riz au poulet hainanais, bak kut teh", ES: "Arroz con pollo de Hainan, bak kut teh", ID: "Nasi ayam hainan, bak kut teh", HI: "हैनानी चिकन चावल, बक कुट तेह", PT: "Arroz de frango hainanês, bak kut teh", AR: "أرز دجاج هاينانيز، باك كوت", RU: "Курица с рисом по-хайнаньски, бак кут",
    },
    must_visit_spot: {
      TW: "濱海灣花園、魚尾獅", EN: "Gardens by the Bay, Merlion", JP: "ガーデンズ・バイ・ザ・ベイ、マーライオン", KR: "가든스 바이 더 베이, 멀라이언", FR: "Jardins au bord de la baie, Merlion", ES: "Jardines junto a la bahía, Merlion", ID: "Taman di tepi Teluk, Merlion", HI: "खाड़ी के किनारे उद्यान, मेरलियन", PT: "Jardins da Baía, Merlion", AR: "حدائق الخليج, ميرليون", RU: "Сады у залива, Мерлион",
    },
    recommendedDays: 3
  },
  "紐約": {
    name: {
      // [FIX] EN: "new york" → "New York"
      TW: "紐約", EN: "New York", JP: "ニューヨーク", KR: "뉴욕", FR: "New York", ES: "Nueva York", ID: "New York", HI: "न्यूयॉर्क", PT: "Nova Iorque", AR: "نيويورك", RU: "Нью-Йорк",
    },
    description: {
      TW: "大蘋果，不夜城，全球文化交匯處", EN: "The Big Apple, the city that never sleeps, the crossroads of global cultures", JP: "ビッグアップル、眠らない街、世界文化の交差点", KR: "잠들지 않는 도시, 글로벌 문화의 교차로, 빅애플", FR: "La Big Apple, la ville qui ne dort jamais, le carrefour des cultures mondiales", ES: "La Gran Manzana, la ciudad que nunca duerme, el cruce de culturas globales", ID: "The Big Apple, kota yang tidak pernah tidur, persimpangan budaya global", HI: "बिग एप्पल, वह शहर जो कभी नहीं सोता, वैश्विक संस्कृतियों का चौराहा", PT: "A Big Apple, a cidade que nunca dorme, a encruzilhada das culturas globais", AR: "التفاحة الكبيرة، المدينة التي لا تنام، ملتقى طرق الثقافات العالمية", RU: "«Большое Яблоко», город, который никогда не спит, перекресток мировых культур.",
    },
    top_food: {
      // [FIX] EN: "New York pancakes" → "New York pizza"（薄餅＝披薩）
      TW: "紐約薄餅、芝士蛋糕", EN: "New York pizza, cheesecake", JP: "ニューヨークピザ、チーズケーキ", KR: "뉴욕 피자, 치즈케이크", FR: "Pizza new-yorkaise, cheesecake", ES: "Pizza de Nueva York, tarta de queso", ID: "Pizza New York, kue keju", HI: "न्यूयॉर्क पिज्जा, चीज़केक", PT: "Pizza de Nova York, cheesecake", AR: "بيتزا نيويورك، كعكة الجبن", RU: "Нью-йоркская пицца, чизкейк",
    },
    must_visit_spot: {
      TW: "時代廣場、中央公園", EN: "Times Square, Central Park", JP: "タイムズスクエア、セントラルパーク", KR: "타임스퀘어, 센트럴파크", FR: "Times Square, Central Park", ES: "Times Square, Parque Central", ID: "Times Square, Taman Pusat", HI: "टाइम्स स्क्वायर, सेंट्रल पार्क", PT: "Times Square, Central Park", AR: "تايمز سكوير، سنترال بارك", RU: "Таймс-сквер, Центральный парк",
    },
    recommendedDays: 3
  },
  "杜拜": {
    name: {
      // [FIX] EN: "dubai" → "Dubai"; ES: "dubái" → "Dubái"; ID: "dubai" → "Dubai"
      TW: "杜拜", EN: "Dubai", JP: "ドバイ", KR: "두바이", FR: "Dubaï", ES: "Dubái", ID: "Dubai", HI: "दुबई", PT: "Dubai", AR: "دبي", RU: "Дубай",
    },
    description: {
      TW: "奢華現代，世界第一高樓與沙漠冒險", EN: "Luxurious modernity, the world's tallest building and desert adventure", JP: "豪華な現代性、世界で最も高い建物、そして砂漠の冒険", KR: "럭셔리한 현대성, 세계에서 가장 높은 건물과 사막 모험", FR: "Modernité luxueuse, bâtiment le plus haut du monde et aventure dans le désert", ES: "Modernidad lujosa, el edificio más alto del mundo y aventura en el desierto", ID: "Modernitas yang mewah, gedung tertinggi di dunia, dan petualangan gurun pasir", HI: "शानदार आधुनिकता, दुनिया की सबसे ऊंची इमारत और रेगिस्तान का रोमांच", PT: "Modernidade luxuosa, o edifício mais alto do mundo e aventura no deserto", AR: "الحداثة الفاخرة وأطول مبنى في العالم والمغامرة الصحراوية", RU: "Роскошная современность, самое высокое здание в мире и приключения в пустыне",
    },
    top_food: {
      TW: "阿拉伯烤肉、椰棗", EN: "Arabic kebab, dates", JP: "アラビアケバブ、デーツ", KR: "아랍어 케밥, 날짜", FR: "Kebab arabe, dattes", ES: "Kebab árabe, dátiles", ID: "Kebab arab, kurma", HI: "अरबी कबाब, खजूर", PT: "Kebab árabe, tâmaras", AR: "كباب عربي، تمر", RU: "Арабский кебаб, финики",
    },
    must_visit_spot: {
      TW: "哈里發塔、帆船酒店", EN: "Burj Khalifa, Burj Al Arab", JP: "ブルジュ・ハリファ、ブルジュ・アル・アラブ", KR: "버즈 칼리파, 버즈 알 아랍", FR: "Burj Khalifa, Burj Al Arab", ES: "Burj Khalifa, Burj Al Arab", ID: "Burj Khalifa, Burj Al-Arab", HI: "बुर्ज खलीफा, बुर्ज अल अरब", PT: "Burj Khalifa, Burj Al Arab", AR: "برج خليفة، برج العرب", RU: "Бурдж Халифа, Бурдж Аль Араб",
    },
    recommendedDays: 3
  },
  "羅馬": {
    name: {
      // [FIX] EN: "rome" → "Rome"
      TW: "羅馬", EN: "Rome", JP: "ローマ", KR: "로마", FR: "Rome", ES: "Roma", ID: "Roma", HI: "रोम", PT: "Roma", AR: "روما", RU: "Рим",
    },
    description: {
      TW: "永恆之城，古羅馬建築與歷史博物館", EN: "Eternal City, Museum of Ancient Roman Architecture and History", JP: "永遠の都、古代ローマ建築と歴史博物館", KR: "영원한 도시, 고대 로마 건축 및 역사 박물관", FR: "Ville Eternelle, Musée d'Architecture et d'Histoire de la Rome Antique", ES: "Ciudad Eterna, Museo de Arquitectura e Historia Romana Antigua", ID: "Kota Abadi, Museum Arsitektur dan Sejarah Romawi Kuno", HI: "शाश्वत शहर, प्राचीन रोमन वास्तुकला और इतिहास का संग्रहालय", PT: "Cidade Eterna, Museu de Arquitetura e História da Roma Antiga", AR: "المدينة الخالدة، متحف العمارة والتاريخ الروماني القديم", RU: "Вечный город, Музей древнеримской архитектуры и истории",
    },
    top_food: {
      TW: "培根蛋麵、Gelato", EN: "Carbonara, Gelato", JP: "カルボナーラ、ジェラート", KR: "까르보나라, 젤라또", FR: "Carbonara, Gelato", ES: "Carbonara, helado", ID: "Carbonara, Gelato", HI: "कार्बोनारा, जेलाटो", PT: "Carbonara, Gelato", AR: "كاربونارا، جيلاتو", RU: "Карбонара, Джелато",
    },
    must_visit_spot: {
      TW: "競技場、許願池", EN: "Colosseum, Trevi Fountain", JP: "コロッセオ、トレビの泉", KR: "콜로세움, 트레비분수", FR: "Colisée, Fontaine de Trevi", ES: "Coliseo, Fontana de Trevi", ID: "Colosseum, Air Mancur Trevi", HI: "कोलोसियम, ट्रेवी फाउंटेन", PT: "Coliseu, Fontana di Trevi", AR: "الكولوسيوم، نافورة تريفي", RU: "Колизей, Фонтан Треви",
    },
    recommendedDays: 3
  },
  "巴塞隆拿": {
    name: {
      // [FIX] EN: "barcelona" → "Barcelona"; ID: "barcelona" → "Barcelona"
      TW: "巴塞隆拿", EN: "Barcelona", JP: "バルセロナ", KR: "바르셀로나", FR: "Barcelone", ES: "Barcelona", ID: "Barcelona", HI: "बार्सिलोना", PT: "Barcelona", AR: "برشلونة", RU: "Барселона",
    },
    description: {
      TW: "建築奇蹟，地中海陽光與藝術氛圍", EN: "Architectural wonders, Mediterranean sunshine and artistic atmosphere", JP: "驚異の建築、地中海の太陽の光、芸術的な雰囲気", KR: "경이로운 건축물, 지중해의 햇살, 예술적인 분위기", FR: "Merveilles architecturales, soleil méditerranéen et ambiance artistique", ES: "Maravillas arquitectónicas, sol mediterráneo y atmósfera artística", ID: "Keajaiban arsitektur, sinar matahari Mediterania, dan suasana artistik", HI: "वास्तुकला के चमत्कार, भूमध्यसागरीय धूप और कलात्मक वातावरण", PT: "Maravilhas arquitetônicas, sol mediterrâneo e atmosfera artística", AR: "عجائب معمارية وأشعة شمس البحر الأبيض المتوسط ​​وأجواء فنية", RU: "Архитектурные чудеса, средиземноморское солнце и художественная атмосфера",
    },
    top_food: {
      TW: "海鮮燉飯、Tapas", EN: "Seafood paella, tapas", JP: "シーフードパエリア、タパス", KR: "해산물 파에야, 타파스", FR: "Paella aux fruits de mer, tapas", ES: "Paella de marisco, tapas", ID: "Paella makanan laut, tapas", HI: "समुद्री भोजन पाएला, तपस", PT: "Paella de frutos do mar, tapas", AR: "باييلا المأكولات البحرية، التاباس", RU: "Паэлья с морепродуктами, тапас",
    },
    must_visit_spot: {
      TW: "聖家堂、奎爾公園", EN: "Sagrada Familia, Park Guell", JP: "サグラダファミリア、グエル公園", KR: "사그라다 파밀리아, 구엘 공원", FR: "Sagrada Familia, Parc Güell", ES: "Sagrada Familia, Parque Güell", ID: "Sagrada Familia, Park Guell", HI: "सागरदा फ़मिलिया, पार्क गुएल", PT: "Sagrada Família, Parque Guell", AR: "ساجرادا فاميليا، بارك جويل", RU: "Саграда Фамилия, Парк Гуэль",
    },
    recommendedDays: 3
  },
  "首爾": {
    name: {
      // [FIX] ID: "seoul" → "Seoul"
      TW: "首爾", EN: "Seoul", JP: "ソウル", KR: "서울", FR: "Séoul", ES: "Seúl", ID: "Seoul", HI: "सोल", PT: "Seul", AR: "سيول", RU: "Сеул",
    },
    description: {
      TW: "K-Pop 聖地，美妝購物與現代生活", EN: "K-Pop mecca, beauty shopping and modern life", JP: "K-POPのメッカ、ビューティーショッピングと現代生活", KR: "K-Pop의 메카, 뷰티 쇼핑과 현대 생활", FR: "Mecque de la K-Pop, du shopping beauté et de la vie moderne", ES: "La meca del K-Pop, los centros de belleza y la vida moderna", ID: "Kiblat K-Pop, belanja kecantikan, dan kehidupan modern", HI: "के-पॉप मक्का, सौंदर्य खरीदारी और आधुनिक जीवन", PT: "Meca do K-Pop, compras de produtos de beleza e vida moderna", AR: "الكيبوب مكة، تسوق الجمال والحياة العصرية", RU: "Мекка K-Pop, бьюти-шопинг и современная жизнь",
    },
    top_food: {
      TW: "韓式烤肉、拌飯", EN: "Korean BBQ, bibimbap", JP: "韓国焼き肉、ビビンバ", KR: "한국식 바비큐, 비빔밥", FR: "BBQ coréen, bibimbap", ES: "Barbacoa coreana, bibimbap", ID: "BBQ Korea, bibimbap", HI: "कोरियाई बीबीक्यू, बिबिंबैप", PT: "Churrasco coreano, bibimbap", AR: "مشويات كورية، بيبيمباب", RU: "Корейское барбекю, пибимбап",
    },
    must_visit_spot: {
      TW: "景福宮、明洞", EN: "Gyeongbokgung Palace, Myeongdong", JP: "景福宮、明洞", KR: "경복궁, 명동", FR: "Palais Gyeongbokgung, Myeongdong", ES: "Palacio Gyeongbokgung, Myeongdong", ID: "Istana Gyeongbokgung, Myeongdong", HI: "ग्योंगबोकगंग पैलेस, मायओंगडोंग", PT: "Palácio Gyeongbokgung, Myeongdong", AR: "قصر جيونج بوكجيونج في ميونج دونج", RU: "Дворец Кёнбоккун, Мёндон",
    },
    recommendedDays: 3
  },
  "台北": {
    name: {
      TW: "台北", EN: "Taipei", JP: "タイペイ", KR: "타이페이", FR: "Taïpei", ES: "Taipéi", ID: "Taipei", HI: "ताइपे", PT: "Taipei", AR: "تايبيه", RU: "Тайбэй",
    },
    description: {
      TW: "熱情好客，夜市文化與便利生活", EN: "Hospitality, night market culture and convenient life", JP: "おもてなし、夜市文化、便利な生活", KR: "환대와 야시장 문화, 편리한 생활", FR: "Hospitalité, culture du marché nocturne et vie pratique", ES: "Hospitalidad, cultura de mercado nocturno y vida cómoda.", ID: "Keramahan, budaya pasar malam, dan kehidupan yang nyaman", HI: "आतिथ्य, रात्रि बाज़ार संस्कृति और सुविधाजनक जीवन", PT: "Hospitalidade, cultura do mercado noturno e vida conveniente", AR: "الضيافة وثقافة السوق الليلي والحياة المريحة", RU: "Гостеприимство, культура ночного рынка и удобная жизнь",
    },
    top_food: {
      TW: "牛肉麵、小籠包", EN: "Beef noodles, xiaolongbao", JP: "牛肉麺、小籠包", KR: "쇠고기 국수, 샤오롱바오", FR: "Nouilles au bœuf, xiaolongbao", ES: "Fideos con carne, xiaolongbao", ID: "Mie daging sapi, xiaolongbao", HI: "बीफ़ नूडल्स, ज़ियाओलोंगबाओ", PT: "Macarrão de carne, xiaolongbao", AR: "نودلز لحم البقر، شياولونغباو", RU: "Лапша с говядиной, сяолунбао",
    },
    must_visit_spot: {
      // [FIX] JP: "九份101ビル" → "台北101、九份"
      TW: "101大樓、九份", EN: "Taipei 101, Jiufen", JP: "台北101、九份（ジウフェン）", KR: "101 빌딩, 지우펀", FR: "Taipei 101, Jiufen", ES: "Taipei 101, Jiufen", ID: "Taipei 101, Jiufen", HI: "ताइपे 101, जिउफेन", PT: "Taipei 101, Jiufen", AR: "تايبيه 101، جيوفين", RU: "Тайбэй 101, Цзюфэнь",
    },
    recommendedDays: 3
  },
  "大阪": {
    name: {
      TW: "大阪", EN: "Osaka", JP: "大阪", KR: "오사카", FR: "Ōsaka", ES: "Osaka", ID: "Osaka", HI: "ओसाका", PT: "Osaca", AR: "أوساكا", RU: "Осака",
    },
    description: {
      TW: "天下之廚房，關西熱情與環球影城", EN: "Kitchen of the World, Kansai passion and Universal Studios", JP: "世界のキッチン、関西の情熱、ユニバーサルスタジオ", KR: "세계의 주방, 간사이의 열정, 유니버설 스튜디오", FR: "Cuisine du monde, passion Kansai et Universal Studios", ES: "Cocina del mundo, pasión de Kansai y Universal Studios", ID: "Dapur Dunia, semangat Kansai, dan Universal Studios", HI: "किचन ऑफ द वर्ल्ड, कंसाई जुनून और यूनिवर्सल स्टूडियो", PT: "Cozinha do Mundo, paixão Kansai e Universal Studios", AR: "مطبخ العالم، شغف كانساي ويونيفرسال ستوديوز", RU: "Кухня мира, страсть Кансай и Universal Studios",
    },
    top_food: {
      TW: "章魚燒、大阪燒", EN: "Takoyaki, Okonomiyaki", JP: "たこ焼き、お好み焼き", KR: "타코야끼, 오코노미야키", FR: "Takoyaki, Okonomiyaki", ES: "Takoyaki, Okonomiyaki", ID: "Takoyaki, Okonomiyaki", HI: "ताकोयाकी, ओकोनोमियाकी", PT: "Takoyaki, Okonomiyaki", AR: "تاكوياكي، أوكونوميياكي", RU: "Такояки, Окономияки",
    },
    must_visit_spot: {
      TW: "道頓堀、大阪城", EN: "Dotonbori, Osaka Castle", JP: "道頓堀、大阪城", KR: "도톤보리, 오사카성", FR: "Dotonbori, château d'Osaka", ES: "Dotonbori, Castillo de Osaka", ID: "Dotonbori, Istana Osaka", HI: "डोटोनबोरी, ओसाका कैसल", PT: "Dotonbori, Castelo de Osaka", AR: "دوتونبوري، قلعة أوساكا", RU: "Дотонбори, Замок Осаки",
    },
    recommendedDays: 3
  },
  "京都": {
    name: {
      TW: "京都", EN: "Kyoto", JP: "京都", KR: "교토", FR: "Kyoto", ES: "Kioto", ID: "Kyoto", HI: "क्योटो", PT: "Quioto", AR: "كيوتو", RU: "Киото",
    },
    description: {
      TW: "千年古都，和服體驗與禪意寺廟", EN: "Thousand-year-old ancient capital, kimono experience and Zen temples", JP: "千年の古都と着物体験と禅寺", KR: "천년고도, 기모노 체험, 선종 사찰", FR: "Ancienne capitale millénaire, expérience du kimono et temples zen", ES: "Antigua capital milenaria, experiencia con kimonos y templos zen", ID: "Ibu kota kuno berusia ribuan tahun, pengalaman kimono, dan kuil Zen", HI: "हज़ार साल पुरानी प्राचीन राजधानी, किमोनो अनुभव और ज़ेन मंदिर", PT: "Capital milenar, experiência com quimonos e templos Zen", AR: "عاصمة قديمة عمرها ألف عام وتجربة الكيمونو ومعابد زن", RU: "Тысячелетняя древняя столица, опыт кимоно и храмы дзен",
    },
    top_food: {
      TW: "懷石料理、抹茶", EN: "Kaiseki cuisine, matcha", JP: "懐石料理・抹茶", KR: "가이세키 요리, 말차", FR: "Cuisine Kaiseki, matcha", ES: "Cocina kaiseki, matcha", ID: "Masakan Kaiseki, matcha", HI: "काइसेकी व्यंजन, मटचा", PT: "Cozinha Kaiseki, matcha", AR: "مطبخ كايسيكي، ماتشا", RU: "Кухня Кайсэки, матча",
    },
    must_visit_spot: {
      TW: "清水寺、伏見稻荷", EN: "Kiyomizudera Temple, Fushimi Inari", JP: "清水寺、伏見稲荷大社", KR: "기요미즈데라 절, 후시미 이나리", FR: "Temple Kiyomizudera, Fushimi Inari", ES: "Templo Kiyomizudera, Fushimi Inari", ID: "Kuil Kiyomizudera, Fushimi Inari", HI: "कियोमिज़ुडेरा मंदिर, फ़ुशिमी इनारी", PT: "Templo Kiyomizudera, Fushimi Inari", AR: "معبد كيوميزوديرا, فوشيمي إيناري", RU: "Храм Киёмидзудера, Фусими Инари",
    },
    recommendedDays: 3
  },
  "雪梨": {
    name: {
      // [FIX] FR/ES/ID/PT: "Sidney" → "Sydney"
      TW: "雪梨", EN: "Sydney", JP: "シドニー", KR: "시드니", FR: "Sydney", ES: "Sídney", ID: "Sydney", HI: "सिडनी", PT: "Sydney", AR: "سيدني", RU: "Сидней",
    },
    description: {
      TW: "海灣之美，戶外生活與標誌性歌劇院", EN: "The beauty of the bay, outdoor living and the iconic Opera House", JP: "湾の美しさ、アウトドアリビング、そして象徴的なオペラハウス", KR: "만의 아름다움, 야외 생활, 상징적인 오페라 하우스", FR: "La beauté de la baie, la vie en plein air et l'emblématique Opéra", ES: "La belleza de la bahía, la vida al aire libre y la icónica Ópera", ID: "Keindahan teluk, kehidupan luar ruangan, dan Gedung Opera yang ikonik", HI: "खाड़ी की सुंदरता, बाहरी जीवन और प्रतिष्ठित ओपेरा हाउस", PT: "A beleza da baía, a vida ao ar livre e a icônica Opera House", AR: "جمال الخليج والمعيشة في الهواء الطلق ودار الأوبرا الشهيرة", RU: "Красота залива, жизнь на свежем воздухе и знаменитый Оперный театр.",
    },
    top_food: {
      TW: "澳洲和牛、海鮮", EN: "Australian Wagyu beef, seafood", JP: "オーストラリア産和牛、魚介類", KR: "호주산 와규, 해산물", FR: "Bœuf Wagyu australien, fruits de mer", ES: "Carne Wagyu australiana, marisco", ID: "Daging sapi Wagyu Australia, makanan laut", HI: "ऑस्ट्रेलियाई वाग्यू गोमांस, समुद्री भोजन", PT: "Carne Wagyu australiana, frutos do mar", AR: "لحم واغيو الاسترالي، المأكولات البحرية", RU: "Австралийская говядина вагю, морепродукты",
    },
    must_visit_spot: {
      TW: "雪梨歌劇院、邦代海灘", EN: "Sydney Opera House, Bondi Beach", JP: "シドニーオペラハウス、ボンダイビーチ", KR: "시드니 오페라 하우스, 본다이 비치", FR: "Opéra de Sydney, plage de Bondi", ES: "Ópera de Sídney, Bondi Beach", ID: "Gedung Opera Sydney, Pantai Bondi", HI: "सिडनी ओपेरा हाउस, बॉन्डी बीच", PT: "Ópera de Sydney, Bondi Beach", AR: "دار أوبرا سيدني، شاطئ بوندي", RU: "Сиднейский оперный театр, Бонди-Бич",
    },
    recommendedDays: 3
  },
  "阿姆斯特丹": {
    name: {
      // [FIX] EN: "amsterdam" → "Amsterdam"; FR: "amsterdam" → "Amsterdam"; ES: "ámsterdam" → "Ámsterdam"; ID: "amsterdam" → "Amsterdam"
      TW: "阿姆斯特丹", EN: "Amsterdam", JP: "アムステルダム", KR: "암스테르담", FR: "Amsterdam", ES: "Ámsterdam", ID: "Amsterdam", HI: "एम्सटर्डम", PT: "Amsterdã", AR: "أمستردام", RU: "Амстердам",
    },
    description: {
      TW: "運河之城，自由奔放與博物館之旅", EN: "The city of canals, free spirit and museum tours", JP: "運河の街、自由な精神、美術館ツアー", KR: "운하, 자유로운 영혼, 박물관 투어의 도시", FR: "La ville des canaux, esprit libre et visites de musées", ES: "La ciudad de los canales, espíritu libre y visitas a museos", ID: "Kota kanal, semangat bebas, dan tur museum", HI: "नहरों का शहर, मुक्त आत्मा और संग्रहालय पर्यटन", PT: "A cidade dos canais, do espírito livre e dos passeios em museus", AR: "مدينة القنوات والروح الحرة وجولات المتحف", RU: "Город каналов, свободный дух и экскурсии по музеям",
    },
    top_food: {
      TW: "生醃鯡魚、荷蘭煎餅", EN: "Raw pickled herring, Dutch pancakes", JP: "生ニシンのピクルス、オランダのパンケーキ", KR: "생 청어 절임, 네덜란드식 팬케이크", FR: "Hareng cru mariné, crêpes hollandaises", ES: "Arenque crudo en escabeche, panqueques holandeses", ID: "Ikan haring acar mentah, pancake Belanda", HI: "कच्चे अचार वाली हेरिंग, डच पैनकेक", PT: "Arenque cru em conserva, panquecas holandesas", AR: "رنجة مخللة خام، فطائر هولندية", RU: "Сырая маринованная сельдь, голландские блины",
    },
    must_visit_spot: {
      TW: "梵谷博物館、安妮之家", EN: "Van Gogh Museum, Anne Frank House", JP: "ゴッホ美術館、アンネ・フランクの家", KR: "반고흐 미술관, 안네 프랑크의 집", FR: "Musée Van Gogh, Maison d'Anne Frank", ES: "Museo Van Gogh, Casa de Ana Frank", ID: "Museum Van Gogh, Rumah Anne Frank", HI: "वान गाग संग्रहालय, ऐनी फ्रैंक हाउस", PT: "Museu Van Gogh, Casa de Anne Frank", AR: "متحف فان جوخ، بيت آن فرانك", RU: "Музей Ван Гога, Дом Анны Франк",
    },
    recommendedDays: 3
  },
  "威尼斯": {
    name: {
      TW: "威尼斯", EN: "Venice", JP: "ヴェネツィア", KR: "베니스", FR: "Venise", ES: "Venecia", ID: "Venesia", HI: "वेनिस", PT: "Veneza", AR: "البندقية", RU: "Венеция",
    },
    description: {
      TW: "水上明珠，獨特的貢多拉體驗", EN: "A pearl on the water, a unique gondola experience", JP: "水上の真珠、ユニークなゴンドラ体験", KR: "물 위의 진주, 독특한 곤돌라 체험", FR: "Une perle sur l'eau, une expérience unique en gondole", ES: "Una perla en el agua, una experiencia única en góndola", ID: "Mutiara di atas air, pengalaman gondola yang unik", HI: "पानी पर एक मोती, एक अनोखा गोंडोला अनुभव", PT: "Uma pérola na água, uma experiência única de gôndola", AR: "لؤلؤة فوق الماء، تجربة جندول فريدة من نوعها", RU: "Жемчужина на воде, уникальные впечатления от гондолы",
    },
    top_food: {
      TW: "墨魚麵、提拉米蘇", EN: "Cuttlefish noodles, tiramisu", JP: "イカ麺、ティラミス", KR: "오징어국수, 티라미수", FR: "Nouilles de seiche, tiramisu", ES: "Fideos de sepia, tiramisú", ID: "Mie sotong, tiramisu", HI: "कटलफिश नूडल्स, तिरामिसु", PT: "Macarrão de choco, tiramisu", AR: "نودلز الحبار، تيراميسو", RU: "Лапша из каракатиц, тирамису",
    },
    must_visit_spot: {
      TW: "聖馬可廣場、大運河", EN: "Piazza San Marco, Grand Canal", JP: "サンマルコ広場、大運河", KR: "산 마르코 광장, 대운하", FR: "Place Saint-Marc, Grand Canal", ES: "Plaza de San Marcos, Gran Canal", ID: "Piazza San Marco, Kanal Besar", HI: "पियाज़ा सैन मार्को, ग्रैंड कैनाल", PT: "Praça de São Marcos, Grande Canal", AR: "ساحة سان ماركو، القناة الكبرى", RU: "Площадь Сан-Марко, Большой канал",
    },
    recommendedDays: 3
  },
  "布拉格": {
    name: {
      TW: "布拉格", EN: "Prague", JP: "プラハ", KR: "프라하", FR: "Prague", ES: "Praga", ID: "Praha", HI: "प्राहा", PT: "Praga", AR: "براغ", RU: "Прага",
    },
    description: {
      TW: "中世紀童話，紅磚瓦與波希米亞風情", EN: "Medieval fairy tale, red bricks and bohemian style", JP: "中世のおとぎ話、赤レンガ、ボヘミアン スタイル", KR: "중세 동화, 붉은 벽돌, 보헤미안 스타일", FR: "Conte de fée médiéval, briques rouges et style bohème", ES: "Cuento de hadas medieval, ladrillos rojos y estilo bohemio.", ID: "Dongeng abad pertengahan, bata merah, dan gaya bohemian", HI: "मध्यकालीन परी कथा, लाल ईंटें और बोहेमियन शैली", PT: "Conto de fadas medieval, tijolos vermelhos e estilo boêmio", AR: "حكاية خرافية من العصور الوسطى والطوب الأحمر والأسلوب البوهيمي", RU: "Средневековая сказка, красный кирпич и богемный стиль.",
    },
    top_food: {
      TW: "烤豬腳、捷克啤酒", EN: "Roasted pork knuckle, Czech beer", JP: "豚足のロースト、チェコビール", KR: "구운 족발, 체코 맥주", FR: "Jarret de porc rôti, bière tchèque", ES: "Codillo de cerdo asado, cerveza checa", ID: "Kaki babi panggang, bir Ceko", HI: "भुना हुआ सुअर का पैर, चेक बियर", PT: "Joelho de porco assado, cerveja checa", AR: "كنافة خنزير مشوية، بيرة تشيكية", RU: "Жареная свиная рулька, чешское пиво.",
    },
    must_visit_spot: {
      TW: "查理大橋、布拉格城堡", EN: "Charles Bridge, Prague Castle", JP: "カレル橋、プラハ城", KR: "카를교, 프라하 성", FR: "Pont Charles, Château de Prague", ES: "Puente de Carlos, Castillo de Praga", ID: "Jembatan Charles, Kastil Praha", HI: "चार्ल्स ब्रिज, प्राग कैसल", PT: "Ponte Carlos, Castelo de Praga", AR: "جسر تشارلز، قلعة براغ", RU: "Карлов мост, Пражский Град",
    },
    recommendedDays: 3
  },
  "吉隆坡": {
    name: {
      TW: "吉隆坡", EN: "Kuala Lumpur", JP: "クアラルンプール", KR: "쿠알라룸푸르", FR: "Kuala Lumpur", ES: "Kuala Lumpur", ID: "Kuala Lumpur", HI: "क्वालालंपुर", PT: "Kuala Lumpur", AR: "كوالا لمبور", RU: "Куала-Лумпур",
    },
    description: {
      TW: "多元民族，雙子塔與森林城市", EN: "Multiethnicity, Twin Towers and Forest City", JP: "多民族、ツインタワー、森林都市", KR: "다민족성, 쌍둥이 빌딩, 포레스트 시티", FR: "Multiethnicité, Twin Towers et Forest City", ES: "Multietnicidad, Torres Gemelas y Forest City", ID: "Multietnis, Menara Kembar dan Hutan Kota", HI: "बहुजातीयता, ट्विन टावर्स और वन शहर", PT: "Multietnia, Torres Gêmeas e Cidade Florestal", AR: "التعددية العرقية والبرجين التوأمين ومدينة الغابة", RU: "Многонациональность, башни-близнецы и лесной город",
    },
    top_food: {
      TW: "椰漿飯、沙嗲", EN: "Nasi Lemak, Satay", JP: "ナシレマック、サテー", KR: "나시 르막, 사테이", FR: "Nasi Lemak, Satay", ES: "Nasi Lemak, Satay", ID: "Nasi Lemak, Sate", HI: "नासी लेमक, सत्ये", PT: "Nasi Lemak, Satay", AR: "ناسي ليماك، ساتاي", RU: "Наси Лемак, Сатай",
    },
    must_visit_spot: {
      TW: "雙峰塔、黑風洞", EN: "Petronas Twin Towers, Batu Caves", JP: "ペトロナス ツイン タワー、バトゥ洞窟", KR: "페트로나스 트윈 타워, 바투 동굴", FR: "Tours jumelles Petronas, grottes de Batu", ES: "Torres Gemelas Petronas, Cuevas de Batu", ID: "Menara Kembar Petronas, Gua Batu", HI: "पेट्रोनास ट्विन टावर्स, बट्टू गुफाएँ", PT: "Torres Gêmeas Petronas, Cavernas Batu", AR: "برجا بتروناس التوأم وكهوف باتو", RU: "Башни-близнецы Петронас, пещеры Бату",
    },
    recommendedDays: 3
  },
  "維也納": {
    name: {
      // [FIX] EN: "vienna" → "Vienna"; ES: "viena" → "Viena"
      TW: "維也納", EN: "Vienna", JP: "ウィーン", KR: "비엔나", FR: "Vienne", ES: "Viena", ID: "Wina", HI: "वियना", PT: "Viena", AR: "فيينا", RU: "Вена",
    },
    description: {
      TW: "音樂之都，古典建築與皇室咖啡館", EN: "City of music, classical architecture and royal cafes", JP: "音楽の街、古典的な建築、王室のカフェ", KR: "음악의 도시, 고전 건축물과 왕실 카페", FR: "Ville de musique, d'architecture classique et de cafés royaux", ES: "Ciudad de la música, arquitectura clásica y cafés reales", ID: "Kota musik, arsitektur klasik, dan kafe kerajaan", HI: "संगीत, शास्त्रीय वास्तुकला और शाही कैफे का शहर", PT: "Cidade da música, arquitetura clássica e cafés reais", AR: "مدينة الموسيقى والعمارة الكلاسيكية والمقاهي الملكية", RU: "Город музыки, классической архитектуры и королевских кафе",
    },
    top_food: {
      TW: "炸牛排、薩赫蛋糕", EN: "Wiener Schnitzel, Sacher Torte", JP: "ウィーナー・シュニッツェル、ザッハトルテ", KR: "비너 슈니첼, 자허 토르테", FR: "Wiener Schnitzel, Torte Sacher", ES: "Wiener Schnitzel, Tarta Sacher", ID: "Wiener Schnitzel, Sacher Torte", HI: "वीनर श्निट्ज़ेल, सचर टोर्टे", PT: "Wiener Schnitzel, Sacher Torte", AR: "شنيتسل فيينا، تورتة زاخر", RU: "Венский шницель, торт Захер",
    },
    must_visit_spot: {
      TW: "美泉宮、國家歌劇院", EN: "Schönbrunn Palace, State Opera House", JP: "シェーンブルン宮殿、国立歌劇場", KR: "쇤부른 궁전, 국립 오페라 하우스", FR: "Château de Schönbrunn, Opéra national", ES: "Palacio de Schönbrunn, Ópera Estatal", ID: "Istana Schönbrunn, Gedung Opera Negara", HI: "शॉनब्रुन पैलेस, स्टेट ओपेरा हाउस", PT: "Palácio de Schönbrunn, Ópera Estatal", AR: "قصر شونبرون، دار الأوبرا الحكومية", RU: "Дворец Шенбрунн, Государственный оперный театр",
    },
    recommendedDays: 3
  },
  "柏林": {
    name: {
      // [FIX] ES: "Berlina" → "Berlín"
      TW: "柏林", EN: "Berlin", JP: "ベルリン", KR: "베를린", FR: "Berlin", ES: "Berlín", ID: "Berlin", HI: "बर्लिन", PT: "Berlim", AR: "برلين", RU: "Берлин",
    },
    description: {
      TW: "歷史傷痕與次文化融合，前衛藝術基地", EN: "Fusion of historical scars and subculture, avant-garde art base", JP: "歴史の傷跡とサブカルチャーの融合、前衛芸術の拠点", KR: "역사적 상처와 서브컬쳐의 융합, 아방가르드 예술의 베이스", FR: "Fusion des cicatrices historiques et de la sous-culture, base artistique d'avant-garde", ES: "Fusión de cicatrices históricas y subcultura, base artística de vanguardia.", ID: "Perpaduan bekas luka sejarah dan subkultur, basis seni avant-garde", HI: "ऐतिहासिक निशानों और उपसंस्कृति का संलयन, अवांट-गार्डे कला आधार", PT: "Fusão de cicatrizes históricas e subcultura, base artística de vanguarda", AR: "مزيج من الندبات التاريخية والثقافة الفرعية، وقاعدة فنية طليعية", RU: "Слияние исторических шрамов и субкультуры, основа авангардного искусства.",
    },
    top_food: {
      TW: "咖喱香腸、土耳其旋轉烤肉", EN: "Currywurst, Döner kebab", JP: "カリーヴルスト、ドネルケバブ", KR: "커리부르스트, 되너 케밥", FR: "Currywurst, Döner kebab", ES: "Currywurst, döner kebab", ID: "Currywurst, Döner kebab", HI: "करीवुर्स्ट, डोनर कबाब", PT: "Currywurst, döner kebab", AR: "كوريوورست، دونر كباب", RU: "Карривурст, дёнер-кебаб",
    },
    must_visit_spot: {
      TW: "布蘭登堡門、柏林圍牆", EN: "Brandenburg Gate, Berlin Wall", JP: "ブランデンブルク門、ベルリンの壁", KR: "브란덴부르크 문, 베를린 장벽", FR: "Porte de Brandebourg, mur de Berlin", ES: "Puerta de Brandenburgo, Muro de Berlín", ID: "Gerbang Brandenburg, Tembok Berlin", HI: "ब्रैंडेनबर्ग गेट, बर्लिन की दीवार", PT: "Portão de Brandemburgo, Muro de Berlim", AR: "بوابة براندنبورغ، جدار برلين", RU: "Бранденбургские ворота, Берлинская стена",
    },
    recommendedDays: 3
  },
  "馬德里": {
    name: {
      // [FIX] EN: "madrid" → "Madrid"
      TW: "馬德里", EN: "Madrid", JP: "マドリード", KR: "마드리드", FR: "Madrid", ES: "Madrid", ID: "Madrid", HI: "मैड्रिड", PT: "Madri", AR: "مدريد", RU: "Мадрид",
    },
    description: {
      TW: "熱情的廣場文化，不夜城的夜生活", EN: "Passionate square culture and nightlife in the city that never sleeps", JP: "眠らない街の情熱的な広場文化とナイトライフ", KR: "잠들지 않는 도시의 열정적인 광장 문화와 나이트라이프", FR: "Culture carrée passionnée et vie nocturne dans la ville qui ne dort jamais", ES: "Apasionada cultura de plaza y vida nocturna en la ciudad que nunca duerme", ID: "Budaya alun-alun yang penuh gairah dan kehidupan malam di kota yang tidak pernah tidur", HI: "शहर की जोशीली चौक संस्कृति और रात्रिजीवन जो कभी नहीं सोता", PT: "Cultura apaixonante de praças e vida noturna na cidade que nunca dorme", AR: "ثقافة الساحة العاطفية والحياة الليلية في المدينة التي لا تنام", RU: "Страстная культура площадей и ночная жизнь в городе, который никогда не спит",
    },
    top_food: {
      // [FIX] EN: "Chipotle" → "Churros"（吉拿棒≠Chipotle）
      TW: "吉拿棒、馬德里燉菜", EN: "Churros, Madrid stew (Cocido madrileño)", JP: "チュロス、マドリッドシチュー（コシード・マドリレーニョ）", KR: "추로스, 마드리드 스튜", FR: "Churros, ragoût de Madrid (Cocido madrileño)", ES: "Churros, cocido madrileño", ID: "Churros, sup Madrid (Cocido madrileño)", HI: "चुरोस, मैड्रिड स्टू", PT: "Churros, cozido madrileno", AR: "تشوروس، يخنة مدريد", RU: "Чурро, Мадридское рагу",
    },
    must_visit_spot: {
      TW: "普拉多博物館、太陽門廣場", EN: "Prado Museum, Puerta del Sol", JP: "プラド美術館、プエルタ デル ソル", KR: "프라도 미술관, 푸에르타 델 솔", FR: "Musée du Prado, Puerta del Sol", ES: "Museo del Prado, Puerta del Sol", ID: "Museum Prado, Puerta del Sol", HI: "प्राडो संग्रहालय, पुएर्ता डेल सोल", PT: "Museu do Prado, Puerta del Sol", AR: "متحف برادو، بويرتا ديل سول", RU: "Музей Прадо, Пуэрта дель Соль.",
    },
    recommendedDays: 3
  },
  "里斯本": {
    name: {
      // [FIX] EN: "lisbon" → "Lisbon"
      TW: "里斯本", EN: "Lisbon", JP: "リスボン", KR: "리스본", FR: "Lisbonne", ES: "Lisboa", ID: "Lisbon", HI: "लिस्बन", PT: "Lisboa", AR: "لشبونة", RU: "Лиссабон",
    },
    description: {
      TW: "七丘之城，懷舊電車與絕美花磚", EN: "The city of seven hills, nostalgic trams and stunning tiles", JP: "7つの丘、ノスタルジックな路面電車、見事なタイルの街", KR: "일곱 개의 언덕, 향수를 불러일으키는 트램, 아름다운 타일로 이루어진 도시", FR: "La ville aux sept collines, aux tramways nostalgiques et aux superbes tuiles", ES: "La ciudad de las siete colinas, tranvías nostálgicos y azulejos impresionantes", ID: "Kota tujuh bukit, trem nostalgia, dan ubin yang menakjubkan", HI: "सात पहाड़ियों, पुरानी यादों वाली ट्रामों और आश्चर्यजनक टाइलों का शहर", PT: "A cidade das sete colinas, eléctricos nostálgicos e azulejos deslumbrantes", AR: "مدينة التلال السبعة والترام الحنين والبلاط المذهل", RU: "Город семи холмов, ностальгические трамваи и потрясающая плитка",
    },
    top_food: {
      // [FIX] EN: "Ma Jiexiu" → "Bacalhau"（馬介休＝葡式鹹鱈魚）; ID: "Pelacur" → "Tart" （嚴重翻譯錯誤）
      TW: "葡式蛋塔、馬介休", EN: "Portuguese egg tart (Pastel de nata), bacalhau", JP: "ポルトガルのエッグタルト（パステル・デ・ナタ）、バカリャウ", KR: "포르투갈식 에그타르트, 바칼라우", FR: "Tarte aux œufs portugaise, bacalhau", ES: "Pastel de nata, bacalao (bacalhau)", ID: "Tart telur Portugis, bacalhau", HI: "पुर्तगाली अंडा टार्ट, बाकाल्याऊ", PT: "Pastel de nata, bacalhau", AR: "تورتة البيض البرتغالية، باكالياو", RU: "Португальский яичный пирог, бакаляу",
    },
    must_visit_spot: {
      TW: "貝倫塔、聖喬治城堡", EN: "Belem Tower, Castle of Saint George", JP: "ベレンの塔、聖ジョージ城", KR: "벨렘 타워, 세인트 조지 성", FR: "Tour de Belém, Château de Saint Georges", ES: "Torre de Belem, Castillo de San Jorge", ID: "Menara Belem, Kastil Saint George", HI: "बेलेम टॉवर, सेंट जॉर्ज का महल", PT: "Torre de Belém, Castelo de São Jorge", AR: "برج بيليم، قلعة القديس جاورجيوس", RU: "Белемская башня, замок Святого Георгия",
    },
    recommendedDays: 3
  },
  "雅典": {
    name: {
      // [FIX] EN: "athens" → "Athens"
      TW: "雅典", EN: "Athens", JP: "アテネ", KR: "아테네", FR: "Athènes", ES: "Atenas", ID: "Athena", HI: "एथेंस", PT: "Atenas", AR: "أثينا", RU: "Афины",
    },
    description: {
      TW: "西方文明發源地，古希臘神廟遺址", EN: "The birthplace of Western civilization, ruins of ancient Greek temples", JP: "西洋文明発祥の地、古代ギリシャの神殿遺跡", KR: "서구 문명의 발상지, 고대 그리스 신전 유적", FR: "Berceau de la civilisation occidentale, ruines d'anciens temples grecs", ES: "La cuna de la civilización occidental, ruinas de antiguos templos griegos.", ID: "Tempat kelahiran peradaban Barat, reruntuhan kuil Yunani kuno", HI: "पश्चिमी सभ्यता का जन्मस्थान, प्राचीन यूनानी मंदिरों के खंडहर", PT: "O berço da civilização ocidental, ruínas de antigos templos gregos", AR: "مهد الحضارة الغربية وأطلال المعابد اليونانية القديمة", RU: "Родина западной цивилизации, руины древнегреческих храмов",
    },
    top_food: {
      // [FIX] EN: "Greek Burritos" → "Gyros"（希臘捲餅＝Gyros）
      TW: "希臘捲餅、穆薩卡", EN: "Gyros, Moussaka", JP: "ギロス、ムサカ", KR: "기로스, 무사카", FR: "Gyros, moussaka", ES: "Gyros, moussaka", ID: "Gyros, Moussaka", HI: "जाइरोस, मौसाका", PT: "Gyros, Moussaka", AR: "جيروس، مسقعة", RU: "Гирос, мусака",
    },
    must_visit_spot: {
      TW: "衛城、帕德嫩神廟", EN: "Acropolis, Parthenon", JP: "アクロポリス、パルテノン神殿", KR: "아크로폴리스, 파르테논 신전", FR: "Acropole, Parthénon", ES: "Acrópolis, Partenón", ID: "Akropolis, Parthenon", HI: "एक्रोपोलिस, पार्थेनन", PT: "Acrópole, Partenon", AR: "الأكروبوليس، البارثينون", RU: "Акрополь, Парфенон",
    },
    recommendedDays: 3
  },
  "胡志明市": {
    name: {
      TW: "胡志明市", EN: "Ho Chi Minh City", JP: "ホーチミン市", KR: "호치민시", FR: "Hô Chi Minh-Ville", ES: "Ciudad Ho Chi Minh", ID: "Kota Ho Chi Minh", HI: "हो ची मिन्ह सिटी", PT: "Cidade de Ho Chi Minh", AR: "مدينة هوشي منه", RU: "Хошимин",
    },
    description: {
      TW: "法式殖民風情與現代摩托大軍的碰撞", EN: "The collision of French colonial style and modern motorcycle army", JP: "フレンチコロニアルスタイルと現代のバイク軍団の衝突", KR: "프랑스 식민지 스타일과 현대 오토바이 군대의 충돌", FR: "La collision du style colonial français et de l'armée de motos moderne", ES: "La colisión entre el estilo colonial francés y el moderno ejército de motociclistas", ID: "Benturan gaya kolonial Perancis dan sepeda motor tentara modern", HI: "फ्रांसीसी औपनिवेशिक शैली और आधुनिक मोटरसाइकिल सेना की टक्कर", PT: "A colisão do estilo colonial francês e do moderno exército de motocicletas", AR: "التصادم بين الطراز الاستعماري الفرنسي وجيش الدراجات النارية الحديث", RU: "Столкновение французского колониального стиля и современной мотоциклетной армии.",
    },
    top_food: {
      TW: "越南河粉、法式麵包", EN: "Vietnamese pho, French bread", JP: "ベトナムのフォー、フランスパン", KR: "베트남 쌀국수, 프랑스빵", FR: "Pho vietnamien, pain français", ES: "Pho vietnamita, pan francés", ID: "Pho Vietnam, roti Perancis", HI: "वियतनामी फो, फ़्रेंच ब्रेड", PT: "Pho vietnamita, pão francês", AR: "فو الفيتنامية، الخبز الفرنسي", RU: "Вьетнамское фо, французский хлеб",
    },
    must_visit_spot: {
      TW: "粉紅教堂、咖啡公寓", EN: "Pink church, coffee apartment", JP: "ピンクの教会、コーヒーアパートメント", KR: "핑크 교회, 커피 아파트", FR: "Église rose, appartement de café", ES: "Iglesia rosa, apartamento café.", ID: "Gereja merah muda, apartemen kopi", HI: "गुलाबी चर्च, कॉफ़ी अपार्टमेंट", PT: "Igreja rosa, apartamento café", AR: "الكنيسة الوردية، شقة القهوة", RU: "Розовая церковь, кофейная квартира",
    },
    recommendedDays: 3
  },
  "斯德哥爾摩": {
    name: {
      // [FIX] EN/JP were still in Chinese
      TW: "斯德哥爾摩", EN: "Stockholm", JP: "ストックホルム", KR: "스톡홀름", FR: "Stockholm", ES: "Estocolmo", ID: "Stockholm", HI: "स्टॉकहोम", PT: "Estocolmo", AR: "ستوكهولم", RU: "Стокгольм",
    },
    description: {
      // [FIX] EN/JP were still in Chinese
      TW: "北歐設計感，散落在島嶼間的水上之都", EN: "Nordic design sensibility, a water capital scattered across islands", JP: "北欧のデザイン感覚、島々に散らばる水の都", KR: "북유럽 디자인 감각, 물의 수도에 있는 섬들 사이에 흩어져 있음", FR: "Le sens du design nordique, dispersé parmi les îles de la capitale de l'eau", ES: "Sentido del diseño nórdico, repartido entre las islas de la capital del agua.", ID: "Selera desain Nordik, tersebar di antara pulau-pulau di ibu kota perairan", HI: "नॉर्डिक डिजाइन भावना, जल राजधानी में द्वीपों के बीच बिखरी हुई", PT: "Sentido de design nórdico, espalhado pelas ilhas da capital da água", AR: "إحساس بالتصميم الاسكندنافي، منتشر بين الجزر في العاصمة المائية", RU: "Скандинавский дизайн, разбросанный по островам водной столицы",
    },
    top_food: {
      // [FIX] EN/JP were still in Chinese
      TW: "瑞典肉丸、鯡魚", EN: "Swedish meatballs, herring", JP: "スウェーデンのミートボール、ニシン", KR: "스웨덴 미트볼, 청어", FR: "Boulettes de viande suédoises, hareng", ES: "Albóndigas suecas, arenque", ID: "Bakso Swedia, ikan haring", HI: "स्वीडिश मीटबॉल, हेरिंग", PT: "Almôndegas suecas, arenque", AR: "كرات اللحم السويدية والرنجة", RU: "Шведские фрикадельки, сельдь",
    },
    must_visit_spot: {
      // [FIX] EN/JP were still in Chinese
      TW: "斯德哥爾摩老城 (Gamla Stan)", EN: "Stockholm Old Town (Gamla Stan)", JP: "ストックホルム旧市街（ガムラ・スタン）", KR: "스톡홀름 구시가지(감라스탄)", FR: "Vieille ville de Stockholm (Gamla Stan)", ES: "Casco antiguo de Estocolmo (Gamla Stan)", ID: "Kota Tua Stockholm (Gamla Stan)", HI: "स्टॉकहोम ओल्ड टाउन (गामला स्टेन)", PT: "Cidade Velha de Estocolmo (Gamla Stan)", AR: "مدينة ستوكهولم القديمة (جاملا ستان)", RU: "Старый город Стокгольма (Гамла Стан)",
    },
    recommendedDays: 3
  },
  "哥本哈根": {
    name: {
      // [FIX] EN: "copenhagen" → "Copenhagen"
      TW: "哥本哈根", EN: "Copenhagen", JP: "コペンハーゲン", KR: "코펜하겐", FR: "Copenhague", ES: "Copenhague", ID: "Kopenhagen", HI: "कोपेनहेगन", PT: "Copenhague", AR: "كوبنهاغن", RU: "Копенгаген",
    },
    description: {
      // [FIX] "Newport" → "Nyhavn" across all languages
      TW: "最幸福的城市，單車友善與新港彩色屋", EN: "The happiest city, bike-friendly with colorful houses in Nyhavn", JP: "最も幸せな街、自転車に優しく、ニューハウンのカラフルな家々", KR: "가장 행복한 도시, 자전거 친화적이고 뉘하운의 색색 가옥들", FR: "La ville la plus heureuse, conviviale pour les vélos et les maisons colorées de Nyhavn", ES: "La ciudad más feliz, apta para bicicletas y casas coloridas en Nyhavn", ID: "Kota paling bahagia, ramah sepeda dan rumah-rumah berwarna di Nyhavn", HI: "सबसे खुशहाल शहर, साइकिल-अनुकूल और न्यूहेवन में रंगीन घर", PT: "A cidade mais feliz, amigável para bicicletas e casas coloridas em Nyhavn", AR: "أسعد مدينة وصديقة للدراجات ومنازل ملونة في نيهافن", RU: "Самый счастливый город, велосипедный и красочные дома в Найхавне",
    },
    top_food: {
      TW: "開放式三明治 (Smørrebrød)", EN: "Open Sandwich (Smørrebrød)", JP: "オープンサンドイッチ（スモーブロー）", KR: "오픈 샌드위치 (Smørrebrød)", FR: "Sandwich ouvert (Smørrebrød)", ES: "Sándwich Abierto (Smørrebrød)", ID: "Sandwich Terbuka (Smørrebrød)", HI: "ओपन सैंडविच (स्मोरेब्रोड)", PT: "Sanduíche Aberto (Smørrebrød)", AR: "ساندويتش مفتوح (Smørrebrød)", RU: "Открытый сэндвич (Смёрребрёд)",
    },
    must_visit_spot: {
      TW: "小美人魚像、蒂沃利花園", EN: "The Little Mermaid, Tivoli Gardens", JP: "リトル・マーメイド、チボリ公園", KR: "인어공주, 티볼리 정원", FR: "La Petite Sirène, Jardins de Tivoli", ES: "La Sirenita, Jardines de Tívoli", ID: "Putri Duyung Kecil, Taman Tivoli", HI: "द लिटिल मरमेड, टिवोली गार्डन", PT: "A Pequena Sereia, Jardins Tivoli", AR: "ذا ليتل ميرميد، حدائق تيفولي", RU: "Русалочка, сады Тиволи",
    },
    recommendedDays: 3
  },
  "慕尼黑": {
    name: {
      TW: "慕尼黑", EN: "Munich", JP: "ミュンヘン", KR: "뮌헨", FR: "Munich", ES: "Múnich", ID: "Munich", HI: "म्यूनिख", PT: "Munique", AR: "ميونيخ", RU: "Мюнхен",
    },
    description: {
      TW: "巴伐利亞傳統，啤酒節的狂歡與汽車工業", EN: "Bavarian tradition, Oktoberfest carnival and the automotive industry", JP: "バイエルンの伝統、オクトーバーフェスト カーニバル、自動車産業", KR: "바이에른 전통, 옥토버페스트 카니발 및 자동차 산업", FR: "Tradition bavaroise, carnaval de l'Oktoberfest et industrie automobile", ES: "Tradición bávara, carnaval Oktoberfest y industria automovilística", ID: "Tradisi Bavaria, karnaval Oktoberfest dan industri otomotif", HI: "बवेरियन परंपरा, ओकट्रैफेस्ट कार्निवल और ऑटोमोटिव उद्योग", PT: "Tradição bávara, carnaval da Oktoberfest e indústria automotiva", AR: "التقاليد البافارية وكرنفال مهرجان أكتوبر وصناعة السيارات", RU: "Баварские традиции, карнавал Октоберфест и автомобильная промышленность",
    },
    top_food: {
      // [FIX] EN: "German pig trotters, Munich black and white sausage" → "German pork knuckle, Munich white sausage"
      TW: "德國豬腳、慕尼黑白香腸", EN: "German pork knuckle, Munich white sausage (Weißwurst)", JP: "ドイツのポークナックル、ミュンヘンの白ソーセージ（ヴァイスヴルスト）", KR: "독일 족발, 뮌헨 흰 소시지(바이스부르스트)", FR: "Jambonneau allemand, saucisse blanche de Munich (Weißwurst)", ES: "Codillo alemán, salchicha blanca de Múnich (Weißwurst)", ID: "Paha babi Jerman, sosis putih Munich (Weißwurst)", HI: "जर्मन पोर्क नकल, म्यूनिख सफेद सॉसेज (वाइसवुर्स्ट)", PT: "Joelho de porco alemão, salsicha branca de Munique (Weißwurst)", AR: "كنافة الخنزير الألمانية، سجق ميونيخ الأبيض (فايسفورست)", RU: "Немецкая свиная рулька, мюнхенская белая колбаса (вайсвурст)",
    },
    must_visit_spot: {
      TW: "瑪利亞廣場、寶馬博物館", EN: "Marienplatz, BMW Museum", JP: "マリエン広場、BMW 博物館", KR: "마리엔 광장, BMW 박물관", FR: "Marienplatz, musée BMW", ES: "Marienplatz, Museo BMW", ID: "Marienplatz, Museum BMW", HI: "मैरिएनप्लात्ज़, बीएमडब्ल्यू संग्रहालय", PT: "Marienplatz, Museu da BMW", AR: "مارينبلاتز، متحف بي إم دبليو", RU: "Мариенплац, Музей BMW",
    },
    recommendedDays: 3
  },
  "布魯塞爾": {
    name: {
      // [FIX] EN: "brussels" → "Brussels"; ID: "brussel" → "Brussels"
      TW: "布魯塞爾", EN: "Brussels", JP: "ブリュッセル", KR: "브뤼셀", FR: "Bruxelles", ES: "Bruselas", ID: "Brussels", HI: "ब्रसेल्स", PT: "Bruxelas", AR: "بروكسل", RU: "Брюссель",
    },
    description: {
      TW: "歐洲心臟，漫畫文化與朱古力的香氣", EN: "Heart of Europe, comic culture and the aroma of chocolate", JP: "ヨーロッパの中心、コミック文化、そしてチョコレートの香り", KR: "유럽의 심장, 만화문화와 초콜릿의 향기", FR: "Cœur de l'Europe, culture de la bande dessinée et arôme du chocolat", ES: "Corazón de Europa, cultura del cómic y aroma a chocolate.", ID: "Jantung Eropa, budaya komik dan aroma coklat", HI: "यूरोप का दिल, हास्य संस्कृति और चॉकलेट की सुगंध", PT: "Coração da Europa, cultura cômica e aroma de chocolate", AR: "قلب أوروبا والثقافة الكوميدية ورائحة الشوكولاتة", RU: "Сердце Европы, комическая культура и аромат шоколада",
    },
    top_food: {
      TW: "比利時窩夫、青口配薯條", EN: "Belgian waffles, mussels and French fries", JP: "ベルギーワッフル、ムール貝、フライドポテト", KR: "벨기에 와플, 홍합, 감자 튀김", FR: "Gaufres belges, moules et frites", ES: "Gofres belgas, mejillones y patatas fritas", ID: "Wafel Belgia, kerang, dan kentang goreng", HI: "बेल्जियन वफ़ल, मसल्स और फ़्रेंच फ्राइज़", PT: "Waffles belgas, mexilhões e batatas fritas", AR: "الفطائر البلجيكية، بلح البحر والبطاطا المقلية", RU: "Бельгийские вафли, мидии и картофель фри",
    },
    must_visit_spot: {
      TW: "大廣場、原子球塔", EN: "Grand Place, Atomium", JP: "グランプラス、アトミウム", KR: "그랑플라스, 아토미움", FR: "Grand-Place, Atomium", ES: "Grand Place, Atomium", ID: "Grand Place, Atomium", HI: "ग्रैंड प्लेस, एटमियम", PT: "Grand-Place, Atomium", AR: "جراند بلاس، أتوميوم", RU: "Гран-Плас, Атомиум",
    },
    recommendedDays: 3
  },
  "蘇黎世": {
    name: {
      // [FIX] EN: "zurich" → "Zurich"; FR: "zurich" → "Zurich"; ID: "zürich" → "Zürich"
      TW: "蘇黎世", EN: "Zurich", JP: "チューリッヒ", KR: "취리히", FR: "Zurich", ES: "Zúrich", ID: "Zürich", HI: "ज़्यूरिख", PT: "Zurique", AR: "زيوريخ", RU: "Цюрих",
    },
    description: {
      TW: "湖光山色與金融帝國的結合", EN: "The combination of beautiful lakes and mountains and financial empire", JP: "美しい湖と山と金融帝国の組み合わせ", KR: "아름다운 호수와 산, 그리고 금융제국의 결합", FR: "La combinaison de magnifiques lacs et montagnes et d'un empire financier", ES: "La combinación de hermosos lagos y montañas y un imperio financiero.", ID: "Kombinasi danau dan pegunungan yang indah serta kerajaan finansial", HI: "खूबसूरत झीलों और पहाड़ों और वित्तीय साम्राज्य का संयोजन", PT: "A combinação de belos lagos e montanhas e império financeiro", AR: "مزيج من البحيرات والجبال الجميلة والإمبراطورية المالية", RU: "Сочетание прекрасных озер, гор и финансовой империи.",
    },
    top_food: {
      TW: "起司火鍋、蘇黎世小牛肉", EN: "Cheese fondue, Zürcher Geschnetzeltes (veal)", JP: "チーズフォンデュ、チューリッヒ風子牛肉", KR: "치즈 퐁듀, 취리히식 송아지 고기", FR: "Fondue au fromage, émincé de veau zurichois", ES: "Fondue de queso, ternera estilo Zúrich", ID: "Fondue keju, daging sapi muda gaya Zurich", HI: "पनीर फोंड्यू, ज़्यूरिख शैली में वील", PT: "Fondue de queijo, vitela à maneira de Zurique", AR: "فوندو الجبن، لحم العجل على طريقة زيورخ", RU: "Сырное фондю, цюрихская телятина",
    },
    must_visit_spot: {
      TW: "班霍夫大街、蘇黎世湖", EN: "Bahnhofstrasse, Lake Zurich", JP: "バーンホフシュトラーセ、チューリッヒ湖", KR: "반호프스트라세, 취리히 호수", FR: "Bahnhofstrasse, lac de Zurich", ES: "Bahnhofstrasse, Lago de Zúrich", ID: "Bahnhofstrasse, Danau Zurich", HI: "बहन्होफ़स्ट्रैस, ज्यूरिख झील", PT: "Bahnhofstrasse, Lago Zurique", AR: "شارع بانهوف شتراسه، بحيرة زيورخ", RU: "Банхофштрассе, Цюрихское озеро",
    },
    recommendedDays: 3
  },
  "多倫多": {
    name: {
      // [FIX] EN: "toronto" → "Toronto"; ID: "toronto" → "Toronto"
      TW: "多倫多", EN: "Toronto", JP: "トロント", KR: "토론토", FR: "Toronto", ES: "Toronto", ID: "Toronto", HI: "टोरंटो", PT: "Toronto", AR: "تورنتو", RU: "Торонто",
    },
    description: {
      TW: "極致多元文化，乾淨現代的北美大都市", EN: "An extremely multicultural, clean and modern North American metropolis", JP: "非常に多文化で、清潔でモダンな北米の大都市", KR: "매우 다문화적이고 깨끗하며 현대적인 북미 대도시", FR: "Une métropole nord-américaine extrêmement multiculturelle, propre et moderne", ES: "Una metrópoli norteamericana extremadamente multicultural, limpia y moderna", ID: "Kota metropolitan Amerika Utara yang sangat multikultural, bersih, dan modern", HI: "एक अत्यंत बहुसांस्कृतिक, स्वच्छ और आधुनिक उत्तरी अमेरिकी महानगर", PT: "Uma metrópole norte-americana extremamente multicultural, limpa e moderna", AR: "مدينة متعددة الثقافات ونظيفة وحديثة في أمريكا الشمالية", RU: "Чрезвычайно мультикультурный, чистый и современный мегаполис Северной Америки.",
    },
    top_food: {
      TW: "肉汁芝士薯條 (Poutine)", EN: "Poutine", JP: "プーティン", KR: "푸틴", FR: "Poutine", ES: "Poutine", ID: "Poutine", HI: "Poutine", PT: "Poutine", AR: "بوتين", RU: "Путин",
    },
    must_visit_spot: {
      TW: "CN塔、聖勞倫斯市場", EN: "CN Tower, St. Lawrence Market", JP: "CNタワー、セントローレンスマーケット", KR: "CN 타워, 세인트 로렌스 마켓", FR: "Tour CN, Marché Saint-Laurent", ES: "Torre CN, Mercado de San Lorenzo", ID: "Menara CN, Pasar St.Lawrence", HI: "सीएन टावर, सेंट लॉरेंस मार्केट", PT: "Torre CN, Mercado de São Lourenço", AR: "برج CN، سوق سانت لورانس", RU: "Си-Эн Тауэр, Рынок Святого Лаврентия",
    },
    recommendedDays: 3
  },
  "洛杉磯": {
    name: {
      TW: "洛杉磯", EN: "Los Angeles", JP: "ロサンゼルス", KR: "로스앤젤레스", FR: "Los Angeles", ES: "Los Ángeles", ID: "Los Angeles", HI: "लॉस एंजिल्स", PT: "Los Angeles", AR: "لوس أنجلوس", RU: "Лос-Анджелес",
    },
    description: {
      TW: "電影夢工廠，棕櫚樹與星光大道", EN: "Movie dreamland, palm trees and the Walk of Fame", JP: "映画の夢の地、ヤシの木、ウォーク・オブ・フェーム", KR: "영화 드림랜드, 야자수 및 명예의 거리", FR: "Pays de rêve du cinéma, palmiers et Walk of Fame", ES: "Tierra de sueños del cine, palmeras y Paseo de la Fama", ID: "Negeri impian perfilman, pohon palem, dan Walk of Fame", HI: "मूवी ड्रीमलैंड, पाम ट्रीज़ और वॉक ऑफ़ फ़ेम", PT: "Terra dos sonhos do cinema, palmeiras e Calçada da Fama", AR: "أرض أحلام السينما وأشجار النخيل وممشى المشاهير", RU: "Мир кинематографических грёз, пальмы и Аллея славы",
    },
    top_food: {
      TW: "美式漢堡、墨西哥塔可", EN: "American burgers, Mexican tacos", JP: "アメリカンバーガー、メキシカンタコス", KR: "미국식 버거, 멕시칸 타코", FR: "Burgers américains, tacos mexicains", ES: "Hamburguesas americanas, tacos mexicanos.", ID: "Burger Amerika, taco Meksiko", HI: "अमेरिकी बर्गर, मैक्सिकन टैकोस", PT: "Hambúrgueres americanos, tacos mexicanos", AR: "البرجر الأمريكي، التاكو المكسيكي", RU: "Американские гамбургеры, мексиканские тако",
    },
    must_visit_spot: {
      TW: "好萊塢標誌、聖莫尼卡海灘", EN: "Hollywood sign, Santa Monica beach", JP: "ハリウッドサイン、サンタモニカビーチ", KR: "할리우드 사인, 산타모니카 해변", FR: "Panneau Hollywood, plage de Santa Monica", ES: "Cartel de Hollywood, playa de Santa Mónica", ID: "Tanda Hollywood, pantai Santa Monica", HI: "हॉलीवुड साइन, सांता मोनिका बीच", PT: "Letreiro de Hollywood, praia de Santa Mônica", AR: "علامة هوليوود، شاطئ سانتا مونيكا", RU: "Знак Голливуда, пляж Санта-Моники",
    },
    recommendedDays: 3
  },
  "三藩市": {
    name: {
      // [FIX] EN: "san francisco" → "San Francisco"; ES: "san francisco" → "San Francisco"
      TW: "三藩市", EN: "San Francisco", JP: "サンフランシスコ", KR: "샌프란시스코", FR: "San Francisco", ES: "San Francisco", ID: "San Francisco", HI: "सैन फ्रांसिस्को", PT: "São Francisco", AR: "سان فرانسيسكو", RU: "Сан-Франциско",
    },
    description: {
      TW: "霧鎖金門，陡峭街道與科技矽谷", EN: "Fog-locked Golden Gate, steep streets and technological Silicon Valley", JP: "霧に閉ざされたゴールデン ゲート、険しい通り、テクノロジーのシリコン バレー", KR: "안개로 뒤덮인 골든 게이트, 가파른 거리, 첨단 기술의 실리콘 밸리", FR: "Golden Gate brumeux, rues escarpées et Silicon Valley technologique", ES: "Golden Gate bloqueado por la niebla, calles empinadas y Silicon Valley tecnológico", ID: "Golden Gate yang tertutup kabut, jalanan curam, dan Silicon Valley yang berteknologi", HI: "कोहरे से घिरा गोल्डन गेट, खड़ी सड़कें और तकनीकी सिलिकॉन वैली", PT: "Golden Gate coberta de neblina, ruas íngremes e o tecnológico Vale do Silício", AR: "البوابة الذهبية المغلقة بالضباب والشوارع شديدة الانحدار ووادي السيليكون التكنولوجي", RU: "Закрытые туманом Золотые ворота, крутые улицы и технологичная Силиконовая долина",
    },
    top_food: {
      TW: "酸麵包海鮮濃湯", EN: "Sourdough Seafood Chowder", JP: "サワー種シーフードチャウダー", KR: "사워도우 해산물 차우더", FR: "Chaudrée de fruits de mer au levain", ES: "Sopa de mariscos con masa madre", ID: "Sup Makanan Laut Penghuni Pertama", HI: "खट्टा समुद्री भोजन चावडर", PT: "Sopa de frutos do mar com massa fermentada", AR: "حساء المأكولات البحرية بالعجين المخمر", RU: "Суп из морепродуктов на закваске",
    },
    must_visit_spot: {
      TW: "金門大橋、漁人碼頭", EN: "Golden Gate Bridge, Fisherman's Wharf", JP: "ゴールデンゲートブリッジ、フィッシャーマンズワーフ", KR: "금문교, 피셔맨스 워프", FR: "Golden Gate Bridge, Fisherman's Wharf", ES: "Puente Golden Gate, Muelle de los Pescadores", ID: "Jembatan Golden Gate, Dermaga Nelayan", HI: "गोल्डन गेट ब्रिज, मछुआरे का घाट", PT: "Ponte Golden Gate, Fisherman's Wharf", AR: "جسر البوابة الذهبية، رصيف الصيادين", RU: "Мост Золотые Ворота, Рыбацкая пристань",
    },
    recommendedDays: 3
  },
  "里約熱內盧": {
    name: {
      // [FIX] EN: "rio de janeiro" → "Rio de Janeiro"; ES: "río de janeiro" → "Río de Janeiro"; PT: "rio de janeiro" → "Rio de Janeiro"
      TW: "里約熱內盧", EN: "Rio de Janeiro", JP: "リオデジャネイロ", KR: "리우데자네이루", FR: "Rio de Janeiro", ES: "Río de Janeiro", ID: "Rio de Janeiro", HI: "रियो डी जनेरियो", PT: "Rio de Janeiro", AR: "ريو دي جانيرو", RU: "Рио-де-Жанейро",
    },
    description: {
      TW: "南美狂熱，熱情桑巴與絕美沙灘", EN: "South American passion, vibrant samba and stunning beaches", JP: "南米の情熱、活気あるサンバと美しいビーチ", KR: "남미의 열정, 활기찬 삼바와 아름다운 해변", FR: "Passion sud-américaine, samba vibrante et belles plages", ES: "Pasión sudamericana, samba vibrante y playas hermosas", ID: "Semangat Amerika Selatan, samba yang penuh semangat, dan pantai indah", HI: "दक्षिण अमेरिकी जुनून, जीवंत सांबा और शानदार समुद्र तट", PT: "Paixão sul-americana, samba vibrante e praias deslumbrantes", AR: "الشغف الأمريكي الجنوبي والسامبا النابض بالحياة والشواطئ الرائعة", RU: "Страсть Южной Америки, зажигательная самба и потрясающие пляжи",
    },
    top_food: {
      TW: "巴西烤肉 (Churrasco)", EN: "Churrasco", JP: "シュラスコ", KR: "슈하스코", FR: "Churrasco", ES: "Churrasco", ID: "Churasco", HI: "चुरैस्को", PT: "Churrasco", AR: "تشوراسكو", RU: "Чурраско",
    },
    must_visit_spot: {
      TW: "救世基督像、科帕卡巴納海灘", EN: "Christ the Redeemer Statue, Copacabana Beach", JP: "コルコバードのキリスト像、コパカバーナビーチ", KR: "그리스도 구속자 동상, 코파카바나 해변", FR: "Statue du Christ Rédempteur, plage de Copacabana", ES: "Estatua del Cristo Redentor, Playa de Copacabana", ID: "Patung Kristus Penebus, Pantai Copacabana", HI: "क्राइस्ट द रिडीमर प्रतिमा, कोपाकबाना बीच", PT: "Estátua do Cristo Redentor, Praia de Copacabana", AR: "تمثال المسيح الفادي، شاطئ كوباكابانا", RU: "Статуя Христа-Искупителя, пляж Копакабана",
    },
    recommendedDays: 3
  },
  "布宜諾斯艾利斯": {
    name: {
      // [FIX] EN: "buenos aires" → "Buenos Aires"; ES: "buenos aires" → "Buenos Aires"
      TW: "布宜諾斯艾利斯", EN: "Buenos Aires", JP: "ブエノスアイレス", KR: "부에노스아이레스", FR: "Buenos Aires", ES: "Buenos Aires", ID: "Buenos Aires", HI: "ब्यूनस आयर्स", PT: "Buenos Aires", AR: "بوينس آيرس", RU: "Буэнос-Айрес",
    },
    description: {
      TW: "南美巴黎，探戈舞動的優雅與激情", EN: "The Paris of South America, the elegance and passion of tango dancing", JP: "南米のパリ、タンゴダンスの優雅さと情熱", KR: "남미 파리, 탱고댄스의 우아함과 열정", FR: "Le Paris d'Amérique du Sud, l'élégance et la passion du tango", ES: "El París de Sudamérica, la elegancia y la pasión del baile de tango.", ID: "Paris Amerika Selatan, keanggunan dan semangat menari tango", HI: "दक्षिण अमेरिका का पेरिस, टैंगो नृत्य की भव्यता और जुनून", PT: "A Paris da América do Sul, a elegância e a paixão da dança do tango", AR: "باريس أمريكا الجنوبية، أناقة وشغف رقص التانغو", RU: "Париж Южной Америки, элегантность и страсть танго.",
    },
    top_food: {
      TW: "阿根廷牛排、焦糖牛奶醬", EN: "Argentinian steak, dulce de leche", JP: "アルゼンチンステーキ、ドゥルセ・デ・レチェ", KR: "아르헨티나 스테이크, 둘세 데 레체", FR: "Steak argentin, dulce de leche", ES: "Filete argentino, dulce de leche", ID: "Steak Argentina, dulce de leche", HI: "अर्जेंटीनी स्टेक, डल्से डे लेचे", PT: "Bife argentino, doce de leite", AR: "شريحة لحم أرجنتينية، دولسي دي ليتشي", RU: "Аргентинский стейк, дульсе де лече",
    },
    must_visit_spot: {
      TW: "五月廣場、博卡區", EN: "Plaza de Mayo, La Boca district", JP: "五月広場、ラ・ボカ地区", KR: "5월 광장, 라 보카 지구", FR: "Place de Mai, quartier de La Boca", ES: "Plaza de Mayo, barrio de La Boca", ID: "Plaza de Mayo, Distrik La Boca", HI: "प्लाजा डे मेयो, ला बोका जिला", PT: "Praça de Maio, bairro La Boca", AR: "بلازا دي مايو، حي لا بوكا", RU: "Пласа-де-Майо, район Ла-Бока",
    },
    recommendedDays: 3
  },
  "墨爾本": {
    name: {
      TW: "墨爾本", EN: "Melbourne", JP: "メルボルン", KR: "멜버른", FR: "Melbourne", ES: "Melbourne", ID: "Melbourne", HI: "मेलबोर्न", PT: "Melbourne", AR: "ملبورن", RU: "Мельбурн",
    },
    description: {
      TW: "澳洲咖啡之都，巷弄塗鴉與藝術氛圍", EN: "Australia's coffee capital, alley graffiti and artistic atmosphere", JP: "オーストラリアのコーヒーの首都、路地の落書きと芸術的な雰囲気", KR: "호주 커피의 수도, 골목 그래피티와 예술적인 분위기", FR: "Capitale australienne du café, graffitis dans les ruelles et ambiance artistique", ES: "La capital del café de Australia, graffitis en los callejones y atmósfera artística", ID: "Ibu kota kopi Australia, grafiti gang, dan suasana artistik", HI: "ऑस्ट्रेलिया की कॉफ़ी राजधानी, गली-गली भित्तिचित्र और कलात्मक वातावरण", PT: "Capital do café da Austrália, grafites em becos e atmosfera artística", AR: "عاصمة القهوة في أستراليا، الكتابة على الجدران في الأزقة والأجواء الفنية", RU: "Кофейная столица Австралии, граффити на аллеях и художественная атмосфера",
    },
    top_food: {
      TW: "精品手沖咖啡、澳式早午餐", EN: "Premium hand-brewed coffee, Australian brunch", JP: "プレミアム手淹れコーヒー、オーストラリアンブランチ", KR: "프리미엄 핸드브루 커피, 호주식 브런치", FR: "Café haut de gamme infusé à la main, brunch australien", ES: "Café premium hecho a mano, brunch australiano", ID: "Kopi premium buatan tangan, brunch Australia", HI: "प्रीमियम हाथ से बनी कॉफ़ी, ऑस्ट्रेलियाई ब्रंच", PT: "Café premium feito à mão, brunch australiano", AR: "قهوة فاخرة مصنوعة يدويًا، وجبة فطور وغداء أسترالية", RU: "Премиальный кофе ручной сварки, австралийский бранч",
    },
    must_visit_spot: {
      TW: "聯邦廣場、大洋路", EN: "Federation Square, Great Ocean Road", JP: "フェデレーション スクエア、グレート オーシャン ロード", KR: "페더레이션 광장, 그레이트 오션 로드", FR: "Place de la Fédération, Great Ocean Road", ES: "Plaza de la Federación, Great Ocean Road", ID: "Lapangan Federasi, Great Ocean Road", HI: "फेडरेशन स्क्वायर, ग्रेट ओशन रोड", PT: "Praça da Federação, Great Ocean Road", AR: "ساحة الاتحاد، طريق المحيط العظيم", RU: "Площадь Федерации, Великая океанская дорога",
    },
    recommendedDays: 3
  },
  "奧克蘭": {
    name: {
      // [FIX] ES: "auckland" → "Auckland"
      TW: "奧克蘭", EN: "Auckland", JP: "オークランド", KR: "오클랜드", FR: "Auckland", ES: "Auckland", ID: "Auckland", HI: "ऑकलैंड", PT: "Auckland", AR: "أوكلاند", RU: "Окленд",
    },
    description: {
      TW: "帆船之都，火山地形與毛利文化", EN: "The City of Sailing, volcanic terrain and Maori culture", JP: "セーリング、火山地形、マオリ文化の街", KR: "항해의 도시, 화산 지형, 마오리 문화", FR: "La ville de la voile, du terrain volcanique et de la culture maorie", ES: "La ciudad de la navegación, el terreno volcánico y la cultura maorí", ID: "Kota Pelayaran, Medan Vulkanik, dan Budaya Maori", HI: "नौकायन, ज्वालामुखीय भूभाग और माओरी संस्कृति का शहर", PT: "A cidade da vela, do terreno vulcânico e da cultura Maori", AR: "مدينة الإبحار والتضاريس البركانية وثقافة الماوري", RU: "Город парусного спорта, вулканической местности и культуры маори",
    },
    top_food: {
      TW: "綠唇貽貝、毛利傳統窯烤 (Hangi)", EN: "Green lipped mussels, Maori traditional hangi", JP: "緑イ貝、マオリの伝統的なハンギ", KR: "초록입 홍합, 마오리 전통 항이", FR: "Moules aux lèvres vertes, hangi traditionnel maori", ES: "Mejillones de labios verdes, hangi tradicional maorí", ID: "Kerang berbibir hijau, hangi tradisional Maori", HI: "ग्रीन लिप्ड मसल्स, माओरी पारंपरिक हैंगी", PT: "Mexilhões de lábios verdes, hangi tradicional Maori", AR: "بلح البحر الأخضر، هانجي الماوري التقليدي", RU: "Зеленогубые мидии, традиционный ханги маори",
    },
    must_visit_spot: {
      TW: "天空塔、伊甸山", EN: "Sky Tower, Mount Eden", JP: "スカイタワー、マウントイーデン", KR: "스카이 타워, 에덴 산", FR: "Sky Tower, Mont Éden", ES: "Sky Tower, Monte Edén", ID: "Menara Langit, Gunung Eden", HI: "स्काई टावर, माउंट ईडन", PT: "Torre do Céu, Monte Éden", AR: "برج السماء، جبل عدن", RU: "Небесная башня, гора Эдем",
    },
    recommendedDays: 3
  },
  "開普敦": {
    name: {
      // [FIX] EN: "cape town" → "Cape Town"; ES: "ciudad del cabo" → "Ciudad del Cabo"; ID: "kota tanjung" → "Cape Town"; HI/PT/AR/RU were all Chinese
      TW: "開普敦", EN: "Cape Town", JP: "ケープタウン", KR: "케이프 타운", FR: "Le Cap", ES: "Ciudad del Cabo", ID: "Cape Town", HI: "केप टाउन", PT: "Cidade do Cabo", AR: "كيب تاون", RU: "Кейптаун",
    },
    description: {
      // [FIX] HI/PT/AR/RU were all Chinese
      TW: "非洲之巔，山海交匯的壯闊景觀", EN: "The top of Africa, the magnificent landscape where mountains and sea meet", JP: "アフリカの頂上、山と海が出会う雄大な風景", KR: "아프리카의 정상, 산과 바다가 만나는 웅장한 풍경", FR: "Le sommet de l'Afrique, le magnifique paysage où se rencontrent montagnes et mer", ES: "La cima de África, el magnífico paisaje donde se encuentran las montañas y el mar", ID: "Puncak Afrika, pemandangan indah tempat bertemunya gunung dan laut", HI: "अफ्रीका का शिखर, पहाड़ों और समुद्र के मिलने का शानदार दृश्य", PT: "O topo da África, a paisagem magnífica onde montanhas e mar se encontram", AR: "قمة أفريقيا، المشهد الرائع حيث تلتقي الجبال بالبحر", RU: "Вершина Африки, великолепный пейзаж, где горы встречаются с морем",
    },
    top_food: {
      // [FIX] HI/PT/AR/RU were all Chinese
      TW: "南非乾肉 (Biltong)、野生動物餐", EN: "South African dried meat (Biltong), wildlife meal", JP: "南アフリカの乾燥肉（ビルトン）、野生動物の食事", KR: "남아프리카 말린 고기(빌통), 야생동물 식사", FR: "Viande séchée sud-africaine (Biltong), repas de gibier", ES: "Carne seca sudafricana (Biltong), comida de caza", ID: "Daging kering Afrika Selatan (Biltong), makanan satwa liar", HI: "दक्षिण अफ्रीकी सूखा मांस (बिल्टोंग), वन्य जीव भोजन", PT: "Carne seca sul-africana (Biltong), refeição de caça", AR: "اللحوم المجففة جنوب أفريقية (بيلتونج)، وجبة الحياة البرية", RU: "Южноафриканское вяленое мясо (билтонг), блюда из дичи",
    },
    must_visit_spot: {
      // [FIX] HI/PT/AR/RU were all Chinese
      TW: "桌山、好望角", EN: "Table Mountain, Cape of Good Hope", JP: "テーブルマウンテン、喜望峰", KR: "테이블마운틴, 희망봉", FR: "Montagne de la Table, Cap de Bonne-Espérance", ES: "Montaña de la Mesa, Cabo de Buena Esperanza", ID: "Table Mountain, Tanjung Harapan", HI: "टेबल माउंटेन, केप ऑफ गुड होप", PT: "Montanha da Mesa, Cabo da Boa Esperança", AR: "جبل المائدة، رأس الرجاء الصالح", RU: "Столовая гора, мыс Доброй Надежды",
    },
    recommendedDays: 3
  },
  "馬拉喀什": {
    name: {
      // [FIX] All languages were Chinese
      TW: "馬拉喀什", EN: "Marrakesh", JP: "マラケシュ", KR: "마라케시", FR: "Marrakech", ES: "Marrakech", ID: "Marrakesh", HI: "माराकेश", PT: "Marraquexe", AR: "مراكش", RU: "Марракеш",
    },
    description: {
      // [FIX] All languages were Chinese
      TW: "北非色彩，迷宮般的古城與異域香料", EN: "North African colors, a maze-like ancient city and exotic spices", JP: "北アフリカの色彩、迷宮のような古都と異国のスパイス", KR: "북아프리카의 색채, 미로 같은 고대 도시와 이국적인 향신료", FR: "Couleurs nord-africaines, vieille ville labyrinthique et épices exotiques", ES: "Colores norteafricanos, antigua ciudad laberíntica y especias exóticas", ID: "Warna Afrika Utara, kota tua seperti labirin, dan rempah-rempah eksotis", HI: "उत्तरी अफ्रीकी रंग, भूलभुलैया जैसा प्राचीन शहर और विदेशी मसाले", PT: "Cores norte-africanas, cidade antiga labiríntica e especiarias exóticas", AR: "ألوان شمال أفريقيا، المدينة القديمة المتاهية والتوابل الغريبة", RU: "Краски Северной Африки, лабиринтообразный древний город и экзотические специи",
    },
    top_food: {
      // [FIX] All languages were Chinese
      TW: "塔吉鍋、庫斯庫斯", EN: "Tagine, couscous", JP: "タジン鍋、クスクス", KR: "타진, 쿠스쿠스", FR: "Tajine, couscous", ES: "Tajín, cuscús", ID: "Tagine, couscous", HI: "तजीन, कूसकूस", PT: "Tajine, cuscuz", AR: "طاجين، كسكس", RU: "Тажин, кускус",
    },
    must_visit_spot: {
      // [FIX] All languages were Chinese
      TW: "德吉瑪廣場、巴伊亞皇宮", EN: "Djemaa el-Fna Square, Bahia Palace", JP: "ジャマ・エル・フナ広場、バヒア宮殿", KR: "제마 엘 프나 광장, 바히아 궁전", FR: "Place Djemaa el-Fna, Palais Bahia", ES: "Plaza Djemaa el-Fna, Palacio Bahia", ID: "Alun-alun Djemaa el-Fna, Istana Bahia", HI: "जेमा एल-फना चौक, बहिया पैलेस", PT: "Praça Djemaa el-Fna, Palácio Bahia", AR: "ساحة جامع الفنا، قصر الباهية", RU: "Площадь Джемаа-эль-Фна, дворец Бахия",
    },
    recommendedDays: 3
  },
  "開羅": {
    name: {
      // [FIX] All languages were Chinese
      TW: "開羅", EN: "Cairo", JP: "カイロ", KR: "카이로", FR: "Le Caire", ES: "El Cairo", ID: "Kairo", HI: "काहिरा", PT: "Cairo", AR: "القاهرة", RU: "Каир",
    },
    description: {
      // [FIX] All languages were Chinese
      TW: "古文明奇蹟，尼羅河畔的千年史詩", EN: "Ancient civilization wonders, a thousand-year epic on the banks of the Nile", JP: "古代文明の驚異、ナイル川畔の千年の叙事詩", KR: "고대 문명의 경이, 나일강변의 천년 서사시", FR: "Merveilles de l'ancienne civilisation, une épopée millénaire sur les rives du Nil", ES: "Maravillas de la civilización antigua, una épica milenaria a orillas del Nilo", ID: "Keajaiban peradaban kuno, epik seribu tahun di tepi Sungai Nil", HI: "प्राचीन सभ्यता के चमत्कार, नील नदी के किनारे एक हज़ार साल की महागाथा", PT: "Maravilhas da civilização antiga, uma epopeia milenar às margens do Nilo", AR: "عجائب الحضارة القديمة، ملحمة ألف سنة على ضفاف النيل", RU: "Чудеса древней цивилизации, тысячелетняя эпопея на берегах Нила",
    },
    top_food: {
      // [FIX] All languages were Chinese
      TW: "埃及雜燴豆飯 (Koshary)", EN: "Egyptian mixed bean rice (Koshary)", JP: "エジプト混合豆ご飯（コシャリ）", KR: "이집트 혼합 콩밥 (코샤리)", FR: "Riz aux haricots mélangés égyptien (Koshary)", ES: "Arroz de judías mixtas egipcio (Koshary)", ID: "Nasi kacang campur Mesir (Koshary)", HI: "मिस्री मिश्रित बीन चावल (कोशारी)", PT: "Arroz de feijão misto egípcio (Koshary)", AR: "الأرز بالفاصوليا المصري (كشري)", RU: "Египетский рис с бобами (Кошари)",
    },
    must_visit_spot: {
      // [FIX] All languages were Chinese
      TW: "吉薩金字塔、埃及博物館", EN: "Giza Pyramids, Egyptian Museum", JP: "ギザのピラミッド、エジプト博物館", KR: "기자 피라미드, 이집트 박물관", FR: "Pyramides de Gizeh, Musée égyptien", ES: "Pirámides de Guiza, Museo Egipcio", ID: "Piramida Giza, Museum Mesir", HI: "गीज़ा के पिरामिड, मिस्र का संग्रहालय", PT: "Pirâmides de Gizé, Museu Egípcio", AR: "أهرامات الجيزة، المتحف المصري", RU: "Пирамиды Гизы, Египетский музей",
    },
    recommendedDays: 3
  },
  "札幌": {
    name: {
      // [FIX] All languages were Chinese
      TW: "札幌", EN: "Sapporo", JP: "札幌", KR: "삿포로", FR: "Sapporo", ES: "Sapporo", ID: "Sapporo", HI: "सप्पोरो", PT: "Sapporo", AR: "سابورو", RU: "Саппоро",
    },
    description: {
      // [FIX] All languages were Chinese
      TW: "雪祭之都，純淨自然與北國美食", EN: "Snow festival capital, pure nature and northern cuisine", JP: "雪まつりの都、純粋な自然と北の美食", KR: "눈축제의 도시, 순수한 자연과 북부 요리", FR: "Capitale du festival de neige, nature pure et cuisine nordique", ES: "Capital del festival de nieve, naturaleza pura y cocina del norte", ID: "Ibu kota festival salju, alam murni dan masakan utara", HI: "बर्फ उत्सव की राजधानी, शुद्ध प्रकृति और उत्तरी व्यंजन", PT: "Capital do festival de neve, natureza pura e culinária do norte", AR: "عاصمة مهرجان الثلج والطبيعة النقية والمطبخ الشمالي", RU: "Столица снежного фестиваля, чистая природа и северная кухня",
    },
    top_food: {
      // [FIX] All languages were Chinese
      TW: "味噌拉麵、成吉思汗烤羊肉", EN: "Miso ramen, Genghis Khan grilled lamb", JP: "味噌ラーメン、ジンギスカン", KR: "미소 라멘, 징기스칸 구운 양고기", FR: "Ramen miso, agneau grillé Genghis Khan", ES: "Ramen de miso, cordero asado Gengis Kan", ID: "Ramen miso, daging domba panggang Genghis Khan", HI: "मिसो रामेन, चंगेज खान ग्रिल्ड लैंब", PT: "Ramen de miso, cordeiro grelhado Genghis Khan", AR: "رامين ميسو، لحم الضأن المشوي جنكيز خان", RU: "Мисо-рамен, жареный ягнёнок по-Чингисхановски",
    },
    must_visit_spot: {
      // [FIX] All languages were Chinese
      TW: "大通公園、白色戀人公園", EN: "Odori Park, Shiroi Koibito Park", JP: "大通公園、白い恋人パーク", KR: "오도리 공원, 시로이 코이비토 파크", FR: "Parc Odori, Parc Shiroi Koibito", ES: "Parque Odori, Parque Shiroi Koibito", ID: "Taman Odori, Taman Shiroi Koibito", HI: "ओडोरी पार्क, शिरोई कोइबिटो पार्क", PT: "Parque Odori, Parque Shiroi Koibito", AR: "حديقة أودوري، حديقة شيروي كويبيتو", RU: "Парк Одори, парк Широи Коибито",
    },
    recommendedDays: 3
  },
  "福岡": {
    name: {
      // [FIX] All languages were Chinese
      TW: "福岡", EN: "Fukuoka", JP: "福岡", KR: "후쿠오카", FR: "Fukuoka", ES: "Fukuoka", ID: "Fukuoka", HI: "फुकुओका", PT: "Fukuoka", AR: "فوكوكا", RU: "Фукуока",
    },
    description: {
      // [FIX] All languages were Chinese
      TW: "屋台文化，充滿活力的港口商圈", EN: "Yatai food stall culture, a vibrant port commercial district", JP: "屋台文化、活気ある港の商業地区", KR: "야타이 포장마차 문화, 활기찬 항구 상업 지구", FR: "Culture des stands de nourriture yatai, un quartier commercial portuaire animé", ES: "Cultura de los puestos de comida yatai, un animado distrito comercial portuario", ID: "Budaya kios makanan yatai, kawasan komersial pelabuhan yang semarak", HI: "याताई फूड स्टॉल संस्कृति, एक जीवंत बंदरगाह वाणिज्यिक जिला", PT: "Cultura de barracas de comida yatai, um vibrante distrito comercial portuário", AR: "ثقافة أكشاك الطعام ياتاي، حي تجاري ميناء نابض بالحياة", RU: "Культура уличной еды ятай, оживлённый портовый торговый район",
    },
    top_food: {
      // [FIX] All languages were Chinese
      TW: "博多拉麵、明太子", EN: "Hakata ramen, mentaiko", JP: "博多ラーメン、明太子", KR: "하카타 라멘, 멘타이코", FR: "Ramen Hakata, mentaiko", ES: "Ramen Hakata, mentaiko", ID: "Ramen Hakata, mentaiko", HI: "हाकाता रामेन, मेंताइको", PT: "Ramen Hakata, mentaiko", AR: "رامين هاكاتا، مينتايكو", RU: "Рамен Хаката, ментайко",
    },
    must_visit_spot: {
      // [FIX] All languages were Chinese
      TW: "大濠公園、太宰府天滿宮", EN: "Ohori Park, Dazaifu Tenmangu Shrine", JP: "大濠公園、太宰府天満宮", KR: "오호리 공원, 다자이후 텐만구 신사", FR: "Parc Ohori, Sanctuaire Dazaifu Tenmangu", ES: "Parque Ohori, Santuario Dazaifu Tenmangu", ID: "Taman Ohori, Kuil Dazaifu Tenmangu", HI: "ओहोरी पार्क, दाजाइफू तेनमंगू मंदिर", PT: "Parque Ohori, Santuário Dazaifu Tenmangu", AR: "حديقة أوهوري، ضريح دازايفو تينمانجو", RU: "Парк Охори, святилище Дадзайфу Тэнмангу",
    },
    recommendedDays: 3
  },
  "箱根": {
    name: {
      // [FIX] All languages were Chinese
      TW: "箱根", EN: "Hakone", JP: "箱根", KR: "하코네", FR: "Hakone", ES: "Hakone", ID: "Hakone", HI: "हाकोने", PT: "Hakone", AR: "هاكوني", RU: "Хаконэ",
    },
    description: {
      // [FIX] All languages were Chinese
      TW: "溫泉之鄉，富士山絕佳觀望點", EN: "Hot spring village, the best viewpoint for Mount Fuji", JP: "温泉の里、富士山の絶好の展望スポット", KR: "온천 마을, 후지산 최고의 전망 포인트", FR: "Village thermal, le meilleur point d'observation du Mont Fuji", ES: "Pueblo de aguas termales, el mejor mirador del Monte Fuji", ID: "Desa pemandian air panas, titik pandang terbaik Gunung Fuji", HI: "हॉट स्प्रिंग गांव, माउंट फूजी का सबसे अच्छा दर्शन स्थल", PT: "Vila de fontes termais, o melhor mirante para o Monte Fuji", AR: "قرية الينابيع الساخنة، أفضل نقطة مشاهدة لجبل فوجي", RU: "Деревня горячих источников, лучшая точка обзора горы Фудзи",
    },
    top_food: {
      // [FIX] All languages were Chinese
      TW: "溫泉饅頭、黑雞蛋", EN: "Hot spring manju, black eggs", JP: "温泉まんじゅう、黒たまご", KR: "온천 만주, 검은 달걀", FR: "Manju de source thermale, œufs noirs", ES: "Manju de aguas termales, huevos negros", ID: "Manju sumber air panas, telur hitam", HI: "हॉट स्प्रिंग मांजू, काले अंडे", PT: "Manju de fonte termal, ovos negros", AR: "مانجو الينابيع الساخنة، البيض الأسود", RU: "Манджю из горячих источников, чёрные яйца",
    },
    must_visit_spot: {
      // [FIX] All languages were Chinese
      TW: "大涌谷、蘆之湖", EN: "Owakudani, Lake Ashi", JP: "大涌谷、芦ノ湖", KR: "오와쿠다니, 아시 호수", FR: "Owakudani, Lac Ashi", ES: "Owakudani, Lago Ashi", ID: "Owakudani, Danau Ashi", HI: "ओवाकुदानी, आशी झील", PT: "Owakudani, Lago Ashi", AR: "أواكوداني، بحيرة آشي", RU: "Овакудани, озеро Аси",
    },
    recommendedDays: 3
  },
  "沖繩": {
    name: {
      // [FIX] EN/JP/KR/FR were all Chinese
      TW: "沖繩", EN: "Okinawa", JP: "沖縄", KR: "오키나와", FR: "Okinawa", ES: "Okinawa", ID: "Okinawa", HI: "ओकिनावा", PT: "Okinawa", AR: "أوكيناوا", RU: "Окинава",
    },
    description: {
      // [FIX] EN/JP/KR/FR were all Chinese
      TW: "琉球風情，湛藍海景與潛水天堂", EN: "Ryukyu style, blue ocean scenery and diving paradise", JP: "琉球スタイル、青い海の景色とダイビングパラダイス", KR: "류큐 스타일, 푸른 바다 경치와 다이빙 천국", FR: "Style Ryukyu, paysage marin bleu et paradis de la plongée", ES: "Estilo Ryukyu, paisaje marino azul y paraíso del buceo", ID: "Gaya Ryukyu, pemandangan laut biru dan surga menyelam", HI: "रयूकू शैली, नीला समुद्री दृश्य और गोताखोरी स्वर्ग", PT: "Estilo Ryukyu, paisagem marítima azul e paraíso do mergulho", AR: "أسلوب ريوكيو والمناظر البحرية الزرقاء وجنة الغوص", RU: "Стиль Рюкю, голубой морской пейзаж и рай для дайвинга",
    },
    top_food: {
      // [FIX] EN/JP/KR/FR were all Chinese
      TW: "沖繩苦瓜炒蛋、石垣牛", EN: "Okinawa bitter melon stir-fry (Goya champuru), Ishigaki beef", JP: "沖縄ゴーヤーチャンプルー、石垣牛", KR: "오키나와 여주 볶음(고야 찬푸루), 이시가키 소", FR: "Sauté de melon amer d'Okinawa (Goya champuru), bœuf Ishigaki", ES: "Salteado de melón amargo de Okinawa (Goya champuru), ternera Ishigaki", ID: "Tumis melon pahit Okinawa (Goya champuru), daging sapi Ishigaki", HI: "ओकिनावा कड़वे तरबूज की भुजिया (गोया चाम्पुरू), इशिगाकी बीफ", PT: "Refogado de melão amargo de Okinawa (Goya champuru), carne Ishigaki", AR: "قلي الشمام المر في أوكيناوا (جويا شامبورو)، لحم بقري إيشيجاكي", RU: "Жаркое из горькой дыни Окинавы (Гоя чампуру), говядина Исигаки",
    },
    must_visit_spot: {
      // [FIX] EN/JP/KR/FR were all Chinese
      TW: "首里城、美麗海水族館", EN: "Shuri Castle, Churaumi Aquarium", JP: "首里城、美ら海水族館", KR: "슈리성, 추라우미 수족관", FR: "Château Shuri, Aquarium Churaumi", ES: "Castillo Shuri, Acuario Churaumi", ID: "Kastil Shuri, Akuarium Churaumi", HI: "शुरी कैसल, चुरौमी एक्वेरियम", PT: "Castelo Shuri, Aquário Churaumi", AR: "قلعة شوري، حوض أسماك تشوراومي", RU: "Замок Сюри, Аквариум Тюрауми",
    },
    recommendedDays: 3
  },
  "拉斯維加斯": {
    name: {
      // [FIX] EN: "las vegas" → "Las Vegas"; KR/FR/ES/ID/HI/PT/AR/RU were all Chinese
      TW: "拉斯維加斯", EN: "Las Vegas", JP: "ラスベガス", KR: "라스베이거스", FR: "Las Vegas", ES: "Las Vegas", ID: "Las Vegas", HI: "लास वेगास", PT: "Las Vegas", AR: "لاس فيغاس", RU: "Лас-Вегас",
    },
    description: {
      // [FIX] KR/FR/ES/ID/HI/PT/AR/RU were all Chinese
      TW: "沙漠賭城，不夜的娛樂與表演殿堂", EN: "Desert casino, a palace of entertainment and performances that never sleeps", JP: "デザートカジノ、眠らないエンターテイメントとパフォーマンスの宮殿", KR: "사막 카지노, 잠들지 않는 엔터테인먼트와 공연의 전당", FR: "Casino du désert, un palais de divertissement et de spectacles qui ne dort jamais", ES: "Casino del desierto, un palacio de entretenimiento y actuaciones que nunca duerme", ID: "Kasino padang pasir, istana hiburan dan pertunjukan yang tidak pernah tidur", HI: "रेगिस्तानी कैसीनो, मनोरंजन और प्रदर्शन का एक महल जो कभी नहीं सोता", PT: "Casino do deserto, um palácio de entretenimento e espetáculos que nunca dorme", AR: "كازينو الصحراء، قصر الترفيه والعروض الذي لا ينام أبدًا", RU: "Пустынное казино, дворец развлечений и представлений, который никогда не спит",
    },
    top_food: {
      // [FIX] KR/FR/ES/ID/HI/PT/AR/RU were all Chinese
      TW: "自助餐(Buffet)、牛排", EN: "Buffet, steak", JP: "ビュッフェ、ステーキ", KR: "뷔페, 스테이크", FR: "Buffet, steak", ES: "Bufé, filete", ID: "Buffet, steak", HI: "बुफे, स्टेक", PT: "Buffet, bife", AR: "البوفيه، شريحة لحم", RU: "Буфет, стейк",
    },
    must_visit_spot: {
      // [FIX] KR/FR/ES/ID/HI/PT/AR/RU were all Chinese
      TW: "拉斯維加斯大道、大峽谷(鄰近)", EN: "Las Vegas Strip, Grand Canyon (nearby)", JP: "ラスベガス ストリップ、グランド キャニオン（近隣）", KR: "라스베이거스 스트립, 그랜드 캐니언 (인근)", FR: "Las Vegas Strip, Grand Canyon (à proximité)", ES: "Las Vegas Strip, Gran Cañón (cercano)", ID: "Las Vegas Strip, Grand Canyon (terdekat)", HI: "लास वेगास स्ट्रिप, ग्रैंड कैनियन (निकट)", PT: "Las Vegas Strip, Grand Canyon (próximo)", AR: "شريط لاس فيغاس، غراند كانيون (قريب)", RU: "Лас-Вегас Стрип, Гранд-Каньон (рядом)",
    },
    recommendedDays: 3
  },
  "芝加哥": {
    name: {
      // [FIX] EN/JP were all Chinese
      TW: "芝加哥", EN: "Chicago", JP: "シカゴ", KR: "시카고", FR: "Chicago", ES: "Chicago", ID: "Chicago", HI: "शिकागो", PT: "Chicago", AR: "شيكاغو", RU: "Чикаго",
    },
    description: {
      // [FIX] EN/JP were all Chinese
      TW: "建築之都，爵士樂與深盤披薩", EN: "City of architecture, jazz and deep-dish pizza", JP: "建築、ジャズ、ディープディッシュピザの街", KR: "건축과 재즈, 딥디쉬 피자의 도시", FR: "Une ville d'architecture, de jazz et de pizza profonde", ES: "Una ciudad de arquitectura, jazz y pizza de plato hondo", ID: "Kota arsitektur, jazz, dan pizza deep-dish", HI: "वास्तुकला, जैज़ और डीप-डिश पिज़्ज़ा का शहर", PT: "Uma cidade de arquitetura, jazz e pizza de prato fundo", AR: "مدينة الهندسة المعمارية وموسيقى الجاز والبيتزا العميقة", RU: "Город архитектуры, джаза и пиццы с глубоким дном",
    },
    top_food: {
      // [FIX] EN/JP were all Chinese
      TW: "深盤披薩 (Deep Dish Pizza)", EN: "Deep Dish Pizza", JP: "ディープディッシュピザ", KR: "딥디쉬 피자", FR: "Pizza à plat profond", ES: "Pizza de plato hondo", ID: "Pizza Hidangan Dalam", HI: "डीप डिश पिज्जा", PT: "Pizza de prato fundo", AR: "بيتزا طبق عميق", RU: "Пицца с глубоким дном",
    },
    must_visit_spot: {
      // [FIX] EN/JP were all Chinese
      TW: "雲門 (The Bean)、海軍碼頭", EN: "Cloud Gate (The Bean), Navy Pier", JP: "クラウドゲート（ザ・ビーン）、ネイビーピア", KR: "클라우드 게이트(더 빈), 네이비 피어", FR: "Cloud Gate (Le Haricot), Navy Pier", ES: "Cloud Gate (The Bean), Navy Pier", ID: "Cloud Gate (The Bean), Dermaga Angkatan Laut", HI: "क्लाउड गेट (द बीन), नेवी पियर", PT: "Cloud Gate (O Feijão), Navy Pier", AR: "بوابة السحابة (ذا فول)، الرصيف البحري", RU: "Облачные ворота (Бин), Военно-морской пирс",
    },
    recommendedDays: 3
  },
  "邁阿密": {
    name: {
      // [FIX] EN: "miami" → "Miami"; ID: "miami" → "Miami"
      TW: "邁阿密", EN: "Miami", JP: "マイアミ", KR: "마이애미", FR: "Miami", ES: "Miami", ID: "Miami", HI: "मियामी", PT: "Miami", AR: "ميامي", RU: "Майами",
    },
    description: {
      TW: "拉丁熱情，陽光沙灘與裝飾藝術建築", EN: "Latin passion, sunny beaches and Art Deco architecture", JP: "ラテンの情熱、太陽が降り注ぐビーチ、アールデコ様式の建築", KR: "라틴 열정, 햇살 가득한 해변, 아르데코 건축물", FR: "Passion latine, plages ensoleillées et architecture Art Déco", ES: "Pasión latina, playas soleadas y arquitectura Art Déco", ID: "Gairah Latin, pantai cerah, dan arsitektur Art Deco", HI: "लैटिन जुनून, धूप वाले समुद्र तट और आर्ट डेको वास्तुकला", PT: "Paixão latina, praias ensolaradas e arquitetura Art Déco", AR: "العاطفة اللاتينية والشواطئ المشمسة والهندسة المعمارية على طراز آرت ديكو", RU: "Латинская страсть, солнечные пляжи и архитектура в стиле ар-деко.",
    },
    top_food: {
      TW: "古巴三明治、石蟹鉗", EN: "Cuban Sandwich, Stone Crab Claws", JP: "キューバンサンドイッチ、石ガニ爪", KR: "쿠바 샌드위치, 돌게 집게발", FR: "Sandwich Cubain, Pinces De Crabe", ES: "Sándwich Cubano, Pinzas De Cangrejo De Piedra", ID: "Sandwich Kuba, Cakar Kepiting Batu", HI: "क्यूबन सैंडविच, पत्थर केकड़े के पंजे", PT: "Sanduíche cubano, garras de caranguejo de pedra", AR: "ساندويتش كوبي، مخالب السلطعون الحجري", RU: "Кубинский сэндвич, клешни каменного краба",
    },
    must_visit_spot: {
      TW: "南沙灘 (South Beach)、小哈瓦那", EN: "South Beach, Little Havana", JP: "サウスビーチ、リトルハバナ", KR: "사우스 비치, 리틀 하바나", FR: "Plage Sud, Petite Havane", ES: "Playa Sur, Pequeña Habana", ID: "Pantai Selatan, Little Havana", HI: "साउथ बीच, लिटिल हवाना", PT: "Praia Sul, Pequena Havana", AR: "الشاطئ الجنوبي، هافانا الصغيرة", RU: "Южный пляж, Маленькая Гавана",
    },
    recommendedDays: 3
  },
  "西雅圖": {
    name: {
      // [FIX] EN: "seattle" → "Seattle"; ES: "seattle" → "Seattle"; ID: "seattle" → "Seattle"
      TW: "西雅圖", EN: "Seattle", JP: "シアトル", KR: "시애틀", FR: "Seattle", ES: "Seattle", ID: "Seattle", HI: "सिएटल", PT: "Seattle", AR: "سياتل", RU: "Сиэтл",
    },
    description: {
      TW: "咖啡原鄉，雨中的文藝與科技重鎮", EN: "The hometown of coffee, a city of arts and technology in the rain", JP: "コーヒーの故郷、雨の芸術と科学技術の街", KR: "빗속의 예술과 과학기술의 도시, 커피의 고향", FR: "La ville natale du café, une ville d'art, de science et de technologie sous la pluie", ES: "La ciudad natal del café, una ciudad de arte, ciencia y tecnología bajo la lluvia", ID: "Kampung halaman kopi, kota seni dan iptek di tengah hujan", HI: "कॉफ़ी का गृहनगर, बारिश में कला और विज्ञान और प्रौद्योगिकी का शहर", PT: "A cidade natal do café, uma cidade de arte, ciência e tecnologia na chuva", AR: "مسقط رأس القهوة، مدينة الفن والعلوم والتكنولوجيا تحت المطر", RU: "Родной город кофе, город искусства, науки и технологий под дождем",
    },
    top_food: {
      TW: "派克市場海鮮、咖啡", EN: "Pike Place Market seafood and coffee", JP: "パイク プレイス マーケットのシーフードとコーヒー", KR: "파이크 플레이스 마켓 해산물과 커피", FR: "Fruits de mer et café du marché de Pike Place", ES: "Pike Place Market mariscos y café", ID: "Makanan laut dan kopi Pike Place Market", HI: "पाइक प्लेस मार्केट समुद्री भोजन और कॉफी", PT: "Frutos do mar e café do Pike Place Market", AR: "بايك بلايس ماركت للمأكولات البحرية والقهوة", RU: "Морепродукты и кофе Pike Place Market",
    },
    must_visit_spot: {
      TW: "太空針塔、派克市場", EN: "Space Needle, Pike Place Market", JP: "スペースニードル、パイクプレイスマーケット", KR: "스페이스 니들, 파이크 플레이스 마켓", FR: "Space Needle, marché de Pike Place", ES: "Aguja espacial, mercado de Pike Place", ID: "Space Needle, Pasar Pike Place", HI: "स्पेस नीडल, पाइक प्लेस मार्केट", PT: "Space Needle, Mercado Pike Place", AR: "إبرة الفضاء، سوق بايك بلايس", RU: "Спейс-Нидл, рынок Пайк-Плейс",
    },
    recommendedDays: 3
  },
  "愛丁堡": {
    name: {
      TW: "愛丁堡", EN: "Edinburgh", JP: "エディンバラ", KR: "에든버러", FR: "Édimbourg", ES: "Edimburgo", ID: "Edinburgh", HI: "एडिनबरा", PT: "Edimburgo", AR: "ادنبره", RU: "Эдинбург",
    },
    description: {
      TW: "古堡傳說，哈利波特的靈感發源地", EN: "Castle legends, the inspiration for Harry Potter", JP: "ハリー・ポッターのインスピレーションとなったキャッスル・レジェンド", KR: "해리포터의 영감이 된 성 전설", FR: "Légendes de château, l'inspiration d'Harry Potter", ES: "Leyendas del castillo, la inspiración de Harry Potter", ID: "Legenda kastil, inspirasi Harry Potter", HI: "महल की किंवदंतियाँ, हैरी पॉटर की प्रेरणा", PT: "Lendas de castelo, a inspiração para Harry Potter", AR: "أساطير القلعة، مصدر إلهام هاري بوتر", RU: "Легенды замка, вдохновитель Гарри Поттера",
    },
    top_food: {
      TW: "哈吉斯 (Haggis)、蘇格蘭威士忌", EN: "Haggis, Scotch whisky", JP: "ハギス、スコッチウイスキー", KR: "하기스, 스카치 위스키", FR: "Haggis, whisky écossais", ES: "Haggis, whisky escocés", ID: "Haggis, wiski Scotch", HI: "हैगिस, स्कॉच व्हिस्की", PT: "Haggis, whisky escocês", AR: "هاجيس، ويسكي سكوتش", RU: "Хаггис, шотландский виски",
    },
    must_visit_spot: {
      TW: "愛丁堡城堡、皇家一英里", EN: "Edinburgh Castle, Royal Mile", JP: "エディンバラ城、ロイヤルマイル", KR: "에딘버러 성, 로얄마일", FR: "Château d'Édimbourg, Royal Mile", ES: "Castillo de Edimburgo, Milla Real", ID: "Kastil Edinburgh, Royal Mile", HI: "एडिनबर्ग कैसल, रॉयल माइल", PT: "Castelo de Edimburgo, Royal Mile", AR: "قلعة ادنبره، رويال مايل", RU: "Эдинбургский замок, Королевская миля",
    },
    recommendedDays: 3
  },
  "佛羅倫斯": {
    name: {
      TW: "佛羅倫斯", EN: "Florence", JP: "フィレンツェ", KR: "피렌체", FR: "Florence", ES: "Florencia", ID: "Florence", HI: "फ़्लोरेंस", PT: "Florença", AR: "فلورنسا", RU: "Флоренция",
    },
    description: {
      TW: "文藝復興搖籃，極致的藝術與皮革工藝", EN: "The cradle of the Renaissance, the ultimate in art and leather craftsmanship", JP: "ルネッサンス発祥の地、究極の芸術と皮革工芸品", KR: "르네상스의 요람, 예술과 가죽 공예의 정점", FR: "Le berceau de la Renaissance, le summum de l'art et de la maroquinerie", ES: "La cuna del Renacimiento, lo último en arte y artesanía en cuero.", ID: "Tempat lahirnya Renaisans, seni dan keahlian kulit terbaik", HI: "पुनर्जागरण का उद्गम स्थल, कला और चमड़े की शिल्प कौशल में सर्वोच्च", PT: "O berço da Renascença, o máximo em arte e artesanato em couro", AR: "مهد عصر النهضة، قمة الفن وصناعة الجلود", RU: "Колыбель Ренессанса, вершина искусства и мастерства обработки кожи.",
    },
    top_food: {
      TW: "丁骨牛排 (Bistecca)、牛肚包", EN: "T-bone steak (Bistecca alla Fiorentina), tripe bun", JP: "Tボーンステーキ（ビステッカ・アッラ・フィオレンティーナ）、トライプバンズ", KR: "티본스테이크(비스테카 알라 피오렌티나), 곱창번", FR: "Bifteck d'aloyau (Bistecca alla Fiorentina), petit pain aux tripes", ES: "Chuletón (Bistecca alla Fiorentina), pan de callos", ID: "Steak T-bone (Bistecca alla Fiorentina), roti babat", HI: "टी-बोन स्टेक (बिस्टेका अल्ला फिओरेंटिना), ट्रिप बन", PT: "Bife T-bone (Bistecca alla Fiorentina), pãozinho de tripas", AR: "شريحة لحم تي بون (بيستيكا ألا فيورنتينا)، كعك الكرشة", RU: "Стейк Тибон (Бистекка алла Фьорентина), булочка с рубцом",
    },
    must_visit_spot: {
      TW: "百花大教堂、烏菲茲美術館", EN: "Cathedral of Santa Maria del Fiore, Uffizi Gallery", JP: "サンタ・マリア・デル・フィオーレ大聖堂、ウフィツィ美術館", KR: "산타 마리아 델 피오레 대성당, 우피치 갤러리", FR: "Cathédrale de Santa Maria del Fiore, Galerie des Offices", ES: "Catedral de Santa María del Fiore, Galería Uffizi", ID: "Katedral Santa Maria del Fiore, Galeri Uffizi", HI: "सांता मारिया डेल फिओरे कैथेड्रल, उफीज़ी गैलरी", PT: "Catedral de Santa Maria del Fiore, Galeria Uffizi", AR: "كاتدرائية سانتا ماريا ديل فيوري، معرض أوفيزي", RU: "Собор Санта-Мария-дель-Фьоре, Галерея Уффици.",
    },
    recommendedDays: 3
  },
  "尼斯": {
    name: {
      // [FIX] KR/FR/ES/ID/HI/PT/AR/RU were all adjectives meaning "nice/good" instead of the city name
      TW: "尼斯", EN: "Nice", JP: "ニース", KR: "니스", FR: "Nice", ES: "Niza", ID: "Nice", HI: "नीस", PT: "Nice", AR: "نيس", RU: "Ницца",
    },
    description: {
      TW: "蔚藍海岸，法式度假的優雅縮影", EN: "The French Riviera, the epitome of French elegance", JP: "フランスのエレガンスの縮図、フレンチ リヴィエラ", KR: "프렌치 우아함의 대명사, 프렌치 리비에라", FR: "La Côte d'Azur, l'incarnation de l'élégance à la française", ES: "La Riviera Francesa, el epítome de la elegancia francesa", ID: "French Riviera, lambang keanggunan Prancis", HI: "फ्रेंच रिवेरा, फ्रांसीसी सुंदरता का प्रतीक", PT: "A Riviera Francesa, o epítome da elegância francesa", AR: "الريفييرا الفرنسية، مثال للأناقة الفرنسية", RU: "Французская Ривьера – воплощение французской элегантности",
    },
    top_food: {
      TW: "尼斯沙拉、索卡 (Socca)", EN: "Salade Niçoise, Socca", JP: "ニース風サラダ、ソッカ", KR: "니수아즈 샐러드, 소카", FR: "Salade Niçoise, Socca", ES: "Ensalada Niçoise, Socca", ID: "Salad Niçoise, Socca", HI: "निकोइस सलाद, सोका", PT: "Salade Niçoise, Socca", AR: "سلطة نيكواز، سوكا", RU: "Салат Нисуаз, Сокка",
    },
    must_visit_spot: {
      // [FIX] ES/ID/HI used adjective form ("bonito"/"Bagus"/"अच्छा") instead of city name
      TW: "天使灣、尼斯老城", EN: "Bay of Angels, Nice Old Town", JP: "ベイ オブ エンジェルス、ニース旧市街", KR: "베이 오브 엔젤스, 니스 구시가지", FR: "Baie des Anges, Vieille Ville de Nice", ES: "Bahía de los Ángeles, casco antiguo de Niza", ID: "Bay of Angels, Kota Tua Nice", HI: "एन्जिल्स की खाड़ी, नीस का पुराना शहर", PT: "Baía dos Anjos, Cidade Velha de Nice", AR: "خليج الملائكة، مدينة نيس القديمة", RU: "Залив Ангелов, Старый город Ниццы",
    },
    recommendedDays: 3
  },
  "聖托里尼": {
    name: {
      // [FIX] EN: "santorini" → "Santorini"; ID: "santorini" → "Santorini"; PT: "santorini" → "Santorini"
      TW: "聖托里尼", EN: "Santorini", JP: "サントリーニ島", KR: "산토리니", FR: "Santorin", ES: "Santorini", ID: "Santorini", HI: "सेंटोरिनी", PT: "Santorini", AR: "سانتوريني", RU: "Санторини",
    },
    description: {
      TW: "藍白天堂，全球最美的日落觀賞點", EN: "Blue and white paradise, the most beautiful sunset viewing spot in the world", JP: "世界で最も美しい夕日鑑賞スポット、青と白の楽園", KR: "청백의 낙원, 세계에서 가장 아름다운 일몰 명소", FR: "Paradis bleu et blanc, le plus beau coucher de soleil au monde", ES: "Paraíso azul y blanco, el lugar para ver el atardecer más hermoso del mundo", ID: "Surga biru putih, tempat melihat matahari terbenam terindah di dunia", HI: "नीला और सफ़ेद स्वर्ग, दुनिया में सूर्यास्त देखने का सबसे खूबसूरत स्थान", PT: "Paraíso azul e branco, o ponto de observação do pôr do sol mais lindo do mundo", AR: "الجنة الزرقاء والبيضاء، أجمل مكان لمشاهدة غروب الشمس في العالم", RU: "Голубой и белый рай, самое красивое место в мире для наблюдения за закатом.",
    },
    top_food: {
      TW: "烤章魚、希臘沙拉", EN: "Grilled octopus, Greek salad", JP: "タコのグリル、ギリシャ風サラダ", KR: "구운 문어, 그리스 샐러드", FR: "Poulpe grillé, salade grecque", ES: "Pulpo a la plancha, ensalada griega", ID: "Gurita panggang, salad Yunani", HI: "ग्रिल्ड ऑक्टोपस, ग्रीक सलाद", PT: "Polvo grelhado, salada grega", AR: "أخطبوط مشوي، سلطة يونانية", RU: "Осьминог гриль, греческий салат",
    },
    must_visit_spot: {
      TW: "伊亞小鎮 (Oia)、紅沙灘", EN: "Oia town, Red Beach", JP: "イアの町（イア）、赤い砂のビーチ", KR: "이아 마을, 붉은 모래 해변", FR: "Ville d'Oia, plage de sable rouge", ES: "Pueblo de Oia, playa de arena roja", ID: "Kota Oia, pantai pasir merah", HI: "ओइया शहर, लाल रेतीला समुद्र तट", PT: "Cidade de Oia, praia de areia vermelha", AR: "مدينة أويا، شاطئ الرمال الحمراء", RU: "Город Ия, пляж с красным песком",
    },
    recommendedDays: 3
  },
  "雷克雅維克": {
    name: {
      TW: "雷克雅維克", EN: "Reykjavik", JP: "レイキャビク", KR: "레이캬비크", FR: "Reykjavík", ES: "Reikiavik", ID: "Reykjavik", HI: "रिक्जेविक", PT: "Reykjavík", AR: "ريكيافيك", RU: "Рейкьявик",
    },
    description: {
      TW: "極光之城，外星般的冰火地貌體驗", EN: "City of the Northern Lights, an alien-like experience of ice and fire landforms", JP: "氷と炎の地形が異星人のような体験をもたらすオーロラの街", KR: "얼음과 불 지형을 외계인처럼 경험하는 오로라의 도시", FR: "City of Aurora, une expérience extraterrestre de reliefs de glace et de feu", ES: "Ciudad de la Aurora, una experiencia extraterrestre de accidentes geográficos de hielo y fuego", ID: "Kota Aurora, pengalaman bentang alam es dan api yang mirip alien", HI: "ऑरोरा शहर, बर्फ और आग की भू-आकृतियों का एक एलियन जैसा अनुभव", PT: "Cidade de Aurora, uma experiência alienígena de formas de relevo de gelo e fogo", AR: "مدينة الشفق القطبي، تجربة غريبة لأشكال الجليد والنار", RU: "Город северного сияния, инопланетный опыт ледяных и огненных форм рельефа",
    },
    top_food: {
      TW: "羊肉湯、龍蝦湯", EN: "Lamb soup, lobster soup", JP: "ラムスープ、ロブスタースープ", KR: "양고기 수프, 랍스터 수프", FR: "Soupe d'agneau, soupe de homard", ES: "Sopa de cordero, sopa de bogavante", ID: "Sup domba, sup lobster", HI: "मेमने का सूप, झींगा मछली का सूप", PT: "Sopa de cordeiro, sopa de lagosta", AR: "حساء لحم الضأن، حساء جراد البحر", RU: "Суп из баранины, суп из лобстера",
    },
    must_visit_spot: {
      TW: "藍湖溫泉、哈爾格林姆教堂", EN: "Blue Lagoon, Hallgrímskirkja", JP: "ブルー ラグーン、ハットルグリムス教会", KR: "블루 라군, 할그림스키르캬", FR: "Lagon Bleu, Hallgrímskirkja", ES: "Laguna Azul, Hallgrímskirkja", ID: "Laguna Biru, Hallgrímskirkja", HI: "ब्लू लैगून, हॉलग्रिम्सकिर्कजा", PT: "Lagoa Azul, Hallgrímskirkja", AR: "بلو لاجون، هالجريمسكيركجا", RU: "Голубая лагуна, Хадльгримскиркья",
    },
    recommendedDays: 3
  },
  "峇里島(庫塔)": {
    name: {
      TW: "峇里島(庫塔)", EN: "Bali (Kuta)", JP: "バリ島(クタ)", KR: "발리(쿠타)", FR: "Bali (Kuta)", ES: "Bali (Kuta)", ID: "Bali (Kuta)", HI: "बाली (कुटा)", PT: "Bali (Kuta)", AR: "بالي (كوتا)", RU: "Бали (Кута)",
    },
    description: {
      TW: "衝浪天堂，熱帶島嶼的信仰與放鬆", EN: "Surfing paradise, tropical island faith and relaxation", JP: "サーフィンの楽園、熱帯の島への信仰とリラクゼーション", KR: "서핑 천국, 열대 섬 신앙과 휴식", FR: "Paradis du surf, foi sur les îles tropicales et détente", ES: "Paraíso del surf, isla tropical, fe y relajación.", ID: "Surga selancar, keyakinan pulau tropis, dan relaksasi", HI: "सर्फिंग स्वर्ग, उष्णकटिबंधीय द्वीप आस्था और विश्राम", PT: "Paraíso do surf, fé e relaxamento em ilhas tropicais", AR: "جنة ركوب الأمواج، والجزيرة الاستوائية، والإيمان والاسترخاء", RU: "Рай для серфинга, тропический остров веры и отдыха",
    },
    top_food: {
      TW: "髒鴨飯、烤豬飯", EN: "Bebek betutu (spiced duck), babi guling (roast pork)", JP: "ベベック・ベトゥトゥ（スパイスダック）、バビ・グリン（ローストポーク）", KR: "베벡 베투투(향신료 오리), 바비 굴링(구운 돼지)", FR: "Bebek betutu (canard épicé), babi guling (cochon rôti)", ES: "Bebek betutu (pato especiado), babi guling (cerdo asado)", ID: "Bebek betutu, babi guling", HI: "बेबेक बेतुतु (मसालेदार बत्तख), बाबी गुलिंग (भुना सुअर)", PT: "Bebek betutu (pato temperado), babi guling (porco assado)", AR: "بيبيك بيتوتو (بط متبل)، بابي جولينج (خنزير مشوي)", RU: "Бебек бетуту (пряная утка), баби гулинг (жареный поросёнок)",
    },
    must_visit_spot: {
      TW: "海神廟、烏魯瓦圖", EN: "Tanah Lot Temple, Uluwatu", JP: "タナロット寺院、ウルワツ", KR: "타나롯 사원, 울루와뚜", FR: "Temple Tanah Lot, Uluwatu", ES: "Templo de Tanah Lot, Uluwatu", ID: "Pura Tanah Lot, Uluwatu", HI: "तनाह लोट मंदिर, उलुवातु", PT: "Templo de Tanah Lot, Uluwatu", AR: "معبد تاناه لوت، أولواتو", RU: "Храм Танах Лот, Улувату",
    },
    recommendedDays: 3
  }
};

export const mapLangToSupported = (langName: string): SupportedLang => {
    switch (langName) {
        case "繁體中文": return "TW";
        case "English": return "EN";
        case "日本語": return "JP";
        case "한국어": return "KR";
        case "Français": return "FR";
        case "Español": return "ES";
        case "Bahasa Indonesia": return "ID";
        case "हिन्दी": return "HI";
        case "Português": return "PT";
        case "العربية": return "AR";
        case "বাংলা": return "EN"; // Bengali: fallback to English for city data
        case "Русский": return "RU";
        default: return "EN";
    }
}

export const getTranslatedData = (cityId: string, type: 'name' | 'description' | 'top_food' | 'must_visit_spot', currentLangName: string, fallbackText?: string): string => {
    if (!cityId) return fallbackText || cityId;
    
    // Primary: direct key lookup (supports legacy Chinese char keys)
    const normalizedId = cityId.toLowerCase().replace(/\s/g, ''); 
    let city = cityDataTranslations[normalizedId];

    // Secondary: if not found directly, search by matching EN name slug
    // (supports new English lowercase keys from cityPhotos.ts)
    if (!city) {
        for (const [, data] of Object.entries(cityDataTranslations)) {
            const enName = data.name.EN || '';
            const slug = enName.toLowerCase().replace(/[^a-z0-9]+/g, '');
            if (slug === normalizedId) {
                city = data;
                break;
            }
        }
    }

    if (!city || !city[type]) return fallbackText || cityId;

    const langKey = mapLangToSupported(currentLangName);

    return city[type][langKey] || city[type]['EN'] || city[type]['TW'] || fallbackText || cityId;
};


export const getTranslatedCityName = (cityId: string, currentLangName: string): string => {
    return getTranslatedData(cityId, 'name', currentLangName, cityId);
};

export const getCitySlug = (cityId: string): string => {
    const enName = cityDataTranslations[cityId]?.name?.EN || cityId;
    return enName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const getCityIdFromSlug = (slug: string): string | null => {
    for (const [cityId, data] of Object.entries(cityDataTranslations)) {
        const enName = data.name.EN || cityId;
        const currentSlug = enName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (currentSlug === slug) return cityId;
    }
    return null;
};
export const getRecommendedDays = (cityId: string): number => {
    if (!cityId) return 3;
    
    // Primary: direct key lookup (supports legacy Chinese char keys)
    const normalizedId = cityId.toLowerCase().replace(/\s/g, ''); 
    let city = cityDataTranslations[normalizedId];

    // Secondary: if not found directly, search by matching EN name slug
    // (supports new English lowercase keys from cityPhotos.ts)
    if (!city) {
        for (const [, data] of Object.entries(cityDataTranslations)) {
            const enName = data.name.EN || '';
            const slug = enName.toLowerCase().replace(/[^a-z0-9]+/g, '');
            if (slug === normalizedId) {
                city = data;
                break;
            }
        }
    }

    return city?.recommendedDays || 3;
};
