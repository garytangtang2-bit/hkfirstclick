// BCP-47 language codes ↔ full language name strings (AppContext keys)
// This is the single source of truth for language mapping

export const LANG_NAME_TO_CODE: Record<string, string> = {
  "English": "en",
  "繁體中文": "zh",
  "日本語": "ja",
  "한국어": "ko",
  "Français": "fr",
  "Español": "es",
  "Bahasa Indonesia": "id",
  "हिन्दी": "hi",
  "Português": "pt",
  "العربية": "ar",
  "বাংলা": "bn",
  "Русский": "ru",
};

export const LANG_CODE_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(LANG_NAME_TO_CODE).map(([k, v]) => [v, k])
);

export const SUPPORTED_LANG_CODES = Object.values(LANG_NAME_TO_CODE);
export const DEFAULT_LANG_CODE = "en";
