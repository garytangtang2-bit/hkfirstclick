export type SupportedLang = 'TW' | 'EN' | 'JP' | 'KR' | 'FR' | 'ES' | 'ID' | 'HI' | 'PT' | 'AR' | 'RU';

export const cityDataTranslations: Record<string, { name: Partial<Record<SupportedLang, string>>, description: Partial<Record<SupportedLang, string>> }> = {
  "香港": {
    name: {
      TW: "香港", EN: "Hongkong", JP: "香港", KR: "홍콩", FR: "Hong Kong", ES: "Hong Kong", ID: "Hongkong", HI: "हांगकांग", PT: "Hong Kong", AR: "هونغ كونغ", RU: "Гонконг",
    },
    description: {
      TW: "中西合璧，璀璨夜景與金融中心", EN: "Combining Chinese and Western elements, dazzling night view and financial center", JP: "中国と西洋の要素が融合した、まばゆい夜景と金融センター", KR: "중국과 서양의 요소가 결합된 눈부신 야경과 금융센터", FR: "Combinant des éléments chinois et occidentaux, une vue nocturne éblouissante et un centre financier", ES: "Combinando elementos chinos y occidentales, deslumbrante vista nocturna y centro financiero", ID: "Menggabungkan unsur Tiongkok dan Barat, pemandangan malam yang mempesona, dan pusat keuangan", HI: "चीनी और पश्चिमी तत्वों का मिश्रण, चमकदार रात का दृश्य और वित्तीय केंद्र", PT: "Combinando elementos chineses e ocidentais, vista noturna deslumbrante e centro financeiro", AR: "يجمع بين العناصر الصينية والغربية وإطلالة ليلية مبهرة ومركز مالي", RU: "Сочетание китайских и западных элементов, великолепный ночной вид и финансовый центр.",
    }
  },
  "曼谷": {
    name: {
      TW: "曼谷", EN: "Bangkok", JP: "バンコク", KR: "방콕", FR: "Bangkok", ES: "Bangkok", ID: "Bangkok", HI: "बैंकाक", PT: "Bangkok", AR: "بانكوك", RU: "Бангкок",
    },
    description: {
      TW: "街頭活力，高CP值按摩與佛教文化", EN: "Street vitality, high CP value massage and Buddhist culture", JP: "街の活気、CP価値の高いマッサージと仏教文化", KR: "거리의 활력, 높은 CP 가치의 마사지와 불교문화", FR: "Vitalité de rue, massage à haute valeur CP et culture bouddhiste", ES: "Vitalidad callejera, masajes de alto valor CP y cultura budista.", ID: "Vitalitas jalanan, pijat bernilai CP tinggi, dan budaya Buddha", HI: "स्ट्रीट जीवन शक्ति, उच्च सीपी मूल्य मालिश और बौद्ध संस्कृति", PT: "Vitalidade das ruas, massagem de alto valor CP e cultura budista", AR: "حيوية الشارع والتدليك عالي القيمة والثقافة البوذية", RU: "Уличная энергия, высокоэффективный массаж CP и буддийская культура",
    }
  },
  "東京": {
    name: {
      TW: "東京", EN: "Tokyo", JP: "東京", KR: "도쿄", FR: "Tokyo", ES: "Tokio", ID: "Tokyo", HI: "टोक्यो", PT: "Tóquio", AR: "طوكيو", RU: "Токио",
    },
    description: {
      TW: "極致秩序，動漫天堂與潮流聖地", EN: "Ultimate order, animation paradise and trendy holy land", JP: "究極の秩序、アニメ天国、そして流行の聖地", KR: "궁극의 질서, 애니메이션 천국, 트렌디한 성지", FR: "Ordre ultime, paradis de l'animation et terre sainte branchée", ES: "Orden definitivo, paraíso de la animación y tierra santa de moda", ID: "Keteraturan tertinggi, surga animasi, dan tanah suci yang trendi", HI: "अंतिम आदेश, एनीमेशन स्वर्ग और आधुनिक पवित्र भूमि", PT: "Ordem definitiva, paraíso da animação e terra santa da moda", AR: "النظام النهائي وجنة الرسوم المتحركة والأرض المقدسة العصرية", RU: "Абсолютный порядок, анимационный рай и модная святая земля",
    }
  },
  "巴黎": {
    name: {
      TW: "巴黎", EN: "Paris", JP: "パリ", KR: "파리", FR: "Paris", ES: "París", ID: "Paris", HI: "पेरिस", PT: "Paris", AR: "باريس", RU: "Париж",
    },
    description: {
      TW: "浪漫之都，藝術畫廊與咖啡文化", EN: "Romantic city, art galleries and coffee culture", JP: "ロマンチックな街、アートギャラリー、コーヒー文化", KR: "낭만의 도시, 미술관과 커피 문화", FR: "Ville romantique, galeries d'art et culture du café", ES: "Ciudad romántica, galerías de arte y cultura cafetera.", ID: "Kota romantis, galeri seni, dan budaya kopi", HI: "रोमांटिक शहर, कला दीर्घाएँ और कॉफ़ी संस्कृति", PT: "Cidade romântica, galerias de arte e cultura cafeeira", AR: "مدينة رومانسية ومعارض فنية وثقافة القهوة", RU: "Романтический город, художественные галереи и кофейная культура",
    }
  },
  "倫敦": {
    name: {
      TW: "倫敦", EN: "london", JP: "ロンドン", KR: "런던", FR: "Londres", ES: "Londres", ID: "London", HI: "लंदन", PT: "Londres", AR: "لندن", RU: "Лондон",
    },
    description: {
      TW: "皇室優雅，歷史博物館與大笨鐘", EN: "Royal elegance, history museum and Big Ben", JP: "王室の優雅さ、歴史博物館、ビッグ ベン", KR: "왕실의 우아함, 역사 박물관, 빅벤", FR: "Élégance royale, musée d'histoire et Big Ben", ES: "Elegancia real, museo de historia y Big Ben", ID: "Keanggunan kerajaan, museum sejarah, dan Big Ben", HI: "शाही भव्यता, इतिहास संग्रहालय और बिग बेन", PT: "Elegância real, museu de história e Big Ben", AR: "الأناقة الملكية ومتحف التاريخ وبيغ بن", RU: "Королевская элегантность, исторический музей и Биг-Бен",
    }
  },
  "新加坡": {
    name: {
      TW: "新加坡", EN: "Singapore", JP: "シンガポール", KR: "싱가포르", FR: "Singapour", ES: "Singapur", ID: "Singapura", HI: "सिंगापुर", PT: "Cingapura", AR: "سنغافورة", RU: "Сингапур",
    },
    description: {
      TW: "花園城市，科技與自然完美結合", EN: "Garden City, a perfect combination of technology and nature", JP: "テクノロジーと自然が完璧に融合した田園都市", KR: "기술과 자연이 완벽하게 결합된 가든시티", FR: "Garden City, une combinaison parfaite entre technologie et nature", ES: "Ciudad Jardín, una combinación perfecta entre tecnología y naturaleza", ID: "Garden City, kombinasi sempurna antara teknologi dan alam", HI: "गार्डन सिटी, प्रौद्योगिकी और प्रकृति का एक आदर्श संयोजन", PT: "Garden City, uma combinação perfeita de tecnologia e natureza", AR: "جاردن سيتي، مزيج مثالي من التكنولوجيا والطبيعة", RU: "Город-сад: идеальное сочетание технологий и природы",
    }
  },
  "紐約": {
    name: {
      TW: "紐約", EN: "new york", JP: "ニューヨーク", KR: "뉴욕", FR: "New York", ES: "Nueva York", ID: "New York", HI: "न्यूयॉर्क", PT: "Nova Iorque", AR: "نيويورك", RU: "Нью-Йорк",
    },
    description: {
      TW: "大蘋果，不夜城，全球文化交匯處", EN: "The Big Apple, the city that never sleeps, the crossroads of global cultures", JP: "ビッグアップル、眠らない街、世界文化の交差点", KR: "잠들지 않는 도시, 글로벌 문화의 교차로, 빅애플", FR: "La Big Apple, la ville qui ne dort jamais, le carrefour des cultures mondiales", ES: "La Gran Manzana, la ciudad que nunca duerme, el cruce de culturas globales", ID: "The Big Apple, kota yang tidak pernah tidur, persimpangan budaya global", HI: "बिग एप्पल, वह शहर जो कभी नहीं सोता, वैश्विक संस्कृतियों का चौराहा", PT: "A Big Apple, a cidade que nunca dorme, a encruzilhada das culturas globais", AR: "التفاحة الكبيرة، المدينة التي لا تنام، ملتقى طرق الثقافات العالمية", RU: "«Большое Яблоко», город, который никогда не спит, перекресток мировых культур.",
    }
  },
  "杜拜": {
    name: {
      TW: "杜拜", EN: "dubai", JP: "ドバイ", KR: "두바이", FR: "Dubaï", ES: "dubái", ID: "dubai", HI: "दुबई", PT: "Dubai", AR: "دبي", RU: "Дубай",
    },
    description: {
      TW: "奢華現代，世界第一高樓與沙漠冒險", EN: "Luxurious modernity, the world’s tallest building and desert adventure", JP: "豪華な現代性、世界で最も高い建物、そして砂漠の冒険", KR: "럭셔리한 현대성, 세계에서 가장 높은 건물과 사막 모험", FR: "Modernité luxueuse, bâtiment le plus haut du monde et aventure dans le désert", ES: "Modernidad lujosa, el edificio más alto del mundo y aventura en el desierto", ID: "Modernitas yang mewah, gedung tertinggi di dunia, dan petualangan gurun pasir", HI: "शानदार आधुनिकता, दुनिया की सबसे ऊंची इमारत और रेगिस्तान का रोमांच", PT: "Modernidade luxuosa, o edifício mais alto do mundo e aventura no deserto", AR: "الحداثة الفاخرة وأطول مبنى في العالم والمغامرة الصحراوية", RU: "Роскошная современность, самое высокое здание в мире и приключения в пустыне",
    }
  },
  "羅馬": {
    name: {
      TW: "羅馬", EN: "rome", JP: "ローマ", KR: "로마", FR: "Rome", ES: "Roma", ID: "Roma", HI: "रोम", PT: "Roma", AR: "روما", RU: "Рим",
    },
    description: {
      TW: "永恆之城，古羅馬建築與歷史博物館", EN: "Eternal City, Museum of Ancient Roman Architecture and History", JP: "永遠の都、古代ローマ建築と歴史博物館", KR: "영원한 도시, 고대 로마 건축 및 역사 박물관", FR: "Ville Eternelle, Musée d'Architecture et d'Histoire de la Rome Antique", ES: "Ciudad Eterna, Museo de Arquitectura e Historia Romana Antigua", ID: "Kota Abadi, Museum Arsitektur dan Sejarah Romawi Kuno", HI: "शाश्वत शहर, प्राचीन रोमन वास्तुकला और इतिहास का संग्रहालय", PT: "Cidade Eterna, Museu de Arquitetura e História da Roma Antiga", AR: "المدينة الخالدة، متحف العمارة والتاريخ الروماني القديم", RU: "Вечный город, Музей древнеримской архитектуры и истории",
    }
  },
  "巴塞隆拿": {
    name: {
      TW: "巴塞隆拿", EN: "barcelona", JP: "バルセロナ", KR: "바르셀로나", FR: "Barcelone", ES: "Barcelona", ID: "barcelona", HI: "बार्सिलोना", PT: "Barcelona", AR: "برشلونة", RU: "Барселона",
    },
    description: {
      TW: "建築奇蹟，地中海陽光與藝術氛圍", EN: "Architectural wonders, Mediterranean sunshine and artistic atmosphere", JP: "驚異の建築、地中海の太陽の光、芸術的な雰囲気", KR: "경이로운 건축물, 지중해의 햇살, 예술적인 분위기", FR: "Merveilles architecturales, soleil méditerranéen et ambiance artistique", ES: "Maravillas arquitectónicas, sol mediterráneo y atmósfera artística", ID: "Keajaiban arsitektur, sinar matahari Mediterania, dan suasana artistik", HI: "वास्तुकला के चमत्कार, भूमध्यसागरीय धूप और कलात्मक वातावरण", PT: "Maravilhas arquitetônicas, sol mediterrâneo e atmosfera artística", AR: "عجائب معمارية وأشعة شمس البحر الأبيض المتوسط ​​وأجواء فنية", RU: "Архитектурные чудеса, средиземноморское солнце и художественная атмосфера",
    }
  },
  "首爾": {
    name: {
      TW: "首爾", EN: "Seoul", JP: "ソウル", KR: "서울", FR: "Séoul", ES: "Seúl", ID: "seoul", HI: "सोल", PT: "Seul", AR: "سيول", RU: "Сеул",
    },
    description: {
      TW: "K-Pop 聖地，美妝購物與現代生活", EN: "K-Pop mecca, beauty shopping and modern life", JP: "K-POPのメッカ、ビューティーショッピングと現代生活", KR: "K-Pop의 메카, 뷰티 쇼핑과 현대 생활", FR: "Mecque de la K-Pop, du shopping beauté et de la vie moderne", ES: "La meca del K-Pop, los centros de belleza y la vida moderna", ID: "Kiblat K-Pop, belanja kecantikan, dan kehidupan modern", HI: "के-पॉप मक्का, सौंदर्य खरीदारी और आधुनिक जीवन", PT: "Meca do K-Pop, compras de produtos de beleza e vida moderna", AR: "الكيبوب مكة، تسوق الجمال والحياة العصرية", RU: "Мекка K-Pop, бьюти-шопинг и современная жизнь",
    }
  },
  "台北": {
    name: {
      TW: "台北", EN: "Taipei", JP: "台北", KR: "타이페이", FR: "Taïpei", ES: "Taipéi", ID: "Taipei", HI: "ताइपे", PT: "Taipei", AR: "تايبيه", RU: "Тайбэй",
    },
    description: {
      TW: "熱情好客，夜市文化與便利生活", EN: "Hospitality, night market culture and convenient life", JP: "おもてなし、夜市文化、便利な生活", KR: "환대와 야시장 문화, 편리한 생활", FR: "Hospitalité, culture du marché nocturne et vie pratique", ES: "Hospitalidad, cultura de mercado nocturno y vida cómoda.", ID: "Keramahan, budaya pasar malam, dan kehidupan yang nyaman", HI: "आतिथ्य, रात्रि बाज़ार संस्कृति और सुविधाजनक जीवन", PT: "Hospitalidade, cultura do mercado noturno e vida conveniente", AR: "الضيافة وثقافة السوق الليلي والحياة المريحة", RU: "Гостеприимство, культура ночного рынка и удобная жизнь",
    }
  },
  "大阪": {
    name: {
      TW: "大阪", EN: "Osaka", JP: "大阪", KR: "오사카", FR: "Ōsaka", ES: "Osaka", ID: "Osaka", HI: "ओसाका", PT: "Osaca", AR: "أوساكا", RU: "Осака",
    },
    description: {
      TW: "天下之廚房，關西熱情與環球影城", EN: "Kitchen of the World, Kansai Passion and Universal Studios", JP: "世界のキッチン、関西パッション、ユニバーサルスタジオ", KR: "세계의 주방, 간사이 패션, 유니버셜 스튜디오", FR: "Cuisine du monde, Kansai Passion et Universal Studios", ES: "Cocina del mundo, Kansai Passion y Universal Studios", ID: "Dapur Dunia, Kansai Passion, dan Universal Studios", HI: "किचन ऑफ द वर्ल्ड, कंसाई पैशन और यूनिवर्सल स्टूडियो", PT: "Cozinha do Mundo, Kansai Passion e Universal Studios", AR: "مطبخ العالم، كانساي باشن ويونيفرسال ستوديوز", RU: "Кухня мира, Kansai Passion и Universal Studios",
    }
  },
  "京都": {
    name: {
      TW: "京都", EN: "Kyoto", JP: "京都", KR: "교토", FR: "Kyoto", ES: "Kioto", ID: "Kyoto", HI: "क्योटो", PT: "Quioto", AR: "كيوتو", RU: "Киото",
    },
    description: {
      TW: "千年古都，和服體驗與禪意寺廟", EN: "Thousand-year-old ancient capital, kimono experience and Zen temples", JP: "千年の古都と着物体験と禅寺", KR: "천년고도, 기모노 체험, 선종 사찰", FR: "Ancienne capitale millénaire, expérience du kimono et temples zen", ES: "Antigua capital milenaria, experiencia con kimonos y templos zen", ID: "Ibu kota kuno berusia ribuan tahun, pengalaman kimono, dan kuil Zen", HI: "हज़ार साल पुरानी प्राचीन राजधानी, किमोनो अनुभव और ज़ेन मंदिर", PT: "Capital milenar, experiência com quimonos e templos Zen", AR: "عاصمة قديمة عمرها ألف عام وتجربة الكيمونو ومعابد زن", RU: "Тысячелетняя древняя столица, опыт кимоно и храмы дзен",
    }
  },
  "雪梨": {
    name: {
      TW: "雪梨", EN: "Sydney", JP: "シドニー", KR: "시드니", FR: "Sidney", ES: "Sídney", ID: "Sidney", HI: "सिडनी", PT: "Sidney", AR: "سيدني", RU: "Сидней",
    },
    description: {
      TW: "海灣之美，戶外生活與標誌性歌劇院", EN: "The beauty of the bay, outdoor living and the iconic Opera House", JP: "湾の美しさ、アウトドアリビング、そして象徴的なオペラハウス", KR: "만의 아름다움, 야외 생활, 상징적인 오페라 하우스", FR: "La beauté de la baie, la vie en plein air et l'emblématique Opéra", ES: "La belleza de la bahía, la vida al aire libre y la icónica Ópera", ID: "Keindahan teluk, kehidupan luar ruangan, dan Gedung Opera yang ikonik", HI: "खाड़ी की सुंदरता, बाहरी जीवन और प्रतिष्ठित ओपेरा हाउस", PT: "A beleza da baía, a vida ao ar livre e a icônica Opera House", AR: "جمال الخليج والمعيشة في الهواء الطلق ودار الأوبرا الشهيرة", RU: "Красота залива, жизнь на свежем воздухе и знаменитый Оперный театр.",
    }
  },
  "阿姆斯特丹": {
    name: {
      TW: "阿姆斯特丹", EN: "amsterdam", JP: "アムステルダム", KR: "암스테르담", FR: "amsterdam", ES: "ámsterdam", ID: "amsterdam", HI: "एम्सटर्डम", PT: "Amsterdã", AR: "أمستردام", RU: "Амстердам",
    },
    description: {
      TW: "運河之城，自由奔放與博物館之旅", EN: "The city of canals, free spirit and museum tours", JP: "運河の街、自由な精神、美術館ツアー", KR: "운하, 자유로운 영혼, 박물관 투어의 도시", FR: "La ville des canaux, esprit libre et visites de musées", ES: "La ciudad de los canales, espíritu libre y visitas a museos", ID: "Kota kanal, semangat bebas, dan tur museum", HI: "नहरों का शहर, मुक्त आत्मा और संग्रहालय पर्यटन", PT: "A cidade dos canais, do espírito livre e dos passeios em museus", AR: "مدينة القنوات والروح الحرة وجولات المتحف", RU: "Город каналов, свободный дух и экскурсии по музеям",
    }
  },
  "威尼斯": {
    name: {
      TW: "威尼斯", EN: "Venice", JP: "ヴェネツィア", KR: "베니스", FR: "Venise", ES: "Venecia", ID: "Venesia", HI: "वेनिस", PT: "Veneza", AR: "البندقية", RU: "Венеция",
    },
    description: {
      TW: "水上明珠，獨特的貢多拉體驗", EN: "A pearl on the water, a unique gondola experience", JP: "水上の真珠、ユニークなゴンドラ体験", KR: "물 위의 진주, 독특한 곤돌라 체험", FR: "Une perle sur l'eau, une expérience unique en gondole", ES: "Una perla en el agua, una experiencia única en góndola", ID: "Mutiara di atas air, pengalaman gondola yang unik", HI: "पानी पर एक मोती, एक अनोखा गोंडोला अनुभव", PT: "Uma pérola na água, uma experiência única de gôndola", AR: "لؤلؤة فوق الماء، تجربة جندول فريدة من نوعها", RU: "Жемчужина на воде, уникальные впечатления от гондолы",
    }
  },
  "布拉格": {
    name: {
      TW: "布拉格", EN: "Prague", JP: "プラハ", KR: "프라하", FR: "Prague", ES: "Praga", ID: "Praha", HI: "प्राहा", PT: "Praga", AR: "براغ", RU: "Прага",
    },
    description: {
      TW: "中世紀童話，紅磚瓦與波希米亞風情", EN: "Medieval fairy tale, red bricks and bohemian style", JP: "中世のおとぎ話、赤レンガ、ボヘミアン スタイル", KR: "중세 동화, 붉은 벽돌, 보헤미안 스타일", FR: "Conte de fée médiéval, briques rouges et style bohème", ES: "Cuento de hadas medieval, ladrillos rojos y estilo bohemio.", ID: "Dongeng abad pertengahan, bata merah, dan gaya bohemian", HI: "मध्यकालीन परी कथा, लाल ईंटें और बोहेमियन शैली", PT: "Conto de fadas medieval, tijolos vermelhos e estilo boêmio", AR: "حكاية خرافية من العصور الوسطى والطوب الأحمر والأسلوب البوهيمي", RU: "Средневековая сказка, красный кирпич и богемный стиль.",
    }
  },
  "吉隆坡": {
    name: {
      TW: "吉隆坡", EN: "Kuala Lumpur", JP: "クアラルンプール", KR: "쿠알라룸푸르", FR: "Kuala Lumpur", ES: "Kuala Lumpur", ID: "Kuala Lumpur", HI: "क्वालालंपुर", PT: "Kuala Lumpur", AR: "كوالا لمبور", RU: "Куала-Лумпур",
    },
    description: {
      TW: "多元民族，雙子塔與森林城市", EN: "Multiethnicity, Twin Towers and Forest City", JP: "多民族、ツインタワー、森林都市", KR: "다민족성, 쌍둥이 빌딩, 포레스트 시티", FR: "Multiethnicité, Twin Towers et Forest City", ES: "Multietnicidad, Torres Gemelas y Forest City", ID: "Multietnis, Menara Kembar dan Hutan Kota", HI: "बहुजातीयता, ट्विन टावर्स और वन शहर", PT: "Multietnia, Torres Gêmeas e Cidade Florestal", AR: "التعددية العرقية والبرجين التوأمين ومدينة الغابة", RU: "Многонациональность, башни-близнецы и лесной город",
    }
  },
  "維也納": {
    name: {
      TW: "維也納", EN: "vienna", JP: "ウィーン", KR: "비엔나", FR: "Vienne", ES: "viena", ID: "Wina", HI: "वियना", PT: "Viena", AR: "فيينا", RU: "Вена",
    },
    description: {
      TW: "音樂之都，古典建築與皇室咖啡館", EN: "City of music, classical architecture and royal cafes", JP: "音楽の街、古典的な建築、王室のカフェ", KR: "음악의 도시, 고전 건축물과 왕실 카페", FR: "Ville de musique, d'architecture classique et de cafés royaux", ES: "Ciudad de la música, arquitectura clásica y cafés reales", ID: "Kota musik, arsitektur klasik, dan kafe kerajaan", HI: "संगीत, शास्त्रीय वास्तुकला और शाही कैफे का शहर", PT: "Cidade da música, arquitetura clássica e cafés reais", AR: "مدينة الموسيقى والعمارة الكلاسيكية والمقاهي الملكية", RU: "Город музыки, классической архитектуры и королевских кафе",
    }
  },
  "柏林": {
    name: {
      TW: "柏林", EN: "Berlin", JP: "ベルリン", KR: "베를린", FR: "Berlin", ES: "Berlina", ID: "Berlin", HI: "बर्लिन", PT: "Berlim", AR: "برلين", RU: "Берлин",
    },
    description: {
      TW: "歷史傷痕與次文化融合，前衛藝術基地", EN: "Fusion of historical scars and subculture, avant-garde art base", JP: "歴史の傷跡とサブカルチャーの融合、前衛芸術の拠点", KR: "역사적 상처와 서브컬쳐의 융합, 아방가르드 예술의 베이스", FR: "Fusion des cicatrices historiques et de la sous-culture, base artistique d'avant-garde", ES: "Fusión de cicatrices históricas y subcultura, base artística de vanguardia.", ID: "Perpaduan bekas luka sejarah dan subkultur, basis seni avant-garde", HI: "ऐतिहासिक निशानों और उपसंस्कृति का संलयन, अवांट-गार्डे कला आधार", PT: "Fusão de cicatrizes históricas e subcultura, base artística de vanguarda", AR: "مزيج من الندبات التاريخية والثقافة الفرعية، وقاعدة فنية طليعية", RU: "Слияние исторических шрамов и субкультуры, основа авангардного искусства.",
    }
  },
  "馬德里": {
    name: {
      TW: "馬德里", EN: "madrid", JP: "マドリード", KR: "마드리드", FR: "Madrid", ES: "Madrid", ID: "Madrid", HI: "मैड्रिड", PT: "Madri", AR: "مدريد", RU: "Мадрид",
    },
    description: {
      TW: "熱情的廣場文化，不夜城的夜生活", EN: "Passionate square culture and nightlife in the city that never sleeps", JP: "眠らない街の情熱的な広場文化とナイトライフ", KR: "잠들지 않는 도시의 열정적인 광장 문화와 나이트라이프", FR: "Culture carrée passionnée et vie nocturne dans la ville qui ne dort jamais", ES: "Apasionada cultura de plaza y vida nocturna en la ciudad que nunca duerme", ID: "Budaya alun-alun yang penuh gairah dan kehidupan malam di kota yang tidak pernah tidur", HI: "शहर की जोशीली चौक संस्कृति और रात्रिजीवन जो कभी नहीं सोता", PT: "Cultura quadrada apaixonante e vida noturna na cidade que nunca dorme", AR: "ثقافة الساحة العاطفية والحياة الليلية في المدينة التي لا تنام", RU: "Страстная скверная культура и ночная жизнь в городе, который никогда не спит",
    }
  },
  "里斯本": {
    name: {
      TW: "里斯本", EN: "lisbon", JP: "リスボン", KR: "리스본", FR: "Lisbonne", ES: "Lisboa", ID: "Lisbon", HI: "लिस्बन", PT: "Lisboa", AR: "لشبونة", RU: "Лиссабон",
    },
    description: {
      TW: "七丘之城，懷舊電車與絕美花磚", EN: "The city of seven hills, nostalgic trams and stunning tiles", JP: "7つの丘、ノスタルジックな路面電車、見事なタイルの街", KR: "일곱 개의 언덕, 향수를 불러일으키는 트램, 아름다운 타일로 이루어진 도시", FR: "La ville aux sept collines, aux tramways nostalgiques et aux superbes tuiles", ES: "La ciudad de las siete colinas, tranvías nostálgicos y azulejos impresionantes", ID: "Kota tujuh bukit, trem nostalgia, dan ubin yang menakjubkan", HI: "सात पहाड़ियों, पुरानी यादों वाली ट्रामों और आश्चर्यजनक टाइलों का शहर", PT: "A cidade das sete colinas, eléctricos nostálgicos e azulejos deslumbrantes", AR: "مدينة التلال السبعة والترام الحنين والبلاط المذهل", RU: "Город семи холмов, ностальгические трамваи и потрясающая плитка",
    }
  },
  "雅典": {
    name: {
      TW: "雅典", EN: "athens", JP: "アテネ", KR: "아테네", FR: "Athènes", ES: "Atenas", ID: "Athena", HI: "एथेंस", PT: "Atenas", AR: "أثينا", RU: "Афины",
    },
    description: {
      TW: "西方文明發源地，古希臘神廟遺址", EN: "The birthplace of Western civilization, ruins of ancient Greek temples", JP: "西洋文明発祥の地、古代ギリシャの神殿遺跡", KR: "서구 문명의 발상지, 고대 그리스 신전 유적", FR: "Berceau de la civilisation occidentale, ruines d'anciens temples grecs", ES: "La cuna de la civilización occidental, ruinas de antiguos templos griegos.", ID: "Tempat kelahiran peradaban Barat, reruntuhan kuil Yunani kuno", HI: "पश्चिमी सभ्यता का जन्मस्थान, प्राचीन यूनानी मंदिरों के खंडहर", PT: "O berço da civilização ocidental, ruínas de antigos templos gregos", AR: "مهد الحضارة الغربية وأطلال المعابد اليونانية القديمة", RU: "Родина западной цивилизации, руины древнегреческих храмов",
    }
  },
  "胡志明市": {
    name: {
      TW: "胡志明市", EN: "Ho Chi Minh City", JP: "ホーチミン市", KR: "호치민시", FR: "Hô Chi Minh-Ville", ES: "Ciudad Ho Chi Minh", ID: "Kota Ho Chi Minh", HI: "हो ची मिन्ह सिटी", PT: "Cidade de Ho Chi Minh", AR: "مدينة هوشي منه", RU: "Хошимин",
    },
    description: {
      TW: "法式殖民風情與現代摩托大軍的碰撞", EN: "The collision of French colonial style and modern motorcycle army", JP: "フレンチコロニアルスタイルと現代のバイク軍団の衝突", KR: "프랑스 식민지 스타일과 현대 오토바이 군대의 충돌", FR: "La collision du style colonial français et de l’armée de motos moderne", ES: "La colisión entre el estilo colonial francés y el moderno ejército de motociclistas", ID: "Benturan gaya kolonial Perancis dan sepeda motor tentara modern", HI: "फ्रांसीसी औपनिवेशिक शैली और आधुनिक मोटरसाइकिल सेना की टक्कर", PT: "A colisão do estilo colonial francês e do moderno exército de motocicletas", AR: "التصادم بين الطراز الاستعماري الفرنسي وجيش الدراجات النارية الحديث", RU: "Столкновение французского колониального стиля и современной мотоциклетной армии.",
    }
  },
  "斯德哥爾摩": {
    name: {
      TW: "斯德哥爾摩", EN: "Stockholm", JP: "ストックホルム", KR: "스톡홀름", FR: "Stockholm", ES: "Estocolmo", ID: "Stockholm", HI: "स्टॉकहोम", PT: "Estocolmo", AR: "ستوكهولم", RU: "Стокгольм",
    },
    description: {
      TW: "北歐設計感，散落在島嶼間的水上之都", EN: "Nordic design sense, scattered among the islands in the water capital", JP: "水の都の島々に点在する北欧のデザインセンス", KR: "북유럽 디자인 감각, 물의 수도에 있는 섬들 사이에 흩어져 있음", FR: "Le sens du design nordique, dispersé parmi les îles de la capitale de l'eau", ES: "Sentido del diseño nórdico, repartido entre las islas de la capital del agua.", ID: "Selera desain Nordik, tersebar di antara pulau-pulau di ibu kota perairan", HI: "नॉर्डिक डिजाइन भावना, जल राजधानी में द्वीपों के बीच बिखरी हुई", PT: "Sentido de design nórdico, espalhado pelas ilhas da capital da água", AR: "إحساس بالتصميم الاسكندنافي، منتشر بين الجزر في العاصمة المائية", RU: "Скандинавский дизайн, разбросанный по островам водной столицы",
    }
  },
  "哥本哈根": {
    name: {
      TW: "哥本哈根", EN: "copenhagen", JP: "コペンハーゲン", KR: "코펜하겐", FR: "Copenhague", ES: "Copenhague", ID: "Kopenhagen", HI: "कोपेनहेगन", PT: "copenhague", AR: "كوبنهاغن", RU: "Копенгаген",
    },
    description: {
      TW: "最幸福的城市，單車友善與新港彩色屋", EN: "The happiest city, bike-friendly and colorful houses in Newport", JP: "ニューポートの最も幸せな街、自転車に優しい、カラフルな家々", KR: "뉴포트에서 가장 행복한 도시, 자전거 친화적이고 다채로운 주택", FR: "La ville la plus heureuse, les vélos et les maisons colorées de Newport", ES: "La ciudad más feliz, casas coloridas y aptas para bicicletas en Newport", ID: "Kota paling bahagia, rumah ramah sepeda dan penuh warna di Newport", HI: "न्यूपोर्ट में सबसे खुशहाल शहर, बाइक-अनुकूल और रंगीन घर", PT: "A cidade mais feliz, casas coloridas e adequadas para bicicletas em Newport", AR: "أسعد مدينة ومنازل ملونة وصديقة للدراجات في نيوبورت", RU: "Самый счастливый город, велосипедисты и красочные дома в Ньюпорте",
    }
  },
  "慕尼黑": {
    name: {
      TW: "慕尼黑", EN: "Munich", JP: "ミュンヘン", KR: "뮌헨", FR: "Munich", ES: "Munich", ID: "Munich", HI: "म्यूनिख", PT: "Munique", AR: "ميونيخ", RU: "Мюнхен",
    },
    description: {
      TW: "巴伐利亞傳統，啤酒節的狂歡與汽車工業", EN: "Bavarian tradition, Oktoberfest carnival and the automotive industry", JP: "バイエルンの伝統、オクトーバーフェスト カーニバル、自動車産業", KR: "바이에른 전통, 옥토버페스트 카니발 및 자동차 산업", FR: "Tradition bavaroise, carnaval de l'Oktoberfest et industrie automobile", ES: "Tradición bávara, carnaval Oktoberfest y industria automovilística", ID: "Tradisi Bavaria, karnaval Oktoberfest dan industri otomotif", HI: "बवेरियन परंपरा, ओकट्रैफेस्ट कार्निवल और ऑटोमोटिव उद्योग", PT: "Tradição bávara, carnaval da Oktoberfest e indústria automotiva", AR: "التقاليد البافارية وكرنفال مهرجان أكتوبر وصناعة السيارات", RU: "Баварские традиции, карнавал Октоберфест и автомобильная промышленность",
    }
  },
  "布魯塞爾": {
    name: {
      TW: "布魯塞爾", EN: "brussels", JP: "ブリュッセル", KR: "브뤼셀", FR: "Bruxelles", ES: "Bruselas", ID: "brussel", HI: "ब्रसेल्स", PT: "Bruxelas", AR: "بروكسل", RU: "Брюссель",
    },
    description: {
      TW: "歐洲心臟，漫畫文化與朱古力的香氣", EN: "Heart of Europe, comic culture and the aroma of chocolate", JP: "ヨーロッパの中心、コミック文化、そしてチョコレートの香り", KR: "유럽의 심장, 만화문화와 초콜릿의 향기", FR: "Cœur de l'Europe, culture de la bande dessinée et arôme du chocolat", ES: "Corazón de Europa, cultura del cómic y aroma a chocolate.", ID: "Jantung Eropa, budaya komik dan aroma coklat", HI: "यूरोप का दिल, हास्य संस्कृति और चॉकलेट की सुगंध", PT: "Coração da Europa, cultura cômica e aroma de chocolate", AR: "قلب أوروبا والثقافة الكوميدية ورائحة الشوكولاتة", RU: "Сердце Европы, комическая культура и аромат шоколада",
    }
  },
  "蘇黎世": {
    name: {
      TW: "蘇黎世", EN: "zurich", JP: "チューリッヒ", KR: "취리히", FR: "zurich", ES: "Zúrich", ID: "zürich", HI: "ज़्यूरिख", PT: "Zurique", AR: "زيوريخ", RU: "Цюрих",
    },
    description: {
      TW: "湖光山色與金融帝國的結合", EN: "The combination of beautiful lakes and mountains and financial empire", JP: "美しい湖と山と金融帝国の組み合わせ", KR: "아름다운 호수와 산, 그리고 금융제국의 결합", FR: "La combinaison de magnifiques lacs et montagnes et d’un empire financier", ES: "La combinación de hermosos lagos y montañas y un imperio financiero.", ID: "Kombinasi danau dan pegunungan yang indah serta kerajaan finansial", HI: "खूबसूरत झीलों और पहाड़ों और वित्तीय साम्राज्य का संयोजन", PT: "A combinação de belos lagos e montanhas e império financeiro", AR: "مزيج من البحيرات والجبال الجميلة والإمبراطورية المالية", RU: "Сочетание прекрасных озер, гор и финансовой империи.",
    }
  },
  "多倫多": {
    name: {
      TW: "多倫多", EN: "toronto", JP: "トロント", KR: "토론토", FR: "Toronto", ES: "Toronto", ID: "toronto", HI: "टोरंटो", PT: "Toronto", AR: "تورنتو", RU: "Торонто",
    },
    description: {
      TW: "極致多元文化，乾淨現代的北美大都市", EN: "An extremely multicultural, clean and modern North American metropolis", JP: "非常に多文化で、清潔でモダンな北米の大都市", KR: "매우 다문화적이고 깨끗하며 현대적인 북미 대도시", FR: "Une métropole nord-américaine extrêmement multiculturelle, propre et moderne", ES: "Una metrópoli norteamericana extremadamente multicultural, limpia y moderna", ID: "Kota metropolitan Amerika Utara yang sangat multikultural, bersih, dan modern", HI: "एक अत्यंत बहुसांस्कृतिक, स्वच्छ और आधुनिक उत्तरी अमेरिकी महानगर", PT: "Uma metrópole norte-americana extremamente multicultural, limpa e moderna", AR: "مدينة متعددة الثقافات ونظيفة وحديثة في أمريكا الشمالية", RU: "Чрезвычайно мультикультурный, чистый и современный мегаполис Северной Америки.",
    }
  },
  "洛杉磯": {
    name: {
      TW: "洛杉磯", EN: "Los Angeles", JP: "ロサンゼルス", KR: "로스앤젤레스", FR: "Los Angeles", ES: "Los Ángeles", ID: "Los Angeles", HI: "लॉस एंजिल्स", PT: "Los Angeles", AR: "لوس أنجلوس", RU: "Лос-Анджелес",
    },
    description: {
      TW: "電影夢工廠，棕櫚樹與星光大道", EN: "Movie DreamWorks, Palm Trees and Walk of Fame", JP: "映画ドリームワークス、ヤシの木、ウォーク オブ フェーム", KR: "영화 드림웍스, 야자수 및 명예의 거리", FR: "Film DreamWorks, palmiers et Walk of Fame", ES: "Película DreamWorks, Palmeras y Paseo de la Fama", ID: "Film DreamWorks, Pohon Palem, dan Walk of Fame", HI: "मूवी ड्रीमवर्क्स, पाम ट्रीज़ और वॉक ऑफ़ फ़ेम", PT: "Filme DreamWorks, Palmeiras e Calçada da Fama", AR: "فيلم DreamWorks وأشجار النخيل وممشى المشاهير", RU: "Кино DreamWorks, Пальмы и Аллея славы",
    }
  },
  "三藩市": {
    name: {
      TW: "三藩市", EN: "san francisco", JP: "サンフランシスコ", KR: "샌프란시스코", FR: "San Francisco", ES: "san francisco", ID: "San Fransisco", HI: "सैन फ्रांसिस्को", PT: "São Francisco", AR: "سان فرانسيسكو", RU: "Сан-Франциско",
    },
    description: {
      TW: "霧鎖金門，陡峭街道與科技矽谷", EN: "Fog-locked Golden Gate, steep streets and technological Silicon Valley", JP: "霧に閉ざされたゴールデン ゲート、険しい通り、テクノロジーのシリコン バレー", KR: "안개로 뒤덮인 골든 게이트, 가파른 거리, 첨단 기술의 실리콘 밸리", FR: "Golden Gate brumeux, rues escarpées et Silicon Valley technologique", ES: "Golden Gate bloqueado por la niebla, calles empinadas y Silicon Valley tecnológico", ID: "Golden Gate yang tertutup kabut, jalanan curam, dan Silicon Valley yang berteknologi", HI: "कोहरे से घिरा गोल्डन गेट, खड़ी सड़कें और तकनीकी सिलिकॉन वैली", PT: "Golden Gate coberta de neblina, ruas íngremes e o tecnológico Vale do Silício", AR: "البوابة الذهبية المغلقة بالضباب والشوارع شديدة الانحدار ووادي السيليكون التكنولوجي", RU: "Закрытые туманом Золотые ворота, крутые улицы и технологичная Силиконовая долина",
    }
  },
  "里約熱內盧": {
    name: {
      TW: "里約熱內盧", EN: "rio de janeiro", JP: "リオデジャネイロ", KR: "리우데자네이루", FR: "Rio de Janeiro", ES: "río de janeiro", ID: "Rio de Janeiro", HI: "रियो डी जनेरियो", PT: "rio de janeiro", AR: "ريو دي جانيرو", RU: "Рио-де-Жанейро",
    },
    description: {
      TW: "南美狂熱，熱情桑巴與絕美沙灘", EN: "South America is crazy, passionate samba and beautiful beaches", JP: "南米はクレイジーで情熱的なサンバと美しいビーチ", KR: "남미는 열정적이고 열정적인 삼바와 아름다운 해변이 있는 곳입니다", FR: "L'Amérique du Sud, c'est la samba folle, passionnée et les belles plages", ES: "Sudamérica es una locura, pasión por la samba y hermosas playas.", ID: "Amerika Selatan adalah samba yang gila dan penuh gairah serta pantai-pantai yang indah", HI: "दक्षिण अमेरिका पागल, भावुक सांबा और सुंदर समुद्र तट है", PT: "A América do Sul é uma loucura, samba apaixonado e lindas praias", AR: "أمريكا الجنوبية بلد السامبا المجنون والعاطفي والشواطئ الجميلة", RU: "Южная Америка – это сумасшедшая, страстная самба и прекрасные пляжи.",
    }
  },
  "布宜諾斯艾利斯": {
    name: {
      TW: "布宜諾斯艾利斯", EN: "buenos aires", JP: "ブエノスアイレス", KR: "부에노스아이레스", FR: "Buenos Aires", ES: "buenos aires", ID: "Buenos Aires", HI: "ब्यूनस आयर्स", PT: "Buenos Aires", AR: "بوينس آيرس", RU: "Буэнос-Айрес",
    },
    description: {
      TW: "南美巴黎，探戈舞動的優雅與激情", EN: "Paris, South America, the elegance and passion of tango dancing", JP: "南米パリ、タンゴダンスの優雅さと情熱", KR: "남미 파리, 탱고댄스의 우아함과 열정", FR: "Paris, Amérique du Sud, l'élégance et la passion du tango", ES: "París, Sudamérica, la elegancia y la pasión del baile de tango.", ID: "Paris, Amerika Selatan, keanggunan dan semangat menari tango", HI: "पेरिस, दक्षिण अमेरिका, टैंगो नृत्य की भव्यता और जुनून", PT: "Paris, América do Sul, a elegância e a paixão da dança do tango", AR: "باريس، أمريكا الجنوبية، أناقة وشغف رقص التانغو", RU: "Париж, Южная Америка, элегантность и страсть танго.",
    }
  },
  "墨爾本": {
    name: {
      TW: "墨爾本", EN: "Melbourne", JP: "メルボルン", KR: "멜버른", FR: "Melbourne", ES: "Melbourne", ID: "Melbourne", HI: "मेलबोर्न", PT: "Melbourne", AR: "ملبورن", RU: "Мельбурн",
    },
    description: {
      TW: "澳洲咖啡之都，巷弄塗鴉與藝術氛圍", EN: "Australia’s coffee capital, alley graffiti and artistic atmosphere", JP: "オーストラリアのコーヒーの首都、路地の落書きと芸術的な雰囲気", KR: "호주 커피의 수도, 골목 그래피티와 예술적인 분위기", FR: "Capitale australienne du café, graffitis dans les ruelles et ambiance artistique", ES: "La capital del café de Australia, graffitis en los callejones y atmósfera artística", ID: "Ibu kota kopi Australia, grafiti gang, dan suasana artistik", HI: "ऑस्ट्रेलिया की कॉफ़ी राजधानी, गली-गली भित्तिचित्र और कलात्मक वातावरण", PT: "Capital do café da Austrália, grafites em becos e atmosfera artística", AR: "عاصمة القهوة في أستراليا، الكتابة على الجدران في الأزقة والأجواء الفنية", RU: "Кофейная столица Австралии, граффити на аллеях и художественная атмосфера",
    }
  },
  "奧克蘭": {
    name: {
      TW: "奧克蘭", EN: "Auckland", JP: "オークランド", KR: "오클랜드", FR: "Auckland", ES: "auckland", ID: "Auckland", HI: "ऑकलैंड", PT: "Auckland", AR: "أوكلاند", RU: "Окленд",
    },
    description: {
      TW: "帆船之都，火山地形與毛利文化", EN: "The City of Sailing, Volcanic Terrain and Maori Culture", JP: "セーリング、火山地形、マオリ文化の街", KR: "항해의 도시, 화산 지형, 마오리 문화", FR: "La ville de la voile, du terrain volcanique et de la culture maorie", ES: "La ciudad de la navegación, el terreno volcánico y la cultura maorí", ID: "Kota Pelayaran, Medan Vulkanik, dan Budaya Maori", HI: "नौकायन, ज्वालामुखीय भूभाग और माओरी संस्कृति का शहर", PT: "A cidade da vela, do terreno vulcânico e da cultura Maori", AR: "مدينة الإبحار والتضاريس البركانية وثقافة الماوري", RU: "Город парусного спорта, вулканической местности и культуры маори",
    }
  },
  "開普敦": {
    name: {
      TW: "開普敦", EN: "cape town", JP: "ケープタウン", KR: "케이프 타운", FR: "Le Cap", ES: "ciudad del cabo", ID: "kota tanjung", HI: "केप टाउन", PT: "cidade do cabo", AR: "كيب تاون", RU: "Кейптаун",
    },
    description: {
      TW: "非洲之巔，山海交匯的壯闊景觀", EN: "The top of Africa, the magnificent landscape where mountains and sea meet", JP: "アフリカの頂上、山と海が出会う雄大な風景", KR: "아프리카의 정상, 산과 바다가 만나는 웅장한 풍경", FR: "Le sommet de l'Afrique, le magnifique paysage où se rencontrent montagnes et mer", ES: "La cima de África, el magnífico paisaje donde se encuentran las montañas y el mar", ID: "Puncak Afrika, pemandangan indah tempat bertemunya gunung dan laut", HI: "अफ़्रीका की चोटी, शानदार परिदृश्य जहां पहाड़ और समुद्र मिलते हैं", PT: "O topo de África, a magnífica paisagem onde as montanhas e o mar se encontram", AR: "قمة أفريقيا، المناظر الطبيعية الرائعة حيث تلتقي الجبال والبحر", RU: "Вершина Африки, великолепный пейзаж, где встречаются горы и море.",
    }
  },
  "馬拉喀什": {
    name: {
      TW: "馬拉喀什", EN: "Marrakech", JP: "マラケシュ", KR: "마라케시", FR: "Marrakech", ES: "Marrakesh", ID: "Marrakesh", HI: "माराकेच", PT: "Marraquexe", AR: "مراكش", RU: "Марракеш",
    },
    description: {
      TW: "北非色彩，迷宮般的古城與異域香料", EN: "North African colors, maze-like ancient cities and exotic spices", JP: "北アフリカの色彩、迷路のような古代都市、エキゾチックなスパイス", KR: "북아프리카의 색채, 미로 같은 고대 도시, 이국적인 향신료", FR: "Couleurs nord-africaines, villes anciennes labyrinthiques et épices exotiques", ES: "Colores del norte de África, ciudades antiguas laberínticas y especias exóticas", ID: "Warna-warni Afrika Utara, kota-kota kuno yang bagaikan labirin, dan rempah-rempah yang eksotis", HI: "उत्तरी अफ़्रीकी रंग, भूलभुलैया जैसे प्राचीन शहर और विदेशी मसाले", PT: "Cores do norte da África, cidades antigas labirínticas e especiarias exóticas", AR: "ألوان شمال أفريقيا ومدن قديمة تشبه المتاهة وتوابل غريبة", RU: "Краски Северной Африки, древние города, похожие на лабиринты, и экзотические специи.",
    }
  },
  "開羅": {
    name: {
      TW: "開羅", EN: "cairo", JP: "カイロ", KR: "카이로", FR: "Caire", ES: "El Cairo", ID: "Kairo", HI: "काहिरा", PT: "Cairo", AR: "القاهرة", RU: "Каир",
    },
    description: {
      TW: "古文明奇蹟，尼羅河畔的千年史詩", EN: "Miracles of ancient civilization, a thousand-year epic on the banks of the Nile", JP: "古代文明の奇跡、ナイル川のほとりに広がる千年の叙事詩", KR: "고대 문명의 기적, 나일강 유역의 천년 서사시", FR: "Miracles de la civilisation antique, une épopée millénaire sur les rives du Nil", ES: "Milagros de la civilización antigua, una epopeya milenaria a orillas del Nilo", ID: "Keajaiban peradaban kuno, epik seribu tahun di tepian Sungai Nil", HI: "प्राचीन सभ्यता के चमत्कार, नील नदी के तट पर एक हजार साल का महाकाव्य", PT: "Milagres da civilização antiga, um épico milenar às margens do Nilo", AR: "معجزات الحضارة القديمة ملحمة ألف عام على ضفاف النيل", RU: "Чудеса древней цивилизации, тысячелетняя эпопея на берегах Нила",
    }
  },
  "札幌": {
    name: {
      TW: "札幌", EN: "Sapporo", JP: "札幌", KR: "삿포로", FR: "Sapporo", ES: "Sapporo", ID: "Sapporo", HI: "सपोरो", PT: "Sapporo", AR: "سابورو", RU: "Саппоро",
    },
    description: {
      TW: "雪祭之都，純淨自然與北國美食", EN: "The capital of snow festivals, pure nature and northern cuisine", JP: "雪まつりと清らかな自然と北の美食の都", KR: "눈 축제, 순수한 자연, 북부 요리의 중심지", FR: "La capitale des fêtes de neige, de la nature pure et de la cuisine du Nord", ES: "La capital de las fiestas de la nieve, la naturaleza pura y la gastronomía norteña", ID: "Ibukota festival salju, alam murni, dan masakan utara", HI: "बर्फीले त्योहारों, शुद्ध प्रकृति और उत्तरी व्यंजनों की राजधानी", PT: "A capital dos festivais de neve, da natureza pura e da gastronomia nortenha", AR: "عاصمة مهرجانات الثلج والطبيعة النقية والمأكولات الشمالية", RU: "Столица снежных фестивалей, чистой природы и северной кухни",
    }
  },
  "福岡": {
    name: {
      TW: "福岡", EN: "Fukuoka", JP: "福岡", KR: "후쿠오카", FR: "Fukuoka", ES: "Fukuoka", ID: "Fukuoka", HI: "फुकुओका", PT: "Fukuoka", AR: "فوكوكا", RU: "Фукуока",
    },
    description: {
      TW: "屋台文化，充滿活力的港口商圈", EN: "Yatai culture, a vibrant port business district", JP: "屋台文化、活気あふれる港湾商業地区", KR: "야타이 문화, 활기 넘치는 항구 상업 지구", FR: "La culture Yatai, un quartier d'affaires portuaire dynamique", ES: "Cultura Yatai, un vibrante distrito de negocios portuario", ID: "Budaya Yatai, kawasan bisnis pelabuhan yang dinamis", HI: "यताई संस्कृति, एक जीवंत बंदरगाह व्यवसायिक जिला", PT: "Cultura Yatai, um vibrante distrito comercial portuário", AR: "ثقافة ياتاي، وهي منطقة أعمال ميناء نابضة بالحياة", RU: "Культура Ятай, оживленный портовый деловой район",
    }
  },
  "箱根": {
    name: {
      TW: "箱根", EN: "Hakone", JP: "箱根", KR: "하코네", FR: "Hakone", ES: "hakone", ID: "Hakone", HI: "Hakone", PT: "Hakone", AR: "هاكوني", RU: "Хаконе",
    },
    description: {
      TW: "溫泉之鄉，富士山絕佳觀望點", EN: "The town of hot springs, the perfect viewing point for Mount Fuji", JP: "富士山を眺めるのに最適な温泉の街", KR: "후지산을 바라볼 수 있는 최고의 장소, 온천 마을", FR: "La ville des sources chaudes, point de vue idéal sur le mont Fuji", ES: "El pueblo de las aguas termales, el mirador perfecto para el Monte Fuji", ID: "Kota sumber air panas, titik pandang sempurna untuk Gunung Fuji", HI: "गर्म झरनों का शहर, माउंट फ़ूजी को देखने के लिए आदर्श स्थान", PT: "A cidade das fontes termais, o mirante perfeito para o Monte Fuji", AR: "مدينة الينابيع الساخنة، نقطة المشاهدة المثالية لجبل فوجي", RU: "Город горячих источников, идеальная точка обзора горы Фудзи.",
    }
  },
  "沖繩": {
    name: {
      TW: "沖繩", EN: "Okinawa", JP: "沖縄", KR: "오키나와", FR: "Okinawa", ES: "Okinawa", ID: "Okinawa", HI: "ओकिनावा", PT: "Okinawa", AR: "أوكيناوا", RU: "Окинава",
    },
    description: {
      TW: "琉球風情，湛藍海景與潛水天堂", EN: "Ryukyu style, blue seascape and diving paradise", JP: "琉球風、青い海景とダイビング天国", KR: "류큐 스타일, 푸른 바다 경치와 다이빙 천국", FR: "Style Ryukyu, paysage marin bleu et paradis de la plongée", ES: "Estilo Ryukyu, paisaje marino azul y paraíso del buceo", ID: "Gaya Ryukyu, pemandangan laut biru dan surga menyelam", HI: "रयूकू शैली, नीला समुद्री दृश्य और गोताखोरी स्वर्ग", PT: "Estilo Ryukyu, paisagem marítima azul e paraíso do mergulho", AR: "أسلوب ريوكيو والمناظر البحرية الزرقاء وجنة الغوص", RU: "Стиль Рюкю, голубой морской пейзаж и рай для дайвинга",
    }
  },
  "拉斯維加斯": {
    name: {
      TW: "拉斯維加斯", EN: "las vegas", JP: "ラスベガス", KR: "라스베가스", FR: "las vegas", ES: "las vegas", ID: "Las Vegas", HI: "लास वेगास", PT: "Las Vegas", AR: "لاس فيغاس", RU: "Лас-Вегас",
    },
    description: {
      TW: "沙漠賭城，不夜的娛樂與表演殿堂", EN: "Desert Casino, a palace of entertainment and performances that never sleeps", JP: "デザート カジノ、眠らないエンターテイメントとパフォーマンスの宮殿", KR: "잠들지 않는 엔터테인먼트와 공연의 궁전, 사막 카지노", FR: "Desert Casino, un palais du divertissement et des performances qui ne dort jamais", ES: "Desert Casino, un palacio de entretenimiento y espectáculos que nunca duerme", ID: "Desert Casino, istana hiburan dan pertunjukan yang tidak pernah tidur", HI: "डेजर्ट कैसीनो, मनोरंजन और प्रदर्शन का एक महल जो कभी नहीं सोता", PT: "Desert Casino, um palácio de entretenimento e performances que nunca dorme", AR: "كازينو الصحراء، قصر الترفيه والعروض الذي لا ينام", RU: "Казино Desert — дворец развлечений и представлений, который никогда не спит",
    }
  },
  "芝加哥": {
    name: {
      TW: "芝加哥", EN: "chicago", JP: "シカゴ", KR: "시카고", FR: "Chicago", ES: "chicago", ID: "Chicago", HI: "शिकागो", PT: "Chicago", AR: "شيكاغو", RU: "Чикаго",
    },
    description: {
      TW: "建築之都，爵士樂與深盤披薩", EN: "A city of architecture, jazz and deep-dish pizza", JP: "建築、ジャズ、ディープディッシュピザの街", KR: "건축과 재즈, 딥디쉬 피자의 도시", FR: "Une ville d'architecture, de jazz et de pizza profonde", ES: "Una ciudad de arquitectura, jazz y pizza profunda", ID: "Kota arsitektur, jazz, dan pizza deep-dish", HI: "वास्तुकला, जैज़ और डीप-डिश पिज़्ज़ा का शहर", PT: "Uma cidade de arquitetura, jazz e pizza profunda", AR: "مدينة الهندسة المعمارية وموسيقى الجاز والبيتزا العميقة", RU: "Город архитектуры, джаза и глубокой пиццы",
    }
  },
  "邁阿密": {
    name: {
      TW: "邁阿密", EN: "miami", JP: "マイアミ", KR: "마이애미", FR: "Miami", ES: "Miami", ID: "miami", HI: "मियामी", PT: "Miami", AR: "ميامي", RU: "Майами",
    },
    description: {
      TW: "拉丁熱情，陽光沙灘與裝飾藝術建築", EN: "Latin passion, sunny beaches and Art Deco architecture", JP: "ラテンの情熱、太陽が降り注ぐビーチ、アールデコ様式の建築", KR: "라틴 열정, 햇살 가득한 해변, 아르데코 건축물", FR: "Passion latine, plages ensoleillées et architecture Art Déco", ES: "Pasión latina, playas soleadas y arquitectura Art Déco", ID: "Gairah Latin, pantai cerah, dan arsitektur Art Deco", HI: "लैटिन जुनून, धूप वाले समुद्र तट और आर्ट डेको वास्तुकला", PT: "Paixão latina, praias ensolaradas e arquitetura Art Déco", AR: "العاطفة اللاتينية والشواطئ المشمسة والهندسة المعمارية على طراز آرت ديكو", RU: "Латинская страсть, солнечные пляжи и архитектура в стиле ар-деко.",
    }
  },
  "西雅圖": {
    name: {
      TW: "西雅圖", EN: "seattle", JP: "シアトル", KR: "西雅圖", FR: "Seattle", ES: "seattle", ID: "seattle", HI: "सिएटल", PT: "Seattle", AR: "سياتل", RU: "Сиэтл",
    },
    description: {
      TW: "咖啡原鄉，雨中的文藝與科技重鎮", EN: "The hometown of coffee, a city of art and science and technology in the rain", JP: "コーヒーの故郷、雨の芸術と科学技術の街", KR: "咖啡原鄉，雨中的文藝與科技重鎮", FR: "La ville natale du café, une ville d'art, de science et de technologie sous la pluie", ES: "La ciudad natal del café, una ciudad de arte, ciencia y tecnología bajo la lluvia", ID: "Kampung halaman kopi, kota seni dan iptek di tengah hujan", HI: "कॉफ़ी का गृहनगर, बारिश में कला और विज्ञान और प्रौद्योगिकी का शहर", PT: "A cidade natal do café, uma cidade de arte, ciência e tecnologia na chuva", AR: "مسقط رأس القهوة، مدينة الفن والعلوم والتكنولوجيا تحت المطر", RU: "Родной город кофе, город искусства, науки и технологий под дождем",
    }
  },
  "愛丁堡": {
    name: {
      TW: "愛丁堡", EN: "Edinburgh", JP: "エディンバラ", KR: "에든버러", FR: "Édimbourg", ES: "Edimburgo", ID: "Edinburgh", HI: "एडिनबरा", PT: "Edimburgo", AR: "ادنبره", RU: "Эдинбург",
    },
    description: {
      TW: "古堡傳說，哈利波特的靈感發源地", EN: "Castle Legend, the inspiration for Harry Potter", JP: "ハリー・ポッターのインスピレーションとなったキャッスル・レジェンド", KR: "해리포터의 영감이 된 캐슬 레전드", FR: "Castle Legend, l'inspiration d'Harry Potter", ES: "Castle Legend, la inspiración de Harry Potter", ID: "Castle Legend, inspirasi Harry Potter", HI: "कैसल लीजेंड, हैरी पॉटर की प्रेरणा", PT: "Castle Legend, a inspiração para Harry Potter", AR: "أسطورة القلعة، مصدر إلهام هاري بوتر", RU: "Легенда о замке, вдохновитель Гарри Поттера",
    }
  },
  "佛羅倫斯": {
    name: {
      TW: "佛羅倫斯", EN: "Florence", JP: "フィレンツェ", KR: "피렌체", FR: "Florence", ES: "Florencia", ID: "Florence", HI: "फ़्लोरेंस", PT: "Florença", AR: "فلورنسا", RU: "Флоренция",
    },
    description: {
      TW: "文藝復興搖籃，極致的藝術與皮革工藝", EN: "The cradle of the Renaissance, the ultimate in art and leather craftsmanship", JP: "ルネッサンス発祥の地、究極の芸術と皮革工芸品", KR: "르네상스의 요람, 예술과 가죽 공예의 정점", FR: "Le berceau de la Renaissance, le summum de l'art et de la maroquinerie", ES: "La cuna del Renacimiento, lo último en arte y artesanía en cuero.", ID: "Tempat lahirnya Renaisans, seni dan keahlian kulit terbaik", HI: "पुनर्जागरण का उद्गम स्थल, कला और चमड़े की शिल्प कौशल में सर्वोच्च", PT: "O berço da Renascença, o máximo em arte e artesanato em couro", AR: "مهد عصر النهضة، قمة الفن وصناعة الجلود", RU: "Колыбель Ренессанса, вершина искусства и мастерства обработки кожи.",
    }
  },
  "尼斯": {
    name: {
      TW: "尼斯", EN: "Nice", JP: "ニース", KR: "멋진", FR: "Bon", ES: "Lindo", ID: "Bagus", HI: "अच्छा", PT: "Legal", AR: "لطيف - جيد", RU: "Хороший",
    },
    description: {
      TW: "蔚藍海岸，法式度假的優雅縮影", EN: "The French Riviera, the epitome of French elegance", JP: "フランスのエレガンスの縮図、フレンチ リヴィエラ", KR: "프렌치 우아함의 대명사, 프렌치 리비에라", FR: "La Côte d'Azur, l'incarnation de l'élégance à la française", ES: "La Riviera Francesa, el epítome de la elegancia francesa", ID: "French Riviera, lambang keanggunan Prancis", HI: "फ्रेंच रिवेरा, फ्रांसीसी सुंदरता का प्रतीक", PT: "A Riviera Francesa, o epítome da elegância francesa", AR: "الريفييرا الفرنسية، مثال للأناقة الفرنسية", RU: "Французская Ривьера – воплощение французской элегантности",
    }
  },
  "聖托里尼": {
    name: {
      TW: "聖托里尼", EN: "santorini", JP: "サントリーニ島", KR: "산토리니", FR: "Santorin", ES: "Santorini", ID: "santorini", HI: "सेंटोरिनी", PT: "santorini", AR: "سانتوريني", RU: "Санторини",
    },
    description: {
      TW: "藍白天堂，全球最美的日落觀賞點", EN: "Blue and white paradise, the most beautiful sunset viewing spot in the world", JP: "世界で最も美しい夕日鑑賞スポット、青と白の楽園", KR: "청백의 낙원, 세계에서 가장 아름다운 일몰 명소", FR: "Paradis bleu et blanc, le plus beau coucher de soleil au monde", ES: "Paraíso azul y blanco, el lugar para ver el atardecer más hermoso del mundo", ID: "Surga biru putih, tempat melihat matahari terbenam terindah di dunia", HI: "नीला और सफ़ेद स्वर्ग, दुनिया में सूर्यास्त देखने का सबसे खूबसूरत स्थान", PT: "Paraíso azul e branco, o ponto de observação do pôr do sol mais lindo do mundo", AR: "الجنة الزرقاء والبيضاء، أجمل مكان لمشاهدة غروب الشمس في العالم", RU: "Голубой и белый рай, самое красивое место в мире для наблюдения за закатом.",
    }
  },
  "雷克雅維克": {
    name: {
      TW: "雷克雅維克", EN: "Reykjavik", JP: "レイキャビク", KR: "레이캬비크", FR: "Reykjavík", ES: "Reikiavik", ID: "Reykjavik", HI: "रिक्जेविक", PT: "Reykjavík", AR: "ريكيافيك", RU: "Рейкьявик",
    },
    description: {
      TW: "極光之城，外星般的冰火地貌體驗", EN: "City of Aurora, an alien-like experience of ice and fire landforms", JP: "氷と炎の地形が異星人のような体験をもたらすオーロラの街", KR: "얼음과 불 지형을 외계인처럼 경험하는 오로라의 도시", FR: "City of Aurora, une expérience extraterrestre de reliefs de glace et de feu", ES: "Ciudad de Aurora, una experiencia extraterrestre de accidentes geográficos de hielo y fuego", ID: "Kota Aurora, pengalaman bentang alam es dan api yang mirip alien", HI: "ऑरोरा शहर, बर्फ और आग की भू-आकृतियों का एक एलियन जैसा अनुभव", PT: "Cidade de Aurora, uma experiência alienígena de formas de relevo de gelo e fogo", AR: "مدينة أورورا، تجربة غريبة لأشكال الجليد والنار", RU: "Город Аврора, инопланетный опыт ледяных и огненных форм рельефа",
    }
  },
  "峇里島(庫塔)": {
    name: {
      TW: "峇里島(庫塔)", EN: "Bali(Kuta)", JP: "バリ島(クタ)", KR: "峇里島(庫塔)", FR: "Bali(Kuta)", ES: "Bali (Kuta)", ID: "Bali(Kuta)", HI: "बाली(कुटा)", PT: "Bali (Kuta)", AR: "بالي(كوتا)", RU: "Бали(Кута)",
    },
    description: {
      TW: "衝浪天堂，熱帶島嶼的信仰與放鬆", EN: "Surfing paradise, tropical island faith and relaxation", JP: "サーフィンの楽園、熱帯の島への信仰とリラクゼーション", KR: "衝浪天堂，熱帶島嶼的信仰與放鬆", FR: "Paradis du surf, foi sur les îles tropicales et détente", ES: "Paraíso del surf, isla tropical, fe y relajación.", ID: "Surga selancar, keyakinan pulau tropis, dan relaksasi", HI: "सर्फिंग स्वर्ग, उष्णकटिबंधीय द्वीप आस्था और विश्राम", PT: "Paraíso do surf, fé e relaxamento em ilhas tropicais", AR: "جنة ركوب الأمواج، والجزيرة الاستوائية، والإيمان والاسترخاء", RU: "Рай для серфинга, тропический остров веры и отдыха",
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

export const getTranslatedData = (cityId: string, type: 'name' | 'description', currentLangName: string, fallbackText?: string): string => {
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
