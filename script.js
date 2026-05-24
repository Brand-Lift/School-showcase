/**
 * Pinecrest Academy Portal Scripts
 */

// [1] STICKY HEADER SCROLL CLASS
function initHeader() {
    const mainHeader = document.getElementById('mainHeader');
    if (!mainHeader) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });
}

// [2] MOBILE OVERLAY NAVIGATION SYSTEM
function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!hamburgerBtn || !mobileMenu || !mobileMenuClose) return;

    function openMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Stagger nav links slide in animation
        mobileNavLinks.forEach((link, idx) => {
            link.style.transitionDelay = `${0.1 + (idx * 0.05)}s`;
        });
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        mobileNavLinks.forEach((link) => {
            link.style.transitionDelay = '0s';
        });
    }

    hamburgerBtn.addEventListener('click', openMenu);
    mobileMenuClose.addEventListener('click', closeMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close when clicking overlay backdrop directly
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    // Support keyboard escape key to exit
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// [3] AUTO SCROLLING HERO SLIDER
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const sliderContainer = document.getElementById('hero');

    if (slides.length === 0) return;

    let currentIdx = 0;
    let timer = null;
    const intervalDuration = 4500; // 4.5 seconds

    function updateActiveSlide(targetIdx) {
        if (targetIdx >= slides.length) targetIdx = 0;
        if (targetIdx < 0) targetIdx = slides.length - 1;

        currentIdx = targetIdx;

        slides.forEach((slide, idx) => {
            if (idx === currentIdx) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        dots.forEach((dot, idx) => {
            if (idx === currentIdx) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function autoAdvance() {
        updateActiveSlide(currentIdx + 1);
    }

    function startTimer() {
        stopTimer();
        timer = setInterval(autoAdvance, intervalDuration);
    }

    function stopTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
}    // Setup listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            updateActiveSlide(currentIdx + 1);
            startTimer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            updateActiveSlide(currentIdx - 1);
            startTimer();
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            updateActiveSlide(index);
            startTimer();
        });
    });

    // Pause auto advance when hovering hero area
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopTimer);
        sliderContainer.addEventListener('mouseleave', startTimer);
    }

    // Touch events swipe logic for mobile layouts
    let startX = 0;
    let endX = 0;

    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const threshold = 50;
        if (endX < startX - threshold) {
            updateActiveSlide(currentIdx + 1);
            startTimer();
        } else if (endX > startX + threshold) {
            updateActiveSlide(currentIdx - 1);
            startTimer();
        }
    }

    startTimer();
}

// [4] INTERSECTION OBSERVER FOR SCROLL REVEAL ELEMENTS
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(elem => {
        revealObserver.observe(elem);
    });
}

// [5] HIGH-LIGHT ACTIVE NAVIGATION ELEMENT
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.offsetHeight;
            
            if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// [6] SMOOTH PORTAL ANCHOR ROUTING
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const headerOffset = 76;

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();

            if (targetId === '#top' || targetId === '#hero') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}// [7] SCROLL BACK TO TOP MECHANIC
function initBackToTop() {
    const bttBtn = document.getElementById('backToTopBtn');
    if (!bttBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            bttBtn.classList.add('visible');
        } else {
            bttBtn.classList.remove('visible');
        }
    });

    bttBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// [8] STAT COUNTER ANIMATION ENGINE
function initCountUp() {
    const statsSection = document.querySelector('.trust-stats-bar');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (!statsSection || statNumbers.length === 0) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                statNumbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target'));
                    animateValue(num, 0, target, 2000);
                });
                animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.35 });

    observer.observe(statsSection);

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = Math.floor(progress * (end - start) + start);
            
            if (end === 1500) {
                obj.innerText = `${currentVal}+`;
            } else if (end === 75) {
                obj.innerText = `${currentVal}+`;
            } else if (end === 25) {
                obj.innerText = `${currentVal}+`;
            } else if (end === 100) {
                obj.innerText = `${currentVal}%`;
            } else {
                obj.innerText = currentVal;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// [9] INTERACTIVE FAQ ACCORDIONS
function initFAQAccordion() {
    const triggers = document.querySelectorAll('.accordion-trigger');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const item = this.parentElement;
            const panel = this.nextElementSibling;
            const isOpen = item.classList.contains('active');

            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.accordion-panel').style.maxHeight = null;
                }
            });

            if (isOpen) {
                item.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                panel.style.maxHeight = null;
            } else {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });
}

// [10] WHATSAPP ENQUIRY SYSTEM SUBMISSION HANDLER
function submitAdmission() {
    const fStudentName = document.getElementById('fStudentName');
    const fParentName = document.getElementById('fParentName');
    const fMobile = document.getElementById('fMobile');
    const fClass = document.getElementById('fClass');
    const fExtra = document.getElementById('fExtra');
    const fMsg = document.getElementById('fMsg');

    let hasErrors = false;

    if (!fStudentName.value.trim()) {
        showError(fStudentName, 'errStudentName');
        hasErrors = true;
    } else {
        clearError(fStudentName, 'errStudentName');
    }

    if (!fParentName.value.trim()) {
        showError(fParentName, 'errParentName');
        hasErrors = true;
    } else {
        clearError(fParentName, 'errParentName');
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!fMobile.value.trim() || !mobileRegex.test(fMobile.value.trim().replace(/\D/g, ''))) {
        showError(fMobile, 'errMobile');
        hasErrors = true;
    } else {
        clearError(fMobile, 'errMobile');
    }

    if (!fClass.value) {
        showError(fClass, 'errClass');
        hasErrors = true;
    } else {
        clearError(fClass, 'errClass');
    }

    if (hasErrors) return;    const targetWhatsApp = "919876543210"; 
    
    let messageBody = `Hello, I want to enquire about admission.\n\n`;
    messageBody += `*Student Name:* ${fStudentName.value.trim()}\n`;
    messageBody += `*Parent/Guardian Name:* ${fParentName.value.trim()}\n`;
    messageBody += `*WhatsApp Mobile:* ${fMobile.value.trim()}\n`;
    messageBody += `*Grade/Class Applied:* ${fClass.value}\n`;
    
    if (fExtra.value.trim()) {
        messageBody += `*Previous Academy:* ${fExtra.value.trim()}\n`;
    }
    
    if (fMsg.value.trim()) {
        messageBody += `*Message Details:* ${fMsg.value.trim()}\n`;
    }

    const encodedMessage = encodeURIComponent(messageBody);
    const apiURL = `https://wa.me/${targetWhatsApp}?text=${encodedMessage}`;

    window.open(apiURL, '_blank', 'noopener,noreferrer');

    clearErrors(
        [fStudentName, fParentName, fMobile, fClass, fExtra, fMsg],
        ['errStudentName', 'errParentName', 'errMobile', 'errClass']
    );

    showToast('Enquiry successfully dispatched!', 'success');
}

// [11] INPUT FIELD ERROR VISUAL STATE DISPLAY
function showError(fieldElement, errorSpanId) {
    if (!fieldElement) return;
    fieldElement.classList.add('error');
    
    const errorSpan = document.getElementById(errorSpanId);
    if (errorSpan) {
        errorSpan.style.display = 'block';
    }
}

// [12] INPUT FIELD ERROR STATE DISMISSAL
function clearError(fieldElement, errorSpanId) {
    if (!fieldElement) return;
    fieldElement.classList.remove('error');
    
    const errorSpan = document.getElementById(errorSpanId);
    if (errorSpan) {
        errorSpan.style.display = 'none';
    }
}

// [13] BULK ERROR RESTORATION DESK
function clearErrors(fieldArray, errorSpanArray) {
    fieldArray.forEach(field => {
        if (field) {
            field.value = '';
            field.classList.remove('error');
        }
    });

    errorSpanArray.forEach(spanId => {
        const errorSpan = document.getElementById(spanId);
        if (errorSpan) {
            errorSpan.style.display = 'none';
        }
    });
}

// [14] CUSTOM FLOATING ALERT BAR TOAST DISPATCHER
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toastElement = document.createElement('div');
    toastElement.className = `toast-alert ${type}`;
    
    toastElement.innerHTML = `
        <svg style="width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toastElement);

    setTimeout(() => {
        toastElement.style.opacity = '0';
        toastElement.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
            toastElement.remove();
        }, 400);
    }, 3500);
}

// [15] REALTIME TYPING LIVE VALIDATION REPAIR MECHANISM
function initLiveValidation() {
    const fStudentName = document.getElementById('fStudentName');
    const fParentName = document.getElementById('fParentName');
    const fMobile = document.getElementById('fMobile');
    const fClass = document.getElementById('fClass');

    if (fStudentName) {
        fStudentName.addEventListener('input', () => {
            if (fStudentName.value.trim()) clearError(fStudentName, 'errStudentName');
        });
    }

    if (fParentName) {
        fParentName.addEventListener('input', () => {
            if (fParentName.value.trim()) clearError(fParentName, 'errParentName');
        });
    }

    if (fMobile) {
        fMobile.addEventListener('input', () => {
            const mobileRegex = /^[0-9]{10}$/;
            if (mobileRegex.test(fMobile.value.trim().replace(/\D/g, ''))) {
                clearError(fMobile, 'errMobile');
            }
        });
    }

    if (fClass) {
        fClass.addEventListener('change', () => {
            if (fClass.value) clearError(fClass, 'errClass');
        });
    }
}

// [16] CENTRAL PROCESS DOM EXECUTION GATEWAY
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initHeroSlider();
    initScrollReveal();
    initActiveNav();
    initSmoothScroll();
    initBackToTop();
    initCountUp();
    initFAQAccordion();
    initLiveValidation();
});
