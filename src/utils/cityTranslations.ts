export type SupportedLang = 'TW' | 'EN' | 'JP' | 'KR' | 'FR' | 'ES' | 'ID' | 'HI' | 'PT' | 'AR' | 'RU';

export const cityDataTranslations: Record<string, { 
    name: Partial<Record<SupportedLang, string>>, 
    description: Partial<Record<SupportedLang, string>>,
    top_food: Partial<Record<SupportedLang, string>>,
    must_visit_spot: Partial<Record<SupportedLang, string>>
}> = {
  "香港": {
    name: {
      TW: "香港", EN: "Hongkong", JP: "香港", KR: "홍콩", FR: "Hong Kong", ES: "Hong Kong", ID: "Hongkong", HI: "हांगकांग", PT: "Hong Kong", AR: "هونغ كونغ", RU: "Гонконг",
    },
    description: {
      TW: "中西合璧，璀璨夜景與金融中心", EN: "Combining Chinese and Western elements, dazzling night view and financial center", JP: "中国と西洋の要素が融合した、まばゆい夜景と金融センター", KR: "중국과 서양의 요소가 결합된 눈부신 야경과 금융센터", FR: "Combinant des éléments chinois et occidentaux, une vue nocturne éblouissante et un centre financier", ES: "Combinando elementos chinos y occidentales, deslumbrante vista nocturna y centro financiero", ID: "Menggabungkan unsur Tiongkok dan Barat, pemandangan malam yang mempesona, dan pusat keuangan", HI: "चीनी और पश्चिमी तत्वों का मिश्रण, चमकदार रात का दृश्य और वित्तीय केंद्र", PT: "Combinando elementos chineses e ocidentais, vista noturna deslumbrante e centro financeiro", AR: "يجمع بين العناصر الصينية والغربية وإطلالة ليلية مبهرة ومركز مالي", RU: "Сочетание китайских и западных элементов, великолепный ночной вид и финансовый центр.",
    },
    top_food: {
      TW: "點心、燒鵝、奶茶", EN: "Desserts, roast goose, milk tea", JP: "デザート、ローストグース、ミルクティー", KR: "디저트, 구운 거위, 밀크티", FR: "Desserts, oie rôtie, thé au lait", ES: "Postres, ganso asado, té con leche.", ID: "Makanan penutup, angsa panggang, teh susu", HI: "मिठाइयाँ, भुना हुआ हंस, दूध वाली चाय", PT: "Sobremesas, ganso assado, chá com leite", AR: "الحلويات، أوزة مشوية، شاي الحليب", RU: "Десерты, жареный гусь, чай с молоком",
    },
    must_visit_spot: {
      TW: "太平山、維多利亞港", EN: "Victoria Peak, Victoria Harbor", JP: "ビクトリア ピーク、ビクトリア ハーバー", KR: "빅토리아 피크, 빅토리아 항구", FR: "Pic Victoria, port de Victoria", ES: "Pico Victoria, Puerto Victoria", ID: "Puncak Victoria, Pelabuhan Victoria", HI: "विक्टोरिया पीक, विक्टोरिया हार्बर", PT: "Pico Victoria, Porto Victoria", AR: "فيكتوريا بيك، ميناء فيكتوريا", RU: "Пик Виктория, гавань Виктория",
    }
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
      TW: "大皇宮、鄭王廟", EN: "Grand Palace, Temple Arun", JP: "王宮、アルン寺院", KR: "왕궁, 아룬 사원", FR: "Grand Palais, Temple Arun", ES: "Gran Palacio, Templo Arun", ID: "Istana Agung, Kuil Arun", HI: "ग्रांड पैलेस, मंदिर अरुण", PT: "Grande Palácio, Templo Arun", AR: "القصر الكبير، معبد آرون", RU: "Большой дворец, Храм Аруна",
    }
  },
  "東京": {
    name: {
      TW: "東京", EN: "Tokyo", JP: "東京", KR: "도쿄", FR: "Tokyo", ES: "Tokio", ID: "Tokyo", HI: "टोक्यो", PT: "Tóquio", AR: "طوكيو", RU: "Токио",
    },
    description: {
      TW: "極致秩序，動漫天堂與潮流聖地", EN: "Ultimate order, animation paradise and trendy holy land", JP: "究極の秩序、アニメ天国、そして流行の聖地", KR: "궁극의 질서, 애니메이션 천국, 트렌디한 성지", FR: "Ordre ultime, paradis de l'animation et terre sainte branchée", ES: "Orden definitivo, paraíso de la animación y tierra santa de moda", ID: "Keteraturan tertinggi, surga animasi, dan tanah suci yang trendi", HI: "अंतिम आदेश, एनीमेशन स्वर्ग और आधुनिक पवित्र भूमि", PT: "Ordem definitiva, paraíso da animação e terra santa da moda", AR: "النظام النهائي وجنة الرسوم المتحركة والأرض المقدسة العصرية", RU: "Абсолютный порядок, анимационный рай и модная святая земля",
    },
    top_food: {
      TW: "壽司、拉麵、和牛", EN: "Sushi, ramen, wagyu", JP: "寿司、ラーメン、和牛", KR: "스시, 라면, 와규", FR: "Sushis, ramen, wagyu", ES: "sushi, ramen, wagyu", ID: "Sushi, ramen, wagyu", HI: "सुशी, रेमन, वाग्यू", PT: "Sushi, ramen, wagyu", AR: "السوشي، رامين، واغيو", RU: "Суши, рамен, вагю",
    },
    must_visit_spot: {
      TW: "澀谷、淺草寺", EN: "Shibuya, Sensoji Temple", JP: "渋谷、浅草寺", KR: "시부야, 센소지", FR: "Shibuya, temple Sensoji", ES: "Shibuya, Templo Sensoji", ID: "Shibuya, Kuil Sensoji", HI: "शिबुया, सेंसोजी मंदिर", PT: "Shibuya, Templo Sensoji", AR: "شيبويا، معبد سينسوجي", RU: "Сибуя, храм Сэнсодзи",
    }
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
    }
  },
  "倫敦": {
    name: {
      TW: "倫敦", EN: "london", JP: "ロンドン", KR: "런던", FR: "Londres", ES: "Londres", ID: "London", HI: "लंदन", PT: "Londres", AR: "لندن", RU: "Лондон",
    },
    description: {
      TW: "皇室優雅，歷史博物館與大笨鐘", EN: "Royal elegance, history museum and Big Ben", JP: "王室の優雅さ、歴史博物館、ビッグ ベン", KR: "왕실의 우아함, 역사 박물관, 빅벤", FR: "Élégance royale, musée d'histoire et Big Ben", ES: "Elegancia real, museo de historia y Big Ben", ID: "Keanggunan kerajaan, museum sejarah, dan Big Ben", HI: "शाही भव्यता, इतिहास संग्रहालय और बिग बेन", PT: "Elegância real, museu de história e Big Ben", AR: "الأناقة الملكية ومتحف التاريخ وبيغ بن", RU: "Королевская элегантность, исторический музей и Биг-Бен",
    },
    top_food: {
      TW: "炸魚薯條、下午茶", EN: "Fish and chips, afternoon tea", JP: "フィッシュアンドチップス、アフタヌーンティー", KR: "피쉬 앤 칩스, 애프터눈 티", FR: "Fish and chips, thé de l'après-midi", ES: "Fish and chips, té de la tarde", ID: "Ikan dan keripik, teh sore", HI: "मछली और चिप्स, दोपहर की चाय", PT: "Peixe e batatas fritas, chá da tarde", AR: "السمك والبطاطا والشاي بعد الظهر", RU: "Рыба с жареным картофелем, послеобеденный чай",
    },
    must_visit_spot: {
      TW: "大英博物館、倫敦塔橋", EN: "British Museum, Tower Bridge", JP: "大英博物館、タワーブリッジ", KR: "대영박물관, 타워브리지", FR: "British Museum, Tower Bridge", ES: "Museo Británico, Puente de la Torre", ID: "Museum Inggris, Tower Bridge", HI: "ब्रिटिश संग्रहालय, टावर ब्रिज", PT: "Museu Britânico, Tower Bridge", AR: "المتحف البريطاني، جسر البرج", RU: "Британский музей, Тауэрский мост",
    }
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
    }
  },
  "紐約": {
    name: {
      TW: "紐約", EN: "new york", JP: "ニューヨーク", KR: "뉴욕", FR: "New York", ES: "Nueva York", ID: "New York", HI: "न्यूयॉर्क", PT: "Nova Iorque", AR: "نيويورك", RU: "Нью-Йорк",
    },
    description: {
      TW: "大蘋果，不夜城，全球文化交匯處", EN: "The Big Apple, the city that never sleeps, the crossroads of global cultures", JP: "ビッグアップル、眠らない街、世界文化の交差点", KR: "잠들지 않는 도시, 글로벌 문화의 교차로, 빅애플", FR: "La Big Apple, la ville qui ne dort jamais, le carrefour des cultures mondiales", ES: "La Gran Manzana, la ciudad que nunca duerme, el cruce de culturas globales", ID: "The Big Apple, kota yang tidak pernah tidur, persimpangan budaya global", HI: "बिग एप्पल, वह शहर जो कभी नहीं सोता, वैश्विक संस्कृतियों का चौराहा", PT: "A Big Apple, a cidade que nunca dorme, a encruzilhada das culturas globais", AR: "التفاحة الكبيرة، المدينة التي لا تنام، ملتقى طرق الثقافات العالمية", RU: "«Большое Яблоко», город, который никогда не спит, перекресток мировых культур.",
    },
    top_food: {
      TW: "紐約薄餅、芝士蛋糕", EN: "New York pancakes, cheesecake", JP: "ニューヨークパンケーキ、チーズケーキ", KR: "뉴욕 팬케이크, 치즈케이크", FR: "Crêpes new-yorkaises, cheesecake", ES: "Panqueques de Nueva York, tarta de queso", ID: "Pancake New York, kue keju", HI: "न्यूयॉर्क पेनकेक्स, चीज़केक", PT: "Panquecas de Nova York, cheesecake", AR: "فطائر نيويورك، كعكة الجبن", RU: "Нью-йоркские блины, чизкейк",
    },
    must_visit_spot: {
      TW: "時代廣場、中央公園", EN: "Times Square, Central Park", JP: "タイムズスクエア、セントラルパーク", KR: "타임스퀘어, 센트럴파크", FR: "Times Square, Central Park", ES: "Times Square, Parque Central", ID: "Times Square, Taman Pusat", HI: "टाइम्स स्क्वायर, सेंट्रल पार्क", PT: "Times Square, Central Park", AR: "تايمز سكوير، سنترال بارك", RU: "Таймс-сквер, Центральный парк",
    }
  },
  "杜拜": {
    name: {
      TW: "杜拜", EN: "dubai", JP: "ドバイ", KR: "두바이", FR: "Dubaï", ES: "dubái", ID: "dubai", HI: "दुबई", PT: "Dubai", AR: "دبي", RU: "Дубай",
    },
    description: {
      TW: "奢華現代，世界第一高樓與沙漠冒險", EN: "Luxurious modernity, the world’s tallest building and desert adventure", JP: "豪華な現代性、世界で最も高い建物、そして砂漠の冒険", KR: "럭셔리한 현대성, 세계에서 가장 높은 건물과 사막 모험", FR: "Modernité luxueuse, bâtiment le plus haut du monde et aventure dans le désert", ES: "Modernidad lujosa, el edificio más alto del mundo y aventura en el desierto", ID: "Modernitas yang mewah, gedung tertinggi di dunia, dan petualangan gurun pasir", HI: "शानदार आधुनिकता, दुनिया की सबसे ऊंची इमारत और रेगिस्तान का रोमांच", PT: "Modernidade luxuosa, o edifício mais alto do mundo e aventura no deserto", AR: "الحداثة الفاخرة وأطول مبنى في العالم والمغامرة الصحراوية", RU: "Роскошная современность, самое высокое здание в мире и приключения в пустыне",
    },
    top_food: {
      TW: "阿拉伯烤肉、椰棗", EN: "Arabic kebab, dates", JP: "アラビアケバブ、デーツ", KR: "아랍어 케밥, 날짜", FR: "Kebab arabe, dattes", ES: "Kebab árabe, dátiles", ID: "Kebab arab, kurma", HI: "अरबी कबाब, खजूर", PT: "Kebab árabe, tâmaras", AR: "كباب عربي، تمر", RU: "Арабский кебаб, финики",
    },
    must_visit_spot: {
      TW: "哈里發塔、帆船酒店", EN: "Burj Khalifa, Burj Al Arab", JP: "ブルジュ・ハリファ、ブルジュ・アル・アラブ", KR: "버즈 칼리파, 버즈 알 아랍", FR: "Burj Khalifa, Burj Al Arab", ES: "Burj Khalifa, Burj Al Arab", ID: "Burj Khalifa, Burj Al-Arab", HI: "बुर्ज खलीफा, बुर्ज अल अरब", PT: "Burj Khalifa, Burj Al Arab", AR: "برج خليفة، برج العرب", RU: "Бурдж Халифа, Бурдж Аль Араб",
    }
  },
  "羅馬": {
    name: {
      TW: "羅馬", EN: "rome", JP: "ローマ", KR: "로마", FR: "Rome", ES: "Roma", ID: "Roma", HI: "रोम", PT: "Roma", AR: "روما", RU: "Рим",
    },
    description: {
      TW: "永恆之城，古羅馬建築與歷史博物館", EN: "Eternal City, Museum of Ancient Roman Architecture and History", JP: "永遠の都、古代ローマ建築と歴史博物館", KR: "영원한 도시, 고대 로마 건축 및 역사 박물관", FR: "Ville Eternelle, Musée d'Architecture et d'Histoire de la Rome Antique", ES: "Ciudad Eterna, Museo de Arquitectura e Historia Romana Antigua", ID: "Kota Abadi, Museum Arsitektur dan Sejarah Romawi Kuno", HI: "शाश्वत शहर, प्राचीन रोमन वास्तुकला और इतिहास का संग्रहालय", PT: "Cidade Eterna, Museu de Arquitetura e História da Roma Antiga", AR: "المدينة الخالدة، متحف العمارة والتاريخ الروماني القديم", RU: "Вечный город, Музей древнеримской архитектуры и истории",
    },
    top_food: {
      TW: "培根蛋麵、Gelato", EN: "Carbonara, Gelato", JP: "カルボナーラ、ジェラート", KR: "까르보나라, 젤라또", FR: "Carbonara, Gelato", ES: "carbonara, helado", ID: "Carbonara, Gelato", HI: "कार्बोनारा, जेलाटो", PT: "Carbonara, Gelato", AR: "كاربونارا، جيلاتو", RU: "Карбонара, Джелато",
    },
    must_visit_spot: {
      TW: "競技場、許願池", EN: "Arena, Trevi Fountain", JP: "アリーナ、トレビの泉", KR: "아레나, 트레비분수", FR: "Arène, Fontaine de Trevi", ES: "Arena, Fontana de Trevi", ID: "Arena, Air Mancur Trevi", HI: "अखाड़ा, ट्रेवी फाउंटेन", PT: "Arena, Fontana di Trevi", AR: "الساحة، نافورة تريفي", RU: "Арена, Фонтан Треви",
    }
  },
  "巴塞隆拿": {
    name: {
      TW: "巴塞隆拿", EN: "barcelona", JP: "バルセロナ", KR: "바르셀로나", FR: "Barcelone", ES: "Barcelona", ID: "barcelona", HI: "बार्सिलोना", PT: "Barcelona", AR: "برشلونة", RU: "Барселона",
    },
    description: {
      TW: "建築奇蹟，地中海陽光與藝術氛圍", EN: "Architectural wonders, Mediterranean sunshine and artistic atmosphere", JP: "驚異の建築、地中海の太陽の光、芸術的な雰囲気", KR: "경이로운 건축물, 지중해의 햇살, 예술적인 분위기", FR: "Merveilles architecturales, soleil méditerranéen et ambiance artistique", ES: "Maravillas arquitectónicas, sol mediterráneo y atmósfera artística", ID: "Keajaiban arsitektur, sinar matahari Mediterania, dan suasana artistik", HI: "वास्तुकला के चमत्कार, भूमध्यसागरीय धूप और कलात्मक वातावरण", PT: "Maravilhas arquitetônicas, sol mediterrâneo e atmosfera artística", AR: "عجائب معمارية وأشعة شمس البحر الأبيض المتوسط ​​وأجواء فنية", RU: "Архитектурные чудеса, средиземноморское солнце и художественная атмосфера",
    },
    top_food: {
      TW: "海鮮燉飯、Tapas", EN: "Seafood stew, tapas", JP: "シーフードシチュー、タパス", KR: "해산물 스튜, 타파스", FR: "Ragoût de fruits de mer, tapas", ES: "Guiso de marisco, tapas", ID: "Rebusan makanan laut, tapas", HI: "समुद्री भोजन स्टू, तपस", PT: "Ensopado de marisco, tapas", AR: "يخنة المأكولات البحرية، التاباس", RU: "Рагу из морепродуктов, тапас",
    },
    must_visit_spot: {
      TW: "聖家堂、奎爾公園", EN: "Sagrada Familia, Park Guell", JP: "サグラダファミリア、グエル公園", KR: "사그라다 파밀리아, 구엘 공원", FR: "Sagrada Familia, Parc Güell", ES: "Sagrada Familia, Parque Güell", ID: "Sagrada Familia, Park Guell", HI: "सागरदा फ़मिलिया, पार्क गुएल", PT: "Sagrada Família, Parque Guell", AR: "ساجرادا فاميليا، بارك جويل", RU: "Саграда Фамилия, Парк Гуэль",
    }
  },
  "首爾": {
    name: {
      TW: "首爾", EN: "Seoul", JP: "ソウル", KR: "서울", FR: "Séoul", ES: "Seúl", ID: "seoul", HI: "सोल", PT: "Seul", AR: "سيول", RU: "Сеул",
    },
    description: {
      TW: "K-Pop 聖地，美妝購物與現代生活", EN: "K-Pop mecca, beauty shopping and modern life", JP: "K-POPのメッカ、ビューティーショッピングと現代生活", KR: "K-Pop의 메카, 뷰티 쇼핑과 현대 생활", FR: "Mecque de la K-Pop, du shopping beauté et de la vie moderne", ES: "La meca del K-Pop, los centros de belleza y la vida moderna", ID: "Kiblat K-Pop, belanja kecantikan, dan kehidupan modern", HI: "के-पॉप मक्का, सौंदर्य खरीदारी और आधुनिक जीवन", PT: "Meca do K-Pop, compras de produtos de beleza e vida moderna", AR: "الكيبوب مكة، تسوق الجمال والحياة العصرية", RU: "Мекка K-Pop, бьюти-шопинг и современная жизнь",
    },
    top_food: {
      TW: "韓式烤肉、拌飯", EN: "Korean BBQ, bibimbap", JP: "韓国焼き肉、ビビンバ", KR: "한국식 바비큐, 비빔밥", FR: "BBQ coréen, bibimbap", ES: "Barbacoa coreana, bibimbap", ID: "BBQ Korea, bibimbap", HI: "कोरियाई बीबीक्यू, बिबिंबैप", PT: "Churrasco coreano, bibimbap", AR: "مشويات كورية، بيبيمباب", RU: "Корейское барбекю, пибимбап",
    },
    must_visit_spot: {
      TW: "景福宮、明洞", EN: "Gyeongbokgung Palace, Myeongdong", JP: "景福宮、明洞", KR: "경복궁, 명동", FR: "Palais Gyeongbokgung, Myeongdong", ES: "Palacio Gyeongbokgung, Myeongdong", ID: "Istana Gyeongbokgung, Myeongdong", HI: "ग्योंगबोकगंग पैलेस, मायओंगडोंग", PT: "Palácio Gyeongbokgung, Myeongdong", AR: "قصر جيونج بوكجيونج في ميونج دونج", RU: "Дворец Кёнбоккун, Мёндон",
    }
  },
  "台北": {
    name: {
      TW: "台北", EN: "Taipei", JP: "台北", KR: "타이페이", FR: "Taïpei", ES: "Taipéi", ID: "Taipei", HI: "ताइपे", PT: "Taipei", AR: "تايبيه", RU: "Тайбэй",
    },
    description: {
      TW: "熱情好客，夜市文化與便利生活", EN: "Hospitality, night market culture and convenient life", JP: "おもてなし、夜市文化、便利な生活", KR: "환대와 야시장 문화, 편리한 생활", FR: "Hospitalité, culture du marché nocturne et vie pratique", ES: "Hospitalidad, cultura de mercado nocturno y vida cómoda.", ID: "Keramahan, budaya pasar malam, dan kehidupan yang nyaman", HI: "आतिथ्य, रात्रि बाज़ार संस्कृति और सुविधाजनक जीवन", PT: "Hospitalidade, cultura do mercado noturno e vida conveniente", AR: "الضيافة وثقافة السوق الليلي والحياة المريحة", RU: "Гостеприимство, культура ночного рынка и удобная жизнь",
    },
    top_food: {
      TW: "牛肉麵、小籠包", EN: "Beef noodles, xiaolongbao", JP: "牛肉麺、小籠包", KR: "쇠고기 국수, 샤오롱바오", FR: "Nouilles au bœuf, xiaolongbao", ES: "Fideos con carne, xiaolongbao", ID: "Mie daging sapi, xiaolongbao", HI: "बीफ़ नूडल्स, ज़ियाओलोंगबाओ", PT: "Macarrão de carne, xiaolongbao", AR: "نودلز لحم البقر، شياولونغباو", RU: "Лапша с говядиной, сяолунбао",
    },
    must_visit_spot: {
      TW: "101大樓、九份", EN: "101 Building, Jiufen", JP: "九份101ビル", KR: "101 빌딩, 지우펀", FR: "Bâtiment 101, Jiufen", ES: "Edificio 101, Jiufen", ID: "Gedung 101, Jiufen", HI: "101 बिल्डिंग, जिउफेन", PT: "Edifício 101, Jiufen", AR: "مبنى 101، جيوفين", RU: "Дом 101, Цзюфэнь",
    }
  },
  "大阪": {
    name: {
      TW: "大阪", EN: "Osaka", JP: "大阪", KR: "오사카", FR: "Ōsaka", ES: "Osaka", ID: "Osaka", HI: "ओसाका", PT: "Osaca", AR: "أوساكا", RU: "Осака",
    },
    description: {
      TW: "天下之廚房，關西熱情與環球影城", EN: "Kitchen of the World, Kansai Passion and Universal Studios", JP: "世界のキッチン、関西パッション、ユニバーサルスタジオ", KR: "세계의 주방, 간사이 패션, 유니버셜 스튜디오", FR: "Cuisine du monde, Kansai Passion et Universal Studios", ES: "Cocina del mundo, Kansai Passion y Universal Studios", ID: "Dapur Dunia, Kansai Passion, dan Universal Studios", HI: "किचन ऑफ द वर्ल्ड, कंसाई पैशन और यूनिवर्सल स्टूडियो", PT: "Cozinha do Mundo, Kansai Passion e Universal Studios", AR: "مطبخ العالم، كانساي باشن ويونيفرسال ستوديوز", RU: "Кухня мира, Kansai Passion и Universal Studios",
    },
    top_food: {
      TW: "章魚燒、大阪燒", EN: "Takoyaki, Okonomiyaki", JP: "たこ焼き、お好み焼き", KR: "타코야끼, 오코노미야키", FR: "Takoyaki, Okonomiyaki", ES: "Takoyaki, Okonomiyaki", ID: "Takoyaki, Okonomiyaki", HI: "ताकोयाकी, ओकोनोमियाकी", PT: "Takoyaki, Okonomiyaki", AR: "تاكوياكي، أوكونوميياكي", RU: "Такояки, Окономияки",
    },
    must_visit_spot: {
      TW: "道頓堀、大阪城", EN: "Dotonbori, Osaka Castle", JP: "道頓堀、大阪城", KR: "도톤보리, 오사카성", FR: "Dotonbori, château d'Osaka", ES: "Dotonbori, Castillo de Osaka", ID: "Dotonbori, Istana Osaka", HI: "डोटोनबोरी, ओसाका कैसल", PT: "Dotonbori, Castelo de Osaka", AR: "دوتونبوري، قلعة أوساكا", RU: "Дотонбори, Замок Осаки",
    }
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
    }
  },
  "雪梨": {
    name: {
      TW: "雪梨", EN: "Sydney", JP: "シドニー", KR: "시드니", FR: "Sidney", ES: "Sídney", ID: "Sidney", HI: "सिडनी", PT: "Sidney", AR: "سيدني", RU: "Сидней",
    },
    description: {
      TW: "海灣之美，戶外生活與標誌性歌劇院", EN: "The beauty of the bay, outdoor living and the iconic Opera House", JP: "湾の美しさ、アウトドアリビング、そして象徴的なオペラハウス", KR: "만의 아름다움, 야외 생활, 상징적인 오페라 하우스", FR: "La beauté de la baie, la vie en plein air et l'emblématique Opéra", ES: "La belleza de la bahía, la vida al aire libre y la icónica Ópera", ID: "Keindahan teluk, kehidupan luar ruangan, dan Gedung Opera yang ikonik", HI: "खाड़ी की सुंदरता, बाहरी जीवन और प्रतिष्ठित ओपेरा हाउस", PT: "A beleza da baía, a vida ao ar livre e a icônica Opera House", AR: "جمال الخليج والمعيشة في الهواء الطلق ودار الأوبرا الشهيرة", RU: "Красота залива, жизнь на свежем воздухе и знаменитый Оперный театр.",
    },
    top_food: {
      TW: "澳洲和牛、海鮮", EN: "Australian Wagyu beef, seafood", JP: "オーストラリア産和牛、魚介類", KR: "호주산 와규, 해산물", FR: "Bœuf Wagyu australien, fruits de mer", ES: "Carne Wagyu australiana, marisco", ID: "Daging sapi Wagyu Australia, makanan laut", HI: "ऑस्ट्रेलियाई वाग्यू गोमांस, समुद्री भोजन", PT: "Carne Wagyu australiana, frutos do mar", AR: "لحم واغيو الاسترالي، المأكولات البحرية", RU: "Австралийская говядина вагю, морепродукты",
    },
    must_visit_spot: {
      TW: "雪梨歌劇院、邦代海灘", EN: "Sydney Opera House, Bondi Beach", JP: "シドニーオペラハウス、ボンダイビーチ", KR: "시드니 오페라 하우스, 본다이 비치", FR: "Opéra de Sydney, plage de Bondi", ES: "Ópera de Sídney, Bondi Beach", ID: "Gedung Opera Sydney, Pantai Bondi", HI: "सिडनी ओपेरा हाउस, बॉन्डी बीच", PT: "Ópera de Sydney, Bondi Beach", AR: "دار أوبرا سيدني، شاطئ بوندي", RU: "Сиднейский оперный театр, Бонди-Бич",
    }
  },
  "阿姆斯特丹": {
    name: {
      TW: "阿姆斯特丹", EN: "amsterdam", JP: "アムステルダム", KR: "암스테르담", FR: "amsterdam", ES: "ámsterdam", ID: "amsterdam", HI: "एम्सटर्डम", PT: "Amsterdã", AR: "أمستردام", RU: "Амстердам",
    },
    description: {
      TW: "運河之城，自由奔放與博物館之旅", EN: "The city of canals, free spirit and museum tours", JP: "運河の街、自由な精神、美術館ツアー", KR: "운하, 자유로운 영혼, 박물관 투어의 도시", FR: "La ville des canaux, esprit libre et visites de musées", ES: "La ciudad de los canales, espíritu libre y visitas a museos", ID: "Kota kanal, semangat bebas, dan tur museum", HI: "नहरों का शहर, मुक्त आत्मा और संग्रहालय पर्यटन", PT: "A cidade dos canais, do espírito livre e dos passeios em museus", AR: "مدينة القنوات والروح الحرة وجولات المتحف", RU: "Город каналов, свободный дух и экскурсии по музеям",
    },
    top_food: {
      TW: "生醃鯡魚、荷蘭煎餅", EN: "Raw pickled herring, Dutch pancakes", JP: "生ニシンのピクルス、オランダのパンケーキ", KR: "생 청어 절임, 네덜란드식 팬케이크", FR: "Hareng cru mariné, crêpes hollandaises", ES: "Arenque crudo en escabeche, panqueques holandeses", ID: "Ikan haring acar mentah, pancake Belanda", HI: "कच्चे अचार वाली हेरिंग, डच पैनकेक", PT: "Arenque cru em conserva, panquecas holandesas", AR: "رنجة مخللة خام، فطائر هولندية", RU: "Сырая маринованная сельдь, голландские блины",
    },
    must_visit_spot: {
      TW: "梵谷博物館、安妮之家", EN: "Van Gogh Museum, Anne Frank House", JP: "ゴッホ美術館、アンネ・フランクの家", KR: "반고흐 미술관, 안네 프랑크의 집", FR: "Musée Van Gogh, Maison d'Anne Frank", ES: "Museo Van Gogh, Casa de Ana Frank", ID: "Museum Van Gogh, Rumah Anne Frank", HI: "वान गाग संग्रहालय, ऐनी फ्रैंक हाउस", PT: "Museu Van Gogh, Casa de Anne Frank", AR: "متحف فان جوخ، بيت آن فرانك", RU: "Музей Ван Гога, Дом Анны Франк",
    }
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
    }
  },
  "布拉格": {
    name: {
      TW: "布拉格", EN: "Prague", JP: "プラハ", KR: "프라하", FR: "Prague", ES: "Praga", ID: "Praha", HI: "प्राहा", PT: "Praga", AR: "براغ", RU: "Прага",
    },
    description: {
      TW: "中世紀童話，紅磚瓦與波希米亞風情", EN: "Medieval fairy tale, red bricks and bohemian style", JP: "中世のおとぎ話、赤レンガ、ボヘミアン スタイル", KR: "중세 동화, 붉은 벽돌, 보헤미안 스타일", FR: "Conte de fée médiéval, briques rouges et style bohème", ES: "Cuento de hadas medieval, ladrillos rojos y estilo bohemio.", ID: "Dongeng abad pertengahan, bata merah, dan gaya bohemian", HI: "मध्यकालीन परी कथा, लाल ईंटें और बोहेमियन शैली", PT: "Conto de fadas medieval, tijolos vermelhos e estilo boêmio", AR: "حكاية خرافية من العصور الوسطى والطوب الأحمر والأسلوب البوهيمي", RU: "Средневековая сказка, красный кирпич и богемный стиль.",
    },
    top_food: {
      TW: "烤豬腳、捷克啤酒", EN: "Roasted pig's feet, Czech beer", JP: "豚足のロースト、チェコビール", KR: "구운 족발, 체코 맥주", FR: "Pieds de porc rôtis, bière tchèque", ES: "Patas de cerdo asadas, cerveza checa", ID: "Kaki babi panggang, bir Ceko", HI: "भुने हुए सुअर के पैर, चेक बियर", PT: "Pés de porco assados, cerveja checa", AR: "أقدام خنزير مشوية، بيرة تشيكية", RU: "Жареные свиные ножки, чешское пиво.",
    },
    must_visit_spot: {
      TW: "查理大橋、布拉格城堡", EN: "Charles Bridge, Prague Castle", JP: "カレル橋、プラハ城", KR: "카를교, 프라하 성", FR: "Pont Charles, Château de Prague", ES: "Puente de Carlos, Castillo de Praga", ID: "Jembatan Charles, Kastil Praha", HI: "चार्ल्स ब्रिज, प्राग कैसल", PT: "Ponte Carlos, Castelo de Praga", AR: "جسر تشارلز، قلعة براغ", RU: "Карлов мост, Пражский Град",
    }
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
    }
  },
  "維也納": {
    name: {
      TW: "維也納", EN: "vienna", JP: "ウィーン", KR: "비엔나", FR: "Vienne", ES: "viena", ID: "Wina", HI: "वियना", PT: "Viena", AR: "فيينا", RU: "Вена",
    },
    description: {
      TW: "音樂之都，古典建築與皇室咖啡館", EN: "City of music, classical architecture and royal cafes", JP: "音楽の街、古典的な建築、王室のカフェ", KR: "음악의 도시, 고전 건축물과 왕실 카페", FR: "Ville de musique, d'architecture classique et de cafés royaux", ES: "Ciudad de la música, arquitectura clásica y cafés reales", ID: "Kota musik, arsitektur klasik, dan kafe kerajaan", HI: "संगीत, शास्त्रीय वास्तुकला और शाही कैफे का शहर", PT: "Cidade da música, arquitetura clássica e cafés reais", AR: "مدينة الموسيقى والعمارة الكلاسيكية والمقاهي الملكية", RU: "Город музыки, классической архитектуры и королевских кафе",
    },
    top_food: {
      TW: "炸牛排、薩赫蛋糕", EN: "Fried Steak, Sacher Torte", JP: "フライドステーキ、ザッハトルテ", KR: "프라이드 스테이크, 자허 토르테", FR: "Steak Frit, Torte Sacher", ES: "Filete Frito, Torta Sacher", ID: "Steak Goreng, Sacher Torte", HI: "फ्राइड स्टेक, सचर टोर्टे", PT: "Bife Frito, Sacher Torte", AR: "شريحة لحم مقلية، تورتة زاخر", RU: "Жареный стейк, торт Захер",
    },
    must_visit_spot: {
      TW: "美泉宮、國家歌劇院", EN: "Schönbrunn Palace, State Opera House", JP: "シェーンブルン宮殿、国立歌劇場", KR: "쇤부른 궁전, 국립 오페라 하우스", FR: "Château de Schönbrunn, Opéra national", ES: "Palacio de Schönbrunn, Ópera Estatal", ID: "Istana Schönbrunn, Gedung Opera Negara", HI: "शॉनब्रुन पैलेस, स्टेट ओपेरा हाउस", PT: "Palácio de Schönbrunn, Ópera Estatal", AR: "قصر شونبرون، دار الأوبرا الحكومية", RU: "Дворец Шенбрунн, Государственный оперный театр",
    }
  },
  "柏林": {
    name: {
      TW: "柏林", EN: "Berlin", JP: "ベルリン", KR: "베를린", FR: "Berlin", ES: "Berlina", ID: "Berlin", HI: "बर्लिन", PT: "Berlim", AR: "برلين", RU: "Берлин",
    },
    description: {
      TW: "歷史傷痕與次文化融合，前衛藝術基地", EN: "Fusion of historical scars and subculture, avant-garde art base", JP: "歴史の傷跡とサブカルチャーの融合、前衛芸術の拠点", KR: "역사적 상처와 서브컬쳐의 융합, 아방가르드 예술의 베이스", FR: "Fusion des cicatrices historiques et de la sous-culture, base artistique d'avant-garde", ES: "Fusión de cicatrices históricas y subcultura, base artística de vanguardia.", ID: "Perpaduan bekas luka sejarah dan subkultur, basis seni avant-garde", HI: "ऐतिहासिक निशानों और उपसंस्कृति का संलयन, अवांट-गार्डे कला आधार", PT: "Fusão de cicatrizes históricas e subcultura, base artística de vanguarda", AR: "مزيج من الندبات التاريخية والثقافة الفرعية، وقاعدة فنية طليعية", RU: "Слияние исторических шрамов и субкультуры, основа авангардного искусства.",
    },
    top_food: {
      TW: "咖喱香腸、土耳其旋轉烤肉", EN: "Currywurst, Turkish Roast", JP: "カリーヴルスト、ターキッシュロースト", KR: "커리부르스트, 터키식 로스트", FR: "Currywurst, Rôti Turc", ES: "Currywurst, asado turco", ID: "Currywurst, Panggang Turki", HI: "करीवुर्स्ट, टर्किश रोस्ट", PT: "Currywurst, assado turco", AR: "كوريوورست، مشوي تركي", RU: "Карривурст, турецкое жаркое",
    },
    must_visit_spot: {
      TW: "布蘭登堡門、柏林圍牆", EN: "Brandenburg Gate, Berlin Wall", JP: "ブランデンブルク門、ベルリンの壁", KR: "브란덴부르크 문, 베를린 장벽", FR: "Porte de Brandebourg, mur de Berlin", ES: "Puerta de Brandenburgo, Muro de Berlín", ID: "Gerbang Brandenburg, Tembok Berlin", HI: "ब्रैंडेनबर्ग गेट, बर्लिन की दीवार", PT: "Portão de Brandemburgo, Muro de Berlim", AR: "بوابة براندنبورغ، جدار برلين", RU: "Бранденбургские ворота, Берлинская стена",
    }
  },
  "馬德里": {
    name: {
      TW: "馬德里", EN: "madrid", JP: "マドリード", KR: "마드리드", FR: "Madrid", ES: "Madrid", ID: "Madrid", HI: "मैड्रिड", PT: "Madri", AR: "مدريد", RU: "Мадрид",
    },
    description: {
      TW: "熱情的廣場文化，不夜城的夜生活", EN: "Passionate square culture and nightlife in the city that never sleeps", JP: "眠らない街の情熱的な広場文化とナイトライフ", KR: "잠들지 않는 도시의 열정적인 광장 문화와 나이트라이프", FR: "Culture carrée passionnée et vie nocturne dans la ville qui ne dort jamais", ES: "Apasionada cultura de plaza y vida nocturna en la ciudad que nunca duerme", ID: "Budaya alun-alun yang penuh gairah dan kehidupan malam di kota yang tidak pernah tidur", HI: "शहर की जोशीली चौक संस्कृति और रात्रिजीवन जो कभी नहीं सोता", PT: "Cultura quadrada apaixonante e vida noturna na cidade que nunca dorme", AR: "ثقافة الساحة العاطفية والحياة الليلية في المدينة التي لا تنام", RU: "Страстная скверная культура и ночная жизнь в городе, который никогда не спит",
    },
    top_food: {
      TW: "吉拿棒、馬德里燉菜", EN: "Chipotle, Madrid stew", JP: "チポトレ、マドリッドシチュー", KR: "치폴레, 마드리드 스튜", FR: "Chipotle, ragoût de Madrid", ES: "Chipotle, cocido madrileño", ID: "Chipotle, sup Madrid", HI: "चिपोटल, मैड्रिड स्टू", PT: "Chipotle, guisado madrileno", AR: "شيبوتل، يخنة مدريد", RU: "Чипотле, Мадридское рагу",
    },
    must_visit_spot: {
      TW: "普拉多博物館、太陽門廣場", EN: "Prado Museum, Puerta del Sol", JP: "プラド美術館、プエルタ デル ソル", KR: "프라도 미술관, 푸에르타 델 솔", FR: "Musée du Prado, Puerta del Sol", ES: "Museo del Prado, Puerta del Sol", ID: "Museum Prado, Puerta del Sol", HI: "प्राडो संग्रहालय, पुएर्ता डेल सोल", PT: "Museu do Prado, Puerta del Sol", AR: "متحف برادو، بويرتا ديل سول", RU: "Музей Прадо, Пуэрта дель Соль.",
    }
  },
  "里斯本": {
    name: {
      TW: "里斯本", EN: "lisbon", JP: "リスボン", KR: "리스본", FR: "Lisbonne", ES: "Lisboa", ID: "Lisbon", HI: "लिस्बन", PT: "Lisboa", AR: "لشبونة", RU: "Лиссабон",
    },
    description: {
      TW: "七丘之城，懷舊電車與絕美花磚", EN: "The city of seven hills, nostalgic trams and stunning tiles", JP: "7つの丘、ノスタルジックな路面電車、見事なタイルの街", KR: "일곱 개의 언덕, 향수를 불러일으키는 트램, 아름다운 타일로 이루어진 도시", FR: "La ville aux sept collines, aux tramways nostalgiques et aux superbes tuiles", ES: "La ciudad de las siete colinas, tranvías nostálgicos y azulejos impresionantes", ID: "Kota tujuh bukit, trem nostalgia, dan ubin yang menakjubkan", HI: "सात पहाड़ियों, पुरानी यादों वाली ट्रामों और आश्चर्यजनक टाइलों का शहर", PT: "A cidade das sete colinas, eléctricos nostálgicos e azulejos deslumbrantes", AR: "مدينة التلال السبعة والترام الحنين والبلاط المذهل", RU: "Город семи холмов, ностальгические трамваи и потрясающая плитка",
    },
    top_food: {
      TW: "葡式蛋塔、馬介休", EN: "Portuguese egg tart, Ma Jiexiu", JP: "ポルトガルのエッグタルト、馬継秀", KR: "포르투갈식 에그타르트, 마지에시우(Ma Jiexiu)", FR: "Tarte aux œufs portugaise, Ma Jiexiu", ES: "Tarta de huevo portuguesa, Ma Jiexiu", ID: "Pelacur telur Portugis, Ma Jiexiu", HI: "पुर्तगाली अंडा टार्ट, मा जिएक्सिउ", PT: "Torta de ovo portuguesa, Ma Jiexiu", AR: "تورتة البيض البرتغالية، ما جيكسيو", RU: "Португальский яичный пирог Ма Цзесю",
    },
    must_visit_spot: {
      TW: "貝倫塔、聖喬治城堡", EN: "Belem Tower, Castle of Saint George", JP: "ベレンの塔、聖ジョージ城", KR: "벨렘 타워, 세인트 조지 성", FR: "Tour de Belém, Château de Saint Georges", ES: "Torre de Belem, Castillo de San Jorge", ID: "Menara Belem, Kastil Saint George", HI: "बेलेम टॉवर, सेंट जॉर्ज का महल", PT: "Torre de Belém, Castelo de São Jorge", AR: "برج بيليم، قلعة القديس جاورجيوس", RU: "Белемская башня, замок Святого Георгия",
    }
  },
  "雅典": {
    name: {
      TW: "雅典", EN: "athens", JP: "アテネ", KR: "아테네", FR: "Athènes", ES: "Atenas", ID: "Athena", HI: "एथेंस", PT: "Atenas", AR: "أثينا", RU: "Афины",
    },
    description: {
      TW: "西方文明發源地，古希臘神廟遺址", EN: "The birthplace of Western civilization, ruins of ancient Greek temples", JP: "西洋文明発祥の地、古代ギリシャの神殿遺跡", KR: "서구 문명의 발상지, 고대 그리스 신전 유적", FR: "Berceau de la civilisation occidentale, ruines d'anciens temples grecs", ES: "La cuna de la civilización occidental, ruinas de antiguos templos griegos.", ID: "Tempat kelahiran peradaban Barat, reruntuhan kuil Yunani kuno", HI: "पश्चिमी सभ्यता का जन्मस्थान, प्राचीन यूनानी मंदिरों के खंडहर", PT: "O berço da civilização ocidental, ruínas de antigos templos gregos", AR: "مهد الحضارة الغربية وأطلال المعابد اليونانية القديمة", RU: "Родина западной цивилизации, руины древнегреческих храмов",
    },
    top_food: {
      TW: "希臘捲餅、穆薩卡", EN: "Greek Burritos, Moussaka", JP: "ギリシャ風ブリトー、ムサカ", KR: "그리스 부리토, 무사카", FR: "Burritos grecs, moussaka", ES: "Burritos Griegos, Moussaka", ID: "Burrito Yunani, Moussaka", HI: "ग्रीक बुरिटोस, मौसाका", PT: "Burritos Gregos, Moussaka", AR: "بوريتوس اليونانية، مسقعة", RU: "Греческий буррито, мусака",
    },
    must_visit_spot: {
      TW: "衛城、帕德嫩神廟", EN: "Acropolis, Parthenon", JP: "アクロポリス、パルテノン神殿", KR: "아크로폴리스, 파르테논 신전", FR: "Acropole, Parthénon", ES: "Acrópolis, Partenón", ID: "Akropolis, Parthenon", HI: "एक्रोपोलिस, पार्थेनन", PT: "Acrópole, Partenon", AR: "الأكروبوليس، البارثينون", RU: "Акрополь, Парфенон",
    }
  },
  "胡志明市": {
    name: {
      TW: "胡志明市", EN: "Ho Chi Minh City", JP: "ホーチミン市", KR: "호치민시", FR: "Hô Chi Minh-Ville", ES: "Ciudad Ho Chi Minh", ID: "Kota Ho Chi Minh", HI: "हो ची मिन्ह सिटी", PT: "Cidade de Ho Chi Minh", AR: "مدينة هوشي منه", RU: "Хошимин",
    },
    description: {
      TW: "法式殖民風情與現代摩托大軍的碰撞", EN: "The collision of French colonial style and modern motorcycle army", JP: "フレンチコロニアルスタイルと現代のバイク軍団の衝突", KR: "프랑스 식민지 스타일과 현대 오토바이 군대의 충돌", FR: "La collision du style colonial français et de l’armée de motos moderne", ES: "La colisión entre el estilo colonial francés y el moderno ejército de motociclistas", ID: "Benturan gaya kolonial Perancis dan sepeda motor tentara modern", HI: "फ्रांसीसी औपनिवेशिक शैली और आधुनिक मोटरसाइकिल सेना की टक्कर", PT: "A colisão do estilo colonial francês e do moderno exército de motocicletas", AR: "التصادم بين الطراز الاستعماري الفرنسي وجيش الدراجات النارية الحديث", RU: "Столкновение французского колониального стиля и современной мотоциклетной армии.",
    },
    top_food: {
      TW: "越南河粉、法式麵包", EN: "Vietnamese pho, French bread", JP: "ベトナムのフォー、フランスパン", KR: "베트남 쌀국수, 프랑스빵", FR: "Pho vietnamien, pain français", ES: "Pho vietnamita, pan francés", ID: "Pho Vietnam, roti Perancis", HI: "वियतनामी फो, फ़्रेंच ब्रेड", PT: "Pho vietnamita, pão francês", AR: "فو الفيتنامية، الخبز الفرنسي", RU: "Вьетнамское фо, французский хлеб",
    },
    must_visit_spot: {
      TW: "粉紅教堂、咖啡公寓", EN: "Pink church, coffee apartment", JP: "ピンクの教会、コーヒーアパートメント", KR: "핑크 교회, 커피 아파트", FR: "Église rose, appartement de café", ES: "Iglesia rosa, apartamento café.", ID: "Gereja merah muda, apartemen kopi", HI: "गुलाबी चर्च, कॉफ़ी अपार्टमेंट", PT: "Igreja rosa, apartamento café", AR: "الكنيسة الوردية، شقة القهوة", RU: "Розовая церковь, кофейная квартира",
    }
  },
  "斯德哥爾摩": {
    name: {
      TW: "斯德哥爾摩", EN: "斯德哥爾摩", JP: "斯德哥爾摩", KR: "스톡홀름", FR: "Stockholm", ES: "Estocolmo", ID: "Stockholm", HI: "स्टॉकहोम", PT: "Estocolmo", AR: "ستوكهولم", RU: "Стокгольм",
    },
    description: {
      TW: "北歐設計感，散落在島嶼間的水上之都", EN: "北歐設計感，散落在島嶼間的水上之都", JP: "北歐設計感，散落在島嶼間的水上之都", KR: "북유럽 디자인 감각, 물의 수도에 있는 섬들 사이에 흩어져 있음", FR: "Le sens du design nordique, dispersé parmi les îles de la capitale de l'eau", ES: "Sentido del diseño nórdico, repartido entre las islas de la capital del agua.", ID: "Selera desain Nordik, tersebar di antara pulau-pulau di ibu kota perairan", HI: "नॉर्डिक डिजाइन भावना, जल राजधानी में द्वीपों के बीच बिखरी हुई", PT: "Sentido de design nórdico, espalhado pelas ilhas da capital da água", AR: "إحساس بالتصميم الاسكندنافي، منتشر بين الجزر في العاصمة المائية", RU: "Скандинавский дизайн, разбросанный по островам водной столицы",
    },
    top_food: {
      TW: "瑞典肉丸、鯡魚", EN: "瑞典肉丸、鯡魚", JP: "瑞典肉丸、鯡魚", KR: "스웨덴 미트볼, 청어", FR: "Boulettes de viande suédoises, hareng", ES: "Albóndigas suecas, arenque", ID: "Bakso Swedia, ikan haring", HI: "स्वीडिश मीटबॉल, हेरिंग", PT: "Almôndegas suecas, arenque", AR: "كرات اللحم السويدية والرنجة", RU: "Шведские котлеты, селедка",
    },
    must_visit_spot: {
      TW: "斯德哥爾摩老城 (Gamla Stan)", EN: "斯德哥爾摩老城 (Gamla Stan)", JP: "斯德哥爾摩老城 (Gamla Stan)", KR: "스톡홀름 구시가지(감라스탄)", FR: "Vieille ville de Stockholm (Gamla Stan)", ES: "Casco antiguo de Estocolmo (Gamla Stan)", ID: "Kota Tua Stockholm (Gamla Stan)", HI: "स्टॉकहोम ओल्ड टाउन (गामला स्टेन)", PT: "Cidade Velha de Estocolmo (Gamla Stan)", AR: "مدينة ستوكهولم القديمة (جاملا ستان)", RU: "Старый город Стокгольма (Гамла Стан)",
    }
  },
  "哥本哈根": {
    name: {
      TW: "哥本哈根", EN: "copenhagen", JP: "コペンハーゲン", KR: "코펜하겐", FR: "Copenhague", ES: "Copenhague", ID: "Kopenhagen", HI: "कोपेनहेगन", PT: "copenhague", AR: "كوبنهاغن", RU: "Копенгаген",
    },
    description: {
      TW: "最幸福的城市，單車友善與新港彩色屋", EN: "The happiest city, bike-friendly and colorful houses in Newport", JP: "ニューポートの最も幸せな街、自転車に優しい、カラフルな家々", KR: "뉴포트에서 가장 행복한 도시, 자전거 친화적이고 다채로운 주택", FR: "La ville la plus heureuse, les vélos et les maisons colorées de Newport", ES: "La ciudad más feliz, casas coloridas y aptas para bicicletas en Newport", ID: "Kota paling bahagia, rumah ramah sepeda dan penuh warna di Newport", HI: "न्यूपोर्ट में सबसे खुशहाल शहर, बाइक-अनुकूल और रंगीन घर", PT: "A cidade mais feliz, casas coloridas e adequadas para bicicletas em Newport", AR: "أسعد مدينة ومنازل ملونة وصديقة للدراجات في نيوبورت", RU: "Самый счастливый город, велосипедисты и красочные дома в Ньюпорте",
    },
    top_food: {
      TW: "開放式三明治 (Smørrebrød)", EN: "Open Sandwich (Smørrebrød)", JP: "オープンサンドイッチ（スモーブロー）", KR: "오픈 샌드위치 (Smørrebrød)", FR: "Sandwich ouvert (Smørrebrød)", ES: "Sándwich Abierto (Smørrebrød)", ID: "Sandwich Terbuka (Smørrebrød)", HI: "ओपन सैंडविच (स्मोरेब्रोड)", PT: "Sanduíche Aberto (Smørrebrød)", AR: "ساندويتش مفتوح (Smørrebrød)", RU: "Открытый сэндвич (Смёрребрёд)",
    },
    must_visit_spot: {
      TW: "小美人魚像、蒂沃利花園", EN: "The Little Mermaid, Tivoli Gardens", JP: "リトル・マーメイド、チボリ公園", KR: "인어공주, 티볼리 정원", FR: "La Petite Sirène, Jardins de Tivoli", ES: "La Sirenita, Jardines de Tívoli", ID: "Putri Duyung Kecil, Taman Tivoli", HI: "द लिटिल मरमेड, टिवोली गार्डन", PT: "A Pequena Sereia, Jardins Tivoli", AR: "ذا ليتل ميرميد، حدائق تيفولي", RU: "Русалочка, сады Тиволи",
    }
  },
  "慕尼黑": {
    name: {
      TW: "慕尼黑", EN: "Munich", JP: "ミュンヘン", KR: "뮌헨", FR: "Munich", ES: "Munich", ID: "Munich", HI: "म्यूनिख", PT: "Munique", AR: "ميونيخ", RU: "Мюнхен",
    },
    description: {
      TW: "巴伐利亞傳統，啤酒節的狂歡與汽車工業", EN: "Bavarian tradition, Oktoberfest carnival and the automotive industry", JP: "バイエルンの伝統、オクトーバーフェスト カーニバル、自動車産業", KR: "바이에른 전통, 옥토버페스트 카니발 및 자동차 산업", FR: "Tradition bavaroise, carnaval de l'Oktoberfest et industrie automobile", ES: "Tradición bávara, carnaval Oktoberfest y industria automovilística", ID: "Tradisi Bavaria, karnaval Oktoberfest dan industri otomotif", HI: "बवेरियन परंपरा, ओकट्रैफेस्ट कार्निवल और ऑटोमोटिव उद्योग", PT: "Tradição bávara, carnaval da Oktoberfest e indústria automotiva", AR: "التقاليد البافارية وكرنفال مهرجان أكتوبر وصناعة السيارات", RU: "Баварские традиции, карнавал Октоберфест и автомобильная промышленность",
    },
    top_food: {
      TW: "德國豬腳、慕尼黑白香腸", EN: "German pig trotters, Munich black and white sausage", JP: "ドイツの豚足、ミュンヘンの白黒ソーセージ", KR: "독일 족발, 뮌헨 흑백 소시지", FR: "Pieds de porc allemands, saucisse noire et blanche de Munich", ES: "Manitas de cerdo alemanas, salchicha blanca y negra de Munich", ID: "Penggerek babi Jerman, sosis hitam putih Munich", HI: "जर्मन पिग ट्रॉटर्स, म्यूनिख ब्लैक एंड व्हाइट सॉसेज", PT: "Pés de porco alemães, salsicha preta e branca de Munique", AR: "أقدام الخنازير الألمانية، سجق ميونخ الأبيض والأسود", RU: "Немецкие свиные рысаки, мюнхенская черно-белая колбаса",
    },
    must_visit_spot: {
      TW: "瑪利亞廣場、寶馬博物館", EN: "Marienplatz, BMW Museum", JP: "マリエン広場、BMW 博物館", KR: "마리엔 광장, BMW 박물관", FR: "Marienplatz, musée BMW", ES: "Marienplatz, Museo BMW", ID: "Marienplatz, Museum BMW", HI: "मैरिएनप्लात्ज़, बीएमडब्ल्यू संग्रहालय", PT: "Marienplatz, Museu da BMW", AR: "مارينبلاتز، متحف بي إم دبليو", RU: "Мариенплац, Музей BMW",
    }
  },
  "布魯塞爾": {
    name: {
      TW: "布魯塞爾", EN: "brussels", JP: "ブリュッセル", KR: "브뤼셀", FR: "Bruxelles", ES: "Bruselas", ID: "brussel", HI: "ब्रसेल्स", PT: "Bruxelas", AR: "بروكسل", RU: "Брюссель",
    },
    description: {
      TW: "歐洲心臟，漫畫文化與朱古力的香氣", EN: "Heart of Europe, comic culture and the aroma of chocolate", JP: "ヨーロッパの中心、コミック文化、そしてチョコレートの香り", KR: "유럽의 심장, 만화문화와 초콜릿의 향기", FR: "Cœur de l'Europe, culture de la bande dessinée et arôme du chocolat", ES: "Corazón de Europa, cultura del cómic y aroma a chocolate.", ID: "Jantung Eropa, budaya komik dan aroma coklat", HI: "यूरोप का दिल, हास्य संस्कृति और चॉकलेट की सुगंध", PT: "Coração da Europa, cultura cômica e aroma de chocolate", AR: "قلب أوروبا والثقافة الكوميدية ورائحة الشوكولاتة", RU: "Сердце Европы, комическая культура и аромат шоколада",
    },
    top_food: {
      TW: "比利時窩夫、青口配薯條", EN: "Belgian waffles, mussels and French fries", JP: "ベルギーワッフル、ムール貝、フライドポテト", KR: "벨기에 와플, 홍합, 감자 튀김", FR: "Gaufres belges, moules et frites", ES: "Gofres belgas, mejillones y patatas fritas", ID: "Wafel Belgia, kerang, dan kentang goreng", HI: "बेल्जियन वफ़ल, मसल्स और फ़्रेंच फ्राइज़", PT: "Waffles belgas, mexilhões e batatas fritas", AR: "الفطائر البلجيكية، بلح البحر والبطاطا المقلية", RU: "Бельгийские вафли, мидии и картофель фри",
    },
    must_visit_spot: {
      TW: "大廣場、原子球塔", EN: "Grand Place, Atomium", JP: "グランプラス、アトミウム", KR: "그랑플라스, 아토미움", FR: "Grand-Place, Atomium", ES: "Grand Place, Atomium", ID: "Tempat Agung, Atomium", HI: "ग्रैंड प्लेस, एटमियम", PT: "Grand-Place, Atomium", AR: "جراند بلاس، أتوميوم", RU: "Гран-Плас, Атомиум",
    }
  },
  "蘇黎世": {
    name: {
      TW: "蘇黎世", EN: "zurich", JP: "チューリッヒ", KR: "취리히", FR: "zurich", ES: "Zúrich", ID: "zürich", HI: "ज़्यूरिख", PT: "Zurique", AR: "زيوريخ", RU: "Цюрих",
    },
    description: {
      TW: "湖光山色與金融帝國的結合", EN: "The combination of beautiful lakes and mountains and financial empire", JP: "美しい湖と山と金融帝国の組み合わせ", KR: "아름다운 호수와 산, 그리고 금융제국의 결합", FR: "La combinaison de magnifiques lacs et montagnes et d’un empire financier", ES: "La combinación de hermosos lagos y montañas y un imperio financiero.", ID: "Kombinasi danau dan pegunungan yang indah serta kerajaan finansial", HI: "खूबसूरत झीलों और पहाड़ों और वित्तीय साम्राज्य का संयोजन", PT: "A combinação de belos lagos e montanhas e império financeiro", AR: "مزيج من البحيرات والجبال الجميلة والإمبراطورية المالية", RU: "Сочетание прекрасных озер, гор и финансовой империи.",
    },
    top_food: {
      TW: "起司火鍋、蘇黎世小牛肉", EN: "Cheese fondue, veal Zurich", JP: "チーズフォンデュ、子牛のチューリッヒ", KR: "치즈 퐁듀, 송아지 고기 취리히", FR: "Fondue au fromage, veau Zurich", ES: "Fondue de queso, ternera Zurich", ID: "Fondue keju, daging sapi muda Zurich", HI: "पनीर फोंड्यू, वील ज्यूरिख", PT: "Fondue de queijo, vitela Zurique", AR: "فوندو الجبن، لحم العجل زيوريخ", RU: "Сырное фондю, телятина по-цюрихски",
    },
    must_visit_spot: {
      TW: "班霍夫大街、蘇黎世湖", EN: "Bahnhofstrasse, Lake Zurich", JP: "チューリッヒ湖のバーンホフ通り", KR: "반호프스트라세, 취리히 호수", FR: "Bahnhofstrasse, lac de Zurich", ES: "Bahnhofstrasse, Lago de Zúrich", ID: "Bahnhofstrasse, Danau Zurich", HI: "बहन्होफ़स्ट्रैस, ज्यूरिख झील", PT: "Bahnhofstrasse, Lago Zurique", AR: "شارع بانهوف شتراسه، بحيرة زيورخ", RU: "Банхофштрассе, Цюрихское озеро",
    }
  },
  "多倫多": {
    name: {
      TW: "多倫多", EN: "toronto", JP: "トロント", KR: "토론토", FR: "Toronto", ES: "Toronto", ID: "toronto", HI: "टोरंटो", PT: "Toronto", AR: "تورنتو", RU: "Торонто",
    },
    description: {
      TW: "極致多元文化，乾淨現代的北美大都市", EN: "An extremely multicultural, clean and modern North American metropolis", JP: "非常に多文化で、清潔でモダンな北米の大都市", KR: "매우 다문화적이고 깨끗하며 현대적인 북미 대도시", FR: "Une métropole nord-américaine extrêmement multiculturelle, propre et moderne", ES: "Una metrópoli norteamericana extremadamente multicultural, limpia y moderna", ID: "Kota metropolitan Amerika Utara yang sangat multikultural, bersih, dan modern", HI: "एक अत्यंत बहुसांस्कृतिक, स्वच्छ और आधुनिक उत्तरी अमेरिकी महानगर", PT: "Uma metrópole norte-americana extremamente multicultural, limpa e moderna", AR: "مدينة متعددة الثقافات ونظيفة وحديثة في أمريكا الشمالية", RU: "Чрезвычайно мультикультурный, чистый и современный мегаполис Северной Америки.",
    },
    top_food: {
      TW: "肉汁芝士薯條 (Poutine)", EN: "Poutine", JP: "プーティン", KR: "푸틴", FR: "Poutine", ES: "putine", ID: "Poutine", HI: "Poutine", PT: "Poutine", AR: "بوتين", RU: "Путин",
    },
    must_visit_spot: {
      TW: "CN塔、聖勞倫斯市場", EN: "CN Tower, St. Lawrence Market", JP: "CNタワー、セントローレンスマーケット", KR: "CN 타워, 세인트 로렌스 마켓", FR: "Tour CN, Marché Saint-Laurent", ES: "Torre CN, Mercado de San Lorenzo", ID: "Menara CN, Pasar St.Lawrence", HI: "सीएन टावर, सेंट लॉरेंस मार्केट", PT: "Torre CN, Mercado de São Lourenço", AR: "برج CN، سوق سانت لورانس", RU: "Си-Эн Тауэр, Рынок Святого Лаврентия",
    }
  },
  "洛杉磯": {
    name: {
      TW: "洛杉磯", EN: "Los Angeles", JP: "ロサンゼルス", KR: "로스앤젤레스", FR: "Los Angeles", ES: "Los Ángeles", ID: "Los Angeles", HI: "लॉस एंजिल्स", PT: "Los Angeles", AR: "لوس أنجلوس", RU: "Лос-Анджелес",
    },
    description: {
      TW: "電影夢工廠，棕櫚樹與星光大道", EN: "Movie DreamWorks, Palm Trees and Walk of Fame", JP: "映画ドリームワークス、ヤシの木、ウォーク オブ フェーム", KR: "영화 드림웍스, 야자수 및 명예의 거리", FR: "Film DreamWorks, palmiers et Walk of Fame", ES: "Película DreamWorks, Palmeras y Paseo de la Fama", ID: "Film DreamWorks, Pohon Palem, dan Walk of Fame", HI: "मूवी ड्रीमवर्क्स, पाम ट्रीज़ और वॉक ऑफ़ फ़ेम", PT: "Filme DreamWorks, Palmeiras e Calçada da Fama", AR: "فيلم DreamWorks وأشجار النخيل وممشى المشاهير", RU: "Кино DreamWorks, Пальмы и Аллея славы",
    },
    top_food: {
      TW: "美式漢堡、墨西哥塔可", EN: "American burgers, Mexican tacos", JP: "アメリカンバーガー、メキシカンタコス", KR: "미국식 버거, 멕시칸 타코", FR: "Burgers américains, tacos mexicains", ES: "Hamburguesas americanas, tacos mexicanos.", ID: "Burger Amerika, taco Meksiko", HI: "अमेरिकी बर्गर, मैक्सिकन टैकोस", PT: "Hambúrgueres americanos, tacos mexicanos", AR: "البرجر الأمريكي، التاكو المكسيكي", RU: "Американские гамбургеры, мексиканские тако",
    },
    must_visit_spot: {
      TW: "好萊塢標誌、聖莫尼卡海灘", EN: "Hollywood sign, Santa Monica beach", JP: "ハリウッドサイン、サンタモニカビーチ", KR: "할리우드 사인, 산타모니카 해변", FR: "Panneau Hollywood, plage de Santa Monica", ES: "Cartel de Hollywood, playa de Santa Mónica", ID: "Tanda Hollywood, pantai Santa Monica", HI: "हॉलीवुड साइन, सांता मोनिका बीच", PT: "Letreiro de Hollywood, praia de Santa Mônica", AR: "علامة هوليوود، شاطئ سانتا مونيكا", RU: "Знак Голливуда, пляж Санта-Моники",
    }
  },
  "三藩市": {
    name: {
      TW: "三藩市", EN: "san francisco", JP: "サンフランシスコ", KR: "샌프란시스코", FR: "San Francisco", ES: "san francisco", ID: "San Fransisco", HI: "सैन फ्रांसिस्को", PT: "São Francisco", AR: "سان فرانسيسكو", RU: "Сан-Франциско",
    },
    description: {
      TW: "霧鎖金門，陡峭街道與科技矽谷", EN: "Fog-locked Golden Gate, steep streets and technological Silicon Valley", JP: "霧に閉ざされたゴールデン ゲート、険しい通り、テクノロジーのシリコン バレー", KR: "안개로 뒤덮인 골든 게이트, 가파른 거리, 첨단 기술의 실리콘 밸리", FR: "Golden Gate brumeux, rues escarpées et Silicon Valley technologique", ES: "Golden Gate bloqueado por la niebla, calles empinadas y Silicon Valley tecnológico", ID: "Golden Gate yang tertutup kabut, jalanan curam, dan Silicon Valley yang berteknologi", HI: "कोहरे से घिरा गोल्डन गेट, खड़ी सड़कें और तकनीकी सिलिकॉन वैली", PT: "Golden Gate coberta de neblina, ruas íngremes e o tecnológico Vale do Silício", AR: "البوابة الذهبية المغلقة بالضباب والشوارع شديدة الانحدار ووادي السيليكون التكنولوجي", RU: "Закрытые туманом Золотые ворота, крутые улицы и технологичная Силиконовая долина",
    },
    top_food: {
      TW: "酸麵包海鮮濃湯", EN: "Sourdough Seafood Chowder", JP: "サワー種シーフードチャウダー", KR: "사워도우 해산물 차우더", FR: "Chaudrée de fruits de mer au levain", ES: "Sopa De Mariscos De Masa Madre", ID: "Sup Makanan Laut Penghuni Pertama", HI: "खट्टा समुद्री भोजन चावडर", PT: "Sopa de frutos do mar com massa fermentada", AR: "حساء المأكولات البحرية بالعجين المخمر", RU: "Суп из морепродуктов на закваске",
    },
    must_visit_spot: {
      TW: "金門大橋、漁人碼頭", EN: "Golden Gate Bridge, Fisherman's Wharf", JP: "ゴールデンゲートブリッジ、フィッシャーマンズワーフ", KR: "금문교, 피셔맨스 워프", FR: "Golden Gate Bridge, Fisherman's Wharf", ES: "Puente Golden Gate, Muelle de los Pescadores", ID: "Jembatan Golden Gate, Dermaga Nelayan", HI: "गोल्डन गेट ब्रिज, मछुआरे का घाट", PT: "Ponte Golden Gate, Fisherman's Wharf", AR: "جسر البوابة الذهبية، رصيف الصيادين", RU: "Мост Золотые Ворота, Рыбацкая пристань",
    }
  },
  "里約熱內盧": {
    name: {
      TW: "里約熱內盧", EN: "rio de janeiro", JP: "リオデジャネイロ", KR: "리우데자네이루", FR: "Rio de Janeiro", ES: "río de janeiro", ID: "Rio de Janeiro", HI: "रियो डी जनेरियो", PT: "rio de janeiro", AR: "ريو دي جانيرو", RU: "Рио-де-Жанейро",
    },
    description: {
      TW: "南美狂熱，熱情桑巴與絕美沙灘", EN: "South America is crazy, passionate samba and beautiful beaches", JP: "南米はクレイジーで情熱的なサンバと美しいビーチ", KR: "남미는 열정적이고 열정적인 삼바와 아름다운 해변이 있는 곳입니다", FR: "L'Amérique du Sud, c'est la samba folle, passionnée et les belles plages", ES: "Sudamérica es una locura, pasión por la samba y hermosas playas.", ID: "Amerika Selatan adalah samba yang gila dan penuh gairah serta pantai-pantai yang indah", HI: "दक्षिण अमेरिका पागल, भावुक सांबा और सुंदर समुद्र तट है", PT: "A América do Sul é uma loucura, samba apaixonado e lindas praias", AR: "أمريكا الجنوبية بلد السامبا المجنون والعاطفي والشواطئ الجميلة", RU: "Южная Америка – это сумасшедшая, страстная самба и прекрасные пляжи.",
    },
    top_food: {
      TW: "巴西烤肉 (Churrasco)", EN: "Churrasco", JP: "シュラスコ", KR: "슈하스코", FR: "Churrasco", ES: "Churrasco", ID: "Churasco", HI: "चुरैस्को", PT: "Churrasco", AR: "تشوراسكو", RU: "Чурраско",
    },
    must_visit_spot: {
      TW: "救世基督像、科帕卡巴納海灘", EN: "Christ the Redeemer Statue, Copacabana Beach", JP: "コルコバードのキリスト像、コパカバーナビーチ", KR: "그리스도 구속자 동상, 코파카바나 해변", FR: "Statue du Christ Rédempteur, plage de Copacabana", ES: "Estatua del Cristo Redentor, Playa de Copacabana", ID: "Patung Kristus Penebus, Pantai Copacabana", HI: "क्राइस्ट द रिडीमर प्रतिमा, कोपाकबाना बीच", PT: "Estátua do Cristo Redentor, Praia de Copacabana", AR: "تمثال المسيح الفادي، شاطئ كوباكابانا", RU: "Статуя Христа-Искупителя, пляж Копакабана",
    }
  },
  "布宜諾斯艾利斯": {
    name: {
      TW: "布宜諾斯艾利斯", EN: "buenos aires", JP: "ブエノスアイレス", KR: "부에노스아이레스", FR: "Buenos Aires", ES: "buenos aires", ID: "Buenos Aires", HI: "ब्यूनस आयर्स", PT: "Buenos Aires", AR: "بوينس آيرس", RU: "Буэнос-Айрес",
    },
    description: {
      TW: "南美巴黎，探戈舞動的優雅與激情", EN: "Paris, South America, the elegance and passion of tango dancing", JP: "南米パリ、タンゴダンスの優雅さと情熱", KR: "남미 파리, 탱고댄스의 우아함과 열정", FR: "Paris, Amérique du Sud, l'élégance et la passion du tango", ES: "París, Sudamérica, la elegancia y la pasión del baile de tango.", ID: "Paris, Amerika Selatan, keanggunan dan semangat menari tango", HI: "पेरिस, दक्षिण अमेरिका, टैंगो नृत्य की भव्यता और जुनून", PT: "Paris, América do Sul, a elegância e a paixão da dança do tango", AR: "باريس، أمريكا الجنوبية، أناقة وشغف رقص التانغو", RU: "Париж, Южная Америка, элегантность и страсть танго.",
    },
    top_food: {
      TW: "阿根廷牛排、焦糖牛奶醬", EN: "Argentinian steak, caramel dulce de leche", JP: "アルゼンチンステーキ、キャラメルドゥルセ・デ・レーチェ", KR: "아르헨티나 스테이크, 카라멜 둘세 데 레체", FR: "Steak argentin, dulce de leche au caramel", ES: "Filete argentino, dulce de leche y caramelo", ID: "Steak Argentina, karamel dulce de leche", HI: "अर्जेंटीनी स्टेक, कारमेल डल्से डे लेचे", PT: "Bife argentino, doce de leite com caramelo", AR: "شريحة لحم أرجنتينية، كراميل دولسي دي ليتشي", RU: "Аргентинский стейк, карамель дульсе де лече",
    },
    must_visit_spot: {
      TW: "五月廣場、博卡區", EN: "Plaza de Mayo, Boca District", JP: "5 月 日広場、ボカ地区", KR: "5월 광장, 보카 지구", FR: "Place de Mai, quartier de Boca", ES: "Plaza de Mayo, Distrito de Boca", ID: "Plaza de Mayo, Distrik Boca", HI: "प्लाजा डे मेयो, बोका जिला", PT: "Praça de Maio, distrito de Boca", AR: "بلازا دي مايو، منطقة بوكا", RU: "Пласа-де-Майо, округ Бока",
    }
  },
  "墨爾本": {
    name: {
      TW: "墨爾本", EN: "Melbourne", JP: "メルボルン", KR: "멜버른", FR: "Melbourne", ES: "Melbourne", ID: "Melbourne", HI: "मेलबोर्न", PT: "Melbourne", AR: "ملبورن", RU: "Мельбурн",
    },
    description: {
      TW: "澳洲咖啡之都，巷弄塗鴉與藝術氛圍", EN: "Australia’s coffee capital, alley graffiti and artistic atmosphere", JP: "オーストラリアのコーヒーの首都、路地の落書きと芸術的な雰囲気", KR: "호주 커피의 수도, 골목 그래피티와 예술적인 분위기", FR: "Capitale australienne du café, graffitis dans les ruelles et ambiance artistique", ES: "La capital del café de Australia, graffitis en los callejones y atmósfera artística", ID: "Ibu kota kopi Australia, grafiti gang, dan suasana artistik", HI: "ऑस्ट्रेलिया की कॉफ़ी राजधानी, गली-गली भित्तिचित्र और कलात्मक वातावरण", PT: "Capital do café da Austrália, grafites em becos e atmosfera artística", AR: "عاصمة القهوة في أستراليا، الكتابة على الجدران في الأزقة والأجواء الفنية", RU: "Кофейная столица Австралии, граффити на аллеях и художественная атмосфера",
    },
    top_food: {
      TW: "精品手沖咖啡、澳式早午餐", EN: "Premium hand-brewed coffee, Australian brunch", JP: "プレミアム手淹れコーヒー、オーストラリアンブランチ", KR: "프리미엄 핸드브루 커피, 호주식 브런치", FR: "Café haut de gamme infusé à la main, brunch australien", ES: "Café premium hecho a mano, brunch australiano", ID: "Kopi premium buatan tangan, brunch Australia", HI: "प्रीमियम हाथ से बनी कॉफ़ी, ऑस्ट्रेलियाई ब्रंच", PT: "Café premium feito à mão, brunch australiano", AR: "قهوة فاخرة مصنوعة يدويًا، وجبة فطور وغداء أسترالية", RU: "Премиальный кофе ручной сварки, австралийский бранч",
    },
    must_visit_spot: {
      TW: "聯邦廣場、大洋路", EN: "Federation Square, Great Ocean Road", JP: "フェデレーション スクエア、グレート オーシャン ロード", KR: "페더레이션 광장, 그레이트 오션 로드", FR: "Place de la Fédération, Great Ocean Road", ES: "Plaza de la Federación, Great Ocean Road", ID: "Lapangan Federasi, Great Ocean Road", HI: "फेडरेशन स्क्वायर, ग्रेट ओशन रोड", PT: "Praça da Federação, Great Ocean Road", AR: "ساحة الاتحاد، طريق المحيط العظيم", RU: "Площадь Федерации, Великая океанская дорога",
    }
  },
  "奧克蘭": {
    name: {
      TW: "奧克蘭", EN: "Auckland", JP: "オークランド", KR: "오클랜드", FR: "Auckland", ES: "auckland", ID: "Auckland", HI: "ऑकलैंड", PT: "Auckland", AR: "أوكلاند", RU: "Окленд",
    },
    description: {
      TW: "帆船之都，火山地形與毛利文化", EN: "The City of Sailing, Volcanic Terrain and Maori Culture", JP: "セーリング、火山地形、マオリ文化の街", KR: "항해의 도시, 화산 지형, 마오리 문화", FR: "La ville de la voile, du terrain volcanique et de la culture maorie", ES: "La ciudad de la navegación, el terreno volcánico y la cultura maorí", ID: "Kota Pelayaran, Medan Vulkanik, dan Budaya Maori", HI: "नौकायन, ज्वालामुखीय भूभाग और माओरी संस्कृति का शहर", PT: "A cidade da vela, do terreno vulcânico e da cultura Maori", AR: "مدينة الإبحار والتضاريس البركانية وثقافة الماوري", RU: "Город парусного спорта, вулканической местности и культуры маори",
    },
    top_food: {
      TW: "綠唇貽貝、毛利傳統窯烤 (Hangi)", EN: "Green lipped mussels, Maori traditional kiln roast (Hangi)", JP: "緑イ貝、マオリの伝統的な窯焼き（ハンギ）", KR: "초록입 홍합, 마오리 전통 가마 구이(항이)", FR: "Moules aux lèvres vertes, rôti au four traditionnel maori (Hangi)", ES: "Mejillones de labios verdes, asado al horno tradicional maorí (Hangi)", ID: "Kerang berbibir hijau, panggang tradisional Maori (Hangi)", HI: "ग्रीन लिप्ड मसल्स, माओरी पारंपरिक किलन रोस्ट (हैंगी)", PT: "Mexilhões de lábios verdes, assado em forno tradicional Maori (Hangi)", AR: "بلح البحر الأخضر، مشوي في فرن الماوري التقليدي (هانجي)", RU: "Зеленогубые мидии, традиционное жаркое в печи маори (ханги)",
    },
    must_visit_spot: {
      TW: "天空塔、伊甸山", EN: "Sky Tower, Mount Eden", JP: "スカイタワー、マウントイーデン", KR: "스카이 타워, 에덴 산", FR: "Sky Tower, Mont Éden", ES: "Sky Tower, Monte Edén", ID: "Menara Langit, Gunung Eden", HI: "स्काई टावर, माउंट ईडन", PT: "Torre do Céu, Monte Éden", AR: "برج السماء، جبل عدن", RU: "Небесная башня, гора Эдем",
    }
  },
  "開普敦": {
    name: {
      TW: "開普敦", EN: "cape town", JP: "ケープタウン", KR: "케이프 타운", FR: "Le Cap", ES: "ciudad del cabo", ID: "kota tanjung", HI: "開普敦", PT: "開普敦", AR: "開普敦", RU: "開普敦",
    },
    description: {
      TW: "非洲之巔，山海交匯的壯闊景觀", EN: "The top of Africa, the magnificent landscape where mountains and sea meet", JP: "アフリカの頂上、山と海が出会う雄大な風景", KR: "아프리카의 정상, 산과 바다가 만나는 웅장한 풍경", FR: "Le sommet de l'Afrique, le magnifique paysage où se rencontrent montagnes et mer", ES: "La cima de África, el magnífico paisaje donde se encuentran las montañas y el mar", ID: "Puncak Afrika, pemandangan indah tempat bertemunya gunung dan laut", HI: "非洲之巔，山海交匯的壯闊景觀", PT: "非洲之巔，山海交匯的壯闊景觀", AR: "非洲之巔，山海交匯的壯闊景觀", RU: "非洲之巔，山海交匯的壯闊景觀",
    },
    top_food: {
      TW: "南非乾肉 (Biltong)、野生動物餐", EN: "South African dried meat (Biltong), wildlife meal", JP: "南アフリカの乾燥肉（ビルトン）、野生動物の食事", KR: "남아프리카 말린 고기(빌통), 야생동물 식사", FR: "Viande séchée sud-africaine (Biltong), farine d'animaux sauvages", ES: "Carne seca sudafricana (Biltong), harina de vida silvestre", ID: "Daging kering Afrika Selatan (Biltong), makanan satwa liar", HI: "南非乾肉 (Biltong)、野生動物餐", PT: "南非乾肉 (Biltong)、野生動物餐", AR: "南非乾肉 (Biltong)、野生動物餐", RU: "南非乾肉 (Biltong)、野生動物餐",
    },
    must_visit_spot: {
      TW: "桌山、好望角", EN: "Table Mountain, Cape of Good Hope", JP: "テーブルマウンテン、喜望峰", KR: "테이블마운틴, 희망봉", FR: "Montagne de la Table, Cap de Bonne-Espérance", ES: "Montaña de la Mesa, Cabo de Buena Esperanza", ID: "Table Mountain, Tanjung Harapan", HI: "桌山、好望角", PT: "桌山、好望角", AR: "桌山、好望角", RU: "桌山、好望角",
    }
  },
  "馬拉喀什": {
    name: {
      TW: "馬拉喀什", EN: "馬拉喀什", JP: "馬拉喀什", KR: "馬拉喀什", FR: "馬拉喀什", ES: "馬拉喀什", ID: "馬拉喀什", HI: "馬拉喀什", PT: "馬拉喀什", AR: "馬拉喀什", RU: "馬拉喀什",
    },
    description: {
      TW: "北非色彩，迷宮般的古城與異域香料", EN: "北非色彩，迷宮般的古城與異域香料", JP: "北非色彩，迷宮般的古城與異域香料", KR: "北非色彩，迷宮般的古城與異域香料", FR: "北非色彩，迷宮般的古城與異域香料", ES: "北非色彩，迷宮般的古城與異域香料", ID: "北非色彩，迷宮般的古城與異域香料", HI: "北非色彩，迷宮般的古城與異域香料", PT: "北非色彩，迷宮般的古城與異域香料", AR: "北非色彩，迷宮般的古城與異域香料", RU: "北非色彩，迷宮般的古城與異域香料",
    },
    top_food: {
      TW: "塔吉鍋、庫斯庫斯", EN: "塔吉鍋、庫斯庫斯", JP: "塔吉鍋、庫斯庫斯", KR: "塔吉鍋、庫斯庫斯", FR: "塔吉鍋、庫斯庫斯", ES: "塔吉鍋、庫斯庫斯", ID: "塔吉鍋、庫斯庫斯", HI: "塔吉鍋、庫斯庫斯", PT: "塔吉鍋、庫斯庫斯", AR: "塔吉鍋、庫斯庫斯", RU: "塔吉鍋、庫斯庫斯",
    },
    must_visit_spot: {
      TW: "德吉瑪廣場、巴伊亞皇宮", EN: "德吉瑪廣場、巴伊亞皇宮", JP: "德吉瑪廣場、巴伊亞皇宮", KR: "德吉瑪廣場、巴伊亞皇宮", FR: "德吉瑪廣場、巴伊亞皇宮", ES: "德吉瑪廣場、巴伊亞皇宮", ID: "德吉瑪廣場、巴伊亞皇宮", HI: "德吉瑪廣場、巴伊亞皇宮", PT: "德吉瑪廣場、巴伊亞皇宮", AR: "德吉瑪廣場、巴伊亞皇宮", RU: "德吉瑪廣場、巴伊亞皇宮",
    }
  },
  "開羅": {
    name: {
      TW: "開羅", EN: "開羅", JP: "開羅", KR: "開羅", FR: "開羅", ES: "開羅", ID: "開羅", HI: "開羅", PT: "開羅", AR: "開羅", RU: "開羅",
    },
    description: {
      TW: "古文明奇蹟，尼羅河畔的千年史詩", EN: "古文明奇蹟，尼羅河畔的千年史詩", JP: "古文明奇蹟，尼羅河畔的千年史詩", KR: "古文明奇蹟，尼羅河畔的千年史詩", FR: "古文明奇蹟，尼羅河畔的千年史詩", ES: "古文明奇蹟，尼羅河畔的千年史詩", ID: "古文明奇蹟，尼羅河畔的千年史詩", HI: "古文明奇蹟，尼羅河畔的千年史詩", PT: "古文明奇蹟，尼羅河畔的千年史詩", AR: "古文明奇蹟，尼羅河畔的千年史詩", RU: "古文明奇蹟，尼羅河畔的千年史詩",
    },
    top_food: {
      TW: "埃及雜燴豆飯 (Koshary)", EN: "埃及雜燴豆飯 (Koshary)", JP: "埃及雜燴豆飯 (Koshary)", KR: "埃及雜燴豆飯 (Koshary)", FR: "埃及雜燴豆飯 (Koshary)", ES: "埃及雜燴豆飯 (Koshary)", ID: "埃及雜燴豆飯 (Koshary)", HI: "埃及雜燴豆飯 (Koshary)", PT: "埃及雜燴豆飯 (Koshary)", AR: "埃及雜燴豆飯 (Koshary)", RU: "埃及雜燴豆飯 (Koshary)",
    },
    must_visit_spot: {
      TW: "吉薩金字塔、埃及博物館", EN: "吉薩金字塔、埃及博物館", JP: "吉薩金字塔、埃及博物館", KR: "吉薩金字塔、埃及博物館", FR: "吉薩金字塔、埃及博物館", ES: "吉薩金字塔、埃及博物館", ID: "吉薩金字塔、埃及博物館", HI: "吉薩金字塔、埃及博物館", PT: "吉薩金字塔、埃及博物館", AR: "吉薩金字塔、埃及博物館", RU: "吉薩金字塔、埃及博物館",
    }
  },
  "札幌": {
    name: {
      TW: "札幌", EN: "札幌", JP: "札幌", KR: "札幌", FR: "札幌", ES: "札幌", ID: "札幌", HI: "札幌", PT: "札幌", AR: "札幌", RU: "札幌",
    },
    description: {
      TW: "雪祭之都，純淨自然與北國美食", EN: "雪祭之都，純淨自然與北國美食", JP: "雪祭之都，純淨自然與北國美食", KR: "雪祭之都，純淨自然與北國美食", FR: "雪祭之都，純淨自然與北國美食", ES: "雪祭之都，純淨自然與北國美食", ID: "雪祭之都，純淨自然與北國美食", HI: "雪祭之都，純淨自然與北國美食", PT: "雪祭之都，純淨自然與北國美食", AR: "雪祭之都，純淨自然與北國美食", RU: "雪祭之都，純淨自然與北國美食",
    },
    top_food: {
      TW: "味噌拉麵、成吉思汗烤羊肉", EN: "味噌拉麵、成吉思汗烤羊肉", JP: "味噌拉麵、成吉思汗烤羊肉", KR: "味噌拉麵、成吉思汗烤羊肉", FR: "味噌拉麵、成吉思汗烤羊肉", ES: "味噌拉麵、成吉思汗烤羊肉", ID: "味噌拉麵、成吉思汗烤羊肉", HI: "味噌拉麵、成吉思汗烤羊肉", PT: "味噌拉麵、成吉思汗烤羊肉", AR: "味噌拉麵、成吉思汗烤羊肉", RU: "味噌拉麵、成吉思汗烤羊肉",
    },
    must_visit_spot: {
      TW: "大通公園、白色戀人公園", EN: "大通公園、白色戀人公園", JP: "大通公園、白色戀人公園", KR: "大通公園、白色戀人公園", FR: "大通公園、白色戀人公園", ES: "大通公園、白色戀人公園", ID: "大通公園、白色戀人公園", HI: "大通公園、白色戀人公園", PT: "大通公園、白色戀人公園", AR: "大通公園、白色戀人公園", RU: "大通公園、白色戀人公園",
    }
  },
  "福岡": {
    name: {
      TW: "福岡", EN: "福岡", JP: "福岡", KR: "福岡", FR: "福岡", ES: "福岡", ID: "福岡", HI: "福岡", PT: "福岡", AR: "福岡", RU: "福岡",
    },
    description: {
      TW: "屋台文化，充滿活力的港口商圈", EN: "屋台文化，充滿活力的港口商圈", JP: "屋台文化，充滿活力的港口商圈", KR: "屋台文化，充滿活力的港口商圈", FR: "屋台文化，充滿活力的港口商圈", ES: "屋台文化，充滿活力的港口商圈", ID: "屋台文化，充滿活力的港口商圈", HI: "屋台文化，充滿活力的港口商圈", PT: "屋台文化，充滿活力的港口商圈", AR: "屋台文化，充滿活力的港口商圈", RU: "屋台文化，充滿活力的港口商圈",
    },
    top_food: {
      TW: "博多拉麵、明太子", EN: "博多拉麵、明太子", JP: "博多拉麵、明太子", KR: "博多拉麵、明太子", FR: "博多拉麵、明太子", ES: "博多拉麵、明太子", ID: "博多拉麵、明太子", HI: "博多拉麵、明太子", PT: "博多拉麵、明太子", AR: "博多拉麵、明太子", RU: "博多拉麵、明太子",
    },
    must_visit_spot: {
      TW: "大濠公園、太宰府天滿宮", EN: "大濠公園、太宰府天滿宮", JP: "大濠公園、太宰府天滿宮", KR: "大濠公園、太宰府天滿宮", FR: "大濠公園、太宰府天滿宮", ES: "大濠公園、太宰府天滿宮", ID: "大濠公園、太宰府天滿宮", HI: "大濠公園、太宰府天滿宮", PT: "大濠公園、太宰府天滿宮", AR: "大濠公園、太宰府天滿宮", RU: "大濠公園、太宰府天滿宮",
    }
  },
  "箱根": {
    name: {
      TW: "箱根", EN: "箱根", JP: "箱根", KR: "箱根", FR: "箱根", ES: "箱根", ID: "箱根", HI: "箱根", PT: "箱根", AR: "箱根", RU: "箱根",
    },
    description: {
      TW: "溫泉之鄉，富士山絕佳觀望點", EN: "溫泉之鄉，富士山絕佳觀望點", JP: "溫泉之鄉，富士山絕佳觀望點", KR: "溫泉之鄉，富士山絕佳觀望點", FR: "溫泉之鄉，富士山絕佳觀望點", ES: "溫泉之鄉，富士山絕佳觀望點", ID: "溫泉之鄉，富士山絕佳觀望點", HI: "溫泉之鄉，富士山絕佳觀望點", PT: "溫泉之鄉，富士山絕佳觀望點", AR: "溫泉之鄉，富士山絕佳觀望點", RU: "溫泉之鄉，富士山絕佳觀望點",
    },
    top_food: {
      TW: "溫泉饅頭、黑雞蛋", EN: "溫泉饅頭、黑雞蛋", JP: "溫泉饅頭、黑雞蛋", KR: "溫泉饅頭、黑雞蛋", FR: "溫泉饅頭、黑雞蛋", ES: "溫泉饅頭、黑雞蛋", ID: "溫泉饅頭、黑雞蛋", HI: "溫泉饅頭、黑雞蛋", PT: "溫泉饅頭、黑雞蛋", AR: "溫泉饅頭、黑雞蛋", RU: "溫泉饅頭、黑雞蛋",
    },
    must_visit_spot: {
      TW: "大涌谷、蘆之湖", EN: "大涌谷、蘆之湖", JP: "大涌谷、蘆之湖", KR: "大涌谷、蘆之湖", FR: "大涌谷、蘆之湖", ES: "大涌谷、蘆之湖", ID: "大涌谷、蘆之湖", HI: "大涌谷、蘆之湖", PT: "大涌谷、蘆之湖", AR: "大涌谷、蘆之湖", RU: "大涌谷、蘆之湖",
    }
  },
  "沖繩": {
    name: {
      TW: "沖繩", EN: "沖繩", JP: "沖繩", KR: "沖繩", FR: "沖繩", ES: "Okinawa", ID: "Okinawa", HI: "ओकिनावा", PT: "Okinawa", AR: "أوكيناوا", RU: "Окинава",
    },
    description: {
      TW: "琉球風情，湛藍海景與潛水天堂", EN: "琉球風情，湛藍海景與潛水天堂", JP: "琉球風情，湛藍海景與潛水天堂", KR: "琉球風情，湛藍海景與潛水天堂", FR: "琉球風情，湛藍海景與潛水天堂", ES: "Estilo Ryukyu, paisaje marino azul y paraíso del buceo", ID: "Gaya Ryukyu, pemandangan laut biru dan surga menyelam", HI: "रयूकू शैली, नीला समुद्री दृश्य और गोताखोरी स्वर्ग", PT: "Estilo Ryukyu, paisagem marítima azul e paraíso do mergulho", AR: "أسلوب ريوكيو والمناظر البحرية الزرقاء وجنة الغوص", RU: "Стиль Рюкю, голубой морской пейзаж и рай для дайвинга",
    },
    top_food: {
      TW: "沖繩苦瓜炒蛋、石垣牛", EN: "沖繩苦瓜炒蛋、石垣牛", JP: "沖繩苦瓜炒蛋、石垣牛", KR: "沖繩苦瓜炒蛋、石垣牛", FR: "沖繩苦瓜炒蛋、石垣牛", ES: "Huevos revueltos con melón amargo de Okinawa y ternera Ishigaki", ID: "Telur Orak-arik Melon Pahit Okinawa, Daging Sapi Ishigaki", HI: "ओकिनावा कड़वा तरबूज तले हुए अंडे, इशिगाकी बीफ", PT: "Ovo mexido de melão amargo de Okinawa, carne Ishigaki", AR: "بيض أوكيناوا المر المخفوق مع لحم البقر إيشيجاكي", RU: "Окинавская яичница с горькой дыней, говядина Исигаки",
    },
    must_visit_spot: {
      TW: "首里城、美麗海水族館", EN: "首里城、美麗海水族館", JP: "首里城、美麗海水族館", KR: "首里城、美麗海水族館", FR: "首里城、美麗海水族館", ES: "Castillo Shuri, Acuario Churaumi", ID: "Kastil Shuri, Akuarium Churaumi", HI: "शुरी कैसल, चुरौमी एक्वेरियम", PT: "Castelo Shuri, Aquário Churaumi", AR: "قلعة شوري، حوض أسماك تشوراومي", RU: "Замок Сюри, Аквариум Тюрауми",
    }
  },
  "拉斯維加斯": {
    name: {
      TW: "拉斯維加斯", EN: "las vegas", JP: "ラスベガス", KR: "拉斯維加斯", FR: "拉斯維加斯", ES: "拉斯維加斯", ID: "拉斯維加斯", HI: "拉斯維加斯", PT: "拉斯維加斯", AR: "拉斯維加斯", RU: "拉斯維加斯",
    },
    description: {
      TW: "沙漠賭城，不夜的娛樂與表演殿堂", EN: "Desert Casino, a palace of entertainment and performances that never sleeps", JP: "デザート カジノ、眠らないエンターテイメントとパフォーマンスの宮殿", KR: "沙漠賭城，不夜的娛樂與表演殿堂", FR: "沙漠賭城，不夜的娛樂與表演殿堂", ES: "沙漠賭城，不夜的娛樂與表演殿堂", ID: "沙漠賭城，不夜的娛樂與表演殿堂", HI: "沙漠賭城，不夜的娛樂與表演殿堂", PT: "沙漠賭城，不夜的娛樂與表演殿堂", AR: "沙漠賭城，不夜的娛樂與表演殿堂", RU: "沙漠賭城，不夜的娛樂與表演殿堂",
    },
    top_food: {
      TW: "自助餐(Buffet)、牛排", EN: "Buffet, steak", JP: "ビュッフェ、ステーキ", KR: "自助餐(Buffet)、牛排", FR: "自助餐(Buffet)、牛排", ES: "自助餐(Buffet)、牛排", ID: "自助餐(Buffet)、牛排", HI: "自助餐(Buffet)、牛排", PT: "自助餐(Buffet)、牛排", AR: "自助餐(Buffet)、牛排", RU: "自助餐(Buffet)、牛排",
    },
    must_visit_spot: {
      TW: "拉斯維加斯大道、大峽谷(鄰近)", EN: "Las Vegas Strip, Grand Canyon (nearby)", JP: "ラスベガス ストリップ、グランド キャニオン (近隣)", KR: "拉斯維加斯大道、大峽谷(鄰近)", FR: "拉斯維加斯大道、大峽谷(鄰近)", ES: "拉斯維加斯大道、大峽谷(鄰近)", ID: "拉斯維加斯大道、大峽谷(鄰近)", HI: "拉斯維加斯大道、大峽谷(鄰近)", PT: "拉斯維加斯大道、大峽谷(鄰近)", AR: "拉斯維加斯大道、大峽谷(鄰近)", RU: "拉斯維加斯大道、大峽谷(鄰近)",
    }
  },
  "芝加哥": {
    name: {
      TW: "芝加哥", EN: "芝加哥", JP: "芝加哥", KR: "시카고", FR: "Chicago", ES: "chicago", ID: "Chicago", HI: "शिकागो", PT: "Chicago", AR: "شيكاغو", RU: "Чикаго",
    },
    description: {
      TW: "建築之都，爵士樂與深盤披薩", EN: "建築之都，爵士樂與深盤披薩", JP: "建築之都，爵士樂與深盤披薩", KR: "건축과 재즈, 딥디쉬 피자의 도시", FR: "Une ville d'architecture, de jazz et de pizza profonde", ES: "Una ciudad de arquitectura, jazz y pizza profunda", ID: "Kota arsitektur, jazz, dan pizza deep-dish", HI: "वास्तुकला, जैज़ और डीप-डिश पिज़्ज़ा का शहर", PT: "Uma cidade de arquitetura, jazz e pizza profunda", AR: "مدينة الهندسة المعمارية وموسيقى الجاز والبيتزا العميقة", RU: "Город архитектуры, джаза и глубокой пиццы",
    },
    top_food: {
      TW: "深盤披薩 (Deep Dish Pizza)", EN: "深盤披薩 (Deep Dish Pizza)", JP: "深盤披薩 (Deep Dish Pizza)", KR: "딥디쉬 피자", FR: "Pizza profonde", ES: "Pizza de plato hondo", ID: "Pizza Hidangan Dalam", HI: "डीप डिश पिज्जा", PT: "Pizza de prato fundo", AR: "بيتزا طبق عميق", RU: "Пицца с глубоким блюдом",
    },
    must_visit_spot: {
      TW: "雲門 (The Bean)、海軍碼頭", EN: "雲門 (The Bean)、海軍碼頭", JP: "雲門 (The Bean)、海軍碼頭", KR: "클라우드 게이트(더 빈), 네이비 피어", FR: "Cloud Gate (Le Haricot), Navy Pier", ES: "Cloud Gate (The Bean), Navy Pier", ID: "Cloud Gate (The Bean), Dermaga Angkatan Laut", HI: "क्लाउड गेट (द बीन), नेवी पियर", PT: "Cloud Gate (O Feijão), Navy Pier", AR: "بوابة السحابة (ذا فول)، الرصيف البحري", RU: "Облачные ворота (Бин), Военно-морской пирс",
    }
  },
  "邁阿密": {
    name: {
      TW: "邁阿密", EN: "miami", JP: "マイアミ", KR: "마이애미", FR: "Miami", ES: "Miami", ID: "miami", HI: "मियामी", PT: "Miami", AR: "ميامي", RU: "Майами",
    },
    description: {
      TW: "拉丁熱情，陽光沙灘與裝飾藝術建築", EN: "Latin passion, sunny beaches and Art Deco architecture", JP: "ラテンの情熱、太陽が降り注ぐビーチ、アールデコ様式の建築", KR: "라틴 열정, 햇살 가득한 해변, 아르데코 건축물", FR: "Passion latine, plages ensoleillées et architecture Art Déco", ES: "Pasión latina, playas soleadas y arquitectura Art Déco", ID: "Gairah Latin, pantai cerah, dan arsitektur Art Deco", HI: "लैटिन जुनून, धूप वाले समुद्र तट और आर्ट डेको वास्तुकला", PT: "Paixão latina, praias ensolaradas e arquitetura Art Déco", AR: "العاطفة اللاتينية والشواطئ المشمسة والهندسة المعمارية على طراز آرت ديكو", RU: "Латинская страсть, солнечные пляжи и архитектура в стиле ар-деко.",
    },
    top_food: {
      TW: "古巴三明治、石蟹鉗", EN: "Cuban Sandwich, Stone Crab Claws", JP: "キューバンサンドイッチ、石ガニ爪", KR: "쿠바 샌드위치, 돌게 집게발", FR: "Sandwich Cubain, Pinces De Crabe", ES: "Sándwich Cubano, Pinzas De Cangrejo De Piedra", ID: "Sandwich Kuba, Cakar Kepiting Batu", HI: "क्यूबन सैंडविच, पत्थर केकड़े के पंजे", PT: "Sanduíche cubano, garras de caranguejo de pedra", AR: "ساندويتش كوبي، مخالب السلطعون الحجري", RU: "Кубинский сэндвич, клешни каменного краба",
    },
    must_visit_spot: {
      TW: "南沙灘 (South Beach)、小哈瓦那", EN: "South Beach, Little Havana", JP: "サウスビーチ、リトルハバナ", KR: "사우스 비치, 리틀 하바나", FR: "Plage Sud, Petite Havane", ES: "Playa Sur, Pequeña Habana", ID: "Pantai Selatan, Little Havana", HI: "साउथ बीच, लिटिल हवाना", PT: "Praia Sul, Pequena Havana", AR: "الشاطئ الجنوبي، هافانا الصغيرة", RU: "Южный пляж, Маленькая Гавана",
    }
  },
  "西雅圖": {
    name: {
      TW: "西雅圖", EN: "seattle", JP: "シアトル", KR: "시애틀", FR: "Seattle", ES: "seattle", ID: "seattle", HI: "सिएटल", PT: "Seattle", AR: "سياتل", RU: "Сиэтл",
    },
    description: {
      TW: "咖啡原鄉，雨中的文藝與科技重鎮", EN: "The hometown of coffee, a city of art and science and technology in the rain", JP: "コーヒーの故郷、雨の芸術と科学技術の街", KR: "빗속의 예술과 과학기술의 도시, 커피의 고향", FR: "La ville natale du café, une ville d'art, de science et de technologie sous la pluie", ES: "La ciudad natal del café, una ciudad de arte, ciencia y tecnología bajo la lluvia", ID: "Kampung halaman kopi, kota seni dan iptek di tengah hujan", HI: "कॉफ़ी का गृहनगर, बारिश में कला और विज्ञान और प्रौद्योगिकी का शहर", PT: "A cidade natal do café, uma cidade de arte, ciência e tecnologia na chuva", AR: "مسقط رأس القهوة، مدينة الفن والعلوم والتكنولوجيا تحت المطر", RU: "Родной город кофе, город искусства, науки и технологий под дождем",
    },
    top_food: {
      TW: "派克市場海鮮、咖啡", EN: "Pike Place Market seafood and coffee", JP: "パイク プレイス マーケットのシーフードとコーヒー", KR: "파이크 플레이스 마켓 해산물과 커피", FR: "Fruits de mer et café du marché de Pike Place", ES: "Pike Place Market mariscos y café", ID: "Makanan laut dan kopi Pike Place Market", HI: "पाइक प्लेस मार्केट समुद्री भोजन और कॉफी", PT: "Frutos do mar e café do Pike Place Market", AR: "بايك بلايس ماركت للمأكولات البحرية والقهوة", RU: "Морепродукты и кофе Pike Place Market",
    },
    must_visit_spot: {
      TW: "太空針塔、派克市場", EN: "Space Needle, Pike Place Market", JP: "スペースニードル、パイクプレイスマーケット", KR: "스페이스 니들, 파이크 플레이스 마켓", FR: "Space Needle, marché de Pike Place", ES: "Aguja espacial, mercado de Pike Place", ID: "Space Needle, Pasar Pike Place", HI: "स्पेस नीडल, पाइक प्लेस मार्केट", PT: "Space Needle, Mercado Pike Place", AR: "إبرة الفضاء، سوق بايك بلايس", RU: "Спейс-Нидл, рынок Пайк-Плейс",
    }
  },
  "愛丁堡": {
    name: {
      TW: "愛丁堡", EN: "Edinburgh", JP: "エディンバラ", KR: "에든버러", FR: "Édimbourg", ES: "Edimburgo", ID: "Edinburgh", HI: "एडिनबरा", PT: "Edimburgo", AR: "ادنبره", RU: "Эдинбург",
    },
    description: {
      TW: "古堡傳說，哈利波特的靈感發源地", EN: "Castle Legend, the inspiration for Harry Potter", JP: "ハリー・ポッターのインスピレーションとなったキャッスル・レジェンド", KR: "해리포터의 영감이 된 캐슬 레전드", FR: "Castle Legend, l'inspiration d'Harry Potter", ES: "Castle Legend, la inspiración de Harry Potter", ID: "Castle Legend, inspirasi Harry Potter", HI: "कैसल लीजेंड, हैरी पॉटर की प्रेरणा", PT: "Castle Legend, a inspiração para Harry Potter", AR: "أسطورة القلعة، مصدر إلهام هاري بوتر", RU: "Легенда о замке, вдохновитель Гарри Поттера",
    },
    top_food: {
      TW: "哈吉斯 (Haggis)、蘇格蘭威士忌", EN: "Haggis, Scotch whiskey", JP: "ハギス、スコッチウイスキー", KR: "하기스, 스카치 위스키", FR: "Haggis, whisky écossais", ES: "Haggis, whisky escocés", ID: "Haggis, wiski Scotch", HI: "हैगिस, स्कॉच व्हिस्की", PT: "Haggis, whisky escocês", AR: "هاجيس، ويسكي سكوتش", RU: "Хаггис, шотландский виски",
    },
    must_visit_spot: {
      TW: "愛丁堡城堡、皇家一英里", EN: "Edinburgh Castle, Royal Mile", JP: "エディンバラ城、ロイヤルマイル", KR: "에딘버러 성, 로얄마일", FR: "Château d'Édimbourg, Royal Mile", ES: "Castillo de Edimburgo, Milla Real", ID: "Kastil Edinburgh, Royal Mile", HI: "एडिनबर्ग कैसल, रॉयल माइल", PT: "Castelo de Edimburgo, Royal Mile", AR: "قلعة ادنبره، رويال مايل", RU: "Эдинбургский замок, Королевская миля",
    }
  },
  "佛羅倫斯": {
    name: {
      TW: "佛羅倫斯", EN: "Florence", JP: "フィレンツェ", KR: "피렌체", FR: "Florence", ES: "Florencia", ID: "Florence", HI: "फ़्लोरेंस", PT: "Florença", AR: "فلورنسا", RU: "Флоренция",
    },
    description: {
      TW: "文藝復興搖籃，極致的藝術與皮革工藝", EN: "The cradle of the Renaissance, the ultimate in art and leather craftsmanship", JP: "ルネッサンス発祥の地、究極の芸術と皮革工芸品", KR: "르네상스의 요람, 예술과 가죽 공예의 정점", FR: "Le berceau de la Renaissance, le summum de l'art et de la maroquinerie", ES: "La cuna del Renacimiento, lo último en arte y artesanía en cuero.", ID: "Tempat lahirnya Renaisans, seni dan keahlian kulit terbaik", HI: "पुनर्जागरण का उद्गम स्थल, कला और चमड़े की शिल्प कौशल में सर्वोच्च", PT: "O berço da Renascença, o máximo em arte e artesanato em couro", AR: "مهد عصر النهضة، قمة الفن وصناعة الجلود", RU: "Колыбель Ренессанса, вершина искусства и мастерства обработки кожи.",
    },
    top_food: {
      TW: "丁骨牛排 (Bistecca)、牛肚包", EN: "T-bone steak (Bistecca), tripe buns", JP: "Tボーンステーキ（ビステッカ）、トライプバンズ", KR: "티본스테이크(비스테카), 곱창번", FR: "Bifteck d'aloyau (Bistecca), petits pains aux tripes", ES: "Chuletón (Bistecca), bollos de callos", ID: "Steak T-bone (Bistecca), roti babat", HI: "टी-बोन स्टेक (बिस्टेका), ट्रिप बन्स", PT: "Bife T-bone (Bistecca), pãezinhos de tripa", AR: "شريحة لحم تي بون (بيستيكا)، كعك الكرشة", RU: "Стейк Тибон (Бистекка), булочки с рубцом",
    },
    must_visit_spot: {
      TW: "百花大教堂、烏菲茲美術館", EN: "Cathedral of Flowers, Uffizi Gallery", JP: "花の大聖堂、ウフィツィ美術館", KR: "꽃의 대성당, 우피치 갤러리", FR: "Cathédrale des Fleurs, Galerie des Offices", ES: "Catedral de las Flores, Galería Uffizi", ID: "Katedral Bunga, Galeri Uffizi", HI: "फूलों का कैथेड्रल, उफीज़ी गैलरी", PT: "Catedral das Flores, Galeria Uffizi", AR: "كاتدرائية الزهور، معرض أوفيزي", RU: "Собор Цветов, Галерея Уффици.",
    }
  },
  "尼斯": {
    name: {
      TW: "尼斯", EN: "Nice", JP: "ニース", KR: "멋진", FR: "Bon", ES: "Lindo", ID: "Bagus", HI: "अच्छा", PT: "Legal", AR: "لطيف - جيد", RU: "Хороший",
    },
    description: {
      TW: "蔚藍海岸，法式度假的優雅縮影", EN: "The French Riviera, the epitome of French elegance", JP: "フランスのエレガンスの縮図、フレンチ リヴィエラ", KR: "프렌치 우아함의 대명사, 프렌치 리비에라", FR: "La Côte d'Azur, l'incarnation de l'élégance à la française", ES: "La Riviera Francesa, el epítome de la elegancia francesa", ID: "French Riviera, lambang keanggunan Prancis", HI: "फ्रेंच रिवेरा, फ्रांसीसी सुंदरता का प्रतीक", PT: "A Riviera Francesa, o epítome da elegância francesa", AR: "الريفييرا الفرنسية، مثال للأناقة الفرنسية", RU: "Французская Ривьера – воплощение французской элегантности",
    },
    top_food: {
      TW: "尼斯沙拉、索卡 (Socca)", EN: "Nicoise Salad, Socca", JP: "ニース風サラダ、ソッカ", KR: "니코아즈 샐러드, 소카", FR: "Salade Niçoise, Socca", ES: "Ensalada Nicoise, Socca", ID: "Salad Nicoise, Socca", HI: "निकोइस सलाद, सोका", PT: "Salada Nicoise, Socca", AR: "سلطة نيكواز، سوكا", RU: "Салат Нисуаз, Сокка",
    },
    must_visit_spot: {
      TW: "天使灣、尼斯老城", EN: "Bay of Angels, Nice Old Town", JP: "ベイ オブ エンジェルス、ニース旧市街", KR: "베이 오브 엔젤스, 니스 구시가지", FR: "Baie des Anges, Vieille Ville de Nice", ES: "Bahía de los Ángeles, bonito casco antiguo", ID: "Bay of Angels, Kota Tua yang Bagus", HI: "एन्जिल्स की खाड़ी, अच्छा पुराना शहर", PT: "Baía dos Anjos, Cidade Velha de Nice", AR: "خليج الملائكة، مدينة نيس القديمة", RU: "Залив Ангелов, Старый город Ниццы",
    }
  },
  "聖托里尼": {
    name: {
      TW: "聖托里尼", EN: "santorini", JP: "サントリーニ島", KR: "산토리니", FR: "Santorin", ES: "Santorini", ID: "santorini", HI: "सेंटोरिनी", PT: "santorini", AR: "سانتوريني", RU: "Санторини",
    },
    description: {
      TW: "藍白天堂，全球最美的日落觀賞點", EN: "Blue and white paradise, the most beautiful sunset viewing spot in the world", JP: "世界で最も美しい夕日鑑賞スポット、青と白の楽園", KR: "청백의 낙원, 세계에서 가장 아름다운 일몰 명소", FR: "Paradis bleu et blanc, le plus beau coucher de soleil au monde", ES: "Paraíso azul y blanco, el lugar para ver el atardecer más hermoso del mundo", ID: "Surga biru putih, tempat melihat matahari terbenam terindah di dunia", HI: "नीला और सफ़ेद स्वर्ग, दुनिया में सूर्यास्त देखने का सबसे खूबसूरत स्थान", PT: "Paraíso azul e branco, o ponto de observação do pôr do sol mais lindo do mundo", AR: "الجنة الزرقاء والبيضاء، أجمل مكان لمشاهدة غروب الشمس في العالم", RU: "Голубой и белый рай, самое красивое место в мире для наблюдения за закатом.",
    },
    top_food: {
      TW: "烤章魚、希臘沙拉", EN: "Grilled octopus, Greek salad", JP: "タコのグリル、ギリシャ風サラダ", KR: "구운 문어, 그리스 샐러드", FR: "Poulpe grillé, salade grecque", ES: "Pulpo a la plancha, ensalada griega", ID: "Gurita panggang, salad Yunani", HI: "ग्रिल्ड ऑक्टोपस, ग्रीक सलाद", PT: "Polvo grelhado, salada grega", AR: "أخطبوط مشوي، سلطة يونانية", RU: "Осьминог гриль, греческий салат",
    },
    must_visit_spot: {
      TW: "伊亞小鎮 (Oia)、紅沙灘", EN: "Oia town (Oia), red sand beach", JP: "イアの町（イア）、赤い砂のビーチ", KR: "이아 마을(이아), 붉은 모래 해변", FR: "Ville d'Oia (Oia), plage de sable rouge", ES: "Ciudad de Oia (Oia), playa de arena roja", ID: "Kota Oia (Oia), pantai pasir merah", HI: "ओइया शहर (ओइया), लाल रेतीला समुद्र तट", PT: "Cidade de Oia (Oia), praia de areia vermelha", AR: "مدينة أويا (أويا)، شاطئ الرمال الحمراء", RU: "Город Ия (Oia), пляж с красным песком",
    }
  },
  "雷克雅維克": {
    name: {
      TW: "雷克雅維克", EN: "Reykjavik", JP: "レイキャビク", KR: "레이캬비크", FR: "Reykjavík", ES: "Reikiavik", ID: "Reykjavik", HI: "रिक्जेविक", PT: "Reykjavík", AR: "ريكيافيك", RU: "Рейкьявик",
    },
    description: {
      TW: "極光之城，外星般的冰火地貌體驗", EN: "City of Aurora, an alien-like experience of ice and fire landforms", JP: "氷と炎の地形が異星人のような体験をもたらすオーロラの街", KR: "얼음과 불 지형을 외계인처럼 경험하는 오로라의 도시", FR: "City of Aurora, une expérience extraterrestre de reliefs de glace et de feu", ES: "Ciudad de Aurora, una experiencia extraterrestre de accidentes geográficos de hielo y fuego", ID: "Kota Aurora, pengalaman bentang alam es dan api yang mirip alien", HI: "ऑरोरा शहर, बर्फ और आग की भू-आकृतियों का एक एलियन जैसा अनुभव", PT: "Cidade de Aurora, uma experiência alienígena de formas de relevo de gelo e fogo", AR: "مدينة أورورا، تجربة غريبة لأشكال الجليد والنار", RU: "Город Аврора, инопланетный опыт ледяных и огненных форм рельефа",
    },
    top_food: {
      TW: "羊肉湯、龍蝦湯", EN: "Lamb soup, lobster soup", JP: "ラムスープ、ロブスタースープ", KR: "양고기 수프, 랍스터 수프", FR: "Soupe d'agneau, soupe de homard", ES: "Sopa de cordero, sopa de bogavante", ID: "Sup domba, sup lobster", HI: "मेमने का सूप, झींगा मछली का सूप", PT: "Sopa de cordeiro, sopa de lagosta", AR: "حساء لحم الضأن، حساء جراد البحر", RU: "Суп из баранины, суп из лобстера",
    },
    must_visit_spot: {
      TW: "藍湖溫泉、哈爾格林姆教堂", EN: "Blue Lagoon, Hallgrímskirkja", JP: "ブルー ラグーン、ハットルグリムス教会", KR: "블루 라군, 할그림스키르캬", FR: "Lagon Bleu, Hallgrímskirkja", ES: "Laguna Azul, Hallgrímskirkja", ID: "Laguna Biru, Hallgrímskirkja", HI: "ब्लू लैगून, हॉलग्रिम्सकिर्कजा", PT: "Lagoa Azul, Hallgrímskirkja", AR: "بلو لاجون، هالجريمسكيركجا", RU: "Голубая лагуна, Хадльгримскиркья",
    }
  },
  "峇里島(庫塔)": {
    name: {
      TW: "峇里島(庫塔)", EN: "Bali(Kuta)", JP: "バリ島(クタ)", KR: "발리(쿠타)", FR: "Bali(Kuta)", ES: "Bali (Kuta)", ID: "Bali(Kuta)", HI: "बाली(कुटा)", PT: "Bali (Kuta)", AR: "بالي(كوتا)", RU: "Бали(Кута)",
    },
    description: {
      TW: "衝浪天堂，熱帶島嶼的信仰與放鬆", EN: "Surfing paradise, tropical island faith and relaxation", JP: "サーフィンの楽園、熱帯の島への信仰とリラクゼーション", KR: "서핑 천국, 열대 섬 신앙과 휴식", FR: "Paradis du surf, foi sur les îles tropicales et détente", ES: "Paraíso del surf, isla tropical, fe y relajación.", ID: "Surga selancar, keyakinan pulau tropis, dan relaksasi", HI: "सर्फिंग स्वर्ग, उष्णकटिबंधीय द्वीप आस्था और विश्राम", PT: "Paraíso do surf, fé e relaxamento em ilhas tropicais", AR: "جنة ركوب الأمواج، والجزيرة الاستوائية، والإيمان والاسترخاء", RU: "Рай для серфинга, тропический остров веры и отдыха",
    },
    top_food: {
      TW: "髒鴨飯、烤豬飯", EN: "Dirty duck rice, roast pig rice", JP: "ダーティダックライス、ローストピッグライス", KR: "오리밥,돼지밥", FR: "Riz au canard sale, riz au cochon rôti", ES: "Arroz de pato sucio, arroz de cerdo asado", ID: "Nasi bebek kotor, nasi babi panggang", HI: "गंदा बत्तख चावल, भुना सुअर चावल", PT: "Arroz de pato sujo, arroz de porco assado", AR: "أرز البط القذر، أرز الخنزير المشوي", RU: "Рис с грязной уткой, рис с жареной свиньей",
    },
    must_visit_spot: {
      TW: "海神廟、烏魯瓦圖", EN: "Tanah Lot Temple, Uluwatu", JP: "タナロット寺院、ウルワツ", KR: "타나롯 사원, 울루와뚜", FR: "Temple Tanah Lot, Uluwatu", ES: "Templo de Tanah Lot, Uluwatu", ID: "Pura Tanah Lot, Uluwatu", HI: "तनाह लोट मंदिर, उलुवातु", PT: "Templo de Tanah Lot, Uluwatu", AR: "معبد تاناه لوت، أولواتو", RU: "Храм Танах Лот, Улувату",
    }
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
        case "Русский": return "RU";
        default: return "EN";
    }
}

export const getTranslatedData = (cityId: string, type: 'name' | 'description' | 'top_food' | 'must_visit_spot', currentLangName: string, fallbackText?: string): string => {
    if (!cityId) return fallbackText || cityId;
    const normalizedId = cityId.toLowerCase().replace(/\s/g, ''); 
    const city = cityDataTranslations[normalizedId];

    if (!city || !city[type]) return fallbackText || cityId;

    const langKey = mapLangToSupported(currentLangName);

    return city[type][langKey] || city[type]['EN'] || city[type]['TW'] || fallbackText || cityId;
};

export const getTranslatedCityName = (cityId: string, currentLangName: string): string => {
    return getTranslatedData(cityId, 'name', currentLangName, cityId);
};
