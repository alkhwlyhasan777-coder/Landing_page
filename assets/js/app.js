/**
 * ========================================
 * LANGUAGE MANAGER & SWITCHER
 * Modern Language Toggle with RTL Support
 * ========================================
 */

class LanguageManager {
    constructor() {
        this.supportedLanguages = ['en', 'ar'];
        this.currentLanguage = this.loadLanguage();
        this.init();
    }
    /**
     * Initialize Language Manager
     */
    init() {
        this.applyLanguage(this.currentLanguage);
        this.setupEventListeners();
        this.updateLanguageUI();
    }

    /**
     * Load language from LocalStorage or default to English
     */
    loadLanguage() {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        return savedLanguage && this.supportedLanguages.includes(savedLanguage)? savedLanguage : 'en';
    }
    /**
     * Save language preference to LocalStorage
     */
    saveLanguage(lang) {
        localStorage.setItem('selectedLanguage', lang);
    }
    /**
     * Apply language to entire document
     */
    applyLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Language ${lang} not supported. Using English.`);
            lang = 'en';
        }
        this.currentLanguage = lang;
        this.updateDOM(lang);
        this.updateDocumentAttributes(lang);
        this.updatePlaceholders(lang);
        
        // Dispatch custom event
        this.dispatchLanguageChangeEvent(lang);
    }
    /**
     * Update all DOM elements with translations
     */
    updateDOM(lang) {
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    /**
     * Update HTML document attributes (dir, lang)
     */
    updateDocumentAttributes(lang) {
        const html = document.documentElement;
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        html.setAttribute('dir', dir);
        html.setAttribute('lang', lang);
        document.body.setAttribute('data-language', lang);
    }

    /**
     * Update placeholder text for form inputs
     */
    updatePlaceholders(lang) {
        const placeholders = document.querySelectorAll('[data-lang-placeholder]');
        
        placeholders.forEach(element => {
            const key = element.getAttribute('data-lang-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });
    }

    /**
     * Update Language Toggle Button UI
     */
    updateLanguageUI() {
        const langToggle = document.getElementById('langToggleBtn');
        const langText = document.getElementById('langText');
        
        if (langToggle && langText) {
            const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
            const newText = newLang === 'en' ? 'EN' : 'AR';
            langText.textContent = newText;
        }
    }
    /**
     * Setup event listeners for language toggle
     */
    setupEventListeners() {
        const langToggle = document.getElementById('langToggleBtn');
        
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
            langToggle.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleLanguage();
                }
            });
        }
    }

    /**
     * Toggle between English and Arabic
     */
    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
        this.applyLanguage(newLanguage);
        this.saveLanguage(newLanguage);
        this.updateLanguageUI();
    }

    /**
     * Dispatch custom language change event
     */
    dispatchLanguageChangeEvent(lang) {
        const event = new CustomEvent('languageChanged', {
            detail: { language: lang }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get translation key
     */
    translate(key) {
        const lang = this.currentLanguage;
        return translations[lang] && translations[lang][key] 
            ? translations[lang][key] 
            : key;
    }
}


/**
 * ========================================
 * NUMBER COUNTER ANIMATION
 * ========================================
 */

class NumberCounter {
    constructor() {
        this.init();
    }

    init() {
        this.observeCounters();
    }

    observeCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    startCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

/**
 * ========================================
 * AUTHENTICATION SYSTEM
 * ========================================
 */

class AuthManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
    }

    /**
     * Load users from LocalStorage
     */
    loadUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    /**
     * Load current logged in user
     */
    loadCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Save users to LocalStorage
     */
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    /**
     * Register new user
     */
    register(fullName, email, phone, password) {
        // Validate inputs
        if (!fullName || !email || !phone || !password) {
            return { success: false, message: 'All fields are required' };
        }

        // Check email format
        if (!this.isValidEmail(email)) {
            return { success: false, message: 'Invalid email format' };
        }

        // Check password length
        if (password.length < 8) {
            return { success: false, message: 'Password must be at least 8 characters' };
        }

        // Check if email already exists
        if (this.users.some(user => user.email === email)) {
            return { success: false, message: 'This email is already registered' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            fullName,
            email,
            phone,
            password: this.hashPassword(password),
            role: 'client',
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        return { success: true, message: 'Registration successful' };
    }

    /**
     * Login user
     */
    login(email, password) {
        const user = this.users.find(u => u.email === email);

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Save current user session
        const userSession = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        localStorage.setItem('currentUser', JSON.stringify(userSession));
        this.currentUser = userSession;

        return { success: true, message: 'Login successful', user: userSession };
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = '../pages/login.html';
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Simple password hashing (for demo purposes)
     */
    hashPassword(password) {
        return btoa(password); // Base64 encoding (not production-safe)
    }

    /**
     * Add admin user (for demo)
     */
    addAdminUser() {
        // Check if admin already exists
        if (this.users.some(user => user.email === 'admin@finpro.com')) {
            return;
        }

        const admin = {
            id: 1,
            fullName: 'Admin User',
            email: 'admin@finpro.com',
            phone: '+966501234567',
            password: this.hashPassword('admin123'),
            role: 'admin',
            createdAt: new Date().toISOString()
        };

        this.users.push(admin);
        this.saveUsers();
    }
}

/**
 * ========================================
 * FORM VALIDATION
 * ========================================
 */

class FormValidator {
    constructor(form, langManager) {
        this.form = form;
        this.langManager = langManager;
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.validateForm(e));
            this.setupLiveValidation();
        }
    }

    validateForm(e) {
        e.preventDefault();
        
        if (this.isFormValid()) {
            this.form.submit();
        }
    }

    isFormValid() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('[required]');

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (input.type === 'email') {
            isValid = this.isValidEmail(value);
            errorMessage = 'errorEmailInvalid';
        } else if (input.type === 'password') {
            isValid = value.length >= 8;
            errorMessage = 'errorPasswordMinLength';
        } else if (input.type === 'tel') {
            isValid = /^[0-9\s\-\+\(\)]{8,}$/.test(value);
            errorMessage = 'errorPhoneInvalid';
        } else if (input.type === 'text') {
            isValid = value.length > 0;
            errorMessage = 'errorNameRequired';
        }

        this.updateInputStatus(input, isValid, errorMessage);
        return isValid;
    }

    updateInputStatus(input, isValid, errorMessage) {
        const feedback = input.nextElementSibling;

        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.remove();
            }
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            
            if (!feedback || !feedback.classList.contains('invalid-feedback')) {
                const error = document.createElement('div');
                error.className = 'invalid-feedback';
                error.textContent = this.langManager.translate(errorMessage);
                input.parentNode.insertBefore(error, input.nextSibling);
            } else {
                feedback.textContent = this.langManager.translate(errorMessage);
            }
        }
    }

    setupLiveValidation() {
        const inputs = this.form.querySelectorAll('[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('change', () => this.validateInput(input));
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * ========================================
 * SMOOTH SCROLL
 * ========================================
 */

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

/**
 * ========================================
 * APP INITIALIZATION
 * ========================================
 */

// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize Language Manager
//     const langManager = new LanguageManager();
    
//     // Initialize Number Counters
//     new NumberCounter();
    
//     // Initialize Auth Manager and add demo admin
//     // const authManager = new AuthManager();
//     // authManager.addAdminUser();
//     window.authManager = new AuthManager();
//     window.authManager.addAdminUser();
//     // Initialize Form Validator on pages with forms
//     const forms = document.querySelectorAll('form');
//     forms.forEach(form => new FormValidator(form, langManager));
    
//     // Initialize Smooth Scroll
//     new SmoothScroll();
    
//     // Make auth manager globally accessible
//     window.authManager = authManager;
//     window.langManager = langManager;
// });
document.addEventListener('DOMContentLoaded', function() {

    // Initialize Language Manager
    window.langManager = new LanguageManager();

    // Initialize Number Counters
    new NumberCounter();

    // Initialize Auth Manager
    window.authManager = new AuthManager();
    window.authManager.addAdminUser();

    // Initialize Form Validator
    const forms = document.querySelectorAll('form');
    forms.forEach(form => new FormValidator(form, window.langManager));

    // Initialize Smooth Scroll
    new SmoothScroll();

});