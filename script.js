/* ============================================
   SR Evenntss - Multi-Page JavaScript
   Premium Event Management Website
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== Preloader =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('hidden'), 1500);
        setTimeout(() => preloader.classList.add('hidden'), 3000);
    }

    // ===== Initialize AOS =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
            disable: window.innerWidth < 768 ? 'mobile' : false
        });
    } else {
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // ===== Navbar Scroll =====
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 400);
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ===== Mobile Navigation =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navMenu.querySelectorAll('a').forEach(link => {
            if (link.closest('.nav-item-dropdown') === link.parentElement) return;
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        navMenu.querySelectorAll('.nav-item-dropdown > .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== Services Filter (Services Page) =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    if (filterBtns.length && serviceCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                serviceCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ===== Portfolio Filter =====
    const portfolioBtns = document.querySelectorAll('.filter-btn[data-pfilter]');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (portfolioBtns.length && portfolioItems.length) {
        portfolioBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                portfolioBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.pfilter;
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ===== Gallery Lightbox =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentGalleryIndex = 0;

    if (lightbox && galleryItems.length) {
        function openLightbox(index) {
            currentGalleryIndex = index;
            const src = galleryItems[index].querySelector('img').src;
            lightboxImg.src = src.replace('w=600', 'w=1200');
            lightboxImg.alt = galleryItems[index].querySelector('img').alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.querySelector('.lightbox-prev')?.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox((currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length);
        });
        document.querySelector('.lightbox-next')?.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox((currentGalleryIndex + 1) % galleryItems.length);
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev')?.click();
            if (e.key === 'ArrowRight') document.querySelector('.lightbox-next')?.click();
        });
    }

    // ===== Testimonial Slider =====
    const testimonialTrack = document.getElementById('testimonialTrack');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let testimonialIndex = 0;
    let testimonialAutoPlay;

    if (testimonialTrack && testimonialCards.length) {
        function getPerView() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        function updateTestimonial() {
            const perView = getPerView();
            testimonialIndex = Math.min(testimonialIndex, Math.max(0, testimonialCards.length - perView));
            const cardWidth = testimonialCards[0].offsetWidth + 24;
            testimonialTrack.style.transform = `translateX(-${testimonialIndex * cardWidth}px)`;
        }

        prevBtn?.addEventListener('click', () => {
            if (testimonialIndex > 0) testimonialIndex--;
            updateTestimonial();
            resetAutoPlay();
        });

        nextBtn?.addEventListener('click', () => {
            const maxIdx = Math.max(0, testimonialCards.length - getPerView());
            if (testimonialIndex < maxIdx) testimonialIndex++;
            updateTestimonial();
            resetAutoPlay();
        });

        function startAutoPlay() {
            testimonialAutoPlay = setInterval(() => {
                const maxIdx = Math.max(0, testimonialCards.length - getPerView());
                testimonialIndex = testimonialIndex >= maxIdx ? 0 : testimonialIndex + 1;
                updateTestimonial();
            }, 5000);
        }

        function resetAutoPlay() {
            clearInterval(testimonialAutoPlay);
            startAutoPlay();
        }

        startAutoPlay();

        let touchStart = 0;
        testimonialTrack.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].screenX; }, { passive: true });
        testimonialTrack.addEventListener('touchend', e => {
            const diff = touchStart - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) diff > 0 ? nextBtn?.click() : prevBtn?.click();
        }, { passive: true });
    }

    // ===== FAQ Accordion =====
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ===== Counter Animation =====
    function animateCounters() {
        document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
            if (counter.dataset.animated) return;
            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                counter.dataset.animated = 'true';
                const target = parseInt(counter.dataset.count);
                const duration = 2000;
                const startTime = performance.now();
                function tick(now) {
                    const progress = Math.min((now - startTime) / duration, 1);
                    counter.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target).toLocaleString();
                    if (progress < 1) requestAnimationFrame(tick);
                    else counter.textContent = target.toLocaleString();
                }
                requestAnimationFrame(tick);
            }
        });
    }
    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();

    // ===== Hero Slider (Home Page) =====
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    if (heroSlides.length) {
        let currentSlide = 0;
        let slideInterval;

        function goToSlide(index) {
            heroSlides[currentSlide].classList.remove('active');
            sliderDots[currentSlide]?.classList.remove('active');
            currentSlide = index;
            heroSlides[currentSlide].classList.add('active');
            sliderDots[currentSlide]?.classList.add('active');
        }

        function nextSlide() { goToSlide((currentSlide + 1) % heroSlides.length); }
        function startSlider() { slideInterval = setInterval(nextSlide, 5000); }
        function stopSlider() { clearInterval(slideInterval); }

        sliderDots.forEach((dot, i) => {
            dot.addEventListener('click', () => { stopSlider(); goToSlide(i); startSlider(); });
        });

        startSlider();

        let touchStartX = 0;
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
            heroSection.addEventListener('touchend', e => {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 50) {
                    stopSlider();
                    goToSlide(diff > 0 ? (currentSlide + 1) % heroSlides.length : (currentSlide - 1 + heroSlides.length) % heroSlides.length);
                    startSlider();
                }
            }, { passive: true });
        }
    }

    // ===== Hero Particles =====
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            const size = Math.random() * 4 + 1;
            p.style.width = p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 10 + 8) + 's';
            p.style.animationDelay = Math.random() * 5 + 's';
            heroParticles.appendChild(p);
        }
    }

    // ===== Contact Form =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(contactForm);
            const get = (k) => fd.get(k) || '';

            let msg = `Hello SR Evenntss!\n\n`;
            msg += `I would like to enquire about your event services.\n\n`;
            msg += `Name: ${get('name')}\n`;
            msg += `Phone: ${get('phone')}\n`;
            msg += `Email: ${get('email')}\n`;
            if (get('eventType')) msg += `Event Type: ${get('eventType')}\n`;
            if (get('eventDate')) msg += `Event Date: ${get('eventDate')}\n`;
            if (get('guestCount')) msg += `Guest Count: ${get('guestCount')}\n`;
            if (get('budget')) msg += `Budget: ${get('budget')}\n`;
            if (get('location')) msg += `Location: ${get('location')}\n`;
            msg += `\nMessage: ${get('message')}`;

            window.open(`https://wa.me/919381580308?text=${encodeURIComponent(msg)}`, '_blank');

            const btn = contactForm.querySelector('.btn-submit');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> <span>Sent!</span>';
            btn.style.background = '#25d366';
            setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; contactForm.reset(); }, 3000);
        });
    }

    // ===== Back to Top =====
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Portfolio View Lightbox =====
    document.querySelectorAll('.portfolio-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = btn.closest('.portfolio-item');
            const src = item.querySelector('img').src.replace('w=800', 'w=1400');
            const alt = item.querySelector('img').alt;
            let pLb = document.getElementById('portfolioLightbox');
            if (!pLb) {
                pLb = document.createElement('div');
                pLb.id = 'portfolioLightbox';
                pLb.className = 'lightbox';
                pLb.innerHTML = `<button class="lightbox-close" aria-label="Close">&times;</button><img src="" alt="">`;
                document.body.appendChild(pLb);
                pLb.querySelector('.lightbox-close').addEventListener('click', () => { pLb.classList.remove('active'); document.body.style.overflow = ''; });
                pLb.addEventListener('click', (e) => { if (e.target === pLb) { pLb.classList.remove('active'); document.body.style.overflow = ''; } });
            }
            const img = pLb.querySelector('img');
            img.src = src;
            img.alt = alt;
            pLb.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // ===== Footer Year =====
    const yearEl = document.querySelector('.footer-bottom p');
    if (yearEl) yearEl.innerHTML = yearEl.innerHTML.replace('2024', new Date().getFullYear());

    console.log('%c SR Evenntss %c Premium Event Management ',
        'background: #d4af37; color: #0f0f0f; font-weight: bold; padding: 5px 10px; border-radius: 4px 0 0 4px;',
        'background: #1a1a1a; color: #d4af37; padding: 5px 10px; border-radius: 0 4px 4px 0;');
});