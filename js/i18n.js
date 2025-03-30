// i18n.js - Handles multilingual support
const i18next = {
    language: 'zh-CN', // Default language
    resources: {},
    
    init(callback) {
        // Load default language resources
        this.loadLanguage(this.language)
            .then(() => {
                this.updateContent();
                if (callback) callback();
            })
            .catch(error => console.error('Error initializing i18next:', error));
        
        // Set up language selector
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = this.language;
            languageSelector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
    },
    
    loadLanguage(lang) {
        return fetch(`locale/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load language file: ${lang}.json`);
                }
                return response.json();
            })
            .then(data => {
                this.resources[lang] = data;
                return data;
            });
    },
    
    changeLanguage(lang) {
        // Check if we already have this language loaded
        if (this.resources[lang]) {
            this.language = lang;
            this.updateContent();
            return Promise.resolve();
        }
        
        // Load the language and update content
        return this.loadLanguage(lang)
            .then(() => {
                this.language = lang;
                this.updateContent();
            })
            .catch(error => {
                console.error(`Error loading language: ${lang}`, error);
                // Revert to previous language
                this.updateContent();
            });
    },
    
    updateContent() {
        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation) {
                // Check if it's an input or textarea
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // For placeholders
                    if (key.includes('placeholder')) {
                        element.placeholder = translation;
                    } else {
                        element.value = translation;
                    }
                } else {
                    element.innerHTML = translation;
                }
            }
        });
        
        // Update page title and meta description
        const titleTranslation = this.t('meta.title');
        const descriptionTranslation = this.t('meta.description');
        
        if (titleTranslation) {
            document.title = titleTranslation;
        }
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && descriptionTranslation) {
            metaDescription.setAttribute('content', descriptionTranslation);
        }
        
        // For RTL languages, might need to update dir attribute
        if (this.resources[this.language]?.meta?.dir === 'rtl') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    },
    
    t(key) {
        // Get translation based on key path (e.g., 'header.nav.features')
        return this.getNestedTranslation(this.resources[this.language], key);
    },
    
    getNestedTranslation(obj, path) {
        if (!obj) return null;
        
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
            if (result[key] === undefined) {
                return null; // Key not found
            }
            result = result[key];
        }
        
        return result;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    i18next.init();
});

