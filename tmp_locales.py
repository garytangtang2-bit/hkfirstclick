import json
import os
import glob

locales_dir = r"d:\hkfirstclick\src\locales"
files = glob.glob(os.path.join(locales_dir, "*.json"))

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Add ws_upgrade_hint
    lang = os.path.basename(file).split(".")[0]
    
    translations = {
        "en": "Free users cannot modify itineraries. Upgrade to unlock ✨",
        "zh": "免費用戶無法修改行程，請升級方案 ✨",
        "zh-HK": "免費用戶無法修改行程，請升級方案 ✨",
        "ja": "無料ユーザーは旅程を変更できません。アップグレードしてロックを解除してください ✨",
        "ko": "무료 사용자는 일정을 수정할 수 없습니다. 업그레이드하여 잠금 해제하세요 ✨",
        "es": "Los usuarios gratuitos no pueden modificar los itinerarios. Actualízate para desbloquear ✨",
        "fr": "Les utilisateurs gratuits ne peuvent pas modifier les itinéraires. Mettez à niveau pour débloquer ✨",
        "de": "Kostenlose Benutzer können Reiserouten nicht ändern. Aktualisieren, um freizuschalten ✨",
        "it": "Gli utenti gratuiti non possono modificare gli itinerari. Aggiorna per sbloccare ✨",
        "pt": "Usuários gratuitos não podem modificar itinerários. Atualize para desbloquear ✨",
        "ru": "Бесплатные пользователи не могут изменять маршруты. Обновите для разблокировки ✨",
        "ar": "لا يمكن للمستخدمين المجانيين تعديل مسارات الرحلة. قم بالترقية للوصول ✨",
        "hi": "मुफ्त उपयोगकर्ता यात्रा कार्यक्रम को संशोधित नहीं कर सकते। अनलॉक करने के लिए अपग्रेड करें ✨",
        "bn": "বিনামূল্যে ব্যবহারকারীরা ভ্রমণপথ পরিবর্তন করতে পারবেন না। আনলক করতে আপগ্রেড করুন ✨",
        "id": "Pengguna gratis tidak dapat mengubah itinerary. Tingkatkan untuk membuka fitur ✨",
    }
    
    if lang in translations:
        data["ws_upgrade_hint"] = translations[lang]
    else:
        data["ws_upgrade_hint"] = translations["en"]

    # Ensure -5 credits for rule_1_p1_v and -1 for rule_1_p2_v
    # As it's hard to reliably replace parts of localized strings without breaking grammar, 
    # we'll look for numbers 1 to 5 and only touch the English/Chinese ones safely if needed,
    # or just trust they were already set to 5/1 in previous tickets. 
    # Let's inspect english and chinese directly.
    
    if lang == "en" or lang == "en-US":
        data["rule_1_p1_v"] = "-5 Points (Generated from Homepage)"
        data["rule_1_p2_v"] = "-1 Point (AI Tweak & Edit)"
    elif "zh" in lang:
        data["rule_1_p1_v"] = "-5 點 (從首頁四格搜尋欄啟動)"
        data["rule_1_p2_v"] = "-1 點 (與 AI 討論修改內容)"
        
    with open(file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated locales successfully.")
