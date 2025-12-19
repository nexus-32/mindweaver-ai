// Translation system for MindWeaver
const translations = {
  en: {
    // Header
    "MindWeaver": "MindWeaver",
    "Menu": "Menu",
    "Smart Search": "Smart Search", 
    "Voice Input": "Voice Input",
    "Settings": "Settings",
    
    // Main content
    "Your AI Chief of Staff": "Your AI Chief of Staff",
    "A deeply personalized AI assistant": "A deeply personalized AI assistant",
    "Start Conversation": "Start Conversation",
    "New Conversation": "New Conversation",
    
    // Messages
    "Type your message...": "Type your message...",
    "Send": "Send",
    "Voice": "Voice",
    
    // Settings
    "Appearance": "Appearance",
    "Voice Settings": "Voice Settings",
    "Language": "Language",
    "Font Size": "Font Size",
    "Message Spacing": "Message Spacing",
    
    // Common
    "Error": "Error",
    "Success": "Success",
    "Cancel": "Cancel",
    "Save": "Save",
    "Delete": "Delete",
    "Edit": "Edit"
  },
  ru: {
    // Header
    "MindWeaver": "MindWeaver",
    "Menu": "Меню",
    "Smart Search": "Умный поиск",
    "Voice Input": "Голосовой ввод", 
    "Settings": "Настройки",
    
    // Main content
    "Your AI Chief of Staff": "Ваш AI начальник штаба",
    "A deeply personalized AI assistant": "Глубоко персонализированный AI помощник",
    "Start Conversation": "Начать диалог",
    "New Conversation": "Новый диалог",
    
    // Messages
    "Type your message...": "Введите сообщение...",
    "Send": "Отправить",
    "Voice": "Голос",
    
    // Settings
    "Appearance": "Внешний вид",
    "Voice Settings": "Настройки голоса",
    "Language": "Язык",
    "Font Size": "Размер шрифта",
    "Message Spacing": "Отступы сообщений",
    
    // Common
    "Error": "Ошибка",
    "Success": "Успешно",
    "Cancel": "Отмена",
    "Save": "Сохранить",
    "Delete": "Удалить",
    "Edit": "Редактировать"
  }
};

let currentLanguage = 'en';

// Get language from localStorage or browser
function getInitialLanguage() {
  const saved = localStorage.getItem('mindweaver-language');
  if (saved && translations[saved]) return saved;
  
  // Get browser language
  const browserLang = navigator.language || navigator.languages[0];
  if (browserLang.startsWith('ru')) return 'ru';
  return 'en';
}

// Initialize language
currentLanguage = getInitialLanguage();

// Translation function
function t(key) {
  return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Set language
function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('mindweaver-language', lang);
    updatePageLanguage();
    
    // Update language selector if it exists
    const selector = document.querySelector('[data-language-selector]');
    if (selector) {
      selector.value = lang;
    }
  }
}

// Update all translatable elements
function updatePageLanguage() {
  // Update elements with data-translate attribute
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = t(key);
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
  
  // Update title
  const titleKey = document.title;
  if (translations[currentLanguage][titleKey]) {
    document.title = translations[currentLanguage][titleKey];
  }
  
  // Update lang attribute
  document.documentElement.lang = currentLanguage;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updatePageLanguage();
  
  // Add language selector functionality
  const selector = document.querySelector('[data-language-selector]');
  if (selector) {
    selector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
    selector.value = currentLanguage;
  }
});

// Make functions globally available
window.t = t;
window.setLanguage = setLanguage;
window.currentLanguage = currentLanguage;
