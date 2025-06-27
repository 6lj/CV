// تعريف النصوص لكل لغة بناءً على سمات data-translate
const translations = {
    en: {
        welcome: "Welcome!",
        choose_name: "Please choose how you'd like to appear in the viewers list:",
        enter_name: "Enter your name (optional)",
        submit_name: "Submit Name",
        stay_anonymous: "Stay Anonymous"
    },
    ar: {
        welcome: "مرحبًا!",
        choose_name: "اللغة العربية ليست مدعومة ولكنننا مازلنا نعمل عليها  ",
        enter_name: "أدخل اسمك (اختياري)",
        submit_name: "إرسال الاسم",
        stay_anonymous: "البقاء مجهولاً"
    }
};

// تعيين اللغة الافتراضية إلى الإنجليزية
let currentLanguage = 'en';

function changeLanguage(lang) {
    currentLanguage = lang;

    // تحديث النصوص بناءً على سمات data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // تحديث النصوص في placeholder بناءً على data-translate-placeholder
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // تحديث حالة أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        btn.classList.toggle('active', btnLang === lang);
    });

    // تغيير اتجاه النص بناءً على اللغة
    if (lang === 'ar') {
        document.body.setAttribute('dir', 'rtl');
        if (document.querySelector('.modal-content')) {
            document.querySelector('.modal-content').style.textAlign = 'right';
        }
    } else {
        document.body.setAttribute('dir', 'ltr');
        if (document.querySelector('.modal-content')) {
            document.querySelector('.modal-content').style.textAlign = 'center';
        }
    }
}

// تعيين اللغة الإنجليزية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage('en');
    document.getElementById('viewerModal').style.display = 'flex';

    // إعداد أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
});