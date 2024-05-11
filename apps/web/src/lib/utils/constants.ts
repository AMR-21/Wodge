import {
  AiToneOption,
  LanguageOption,
} from "@/components/editor/block-editor/types";

export const languages: (LanguageOption & { value: string })[] = [
  { name: "arabic", label: "Arabic", value: "ar" },
  { name: "chinese", label: "Chinese", value: "zh" },
  { name: "english", label: "English", value: "en" },
  { name: "french", label: "French", value: "fr" },
  { name: "german", label: "German", value: "de" },
  { name: "greek", label: "Greek", value: "gr" },
  { name: "italian", label: "Italian", value: "it" },
  { name: "japanese", label: "Japanese", value: "jp" },
  { name: "korean", label: "Korean", value: "ko" },
  { name: "russian", label: "Russian", value: "ru" },
  { name: "spanish", label: "Spanish", value: "es" },
  { name: "swedish", label: "Swedish", value: "sv" },
  { name: "ukrainian", label: "Ukrainian", value: "ua" },
];

export const tones: AiToneOption[] = [
  { name: "academic", label: "Academic", value: "academic" },
  { name: "business", label: "Business", value: "business" },
  { name: "casual", label: "Casual", value: "casual" },
  { name: "childfriendly", label: "Childfriendly", value: "childfriendly" },
  { name: "conversational", label: "Conversational", value: "conversational" },
  { name: "emotional", label: "Emotional", value: "emotional" },
  { name: "humorous", label: "Humorous", value: "humorous" },
  { name: "informative", label: "Informative", value: "informative" },
  { name: "inspirational", label: "Inspirational", value: "inspirational" },
  { name: "memeify", label: "Memeify", value: "meme" },
  { name: "narrative", label: "Narrative", value: "narrative" },
  { name: "objective", label: "Objective", value: "objective" },
  { name: "persuasive", label: "Persuasive", value: "persuasive" },
  { name: "poetic", label: "Poetic", value: "poetic" },
];

export const userColors = [
  "#fb7185",
  "#fdba74",
  "#d9f99d",
  "#a7f3d0",
  "#a5f3fc",
  "#a5b4fc",
  "#f0abfc",
];

export const themeColors = [
  "#fb7185",
  "#fdba74",
  "#d9f99d",
  "#a7f3d0",
  "#a5f3fc",
  "#a5b4fc",
];
